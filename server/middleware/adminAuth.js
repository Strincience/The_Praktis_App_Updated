const jwt = require('jsonwebtoken')

// Protects admin-only routes (member lists, RSVP details, session management).
// Expects: Authorization: Bearer <token>  — token issued by POST /api/admin/login
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Admin login required.' })
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD)
    next()
  } catch (err) {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}

module.exports = requireAdmin
