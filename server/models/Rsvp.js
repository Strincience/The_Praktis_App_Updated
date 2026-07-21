const mongoose = require('mongoose')

const rsvpSchema = new mongoose.Schema(
  {
    session:  { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    fullName: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },     // WhatsApp number, primary contact
    email:    { type: String, required: true, trim: true, lowercase: true },  // must match a Waitlist/member record
    status:   { type: String, enum: ['going', 'cancelled'], default: 'going' },
  },
  { timestamps: true }
)

// One active RSVP per person per session
rsvpSchema.index({ session: 1, whatsapp: 1 }, { unique: true })

module.exports = mongoose.model('Rsvp', rsvpSchema)
