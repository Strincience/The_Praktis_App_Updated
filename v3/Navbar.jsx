import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const openModal = () => window.dispatchEvent(new Event('praktis:openModal'))

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
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      }`}
      style={{ borderColor: scrolled ? '#EEECEA' : 'transparent' }}
    >
      {/* Top brand line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] gradient-bg" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-sm"
          >
            <span className="text-white font-heading font-black text-sm">P</span>
          </div>
          <span
            className="font-heading font-bold text-lg tracking-tight"
            style={{ color: '#131311' }}
          >
            Praktis
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#about"
            className="font-body transition-colors hover:text-[#FF6B2C]"
            style={{ color: '#888' }}
          >
            About
          </a>
          <a
            href="#learn"
            className="font-body transition-colors hover:text-[#FF6B2C]"
            style={{ color: '#888' }}
          >
            Tracks
          </a>
          <a
            href="#how"
            className="font-body transition-colors hover:text-[#FF6B2C]"
            style={{ color: '#888' }}
          >
            How it works
          </a>
        </div>

        {/* CTA — fires the modal */}
        <button
          onClick={openModal}
          className="btn-orange font-heading font-bold text-white"
          style={{ fontSize: '0.8rem', padding: '9px 20px' }}
        >
          Join Now
        </button>
      </div>
    </motion.nav>
  )
}
