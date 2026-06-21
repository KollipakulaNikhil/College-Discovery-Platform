# College Compass 🎓

A production-grade College Discovery Platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Screenshots

> *(Add screenshots of the running application here)*

---

## Features

- **College Listing & Search** — Search by name/city, filter by location/fees/rating, sort, and paginate
- **College Detail Pages** — Overview, Courses, Placement Stats, and Student Reviews
- **Compare Colleges** — Side-by-side comparison of 2–3 colleges
- **Authentication** — Register/Login with JWT sessions, bcrypt-hashed passwords
- **Saved Colleges** — Save and manage favourite colleges (protected route)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | TailwindCSS, Shadcn UI |
| Data Fetching | TanStack Query v5 |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon), Prisma ORM |
| Auth | NextAuth v4, JWT Sessions |
| Deployment | Vercel + Neon |

---

## Architecture

```
src/
├── app/                     # Next.js App Router pages & API routes
│   ├── (auth)/              # Login & Register pages
│   ├── api/                 # REST API routes
│   ├── college/[id]/        # College detail page
│   ├── compare/             # Compare colleges
│   └── saved/               # Saved colleges (protected)
├── components/              # React components
│   ├── ui/                  # Shadcn UI primitives
│   └── ...                  # Feature components
├── hooks/                   # TanStack Query hooks
├── lib/
│   ├── repository/          # Database access layer
│   ├── services/            # Business logic layer
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma singleton
│   └── utils.ts             # Utility functions
├── types/                   # TypeScript interfaces
└── validators/              # Zod schemas
```

**Design Patterns:**
- **Repository Pattern** — `CollegeRepository`, `SavedCollegeRepository`
- **Service Layer** — `CollegeService`, `SavedService`
- **Server/Client Component Split** — SSR for initial render, TanStack Query for interactivity
- **URL-driven state** — Search/filter state stored in URL params for shareable links

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A PostgreSQL database (or Neon account)

### 1. Clone & Install

```bash
git clone <repo-url>
cd college-compass
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with 100 Indian colleges
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `https://your-app.vercel.app` |

---

## Prisma Commands

```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema (no migration file)
npm run db:migrate     # Create migration file
npm run db:seed        # Seed 100 colleges
npm run db:studio      # Open Prisma Studio
```

---

## API Reference

### Colleges
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/colleges` | List colleges with filters |
| `GET` | `/api/colleges/:id` | Get college by ID |
| `GET` | `/api/compare?ids=id1,id2,id3` | Compare 2–3 colleges |

**Query params for `/api/colleges`:**
- `search` — Search by name/location
- `location` — Filter by city
- `minFees`, `maxFees` — Fee range (₹/year)
- `rating` — Minimum rating (0–5)
- `sort` — `rating_desc` | `rating_asc` | `fees_asc` | `fees_desc` | `name_asc`
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 50)

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler |

### Saved Colleges
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/saved` | Get saved colleges |
| `POST` | `/api/saved` | Save a college |
| `DELETE` | `/api/saved?collegeId=:id` | Remove saved college |

---

## Deployment on Vercel + Neon

### 1. Set up Neon PostgreSQL
1. Go to [neon.tech](https://neon.tech) and create a free project
2. Copy the connection string from the dashboard

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### 3. Set Environment Variables in Vercel
Go to your project settings → Environment Variables and add:
- `DATABASE_URL` — Your Neon connection string
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — Your Vercel deployment URL

### 4. Run Migrations
After deployment, run from your local machine:
```bash
DATABASE_URL="<neon-url>" npx prisma migrate deploy
DATABASE_URL="<neon-url>" npm run db:seed
```

---

## Demo Credentials

After seeding, you can login with:
- **Email:** `demo@collegecompass.in`
- **Password:** `Demo@1234`

---

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- SQL injection prevented via **Prisma ORM parameterized queries**
- **JWT sessions** with configurable expiry (30 days)
- **Input validation** on all API endpoints via **Zod**
- **Protected routes** enforced by NextAuth middleware
- **CSRF protection** via NextAuth built-in mechanisms
