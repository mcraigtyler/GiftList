# GiftList

A social gift-list web app. Share wish lists with friends, let them claim items, and keep surprises intact with built-in spoiler prevention.

## Prerequisites

- **Node.js** 20+
- **npm** 10+ (workspaces support required)
- **Docker** (for the local Postgres database)

## Quick Start

```bash
# 1. Install all dependencies (root + both workspaces)
npm install

# 2. Configure environment variables
cp server/.env.example server/.env
# Edit server/.env — at minimum set POSTGRES_PASSWORD and JWT_SECRET

cp client/.env.example client/.env
# Edit client/.env if you need a non-default API URL

# 3. Start the PostgreSQL database
docker compose up -d

# 4. Generate tsoa routes (required before first compile)
npm run build:tsoa -w server

# 5. Run database migrations
npm run migration:run -w server

# 6. Start both apps in watch mode
npm run dev
```

Client runs at **http://localhost:5173**
API runs at **http://localhost:3001**
OpenAPI spec at **http://localhost:3001/api-docs**

---

## Scripts

### Root (monorepo)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server in parallel (concurrently) |
| `npm run build` | Production build — server first, then client |
| `npm run lint` | ESLint across both workspaces |
| `npm run test` | Unit tests for both workspaces |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run test:e2e:ui` | Playwright interactive UI mode |

### Client (`npm run <cmd> -w client`)

| Command | Description |
|---------|-------------|
| `dev` | Vite dev server on port 5173 |
| `build` | TypeScript check + Vite production build |
| `preview` | Serve the production build locally |
| `lint` | ESLint |
| `test` | Vitest unit tests (watch mode) |
| `test:run` | Vitest unit tests (CI — run once) |

### Server (`npm run <cmd> -w server`)

| Command | Description |
|---------|-------------|
| `dev` | `tsoa spec-and-routes` then nodemon (restarts on file changes) |
| `build` | `tsoa spec-and-routes` then `tsc` |
| `build:tsoa` | Regenerate routes + OpenAPI spec only |
| `lint` | ESLint |
| `test` | Vitest unit tests (watch mode) |
| `test:run` | Vitest unit tests (CI — run once) |
| `migration:generate` | Generate a new TypeORM migration |
| `migration:run` | Apply pending migrations |
| `migration:revert` | Roll back the most recent migration |

---

## Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests once (CI)
npm run test

# Watch mode — client
npm run test -w client

# Watch mode — server
npm run test -w server
```

Test files live alongside source: `src/**/__tests__/*.test.ts(x)`

### API Tests (Bruno)

The `bruno/` folder contains a committed Bruno collection.

1. Install [Bruno](https://www.usebruno.com/) desktop app
2. In Bruno, click **Open Collection** (top-left of the sidebar)
3. In the folder picker, navigate **into** the `bruno/` directory — then click **Select Folder** (Windows) or **Open** (macOS). Do not click any file inside `bruno/`; select the folder itself.
4. Once loaded, click the environment dropdown (top-right) and select **Local**
5. Run requests against your local server

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests (requires the app to be running, or it auto-starts via webServer config)
npm run test:e2e

# Open Playwright UI (great for debugging)
npm run test:e2e:ui
```

E2E tests live in `e2e/`. Playwright runs three viewport projects: **desktop** (1280×800), **tablet** (768×1024), and **mobile** (iPhone 13).

---

## Project Structure

```
/
├── client/          # Vite + React 18 + TypeScript frontend
├── server/          # Express + TSOA + TypeORM API
├── e2e/             # Playwright end-to-end tests
├── bruno/           # Bruno API test collection
└── docs/            # Architecture, PRD, Plan, and design mockups
```

See [docs/Architecture.md](docs/Architecture.md) for the full tech stack, DB schema, API routes, and implementation details.

---

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/giftlist` |
| `JWT_SECRET` | Random secret for signing JWTs (min 32 chars) | `openssl rand -hex 32` |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | API server port | `3001` |
| `CLIENT_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `TYPEORM_SYNCHRONIZE` | Auto-sync schema (dev only, use migrations) | `false` |

### `client/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `http://localhost:3001` |

---

## After Cloning

The `server/src/generated/` directory (tsoa output) is gitignored. Always run `npm run build:tsoa -w server` after cloning or pulling changes that add/modify controllers.
