const express = require('express')
const Member = require('../models/Member')
const HeroOfWeek = require('../models/HeroOfWeek')
const requireAdmin = require('../middleware/adminAuth')
const router = express.Router()

// Same shared admin password as /api/admin (ADMIN_PASSWORD / ADMIN_JWT_SECRET).
router.use(requireAdmin)

const TRACKS = ['Video Editing', 'Creative Design']

// Recompute heroWins for every member on a track from the HeroOfWeek collection —
// keeps Member.heroWins in sync without trusting incremental +1/-1 math.
async function resyncHeroWins(track) {
  const wins = await HeroOfWeek.aggregate([
    { $match: { track } },
    { $group: { _id: '$memberName', count: { $sum: 1 } } },
  ])
  const winMap = new Map(wins.map(w => [w._id, w.count]))

  const members = await Member.find({ track })
  await Promise.all(
    members.map(m =>
      Member.updateOne({ _id: m._id }, { heroWins: winMap.get(m.name) || 0 })
    )
  )
}

// ── Members ──────────────────────────────────────────────────────────────────

// GET /members — everyone, both tracks
router.get('/members', async (req, res) => {
  const members = await Member.find({}).sort({ track: 1, name: 1 })
  res.json(members)
})

// POST /members — add a member to the access list
router.post('/members', async (req, res) => {
  const { name, track } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' })
  if (!TRACKS.includes(track)) return res.status(400).json({ error: 'Invalid track.' })

  try {
    const member = await Member.create({ name: name.trim(), track })
    res.status(201).json(member)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This name is already on that track.' })
    }
    res.status(500).json({ error: 'Could not add member.' })
  }
})

// DELETE /members/:id — remove from the access list
router.delete('/members/:id', async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id)
  if (!member) return res.status(404).json({ error: 'Member not found.' })
  // Clean up any Hero-of-Week rows pointing at them, then resync counts.
  await HeroOfWeek.deleteMany({ track: member.track, memberName: member.name })
  await resyncHeroWins(member.track)
  res.json({ ok: true })
})

// PATCH /members/:id/submission — toggle a single week's submission
router.patch('/members/:id/submission', async (req, res) => {
  const { week, submitted } = req.body
  if (!week || week < 1 || week > 12) return res.status(400).json({ error: 'Week must be 1-12.' })

  const member = await Member.findById(req.params.id)
  if (!member) return res.status(404).json({ error: 'Member not found.' })

  member.weeklySubmissions[week - 1] = !!submitted
  await member.save()
  res.json(member)
})

// ── Hero of the Week ─────────────────────────────────────────────────────────

// GET /hero — all hero-of-week assignments
router.get('/hero', async (req, res) => {
  const heroes = await HeroOfWeek.find({}).sort({ track: 1, week: 1 })
  res.json(heroes)
})

// PUT /hero — set (or clear) the hero for a given track + week
// body: { week, track, memberName }  — memberName === '' clears that week's hero
router.put('/hero', async (req, res) => {
  const { week, track, memberName } = req.body
  if (!week || week < 1 || week > 12) return res.status(400).json({ error: 'Week must be 1-12.' })
  if (!TRACKS.includes(track)) return res.status(400).json({ error: 'Invalid track.' })

  if (!memberName || !memberName.trim()) {
    await HeroOfWeek.deleteOne({ week, track })
  } else {
    await HeroOfWeek.findOneAndUpdate(
      { week, track },
      { memberName: memberName.trim() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }

  await resyncHeroWins(track)
  res.json({ ok: true })
})

module.exports = router
