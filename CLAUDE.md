# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Supply management dashboard for a B2B supply/invoicing business: companies → supplies → invoices → collections, with due/overdue tracking and reporting. Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Prisma 7 on PostgreSQL. Originally scaffolded with [v0](https://v0.app) and still linked to it — merges to `main` auto-deploy on Vercel, and v0 can push commits directly.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (TS errors are ignored — see next.config.mjs)
npm run start    # serve the production build
npm run lint     # eslint

npx prisma generate                 # REQUIRED after clone/schema change — see "Prisma client" below
npx prisma migrate dev --name <n>   # create + apply a migration in dev
npx prisma studio                   # browse the DB
```

There is no test setup in this repo.

## Environment

Requires `.env` with `DATABASE_URL` (PostgreSQL) and `AUTH_SECRET` (JWT signing key). Note: Prisma does **not** auto-load `.env` in v7 — the CLI reads it, but `lib/prisma.ts` currently falls back to a hard-coded connection string if `DATABASE_URL` is unset.

## Architecture

**Prisma client location.** The client is generated with the new `prisma-client` generator to `app/generated/prisma/` (gitignored), **not** the default `@prisma/client`. Always import the singleton from `lib/prisma.ts` (`import prisma from "@/lib/prisma"`), never construct `PrismaClient` directly. It uses the `PrismaPg` driver adapter (`@prisma/adapter-pg`) over a raw `pg` connection. Because the generated client is gitignored, `npx prisma generate` must run before the app type-checks or runs.

**Data model** (`prisma/schema.prisma`) is the domain source of truth. Core chain: `Company` → `Supply` (with `SupplyItem`s referencing `Product`/`Category`) → `Invoice` (1:1 with Supply) → `Collection` (payments) and `InvoiceAdjustment`. All money is `Decimal(12,2)`. Status is modeled as enums per entity (`InvoiceStatus`, `SupplyStatus`, `UserRole`, etc.). Tables are snake_cased via `@@map`.

**Auth** is custom JWT-in-cookie, no library beyond `jose`/`bcryptjs`:
- `lib/auth.ts` — `encrypt`/`decrypt` a `SessionPayload` (HS256, 7-day expiry) with `AUTH_SECRET`.
- `lib/session.ts` — read/write the httpOnly cookie named `supply-session`.
- `app/actions/auth.actions.ts` — `"use server"` `login`/`logout` actions (bcrypt compare, then `createSession`). Login is called directly from the client login form.
- `app/api/me/route.ts` + `hooks/useCurrentUser.ts` — client components fetch the current session from `/api/me`.

There is no middleware; routes are **not** currently gate-protected server-side. `app/page.tsx` just client-redirects to `/dashboard`.

**UI conventions.**
- Pages live in `app/<section>/page.tsx` and wrap content in `<DashboardLayout title=...>` (`components/dashboard-layout.tsx`), which composes `Sidebar` + `TopNav` + optional `BreadcrumbNav`. Nav items are hard-coded in `components/sidebar.tsx`.
- shadcn/ui with the `base-nova` style, built on `@base-ui/react` (plus some `@radix-ui` primitives); primitives in `components/ui/`, icons from `lucide-react`. Merge classes with `cn()` from `lib/utils.ts`.
- Charts (`components/charts/`) use `recharts`; dashboard widgets/tables/modals are grouped under `components/{widgets,tables}/` and `components/*-modals.tsx`. CRUD modals are built on the reusable `GenericAdd/Edit/View/DeleteModal` from `components/generic-modals.tsx`.
- **Most pages currently render hard-coded mock data** (e.g. the dashboard KPIs, tables). The DB layer exists but is wired up only for auth so far — when adding a feature, check whether the page is still on mock data before assuming it reads from Prisma.

Path alias `@/*` maps to the repo root (`tsconfig.json`).
