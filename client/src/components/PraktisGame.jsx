import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORD = ['P', 'R', 'A', 'K', 'T', 'I', 'S']
const LETTER_COLORS = [
  '#FF6B2C', '#FF8A5C', '#FF3E7A',
  '#C084FC', '#7B3FE4', '#FF6B2C', '#FF3E7A',
]
const LETTER_BGS = [
  'rgba(255,107,44,0.14)', 'rgba(255,138,92,0.14)', 'rgba(255,62,122,0.14)',
  'rgba(192,132,252,0.14)', 'rgba(123,63,228,0.14)', 'rgba(255,107,44,0.14)', 'rgba(255,62,122,0.14)',
]
const RANKS = ['Novice', 'Learner', 'Maker', 'Craftsman', 'Grandmaster']
const LETTER_SIZE = 54

// ── Game engine ──────────────────────────────────────────────────────────────
function useGameEngine(arenaRef, active) {
  const lettersRef = useRef([]) // { x, y, vx, vy, el, idx }
  const rafRef = useRef(null)
  const currentLetterRef = useRef(0)
  const scoreRef = useRef(0)
  const levelRef = useRef(1)
  const speedRef = useRef(1.4)

  const [displayState, setDisplayState] = useState({
    currentLetter: 0,
    score: 0,
    level: 1,
    speed: 1.4,
    rank: 'Novice',
    slots: WORD.map(() => false),
    flash: false,
    levelUpMsg: null,
    shaking: false,
  })

  const updateDisplay = useCallback(() => {
    setDisplayState(prev => ({
      ...prev,
      currentLetter: currentLetterRef.current,
      score: scoreRef.current,
      level: levelRef.current,
      speed: parseFloat(speedRef.current.toFixed(1)),
      rank: RANKS[levelRef.current - 1],
      slots: WORD.map((_, i) => i < currentLetterRef.current),
    }))
  }, [])

  const spawnLetters = useCallback(() => {
    if (!arenaRef.current) return
    const arena = arenaRef.current
    // Clear old letters
    lettersRef.current.forEach(lt => lt.el?.remove())
    lettersRef.current = []

    const W = arena.clientWidth - LETTER_SIZE
    const H = arena.clientHeight - LETTER_SIZE

    WORD.forEach((ch, i) => {
      const el = document.createElement('div')
      const isTgt = i === currentLetterRef.current
      el.className = 'game-letter' + (isTgt ? ' is-target' : '')
      el.textContent = ch
      el.style.cssText = `
        left: 0px; top: 0px;
        background: ${LETTER_BGS[i]};
        color: ${isTgt ? LETTER_COLORS[i] : 'rgba(255,255,255,0.2)'};
        border-color: ${isTgt ? LETTER_COLORS[i] : 'transparent'};
      `

      const x = 20 + Math.random() * (W - 40)
      const y = 20 + Math.random() * (H - 40)
      const angle = Math.random() * Math.PI * 2
      const speed = speedRef.current * (0.7 + Math.random() * 0.7)

      el.style.left = x + 'px'
      el.style.top = y + 'px'

      const lt = { el, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, idx: i }

      el.addEventListener('click', () => {
        if (!active) return
        if (i !== currentLetterRef.current) {
          // Wrong letter — shake
          setDisplayState(prev => ({ ...prev, shaking: true }))
          setTimeout(() => setDisplayState(prev => ({ ...prev, shaking: false })), 280)
          return
        }
        // Correct!
        el.classList.add('is-caught')
        currentLetterRef.current++
        updateDisplay()

        if (currentLetterRef.current >= WORD.length) {
          // Word complete
          scoreRef.current++
          setDisplayState(prev => ({ ...prev, flash: true }))
          setTimeout(() => setDisplayState(prev => ({ ...prev, flash: false })), 350)

          // Level up every 3 completions
          const newLevel = Math.min(5, Math.floor(scoreRef.current / 3) + 1)
          if (newLevel > levelRef.current) {
            levelRef.current = newLevel
            speedRef.current = 1.4 + (newLevel - 1) * 0.55
            const rankName = RANKS[newLevel - 1]
            setDisplayState(prev => ({ ...prev, levelUpMsg: rankName }))
            setTimeout(() => setDisplayState(prev => ({ ...prev, levelUpMsg: null })), 2200)
          }

          updateDisplay()
          // Respawn
          setTimeout(() => {
            currentLetterRef.current = 0
            spawnLetters()
            updateDisplay()
          }, 700)
        } else {
          // Highlight next target
          lettersRef.current.forEach((lt, j) => {
            if (!lt.el) return
            const isNowTgt = j === currentLetterRef.current
            lt.el.classList.toggle('is-target', isNowTgt)
            lt.el.style.color = isNowTgt ? LETTER_COLORS[j] : 'rgba(255,255,255,0.2)'
            lt.el.style.borderColor = isNowTgt ? LETTER_COLORS[j] : 'transparent'
            lt.el.style.boxShadow = isNowTgt ? `0 0 22px rgba(255,107,44,0.55)` : ''
          })
        }
      })

      arena.appendChild(el)
      lettersRef.current.push(lt)
    })
  }, [arenaRef, active, updateDisplay])

  // Animation loop
  useEffect(() => {
    if (!active) return

    const loop = () => {
      if (!arenaRef.current) { rafRef.current = requestAnimationFrame(loop); return }
      const W = arenaRef.current.clientWidth - LETTER_SIZE
      const H = arenaRef.current.clientHeight - LETTER_SIZE

      lettersRef.current.forEach(lt => {
        if (!lt.el || lt.el.classList.contains('is-caught')) return
        lt.x += lt.vx
        lt.y += lt.vy
        if (lt.x < 0) { lt.x = 0; lt.vx = Math.abs(lt.vx) }
        if (lt.x > W) { lt.x = W; lt.vx = -Math.abs(lt.vx) }
        if (lt.y < 0) { lt.y = 0; lt.vy = Math.abs(lt.vy) }
        if (lt.y > H) { lt.y = H; lt.vy = -Math.abs(lt.vy) }
        lt.el.style.left = lt.x + 'px'
        lt.el.style.top = lt.y + 'px'
      })
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, arenaRef])

  // Init on activation
  useEffect(() => {
    if (!active) {
      lettersRef.current.forEach(lt => lt.el?.remove())
      lettersRef.current = []
      currentLetterRef.current = 0
      scoreRef.current = 0
      levelRef.current = 1
      speedRef.current = 1.4
      return
    }
    spawnLetters()
    updateDisplay()
  }, [active, spawnLetters, updateDisplay])

  return { displayState }
}

// ── Preview card (light) ─────────────────────────────────────────────────────
function GamePreview({ onEnter }) {
  return (
    <section
      style={{
        background: '#FAFAF8',
        padding: '64px 24px',
        borderTop: '1px solid #EEECEA',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1.5px solid #EEECEA',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎮</div>

        <p
          style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#7B3FE4',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 8,
          }}
        >
          The Praktis Method
        </p>

        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 900,
            fontSize: '1.65rem',
            color: '#131311',
            letterSpacing: '-0.03em',
            marginBottom: 10,
          }}
        >
          Practice spells{' '}
          <span className="gradient-text">mastery.</span>
        </h2>

        <p
          style={{
            fontSize: '0.82rem',
            color: '#888',
            lineHeight: 1.7,
            maxWidth: 380,
            margin: '0 auto 28px',
          }}
        >
          Catch the letters <strong>P → R → A → K → T → I → S</strong> in order.
          Every completed word is one practice. Practice enough — and your rank climbs
          from Novice all the way to Grandmaster.
        </p>

        <button
          onClick={onEnter}
          style={{
            background: '#7B3FE4',
            color: '#fff',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '13px 32px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(123,63,228,0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Enter Practice Mode →
        </button>

        <p
          style={{
            fontSize: '10px',
            color: '#CCCCCC',
            marginTop: 12,
            letterSpacing: '0.04em',
          }}
        >
          Fullscreen dark mode • Click exit to return to the site
        </p>
      </motion.div>
    </section>
  )
}

// ── Fullscreen game (dark) ───────────────────────────────────────────────────
function FullscreenGame({ onExit }) {
  const arenaRef = useRef(null)
  const { displayState } = useGameEngine(arenaRef, true)
  const { currentLetter, score, level, speed, rank, slots, flash, levelUpMsg, shaking } = displayState

  return (
    <div className="game-fullscreen">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '20px 24px 16px',
          maxWidth: 900,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#7B3FE4',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: 4,
              }}
            >
              The Praktis Method
            </p>
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: '1.2rem',
                color: '#fff',
                letterSpacing: '-0.03em',
              }}
            >
              Practice spells{' '}
              <span className="gradient-text">mastery.</span>
            </h3>
          </div>

          <button
            onClick={onExit}
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              padding: '8px 18px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            ✕ Exit
          </button>
        </div>

        {/* Instruction + Next target */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 12,
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,107,44,0.08)',
              border: '1px solid rgba(255,107,44,0.2)',
              borderRadius: 100,
              padding: '5px 14px',
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}>
              Next
            </span>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: 16,
                color: '#FF6B2C',
              }}
            >
              {currentLetter < WORD.length ? WORD[currentLetter] : '✓'}
            </span>
          </div>

          {/* Word slots */}
          <div style={{ display: 'flex', gap: 5 }}>
            {WORD.map((ch, i) => (
              <div
                key={i}
                style={{
                  width: 34, height: 40,
                  borderRadius: 7,
                  border: `1px solid ${i < currentLetter ? '#FF6B2C' : 'rgba(255,255,255,0.08)'}`,
                  background: i < currentLetter ? 'rgba(255,107,44,0.08)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 900,
                  fontSize: 16,
                  color: i < currentLetter ? '#FF6B2C' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.25s',
                }}
              >
                {ch}
              </div>
            ))}
          </div>
        </div>

        {/* Arena */}
        <div
          ref={arenaRef}
          style={{
            flex: 1,
            position: 'relative',
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 10,
            overflow: 'hidden',
            cursor: 'crosshair',
            animation: shaking ? 'shake 0.28s ease' : 'none',
          }}
        >
          <style>{`
            @keyframes shake {
              0%  { transform: translateX(0); }
              20% { transform: translateX(-6px); }
              40% { transform: translateX(6px); }
              60% { transform: translateX(-4px); }
              80% { transform: translateX(4px); }
              100%{ transform: translateX(0); }
            }
          `}</style>

          {/* Flash on word complete */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 10,
              background: 'rgba(255,107,44,0.07)',
              opacity: flash ? 1 : 0,
              transition: 'opacity 0.1s',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />

          {/* Level up announcement */}
          <AnimatePresence>
            {levelUpMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  background: 'rgba(10,10,8,0.88)',
                  padding: '20px 36px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,107,44,0.25)',
                }}
              >
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: '#fff', marginBottom: 4 }}>
                  Level Up!
                </p>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#FF6B2C' }}>
                  {levelUpMsg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            marginTop: 12,
            background: 'rgba(255,255,255,0.02)',
            border: '0.5px solid rgba(255,255,255,0.05)',
            borderRadius: 8,
            padding: '8px 0',
            flexShrink: 0,
          }}
        >
          {[
            { num: score, label: 'Times Practiced' },
            { num: level, label: 'Level' },
            { num: `${speed}x`, label: 'Speed' },
            { num: rank, label: 'Rank' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                padding: '0 8px',
              }}
            >
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#fff', lineHeight: 1 }}>
                {s.num}
              </p>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function PraktisGame() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const enterGame = () => {
    setIsFullscreen(true)
    document.body.style.overflow = 'hidden'
  }

  const exitGame = () => {
    setIsFullscreen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <GamePreview onEnter={enterGame} />

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullscreenGame onExit={exitGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
