# Portfolio Backend

Express + MongoDB API that stores all portfolio content (profile, experience, education, skills, projects).
The portfolio site reads from it; the admin app adds, edits and deletes through it.

## Run locally

```bash
npm install
cp .env.example .env          # then set ADMIN_API_KEY (see below)
docker compose up -d          # starts MongoDB on localhost:27017 (or use your own / MongoDB Atlas)
npm run seed                  # first time only: loads the starting content
npm run dev                   # API on http://localhost:4000
```

Generate an admin key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-reload |
| `npm run build` / `npm start` | Compile to `dist/` and run it |
| `npm run typecheck` | Type check only |
| `npm run seed` | Fill an empty database with the starting content (`src/seed/data.ts`) |
| `npm run seed -- --force` | Wipe the database and re-seed |

## Environment

| Variable | Meaning |
|---|---|
| `PORT` | Port to listen on (default 4000) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGINS` | Comma-separated sites allowed to call the API (portfolio + admin) |
| `ADMIN_API_KEY` | Secret the admin app must send to make changes (min 16 characters) |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + App Password for new-message emails. Leave empty to turn emails off |
| `NOTIFY_EMAIL` | Where alerts go (defaults to `SMTP_USER`) |
| `TRUST_PROXY` | Set to `1` when deployed behind a proxy so rate limiting sees real visitor IPs |

## API

Reads are public. Writes need the header `x-api-key: <ADMIN_API_KEY>`.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/portfolio` | Everything in one response (used by the portfolio site) |
| GET / PUT | `/api/profile` | The single profile document |
| GET / POST | `/api/experience` | List / create |
| GET / PUT / DELETE | `/api/experience/:id` | Read / update / delete one |
| … | `/api/education`, `/api/skills`, `/api/projects` | Same as experience |
| POST | `/api/messages` | Public contact form (max 5 per hour per visitor, hidden bot trap) |
| GET | `/api/messages` | All messages, newest first (admin) |
| PATCH / DELETE | `/api/messages/:id` | Mark read/unread `{ "read": true }` / delete (admin) |
| GET | `/api/auth/check` | Returns 200 if the API key is correct |
| GET | `/api/health` | Health check |

Invalid bodies return `400` with `issues: [{ path, message }]`.
