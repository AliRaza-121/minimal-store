import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import CartDrawer from '@/components/CartDrawer'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    template: '%s | MINIMAL',
    default: 'MINIMAL | Timeless pieces for modern living',
  },
  description: 'Curated essentials for the modern lifestyle. Timeless design, exceptional quality, crafted without compromise.',
  openGraph: {
    title: 'MINIMAL',
    description: 'Timeless pieces for modern living.',
    url: 'https://minimal-store.example.com',
    siteName: 'MINIMAL',
    images: [
      {
        url: 'https://minimal-store.example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MINIMAL Storefront',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MINIMAL',
    description: 'Timeless pieces for modern living.',
    images: ['https://minimal-store.example.com/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <FavoritesProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </FavoritesProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}