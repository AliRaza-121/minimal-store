'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/context/ToastContext'

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const { toast } = useToast()

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('minimal-favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse favorites from local storage', error)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('minimal-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (product) => {
    setFavorites((prev) => {
      const productId = product._id || product.id
      if (prev.some(item => (item._id || item.id) === productId)) return prev
      return [...prev, product]
    })
    toast('Added to favorites', 'success')
  }

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((item) => (item._id || item.id) !== productId))
    toast('Removed from favorites', 'success')
  }

  const toggleFavorite = (product) => {
    const productId = product._id || product.id
    const isFav = favorites.some((item) => (item._id || item.id) === productId)
    if (isFav) {
      removeFavorite(productId)
    } else {
      addFavorite(product)
    }
  }

  const isFavorite = (productId) => {
    return favorites.some((item) => (item._id || item.id) === productId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
