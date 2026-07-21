const express = require('express')
const router = express.Router()
const Rsvp = require('../models/Rsvp')
const Session = require('../models/Session')
const Waitlist = require('../models/Waitlist')
const requireAdmin = require('../middleware/adminAuth')

// POST /api/rsvp — a member confirms they're coming to a session
// Only registered Praktis members (present in Waitlist by email) can RSVP.
router.post('/', async (req, res) => {
  try {
    const { sessionId, fullName, whatsapp, email } = req.body
    if (!sessionId || !fullName || !whatsapp || !email) {
      return res.status(400).json({ error: 'sessionId, fullName, whatsapp and email are required.' })
    }

    const session = await Session.findById(sessionId)
    if (!session) return res.status(404).json({ error: 'Session not found.' })

    // Membership check — email must match an existing Praktis registration
    const member = await Waitlist.findOne({ email: email.toLowerCase().trim() })
    if (!member) {
      return res.status(403).json({
        error: "We couldn't find a Praktis registration for this email. Join the community first, then come back to RSVP.",
      })
    }

    // Re-activate if they previously cancelled, otherwise create fresh
    const existing = await Rsvp.findOne({ session: sessionId, whatsapp: whatsapp.trim() })
    let rsvp
    if (existing) {
      existing.status = 'going'
      existing.fullName = fullName
      existing.email = email.toLowerCase().trim()
      rsvp = await existing.save()
    } else {
      rsvp = await Rsvp.create({ session: sessionId, fullName, whatsapp: whatsapp.trim(), email: email.toLowerCase().trim() })
    }

    const rsvpCount = await Rsvp.countDocuments({ session: sessionId, status: 'going' })
    res.status(201).json({ message: "You're on the list!", data: rsvp, rsvpCount })
  } catch (err) {
    console.error('POST /api/rsvp error:', err.message)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// PATCH /api/rsvp/:id/cancel — member cancels their RSVP
router.patch('/:id/cancel', async (req, res) => {
  try {
    const rsvp = await Rsvp.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true })
    if (!rsvp) return res.status(404).json({ error: 'RSVP not found.' })
    res.json({ message: 'RSVP cancelled.', data: rsvp })
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// GET /api/rsvp/session/:sessionId — admin: full RSVP list + headcount for a session
router.get('/session/:sessionId', requireAdmin, async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ session: req.params.sessionId }).sort({ createdAt: 1 })
    const going = rsvps.filter(r => r.status === 'going').length
    res.json({ rsvps, going, total: rsvps.length })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch RSVPs.' })
  }
})

module.exports = router
