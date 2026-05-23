import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

// Single helper — fires the global modal open event
const openModal = () => window.dispatchEvent(new Event('praktis:openModal'))

export default function JoinSection() {
  const [ref, inView] = useInView(0.15)

  return (
    <section
      id="join"
      ref={ref}
      style={{ background: '#131311' }}
      className="py-28 px-6 relative overflow-hidden"
    >
      {/* Subtle corner glow */}
      <div
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(255,107,44,0.08), transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(123,63,228,0.08), transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-5 h-px" style={{ background: '#FF6B2C' }} />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#FF6B2C',
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Community Open Now
          </span>
          <div className="w-5 h-px" style={{ background: '#FF6B2C' }} />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading font-black text-white mb-5"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
          }}
        >
          Your creativity<br />
          deserves a{' '}
          <span className="gradient-text">place to grow.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-body text-base mb-10 max-w-lg mx-auto leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Join free. Complete your Starter Week. Then decide if you want to
          go deeper. No pressure — just practice.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.38 }}
        >
          <button
            onClick={openModal}
            className="btn-orange font-heading font-bold text-white
                       inline-flex items-center gap-2.5 mx-auto"
            style={{
              fontSize: '1rem',
              padding: '14px 36px',
              boxShadow: '0 0 40px rgba(255,107,44,0.35)',
            }}
          >
            Join the Community
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          {[
            { icon: '✓', text: 'Free to join' },
            { icon: '✓', text: 'No card needed' },
            { icon: '✓', text: 'Starter Week begins immediately' },
          ].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 font-body"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}
            >
              <span style={{ color: '#FF6B2C', fontWeight: 700 }}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
