'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered']

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) setOrders(data.orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const shippedCount = orders.filter(o => o.status === 'shipped').length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-light">Orders</h1>
          <p className="text-muted text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total Revenue', value: `Rs.${totalRevenue.toLocaleString()}`, color: 'text-gold' },
          { label: 'Total Orders', value: orders.length, color: 'text-light' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-400' },
          { label: 'Shipped', value: shippedCount, color: 'text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border p-4">
            <p className={`text-2xl font-light ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted tracking-widest uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border text-light text-sm font-light pl-10 pr-4 py-2 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...statusSteps].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase font-light transition-all
                ${filterStatus === status
                  ? 'bg-gold text-dark-bg'
                  : 'text-muted hover:text-light border border-dark-border'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-14 bg-dark-card border border-dark-border" />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
  <table className="w-full text-left">
    <thead>
      <tr className="border-b border-dark-border">
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Order</th>
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium hidden sm:table-cell">Customer</th>
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium hidden lg:table-cell">Items</th>
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Total</th>
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Status</th>
        <th className="py-3 px-3 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium hidden lg:table-cell">Date</th>
        <th className="py-3 px-2 sm:px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredOrders.length === 0 ? (
        <tr>
          <td colSpan={7} className="py-12 text-center text-muted text-sm font-light">
            No orders found
          </td>
        </tr>
      ) : (
        filteredOrders.map((order) => (
          <tr key={order._id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
            <td className="py-3 px-3 sm:px-4">
              <div>
                <span className="text-xs sm:text-sm text-light font-light font-mono">
                  #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-[10px] text-muted block sm:hidden">
                  {order.customer?.name || 'Guest'}
                </span>
              </div>
            </td>
            <td className="py-3 px-3 sm:px-4 hidden sm:table-cell">
              <p className="text-sm text-light font-light">{order.customer?.name || 'Guest'}</p>
              <p className="text-xs text-muted">{order.customer?.email || 'N/A'}</p>
            </td>
            <td className="py-3 px-3 sm:px-4 hidden lg:table-cell text-sm text-muted font-light">
              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
            </td>
            <td className="py-3 px-3 sm:px-4">
              <span className="text-sm text-gold font-light">Rs. {order.total}</span>
            </td>
            <td className="py-3 px-3 sm:px-4">
              <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </td>
            <td className="py-3 px-3 sm:px-4 hidden lg:table-cell text-xs text-muted font-light">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="py-3 px-2 sm:px-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={() => setSelectedOrder(order)} className="text-[10px] sm:text-xs text-muted hover:text-light tracking-wide transition-colors">
                  View
                </button>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="text-[10px] sm:text-xs bg-transparent border border-dark-border text-muted px-1 sm:px-2 py-1 focus:outline-none focus:border-gold/50 cursor-pointer"
                >
                  {statusSteps.map(s => (
                    <option key={s} value={s} className="bg-dark-card text-light">{s}</option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-card border border-dark-border w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 flex items-center justify-between">
                  <h2 className="text-sm text-light tracking-widest uppercase font-medium">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-muted hover:text-light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div>
                    <p className="text-[10px] text-muted tracking-widest uppercase mb-3">Order Status</p>
                    <div className="flex items-center gap-2">
                      {statusSteps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            statusSteps.indexOf(selectedOrder.status) >= i ? 'bg-gold' : 'bg-dark-border'
                          }`} />
                          <span className={`text-[10px] tracking-widest uppercase ${
                            statusSteps.indexOf(selectedOrder.status) >= i ? 'text-gold' : 'text-muted'
                          }`}>
                            {step}
                          </span>
                          {i < statusSteps.length - 1 && (
                            <div className={`w-6 h-[1px] ${
                              statusSteps.indexOf(selectedOrder.status) > i ? 'bg-gold' : 'bg-dark-border'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {statusSteps.map((step) => (
                        <button
                          key={step}
                          onClick={() => updateStatus(selectedOrder._id, step)}
                          className={`text-[10px] tracking-widest uppercase px-2.5 py-1 border font-medium transition-colors
                            ${selectedOrder.status === step ? statusColors[step] : 'border-dark-border text-muted hover:text-light'}`}
                        >
                          {step}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer info */}
                  <div>
                    <p className="text-[10px] text-muted tracking-widest uppercase mb-3">Customer</p>
                    <p className="text-sm text-light font-light">{selectedOrder.customer?.name || 'Guest'}</p>
                    <p className="text-xs text-muted">{selectedOrder.customer?.email}</p>
                    <p className="text-xs text-muted mt-1">
                      {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.country} {selectedOrder.customer?.zip}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-[10px] text-muted tracking-widest uppercase mb-3">Items</p>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-bg border border-dark-border flex items-center justify-center">
                              <span className="text-gold/30 text-xs">✦</span>
                            </div>
                            <div>
                              <p className="text-sm text-light font-light">{item.name}</p>
                              <p className="text-xs text-muted">{item.color} / {item.size} × {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gold font-light">Rs.{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t border-dark-border mt-4">
                      <span className="text-sm text-light font-medium">Total</span>
                      <span className="text-lg text-gold font-light">Rs.{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}