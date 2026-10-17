import { Router } from 'express'
import type { Model } from 'mongoose'
import type { ZodType } from 'zod'

import { requireApiKey } from '../middleware/require-api-key.js'

// Builds list / get / create / update / delete routes for one collection.
// Reads are public; writes need the admin API key.
export function crudRouter<T>(model: Model<T>, schema: ZodType) {
  const router = Router()

  router.get('/', async (_req, res) => {
    console.log(_req)
    res.json(await model.find().sort({ order: 1, createdAt: 1 }))
  })

  router.get('/:id', async (req, res) => {
    const doc = await model.findById(req.params.id)
    if (!doc) {
      res.status(404).json({ message: 'Not found' })
      return
    }
    res.json(doc)
  })

  router.post('/', requireApiKey, async (req, res) => {
    const data = schema.parse(req.body) as Partial<T>
    res.status(201).json(await model.create(data))
  })

  router.put('/:id', requireApiKey, async (req, res) => {
    const data = schema.parse(req.body) as Partial<T>
    const doc = await model.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })
    if (!doc) {
      res.status(404).json({ message: 'Not found' })
      return
    }
    res.json(doc)
  })

  router.delete('/:id', requireApiKey, async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id)
    if (!doc) {
      res.status(404).json({ message: 'Not found' })
      return
    }
    res.status(204).end()
  })

  return router
}
