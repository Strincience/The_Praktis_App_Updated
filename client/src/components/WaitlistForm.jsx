import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import Referral from './Referral'
import axios from 'axios'

const TRACKS = [
  'Creative Design',
  'Video Editing',
  // 'Photography',
  // 'Content Creation',
  'Brand Design',
  // 'Cinematography',
  // 'Other',
]

const initialForm = {
  fullName: '',
  email: '',
  country: '',
  state: '',
  track: '',
  skillLevel: '',
  pursuingCareer: '',
  isStudent: '',
  schoolName: '',
  whyJoin: '',
  commitment: 3,
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/30 focus:border-[#FF6B2C] transition-all placeholder:text-gray-400'
const labelClass = 'block text-sm font-heading font-semibold text-dark mb-1.5'
const errorClass = 'text-xs text-red-500 mt-1'

export default function WaitlistForm() {
  const [ref, inView] = useInView(0.1)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address'
    if (!form.country.trim()) e.country = 'Country is required'
    if (!form.state.trim()) e.state = 'State / region is required'
    if (!form.track) e.track = 'Please select a creative track'
    if (!form.skillLevel) e.skillLevel = 'Please select your skill level'
    if (!form.pursuingCareer) e.pursuingCareer = 'Please answer this question'
    if (!form.isStudent) e.isStudent = 'Please answer this question'
    if (form.isStudent === 'yes' && !form.schoolName.trim()) e.schoolName = 'School name is required'
    if (form.whyJoin.trim().length < 20) e.whyJoin = 'Please write at least 20 characters'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      // Scroll to first error
      const firstKey = Object.keys(e)[0]
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/waitlist', form)
      setSubmitted(true)
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return <Referral name={form.fullName} />

  return (
    <section id="waitlist" ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-heading font-semibold tracking-widest uppercase text-[#FF6B2C]">Limited Spots</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-dark mt-3 mb-4">
            Join the <span className="gradient-text">Waitlist</span>
          </h2>
          <p className="text-gray-500 text-base">
            We're building Praktis for serious creatives. Tell us about yourself so we can match you to the right track.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#F9F9FB] rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm"
        >
          <div className="space-y-6">

            {/* Full Name */}
            <div>
              <label className={labelClass} htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className={inputClass}
                placeholder="e.g. Adaeze Okonkwo"
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
              />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            {/* Country + State row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Nigeria"
                  value={form.country}
                  onChange={e => set('country', e.target.value)}
                />
                {errors.country && <p className={errorClass}>{errors.country}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="state">State / Region</label>
                <input
                  id="state"
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Lagos"
                  value={form.state}
                  onChange={e => set('state', e.target.value)}
                />
                {errors.state && <p className={errorClass}>{errors.state}</p>}
              </div>
            </div>

            {/* Creative Track */}
            <div>
              <label className={labelClass} htmlFor="track">Creative Track of Interest</label>
              <select
                id="track"
                className={inputClass}
                value={form.track}
                onChange={e => set('track', e.target.value)}
              >
                <option value="">Select a track...</option>
                {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.track && <p className={errorClass}>{errors.track}</p>}
            </div>

            {/* Skill Level */}
            <div>
              <label className={labelClass} htmlFor="skillLevel">Skill Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => set('skillLevel', level)}
                    className={`py-3 rounded-xl text-sm font-heading font-semibold border transition-all ${
                      form.skillLevel === level
                        ? 'gradient-bg text-white border-transparent shadow-md'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {errors.skillLevel && <p className={errorClass}>{errors.skillLevel}</p>}
            </div>

            {/* Pursuing creative career */}
            <div>
              <label className={labelClass} htmlFor="pursuingCareer">Are you pursuing a creative career?</label>
              <div className="grid grid-cols-2 gap-3">
                {['yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('pursuingCareer', opt)}
                    className={`py-3 rounded-xl text-sm font-heading font-semibold border capitalize transition-all ${
                      form.pursuingCareer === opt
                        ? 'gradient-bg text-white border-transparent shadow-md'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
              {errors.pursuingCareer && <p className={errorClass}>{errors.pursuingCareer}</p>}
            </div>

            {/* Student */}
            <div>
              <label className={labelClass}>Are you a student?</label>
              <div className="grid grid-cols-2 gap-3">
                {['yes', 'no'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('isStudent', opt)}
                    className={`py-3 rounded-xl text-sm font-heading font-semibold border capitalize transition-all ${
                      form.isStudent === opt
                        ? 'gradient-bg text-white border-transparent shadow-md'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B2C]/40'
                    }`}
                  >
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
              {errors.isStudent && <p className={errorClass}>{errors.isStudent}</p>}
            </div>

            {/* Conditional school name */}
            <AnimatePresence>
              {form.isStudent === 'yes' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className={labelClass} htmlFor="schoolName">School Name</label>
                  <input
                    id="schoolName"
                    type="text"
                    className={inputClass}
                    placeholder="e.g. University of Lagos"
                    value={form.schoolName}
                    onChange={e => set('schoolName', e.target.value)}
                  />
                  {errors.schoolName && <p className={errorClass}>{errors.schoolName}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Why join */}
            <div>
              <label className={labelClass} htmlFor="whyJoin">Why do you want to join Praktis?</label>
              <textarea
                id="whyJoin"
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Tell us about your creative journey, your goals, and what you're hoping to build..."
                value={form.whyJoin}
                onChange={e => set('whyJoin', e.target.value)}
              />
              <div className="flex justify-between mt-1">
                {errors.whyJoin
                  ? <p className={errorClass}>{errors.whyJoin}</p>
                  : <span />}
                <span className="text-xs text-gray-400">{form.whyJoin.length} chars</span>
              </div>
            </div>

            {/* Commitment scale */}
            <div>
              <label className={labelClass}>
                How committed are you to practicing consistently?{' '}
                <span className="gradient-text font-bold text-base">{form.commitment}/5</span>
              </label>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">Casual</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={form.commitment}
                  onChange={e => set('commitment', Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FF6B2C ${(form.commitment - 1) * 25}%, #FF3E7A ${(form.commitment - 1) * 25}%, #7B3FE4 100%)`,
                  }}
                />
                <span className="text-xs text-gray-400">All-in</span>
              </div>
              <div className="flex justify-between mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    className={`text-xs font-heading font-semibold ${form.commitment >= n ? 'gradient-text' : 'text-gray-300'}`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full gradient-bg text-white font-heading font-bold py-4 rounded-xl text-base shadow-lg hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit My Application →'
              )}
            </motion.button>

            <p className="text-center text-xs text-gray-400">
              No spam. We'll only reach out when Praktis is ready for you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
