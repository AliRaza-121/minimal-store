'use client'

import { useFavorites } from '@/context/FavoritesContext'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import FavoriteButton from '@/components/FavoriteButton'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function FavoritesClient() {
  const { favorites } = useFavorites()

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Your Wishlist</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4">Favorites</h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        {favorites.length > 0 ? (
          <>
            <p className="text-xs text-muted tracking-wide mb-8">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {favorites.map((product, i) => (
                <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <Link href={`/shop/${product._id || product.id}`} className="group block">
                    <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden mb-4">
                      <div className="absolute inset-0">
                        {product.image ? (
                          <Image 
                            src={product.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
                            alt={product.name} 
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-full border border-dark-border mx-auto mb-6 flex items-center justify-center text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <p className="text-muted text-lg font-light mb-2">No favorites yet</p>
            <p className="text-muted/50 text-sm font-light mb-8">Items you favorite will appear here.</p>
            <Link href="/shop" className="px-8 py-3.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300">
              Explore Collection
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
