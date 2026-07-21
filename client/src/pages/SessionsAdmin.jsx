import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/30 focus:border-[#FF6B2C]'

const statusStyle = {
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  completed: 'bg-gray-100 text-gray-500 border-gray-200',
}

const TRACKS = ['Creative Design', 'Video Editing', 'Brand Design']

function QuickAddMemberForm() {
  const [form, setForm] = useState({ fullName: '', email: '', country: 'Nigeria', track: 'Creative Design', skillLevel: 'Beginner' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok' | 'error' | 'exists', text }

  const set = (f, v) => { setForm(prev => ({ ...prev, [f]: v })); setMsg(null) }

  const submit = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      setMsg({ type: 'error', text: 'Name and email are required.' })
      return
    }
    setLoading(true)
    try {
      await axios.post(`${BASE}/api/waitlist`, {
        ...form,
        state: form.country,
        pursuingCareer: 'yes',
        isStudent: 'no',
        whyJoin: 'Added manually by admin — joined via WhatsApp before site registration existed.',
        commitment: 3,
      })
      setMsg({ type: 'ok', text: `${form.fullName} can now RSVP.` })
      setForm({ fullName: '', email: '', country: 'Nigeria', track: 'Creative Design', skillLevel: 'Beginner' })
    } catch (err) {
      if (err?.response?.status === 409) {
        setMsg({ type: 'exists', text: 'This email is already registered — they can RSVP already.' })
      } else {
        setMsg({ type: 'error', text: 'Could not add this member. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
      <h3 className="font-heading font-bold text-base text-dark mb-1">Quick-add a member</h3>
      <p className="text-xs text-gray-400 mb-4">
        For members who joined through WhatsApp and never filled the site form — add them here so their email works for RSVP.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputCls} placeholder="Full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
        <input className={inputCls} placeholder="Email (the one they'll RSVP with)" value={form.email} onChange={e => set('email', e.target.value)} />
        <input className={inputCls} placeholder="Country" value={form.country} onChange={e => set('country', e.target.value)} />
        <select className={inputCls} value={form.track} onChange={e => set('track', e.target.value)}>
          {TRACKS.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={submit}
          disabled={loading}
          className="gradient-bg text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-60"
        >
          {loading ? 'Adding...' : 'Add member'}
        </button>
        {msg && (
          <p className={`text-xs font-heading font-semibold ${
            msg.type === 'ok' ? 'text-green-600' : msg.type === 'exists' ? 'text-amber-600' : 'text-red-500'
          }`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  )
}

function NewSessionForm({ onCreated }) {
  const [form, setForm] = useState({ track: 'Creative Design', title: '', date: '', tutorName: '', minHeadcount: 3, notes: '' })
  const [loading, setLoading] = useState(false)

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }))

  const submit = async () => {
    if (!form.date) return alert('Pick a date and time.')
    setLoading(true)
    try {
      await axios.post(`${BASE}/api/sessions`, form)
      setForm({ track: 'Creative Design', title: '', date: '', tutorName: '', minHeadcount: 3, notes: '' })
      onCreated()
    } catch {
      alert('Could not create session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
      <h3 className="font-heading font-bold text-base text-dark mb-4">Schedule a session</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <select className={inputCls} value={form.track} onChange={e => set('track', e.target.value)}>
          <option>Creative Design</option>
          <option>Video Editing</option>
        </select>
        <input className={inputCls} type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} />
        <input className={inputCls} placeholder="Title (optional)" value={form.title} onChange={e => set('title', e.target.value)} />
        <input className={inputCls} placeholder="Tutor name" value={form.tutorName} onChange={e => set('tutorName', e.target.value)} />
        <input className={inputCls} type="number" min={1} placeholder="Min headcount" value={form.minHeadcount} onChange={e => set('minHeadcount', Number(e.target.value))} />
        <input className={inputCls} placeholder="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <button
        onClick={submit}
        disabled={loading}
        className="mt-4 gradient-bg text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create session'}
      </button>
    </div>
  )
}

function SessionRow({ session, onChanged }) {
  const [expanded, setExpanded] = useState(false)
  const [rsvps, setRsvps] = useState(null)

  const loadRsvps = async () => {
    if (rsvps) { setExpanded(!expanded); return }
    const res = await axios.get(`${BASE}/api/rsvp/session/${session._id}`)
    setRsvps(res.data.rsvps)
    setExpanded(true)
  }

  const updateStatus = async (status) => {
    await axios.patch(`${BASE}/api/sessions/${session._id}`, { status })
    onChanged()
  }

  const low = session.rsvpCount < (session.minHeadcount ?? 3)

  return (
    <div className="border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="font-heading font-semibold text-dark text-sm">
            {session.track}{session.title ? ` — ${session.title}` : ''}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(session.date).toLocaleString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
            {session.tutorName ? ` · ${session.tutorName}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadRsvps} className={`text-xs font-heading font-semibold px-3 py-1 rounded-full border ${low ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {session.rsvpCount} confirmed {low && '· below minimum'}
          </button>
          <span className={`text-xs font-heading font-semibold px-3 py-1 rounded-full border capitalize ${statusStyle[session.status]}`}>
            {session.status}
          </span>
          <select
            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            value={session.status}
            onChange={e => updateStatus(e.target.value)}
          >
            {['scheduled', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {expanded && rsvps && (
        <div className="px-5 pb-4">
          {rsvps.length === 0 ? (
            <p className="text-xs text-gray-400">No RSVPs yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-1">Name</th>
                  <th className="text-left py-1">WhatsApp</th>
                  <th className="text-left py-1">Email</th>
                  <th className="text-left py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map(r => (
                  <tr key={r._id} className="border-t border-gray-50">
                    <td className="py-1.5">{r.fullName}</td>
                    <td className="py-1.5 text-gray-500">{r.whatsapp}</td>
                    <td className="py-1.5 text-gray-500">{r.email}</td>
                    <td className="py-1.5 capitalize">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default function SessionsAdmin() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    axios.get(`${BASE}/api/sessions`)
      .then(res => setSessions(res.data))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-body">
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-lg text-dark">Sessions & RSVPs</h1>
            <p className="text-xs text-gray-400">Confirm tutors only once headcount clears the minimum</p>
          </div>
          <a href="/admin" className="text-sm text-gray-500 hover:text-[#FF6B2C] font-heading font-semibold">← Waitlist Admin</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <QuickAddMemberForm />
        <NewSessionForm onCreated={load} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-heading font-bold text-base text-dark">All sessions ({sessions.length})</h3>
          </div>
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-10">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">No sessions yet — create one above.</p>
          ) : (
            sessions.map(s => <SessionRow key={s._id} session={s} onChanged={load} />)
          )}
        </motion.div>
      </div>
    </div>
  )
}
