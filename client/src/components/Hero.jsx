import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #FF6B2C, transparent)' }}
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #7B3FE4, transparent)' }}
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #FF3E7A, transparent)' }}
      />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block mb-6"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase px-4 py-2 rounded-full border border-[#FF6B2C]/30 text-[#FF6B2C] bg-[#FF6B2C]/5">
            Now Accepting Waitlist Applications
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6 text-dark"
        >
          Creativity is{' '}
          <span className="gradient-text">practiced.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-500 font-body mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Learn. Practice. Grow with Praktis, a community built for creative minds who are serious about building real skills.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#waitlist"
            className="gradient-bg text-white font-heading font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Join the Waitlist →
          </a>
          <a
            href="#about"
            className="bg-white text-dark font-heading font-semibold px-8 py-4 rounded-full text-base border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Learn More
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10 text-sm text-gray-400 font-body"
        >
          Join <span className="gradient-text font-semibold">creative minds</span> already on the waitlist
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 gradient-bg rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
