'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarLinks = [
  {
    section: 'Main',
    items: [
      {
        name: 'Dashboard',
        href: '/admin',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Management',
    items: [
      {
        name: 'Products',
        href: '/admin/products',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        ),
      },
      {
        name: 'Categories',
        href: '/admin/categories',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
        ),
      },
      {
        name: 'Lookbook',
        href: '/admin/lookbook',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5Z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Users',
    items: [
      {
        name: 'All Users',
        href: '/admin/users',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Orders',
    items: [
      {
        name: 'All Orders',
        href: '/admin/orders',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        ),
      },
    ],
  },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setIsAcceptingOrders(data.settings.isAcceptingOrders)
        }
      })
      .catch(err => console.error('Failed to fetch settings:', err))
  }, [])

  const toggleStoreStatus = async () => {
    const newState = !isAcceptingOrders
    setIsAcceptingOrders(newState)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAcceptingOrders: newState })
      })
      window.dispatchEvent(new CustomEvent('storeStatusChanged', { detail: newState }))
    } catch (err) {
      console.error('Failed to update settings:', err)
      setIsAcceptingOrders(!newState) // revert on fail
    }
  }

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="min-h-screen bg-dark-bg flex overflow-x-hidden">
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={closeMobile} />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-dark-card border-r border-dark-border flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-hidden transition-all duration-300
          ${collapsed ? 'w-[80px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-dark-border overflow-hidden whitespace-nowrap">
          <Link href="/admin" className={`flex items-center transition-all duration-300 ${collapsed ? 'gap-0' : 'gap-2.5'}`} onClick={closeMobile}>
            <div className="w-2 h-2 bg-gold rotate-45 flex-shrink-0" />
            <span className={`text-sm tracking-[0.2em] font-light text-light transition-all duration-300 overflow-hidden ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>MINIMAL</span>
          </Link>
          <button onClick={toggleSidebar} className="text-muted hover:text-light transition-colors flex-shrink-0 ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed && !mobileOpen ? "M8.25 4.5l7.5 7.5-7.5 7.5" : "M15.75 19.5 8.25 12l7.5-7.5"} />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className={`flex-1 py-6 px-3 overflow-y-auto overflow-x-hidden transition-all duration-300 ${collapsed ? 'space-y-2' : 'space-y-8'}`}>
          {sidebarLinks.map((group) => (
            <div key={group.section}>
              <p className={`text-[10px] text-muted tracking-[0.2em] uppercase transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed ? 'opacity-0 max-w-0 h-0 mb-0 px-0' : 'opacity-100 max-w-[200px] h-auto mb-3 px-3'}`}>
                {group.section}
              </p>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMobile}
                      className={`flex items-center px-3 py-2.5 rounded-sm transition-all duration-200 group overflow-hidden
                        ${isActive
                          ? 'bg-gold/10 text-gold'
                          : 'text-muted hover:text-light hover:bg-dark-bg'
                        } ${collapsed ? 'justify-center' : 'gap-3'}`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-gold' : 'text-muted group-hover:text-light transition-colors'}`}>
                        {item.icon}
                      </span>
                      <span className={`text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <div className={`ml-auto w-1 h-1 rounded-full bg-gold flex-shrink-0 transition-all duration-300 ${collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom user info */}
        <div className="p-4 border-t border-dark-border overflow-hidden whitespace-nowrap">
          <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center gap-0' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-medium">A</span>
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px]'}`}>
              <p className="text-sm text-light font-light truncate">Admin User</p>
              <p className="text-[10px] text-muted tracking-wide">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 overflow-x-hidden transition-all duration-300 md:ml-[80px] ${!collapsed ? 'md:ml-[260px]' : ''}`}>
        {/* Top bar */}
        <div className="h-16 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button onClick={toggleSidebar} className="md:hidden text-muted hover:text-light">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <p className="text-sm text-light font-light tracking-wide">
              {sidebarLinks.flatMap(g => g.items).find(i => i.href === pathname)?.name || 'Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-muted tracking-widest uppercase">
                {isAcceptingOrders ? 'Store Open' : 'Store Closed'}
              </span>
              <button 
                onClick={toggleStoreStatus}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isAcceptingOrders ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}
              >
                <div className={`w-3 h-3 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${isAcceptingOrders ? 'bg-emerald-400 right-1' : 'bg-red-400 left-1'}`} />
              </button>
            </div>
            <Link href="/" className="text-xs text-muted hover:text-light tracking-widest uppercase transition-colors">
              View Store
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}