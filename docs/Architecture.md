# GiftList — Architecture

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite + TypeScript | Fast dev server, modern tooling |
| UI Components | PrimeReact + PrimeIcons | Rich component library (inputs, dialogs, cards, toasts, etc.) |
| Layout / Grid | PrimeFlex | Responsive flex/grid utilities, aligns with PrimeReact |
| Routing | React Router v6 | Client-side SPA routing |
| Server state | TanStack Query (React Query) | Single source of truth for all server state — do not copy into `useState` |
| Styling | Tailwind CSS | Layout utilities + responsive breakpoints alongside PrimeReact |
| Backend | Node.js + Express + TypeScript | Lightweight REST API |
| API Framework | tsoa | Decorator-based controllers → auto-generates Express routes + OpenAPI spec |
| ORM | TypeORM | Decorator-based entities, migrations, repository pattern |
| IDs | uuidv7 | Time-ordered UUIDs — better DB index locality than v4 |
| Database | PostgreSQL | Relational, strong for social graphs + lists |
| Auth | JWT stored in httpOnly cookies | Secure, stateless, CSRF-resistant |
| Link scraping | `open-graph-scraper` (npm) | Pulls product title, image, price from URLs |
| Hosting | Railway | Managed Postgres + unified deploys from GitHub |

---

## Project Structure

```
/
├── client/                        # Vite + React frontend
│   ├── src/
│   │   ├── api/                   # TanStack Query hooks + typed fetch wrappers
│   │   │   ├── auth.ts
│   │   │   ├── lists.ts
│   │   │   ├── items.ts
│   │   │   ├── friends.ts
│   │   │   └── claims.ts
│   │   ├── components/            # Shared layout/composite components
│   │   │   ├── Navbar.tsx         # Top nav with hamburger menu on mobile
│   │   │   ├── GiftCard.tsx       # PrimeReact Card wrapping a gift item
│   │   │   ├── ListCard.tsx       # PrimeReact Card wrapping a gift list
│   │   │   └── FriendCard.tsx     # PrimeReact Card wrapping a friend
│   │   ├── pages/                 # Route-level page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── MyListsPage.tsx
│   │   │   ├── ListDetailPage.tsx
│   │   │   ├── ListEditPage.tsx
│   │   │   ├── FriendsPage.tsx
│   │   │   ├── InvitesPage.tsx
│   │   │   ├── MyClaimsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Current user state + login/logout helpers
│   │   ├── theme/
│   │   │   └── theme.css          # PrimeReact theme imports + CSS variable overrides
│   │   ├── api/                   # One module per server resource — exports fetch fns + query keys
│   │   │   ├── api.ts             # Base fetch wrapper (attaches credentials)
│   │   │   ├── auth.api.ts        # authApi + (no keys — auth state lives in AuthContext)
│   │   │   ├── lists.api.ts       # listsApi + listKeys
│   │   │   ├── items.api.ts       # itemsApi + itemKeys
│   │   │   ├── friends.api.ts     # friendsApi + friendKeys
│   │   │   ├── invites.api.ts     # invitesApi + inviteKeys
│   │   │   └── claims.api.ts      # claimsApi + claimKeys
│   │   └── utils/
│   ├── index.html
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── server/                        # Express backend
│   ├── tsoa.json                  # tsoa config (entryPoints, routes output, spec output)
│   └── src/
│       ├── index.ts               # App entry point: init DataSource, register generated routes, start server
│       ├── resources/             # One folder per API resource
│       │   ├── auth/
│       │   │   ├── auth.resource.ts     # DTOs: LoginDto, RegisterDto, AuthResponse
│       │   │   ├── auth.controller.ts   # @Route('auth') — register, login, logout, me
│       │   │   └── auth.service.ts      # bcrypt verify, JWT sign; imports UserRepository
│       │   ├── user/
│       │   │   ├── user.resource.ts     # DTOs: UserResponse, UpdateProfileDto
│       │   │   ├── user.controller.ts   # @Route('users') — search, updateProfile
│       │   │   └── user.service.ts      # imports UserRepository
│       │   ├── friend/
│       │   │   ├── friend.resource.ts   # DTOs: FriendResponse, FriendRequestDto, FriendsListsResponse
│       │   │   ├── friend.controller.ts # @Route('friends') — list, requests, request, accept, remove, lists
│       │   │   └── friend.service.ts    # imports FriendshipRepository + GiftListRepository
│       │   ├── list/
│       │   │   ├── list.resource.ts     # DTOs: CreateListDto, UpdateListDto, ListResponse, ListDetailResponse
│       │   │   ├── list.controller.ts   # @Route('lists') — CRUD
│       │   │   └── list.service.ts      # imports GiftListRepository + FriendshipRepository + ListInviteRepository; owns canViewList
│       │   ├── item/
│       │   │   ├── item.resource.ts     # DTOs: CreateItemDto, UpdateItemDto, ItemResponse, OgScrapeResult
│       │   │   ├── item.controller.ts   # @Route('lists') POST /{listId}/items; @Route('items') PUT/DELETE; @Route('og-scrape')
│       │   │   └── item.service.ts      # imports GiftItemRepository; OG scraper call
│       │   ├── invite/
│       │   │   ├── invite.resource.ts   # DTOs: CreateInviteDto, InviteResponse
│       │   │   ├── invite.controller.ts # @Route('lists') POST /{listId}/invites, DELETE /{listId}/invites/{id}; @Route('invites') GET, PUT /{id}/accept
│       │   │   └── invite.service.ts    # imports ListInviteRepository + GiftListRepository
│       │   └── claim/
│       │       ├── claim.resource.ts    # DTOs: ClaimResponse, MyClaimsResponse
│       │       ├── claim.controller.ts  # @Route('items') POST /{id}/claim, DELETE /{id}/claim; @Route('claims') GET
│       │       └── claim.service.ts     # imports GiftClaimRepository + GiftItemRepository; spoiler-prevention logic
│       ├── entities/              # TypeORM entity classes (no business logic)
│       │   ├── User.entity.ts
│       │   ├── Friendship.entity.ts
│       │   ├── GiftList.entity.ts
│       │   ├── ListInvite.entity.ts
│       │   ├── GiftItem.entity.ts
│       │   └── GiftClaim.entity.ts
│       ├── repositories/          # One repository per entity — extend() with domain query methods
│       │   ├── User.repository.ts          # findByEmail, search, findById
│       │   ├── Friendship.repository.ts    # findAccepted, findPending, findBetween
│       │   ├── GiftList.repository.ts      # findByOwner, findWithItems, findVisibleToUser
│       │   ├── ListInvite.repository.ts    # findByList, findPendingForUser, findByIdAndList
│       │   ├── GiftItem.repository.ts      # findByList, findById (with claim relation)
│       │   └── GiftClaim.repository.ts     # findByItem, findByUser, removeByItem
│       ├── middleware/
│       │   ├── errorHandler.ts    # Global Express error handler
│       │   └── authentication.ts  # tsoa expressAuthentication — verifies JWT cookie
│       ├── lib/
│       │   ├── dataSource.ts      # TypeORM DataSource singleton
│       │   ├── jwt.ts             # Sign/verify JWT helpers
│       │   └── password.ts        # bcrypt helpers
│       └── generated/             # tsoa output — DO NOT EDIT (regenerated on build)
│           ├── routes.ts          # RegisterRoutes(app) — mounted in index.ts
│           └── swagger.json       # OpenAPI spec — served at /api-docs
│
└── docs/
    ├── PRD.md
    ├── Architecture.md            # This file
    └── Plan.md
```

---

## Database Schema

Entities live in `server/src/entities/`. TypeORM reads them via `dataSource.ts` and manages migrations.

All primary keys use **uuidv7** (time-ordered UUIDs) via a `@BeforeInsert()` hook. TypeORM's `@PrimaryColumn('uuid')` stores them as native Postgres `uuid` columns.

```typescript
// Shared pattern — every entity uses this instead of @PrimaryGeneratedColumn
import { uuidv7 } from 'uuidv7'

// @PrimaryColumn('uuid')
// @BeforeInsert() setId() { if (!this.id) this.id = uuidv7() }

// ── Enums (defined once, used across entities) ──────────────────────────────
export enum FriendshipStatus { PENDING = 'PENDING', ACCEPTED = 'ACCEPTED', DECLINED = 'DECLINED' }
export enum ListVisibility   { PRIVATE = 'PRIVATE', FRIENDS = 'FRIENDS' }
export enum InviteStatus     { PENDING = 'PENDING', ACCEPTED = 'ACCEPTED' }

// server/src/entities/User.ts
@Entity() export class User {
  @PrimaryColumn('uuid')          id: string
  @BeforeInsert() setId()         { if (!this.id) this.id = uuidv7() }
  @Column({ unique: true })       email: string
  @Column()                       passwordHash: string
  @Column()                       displayName: string
  @Column({ nullable: true })     avatarUrl: string
  @CreateDateColumn()             createdAt: Date

  @OneToMany(() => GiftList,   l => l.owner)       lists: GiftList[]
  @OneToMany(() => Friendship, f => f.requester)   sentRequests: Friendship[]
  @OneToMany(() => Friendship, f => f.addressee)   receivedRequests: Friendship[]
  @OneToMany(() => ListInvite, i => i.invitee)     listInvites: ListInvite[]
  @OneToMany(() => GiftClaim,  c => c.claimedBy)   claims: GiftClaim[]
}

// server/src/entities/Friendship.ts
@Entity()
@Unique(['requesterId', 'addresseeId'])
export class Friendship {
  @PrimaryColumn('uuid')    id: string
  @BeforeInsert() setId()   { if (!this.id) this.id = uuidv7() }
  @ManyToOne(() => User) @JoinColumn() requester: User
  @Column()                            requesterId: string
  @ManyToOne(() => User) @JoinColumn() addressee: User
  @Column()                            addresseeId: string
  @Column({ type: 'enum', enum: FriendshipStatus, default: FriendshipStatus.PENDING })
                                       status: FriendshipStatus
  @CreateDateColumn()                  createdAt: Date
}

// server/src/entities/GiftList.ts
@Entity() export class GiftList {
  @PrimaryColumn('uuid')    id: string
  @BeforeInsert() setId()   { if (!this.id) this.id = uuidv7() }
  @ManyToOne(() => User, u => u.lists) @JoinColumn() owner: User
  @Column()                            ownerId: string
  @Column()                            name: string
  @Column({ nullable: true })          description: string
  @Column({ type: 'enum', enum: ListVisibility, default: ListVisibility.PRIVATE })
                                       visibility: ListVisibility
  @CreateDateColumn()                  createdAt: Date

  @OneToMany(() => GiftItem,   i => i.list)   items: GiftItem[]
  @OneToMany(() => ListInvite, i => i.list)   invites: ListInvite[]
}

// server/src/entities/ListInvite.ts
@Entity() export class ListInvite {
  @PrimaryColumn('uuid')    id: string
  @BeforeInsert() setId()   { if (!this.id) this.id = uuidv7() }
  @ManyToOne(() => GiftList, l => l.invites) list: GiftList
  @Column()                                  listId: string
  @Column()                                  inviteeEmail: string
  @ManyToOne(() => User, { nullable: true }) invitee: User | null
  @Column({ nullable: true })                inviteeId: string | null
  @Column({ type: 'enum', enum: InviteStatus, default: InviteStatus.PENDING })
                                             status: InviteStatus
  @CreateDateColumn()                        createdAt: Date
}

// server/src/entities/GiftItem.ts
@Entity() export class GiftItem {
  @PrimaryColumn('uuid')    id: string
  @BeforeInsert() setId()   { if (!this.id) this.id = uuidv7() }
  @ManyToOne(() => GiftList, l => l.items) list: GiftList
  @Column()                                listId: string
  @Column()                                title: string
  @Column()                                url: string
  @Column({ nullable: true })              description: string
  @Column({ nullable: true })              price: string
  @Column({ nullable: true })              imageUrl: string
  @Column({ default: 1 })                  priority: number  // 1=low 2=medium 3=high
  @CreateDateColumn()                      createdAt: Date

  @OneToOne(() => GiftClaim, c => c.item) claim: GiftClaim | null
}

// server/src/entities/GiftClaim.ts
@Entity() export class GiftClaim {
  @PrimaryColumn('uuid')    id: string
  @BeforeInsert() setId()   { if (!this.id) this.id = uuidv7() }
  @OneToOne(() => GiftItem, i => i.claim) @JoinColumn() item: GiftItem
  @Column()                                              itemId: string
  @ManyToOne(() => User, u => u.claims)                 claimedBy: User
  @Column()                                             userId: string
  @CreateDateColumn()                                   createdAt: Date
}
```

### TypeORM DataSource (`server/src/lib/dataSource.ts`)

```typescript
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Friendship, GiftList, ListInvite, GiftItem, GiftClaim],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,  // use migrations in all environments
})
```

---

## REST API Reference

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login, set httpOnly JWT cookie |
| POST | `/logout` | Required | Clear cookie |
| GET | `/me` | Required | Return current user |

### Users — `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/search?q=` | Required | Search by email or display name |

### Friends — `/api/friends`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Required | List accepted friends |
| GET | `/requests` | Required | Incoming pending friend requests |
| POST | `/request` | Required | Send friend request `{ email }` |
| PUT | `/:id/accept` | Required | Accept a friend request |
| DELETE | `/:id` | Required | Remove friend or decline request |
| GET | `/lists` | Required | All lists visible to me from friends |

### Lists — `/api/lists`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Required | My own lists |
| POST | `/` | Required | Create a list |
| GET | `/:id` | Required | Get list + items (access-controlled) |
| PUT | `/:id` | Required | Update list name/description/visibility |
| DELETE | `/:id` | Required | Delete list (owner only) |

### List Invites — `/api/lists/:id/invites` & `/api/invites`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/lists/:id/invites` | Required | Invite user by email |
| DELETE | `/api/lists/:id/invites/:inviteId` | Required | Revoke invite |
| GET | `/api/invites` | Required | My pending list invites |
| PUT | `/api/invites/:id/accept` | Required | Accept a list invite |

### Gift Items — `/api/lists/:id/items` & `/api/items`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/lists/:id/items` | Required | Add item (triggers OG scrape) |
| PUT | `/api/items/:id` | Required | Update item (list owner only) |
| DELETE | `/api/items/:id` | Required | Delete item (list owner only) |
| POST | `/api/og-scrape` | Required | Scrape OG metadata from a URL |

### Claims — `/api/items/:id/claim` & `/api/claims`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/items/:id/claim` | Required | Claim a gift item |
| DELETE | `/api/items/:id/claim` | Required | Unclaim a gift item |
| GET | `/api/claims` | Required | All gifts I have claimed |

---

## Frontend Routes

All page components are **lazy-loaded** via `React.lazy()`. Route-level `<Suspense>` shows a PrimeReact `<ProgressSpinner>` fallback while the chunk loads.

```tsx
// client/src/App.tsx
const DashboardPage  = lazy(() => import('./pages/DashboardPage'))
const MyListsPage    = lazy(() => import('./pages/MyListsPage'))
const ListDetailPage = lazy(() => import('./pages/ListDetailPage'))
// ... all pages lazy

function App() {
  return (
    <Suspense fallback={<ProgressSpinner />}>
      <Routes>
        <Route path="/"            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/lists"       element={<ProtectedRoute><MyListsPage /></ProtectedRoute>} />
        <Route path="/lists/:id"   element={<ProtectedRoute><ListDetailPage /></ProtectedRoute>} />
        {/* ... */}
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
      </Routes>
    </Suspense>
  )
}
```

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginPage | Email + password login form |
| `/register` | RegisterPage | Registration form |
| `/` | DashboardPage | Friends' visible lists + my lists summary |
| `/lists` | MyListsPage | Manage my lists (create, edit, delete) |
| `/lists/:id` | ListDetailPage | View list items; claim UI for non-owners |
| `/lists/:id/edit` | ListEditPage | Edit name, visibility, invites |
| `/friends` | FriendsPage | Friends list, requests, search |
| `/invites` | InvitesPage | Accept/decline list invites |
| `/claims` | MyClaimsPage | Gifts I've committed to buying |
| `/profile` | ProfilePage | Edit display name and avatar |

---

## Key Implementation Details

### TSOA Resource Structure

Each resource folder is self-contained:

| File | Responsibility |
|------|---------------|
| `*.resource.ts` | DTOs and response interfaces only — **no imports from other resource files** |
| `*.controller.ts` | tsoa `@Controller` with route/method decorators; calls service methods; no DB logic |
| `*.service.ts` | Orchestrates repository calls; maps Entity ↔ DTO; owns business logic |

Repositories live in `server/src/repositories/`, one per entity. Services import whichever repositories they need — a service commonly spans multiple entities.

### Custom Repository Pattern

Each repository file exports a single constant that extends TypeORM's base repository with domain-specific query methods. Services import them directly — no `AppDataSource.getRepository()` scattered across service code.

```typescript
// server/src/repositories/GiftList.repository.ts
import { AppDataSource } from '../lib/dataSource'
import { GiftList } from '../entities/GiftList'

export const GiftListRepository = AppDataSource.getRepository(GiftList).extend({

  findByOwner(ownerId: string) {
    return this.find({ where: { ownerId }, order: { createdAt: 'DESC' } })
  },

  findWithItems(id: string) {
    return this.findOne({
      where: { id },
      relations: { items: { claim: { claimedBy: true } } },
    })
  },

  findVisibleToUser(userId: string, friendIds: string[]) {
    return this.createQueryBuilder('list')
      .where('list.ownerId = :userId', { userId })
      .orWhere(
        'list.visibility = :friends AND list.ownerId IN (:...friendIds)',
        { friends: 'FRIENDS', friendIds: friendIds.length ? friendIds : [''] }
      )
      .getMany()
  },
})

// server/src/resources/list/list.service.ts
import { GiftListRepository }    from '../../repositories/GiftList.repository'
import { FriendshipRepository }  from '../../repositories/Friendship.repository'
import { ListInviteRepository }  from '../../repositories/ListInvite.repository'

export class ListService {
  async getList(id: string, requestingUserId: string) {
    const list = await GiftListRepository.findWithItems(id)
    if (!list) throw new NotFoundError()
    if (!await this.canViewList(requestingUserId, list)) throw new ForbiddenError()
    return toListDetailResponse(list, requestingUserId)
  }
}
```

> **Note on initialization order**: Repositories are module-level constants. TypeORM's `DataSource.getRepository().extend()` is safe to call before `initialize()` — the connection is only needed at query time. Ensure `AppDataSource.initialize()` is awaited in `index.ts` before the HTTP server starts accepting requests.

**tsoa.json** (server root):
```json
{
  "entryFile": "src/index.ts",
  "noImplicitAdditionalProperties": "throw-on-extras",
  "controllerPathGlobs": ["src/resources/**/*.controller.ts"],
  "spec": {
    "outputDirectory": "src/generated",
    "specVersion": 3
  },
  "routes": {
    "routesDir": "src/generated",
    "authenticationModule": "src/middleware/authentication"
  }
}
```

**index.ts** mounts generated routes:
```typescript
await AppDataSource.initialize()
RegisterRoutes(app)          // from src/generated/routes.ts
app.use('/api-docs', ...)     // serve swagger.json
```

**authentication.ts** — tsoa's `expressAuthentication`:
```typescript
export async function expressAuthentication(req, securityName) {
  const token = req.cookies.token
  const payload = verifyJwt(token)   // throws → tsoa returns 401
  return payload                     // attached as req.user by tsoa
}
```

### Access Control (`server/src/resources/list/list.service.ts`)

```
canViewList(userId, list):
  if userId === list.ownerId → true (owner)
  if list.visibility === FRIENDS → check Friendship(userId, ownerId).status === ACCEPTED
  if list.visibility === PRIVATE → check ListInvite(listId, userId).status === ACCEPTED
  return false
```

### Claim Spoiler Prevention (`server/src/resources/claim/claim.service.ts`)

`getItemsForList(listId, requestingUserId, isOwner)`:
- Fetches items with their claims via TypeORM relation
- If `isOwner === true` → maps items to `ItemResponse` with `claim: undefined` (stripped)
- Otherwise → maps items to `ItemResponse` with `claim: { claimedByName } | null`

### OG Scraper (`server/src/resources/item/item.service.ts`)

Wraps `open-graph-scraper`. Called internally by `createItem()`:
1. Fetch OG tags from the provided URL
2. Populate `title`, `imageUrl`, `price`, `description` from tags as defaults
3. DTO fields provided by the client override scraped values

### Auth Flow

1. `POST /api/auth/login` → bcrypt verify → sign JWT → `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`
2. Protected controller methods decorated with `@Security('jwt')` → tsoa calls `expressAuthentication` → `req.user` populated
3. `POST /api/auth/logout` → `Set-Cookie: token=; Max-Age=0`

### Frontend State Management

**React Query is the single source of truth for all server state. Never copy query data into `useState`.**

```tsx
// CORRECT — read directly from the query result
function ListDetailPage() {
  const { id } = useParams()
  const { data: list, isPending } = useQuery({
    queryKey: ['list', id],
    queryFn: () => api.lists.getById(id!),
  })

  if (isPending) return <Skeleton />
  return <div>{list.name}</div>
}

// WRONG — copying server state into local state
function ListDetailPage() {
  const { data } = useQuery({ ... })
  const [list, setList] = useState(data)  // ← never do this
}
```

**Rules:**

- Server data (lists, items, friends, claims) → `useQuery` / `useSuspenseQuery`
- Mutations (create, update, delete, claim) → `useMutation` with `onSuccess: () => queryClient.invalidateQueries(...)`
- `useState` is only for **local UI state**: dialog open/closed, form field values, selected tab, input text before submission
- `AuthContext` holds the current user identity (from `GET /auth/me`) — this is the one piece of server-derived state kept outside React Query, since it gates routing

**Query keys** are co-located with their API module — never written as inline string arrays in components. Each `api/*.api.ts` file exports both the fetch functions and the query key factory for that domain.

```ts
// client/src/api/lists.api.ts
import { apiFetch } from './api'
import type { ListResponse, ListDetailResponse, CreateListDto, UpdateListDto } from '../types'

export const listKeys = {
  all:    ()           => ['lists']        as const,
  detail: (id: string) => ['lists', id]   as const,
}

export const listsApi = {
  getAll:   ()                          => apiFetch<ListResponse[]>('/lists'),
  getById:  (id: string)                => apiFetch<ListDetailResponse>(`/lists/${id}`),
  create:   (body: CreateListDto)       => apiFetch<ListResponse>('/lists', { method: 'POST', body }),
  update:   (id: string, body: UpdateListDto) => apiFetch<ListResponse>(`/lists/${id}`, { method: 'PUT', body }),
  remove:   (id: string)                => apiFetch<void>(`/lists/${id}`, { method: 'DELETE' }),
}

// Usage in a component — import keys and api from the same module:
import { listKeys, listsApi } from '../api/lists.api'

useQuery({
  queryKey: listKeys.detail(id),
  queryFn:  () => listsApi.getById(id),
})

// Invalidation after a mutation:
queryClient.invalidateQueries({ queryKey: listKeys.all() })
```

---

## Style Guide

### PrimeReact Theme

- **Theme**: Lara Light Indigo (`primereact/resources/themes/lara-light-indigo/theme.css`)
- **Icons**: PrimeIcons (`primeicons/primeicons.css`)
- **Layout grid**: PrimeFlex (`primeflex/primeflex.css`)
- CSS variable overrides for brand colors live in `client/src/theme/theme.css`

### Color Palette

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Primary | `--primary-color` | `#4F46E5` (Lara Indigo default) | CTAs, links, active states |
| Danger | `--red-500` | `#EF4444` | Delete actions, error states |
| Success | `--green-500` | `#22C55E` | Confirmed / available states |
| Warning | `--orange-400` | `#FB923C` | Medium priority badges |
| Surface | `--surface-ground` | `#F9FAFB` | Page background |
| Card bg | `--surface-card` | `#FFFFFF` | Card backgrounds |
| Text | `--text-color` | `#111827` | Primary text |
| Text muted | `--text-color-secondary` | `#6B7280` | Labels, metadata |

### Typography

- Font family: `Inter` (loaded via Google Fonts; set via `--font-family` CSS variable override)
- Page heading: PrimeReact `className="text-2xl font-semibold"`
- Section heading: `className="text-xl font-semibold"`
- Body: default PrimeReact theme body styles

### PrimeReact Component Mapping

| Use case | PrimeReact Component |
|----------|---------------------|
| Text input | `<InputText>` |
| Password field | `<Password>` |
| Submit / action button | `<Button>` |
| Danger/delete button | `<Button severity="danger">` |
| Secondary action | `<Button severity="secondary">` |
| Confirmation dialog | `<ConfirmDialog>` + `confirmDialog()` |
| Add/edit form overlay | `<Dialog>` |
| Gift item card | `<Card>` |
| Toast notifications | `<Toast>` + `useRef` |
| Tag / badge | `<Tag>` (with `severity` prop) |
| Loading state | `<ProgressSpinner>` or `<Skeleton>` |
| Navigation menu | `<Menubar>` (desktop) / `<Sidebar>` (mobile) |
| Friend request list | `<DataView>` with list layout |
| Pending invites list | `<DataView>` with list layout |
| Priority selector | `<SelectButton>` (Low / Medium / High) |
| Visibility toggle | `<SelectButton>` (Private / Friends) |
| Avatar | `<Avatar>` |
| Search input | `<IconField>` + `<InputIcon>` + `<InputText>` |

### Responsive Design

The app targets three breakpoints using PrimeFlex's grid system:

| Breakpoint | Min width | PrimeFlex prefix |
|------------|-----------|-----------------|
| Mobile | < 576px | *(default)* |
| Tablet | ≥ 576px | `sm:` |
| Desktop | ≥ 992px | `lg:` |

**Layout rules:**

- **Navbar**: full top bar on desktop/tablet; collapses to hamburger + `<Sidebar>` drawer on mobile
- **Page grid**: `p-grid` with `col-12 md:col-6 lg:col-4` for card grids (lists, friends, claims)
- **List detail**: single column on mobile, two columns on tablet+
- **Dialogs**: `style={{ width: '95vw', maxWidth: '500px' }}` — full-width on mobile, constrained on larger screens
- **Spacing**: use PrimeFlex spacing utilities (`p-3`, `m-2`, etc.) rather than custom CSS

---

## Testing Strategy

### Unit Tests (Vitest)

Both `client/` and `server/` use **Vitest** — consistent toolchain, fast watch mode, native TypeScript support.

**Server tests** live at `server/src/**/__tests__/*.test.ts`, co-located with source:

| Target | Mock |
|--------|------|
| Service methods (`canViewList`, spoiler strip, etc.) | Repositories — mock the `.extend()` query methods |
| `jwt.ts` sign/verify helpers | No mocks needed |
| `password.ts` bcrypt helpers | No mocks needed |

High-priority server tests:
- `claim.service.ts` — spoiler-prevention strip (pure logic, high confidence value)
- `list.service.ts` — `canViewList` covering all three paths: owner, FRIENDS visibility, PRIVATE + invite
- `auth.service.ts` — register duplicate email, login bad password, JWT lifecycle

**Client tests** live at `client/src/**/__tests__/*.test.tsx`:

| Target | Mock |
|--------|------|
| `ProtectedRoute` — redirect when unauthenticated | `AuthContext` |
| `AuthContext` — login/logout state transitions | API module (`auth.api.ts`) |
| Custom hooks (if any are extracted) | React Query + API modules |

### API Integration Tests (Bruno)

**Bruno** is a file-based REST client (git-friendly alternative to Postman). Collections are committed to the repo.

Collection lives at `bruno/` in the monorepo root, organized by resource:

```
bruno/
├── auth/
│   ├── register.bru
│   ├── login.bru
│   ├── logout.bru
│   └── me.bru
├── lists/
│   ├── get-my-lists.bru
│   ├── create-list.bru
│   ├── get-list.bru
│   ├── update-list.bru
│   └── delete-list.bru
├── items/
├── friends/
├── invites/
├── claims/
└── bruno.json
```

Two Bruno environments (`Local`, `Production`) store `baseUrl` so collections run against both dev and Railway.

### E2E Tests (Playwright)

**Playwright is the right tool for this app.** The spoiler-prevention feature requires two concurrent authenticated sessions — Playwright supports this natively via multiple browser contexts.

Test files live at `e2e/` in the monorepo root.

**`playwright.config.ts`** — three viewport projects cover the responsive design requirement:

```typescript
export default defineConfig({
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'tablet',  use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'mobile',  use: { ...devices['iPhone 13'] } },
  ],
  use: { baseURL: 'http://localhost:5173' },
})
```

**Priority flows:**

| Flow | Reason |
|------|--------|
| Register → Login → Logout | Auth baseline |
| Create list → Add item via URL (OG scrape populates) | Core item flow, verifies scraper |
| Send friend request → Accept → view friend's list | Social graph baseline |
| Friend claims item → owner's view shows no claim info | **Critical** — spoiler prevention |
| Owner invites user to private list → invitee accepts | Private list access flow |
| Responsive layout checks at all three viewports | Validates responsive design requirement |

**Multi-context spoiler-prevention pattern:**

```typescript
// e2e/spoiler-prevention.spec.ts
const ownerCtx  = await browser.newContext()
const friendCtx = await browser.newContext()

const ownerPage  = await ownerCtx.newPage()
const friendPage = await friendCtx.newPage()

// Log each context in as a different user, then:
// 1. Friend claims an item via friendPage
// 2. Assert ownerPage does NOT contain any claim indicator
await expect(ownerPage.locator('[data-testid="claim-badge"]')).not.toBeVisible()
```
