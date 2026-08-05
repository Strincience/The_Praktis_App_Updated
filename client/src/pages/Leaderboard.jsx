import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''
const NAME_KEY = 'praktis_leaderboard_name'
const TRACKS = ['Video Editing', 'Creative Design']

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF8] text-dark text-sm font-body placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/25 focus:border-[#FF6B2C] transition-all'

// ── Name gate ────────────────────────────────────────────────────────────────
function NameGate({ onVerified }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BASE}/api/leaderboard/verify`, { name })
      localStorage.setItem(NAME_KEY, res.data.name)
      onVerified(res.data.name)
    } catch (err) {
      setError(err?.response?.data?.error || "Hmm, we don't recognize that name. Are you a Praktis member?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FAFAF8' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="h-1 gradient-bg w-full" />
        <div className="p-8">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mb-5 text-lg">
            🔥
          </div>
          <h1 className="font-heading font-black text-2xl text-dark mb-1 tracking-tight">
            Hero <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-sm text-gray-400 mb-6">Enter your name to continue.</p>

          <input
            className={inputCls}
            placeholder="Your full name"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="btn-gradient w-full justify-center font-heading font-bold py-3.5 rounded-xl text-sm shadow-md mt-5 disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>

          <a href="/" className="block text-center text-xs text-gray-400 hover:text-[#FF6B2C] mt-5 font-body">
            ← Back to site
          </a>
        </div>
      </motion.div>
    </div>
  )
}

// ── Week grid — 12 dots, filled if submitted ────────────────────────────────
function WeekGrid({ weeklySubmissions }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          title={`Week ${i + 1}${weeklySubmissions[i] ? ' — submitted' : ' — not submitted'}`}
          className="rounded-full"
          style={{
            width: 9,
            height: 9,
            background: weeklySubmissions[i] ? 'linear-gradient(135deg, #FF6B2C, #FF3E7A)' : '#EEECEA',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

// ── Ranked list for one track ───────────────────────────────────────────────
function TrackBoard({ members }) {
  if (!members || members.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-16">No members on this track yet.</p>
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F9F9FB] border-b border-gray-100">
            <tr>
              {['#', 'Name', 'Submissions', 'Hero Wins', 'Weeks'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-heading font-semibold text-xs text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((m, i) => (
              <tr key={m._id} className="hover:bg-[#F9F9FB] transition-colors">
                <td className="px-5 py-4 font-heading font-bold text-gray-300 w-10">{i + 1}</td>
                <td className="px-5 py-4 font-heading font-semibold text-dark whitespace-nowrap">{m.name}</td>
                <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{m.totalSubmissions}/12</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="font-heading font-bold text-dark">
                    {m.heroWins > 0 ? '🔥'.repeat(Math.min(m.heroWins, 5)) : '—'}
                    {m.heroWins > 5 ? ` +${m.heroWins - 5}` : ''}
                  </span>
                </td>
                <td className="px-5 py-4"><WeekGrid weeklySubmissions={m.weeklySubmissions} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Leaderboard display ──────────────────────────────────────────────────────
function Board({ verifiedName }) {
  const [data, setData] = useState(null)
  const [tab, setTab] = useState(TRACKS[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BASE}/api/leaderboard`)
      .then(res => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen font-body" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔥</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-dark">Hero Leaderboard</h1>
              <p className="text-xs text-gray-400">Welcome, {verifiedName?.split(' ')[0]}</p>
            </div>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-[#FF6B2C] font-heading font-semibold">← Back to site</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TRACKS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-heading font-semibold px-5 py-2.5 rounded-xl border transition-all ${
                tab === t
                  ? 'btn-gradient border-transparent'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-16">Loading leaderboard...</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <TrackBoard members={data?.[tab]} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [verifiedName, setVerifiedName] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(NAME_KEY)
    if (stored) setVerifiedName(stored)
    setChecked(true)
  }, [])

  if (!checked) return null

  return verifiedName
    ? <Board verifiedName={verifiedName} />
    : <NameGate onVerified={setVerifiedName} />
}
