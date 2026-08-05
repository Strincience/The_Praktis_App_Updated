const mongoose = require('mongoose')

const heroOfWeekSchema = new mongoose.Schema(
  {
    week:       { type: Number, min: 1, max: 12, required: true },
    track:      { type: String, enum: ['Video Editing', 'Creative Design'], required: true },
    memberName: { type: String, trim: true, required: true },
  },
  { timestamps: true }
)

// One hero per track per week.
heroOfWeekSchema.index({ week: 1, track: 1 }, { unique: true })

module.exports = mongoose.model('HeroOfWeek', heroOfWeekSchema)
