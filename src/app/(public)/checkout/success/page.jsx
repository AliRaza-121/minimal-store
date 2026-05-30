'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const verifyPayment = async () => {
      const tracker = searchParams.get('tracker')
      const order_id = searchParams.get('order_id')
      const sig = searchParams.get('sig')
      const reference = searchParams.get('reference')

      if (!tracker || !order_id) {
        setStatus('invalid')
        return
      }

      try {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tracker, sig, reference, orderId: order_id })
        })
        const data = await res.json()
        
        if (data.success) {
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } catch (error) {
        setStatus('failed')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-dark-border border-t-gold rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-light text-light mb-2">Verifying Payment...</h2>
        <p className="text-muted font-light">Please do not close this page.</p>
      </div>
    )
  }

  if (status === 'invalid' || status === 'failed') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-light text-light mb-4">Payment Failed</h2>
        <p className="text-muted font-light mb-8 max-w-md mx-auto">
          We could not verify your payment. If money was deducted, it will be refunded automatically.
        </p>
        <Link 
          href="/checkout"
          className="inline-block py-4 px-8 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300"
        >
          Try Again
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-light text-light mb-4"
      >
        Payment Successful
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted font-light mb-8"
      >
        Your order has been confirmed. You will receive an email confirmation shortly.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link 
          href="/profile"
          className="w-full sm:w-auto py-4 px-8 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300"
        >
          View Order
        </Link>
        <Link 
          href="/shop"
          className="w-full sm:w-auto py-4 px-8 border border-dark-border text-light text-sm tracking-widest uppercase font-medium hover:border-gold hover:text-gold transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6">
      <div className="max-w-xl w-full bg-dark-card border border-dark-border p-8 sm:p-12">
        <Suspense fallback={
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-dark-border border-t-gold rounded-full animate-spin mx-auto mb-6" />
            <p className="text-muted font-light">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
