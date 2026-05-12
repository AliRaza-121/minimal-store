import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import CartDrawer from '@/components/CartDrawer'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MINIMAL',
  description: 'Timeless pieces for modern living',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}