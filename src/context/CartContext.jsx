'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('minimal-cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('minimal-cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const addToCart = (product, color, size, quantity = 1) => {
    setCart((prev) => {
      const productId = product._id || product.id
      const existing = prev.find(
        (item) => item.id === productId && item.color === color && item.size === size
      )
      if (existing) {
        return prev.map((item) =>
          item.id === productId && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          color,
          size,
          quantity,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeFromCart = (itemId, color, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === itemId && item.color === color && item.size === size)
      )
    )
  }

  const updateQuantity = (itemId, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, color, size)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}