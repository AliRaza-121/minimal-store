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
  <div className="absolute inset-0 bg-dark-bg/60" />
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
            New Collection 2024
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
    src={product.image.replace('/upload/', '/upload/w_500,f_auto,q_auto/')} 
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
      <section className="border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-xl mx-auto text-center">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-gold text-xs tracking-[0.3em] uppercase font-light">Stay in the loop</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-light text-light mt-4 mb-4">Join our newsletter</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted text-sm font-light mb-8">Get early access to new drops, exclusive offers, and style inspiration.</motion.p>
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required
                className="flex-1 bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-gold/50 transition-colors" />
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300 whitespace-nowrap">Subscribe</motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <motion.blockquote initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-gold/30 mx-auto mb-8">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-light leading-relaxed italic">
              &ldquo;Simplicity is the ultimate sophistication. Every piece we curate reflects a commitment to timeless design and uncompromising quality.&rdquo;
            </p>
            <footer className="mt-8">
              <p className="text-gold text-sm tracking-widest uppercase font-light">— Elena Marchetti</p>
              <p className="text-muted text-xs font-light mt-1">Founder & Creative Director</p>
            </footer>
          </motion.blockquote>
        </div>
      </section>
    </>
  )
}