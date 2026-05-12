'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Total Products', value: '--', icon: '📦', color: 'from-gold/20 to-gold/5' },
  { label: 'Total Orders', value: '--', icon: '🛒', color: 'from-emerald-500/20 to-emerald-500/5' },
  { label: 'Total Users', value: '--', icon: '👥', color: 'from-blue-500/20 to-blue-500/5' },
  { label: 'Revenue', value: 'Rs. --', icon: '💰', color: 'from-purple-500/20 to-purple-500/5' },
]

export default function AdminDashboard() {
  const [data, setData] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ])
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()

      const totalRevenue = ordersData.orders?.reduce((sum, o) => sum + o.total, 0) || 0

      setData({
        products: productsData.products?.length || 0,
        orders: ordersData.orders?.length || 0,
        users: 1,
        revenue: totalRevenue,
      })

      setRecentOrders(ordersData.orders?.slice(0, 5) || [])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const statValues = [data.products, data.orders, data.users, `Rs.${data.revenue.toLocaleString()}`]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-light text-light">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your store</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} border border-dark-border p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-light text-light">{statValues[i]}</p>
            <p className="text-xs text-muted tracking-wide mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-dark-card border border-dark-border p-6">
        <h2 className="text-sm text-light tracking-widest uppercase font-medium mb-5">
          Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted text-sm font-light">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="pb-3 text-xs text-muted tracking-widest uppercase font-medium">Order ID</th>
                  <th className="pb-3 text-xs text-muted tracking-widest uppercase font-medium">Customer</th>
                  <th className="pb-3 text-xs text-muted tracking-widest uppercase font-medium">Total</th>
                  <th className="pb-3 text-xs text-muted tracking-widest uppercase font-medium">Status</th>
                  <th className="pb-3 text-xs text-muted tracking-widest uppercase font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-dark-border/50">
                    <td className="py-3 text-sm text-light font-light">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 text-sm text-muted font-light">{order.customer?.name || 'Guest'}</td>
                    <td className="py-3 text-sm text-gold font-light">Rs. {order.total}</td>
                    <td className="py-3">
                      <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 font-medium
                        ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted font-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}