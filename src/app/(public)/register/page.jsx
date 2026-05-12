'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Register() {
  const [step, setStep] = useState('email') // email | otp
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'register' }),
      })
      const data = await res.json()

      if (data.success) {
        setMessage('OTP sent to your email')
        setStep('otp')
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type: 'register', name, password }),
      })
      const data = await res.json()

      if (data.success) {
        window.location.href = '/'
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'register' }),
      })
      const data = await res.json()

      if (data.success) {
        setMessage('OTP resent to your email')
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-gold rotate-45" />
            <span className="text-lg tracking-[0.3em] font-light text-light">MINIMAL</span>
          </Link>
        </div>

        <div className="bg-dark-card border border-dark-border p-8">
          <h1 className="text-2xl font-light text-light text-center mb-2">
            {step === 'email' ? 'Create account' : 'Check your email'}
          </h1>
          <p className="text-sm text-muted text-center font-light mb-8">
            {step === 'email'
              ? 'Join the MINIMAL community'
              : `We sent a 6-digit code to ${email}`}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-light px-4 py-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-light px-4 py-3 mb-6"
            >
              {message}
            </motion.div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-[10px] text-muted tracking-widest uppercase mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full bg-dark-bg border border-dark-border text-light text-2xl font-light text-center tracking-[0.5em] px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors"
                  placeholder="000000"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading || otp.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gold text-dark-bg text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Create Account'}
              </motion.button>

              <button
                type="button"
                onClick={handleResendOTP}
                className="w-full text-center text-sm text-muted hover:text-gold tracking-wide transition-colors"
              >
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); setMessage('') }}
                className="w-full text-center text-sm text-muted hover:text-light tracking-wide transition-colors"
              >
                ← Back
              </button>
            </form>
          )}

          <p className="text-sm text-muted text-center font-light mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}