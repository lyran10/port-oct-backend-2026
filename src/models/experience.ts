import { Schema, model } from 'mongoose'

const experienceSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    period: { type: String, required: true },
    current: { type: Boolean, default: false },
    points: [String],
    stack: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Experience = model('Experience', experienceSchema)
