'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useFavorites } from '@/context/FavoritesContext'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  const { cartCount, setIsOpen } = useCart()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'bg-dark-bg/85 backdrop-blur-xl shadow-2xl shadow-black/20'
            : 'bg-transparent'
          }`}
      >
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-500
          ${scrolled
            ? 'bg-gradient-to-r from-transparent via-gold/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-gold/10 to-transparent'
          }`} 
        />

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 45, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-2.5 h-2.5 bg-gold rotate-45"
            />
            <span className="text-lg tracking-[0.3em] font-light text-light group-hover:text-gold transition-colors duration-300">
              MINIMAL
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative text-sm text-muted hover:text-light transition-colors duration-300 tracking-widest uppercase font-light py-2"
              >
                {link.name}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.name ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold origin-left"
                />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            
            {/* Favorites */}
            <Link href="/favorites" className="relative text-muted hover:text-light transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <AnimatePresence>
                {favorites.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-gold text-dark-bg text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative text-muted hover:text-light transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-gold text-dark-bg text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 w-4.5 h-4.5 rounded-full bg-gold/30"
                />
              )}
            </motion.button>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                {user.role !== 'customer' && (
                  <Link href="/admin" className="text-sm text-muted hover:text-gold transition-colors duration-300 tracking-widest uppercase font-light">
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="text-sm text-muted hover:text-light transition-colors duration-300 tracking-widest uppercase font-light">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-muted hover:text-light transition-colors duration-300 tracking-widest uppercase font-light"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block text-sm text-muted hover:text-gold transition-colors duration-300 tracking-widest uppercase font-light">
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-[1px] bg-muted block"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-[1px] bg-muted block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-[1px] bg-muted block"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-dark-bg/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 text-muted hover:text-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-light tracking-[0.2em] uppercase text-muted hover:text-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <>
                  {user.role !== 'customer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-light tracking-[0.2em] uppercase text-muted hover:text-gold transition-colors duration-300"
                      >
                        Admin
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="text-2xl font-light tracking-[0.2em] uppercase text-muted hover:text-gold transition-colors duration-300"
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <button
                      onClick={() => { logout(); setMobileOpen(false) }}
                      className="text-2xl font-light tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-light tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}