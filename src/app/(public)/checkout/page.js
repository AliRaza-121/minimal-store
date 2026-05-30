'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Checkout() {
  const { cart, cartTotal, cartCount, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zip: '',
  })
  const [storeStatus, setStoreStatus] = useState('loading')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setStoreStatus(data.settings.isAcceptingOrders ? 'open' : 'closed')
        } else {
          setStoreStatus('open') // fail open if error
        }
      })
      .catch(() => setStoreStatus('open'))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsProcessing(true)

  try {
    // 1. Create the order as pending
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          id: item.id,
        })),
        total: cartTotal,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        customer: {
          name: form.name,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
          zip: form.zip,
        },
      }),
    })

    const data = await res.json()
    
    if (data.success) {
      clearCart()

      if (paymentMethod !== 'cod') {
        // 2. Initialize Safepay Secure Checkout
        const safepayRes = await fetch('/api/payment/safepay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.order._id })
        })
        
        const safepayData = await safepayRes.json()
        
        if (safepayData.success && safepayData.url) {
          // 3. Physically redirect browser to Safepay
          window.location.href = safepayData.url
        } else {
          alert('Failed to connect to Safepay. Please try again.')
          setIsProcessing(false)
        }
      } else {
        // Cash on delivery - Show local success screen
        setOrderPlaced(true)
        setIsProcessing(false)
      }
    } else {
      alert('Order creation failed.')
      setIsProcessing(false)
    }
  } catch (error) {
    console.error('Order failed:', error)
    setIsProcessing(false)
  }
}

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center px-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full border-2 border-gold mx-auto mb-6 flex items-center justify-center"
          >
            <span className="text-gold text-2xl">✓</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-light text-light mb-4">Order Confirmed</h1>
          <p className="text-muted font-light max-w-md mx-auto mb-8">
            Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
          </p>
          <Link
            href="/"
            className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <h1 className="text-3xl font-light text-light mb-4">Your cart is empty</h1>
          <p className="text-muted font-light mb-6">Add some items before checking out.</p>
          <Link
            href="/shop"
            className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (storeStatus === 'closed') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-light text-light mb-4">Store is Temporarily Closed</h1>
          <p className="text-muted font-light mb-6">We are currently not accepting new orders. Please check back later.</p>
          <Link
            href="/shop"
            className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (storeStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center px-6">
          <div className="w-12 h-12 border-2 border-dark-border border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <p className="text-muted font-light">Preparing checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">
            Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-light mt-4">
            Complete Your Order
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Form */}
          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-muted tracking-widest uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted tracking-widest uppercase mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                minLength={5}
                className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs text-muted tracking-widest uppercase mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted tracking-widest uppercase mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted tracking-widest uppercase mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  required
                  pattern="[0-9\sA-Za-z\-]{3,10}"
                  title="Please enter a valid zip or postal code"
                  className="w-full bg-dark-card border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-dark-border mt-8">
              <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-5">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery' },
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'jazzcash', label: 'JazzCash' },
                  { id: 'easypaisa', label: 'Easypaisa' },
                  { id: 'bank_transfer', label: 'Direct Bank Transfer' }
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-gold bg-gold/5' : 'border-dark-border bg-dark-card hover:border-muted/50'}`}>
                    <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-muted/50">
                      {paymentMethod === method.id && (
                        <motion.div layoutId="payment-radio" className="w-2 h-2 rounded-full bg-gold" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="hidden"
                    />
                    <span className="text-sm font-light text-light">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300 mt-6"
            >
              {paymentMethod === 'cod' ? `Place Order — Rs. ${cartTotal}` : 'Proceed to Secure Payment'}
            </motion.button>
          </motion.form>

          {/* Order Summary */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="lg:col-span-2 bg-dark-card border border-dark-border p-6 h-fit"
          >
            <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-5">
              Order Summary ({cartCount} items)
            </h3>
            
            <div className="space-y-4 mb-5">
              {cart.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-light font-light truncate">{item.name}</p>
                    <p className="text-xs text-muted">
                      {item.color} / {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm text-gold font-light flex-shrink-0">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted font-light">Subtotal</span>
                <span className="text-light">Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted font-light">Shipping</span>
                <span className="text-light">Free</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-dark-border">
                <span className="text-light font-medium">Total</span>
                <span className="text-gold">Rs. {cartTotal}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mock Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-bg/95 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 max-w-sm"
          >
            <div className="w-12 h-12 border-2 border-dark-border border-t-gold rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-light text-light mb-2">Connecting to Secure Gateway</h3>
            <p className="text-sm text-muted font-light mb-6">Please do not close this window or press back.</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs uppercase tracking-widest text-gold">Secured by</span>
              <span className="text-xs font-bold tracking-widest text-light uppercase">{paymentMethod}</span>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}