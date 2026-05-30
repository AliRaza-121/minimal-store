'use client'

import Link from 'next/link'
import { useState } from 'react'

const footerLinks = {
  Shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Menswear', href: '/shop?category=Men' },
    { name: 'Womenswear', href: '/shop?category=Women' },
    { name: 'Accessories', href: '/shop?category=Accessories' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
}

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
        <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 5000)
    }, 1000)
  }

  return (
    <footer className="border-t border-dark-border bg-dark-bg">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-24 pb-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand column */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-gold rotate-45" />
              <span className="text-xl tracking-[0.3em] font-light text-light">MINIMAL</span>
            </Link>
            <p className="text-muted text-sm font-light leading-relaxed mb-10 max-w-sm">
              Curated essentials for the modern lifestyle. Timeless design, exceptional quality, crafted without compromise.
            </p>
            
            {/* Newsletter */}
            <div className="mb-10 w-full max-w-sm">
              <h4 className="text-xs text-light tracking-widest uppercase font-medium mb-4">
                Join the Archive
              </h4>
              {status === 'success' ? (
                <div className="flex items-center gap-3 py-2 text-sm text-gold font-light border-b border-gold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>Welcome. You are on the list.</span>
                </div>
              ) : (
                <form className="flex border-b border-dark-border focus-within:border-gold transition-colors pb-2" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" 
                    className="bg-transparent border-none outline-none text-sm text-light font-light w-full placeholder-muted/60 disabled:opacity-50"
                    required
                    disabled={status === 'loading'}
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="text-xs text-gold uppercase tracking-widest hover:text-light transition-colors ml-4 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
            
            {/* Social icons */}
            <div className="flex items-center gap-5 mt-auto">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-gold transition-colors duration-300"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 xl:col-span-7 xl:col-start-6 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-xs text-light tracking-[0.2em] uppercase font-medium mb-6">
                  {heading}
                </h4>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted hover:text-light transition-colors duration-300 font-light"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted font-light order-2 md:order-1">
            &copy; {new Date().getFullYear()} MINIMAL. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 order-1 md:order-2">
            <Link href="/privacy" className="text-xs text-muted hover:text-light font-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted hover:text-light font-light transition-colors">
              Terms of Service
            </Link>
            <span className="text-xs text-muted font-light">
              PKR (Rs.)
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}