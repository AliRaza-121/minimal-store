'use client'

import { useState } from 'react'
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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-dark-bg flex">
      
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-dark-card border-r border-dark-border flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-dark-border">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-gold rotate-45" />
              <span className="text-sm tracking-[0.2em] font-light text-light">MINIMAL</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-2 h-2 bg-gold rotate-45 mx-auto" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted hover:text-light transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? "M8.25 4.5l7.5 7.5-7.5 7.5" : "M15.75 19.5 8.25 12l7.5-7.5"} />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto">
          {sidebarLinks.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <p className="text-[10px] text-muted tracking-[0.2em] uppercase px-3 mb-3">
                  {group.section}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group
                        ${isActive
                          ? 'bg-gold/10 text-gold'
                          : 'text-muted hover:text-light hover:bg-dark-bg'
                        }`}
                    >
                      <span className={isActive ? 'text-gold' : 'text-muted group-hover:text-light transition-colors'}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="text-sm font-light tracking-wide">{item.name}</span>
                      )}
                      {isActive && !collapsed && (
                        <div className="ml-auto w-1 h-1 rounded-full bg-gold" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom user info */}
        {!collapsed && (
          <div className="p-4 border-t border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold text-xs font-medium">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-light font-light truncate">Admin User</p>
                <p className="text-[10px] text-muted tracking-wide">Super Admin</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'}`}
      >
        {/* Top bar */}
        <div className="h-16 border-b border-dark-border bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div>
            <p className="text-sm text-light font-light tracking-wide">
              {sidebarLinks.flatMap(g => g.items).find(i => i.href === pathname)?.name || 'Dashboard'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted hover:text-light tracking-widest uppercase transition-colors">
              View Store
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}