'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const skills = [
  { name: 'Next.js', level: 'Expert' },
  { name: 'React.js', level: 'Expert' },
  { name: 'Node.js', level: 'Expert' },
  { name: 'Express.js', level: 'Expert' },
  { name: 'MongoDB', level: 'Expert' },
  { name: 'Tailwind CSS', level: 'Expert' },
  { name: 'JavaScript', level: 'Expert' },
  { name: 'REST APIs', level: 'Expert' },
]

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-20">
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Our Story</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-light mt-4 mb-8">
            About MINIMAL
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-8" />
          <p className="text-muted text-lg font-light leading-relaxed max-w-2xl mx-auto">
            MINIMAL was born from a passion for clean code and beautiful design. As a full-stack 
            developer, I built this platform from the ground up — combining the power of the MERN 
            stack with modern tools like Next.js and Tailwind CSS to create seamless, elegant 
            digital experiences. Every line of code is written with intention, just like every 
            product we feature.
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
            <h3 className="text-gold text-sm tracking-widest uppercase font-medium mb-4">Our Mission</h3>
            <p className="text-muted text-sm font-light leading-relaxed">
              To bridge the gap between stunning design and powerful functionality. We build 
              digital storefronts that don&apos;t just look good — they perform exceptionally, 
              providing users with fast, intuitive, and memorable shopping experiences.
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border p-8">
            <h3 className="text-gold text-sm tracking-widest uppercase font-medium mb-4">Our Values</h3>
            <p className="text-muted text-sm font-light leading-relaxed">
              Clean code, pixel-perfect design, and user-first thinking drive everything we do. 
              From the database to the UI, every layer is crafted with care — because great 
              software should feel invisible and effortless.
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
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">The Founder</span>
          <h2 className="text-2xl sm:text-3xl font-light text-light mt-4">Meet the developer behind MINIMAL</h2>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="flex justify-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-dark-card border border-dark-border p-8 max-w-sm w-full"
          >
            <div className="w-24 h-24 rounded-full bg-dark-bg border border-dark-border mx-auto mb-4 flex items-center justify-center">
              <span className="text-gold text-2xl font-light">AR</span>
            </div>
            <p className="text-lg text-light font-light">Ali Raza</p>
            <p className="text-sm text-gold mt-1">Founder & Full Stack Developer</p>
            <p className="text-xs text-muted mt-3 font-light leading-relaxed">
              MERN Stack developer passionate about building fast, beautiful, and functional 
              web applications. Specializing in Next.js, React, Node.js, and MongoDB.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-light">Expertise</span>
          <h2 className="text-2xl sm:text-3xl font-light text-light mt-4">Skills & Technologies</h2>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-dark-card border border-dark-border p-4 text-center"
            >
              <p className="text-sm text-light font-light">{skill.name}</p>
              <p className="text-xs text-gold mt-1">{skill.level}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}