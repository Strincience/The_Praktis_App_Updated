import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STAGES = [
  {
    num: '01',
    name: 'Novice',
    icon: '🧑‍💻',
    quote: '"You have ideas. They stay in your head. That changes here."',
    items: [
      { icon: '📺', text: 'Watching other people create' },
      { icon: '📌', text: 'Saving inspiration you never act on' },
      { icon: '🔄', text: 'Restarting from scratch every Monday' },
      { icon: '😶', text: 'No output. No proof of skill.' },
    ],
    progress: 4,
    badgeColor: '#C8C8C4',
    bgColor: '#F5F5F2',
    visualBg: '#EFEFEC',
    accentColor: '#C8C8C4',
    textColor: '#AAAAAA',
    desaturate: true,
  },
  {
    num: '02',
    name: 'Learner',
    icon: '🎨',
    quote: '"You start. It\'s rough. That\'s exactly right. Keep going."',
    items: [
      { icon: '✏️', text: 'Making your first real designs' },
      { icon: '📐', text: 'Getting familiar with the tools' },
      { icon: '💬', text: 'Receiving your first feedback' },
      { icon: '📱', text: 'Showing up to daily practice' },
    ],
    progress: 25,
    badgeColor: '#FF6B2C',
    bgColor: '#FFFAF7',
    visualBg: '#FFF3EE',
    accentColor: '#FF6B2C',
    textColor: '#FF6B2C',
    borderColor: 'rgba(255,107,44,0.2)',
    progressFill: 'linear-gradient(90deg,#FF6B2C,#FF8C55)',
  },
  {
    num: '03',
    name: 'Maker',
    icon: '🖥',
    quote: '"You\'re making things consistently. People are starting to notice."',
    items: [
      { icon: '📁', text: 'A portfolio that\'s actually growing' },
      { icon: '🤝', text: 'Collaborating with the community' },
      { icon: '🎯', text: 'Working on real project briefs' },
      { icon: '⭐', text: 'Earning recognition for your work' },
    ],
    progress: 50,
    badgeColor: '#FF3E7A',
    bgColor: '#FFFBFD',
    visualBg: '#FFF0F5',
    accentColor: '#FF3E7A',
    textColor: '#FF3E7A',
    borderColor: 'rgba(255,62,122,0.2)',
    progressFill: 'linear-gradient(90deg,#FF6B2C,#FF3E7A)',
  },
  {
    num: '04',
    name: 'Craftsman',
    icon: '💼',
    quote: '"Your work is getting paid for. Your craft is becoming your career."',
    items: [
      { icon: '💰', text: 'Paid client briefs through Praktis' },
      { icon: '🏆', text: 'Industry-level recognition' },
      { icon: '🧑‍🏫', text: 'Mentoring the next generation' },
      { icon: '📈', text: 'Real career momentum building' },
    ],
    progress: 75,
    badgeColor: '#7B3FE4',
    bgColor: '#FDFBFF',
    visualBg: '#F6F0FF',
    accentColor: '#7B3FE4',
    textColor: '#7B3FE4',
    borderColor: 'rgba(123,63,228,0.2)',
    progressFill: 'linear-gradient(90deg,#FF6B2C,#FF3E7A,#7B3FE4)',
  },
  {
    num: '05',
    name: 'Grandmaster',
    icon: '👑',
    quote: '"You didn\'t find your talent. You built it — one practice at a time."',
    items: [
      { icon: '🎬', text: 'Leading full creative direction' },
      { icon: '🌍', text: 'World-class output, real clients' },
      { icon: '💡', text: 'Teaching and inspiring others' },
      { icon: '✨', text: 'Creativity as a career, fully lived' },
    ],
    progress: 100,
    badgeColor: 'linear-gradient(135deg,#FF6B2C,#FF3E7A,#7B3FE4)',
    bgColor: '#FFFDF8',
    visualBg: 'linear-gradient(135deg,rgba(255,107,44,0.06),rgba(123,63,228,0.06))',
    accentColor: '#FF6B2C',
    textColor: 'gradient',
    borderColor: 'rgba(255,107,44,0.28)',
    progressFill: 'linear-gradient(90deg,#FF6B2C,#FF3E7A,#7B3FE4)',
    isGrand: true,
  },
]

// ── Stage card ────────────────────────────────────────────────────────────────
function StageCard({ stage, isActive }) {
  return (
    <div
      style={{
        background: stage.bgColor,
        borderRadius: 16,
        border: `1.5px solid ${stage.borderColor || '#E8E8E4'}`,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top */}
      <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: stage.isGrand
              ? 'linear-gradient(135deg,#FF6B2C,#FF3E7A,#7B3FE4)'
              : stage.badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 900,
            fontSize: 14,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {stage.num}
        </div>
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA', fontFamily: "'Poppins', sans-serif", marginBottom: 2 }}>
            Level {stage.num} of {STAGES.length}
          </p>
          {stage.textColor === 'gradient'
            ? (
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.6rem', lineHeight: 1, letterSpacing: '-0.03em', background: 'linear-gradient(135deg,#FF6B2C,#FF3E7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {stage.name}
              </p>
            ) : (
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.6rem', lineHeight: 1, letterSpacing: '-0.03em', color: stage.desaturate ? '#AAAAAA' : '#131311' }}>
                {stage.name}
              </p>
            )}
        </div>
      </div>

      {/* Visual */}
      <div
        style={{
          margin: '0 20px 16px',
          height: 110,
          borderRadius: 10,
          background: stage.visualBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          filter: stage.desaturate ? 'saturate(0.12)' : 'none',
        }}
      >
        {stage.icon}
      </div>

      {/* Quote */}
      <p style={{ fontSize: '11.5px', color: '#888', padding: '0 24px 14px', lineHeight: 1.65, fontStyle: 'italic' }}>
        {stage.quote}
      </p>

      {/* Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '0 20px 18px' }}>
        {stage.items.map((item, i) => (
          <div
            key={i}
            style={{
              background: '#FAFAF8',
              border: `0.5px solid ${stage.borderColor || '#EEECEA'}`,
              borderRadius: 8,
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: '10px', color: '#666', lineHeight: 1.3 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ padding: '0 20px 20px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AAAAAA' }}>
            Practice progress
          </span>
          {stage.textColor === 'gradient'
            ? <span style={{ fontSize: '9px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", background: 'linear-gradient(90deg,#FF6B2C,#FF3E7A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stage.progress}%</span>
            : <span style={{ fontSize: '9px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: stage.desaturate ? '#CCCCCC' : stage.accentColor }}>{stage.progress}%</span>
          }
        </div>
        <div style={{ height: 4, borderRadius: 2, background: '#F0EFEB', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={isActive ? { width: `${stage.progress}%` } : { width: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', borderRadius: 2, background: stage.progressFill || stage.accentColor }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Transformation() {
  const wrapperRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileStage, setMobileStage] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll-jacked horizontal parallax (desktop only)
  useEffect(() => {
    if (isMobile) return
    const handleScroll = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const scrollable = wrapperRef.current.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const p = Math.min(1, scrolled / scrollable)
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  const translateX = -(progress * (STAGES.length - 1) * 100)
  const activeStage = Math.min(STAGES.length - 1, Math.round(progress * (STAGES.length - 1)))

  // Mobile: simple arrow navigation
  if (isMobile) {
    return (
      <section style={{ background: '#FAFAF8', padding: '64px 0 0' }}>
        {/* Header */}
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 16, height: 1.5, background: '#FF6B2C' }} />
            <span className="section-label">Your Creative Journey</span>
          </div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.9rem', color: '#131311', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            From novice to{' '}
            <span className="gradient-text">grandmaster.</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#888', marginTop: 8, lineHeight: 1.65 }}>
            Navigate through each stage to see what your practice builds into.
          </p>
        </div>

        {/* Single stage card */}
        <div style={{ padding: '0 20px', height: 560 }}>
          <StageCard stage={STAGES[mobileStage]} isActive={true} />
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 36px' }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileStage(i)}
                style={{
                  height: 5,
                  width: i === mobileStage ? 28 : 18,
                  borderRadius: 3,
                  border: 'none',
                  background: i === mobileStage ? '#FF6B2C' : '#E0E0DC',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMobileStage(s => Math.max(0, s - 1))}
              disabled={mobileStage === 0}
              style={{
                width: 34, height: 34,
                borderRadius: 8,
                border: '1.5px solid #E0E0DC',
                background: 'transparent',
                color: '#888',
                cursor: mobileStage === 0 ? 'default' : 'pointer',
                opacity: mobileStage === 0 ? 0.25 : 1,
                fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ←
            </button>
            <button
              onClick={() => setMobileStage(s => Math.min(STAGES.length - 1, s + 1))}
              disabled={mobileStage === STAGES.length - 1}
              style={{
                width: 34, height: 34,
                borderRadius: 8,
                border: '1.5px solid #E0E0DC',
                background: 'transparent',
                color: '#888',
                cursor: mobileStage === STAGES.length - 1 ? 'default' : 'pointer',
                opacity: mobileStage === STAGES.length - 1 ? 0.25 : 1,
                fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Desktop: scroll-jacked horizontal parallax
  return (
    // Tall wrapper — creates scroll space for the horizontal journey
    <div
      ref={wrapperRef}
      style={{ height: `${STAGES.length * 100}vh` }}
    >
      {/* Sticky container — stays in viewport while scrolling through wrapper */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#FAFAF8',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '52px 48px 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 18, height: 1.5, background: '#FF6B2C' }} />
                <span className="section-label">Your Creative Journey</span>
              </div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#131311', letterSpacing: '-0.04em', lineHeight: 1 }}>
                From novice to{' '}
                <span className="gradient-text">grandmaster.</span>
              </h2>
            </div>

            {/* Stage indicator dots */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {STAGES.map((s, i) => (
                <div
                  key={i}
                  style={{
                    height: 5,
                    width: i === activeStage ? 28 : 18,
                    borderRadius: 3,
                    background: i === activeStage ? '#FF6B2C' : '#E0E0DC',
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
              <span
                style={{
                  marginLeft: 8,
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#FF6B2C',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.06em',
                }}
              >
                {String(activeStage + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Scroll hint */}
          <p
            style={{
              fontSize: '10px',
              color: '#CCCCCC',
              marginTop: 8,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
            Scroll to move through the journey
          </p>
        </div>

        {/* Horizontal sliding track */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '0 48px 48px' }}>
          <div
            className="transform-track"
            style={{
              display: 'flex',
              width: `${STAGES.length * 100}vw`,
              gap: 24,
              height: '100%',
              transform: `translateX(calc(${translateX}vw + ${Math.abs(translateX) > 0 ? (activeStage * 24) : 0}px * -1))`,
            }}
          >
            {STAGES.map((stage, i) => {
              const stageWidth = `calc(100vw - 96px)`
              return (
                <div
                  key={i}
                  style={{
                    width: stageWidth,
                    flexShrink: 0,
                    height: '100%',
                  }}
                >
                  <StageCard stage={stage} isActive={i === activeStage} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
