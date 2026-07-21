require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const waitlistRoutes = require('./routes/waitlist')
const sessionsRoutes = require('./routes/sessions')
const rsvpRoutes = require('./routes/rsvp')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 5000


app.options('*', cors()) 
// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/waitlist', waitlistRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/rsvp', rsvpRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Praktis API is running 🚀', status: 'ok' })
})

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.path} not found` })
})

// ── MongoDB + Server Start ────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
