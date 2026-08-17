# Tech Pulse Daily — Backend

Express + SQLite API for the Tech Pulse Daily site: serves articles and
handles newsletter signups.

## Setup

```bash
npm install
cp .env.example .env   # then edit ADMIN_TOKEN to something random/secret
npm start               # or: npm run dev (auto-restarts on change)
```

Server runs on `http://localhost:3001` by default (set `PORT` in `.env` to change).

The SQLite database file is created automatically at `db/techpulse.db` on
first run, seeded with 3 sample articles.

## API

### Public

| Method | Path                  | Description                     |
|--------|-----------------------|----------------------------------|
| GET    | `/api/health`         | Health check                    |
| GET    | `/api/articles?limit=` | List articles, newest first     |
| GET    | `/api/articles/:id`   | Get a single article            |
| POST   | `/api/subscribe`      | Body: `{ "email": "..." }`      |

### Admin (require `Authorization: Bearer <ADMIN_TOKEN>`)

| Method | Path                | Description         |
|--------|---------------------|----------------------|
| POST   | `/api/articles`     | Create an article    |
| PUT    | `/api/articles/:id` | Update an article    |
| DELETE | `/api/articles/:id` | Delete an article    |
| GET    | `/api/subscribe`    | List all subscribers |
| GET    | `/api/subscribe/count` | Subscriber count  |

Example — create an article:

```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "tag": "AI",
    "title": "New model released",
    "summary": "Short summary of the story.",
    "author": "AI desk"
  }'
```

## Connecting the frontend

In `index.html`, the script fetches from `http://localhost:3001/api` by
default. To point it at a deployed backend, set this before the script runs:

```html
<script>window.TECH_PULSE_API_BASE = 'https://your-api-domain.com/api';</script>
```

## Deploying

This is a plain Node/Express app with a file-based SQLite DB, so it runs
well on any Node host (Render, Railway, Fly.io, a VPS, etc.):

1. Push this folder to a git repo.
2. Set the `ADMIN_TOKEN` (and optionally `PORT`) environment variable on your host.
3. Build/start command: `npm install && npm start`.
4. Update `CORS` in `server.js` to restrict `origin` to your actual site domain instead of allowing all origins, once you know it.

Note: SQLite works great for a low/medium-traffic site like this, but most
hosts wipe the filesystem on redeploy — if you need the data to persist
across deploys, either mount a persistent volume for `db/techpulse.db`, or
swap in Postgres later (the query layer is small and easy to port).
