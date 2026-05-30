'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/FavoriteButton'
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

function ShopContent({ products: initialProducts }) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('Featured')
  const [filterOpen, setFilterOpen] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const [categoriesList, setCategoriesList] = useState(['All'])

  const allSizes = [...new Set(initialProducts.flatMap(p => p.sizes || []))].filter(Boolean)
  const minPriceDefault = initialProducts.length ? Math.min(...initialProducts.map(p => p.price)) : 0
  const maxPriceDefault = initialProducts.length ? Math.max(...initialProducts.map(p => p.price)) : 10000

  const [selectedSizes, setSelectedSizes] = useState([])
  const [priceRange, setPriceRange] = useState({ min: minPriceDefault, max: maxPriceDefault })
  const [selectedCategories, setSelectedCategories] = useState([])

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

  // Filter and sort client-side
  const getFilteredProducts = () => {
    let filtered = initialProducts.filter((product) => {
      const matchesActiveTab = activeCategory === 'All' || product.category === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesSize = selectedSizes.length === 0 || (product.sizes && product.sizes.some(size => selectedSizes.includes(size)))
      
      const pMin = priceRange.min === '' ? 0 : priceRange.min
      const pMax = priceRange.max === '' ? Infinity : priceRange.max
      const matchesPrice = product.price >= pMin && product.price <= pMax

      return matchesActiveTab && matchesSearch && matchesCategory && matchesSize && matchesPrice
    })

    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Newest':
        filtered = [...filtered].reverse()
        break
      default:
        break
    }
    return filtered
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Browse Collection</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">Shop All</h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-dark-border">
          <button onClick={() => setFilterOpen(!filterOpen)}
            className="sm:hidden flex items-center gap-2 text-xs text-muted tracking-widest uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {categoriesList.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-light transition-all duration-300 ${activeCategory === cat ? 'bg-gold text-dark-bg' : 'text-muted hover:text-light border border-dark-border hover:border-muted/30'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-card border border-dark-border text-light text-sm font-light pl-10 pr-4 py-2.5 placeholder:text-muted/50 focus:outline-none focus:border-gold/50 transition-colors tracking-wide" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
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

            <button 
              onClick={() => setFilterOpen(true)}
              className="bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-2.5 hover:border-gold/50 transition-colors flex items-center gap-2 tracking-wide hidden sm:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Filter & Sort
            </button>
          </div>
        </motion.div>

        <p className="text-xs text-muted tracking-wide mb-8">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link href={`/shop/${product._id}`} className="group block">
                  <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden mb-4">
                    <div className="absolute inset-0">
                     {product.image ? (
  <Image 
    src={product.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
    alt={product.name} 
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    placeholder="blur"
    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88OjRfwAJhQPmG2y2vAAAAABJRU5ErkJggg=="
    className="object-cover" 
  />
) : (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-gold/30 text-2xl">✦</span>
  </div>
)}
                    </div>
                    <FavoriteButton product={product} />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-full border border-dark-border mx-auto mb-6 flex items-center justify-center">
              <span className="text-muted text-xl">⌕</span>
            </div>
            <p className="text-muted text-lg font-light mb-2">No pieces found</p>
            <p className="text-muted/50 text-sm font-light mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { 
              setActiveCategory('All'); 
              setSearchTerm(''); 
              setSortBy('Featured');
              setSelectedSizes([]);
              setSelectedCategories([]);
              setPriceRange({ min: minPriceDefault, max: maxPriceDefault });
            }}
              className="text-gold text-xs tracking-widest uppercase hover:text-gold-light transition-colors">Clear All Filters</button>
          </motion.div>
        )}

        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setFilterOpen(false)} className="fixed inset-0 z-40 bg-black/50" />
              
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] bg-dark-bg border-l border-dark-border p-6 overflow-y-auto flex flex-col">
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-light text-light tracking-wide">Filter & Sort</h2>
                  <button onClick={() => setFilterOpen(false)} className="text-muted hover:text-light transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 space-y-8">
                  {/* Sort */}
                  <div>
                    <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Sort By</h3>
                    <div className="flex flex-col gap-2">
                      {sortOptions.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${sortBy === opt ? 'border-gold bg-gold/10' : 'border-dark-border group-hover:border-gold/50'}`}>
                            {sortBy === opt && <div className="w-2 h-2 rounded-full bg-gold" />}
                          </div>
                          <input type="radio" name="sort" value={opt} checked={sortBy === opt} onChange={(e) => setSortBy(e.target.value)} className="hidden" />
                          <span className={`text-sm font-light transition-colors ${sortBy === opt ? 'text-gold' : 'text-muted group-hover:text-light'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  {categoriesList.filter(c => c !== 'All').length > 0 && (
                    <div>
                      <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Categories</h3>
                      <div className="flex flex-col gap-2">
                        {categoriesList.filter(c => c !== 'All').map((cat) => (
                          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'border-gold bg-gold/10' : 'border-dark-border group-hover:border-gold/50'}`}>
                              {selectedCategories.includes(cat) && <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={(e) => {
                              if (e.target.checked) setSelectedCategories([...selectedCategories, cat])
                              else setSelectedCategories(selectedCategories.filter(c => c !== cat))
                            }} className="hidden" />
                            <span className="text-sm font-light text-muted group-hover:text-light transition-colors">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {allSizes.length > 0 && (
                    <div>
                      <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {allSizes.map((size) => (
                          <button key={size} onClick={() => {
                            if (selectedSizes.includes(size)) setSelectedSizes(selectedSizes.filter(s => s !== size))
                            else setSelectedSizes([...selectedSizes, size])
                          }} className={`px-3 py-1.5 text-xs tracking-widest uppercase font-light transition-colors border ${selectedSizes.includes(size) ? 'border-gold text-gold bg-gold/5' : 'border-dark-border text-muted hover:border-gold/50 hover:text-light'}`}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Price Range</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-xs text-muted block mb-1">Min (Rs.)</label>
                        <input type="number" value={priceRange.min === '' ? '' : priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted block mb-1">Max (Rs.)</label>
                        <input type="number" value={priceRange.max === '' ? '' : priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dark-border">
                  <button onClick={() => {
                    setSelectedSizes([])
                    setSelectedCategories([])
                    setPriceRange({ min: minPriceDefault, max: maxPriceDefault })
                    setSortBy('Featured')
                    setActiveCategory('All')
                    setSearchTerm('')
                  }} className="w-full py-3 border border-dark-border text-light text-sm tracking-widest uppercase hover:bg-dark-card hover:border-muted/30 transition-all">
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ShopClient({ products }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 text-center text-muted font-light flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading Collection...
      </div>
    }>
      <ShopContent products={products} />
    </Suspense>
  )
}