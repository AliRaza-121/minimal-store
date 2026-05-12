'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { cart, cartTotal, isOpen, setIsOpen, removeFromCart, updateQuantity } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-dark-bg border-l border-dark-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-dark-border">
              <h2 className="text-sm text-light tracking-widest uppercase font-medium">
                Your Cart ({cart.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-muted/30 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p className="text-muted font-light">Your cart is empty</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gold text-xs tracking-widest uppercase mt-4 hover:text-gold-light transition-colors"
                  >
                    Continue Shopping
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {cart.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.color}-${item.size}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 pb-4 border-b border-dark-border"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 bg-dark-card border border-dark-border flex-shrink-0 flex items-center justify-center">
                      <span className="text-gold/30 text-lg">✦</span>
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light font-light truncate">{item.name}</p>
                      <p className="text-xs text-muted mt-1">
                        {item.color} / {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-dark-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-light text-xs transition-colors"
                          >
                            −
                          </button>
                          <span className="w-7 h-7 flex items-center justify-center text-xs text-light">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-light text-xs transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gold font-light">
                            Rs. {item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id, item.color, item.size)}
                            className="text-muted hover:text-red-400 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-dark-border px-6 py-5">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted font-light">Subtotal</span>
                  <span className="text-sm text-light font-light">Rs. {cartTotal}</span>
                </div>
                <p className="text-xs text-muted/60 font-light mb-4">Shipping calculated at checkout</p>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300"
                  >
                    Checkout
                  </motion.button>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-xs text-muted hover:text-light tracking-widest uppercase mt-3 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}