# GiftList — Implementation Plan

## Overview

29 tasks across 6 phases. Each task is a discrete unit of work that can be reviewed independently. Complete phases in order — later phases depend on earlier ones.

---

## Phase 1 — Project Scaffolding

> Goal: Working monorepo with both apps running locally, connected to a local Postgres DB.

- [x] **Task 1** — Init monorepo root with `package.json` (workspaces), `.gitignore`, and `README.md`
- [x] **Task 2** — Scaffold `client/` with Vite + React + TypeScript; install TanStack Query, React Router, PrimeReact, PrimeIcons, and PrimeFlex; install Vitest + `@testing-library/react` for unit tests; install Playwright and create `playwright.config.ts` with desktop / tablet / mobile viewport projects pointing at `http://localhost:5173`; add `e2e/` folder at monorepo root
- [x] **Task 3** — Scaffold `server/` with Express + TypeScript; install tsoa; configure `tsconfig` (with `experimentalDecorators` + `emitDecoratorMetadata`), `nodemon`, `ts-node`, and `tsoa.json`; install Vitest for unit tests
- [x] **Task 4** — Configure PrimeReact Lara Dark Indigo theme, import PrimeFlex and PrimeIcons in `theme.css`; add Inter font; configure Tailwind for layout utilities alongside PrimeReact
- [x] **Task 5** — Init TypeORM in `server/`; write all entity classes using `@PrimaryColumn('uuid')` + `@BeforeInsert()` uuidv7 pattern; write all repository files in `src/repositories/` (one per entity, using `.extend()`); configure `dataSource.ts`; run first migration against local Postgres
- [x] **Task 6** — Wire up Express entry point: CORS, cookie-parser, JSON body parser, mount tsoa-generated `RegisterRoutes(app)`, global error handler; add `tsoa spec-and-routes` to dev/build scripts
- [x] **Task 6a** — Init Bruno collection at `bruno/` in monorepo root; add resource folders (`auth`, `lists`, `items`, `friends`, `invites`, `claims`); configure `Local` and `Production` Bruno environments with `baseUrl`; commit `.bru` files to repo alongside source

---

## Phase 2 — Authentication

> Goal: Users can register, login, and stay logged in across page refreshes.

- [ ] **Task 7** — Implement `auth` resource: `auth.resource.ts` (DTOs), `auth.controller.ts` (`@Route('auth')`), `auth.service.ts` (imports `UserRepository`); covers register, login (sets httpOnly cookie), logout, me
- [ ] **Task 8** — Write `middleware/authentication.ts` (tsoa's `expressAuthentication` — reads JWT cookie, verifies, returns payload); write `lib/jwt.ts` and `lib/password.ts`
- [ ] **Task 9** — Build `LoginPage` and `RegisterPage` with form validation
- [ ] **Task 10** — Implement `AuthContext` (current user state, login/logout helpers) and `ProtectedRoute` wrapper

---

## Phase 3 — Lists & Items

> Goal: Authenticated users can create lists, add items via URL, and see auto-scraped product metadata.

- [ ] **Task 11** — Implement `list` resource: `list.resource.ts`, `list.controller.ts`, `list.service.ts` (imports `GiftListRepository`, `FriendshipRepository`, `ListInviteRepository`); `canViewList` access control; full CRUD
- [ ] **Task 12** — Implement `item` resource: `item.resource.ts`, `item.controller.ts`, `item.service.ts` (imports `GiftItemRepository`)
- [ ] **Task 13** — Add OG scraper to `item.service.ts` (wraps `open-graph-scraper`); expose `POST /og-scrape` in `item.controller.ts` for client-side URL preview
- [ ] **Task 14** — Build `MyListsPage` (PrimeReact `Card` grid, `Dialog` for create list, `ConfirmDialog` for delete; responsive `col-12 md:col-6 lg:col-4` grid)
- [ ] **Task 15** — Build `ListDetailPage` (PrimeReact `Card` per item with image/title/price/URL; `Dialog` for add-item with URL + auto-scrape; `SelectButton` for priority; responsive single/two-column layout)

---

## Phase 4 — Friends & Sharing

> Goal: Users can connect with friends, share lists, and invite specific people to private lists.

- [ ] **Task 16** — Implement `user` resource (`user.service.ts` imports `UserRepository`) and `friend` resource (`friend.service.ts` imports `FriendshipRepository` + `GiftListRepository`); full friend request flow
- [ ] **Task 17** — Access control (`canViewList`) lives in `list.service.ts`; ensure all list GET endpoints call it before returning data
- [ ] **Task 18** — Implement `invite` resource: `invite.controller.ts`, `invite.service.ts` (imports `ListInviteRepository` + `GiftListRepository`)
- [ ] **Task 19** — Build `FriendsPage` (`DataView` for friend list + pending requests; `IconField` search input; responsive layout)
- [ ] **Task 20** — Build `DashboardPage` (friends' visible lists in responsive card grid; my lists summary panel)
- [ ] **Task 21** — Build `ListEditPage` (`InputText` / `InputTextarea` for name+description; `SelectButton` for visibility toggle; `DataView` for invite management)
- [ ] **Task 22** — Build `InvitesPage` (`DataView` of pending list invites with Accept / Decline `Button` actions)

---

## Phase 5 — Gift Claiming

> Goal: Viewers can claim gifts; claims are hidden from the list owner.

- [ ] **Task 23** — Implement `claim` resource: `claim.controller.ts`, `claim.service.ts` (imports `GiftClaimRepository` + `GiftItemRepository`); spoiler-prevention logic strips claims when requester is list owner
- [ ] **Task 24** — Add claim UI to `ListDetailPage` — PrimeReact `Button` to claim/unclaim for non-owners; PrimeReact `Tag` badge ("Claimed by X") for claimed items; hidden entirely on owner view
- [ ] **Task 25** — Build `MyClaimsPage` (all items I've claimed, grouped by list/friend)

---

## Phase 6 — Polish & Deploy

> Goal: Production-ready app deployed to Railway.

- [ ] **Task 26** — Global error handling; PrimeReact `Skeleton` loading states; empty state illustrations; PrimeReact `Toast` notifications throughout; verify responsive layout on mobile/tablet/desktop
- [ ] **Task 27** — Build `ProfilePage` (edit display name, upload/change avatar)
- [ ] **Task 28** — Railway deployment config: `Dockerfile` or nixpacks for both `client` and `server`; environment variable documentation in `README.md`
- [ ] **Task 29** — End-to-end smoke test: register two users, add friends, create list, add items, claim gifts, verify spoiler prevention

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `server/tsoa.json` | tsoa config — controller globs, generated output paths, auth module |
| `server/src/entities/` | TypeORM entity classes (uuidv7 PKs) — DB schema source of truth |
| `server/src/lib/dataSource.ts` | TypeORM DataSource singleton + migration config |
| `server/src/middleware/authentication.ts` | tsoa `expressAuthentication` — JWT cookie verification |
| `server/src/repositories/` | One repository per entity — all custom TypeORM `.extend()` query methods |
| `server/src/resources/list/list.service.ts` | `canViewList` access control + list CRUD |
| `server/src/resources/item/item.service.ts` | Item CRUD + OG scraper |
| `server/src/resources/claim/claim.service.ts` | Claim logic + spoiler-prevention strip |
| `server/src/generated/routes.ts` | tsoa-generated Express routes — do not edit |
| `client/src/theme/theme.css` | PrimeReact theme imports + CSS variable overrides |
| `client/src/api/*.api.ts` | Per-domain API modules — each exports fetch functions + query key factories (`listKeys`, `friendKeys`, etc.) |
| `client/src/context/AuthContext.tsx` | Global auth state |
| `client/src/pages/ListDetailPage.tsx` | Core UX — viewing list + claiming |
| `client/src/pages/DashboardPage.tsx` | Main landing page after login |

---

## Environment Variables

```
# server/.env
DATABASE_URL=postgresql://user:pass@host:5432/giftlist
JWT_SECRET=<random 256-bit secret>
NODE_ENV=development
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
TYPEORM_SYNCHRONIZE=false

# client/.env
VITE_API_BASE_URL=http://localhost:3001
```
