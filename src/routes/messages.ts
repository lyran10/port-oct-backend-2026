import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'

import { sendNewMessageAlert } from '../mailer.js'
import { requireApiKey } from '../middleware/require-api-key.js'
import { Message } from '../models/message.js'
import { contactSchema, messageUpdateSchema } from '../schemas.js'

export const messagesRouter = Router()

// At most 5 messages per hour from the same visitor.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
})

// Public: the portfolio contact form.
messagesRouter.post('/', contactLimiter, async (req, res) => {
  const { website, ...data } = contactSchema.parse(req.body)

  // Bots fill the hidden field. Pretend it worked so they don't retry, but save nothing.
  if (website) {
    res.status(201).json({ ok: true })
    return
  }

  await Message.create(data)
  res.status(201).json({ ok: true })

  // Sent after responding so a slow or failing mail server never blocks the visitor.
  sendNewMessageAlert(data).catch((error) => console.error('Email alert failed:', error))
})

// Admin only from here on.
messagesRouter.get('/', requireApiKey, async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }))
})

messagesRouter.patch('/:id', requireApiKey, async (req, res) => {
  const data = messageUpdateSchema.parse(req.body)
  const doc = await Message.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!doc) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.json(doc)
})

messagesRouter.delete('/:id', requireApiKey, async (req, res) => {
  const doc = await Message.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ message: 'Not found' })
    return
  }
  res.status(204).end()
})
