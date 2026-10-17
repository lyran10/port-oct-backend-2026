import { Schema, model } from 'mongoose'

const skillSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false },
)

const skillGroupSchema = new Schema(
  {
    group: { type: String, required: true },
    skills: [skillSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const SkillGroup = model('SkillGroup', skillGroupSchema)
