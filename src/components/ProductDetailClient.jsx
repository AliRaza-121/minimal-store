'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import FavoriteButton from '@/components/FavoriteButton'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted text-lg font-light">Product not found</p>
          <Link href="/shop" className="text-gold text-sm tracking-widest uppercase mt-4 inline-block hover:text-gold-light transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return
    addToCart(product, selectedColor, selectedSize)
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center gap-2 text-xs text-muted font-light tracking-wide mb-10">
          <Link href="/" className="hover:text-light transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-light transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-light">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden">
              <FavoriteButton product={product} className="!top-4 !right-4 !w-10 !h-10" />
              {product.image ? (
               <Image 
  src={product.image ? product.image.replace('/upload/', '/upload/w_600,f_auto,q_auto/') : ''} 
  alt={product.name} 
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="object-cover" 
/>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full border border-gold/10 mx-auto mb-6 flex items-center justify-center">
                      <span className="text-gold/30 text-5xl font-light">✦</span>
                    </div>
                    <p className="text-muted/40 text-xs tracking-widest uppercase">{product.category}</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/30" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/30" />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-gold text-dark-bg text-[10px] tracking-widest uppercase px-2.5 py-1 font-medium">{product.badge}</span>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((thumb) => (
                <div key={thumb} className="w-20 h-24 bg-dark-card border border-dark-border flex items-center justify-center cursor-pointer hover:border-gold/30 transition-colors">
                  <span className="text-muted/20 text-lg">✦</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-3 mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-gold mb-8">Rs. {product.price}</p>
            
            <p className="text-muted text-sm font-light leading-relaxed mb-8">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-light tracking-widest uppercase font-medium mb-3">
                  Color — <span className="text-muted font-light">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => {
                    const swatchColor = color.toLowerCase().replace(/ /g, '')
                    return (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor === color ? 'border-gold scale-110' : 'border-dark-border hover:scale-105'}`}
                      style={{ backgroundColor: swatchColor }}
                    />
                  )})}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <p className="text-xs text-light tracking-widest uppercase font-medium mb-3">
                  Size — <span className="text-muted font-light">{selectedSize || 'Select'}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-xs tracking-wide font-light border transition-all duration-300 flex items-center justify-center ${selectedSize === size ? 'border-gold text-gold bg-gold/5' : 'border-dark-border text-muted hover:border-muted/50'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button onClick={handleAddToCart}
              whileHover={selectedColor && selectedSize ? { scale: 1.02 } : {}}
              whileTap={selectedColor && selectedSize ? { scale: 0.98 } : {}}
              className={`w-full py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-300 mb-4 ${selectedColor && selectedSize ? 'bg-gold text-dark-bg hover:bg-gold-light' : 'bg-dark-card text-muted/50 border border-dark-border cursor-not-allowed'}`}>
              {!selectedColor || !selectedSize ? 'Select Options' : 'Add to Cart'}
            </motion.button>

            {product.details?.length > 0 && (
              <div className="border-t border-dark-border pt-6 mt-6">
                <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Details & Care</h3>
                <ul className="space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail} className="text-sm text-muted font-light flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/50 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}