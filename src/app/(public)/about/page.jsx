'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const values = [
  { title: 'Ethical Sourcing', desc: 'We trace our materials from seed to stitch, ensuring fair wages and safe conditions for every worker.' },
  { title: 'Timeless Design', desc: 'We reject fast fashion trends in favor of enduring aesthetics that transcend seasons and years.' },
  { title: 'Premium Materials', desc: 'Only the highest quality organic cotton, linen, and recycled fibers make the cut for our collections.' },
  { title: 'Zero Waste Aim', desc: 'Our packaging is 100% recyclable, and we continuously optimize our cutting processes to minimize fabric waste.' },
]

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-20">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Our Heritage</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4 mb-8">
            The MINIMAL Story
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-8" />
          <p className="text-muted text-lg font-light leading-relaxed max-w-2xl mx-auto">
            MINIMAL was born from a desire to strip away the excess. In a world cluttered with fast fashion 
            and fleeting trends, we set out to create a wardrobe of enduring essentials. Every piece we design 
            is an exercise in restraint—focusing purely on impeccable fit, premium materials, and timeless aesthetics.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-dark-card border border-dark-border p-8">
            <h3 className="text-gold text-sm tracking-widest uppercase font-medium mb-4">Our Philosophy</h3>
            <p className="text-muted text-sm font-light leading-relaxed">
              We believe that true luxury lies in simplicity. A well-crafted garment shouldn't scream for attention; 
              it should quietly elevate the wearer. By focusing on fundamental silhouettes and a monochromatic palette, 
              we create clothes that form the quiet, confident foundation of your personal style.
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border p-8">
            <h3 className="text-gold text-sm tracking-widest uppercase font-medium mb-4">Our Craft</h3>
            <p className="text-muted text-sm font-light leading-relaxed">
              Quality takes time. We partner with multi-generational ateliers who share our obsession with detail. 
              From the tension of the thread to the drape of the fabric, every aspect of a MINIMAL garment is 
              obsessively engineered to last a lifetime.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Our Promise</span>
          <h2 className="text-2xl sm:text-3xl font-light text-light mt-4">Uncompromising Standards</h2>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-card border border-dark-border p-6 text-center hover:border-gold/30 transition-colors"
            >
              <h4 className="text-sm text-light font-medium mb-3 tracking-wide">{val.title}</h4>
              <p className="text-xs text-muted leading-relaxed font-light">{val.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative aspect-video border border-dark-border overflow-hidden"
        >
          <Image 
            src="/hero-bg.jpg" 
            alt="MINIMAL Atelier" 
            fill
            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-dark-bg/40 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-light text-sm tracking-[0.4em] uppercase font-light border border-gold/30 px-6 py-3 backdrop-blur-sm bg-dark-bg/30">
              Made to last
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}