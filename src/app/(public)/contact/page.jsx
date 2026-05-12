'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSent(false), 4000)
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-20">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Get in touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">Contact Us</h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6 mb-8" />
          <p className="text-muted text-lg font-light">Have a question? We&apos;d love to hear from you.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="space-y-8">
              <div>
                <h3 className="text-gold text-xs tracking-widest uppercase font-medium mb-2">Email</h3>
                <p className="text-muted text-sm font-light">aliraaza701@gmail.com</p>
              </div>
              <div>
                <h3 className="text-gold text-xs tracking-widest uppercase font-medium mb-2">Phone</h3>
                <p className="text-muted text-sm font-light">+92 324 1302639</p>
              </div>
              <div>
                <h3 className="text-gold text-xs tracking-widest uppercase font-medium mb-2">Address</h3>
                <p className="text-muted text-sm font-light">Faisalabad, Pakistan</p>
              </div>
              <div>
                <h3 className="text-gold text-xs tracking-widest uppercase font-medium mb-2">Hours</h3>
                <p className="text-muted text-sm font-light">
                  Monday – Friday: 9:00 AM – 6:00 PM PKT<br />
                  Saturday: 10:00 AM – 4:00 PM PKT
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/30 p-8 text-center">
                <p className="text-emerald-400 text-lg font-light">Message sent!</p>
                <p className="text-muted text-sm mt-2">We&apos;ll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                      className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                      className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required
                    className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5}
                    className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                </div>
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}