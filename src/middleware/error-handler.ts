import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'Not found' })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      issues: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    })
    return
  }
  // An id that isn't a valid MongoDB ObjectId can't match anything.
  if (err?.name === 'CastError') {
    res.status(404).json({ message: 'Not found' })
    return
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON body' })
    return
  }
  console.error(err)
  // Outside production, send the real reason so it shows up in the admin app and browser.
  const detail = process.env.NODE_ENV !== 'production' && err instanceof Error ? err.message : undefined
  res.status(500).json({ message: detail ? `Server error: ${detail}` : 'Something went wrong' })
}
