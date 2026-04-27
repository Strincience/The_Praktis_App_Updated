const mongoose = require('mongoose')

const waitlistSchema = new mongoose.Schema(
  {
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true, lowercase: true, unique: true },
    country:        { type: String, required: true, trim: true },
    state:          { type: String, required: true, trim: true },
    track:          { type: String, required: true },
    skillLevel:     { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    pursuingCareer: { type: String, enum: ['yes', 'no'], required: true },
    isStudent:      { type: String, enum: ['yes', 'no'], required: true },
    schoolName:     { type: String, trim: true },
    whyJoin:        { type: String, required: true },
    commitment:     { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Waitlist', waitlistSchema)
