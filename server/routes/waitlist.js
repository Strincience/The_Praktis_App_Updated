const express = require('express')
const router = express.Router()
const Waitlist = require('../models/Waitlist')



// POST /api/waitlist — Submit a new application
router.post('/', async (req, res) => {
  try {
    const { fullName, email, country, state, track, skillLevel, pursuingCareer, isStudent, schoolName, whyJoin, commitment } = req.body

    // Basic server-side validation
    if (!fullName || !email || !country || !state || !track || !skillLevel || !pursuingCareer || !isStudent || !whyJoin || !commitment) {
      return res.status(400).json({ error: 'All required fields must be filled.' })
    }

    // Check duplicate email
    const existing = await Waitlist.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' })
    }

    const entry = await Waitlist.create({
      fullName, email, country, state, track, skillLevel,
      pursuingCareer, isStudent, schoolName, whyJoin, commitment,
    })

    res.status(201).json({ message: 'Successfully added to waitlist!', data: entry })
  } catch (err) {
    console.error('POST /api/waitlist error:', err.message)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// GET /api/waitlist — Fetch all waitlist entries (admin)
router.get('/', async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    console.error('GET /api/waitlist error:', err.message)
    res.status(500).json({ error: 'Could not fetch waitlist.' })
  }
})

// GET /api/waitlist/stats — Aggregate stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const total = await Waitlist.countDocuments()
    const byTrack = await Waitlist.aggregate([{ $group: { _id: '$track', count: { $sum: 1 } } }])
    const bySkill = await Waitlist.aggregate([{ $group: { _id: '$skillLevel', count: { $sum: 1 } } }])
    const byCountry = await Waitlist.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }])
    const avgCommitment = await Waitlist.aggregate([{ $group: { _id: null, avg: { $avg: '$commitment' } } }])

    res.json({
      total,
      byTrack,
      bySkill,
      byCountry,
      avgCommitment: avgCommitment[0]?.avg?.toFixed(1) || 0,
    })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stats.' })
  }
})

module.exports = router
