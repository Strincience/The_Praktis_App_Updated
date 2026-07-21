import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''
const TOKEN_KEY = 'praktis_admin_token'

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FAFAF8] text-dark text-sm font-body placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/25 focus:border-[#FF6B2C] transition-all'

// Wraps admin-only pages behind a shared password.
// On success, stores a short-lived token and attaches it to every axios
// request so the protected API routes (waitlist, RSVPs, session mgmt) work.
export default function AdminGate({ children }) {
  const [authed, setAuthed] = useState(false)
  const [checked, setChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setAuthed(true)
    }
    setChecked(true)

    // If a token expires mid-session, drop back to the password screen.
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err?.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          delete axios.defaults.headers.common['Authorization']
          setAuthed(false)
        }
        return Promise.reject(err)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  const login = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BASE}/api/admin/login`, { password })
      localStorage.setItem(TOKEN_KEY, res.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      setAuthed(true)
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!checked) return null

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F9F9FB] flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-heading font-bold text-sm">P</span>
          </div>
          <h1 className="font-heading font-bold text-lg text-dark mb-1">Admin access</h1>
          <p className="text-xs text-gray-400 mb-5">This area contains member emails and WhatsApp numbers — enter the admin password to continue.</p>
          <input
            type="password"
            className={inputCls}
            placeholder="Admin password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full gradient-bg text-white font-heading font-bold py-3 rounded-xl text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-60 mt-4"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </div>
      </div>
    )
  }

  return children
}
