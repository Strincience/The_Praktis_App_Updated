import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Floating geometric shape ─────────────────────────────────────────────────
function FloatShape({ style, className, children }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

// ── Scrolling ticker ─────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'Creative Design', 'Video Editing', 'Brand Identity', 'Photography',
  'Content Creation', 'Real Projects', 'Get Paid', 'Grow Your Craft',
]

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div
      className="overflow-hidden border-y"
      style={{ borderColor: '#EEECEA', background: '#fff', padding: '10px 0' }}
    >
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5"
            style={{
              fontSize: '9px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#CCCCCC',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
            <span
              style={{ width: 3, height: 3, borderRadius: '50%', background: '#FF6B2C', flexShrink: 0, display: 'inline-block' }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef(null)
  const spotRef = useRef(null)
  const curRef = useRef(null)
  const ringRef = useRef(null)
  const trailsRef = useRef([])

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  // Custom cursor + spotlight
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (spotRef.current) {
        spotRef.current.style.left = `${x}px`
        spotRef.current.style.top = `${y}px`
      }
      if (curRef.current) {
        curRef.current.style.left = `${x}px`
        curRef.current.style.top = `${y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${x}px`
        ringRef.current.style.top = `${y}px`
      }

      // Trail dot
      const dot = document.createElement('div')
      dot.style.cssText = `
        position:absolute;width:5px;height:5px;border-radius:50%;
        background:#FF6B2C;pointer-events:none;
        transform:translate(-50%,-50%);z-index:98;
        left:${x}px;top:${y}px;opacity:0.65;
      `
      hero.appendChild(dot)
      setTimeout(() => {
        dot.style.transition = 'opacity 0.5s'
        dot.style.opacity = '0'
        setTimeout(() => dot.remove(), 500)
      }, 40)
    }

    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <section
        ref={heroRef}
        className="relative overflow-hidden hero-cursor-hidden"
        style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Top brand accent line */}
        <div
          style={{ height: 3, background: 'linear-gradient(90deg,#FF6B2C,#FF3E7A,#7B3FE4)' }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #D0D0CC 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.4,
          }}
        />

        {/* Cursor spotlight — warm orange radial */}
        <div
          ref={spotRef}
          className="absolute pointer-events-none"
          style={{
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,44,0.07) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.1s, top 0.1s',
            zIndex: 1,
            top: '50%',
            left: '50%',
          }}
        />

        {/* Custom cursor dot */}
        <div
          ref={curRef}
          className="absolute pointer-events-none"
          style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: '#FF6B2C',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.04s, top 0.04s',
            zIndex: 100,
            top: '50%', left: '50%',
          }}
        />

        {/* Cursor ring */}
        <div
          ref={ringRef}
          className="absolute pointer-events-none"
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,107,44,0.45)',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.11s, top 0.11s',
            zIndex: 99,
            top: '50%', left: '50%',
          }}
        />

        {/* Corner geometric accent — top right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, right: 0,
            width: 400, height: 400,
            background: 'conic-gradient(from 0deg at 100% 0%, #FF6B2C, #FF3E7A, #7B3FE4, #FF6B2C)',
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            opacity: 0.04,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, left: 0,
            width: 200, height: 200,
            background: '#7B3FE4',
            clipPath: 'polygon(0 100%, 100% 100%, 0 0)',
            opacity: 0.04,
          }}
        />

        {/* Floating shapes */}
        <FloatShape
          className="float-a"
          style={{ top: '14%', right: '14%' }}
        >
          <div
            style={{
              width: 50, height: 50,
              borderRadius: 10,
              background: '#FF6B2C',
              boxShadow: '0 8px 24px rgba(255,107,44,0.25)',
              opacity: 0.65,
            }}
          />
        </FloatShape>

        <FloatShape
          className="float-b"
          style={{ top: '55%', right: '9%' }}
        >
          <div
            style={{
              width: 38, height: 38,
              borderRadius: '50%',
              background: '#7B3FE4',
              boxShadow: '0 8px 24px rgba(123,63,228,0.25)',
              opacity: 0.6,
            }}
          />
        </FloatShape>

        <FloatShape
          className="float-c"
          style={{ top: '28%', right: '34%' }}
        >
          <div
            style={{
              width: 26, height: 26,
              background: '#FF3E7A',
              transform: 'rotate(45deg)',
              borderRadius: 4,
              boxShadow: '0 6px 16px rgba(255,62,122,0.25)',
              opacity: 0.55,
            }}
          />
        </FloatShape>

        <FloatShape
          className="float-d"
          style={{ top: '70%', right: '24%', opacity: 0.3 }}
        >
          <div style={{ width: 56, height: 1.5, background: '#FF6B2C' }} />
        </FloatShape>

        <FloatShape
          className="float-b"
          style={{ top: '42%', right: '20%', opacity: 0.18 }}
        >
          <div
            style={{
              width: 20, height: 20,
              border: '2px solid #7B3FE4',
              borderRadius: 4,
            }}
          />
        </FloatShape>

        {/* Main content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative flex-1 flex flex-col justify-center"
        >
          <div
            className="max-w-7xl mx-auto w-full px-6 md:px-10"
            style={{ paddingTop: 80, paddingBottom: 60 }}
          >
            {/* Blinking pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ marginBottom: 24 }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  border: '1px solid rgba(255,107,44,0.25)',
                  background: 'rgba(255,107,44,0.06)',
                  borderRadius: 100,
                  padding: '5px 14px',
                }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#FF6B2C',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#FF6B2C',
                    letterSpacing: '0.06em',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Community open — join today
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.04em',
                color: '#131311',
                marginBottom: 20,
              }}
            >
              The place<br />
              <span style={{ color: '#FF6B2C' }}>creatives</span><br />
              <span className="gradient-text">get better.</span>
            </motion.h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                color: '#6B6B6B',
                lineHeight: 1.78,
                maxWidth: 420,
                marginBottom: 28,
              }}
            >
              Praktis is where you stop watching tutorials and start making things.
              Real tracks, real projects, a community that holds you to your potential.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}
            >
              <a
                href="#join"
                className="btn-orange"
                style={{ fontSize: '0.82rem', padding: '11px 22px' }}
              >
                Join the Community
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#about"
                className="btn-ghost"
                style={{ fontSize: '0.82rem', padding: '11px 22px' }}
              >
                See the tracks
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              style={{
                display: 'flex',
                paddingTop: 20,
                borderTop: '1px solid #EEECEA',
                maxWidth: 480,
              }}
            >
              {[
                { num: '6+', label: 'Creative Tracks' },
                { num: 'Free', label: 'To Explore' },
                { num: 'Real', label: 'Paid Briefs' },
                { num: '₦2k', label: 'Full Access' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRight: i < 3 ? '1px solid #EEECEA' : 'none',
                    paddingRight: i < 3 ? 16 : 0,
                    marginRight: i < 3 ? 16 : 0,
                  }}
                >
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#131311', lineHeight: 1 }}>
                    {s.num}
                  </p>
                  <p style={{ fontSize: '10px', color: '#AAAAAA', marginTop: 3, letterSpacing: '0.04em' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1.5, height: 36, background: 'linear-gradient(to bottom, #FF6B2C, transparent)' }}
          />
          <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CCCCCC', fontFamily: "'Inter', sans-serif" }}>
            Scroll
          </span>
        </motion.div>
      </section>

      <Ticker />
    </>
  )
}
