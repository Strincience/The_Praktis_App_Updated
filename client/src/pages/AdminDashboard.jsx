import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const GRAD = ['#FF6B2C', '#FF3E7A', '#7B3FE4', '#FFB347', '#A87CFF', '#FF6B9D', '#6B3FFF']

const scoreUser = (u) => {
  const pts = (u.commitment >= 4 ? 2 : 0) + (u.pursuingCareer === 'yes' ? 1 : 0) + (u.whyJoin?.length > 80 ? 1 : 0)
  return pts >= 3 ? 'High Potential' : pts === 2 ? 'Promising' : 'Needs Review'
}

const badgeStyle = {
  'High Potential': 'bg-green-50 text-green-700 border border-green-200',
  Promising: 'bg-amber-50 text-amber-700 border border-amber-200',
  'Needs Review': 'bg-gray-100 text-gray-500 border border-gray-200',
}

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <p className="text-sm font-heading font-semibold text-gray-400 mb-1">{label}</p>
    <p className="font-heading font-bold text-3xl text-[#1F1F1F]">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const aggregateBy = (data, key) => {
  const map = {}
  data.forEach(d => {
    const k = d[key] || 'Unknown'
    map[k] = (map[k] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('/api/waitlist')
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const scored = users.map(u => ({ ...u, score: scoreUser(u) }))

  const filtered = scored.filter(u => {
    const matchFilter = filter === 'All' || u.score === filter
    const matchSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.country?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const high = scored.filter(u => u.score === 'High Potential').length
  const promising = scored.filter(u => u.score === 'Promising').length
  const students = scored.filter(u => u.isStudent === 'yes').length
  const avgCommit = users.length
    ? (users.reduce((a, u) => a + (u.commitment || 0), 0) / users.length).toFixed(1)
    : '—'

  const byTrack = aggregateBy(users, 'track')
  const bySkill = aggregateBy(users, 'skillLevel')
  const byCountry = aggregateBy(users, 'country')
  const byScore = [
    { name: 'High Potential', value: high },
    { name: 'Promising', value: promising },
    { name: 'Needs Review', value: scored.length - high - promising },
  ].filter(s => s.value > 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 gradient-bg rounded-full animate-pulse" />
          <p className="font-heading font-semibold text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB] font-body">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">P</span>
              </div>
            </a>
            <div>
              <h1 className="font-heading font-bold text-lg text-dark">Praktis Admin</h1>
              <p className="text-xs text-gray-400">Waitlist Dashboard</p>
            </div>
          </div>
          <a href="/" className="text-sm text-gray-500 hover:text-[#FF6B2C] transition-colors font-heading font-semibold">
            ← Back to site
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <StatCard label="Total Signups" value={users.length} sub="All submissions" />
          <StatCard label="High Potential" value={high} sub={`${users.length ? Math.round(high / users.length * 100) : 0}% of total`} />
          <StatCard label="Students" value={students} sub="Enrolled or studying" />
          <StatCard label="Avg. Commitment" value={`${avgCommit}/5`} sub="Across all applicants" />
        </motion.div>

        {/* Charts row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          {/* By Track */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-base text-dark mb-6">Signups by Creative Track</h3>
            {byTrack.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byTrack} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Inter' }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {byTrack.map((_, i) => <Cell key={i} fill={GRAD[i % GRAD.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Skill */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-base text-dark mb-6">Signups by Skill Level</h3>
            {bySkill.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={bySkill} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {bySkill.map((_, i) => <Cell key={i} fill={GRAD[i % GRAD.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Country */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-base text-dark mb-6">Signups by Country</h3>
            {byCountry.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byCountry} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {byCountry.map((_, i) => <Cell key={i} fill={GRAD[i % GRAD.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* By Score */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-base text-dark mb-6">Member Potential Breakdown</h3>
            {byScore.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byScore} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#d1d5db" />
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Members table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Table controls */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h3 className="font-heading font-bold text-base text-dark">All Applicants ({filtered.length})</h3>
            <div className="flex gap-3 flex-wrap">
              {/* Search */}
              <input
                type="text"
                placeholder="Search name, email, country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-sm px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/30 focus:border-[#FF6B2C] w-56"
              />
              {/* Filter buttons */}
              {['All', 'High Potential', 'Promising', 'Needs Review'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-heading font-semibold px-4 py-2 rounded-xl border transition-all ${
                    filter === f
                      ? 'gradient-bg text-white border-transparent'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📋</p>
                <p className="font-heading font-semibold">No applicants found</p>
                <p className="text-sm mt-1">
                  {users.length === 0
                    ? 'Waitlist submissions will appear here once your backend is connected.'
                    : 'Try adjusting your search or filter.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F9F9FB] border-b border-gray-100">
                  <tr>
                    {['Name', 'Email', 'Country', 'Track', 'Level', 'Commitment', 'Career', 'Student', 'Score'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-heading font-semibold text-xs text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u, i) => (
                    <tr key={u._id || i} className="hover:bg-[#F9F9FB] transition-colors">
                      <td className="px-5 py-4 font-heading font-semibold text-dark whitespace-nowrap">{u.fullName}</td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{u.country}, {u.state}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{u.track}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#F9F9FB] text-gray-600 border border-gray-200">
                          {u.skillLevel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full gradient-bg"
                              style={{ width: `${(u.commitment / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{u.commitment}/5</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold capitalize ${u.pursuingCareer === 'yes' ? 'text-green-600' : 'text-gray-400'}`}>
                          {u.pursuingCareer}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold capitalize ${u.isStudent === 'yes' ? 'text-blue-600' : 'text-gray-400'}`}>
                          {u.isStudent}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-heading font-semibold px-3 py-1 rounded-full ${badgeStyle[u.score]}`}>
                          {u.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
