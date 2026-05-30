'use client'

import { motion } from 'framer-motion'

export function ProductSkeleton() {
  return (
    <div className="group block">
      <div className="relative aspect-[3/4] bg-dark-card border border-dark-border overflow-hidden mb-4">
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-dark-border/50"
        />
      </div>
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        className="h-4 w-3/4 bg-dark-card border border-dark-border mb-2"
      />
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="h-4 w-1/4 bg-dark-card border border-dark-border"
      />
    </div>
  )
}
