'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/context/ToastContext'


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
  image: '',
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
      image: product.image || '',
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
      image: form.image,
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-light">Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="px-5 py-2.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors"
        >
          + Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border text-light text-sm font-light pl-10 pr-4 py-2 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase font-light transition-all
                ${filterCategory === cat
                  ? 'bg-gold text-dark-bg'
                  : 'text-muted hover:text-light border border-dark-border'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse h-14 bg-dark-card border border-dark-border" />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Product</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Category</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Price</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Badge</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Featured</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted text-sm font-light">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-dark-bg border border-dark-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.image ? (
                             <img 
  src={product.image ? product.image.replace('/upload/', '/upload/w_600,f_auto,q_auto/') : ''} 
  alt={product.name} 
  className="w-full h-full object-cover" 
/>
                            ) : (
                              <span className="text-gold/30 text-xs">✦</span>
                            )}
                          </div>
                          <span className="text-sm text-light font-light truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-muted font-light">{product.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gold font-light">Rs. {product.price}</span>
                      </td>
                      <td className="py-3 px-4">
                        {product.badge ? (
                          <span className="text-[10px] tracking-widest uppercase bg-gold/10 text-gold px-2 py-0.5 font-medium">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-xs text-muted/40">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {product.featured ? (
                          <span className="text-emerald-400 text-xs">●</span>
                        ) : (
                          <span className="text-muted/30 text-xs">○</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-xs text-muted hover:text-light tracking-wide transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-xs text-muted hover:text-red-400 tracking-wide transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-card border border-dark-border w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 flex items-center justify-between">
                  <h2 className="text-sm text-light tracking-widest uppercase font-medium">
                    {editingId ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <button onClick={closeModal} className="text-muted hover:text-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Price *</label>
                      <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Category</label>
                      <select name="category" value={form.category} onChange={handleChange}
  className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors">
  {categoriesList.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
</select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Badge</label>
                      <select name="badge" value={form.badge} onChange={handleChange}
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors">
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Bestseller">Bestseller</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                      className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">
  Product Image {!editingId && <span className="text-gold">*</span>}
</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-dark-bg border border-dark-border text-muted text-sm font-light px-3 py-2 file:mr-3 file:py-1 file:px-3 file:bg-gold file:text-dark-bg file:text-xs file:border-0 file:cursor-pointer file:tracking-widest file:uppercase"
                    />
                    {uploading && <p className="text-xs text-gold mt-1">Uploading...</p>}
                    {form.image && (
                      <div className="mt-2 relative inline-block">
                        <img 
  src={product.image ? product.image.replace('/upload/', '/upload/w_600,f_auto,q_auto/') : ''} 
  alt={product.name} 
  className="w-full h-full object-cover" 
/>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, image: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Sizes (comma separated)</label>
                      <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Colors (comma separated)</label>
                      <input name="colors" value={form.colors} onChange={handleChange} placeholder="Black, White, Sand"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Details (comma separated)</label>
                      <input name="details" value={form.details} onChange={handleChange} placeholder="100% linen, Made in Italy"
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                      className="accent-gold w-4 h-4" />
                    <span className="text-sm text-muted font-light">Featured product</span>
                  </label>

                  <div className="flex gap-3 pt-2">
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors">
                      {editingId ? 'Update' : 'Create'}
                    </motion.button>
                    <button type="button" onClick={closeModal}
                      className="px-6 py-2.5 border border-dark-border text-xs text-muted tracking-widest uppercase font-light hover:text-light transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}