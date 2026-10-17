import { Schema, model } from 'mongoose'

const educationSchema = new Schema(
  {
    school: { type: String, required: true },
    degree: { type: String, required: true },
    location: { type: String, required: true },
    period: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Education = model('Education', educationSchema)
