'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({ children }) {
  const pathname = usePathname()
  
  // Hide navbar and footer on login and register pages
  const hideLayout = pathname === '/login' || pathname === '/register' || pathname === '/login/admin'

  if (hideLayout) {
    return <main className="min-h-screen bg-dark-bg">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}