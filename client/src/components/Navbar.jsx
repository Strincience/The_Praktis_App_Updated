import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm"><img src="Launch\praktis-app\Praktis_Logo.jpeg" alt="" srcset="" /></span>
          </div>
          <span className="font-heading font-bold text-dark text-lg">Praktis</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-[#FF6B2C] transition-colors">About</a>
          <a href="#learn" className="hover:text-[#FF6B2C] transition-colors">What You'll Learn</a>
          <a href="#how" className="hover:text-[#FF6B2C] transition-colors">How It Works</a>
        </div>

        {/* CTA */}
        <a
          href="#waitlist"
          className="gradient-bg text-white font-heading font-semibold text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
        >
          Join Waitlist
        </a>
      </div>
    </motion.nav>
  )
}
