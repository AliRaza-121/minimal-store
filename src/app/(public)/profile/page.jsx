'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Profile() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetch('/api/orders/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders)
          }
          setLoadingOrders(false)
        })
        .catch(() => setLoadingOrders(false))
    }
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-t border-gold rounded-full animate-spin" />
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500'
      case 'confirmed': return 'text-blue-500'
      case 'shipped': return 'text-purple-500'
      case 'delivered': return 'text-green-500'
      default: return 'text-muted'
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-dark-border pb-8">
          <div>
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">My Account</span>
            <h1 className="text-3xl sm:text-4xl font-light text-light mt-4 mb-2">Welcome, {user.name}</h1>
            <p className="text-muted font-light">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="text-xs text-muted hover:text-red-400 tracking-widest uppercase transition-colors"
          >
            Sign Out
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} className="lg:col-span-1 space-y-6">
            <div className="bg-dark-card border border-dark-border p-6">
              <h3 className="text-xs text-light tracking-widest uppercase font-medium mb-4">Account Details</h3>
              <p className="text-sm text-light font-light">{user.name}</p>
              <p className="text-sm text-muted font-light mt-1">{user.email}</p>
              <button className="text-xs text-gold hover:text-gold-light tracking-widest uppercase mt-4 transition-colors">
                Edit details
              </button>
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2} className="lg:col-span-3">
            <h2 className="text-xl font-light text-light mb-6">Order History</h2>

            {loadingOrders ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-t border-gold rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-dark-card border border-dark-border p-12 text-center">
                <p className="text-muted font-light mb-4">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-dark-card border border-dark-border overflow-hidden">
                    <div className="border-b border-dark-border p-4 sm:p-6 bg-dark-bg/50 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Order Placed</p>
                        <p className="text-sm text-light font-light">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Total</p>
                        <p className="text-sm text-light font-light">Rs. {order.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Order #</p>
                        <p className="text-sm text-light font-light">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-6 border-b border-dark-border pb-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm tracking-widest uppercase font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-muted/30">|</span>
                          <span className="text-xs text-muted tracking-widest uppercase flex items-center gap-1">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             order.paymentMethod === 'card' ? 'Card' :
                             order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                             order.paymentMethod}
                            {order.paymentStatus === 'paid' && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 ml-1">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <Link href={`/contact?order=${order._id}`} className="text-xs text-muted hover:text-light transition-colors">
                          Need Help?
                        </Link>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="relative w-16 h-20 bg-dark-bg border border-dark-border flex-shrink-0 overflow-hidden">
                              {item.image ? (
                                <Image src={item.image.replace('/upload/', '/upload/w_200,f_auto,q_auto/')} alt={item.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-gold/30">✦</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="text-sm text-light font-light truncate">{item.name}</p>
                              <p className="text-xs text-muted mt-1">{item.color} / {item.size} × {item.quantity}</p>
                            </div>
                            <div className="text-right flex flex-col justify-center">
                              <span className="text-sm text-gold font-light">Rs. {item.price * item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
