const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    // Lowercased mirror of `name`, used for case-insensitive lookups (the gate check).
    nameLower: { type: String, required: true, trim: true, lowercase: true, index: true },
    track: { type: String, enum: ['Video Editing', 'Creative Design'], required: true },
    // 12 weeks — true if they submitted that week.
    weeklySubmissions: { type: [Boolean], default: () => Array(12).fill(false) },
    // Derived from HeroOfWeek, kept in sync whenever a hero is (re)assigned.
    heroWins: { type: Number, default: 0 },
  },
  { timestamps: true }
)

memberSchema.pre('validate', function (next) {
  if (this.name) this.nameLower = this.name.toLowerCase().trim()
  next()
})

memberSchema.index({ nameLower: 1, track: 1 }, { unique: true })

module.exports = mongoose.model('Member', memberSchema)
