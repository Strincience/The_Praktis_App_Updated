const express = require('express')
const router = express.Router()
const Session = require('../models/Session')
const Rsvp = require('../models/Rsvp')
const requireAdmin = require('../middleware/adminAuth')

// POST /api/sessions — create a session (admin, used from Sessions Admin page)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { track, title, date, tutorName, minHeadcount, notes } = req.body
    if (!track || !date) {
      return res.status(400).json({ error: 'track and date are required.' })
    }
    const session = await Session.create({ track, title, date, tutorName, minHeadcount, notes })
    res.status(201).json({ message: 'Session created.', data: session })
  } catch (err) {
    console.error('POST /api/sessions error:', err.message)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// GET /api/sessions — list sessions, optionally filtered by status (?status=scheduled)
// Public page only requests scheduled/confirmed upcoming sessions; admin can request all.
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.upcoming === 'true') filter.date = { $gte: new Date() }

    const sessions = await Session.find(filter).sort({ date: 1 }).lean()

    // Attach live headcount to each session (going RSVPs only)
    const withCounts = await Promise.all(
      sessions.map(async s => {
        const count = await Rsvp.countDocuments({ session: s._id, status: 'going' })
        return { ...s, rsvpCount: count }
      })
    )

    res.json(withCounts)
  } catch (err) {
    console.error('GET /api/sessions error:', err.message)
    res.status(500).json({ error: 'Could not fetch sessions.' })
  }
})

// PATCH /api/sessions/:id — update status (confirmed / cancelled / completed) or details
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!session) return res.status(404).json({ error: 'Session not found.' })
    res.json({ message: 'Session updated.', data: session })
  } catch (err) {
    console.error('PATCH /api/sessions/:id error:', err.message)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// DELETE /api/sessions/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id)
    await Rsvp.deleteMany({ session: req.params.id })
    res.json({ message: 'Session deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

module.exports = router
