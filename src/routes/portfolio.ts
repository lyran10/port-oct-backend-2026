import { Router } from 'express'

import { Education } from '../models/education.js'
import { Experience } from '../models/experience.js'
import { Profile } from '../models/profile.js'
import { Project } from '../models/project.js'
import { SkillGroup } from '../models/skill-group.js'

export const portfolioRouter = Router()

const byOrder = { order: 1, createdAt: 1 } as const

// Everything the public portfolio site needs, in one request.
portfolioRouter.get('/', async (_req, res) => {
  const [profile, experience, education, skills, projects] = await Promise.all([
    Profile.findOne(),
    Experience.find().sort(byOrder),
    Education.find().sort(byOrder),
    SkillGroup.find().sort(byOrder),
    Project.find().sort(byOrder),
  ])
  res.json({ profile, experience, education, skills, projects })
})
