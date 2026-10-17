import { Schema, model } from 'mongoose'

const labelValue = new Schema({ label: String, value: String }, { _id: false })

// A single document holds the profile (name, contact details, social links, stats).
const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    initials: { type: String, required: true },
    role: { type: String, required: true },
    tagline: { type: String, required: true },
    summary: { type: String, required: true },
    location: { type: String, required: true },
    emails: [String],
    phones: [labelValue],
    resumeUrl: { type: String, default: '' },
    social: {
      github: String,
      linkedin: String,
      leetcode: String,
      instagram: String,
    },
    stats: [labelValue],
  },
  { timestamps: true },
)

export const Profile = model('Profile', profileSchema)
