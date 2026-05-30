'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Icons
const Icons = {
  Products: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>,
  Orders: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>,
  Users: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
  Revenue: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
}

const stats = [
  { id: 'products', label: 'Total Products', icon: Icons.Products },
  { id: 'orders', label: 'Total Orders', icon: Icons.Orders },
  { id: 'users', label: 'Total Users', icon: Icons.Users },
  { id: 'revenue', label: 'Revenue', icon: Icons.Revenue },
]

export default function AdminDashboard() {
  const [data, setData] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState([])
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchSettings()

    const handleStatusChange = (e) => {
      setIsAcceptingOrders(e.detail)
    }
    window.addEventListener('storeStatusChanged', handleStatusChange)
    return () => window.removeEventListener('storeStatusChanged', handleStatusChange)
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success && data.settings) {
        setIsAcceptingOrders(data.settings.isAcceptingOrders)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

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
      
      const mockHistorical = []
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()
      let remainingRev = totalRevenue
      
      for(let i=11; i>=0; i--) {
        const monthRev = i === 0 ? remainingRev : Math.floor(Math.random() * (remainingRev / (i + 1)) * 1.5)
        remainingRev -= monthRev
        const monthIndex = (currentMonth - i + 12) % 12
        mockHistorical.push({
          name: months[monthIndex],
          revenue: monthRev > 0 ? monthRev : 0
        })
      }
      setChartData([...mockHistorical].reverse().slice(0, 7).reverse()) // Last 7 months
      
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const statValues = {
    products: data.products,
    orders: data.orders,
    users: data.users,
    revenue: `Rs. ${data.revenue.toLocaleString()}`
  }

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-light text-light tracking-wide">Command Center</h1>
          <p className="text-muted text-xs tracking-widest uppercase mt-3">Welcome back, Admin</p>
        </div>
        <p className="text-xs text-muted font-light">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative bg-dark-card border border-dark-border p-6 sm:p-8 overflow-hidden hover:border-gold/50 transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 p-6 text-gold/20 group-hover:text-gold/40 transition-colors duration-500 group-hover:scale-110 transform">
              {stat.icon}
            </div>
            <p className="text-[10px] text-muted tracking-widest uppercase relative z-10">{stat.label}</p>
            <p className="text-3xl sm:text-4xl font-light text-light mt-6 truncate relative z-10">{statValues[stat.id]}</p>
            
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-dark-card border border-dark-border p-6 sm:p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs text-light tracking-widest uppercase font-medium">Revenue Pulse</h2>
            <span className="text-[10px] text-gold tracking-widest uppercase">Last 7 Months</span>
          </div>
          
          <div className="flex-1 flex gap-2 sm:gap-4 h-64 pt-6">
            {chartData.map((item, index) => {
              const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 2)
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full relative h-full flex items-end justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="w-full max-w-[40px] bg-dark-border group-hover:bg-gold/80 transition-colors duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-dark-bg border border-dark-border px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <p className="text-[10px] text-gold tracking-widest">Rs. {item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted uppercase tracking-widest">{item.name}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Control Panel */}
        <div className="space-y-6 flex flex-col">
          
          {/* Store Status */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className={`p-8 border shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500 relative overflow-hidden ${isAcceptingOrders ? 'bg-dark-card border-dark-border' : 'bg-red-950/20 border-red-900/50'}`}
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
             <div className="flex items-center justify-between mb-6 relative z-10">
               <h3 className="text-xs text-muted tracking-widest uppercase font-medium">Store Status</h3>
               <div className="flex items-center justify-center w-6 h-6 rounded-full bg-dark-bg border border-dark-border">
                 <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${isAcceptingOrders ? 'bg-emerald-400 text-emerald-400 animate-pulse' : 'bg-red-500 text-red-500'}`} />
               </div>
             </div>
             <p className={`text-xl font-light relative z-10 ${isAcceptingOrders ? 'text-light' : 'text-red-400'}`}>
               {isAcceptingOrders ? 'Online & Active' : 'Checkout Disabled'}
             </p>
             <p className="text-xs text-muted font-light mt-2 relative z-10">
               {isAcceptingOrders ? 'Customers can place orders.' : 'Store is currently locked.'}
             </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="flex-1 bg-dark-card border border-dark-border p-8"
          >
            <h2 className="text-xs text-muted tracking-widest uppercase font-medium mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/admin/products" className="flex items-center justify-between group py-2 border-b border-dark-border/50">
                <span className="text-sm text-light font-light group-hover:text-gold transition-colors">Manage Inventory</span>
                <span className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all">→</span>
              </Link>
              <Link href="/admin/orders" className="flex items-center justify-between group py-2 border-b border-dark-border/50">
                <span className="text-sm text-light font-light group-hover:text-gold transition-colors">Review Orders</span>
                <span className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all">→</span>
              </Link>
              <Link href="/admin/users" className="flex items-center justify-between group py-2">
                <span className="text-sm text-light font-light group-hover:text-gold transition-colors">Customer Database</span>
                <span className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Recent orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="bg-dark-card border border-dark-border overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-dark-border">
          <h2 className="text-xs text-light tracking-widest uppercase font-medium">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-[10px] text-muted tracking-widest uppercase hover:text-gold transition-colors flex items-center gap-2 group">
            View Ledger <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted text-sm font-light">No transactions recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-4 px-6 sm:px-8 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20">Order ID</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium hidden sm:table-cell border-b border-dark-border bg-dark-bg/20">Customer</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20">Total</th>
                  <th className="py-4 px-6 text-[10px] text-muted tracking-widest uppercase font-medium border-b border-dark-border bg-dark-bg/20">Status</th>
                  <th className="py-4 px-6 sm:px-8 text-[10px] text-muted tracking-widest uppercase font-medium hidden md:table-cell border-b border-dark-border bg-dark-bg/20 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order._id} className="group hover:bg-dark-bg/40 transition-colors">
                    <td className={`py-4 px-6 sm:px-8 border-dark-border/40 ${index !== recentOrders.length - 1 ? 'border-b' : ''}`}>
                      <span className="text-sm text-gold font-mono tracking-wide">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted block sm:hidden mt-1 truncate max-w-[120px]">
                        {order.customer?.name || 'Guest'}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-sm text-light font-light hidden sm:table-cell border-dark-border/40 ${index !== recentOrders.length - 1 ? 'border-b' : ''}`}>
                      {order.customer?.name || 'Guest'}
                    </td>
                    <td className={`py-4 px-6 border-dark-border/40 ${index !== recentOrders.length - 1 ? 'border-b' : ''}`}>
                      <span className="text-sm text-light font-light whitespace-nowrap">Rs. {order.total.toLocaleString()}</span>
                    </td>
                    <td className={`py-4 px-6 border-dark-border/40 ${index !== recentOrders.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-400' :
                          order.status === 'confirmed' ? 'bg-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-400' :
                          'bg-emerald-400'
                        }`} />
                        <span className="text-[10px] tracking-widest uppercase text-muted">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 sm:px-8 text-xs text-muted font-light hidden md:table-cell border-dark-border/40 text-right ${index !== recentOrders.length - 1 ? 'border-b' : ''}`}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}