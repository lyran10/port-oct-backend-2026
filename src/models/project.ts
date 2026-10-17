import { Schema, model } from 'mongoose'

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [String],
    stack: [String],
    link: String,
    repo: String,
    status: { type: String, enum: ['Live', 'In Progress'], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Project = model('Project', projectSchema)
