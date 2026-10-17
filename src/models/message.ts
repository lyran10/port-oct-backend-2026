import { Schema, model } from 'mongoose'

// A message sent from the contact form on the portfolio site.
const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Message = model('Message', messageSchema)
