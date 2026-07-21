const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

// POST /api/admin/login — exchange the shared admin password for a short-lived token
router.post('/login', (req, res) => {
  const { password } = req.body

  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not set on the server.')
    return res.status(500).json({ error: 'Admin login is not configured yet.' })
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const token = jwt.sign(
    { role: 'admin' },
    process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD,
    { expiresIn: '12h' }
  )

  res.json({ token })
})

module.exports = router
