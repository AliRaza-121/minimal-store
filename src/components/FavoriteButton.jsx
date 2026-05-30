'use client'

import { useFavorites } from '@/context/FavoritesContext'
import { motion } from 'framer-motion'

export default function FavoriteButton({ product, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const productId = product?._id || product?.id
  const active = isFavorite(productId)

  if (!productId) return null

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault() // prevent navigating if inside a Link
        e.stopPropagation()
        toggleFavorite(product)
      }}
      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-dark-bg/60 backdrop-blur-sm border border-dark-border flex items-center justify-center transition-colors hover:border-gold/50 hover:bg-dark-bg/80 ${className}`}
      aria-label="Toggle Favorite"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={active ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth={1.5} 
        className={`w-4 h-4 transition-colors ${active ? 'text-red-500' : 'text-light'}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </motion.button>
  )
}
