'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function HomeClient({ products }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')
  const [categoriesList, setCategoriesList] = useState(['All'])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const active = data.categories.filter(c => c.status === 'active').map(c => c.name)
          setCategoriesList(['All', ...active])
        }
      })
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleNewsletter = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
         <div className="absolute inset-0">
         <img 
  src="/hero-bg.jpg" 
  srcSet="/hero-bg.jpg 1200w"
  sizes="100vw"
  alt="Hero background" 
  className="w-full h-full object-cover"
  fetchPriority="high"
  loading="eager"
/>
  <div className="absolute inset-0 bg-dark-bg/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
</div>
          <div className="absolute inset-0 bg-dark-bg/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gold/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-dark-bg/80 blur-[80px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
            className="inline-block text-gold text-xs tracking-[0.4em] uppercase mb-8 font-light">
            New Collection 2026
          </motion.span>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-light leading-[1.05] mb-8">
            Timeless pieces<br />
            <span className="text-gold italic">for modern living</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
            className="text-muted text-sm sm:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10 px-4">
            Curated essentials designed with intention. Minimal aesthetics, maximum quality.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.7}
            className="flex items-center justify-center gap-5 flex-wrap">
            <Link href="/shop">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="px-8 sm:px-9 py-3.5 sm:py-4 bg-gold text-dark-bg text-xs sm:text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300">
                Shop Now
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button whileHover={{ x: 5 }}
                className="text-xs sm:text-sm text-muted hover:text-light tracking-widest uppercase font-light transition-colors duration-300 flex items-center gap-2">
                Explore <span className="text-gold">→</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-3 hidden z-50 sm:flex">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted/60">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-muted/20 flex items-start justify-center p-1.5">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* CATEGORY + SEARCH */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="py-10 px-6 border-b border-dark-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {categoriesList.map((cat) => (
              <motion.button key={cat} onClick={() => setActiveCategory(cat)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-light transition-all duration-300 ${activeCategory === cat ? 'bg-gold text-dark-bg' : 'text-muted hover:text-light border border-dark-border hover:border-muted/30'}`}>
                {cat}
              </motion.button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input type="text" placeholder="Search pieces..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-2.5 pl-10 placeholder:text-muted/50 focus:outline-none focus:border-gold/50 transition-colors tracking-wide" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-light transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 sm:py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Handpicked for you</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">Featured Pieces</h2>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Link href={`/shop/${product._id}`} className="group block">
                  <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden mb-4">
                    <div className="absolute inset-0">
                    {product.image ? (
  <img 
    src={product.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
    alt={product.name} 
    className="w-full h-full object-cover" 
    loading="lazy"
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-gold/30 text-2xl">✦</span>
  </div>
)}
                    </div>
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-gold text-dark-bg text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium">{product.badge}</span>
                    )}
                    <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-light text-xs tracking-widest uppercase border-b border-gold pb-1">View Details</span>
                    </div>
                  </div>
                  <p className="text-sm text-light font-light tracking-wide">{product.name}</p>
                  <p className="text-sm text-gold font-light mt-1">Rs. {product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-muted text-lg font-light">No pieces found.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchTerm('') }}
              className="text-gold text-sm tracking-widest uppercase mt-4 hover:text-gold-light transition-colors">Clear filters</button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-14">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold tracking-widest uppercase font-light transition-colors duration-300">
            View All Products <span className="text-gold">→</span>
          </Link>
        </motion.div>
      </section>

      {/* BRAND PROMISE BAR */}
      <section className="border-t border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {[
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>), title: 'Free Shipping', desc: 'Complimentary delivery on all orders over Rs. 150.' },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>), title: 'Secure Checkout', desc: '256-bit SSL encryption. Your data is always protected.' },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></svg>), title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked.' },
            ].map((item) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
                <div className="text-gold mb-5 flex justify-center">{item.icon}</div>
                <h3 className="text-sm text-light tracking-widest uppercase font-light mb-3">{item.title}</h3>
                <p className="text-xs text-muted font-light leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* NEWSLETTER */}
<section className="border-t border-dark-border relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
  <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
    <div className="max-w-xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-12 h-12 rounded-full bg-gold/10 mx-auto mb-6 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 text-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-4xl font-light text-light mb-3"
      >
        Get <span className="text-gold italic">exclusive</span> access
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted text-sm font-light mb-8"
      >
        Be the first to know about new drops, restocks, and special offers.
      </motion.p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onSubmit={handleNewsletter}
        className="flex gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3.5 placeholder:text-muted/50 focus:outline-none focus:border-gold/50 transition-colors"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 whitespace-nowrap"
        >
          Join
        </motion.button>
      </motion.form>
      <p className="text-[10px] text-muted/50 mt-4 font-light">No spam. Unsubscribe anytime.</p>
    </div>
  </div>
</section>
{/* WHY CHOOSE US */}
<section className="border-t border-dark-border bg-dark-card">
  <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-14"
    >
      <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Why MINIMAL</span>
      <h2 className="text-2xl sm:text-3xl font-light text-light mt-3">
        Designed for the <span className="text-gold italic">modern you</span>
      </h2>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          ),
          title: 'Premium Quality',
          desc: 'Every piece is handpicked and crafted from the finest materials, ensuring durability and elegance.',
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          ),
          title: 'Fast Delivery',
          desc: 'Orders ship within 24 hours. Free delivery on all orders above Rs. 150.',
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ),
          title: 'Easy Returns',
          desc: 'Not satisfied? Return within 30 days for a full refund. No questions asked.',
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          ),
          title: 'Secure Checkout',
          desc: '256-bit SSL encryption protects your data. Shop with complete confidence.',
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          ),
          title: '24/7 Support',
          desc: 'Need help? Our team is available anytime via chat, email, or phone.',
        },
        {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          ),
          title: 'Made with Love',
          desc: 'Built by a solo developer who cares deeply about every pixel and every line of code.',
        },
      ].map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.3)' }}
          className="bg-dark-bg border border-dark-border p-6 group transition-all duration-300"
        >
          <div className="text-gold mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
            {item.icon}
          </div>
          <h3 className="text-sm text-light tracking-wide font-medium mb-2">{item.title}</h3>
          <p className="text-xs text-muted font-light leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

    </>
  )
}