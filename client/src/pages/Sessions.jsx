import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const inputCls = [
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF8]',
  'text-dark text-sm font-body placeholder:text-gray-400',
  'focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/25',
  'focus:border-[#FF6B2C] transition-all',
].join(' ')

const trackColor = {
  'Creative Design': '#FF3E7A',
  'Video Editing': '#7B3FE4',
}

function formatDate(d) {
  return new Date(d).toLocaleString('en-NG', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: 'numeric', minute: '2-digit',
  })
}

function RsvpForm({ session, onDone }) {
  const [form, setForm] = useState({ fullName: '', whatsapp: '', email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Your name is required'
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter the email you registered with'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const res = await axios.post(`${BASE}/api/rsvp`, { sessionId: session._id, ...form })
      onDone(res.data.rsvpCount)
    } catch (err) {
      setErrors({ email: err?.response?.data?.error || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 mt-4">
      <div>
        <input
          className={inputCls}
          placeholder="Full Name"
          value={form.fullName}
          onChange={e => set('fullName', e.target.value)}
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <input
          className={inputCls}
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={e => set('whatsapp', e.target.value)}
        />
        {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
      </div>
      <div>
        <input
          className={inputCls}
          placeholder="Email — the one you registered with"
          value={form.email}
          onChange={e => set('email', e.target.value)}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      <button
        onClick={submit}
        disabled={loading}
        className="w-full gradient-bg text-white font-heading font-bold py-3 rounded-xl text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-60"
      >
        {loading ? 'Saving...' : "Confirm I'm coming →"}
      </button>
      <p className="text-xs text-gray-400 text-center">Only open to registered Praktis members.</p>
    </div>
  )
}

function SessionCard({ session }) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(session.rsvpCount)
  const low = count < (session.minHeadcount ?? 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className="text-xs font-heading font-semibold px-3 py-1 rounded-full text-white"
          style={{ background: trackColor[session.track] || '#7B3FE4' }}
        >
          {session.track}
        </span>
        <span className={`text-xs font-heading font-semibold ${low ? 'text-amber-600' : 'text-green-600'}`}>
          {count} confirmed
        </span>
      </div>

      {session.title && <h3 className="font-heading font-bold text-lg text-dark mb-1">{session.title}</h3>}
      <p className="text-gray-500 text-sm mb-1">{formatDate(session.date)}</p>
      {session.tutorName && <p className="text-gray-400 text-xs mb-3">Tutor: {session.tutorName}</p>}

      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-heading font-semibold text-green-600 mt-4"
          >
            ✓ You're confirmed for this session.
          </motion.p>
        ) : open ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RsvpForm session={session} onDone={c => { setDone(true); setCount(c) }} />
          </motion.div>
        ) : (
          <motion.button
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(true)}
            className="w-full btn-orange justify-center py-3 rounded-xl text-sm mt-2"
          >
            I'm coming →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Sessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BASE}/api/sessions`, { params: { upcoming: 'true' } })
      .then(res => setSessions(res.data.filter(s => s.status !== 'cancelled')))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-body py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">P</span>
            </div>
            <span className="font-heading font-bold text-lg text-dark">Praktis</span>
          </a>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-dark mb-3">
            Upcoming <span className="gradient-text">Sessions</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            RSVP so we know who's actually coming — it's how we keep classes running on time and confirm tutors ahead.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No sessions scheduled right now — check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {sessions.map(s => <SessionCard key={s._id} session={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
