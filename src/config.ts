import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:5174')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  ADMIN_API_KEY: z.string().min(16, 'ADMIN_API_KEY must be at least 16 characters'),

  // Email alerts for new contact messages. Leave SMTP_USER empty to turn them off.
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  NOTIFY_EMAIL: z.string().default(''),

  // Set to 1 when running behind a proxy / load balancer (Render, Railway, nginx…)
  // so rate limiting sees the visitor's real IP instead of the proxy's.
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:\n' + z.prettifyError(parsed.error))
  process.exit(1)
}

export const config = parsed.data
