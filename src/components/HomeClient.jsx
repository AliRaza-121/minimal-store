'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/FavoriteButton'
import { useCart } from '@/context/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

function ParallaxLookbook({ lookbook }) {
  const parallaxRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120])

  return (
    <section ref={parallaxRef} style={{ position: 'relative' }} className="relative py-12 sm:py-20 bg-dark-bg overflow-hidden border-b border-dark-border">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -z-10" />

      <div className="text-center mb-12 sm:mb-16 relative z-20">
        <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">The Lookbook</span>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-light mt-4">Art of Layering</h2>
        <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 h-auto">
        
        <motion.div style={{ y: y1 }} className="flex flex-col gap-6 sm:gap-10 pt-0">
          {lookbook[0] && (
            <Link href={lookbook[0].link || '/shop'} className="relative aspect-[3/4] w-full overflow-hidden group block border border-dark-border">
              <Image src={lookbook[0].image.replace('/upload/', '/upload/w_600,f_auto,q_auto/')} alt={lookbook[0].title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-light text-xs tracking-widest uppercase border-b border-gold pb-1">Shop Collection</span>
              </div>
            </Link>
          )}
          {lookbook[0] && (
            <div className="p-6 bg-dark-card border border-dark-border">
              <p className="text-gold text-[10px] tracking-widest uppercase mb-2">Editorial</p>
              <h3 className="text-light text-xl font-light mb-4">{lookbook[0].title}</h3>
              {lookbook[0].subtitle && (
                <p className="text-muted text-sm font-light leading-relaxed">{lookbook[0].subtitle}</p>
              )}
            </div>
          )}
        </motion.div>

        <motion.div style={{ y: y2 }} className="flex flex-col gap-6 sm:gap-10 -mt-0 md:-mt-20 z-10">
          <div className="p-8 text-center border border-dark-border flex items-center justify-center aspect-square bg-dark-bg/80 backdrop-blur-md">
             <span className="text-light text-xl sm:text-2xl font-light italic leading-relaxed">"Simplicity is the ultimate sophistication."</span>
          </div>
          {lookbook[1] && (
            <Link href={lookbook[1].link || '/shop'} className="relative aspect-[4/5] w-full overflow-hidden group block border border-dark-border">
              <Image src={lookbook[1].image.replace('/upload/', '/upload/w_600,f_auto,q_auto/')} alt={lookbook[1].title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-light text-xs tracking-widest uppercase border-b border-gold pb-1">Shop Collection</span>
              </div>
            </Link>
          )}
        </motion.div>

        <motion.div style={{ y: y3 }} className="flex flex-col gap-6 sm:gap-10 pt-20 md:pt-32">
          {lookbook[2] && (
            <Link href={lookbook[2].link || '/shop'} className="relative aspect-square w-full overflow-hidden group block border border-dark-border">
              <Image src={lookbook[2].image.replace('/upload/', '/upload/w_600,f_auto,q_auto/')} alt={lookbook[2].title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-light text-xs tracking-widest uppercase border-b border-gold pb-1">Shop Collection</span>
              </div>
            </Link>
          )}
          <div className="text-right pr-4">
            <Link href="/shop" className="text-sm text-gold hover:text-light tracking-widest uppercase transition-colors inline-flex items-center gap-2">
              Explore The Edit <span>→</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default function HomeClient({ products, lookbook = [], trending = [] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [email, setEmail] = useState('')
  const [categoriesList, setCategoriesList] = useState(['All'])
  
  const { addToCart } = useCart()

  const carouselRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Occasions State
  const occasionScrollRef = useRef(null)
  const [activeOccasion, setActiveOccasion] = useState(0)
  
  const occasions = [
    { id: 1, title: 'DINNER', image: products.length > 0 ? products[0].image : '' },
    { id: 2, title: 'BRIDAL', image: products.length > 1 ? products[1].image : '' },
    { id: 3, title: 'CASUAL', image: products.length > 2 ? products[2].image : '' },
    { id: 4, title: 'FORMAL', image: products.length > 3 ? products[3].image : '' }
  ]

  // Auto-play for Occasions Slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (occasionScrollRef.current && occasions.length > 0) {
        const nextIndex = (activeOccasion + 1) % occasions.length;
        // Scroll to the next slide. Using 85% width for cards means we have to calculate the scroll position.
        // Wait, the items are 85% width. So the scroll amount is item width. 
        // We can just use the scrollWidth and divide by length.
        const scrollAmount = occasionScrollRef.current.scrollWidth / occasions.length;
        occasionScrollRef.current.scrollTo({
          left: nextIndex * scrollAmount,
          behavior: 'smooth'
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeOccasion, occasions.length]);

  const handleOccasionScroll = (e) => {
    if (!e.target) return
    const scrollLeft = e.target.scrollLeft
    const scrollAmount = e.target.scrollWidth / occasions.length
    const newIndex = Math.round(scrollLeft / scrollAmount)
    if (newIndex !== activeOccasion && newIndex >= 0 && newIndex < occasions.length) {
      setActiveOccasion(newIndex)
    }
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      if (scrollWidth > clientWidth) {
        const progress = scrollLeft / (scrollWidth - clientWidth)
        setScrollProgress(progress * 100)
      } else {
        setScrollProgress(0)
      }
    }
  }

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

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
          <Image 
            src="/hero-bg.jpg" 
            alt="Hero background" 
            fill
            priority
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
          />
          <div className="absolute inset-0 bg-dark-bg/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gold/5 blur-[150px] transform-gpu will-change-transform" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-dark-bg/80 blur-[80px] transform-gpu will-change-transform" />

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
      {/* HANDPICKED SPLIT LAYOUT CAROUSEL */}
      <section className="w-full bg-dark-bg overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[550px]">
            {/* Left Hero Image (Using first product) */}
            <motion.div 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="w-full lg:w-[40%] h-[300px] lg:h-full relative shrink-0"
            >
              {filteredProducts[0].image ? (
                <Image 
                  src={filteredProducts[0].image.replace('/upload/', '/upload/w_1200,f_auto,q_auto/')} 
                  alt={filteredProducts[0].name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-dark-card flex items-center justify-center">
                  <span className="text-gold/30 text-4xl">✦</span>
                </div>
              )}
              {/* Overlay for aesthetics */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-dark-bg/80 pointer-events-none" />
            </motion.div>

            {/* Right Carousel Area */}
            <div className="w-full lg:w-[60%] flex flex-col justify-between py-8 px-6 lg:py-10 lg:px-10 bg-dark-card/30">
              
              {/* Header & Controls */}
              <div className="flex justify-between items-end mb-6 lg:mb-8">
                <div>
                  <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-light block mb-2">Handpicked for you</span>
                  <h2 className="text-3xl lg:text-4xl font-light text-light tracking-wide uppercase">
                    {activeCategory === 'All' ? 'Featured' : activeCategory}
                  </h2>
                </div>
                
                <div className="flex items-center gap-6">
                  <Link href="/shop" className="hidden sm:inline-block text-[11px] text-light/80 hover:text-gold tracking-widest uppercase font-light border-b border-gold/30 pb-0.5 transition-colors">
                    View all
                  </Link>
                  <div className="flex gap-2">
                    <button onClick={() => scrollCarousel('left')} className="w-10 h-10 border border-dark-border flex items-center justify-center text-light hover:text-gold hover:border-gold/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                    </button>
                    <button onClick={() => scrollCarousel('right')} className="w-10 h-10 border border-dark-border flex items-center justify-center text-light hover:text-gold hover:border-gold/50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrolling Container */}
              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-4 lg:gap-6 snap-x snap-mandatory hide-scrollbar pb-4 pt-2 flex-grow items-start"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredProducts.map((product, i) => (
                  <motion.div 
                    key={product._id} 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="w-[200px] lg:w-[240px] snap-start shrink-0 group block cursor-pointer"
                  >
                    <Link href={`/shop/${product._id}`} className="flex flex-col h-full w-full">
                      <div className="relative w-full aspect-[3/4] bg-dark-bg rounded-xl overflow-hidden mb-4 border border-dark-border group-hover:border-gold/30 transition-colors shrink-0">
                        {product.image ? (
                          <Image 
                            src={product.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
                            alt={product.name} 
                            fill
                            sizes="280px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><span className="text-gold/30 text-2xl">✦</span></div>
                        )}
                        <div className="absolute top-3 right-3 z-10"><FavoriteButton product={product} /></div>
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-gold text-dark-bg text-[10px] leading-none tracking-widest uppercase px-3 py-1.5 font-semibold z-[5] rounded-sm shadow-sm">
                            {product.badge}
                          </div>
                        )}

                        {/* Hover Quick Add Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-dark-bg/95 backdrop-blur-md p-3 sm:p-4 border-t border-dark-border flex flex-col gap-2 z-20">
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="flex justify-center gap-1.5 flex-wrap mb-1">
                              {(Array.isArray(product.sizes) ? product.sizes : product.sizes.split(',')).map((size, sIdx) => {
                                const sizeStr = typeof size === 'string' ? size.trim() : size
                                return (
                                  <button 
                                    key={sIdx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      const defColor = Array.isArray(product.colors) ? product.colors[0] : (product.colors ? product.colors.split(',')[0].trim() : null)
                                      addToCart(product, defColor, sizeStr)
                                    }}
                                    className="text-[10px] text-light border border-dark-border hover:border-gold hover:text-gold px-2 py-1 rounded-sm transition-colors cursor-pointer"
                                  >
                                    {sizeStr}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const defSize = Array.isArray(product.sizes) ? product.sizes[0] : (product.sizes ? product.sizes.split(',')[0].trim() : null)
                              const defColor = Array.isArray(product.colors) ? product.colors[0] : (product.colors ? product.colors.split(',')[0].trim() : null)
                              addToCart(product, defColor, defSize)
                            }}
                            className="w-full bg-gold hover:bg-light text-dark-bg text-[10px] tracking-widest uppercase py-2 font-medium transition-colors rounded-sm cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted tracking-widest uppercase font-light mb-1">{product.category}</p>
                      <p className="text-sm text-light font-medium tracking-wide line-clamp-1 group-hover:text-gold transition-colors">{product.name}</p>
                      <p className="text-sm text-gold font-light mt-1">Rs. {product.price?.toLocaleString()}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[2px] bg-dark-border mt-4 lg:mt-8 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gold"
                  style={{ width: `${scrollProgress}%`, minWidth: '10%' }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted text-lg font-light">No pieces found.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchTerm('') }} className="text-gold text-sm tracking-widest uppercase mt-4 hover:text-gold-light transition-colors">Clear filters</button>
          </div>
        )}
      </section>

      {/* SHOP BY OCCASION SPLIT SECTION */}
      <section className="w-full bg-dark-bg border-b border-dark-border overflow-hidden mb-0">
        <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[450px]">
          {/* Left Side: Text and Controls */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center py-12 px-8 lg:px-12 bg-dark-bg relative shrink-0">
            <span className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gold">Eid Collection '26</span>
            <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-wide text-light">Shop By Occasion</h2>
            <p className="text-xs lg:text-sm font-light text-muted mb-8 leading-relaxed max-w-sm">
              Celebrate in effortless elegance. Timeless designs made for moments that matter.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 border border-dark-border hover:border-gold px-5 py-2.5 w-fit text-[10px] lg:text-xs font-medium uppercase tracking-widest transition-colors text-light">
              Shop The Look <span className="text-lg leading-none">→</span>
            </Link>
            
            {/* Dashes/Dots Navigation */}
            <div className="mt-8 lg:mt-12 flex gap-3">
              {occasions.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    if(occasionScrollRef.current) {
                      const scrollAmount = occasionScrollRef.current.scrollWidth / occasions.length;
                      occasionScrollRef.current.scrollTo({
                        left: i * scrollAmount,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className={`h-0.5 transition-all duration-300 ${activeOccasion === i ? 'w-12 bg-gold' : 'w-8 bg-dark-border hover:bg-gold/50'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Right Side: Snap Slider */}
          <div 
            ref={occasionScrollRef}
            onScroll={handleOccasionScroll}
            className="w-full lg:w-[60%] h-[400px] lg:h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar relative shrink-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {occasions.map((occ, i) => (
              <div key={occ.id} className="w-full lg:w-[85%] h-full shrink-0 snap-start relative border-l border-dark-border group cursor-pointer overflow-hidden">
                <Image 
                  src={occ.image?.replace('/upload/', '/upload/w_1200,f_auto,q_auto/') || '/placeholder.jpg'} 
                  alt={occ.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-dark-bg/20 group-hover:bg-dark-bg/10 transition-colors duration-500" />
                {/* Large Centered Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <h3 className="text-light text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] uppercase opacity-90 drop-shadow-2xl">{occ.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TRENDING - THIS WEEKS TOP 5 */}
      {trending.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} 
          transition={{ duration: 0.7 }}
          className="py-12 sm:py-20 px-6 border-b border-dark-border"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Trending</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">This Week&apos;s Top 5</h2>
              <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {trending.map((product, i) => (
                <motion.div 
                  key={product._id} 
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }} 
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link href={`/shop/${product._id}`} className="group block">
                    <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden mb-4">
                      {/* Primary Image */}
                      <div className="absolute inset-0">
                        {product.image ? (
                          <Image 
                            src={product.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
                            alt={product.name} 
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className={`object-cover transition-opacity duration-500 ${product.hoverImage ? 'group-hover:opacity-0' : ''}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gold/30 text-2xl">✦</span>
                          </div>
                        )}
                      </div>
                      {/* Hover Image */}
                      {product.hoverImage && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <Image 
                            src={product.hoverImage.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
                            alt={`${product.name} - alternate`} 
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <FavoriteButton product={product} />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-gold text-dark-bg text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium z-[5]">{product.badge}</span>
                      )}

                      {/* Hover Quick Add Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-dark-bg/95 backdrop-blur-md p-3 sm:p-4 border-t border-dark-border flex flex-col gap-2 z-20">
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex justify-center gap-1.5 flex-wrap mb-1">
                            {(Array.isArray(product.sizes) ? product.sizes : product.sizes.split(',')).map((size, sIdx) => {
                              const sizeStr = typeof size === 'string' ? size.trim() : size
                              return (
                                <button 
                                  key={sIdx}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const defColor = Array.isArray(product.colors) ? product.colors[0] : (product.colors ? product.colors.split(',')[0].trim() : null)
                                    addToCart(product, defColor, sizeStr)
                                  }}
                                  className="text-[10px] text-light border border-dark-border hover:border-gold hover:text-gold px-2 py-1 rounded-sm transition-colors cursor-pointer"
                                >
                                  {sizeStr}
                                </button>
                              )
                            })}
                          </div>
                        )}
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const defSize = Array.isArray(product.sizes) ? product.sizes[0] : (product.sizes ? product.sizes.split(',')[0].trim() : null)
                            const defColor = Array.isArray(product.colors) ? product.colors[0] : (product.colors ? product.colors.split(',')[0].trim() : null)
                            addToCart(product, defColor, defSize)
                          }}
                          className="w-full bg-gold hover:bg-light text-dark-bg text-[10px] tracking-widest uppercase py-2 font-medium transition-colors rounded-sm cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>

                    </div>
                    <p className="text-[10px] text-muted tracking-widest uppercase font-light mb-1">{product.category}</p>
                    <p className="text-sm text-light font-light tracking-wide line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gold font-light mt-1">Rs. {product.price?.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ASYMMETRICAL PARALLAX LOOKBOOK */}
      {lookbook.length > 0 && <ParallaxLookbook lookbook={lookbook} />}
    </>
  )
}