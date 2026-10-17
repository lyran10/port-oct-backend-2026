import { config } from '../config.js'
import { connectDb, disconnectDb } from '../db.js'
import { Education } from '../models/education.js'
import { Experience } from '../models/experience.js'
import { Profile } from '../models/profile.js'
import { Project } from '../models/project.js'
import { SkillGroup } from '../models/skill-group.js'
import {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
} from '../schemas.js'
import { seedData } from './data.js'

// Usage: npm run seed            -> fills an empty database
//        npm run seed -- --force -> wipes existing data and re-seeds
const force = process.argv.includes('--force')

await connectDb(config.MONGODB_URI)

try {
  if (!force && (await Profile.countDocuments()) > 0) {
    console.log('Database already has data. Run `npm run seed -- --force` to replace it.')
  } else {
    await Promise.all([
      Profile.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      SkillGroup.deleteMany({}),
      Project.deleteMany({}),
    ])
    await Profile.create(profileSchema.parse(seedData.profile))
    await Experience.insertMany(seedData.experience.map((item) => experienceSchema.parse(item)))
    await Education.insertMany(seedData.education.map((item) => educationSchema.parse(item)))
    await SkillGroup.insertMany(seedData.skills.map((item) => skillGroupSchema.parse(item)))
    await Project.insertMany(seedData.projects.map((item) => projectSchema.parse(item)))
    console.log('Database seeded.')
  }
} finally {
  await disconnectDb()
}
