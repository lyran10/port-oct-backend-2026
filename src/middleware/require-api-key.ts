import { timingSafeEqual } from 'node:crypto'
import type { RequestHandler } from 'express'

import { config } from '../config.js'

const expected = Buffer.from(config.ADMIN_API_KEY)

// Blocks the request unless it carries the admin key in the `x-api-key` header.
export const requireApiKey: RequestHandler = (req, res, next) => {
  const provided = Buffer.from(req.get('x-api-key') ?? '')
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ message: 'Invalid or missing API key' })
    return
  }
  next()
}
