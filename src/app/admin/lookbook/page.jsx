'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import Image from 'next/image'

const emptyForm = {
  title: '',
  subtitle: '',
  image: '',
  link: '/shop',
  position: 0,
  active: true,
}

export default function AdminLookbook() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lookbook')
      const data = await res.json()
      if (data.success) setItems(data.lookbook)
    } catch (error) {
      console.error('Failed to fetch lookbook:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchItems() 
    fetch('/api/categories').then(res => res.json()).then(data => {
      if (data.success) {
        const activeCats = data.categories.filter(c => c.status === 'active')
        setCategories(activeCats)
      }
    }).catch(console.error)
  }, [])

  const openAdd = () => {
    setForm({ ...emptyForm, position: items.length })
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setForm({
      title: item.title,
      subtitle: item.subtitle || '',
      image: item.image,
      link: item.link || '/shop',
      position: item.position,
      active: item.active,
    })
    setEditingId(item._id)
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

    if (!form.image) {
      toast('Please upload an image', 'error')
      return
    }

    const body = {
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      link: form.link,
      position: Number(form.position),
      active: form.active,
    }

    const url = editingId ? `/api/lookbook/${editingId}` : '/api/lookbook'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (data.success) {
      toast(editingId ? 'Lookbook item updated' : 'Lookbook item created', 'success')
      closeModal()
      fetchItems()
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

    const res = await fetch(`/api/lookbook/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      toast('Lookbook item deleted', 'success')
      fetchItems()
    }
  }

  const toggleActive = async (item) => {
    const res = await fetch(`/api/lookbook/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !item.active }),
    })
    const data = await res.json()
    if (data.success) {
      toast(`Item ${item.active ? 'hidden' : 'shown'}`, 'success')
      fetchItems()
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light text-light tracking-wide">Lookbook</h1>
          <p className="text-sm text-muted mt-1">Manage the images in your homepage lookbook section</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-gold text-dark-bg px-5 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors"
        >
          + Add Image
        </button>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dark-border bg-dark-card">
          <p className="text-muted text-lg font-light mb-2">No lookbook images yet</p>
          <p className="text-muted/60 text-sm mb-6">Add images to create your parallax lookbook on the homepage</p>
          <button
            onClick={openAdd}
            className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            Add your first image →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border border-dark-border bg-dark-card group relative ${!item.active ? 'opacity-50' : ''}`}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={item.image.replace('/upload/', '/upload/w_500,f_auto,q_auto/')}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium ${item.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {item.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {/* Position Badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium bg-dark-bg/80 text-gold border border-dark-border backdrop-blur-sm">
                    #{item.position + 1}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 border-t border-dark-border">
                <h3 className="text-sm text-light font-light tracking-wide mb-1">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-xs text-muted font-light mb-3 line-clamp-2">{item.subtitle}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 text-[10px] tracking-widest uppercase text-center py-2 border border-dark-border text-muted hover:text-light hover:border-gold/40 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className="flex-1 text-[10px] tracking-widest uppercase text-center py-2 border border-dark-border text-muted hover:text-light hover:border-gold/40 transition-colors"
                  >
                    {item.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="text-[10px] tracking-widest uppercase text-center py-2 px-3 border border-dark-border text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-card border border-dark-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-dark-border flex items-center justify-between">
                <h2 className="text-lg text-light font-light tracking-wide">
                  {editingId ? 'Edit Lookbook Image' : 'Add Lookbook Image'}
                </h2>
                <button onClick={closeModal} className="text-muted hover:text-light transition-colors">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs text-muted tracking-widest uppercase mb-2">Image *</label>
                  <div className="border border-dark-border border-dashed p-4 text-center relative">
                    {form.image ? (
                      <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto mb-3">
                        <Image
                          src={form.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')}
                          alt="Preview"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-muted/40 mx-auto mb-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5Z" />
                        </svg>
                        <p className="text-muted text-sm">Click to upload an image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-dark-bg/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs text-muted tracking-widest uppercase mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Evening Contrast"
                    className="w-full bg-dark-bg border border-dark-border text-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs text-muted tracking-widest uppercase mb-2">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Short description (optional)"
                    className="w-full bg-dark-bg border border-dark-border text-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-xs text-muted tracking-widest uppercase mb-2">Link to Category</label>
                  <select
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-dark-border text-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  >
                    <option value="/shop">Whole Shop Page (Default)</option>
                    {categories.map(c => (
                      <option key={c._id} value={`/shop?category=${encodeURIComponent(c.name)}`}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Position + Active */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted tracking-widest uppercase mb-2">Position</label>
                    <input
                      type="number"
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      min="0"
                      className="w-full bg-dark-bg border border-dark-border text-light px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="text-xs text-muted tracking-widest uppercase">Active</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gold text-dark-bg py-3 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {editingId ? 'Update Image' : 'Add Image'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
