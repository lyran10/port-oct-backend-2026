import { z } from 'zod'

// Request-body validation for every resource. The admin UI sends these shapes.

const text = z.string().trim().min(1, 'Required')
const optionalUrl = z.union([z.url(), z.literal('')]).optional()
const stringList = z.array(text)
const order = z.number().int().default(0)

export const profileSchema = z.object({
  name: text,
  initials: text.max(4),
  role: text,
  tagline: text,
  summary: text,
  location: text,
  emails: z.array(z.email()).min(1, 'Add at least one email'),
  phones: z.array(z.object({ label: text, value: text })),
  resumeUrl: z.string().trim().default(''),
  social: z.object({
    github: optionalUrl,
    linkedin: optionalUrl,
    leetcode: optionalUrl,
    instagram: optionalUrl,
  }),
  stats: z.array(z.object({ label: text, value: text })),
})

export const experienceSchema = z.object({
  company: text,
  role: text,
  period: text,
  current: z.boolean().default(false),
  points: stringList,
  stack: stringList,
  order,
})

export const educationSchema = z.object({
  school: text,
  degree: text,
  location: text,
  period: text,
  order,
})

export const skillGroupSchema = z.object({
  group: text,
  skills: z.array(z.object({ name: text, level: z.number().int().min(0).max(100) })),
  order,
})

export const projectSchema = z.object({
  title: text,
  description: text,
  highlights: stringList,
  stack: stringList,
  link: optionalUrl,
  repo: optionalUrl,
  status: z.enum(['Live', 'In Progress']),
  order,
})

// Contact form on the public site. `website` is a hidden "honeypot" field: people never see it,
// so if it has a value the sender is a bot.
export const contactSchema = z.object({
  name: text.max(100, 'Name is too long'),
  email: z.email('Enter a valid email').max(200),
  message: text.max(5000, 'Message is too long (max 5000 characters)'),
  website: z.string().optional(),
})

export const messageUpdateSchema = z.object({ read: z.boolean() })
