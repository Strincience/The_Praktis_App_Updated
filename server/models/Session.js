const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    track:       { type: String, enum: ['Creative Design', 'Video Editing'], required: true },
    title:       { type: String, trim: true },                 // optional, e.g. "Intro to Layout"
    date:        { type: Date, required: true },                // session date + time
    tutorName:   { type: String, trim: true },
    minHeadcount:{ type: Number, default: 3 },                  // below this, flag for reschedule
    status:      { type: String, enum: ['scheduled', 'confirmed', 'cancelled', 'completed'], default: 'scheduled' },
    notes:       { type: String, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Session', sessionSchema)
