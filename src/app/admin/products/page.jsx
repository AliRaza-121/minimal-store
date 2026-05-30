'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import Image from 'next/image'

const categories = ['Men', 'Women', 'Accessories', 'Home']

const emptyForm = {
  name: '',
  price: '',
  category: 'Men',
  badge: '',
  description: '',
  sizes: '',
  colors: '',
  details: '',
  featured: false,
  trending: false,
  image: '',
  hoverImage: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const [categoriesList, setCategoriesList] = useState([])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterCategory !== 'All') params.append('category', filterCategory)
      if (searchTerm) params.append('search', searchTerm)

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      if (data.success) setProducts(data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [filterCategory, searchTerm])
  
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategoriesList(data.categories.filter(c => c.status === 'active'))
        }
      })
  }, [])

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      badge: product.badge || '',
      description: product.description,
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      details: product.details.join(', '),
      featured: product.featured,
      trending: product.trending || false,
      image: product.image || '',
      hoverImage: product.hoverImage || '',
    })
    setEditingId(product._id)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const [uploadingHover, setUploadingHover] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setForm({ ...form, image: data.url })
      } else {
        toast('Upload failed', 'error')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleHoverImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingHover(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setForm({ ...form, hoverImage: data.url })
      } else {
        toast('Hover image upload failed', 'error')
      }
    } catch (error) {
      console.error('Hover image upload failed:', error)
      toast('Hover image upload failed', 'error')
    } finally {
      setUploadingHover(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const body = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      badge: form.badge || null,
      description: form.description,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
      details: form.details.split(',').map(s => s.trim()).filter(Boolean),
      featured: form.featured,
      trending: form.trending,
      image: form.image,
      hoverImage: form.hoverImage,
    }

    const url = editingId ? `/api/products/${editingId}` : '/api/products'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (data.success) {
      toast(editingId ? 'Product updated' : 'Product created', 'success')
      closeModal()
      fetchProducts()
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast('Product deleted', 'success')
      fetchProducts()
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-light text-light tracking-wide">Inventory Ledger</h1>
          <p className="text-muted text-xs tracking-widest uppercase mt-3">
            {products.length} Item{products.length !== 1 ? 's' : ''} Documented
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="px-6 py-3 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.2)]"
        >
          + Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 sm:max-w-md group">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border text-light text-sm font-light pl-12 pr-4 py-3 focus:outline-none focus:border-gold/50 transition-all duration-300 group-hover:border-dark-border/80"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-gold transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase font-light transition-all duration-300 border
                ${filterCategory === cat
                  ? 'bg-gold border-gold text-dark-bg shadow-[0_0_10px_rgba(201,168,76,0.2)]'
                  : 'text-muted border-dark-border hover:border-gold/40 hover:text-light bg-dark-card'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-dark-card border border-dark-border overflow-hidden"
      >
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-dark-border border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-4 px-6 sm:px-8 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20">Product</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium hidden sm:table-cell border-b border-dark-border bg-dark-bg/20">Category</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20">Price</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium hidden lg:table-cell border-b border-dark-border bg-dark-bg/20">Badge</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium hidden lg:table-cell border-b border-dark-border bg-dark-bg/20 text-center">Featured</th>
                  <th className="py-4 px-6 sm:px-8 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted text-sm font-light">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product._id} className="group hover:bg-dark-bg/40 transition-colors">
                      <td className={`py-4 px-6 sm:px-8 border-dark-border/40 ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-dark-bg border border-dark-border flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-gold/30 transition-colors">
                            {product.image ? (
                              <Image 
                                src={product.image.replace('/upload/', '/upload/w_100,f_auto,q_auto/')} 
                                alt={product.name} 
                                fill
                                sizes="100px"
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                            ) : (
                              <span className="text-gold/20 text-xs">✦</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm text-light font-light truncate block max-w-[120px] sm:max-w-[250px] group-hover:text-gold transition-colors">{product.name}</span>
                            <span className="text-[10px] text-muted sm:hidden mt-1 block">{product.category} · Rs. {product.price}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 hidden sm:table-cell border-dark-border/40 ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        <span className="text-[10px] tracking-widest uppercase text-muted font-light">{product.category}</span>
                      </td>
                      <td className={`py-4 px-6 border-dark-border/40 ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        <span className="text-sm text-light font-light whitespace-nowrap">Rs. {product.price.toLocaleString()}</span>
                      </td>
                      <td className={`py-4 px-6 hidden lg:table-cell border-dark-border/40 ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        {product.badge ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              product.badge === 'New' ? 'bg-blue-400' :
                              product.badge === 'Bestseller' ? 'bg-yellow-400' :
                              'bg-purple-400'
                            }`} />
                            <span className="text-[10px] tracking-widest uppercase text-muted">
                              {product.badge}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted/30">—</span>
                        )}
                      </td>
                      <td className={`py-4 px-6 hidden lg:table-cell border-dark-border/40 text-center ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        {product.featured ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-dark-border mx-auto" />
                        )}
                      </td>
                      <td className={`py-4 px-6 sm:px-8 border-dark-border/40 text-right ${index !== products.length - 1 ? 'border-b' : ''}`}>
                        <div className="flex items-center justify-end gap-3 sm:gap-4">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-[10px] tracking-widest uppercase text-muted hover:text-gold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-[10px] tracking-widest uppercase text-muted hover:text-red-400 transition-colors"
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <div className="bg-dark-card border border-dark-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-10 bg-dark-card/90 backdrop-blur-md border-b border-dark-border px-8 py-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm text-light tracking-widest uppercase font-medium">
                      {editingId ? 'Edit Asset' : 'Register New Asset'}
                    </h2>
                    <p className="text-[10px] text-muted tracking-widest uppercase mt-1">Inventory Management</p>
                  </div>
                  <button onClick={closeModal} className="text-muted hover:text-light transition-colors p-2 hover:bg-dark-bg rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Price (Rs.) *</label>
                      <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Category</label>
                      <div className="relative">
                        <select name="category" value={form.category} onChange={handleChange}
                          className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 appearance-none focus:outline-none focus:border-gold/50 transition-colors">
                          {categoriesList.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Badge</label>
                      <div className="relative">
                        <select name="badge" value={form.badge} onChange={handleChange}
                          className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 appearance-none focus:outline-none focus:border-gold/50 transition-colors">
                          <option value="">None</option>
                          <option value="New">New</option>
                          <option value="Bestseller">Bestseller</option>
                          <option value="Limited">Limited</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] text-muted tracking-widest uppercase">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                      className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-muted tracking-widest uppercase">
                      Asset Media {!editingId && <span className="text-gold">*</span>}
                    </label>
                    <div className="border-2 border-dashed border-dark-border hover:border-gold/30 transition-colors bg-dark-bg p-6 flex flex-col items-center justify-center relative min-h-[120px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      {!form.image && !uploading && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto text-muted mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                          <span className="text-xs text-muted tracking-widest uppercase font-light">Click or Drag Image Here</span>
                        </div>
                      )}

                      {uploading && (
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 border-2 border-dark-border border-t-gold rounded-full animate-spin mb-2" />
                          <span className="text-[10px] text-gold tracking-widest uppercase">Uploading...</span>
                        </div>
                      )}

                      {form.image && !uploading && (
                        <div className="relative w-32 h-32 border border-dark-border z-20">
                          <Image 
                            src={form.image.replace('/upload/', '/upload/w_200,f_auto,q_auto/')} 
                            alt="Preview" 
                            fill
                            sizes="200px"
                            className="object-cover" 
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setForm({ ...form, image: '' }) }}
                            className="absolute -top-2 -right-2 bg-dark-bg border border-dark-border text-muted hover:text-red-400 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Image Upload */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-muted tracking-widest uppercase">
                      Hover Image <span className="lowercase normal-case opacity-50">(shown on mouse hover)</span>
                    </label>
                    <div className="border-2 border-dashed border-dark-border hover:border-gold/30 transition-colors bg-dark-bg p-6 flex flex-col items-center justify-center relative min-h-[120px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHoverImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      {!form.hoverImage && !uploadingHover && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto text-muted mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                          <span className="text-xs text-muted tracking-widest uppercase font-light">Click to Upload Hover Image</span>
                        </div>
                      )}

                      {uploadingHover && (
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 border-2 border-dark-border border-t-gold rounded-full animate-spin mb-2" />
                          <span className="text-[10px] text-gold tracking-widest uppercase">Uploading...</span>
                        </div>
                      )}

                      {form.hoverImage && !uploadingHover && (
                        <div className="relative w-32 h-32 border border-dark-border z-20">
                          <Image 
                            src={form.hoverImage.replace('/upload/', '/upload/w_200,f_auto,q_auto/')} 
                            alt="Hover Preview" 
                            fill
                            sizes="200px"
                            className="object-cover" 
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setForm({ ...form, hoverImage: '' }) }}
                            className="absolute -top-2 -right-2 bg-dark-bg border border-dark-border text-muted hover:text-red-400 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-dark-border">
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Sizes <span className="lowercase normal-case opacity-50">(comma sep)</span></label>
                      <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Colors <span className="lowercase normal-case opacity-50">(comma sep)</span></label>
                      <input name="colors" value={form.colors} onChange={handleChange} placeholder="Black, White"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-muted tracking-widest uppercase">Details <span className="lowercase normal-case opacity-50">(comma sep)</span></label>
                      <input name="details" value={form.details} onChange={handleChange} placeholder="100% Cotton"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${form.featured ? 'bg-gold border-gold' : 'border-dark-border bg-dark-bg group-hover:border-gold/50'}`}>
                        {form.featured && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-dark-bg"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                      </div>
                      <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="hidden" />
                      <span className="text-sm text-light font-light tracking-wide">Featured</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${form.trending ? 'bg-gold border-gold' : 'border-dark-border bg-dark-bg group-hover:border-gold/50'}`}>
                        {form.trending && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-dark-bg"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                      </div>
                      <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="hidden" />
                      <span className="text-sm text-light font-light tracking-wide">Trending (Top 5)</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-dark-border">
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                      {editingId ? 'Update Asset' : 'Confirm Registration'}
                    </motion.button>
                    <button type="button" onClick={closeModal}
                      className="px-8 py-3 border border-dark-border text-xs text-muted tracking-widest uppercase font-light hover:text-light hover:bg-dark-bg transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}