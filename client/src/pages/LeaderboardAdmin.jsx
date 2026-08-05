import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

// Obscure, unlinked route — no login yet (see server/routes/leaderboardAdmin.js).
// Keep this URL out of any nav/sitemap.
const API = `${import.meta.env.VITE_API_URL || ''}/api/leaderboard-mgmt-7k2x`

const TRACKS = ['Video Editing', 'Creative Design']

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/30 focus:border-[#FF6B2C]'

function AddMemberForm({ onAdded }) {
  const [name, setName] = useState('')
  const [track, setTrack] = useState(TRACKS[0])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const submit = async () => {
    if (!name.trim()) return
    setLoading(true)
    setMsg(null)
    try {
      await axios.post(`${API}/members`, { name: name.trim(), track })
      setName('')
      onAdded()
    } catch (err) {
      setMsg(err?.response?.data?.error || 'Could not add member.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <h3 className="font-heading font-bold text-base text-dark mb-4">Add a member</h3>
      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
        <input
          className={inputCls}
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <select className={inputCls} value={track} onChange={e => setTrack(e.target.value)}>
          {TRACKS.map(t => <option key={t}>{t}</option>)}
        </select>
        <button
          onClick={submit}
          disabled={loading}
          className="gradient-bg text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? 'Adding...' : 'Add member'}
        </button>
      </div>
      {msg && <p className="text-xs text-red-500 mt-2">{msg}</p>}
    </div>
  )
}

function WeekToggleGrid({ member, onToggled }) {
  const toggle = async (weekIdx) => {
    const week = weekIdx + 1
    const submitted = !member.weeklySubmissions[weekIdx]
    await axios.patch(`${API}/members/${member._id}/submission`, { week, submitted })
    onToggled()
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 12 }).map((_, i) => (
        <button
          key={i}
          title={`Week ${i + 1}`}
          onClick={() => toggle(i)}
          className="rounded-md flex items-center justify-center text-[9px] font-heading font-bold transition-all"
          style={{
            width: 20,
            height: 20,
            background: member.weeklySubmissions[i] ? 'linear-gradient(135deg, #FF6B2C, #FF3E7A)' : '#F3F3F1',
            color: member.weeklySubmissions[i] ? '#fff' : '#AAAAAA',
            border: '1px solid ' + (member.weeklySubmissions[i] ? 'transparent' : '#E5E5E1'),
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

function MembersTable({ members, onChanged }) {
  const remove = async (id) => {
    if (!confirm('Remove this member from the access list?')) return
    await axios.delete(`${API}/members/${id}`)
    onChanged()
  }

  if (members.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">No members yet — add one above.</p>
  }

  return (
    <div className="divide-y divide-gray-50">
      {members.map(m => (
        <div key={m._id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="min-w-[160px]">
            <p className="font-heading font-semibold text-dark text-sm">{m.name}</p>
            <p className="text-xs text-gray-400">{m.track} · 🔥 {m.heroWins} · {m.weeklySubmissions.filter(Boolean).length}/12 submitted</p>
          </div>
          <WeekToggleGrid member={m} onToggled={onChanged} />
          <button
            onClick={() => remove(m._id)}
            className="text-xs font-heading font-semibold text-red-500 hover:text-red-600 whitespace-nowrap"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

function HeroOfWeekPanel({ members, heroes, onChanged }) {
  const [track, setTrack] = useState(TRACKS[0])

  const heroFor = (week) => heroes.find(h => h.track === track && h.week === week)?.memberName || ''

  const setHero = async (week, memberName) => {
    await axios.put(`${API}/hero`, { week, track, memberName })
    onChanged()
  }

  const trackMembers = members.filter(m => m.track === track)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-heading font-bold text-base text-dark">Hero of the Week</h3>
        <div className="flex gap-2">
          {TRACKS.map(t => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`text-xs font-heading font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                track === t ? 'gradient-bg text-white border-transparent' : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => {
          const week = i + 1
          return (
            <div key={week} className="border border-gray-100 rounded-xl p-3">
              <p className="text-xs font-heading font-semibold text-gray-400 mb-1.5">Week {week}</p>
              <select
                className={inputCls}
                value={heroFor(week)}
                onChange={e => setHero(week, e.target.value)}
              >
                <option value="">— No hero set —</option>
                {trackMembers.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function LeaderboardAdmin() {
  const [members, setMembers] = useState([])
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([
      axios.get(`${API}/members`),
      axios.get(`${API}/hero`),
    ]).then(([m, h]) => {
      setMembers(m.data)
      setHeroes(h.data)
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-body">
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-lg text-dark">Leaderboard Admin</h1>
            <p className="text-xs text-gray-400">Members, weekly submissions, and Hero of the Week</p>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-[#FF6B2C] font-heading font-semibold">← Back to site</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-10">Loading...</p>
        ) : (
          <>
            <AddMemberForm onAdded={load} />
            <HeroOfWeekPanel members={members} heroes={heroes} onChanged={load} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="font-heading font-bold text-base text-dark">All members ({members.length})</h3>
                <p className="text-xs text-gray-400 mt-1">Click a numbered box to toggle that week's submission.</p>
              </div>
              <MembersTable members={members} onChanged={load} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
