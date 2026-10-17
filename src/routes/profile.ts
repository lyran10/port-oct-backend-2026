import { Router } from 'express'

import { requireApiKey } from '../middleware/require-api-key.js'
import { Profile } from '../models/profile.js'
import { profileSchema } from '../schemas.js'

export const profileRouter = Router()

profileRouter.get('/', async (_req, res) => {
  const profile = await Profile.findOne()
  if (!profile) {
    res.status(404).json({ message: 'Profile not set up yet' })
    return
  }
  res.json(profile)
})

// There is only one profile, so PUT creates it the first time and updates it after that.
profileRouter.put('/', requireApiKey, async (req, res) => {
  const data = profileSchema.parse(req.body)
  const profile = await Profile.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    runValidators: true,
  })
  res.json(profile)
})
