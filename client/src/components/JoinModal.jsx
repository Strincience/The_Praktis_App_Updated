import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

// ── Config — paste your actual links here ────────────────────────────────────
const WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/EhPKLwI52x48jqgnWhoiVw'
const SITE_URL           = 'https://joinpraktis.org'
// ─────────────────────────────────────────────────────────────────────────────

const TRACKS = [
  'Creative Design',
  'Video Editing',
  'Photography',
  'Content Creation',
  'Brand Design',
  'Cinematography',
  'Other',
]

const BASE = import.meta.env.VITE_API_URL || ''

const inputCls = [
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF8]',
  'text-dark text-sm font-body placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/25',
  'focus:border-[#FF6B2C] transition-all',
].join(' ')

// ── Success / Join screen ─────────────────────────────────────────────────────
function JoinSuccess({ name }) {
  const firstName = name?.split(' ')[0] || 'there'
  const [copied, setCopied]   = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(SITE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareText = `I just joined Praktis — a creative community for people serious about building real skills. Join me 🎨🎬✍️ ${SITE_URL}`

  return (
    <div className="text-center">
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center
                   mx-auto mb-5 text-3xl shadow-lg"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-heading font-black text-2xl text-dark mb-2 tracking-tight">
          You're in,{' '}
          <span className="gradient-text">{firstName}!</span>
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
          Welcome to Praktis. Join the WhatsApp community below —
          your free Starter Week begins there.
        </p>
      </motion.div>

      {/* What to expect */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#F9F9FB] rounded-2xl p-5 border border-gray-100 text-left mb-5"
      >
        <p className="font-heading font-semibold text-dark text-xs mb-3 uppercase tracking-wider">
          What happens next
        </p>
        {[
          { step: '01', title: 'Join the community', desc: 'Click the button below — takes you straight to WhatsApp.' },
          { step: '02', title: 'Complete Starter Week', desc: 'Free. 5 short sessions. Make your first real piece.' },
          { step: '03', title: 'Unlock the curriculum', desc: '12-week structured practice for ₦2,000. When you\'re ready.' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
            <div
              className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center
                         font-heading font-bold text-white text-[10px] flex-shrink-0 mt-0.5"
            >
              {item.step}
            </div>
            <div>
              <p className="font-heading font-semibold text-dark text-xs">{item.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* WhatsApp CTA */}
      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        href={WHATSAPP_COMMUNITY}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl
                   text-sm font-heading font-bold text-white shadow-md
                   hover:opacity-90 transition-all mb-3"
        style={{ background: '#25D366' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Join the Praktis Community →
      </motion.a>

      {/* Referral row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <p className="text-xs text-gray-400 mb-3">
          Know someone who should be here? Share Praktis with them.
        </p>

        <div className="flex gap-2">
          {/* Copy link */}
          <button
            onClick={copyLink}
            className={`flex-1 text-xs font-heading font-semibold py-2.5 rounded-xl border transition-all ${
              copied
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-[#F9F9FB] text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>

          {/* WhatsApp share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-xs font-heading font-semibold py-2.5 rounded-xl
                       border border-gray-200 bg-[#F9F9FB] text-gray-500
                       hover:border-[#25D366] hover:text-[#25D366] transition-all
                       text-center"
          >
            💬 WhatsApp
          </a>

          {/* Twitter share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-xs font-heading font-semibold py-2.5 rounded-xl
                       border border-gray-200 bg-[#F9F9FB] text-gray-500
                       hover:border-[#1DA1F2] hover:text-[#1DA1F2] transition-all
                       text-center"
          >
            🐦 Twitter
          </a>
        </div>
      </motion.div>
    </div>
  )
}

// ── Registration form ─────────────────────────────────────────────────────────
function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: '', email: '', country: '', track: '', skillLevel: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())                        e.fullName   = 'Your name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email  = 'Enter a valid email'
    if (!form.country.trim())                         e.country    = 'Country is required'
    if (!form.track)                                  e.track      = 'Choose a creative track'
    if (!form.skillLevel)                             e.skillLevel = 'Choose your level'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await axios.post(`${BASE}/api/waitlist`, {
        ...form,
        // Provide defaults for server-required fields we removed from the form
        state: form.country,
        pursuingCareer: 'yes',
        isStudent: 'no',
        whyJoin: 'Joined via community registration',
        commitment: 3,
      })
      onSuccess(form.fullName)
    } catch (err) {
      // If duplicate email — still let them through to join
      if (err?.response?.status === 409) {
        onSuccess(form.fullName)
      } else {
        setErrors({ fullName: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="font-heading font-black text-2xl text-dark tracking-tight mb-1">
          Join <span className="gradient-text">Praktis</span>
        </h3>
        <p className="text-gray-400 text-sm">
          Free to join. Starter Week begins immediately in WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <input
            type="text"
            className={inputCls}
            placeholder="Full Name"
            value={form.fullName}
            onChange={e => set('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            className={inputCls}
            placeholder="Email Address"
            value={form.email}
            onChange={e => set('email', e.target.value)}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Country */}
        <div>
          <input
            type="text"
            className={inputCls}
            placeholder="Country"
            value={form.country}
            onChange={e => set('country', e.target.value)}
          />
          {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
        </div>

        {/* Creative Track */}
        <div>
          <select
            className={inputCls}
            value={form.track}
            onChange={e => set('track', e.target.value)}
          >
            <option value="">Creative Track of Interest...</option>
            {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.track && <p className="text-xs text-red-500 mt-1">{errors.track}</p>}
        </div>

        {/* Skill Level */}
        <div>
          <div className="grid grid-cols-3 gap-2">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => set('skillLevel', level)}
                className={`py-2.5 rounded-xl text-xs font-heading font-semibold border transition-all ${
                  form.skillLevel === level
                    ? 'gradient-bg text-white border-transparent shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          {errors.skillLevel && <p className="text-xs text-red-500 mt-1">{errors.skillLevel}</p>}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full gradient-bg text-white font-heading font-bold py-3.5
                     rounded-xl text-sm shadow-lg hover:opacity-90 transition-all
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Joining...
            </span>
          ) : (
            'Join the Community →'
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          Free to join. No payment needed to get started.
        </p>
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function JoinModal() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [joinName,  setJoinName]  = useState('')
  const overlayRef = useRef(null)

  // Listen for global open event — any button can fire this
  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      setSubmitted(false)
      setJoinName('')
    }
    window.addEventListener('praktis:openModal', open)
    return () => window.removeEventListener('praktis:openModal', open)
  }, [])

  // Close on ESC key
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const close = () => setIsOpen(false)

  const handleSuccess = (name) => {
    setJoinName(name)
    setSubmitted(true)
  }

  // Click backdrop to close
  const onBackdrop = (e) => {
    if (e.target === overlayRef.current) close()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onBackdrop}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: 'rgba(19,19,17,0.7)', backdropFilter: 'blur(4px)' }}
          >
            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl
                         overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Top accent line */}
              <div className="h-1 gradient-bg w-full" />

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100
                           flex items-center justify-center text-gray-400
                           hover:bg-gray-200 hover:text-gray-600 transition-all z-10
                           font-body text-sm"
              >
                ✕
              </button>

              {/* Content */}
              <div className="p-6 pt-5">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <JoinSuccess name={joinName} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <RegistrationForm onSuccess={handleSuccess} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
