import cors from 'cors'
import express from 'express'

import { config } from './config.js'
import { errorHandler, notFound } from './middleware/error-handler.js'
import { requireApiKey } from './middleware/require-api-key.js'
import { Education } from './models/education.js'
import { Experience } from './models/experience.js'
import { Project } from './models/project.js'
import { SkillGroup } from './models/skill-group.js'
import { crudRouter } from './routes/crud.js'
import { messagesRouter } from './routes/messages.js'
import { portfolioRouter } from './routes/portfolio.js'
import { profileRouter } from './routes/profile.js'
import { educationSchema, experienceSchema, projectSchema, skillGroupSchema } from './schemas.js'

export function createApp() {
  const app = express()
  app.set('trust proxy', config.TRUST_PROXY)

  app.use(
    cors({
      origin: (origin, callback) => {
        // Requests without an Origin header (curl, server-to-server) are allowed.
        if (!origin || config.CORS_ORIGINS.includes(origin)) callback(null, true)
        else callback(null, false)
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'x-api-key'],
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  // Log every request, e.g. "POST /api/skills 201 34ms".
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`)
    })
    next()
  })

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })
  // Lets the admin UI check that the key it was given is correct.
  app.get('/api/auth/check', requireApiKey, (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/portfolio', portfolioRouter)
  app.use('/api/profile', profileRouter)
  app.use('/api/experience', crudRouter(Experience, experienceSchema))
  app.use('/api/education', crudRouter(Education, educationSchema))
  app.use('/api/skills', crudRouter(SkillGroup, skillGroupSchema))
  app.use('/api/projects', crudRouter(Project, projectSchema))
  app.use('/api/messages', messagesRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
