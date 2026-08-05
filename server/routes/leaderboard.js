const express = require('express')
const Member = require('../models/Member')
const router = express.Router()

const TRACKS = ['Video Editing', 'Creative Design']

// POST /api/leaderboard/verify — the "name as password" gate.
// Case-insensitive match against the hardcoded (admin-managed) member list.
router.post('/verify', async (req, res) => {
  const { name } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, error: 'Enter your name to continue.' })
  }

  const match = await Member.findOne({ nameLower: name.trim().toLowerCase() })

  if (!match) {
    return res.status(404).json({
      ok: false,
      error: "Hmm, we don't recognize that name. Are you a Praktis member?",
    })
  }

  res.json({ ok: true, name: match.name })
})

// GET /api/leaderboard — ranked members per track.
// Ranked by Hero of the Week wins first, then total submissions as tiebreaker.
router.get('/', async (req, res) => {
  const members = await Member.find({})

  const result = {}
  for (const track of TRACKS) {
    result[track] = members
      .filter(m => m.track === track)
      .map(m => ({
        _id: m._id,
        name: m.name,
        weeklySubmissions: m.weeklySubmissions,
        totalSubmissions: m.weeklySubmissions.filter(Boolean).length,
        heroWins: m.heroWins,
      }))
      .sort((a, b) => b.heroWins - a.heroWins || b.totalSubmissions - a.totalSubmissions)
  }

  res.json(result)
})

module.exports = router
