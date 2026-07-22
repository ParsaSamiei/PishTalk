# پیشتاک (Pishtalk)

Marketing site + CMS-backed admin panel for Pishtalk, the monthly robotics / AI /
software engineering meetup run by Pishnam Robotics Academy.

Built from the specs in [`docs/`](./docs): product, brand identity, information
architecture, design system, database schema, frontend architecture, admin panel,
SEO, and development guidelines. Read `docs/00_AI_INSTRUCTIONS.md` first if you're
picking this project back up with an AI assistant.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions), TypeScript (strict)
- **Tailwind CSS v4** — design tokens in `app/globals.css`, no arbitrary colors
- **Prisma + PostgreSQL** — schema in `prisma/schema.prisma`
- **Auth.js v5** (Credentials provider) — admin-only, no public signup
- **React Hook Form + Zod** for every form
- Hand-built UI primitives on **Radix UI + class-variance-authority** (shadcn's
  own CLI couldn't be run in the build sandbox, so components were authored
  directly in the same style — see "Known limitations" below)

## Getting started

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL and AUTH_SECRET
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000. Admin panel: http://localhost:3000/admin/login
(seeded credentials are printed by `db:seed` — change the password immediately).

### Environment variables

See `.env.example`:

- `DATABASE_URL` — PostgreSQL connection string (Neon, Supabase, or self-hosted)
- `AUTH_SECRET` — generate with `npx auth secret`
- `NEXT_PUBLIC_SITE_URL` — used in metadata, `sitemap.xml`, `robots.txt`

## Project structure

```
app/
  (marketing)/     Public site — has its own layout (Navbar + Footer)
  admin/
    login/         Public login page (no auth-gated layout)
    (dashboard)/   Auth-gated admin pages (sidebar + topbar layout)
  api/auth/        Auth.js route handler
  sitemap.ts, robots.ts
components/
  ui/              Hand-built primitives (Button, Card, Input, Accordion, ...)
  layout/          Navbar, Footer, Container, Section
  shared/          Cross-feature pieces (EmptyState, Countdown, Timeline, ...)
  navigation/      NavLinks, MobileNav
  cards/           EventCard, BlogCard, ResourceCard
  sections/        Homepage sections, one file per IA section
features/
  events/ blogs/ gallery/ resources/ registration/ faq/ contact/ admin/
    components/ actions/ types/    (server actions are the only DB write path)
lib/               prisma client, site-settings, auth, navigation config
prisma/
  schema.prisma    Source of truth for the data model
  seed.ts          Sample data for local development
```

## Audit history

This project was audited line-by-line against every doc in `docs/` after the
initial build. Fixed as a result: a real bug where a second published
upcoming event silently disappeared from `/events`; alphabetical resource
sorting; unlimited timeline items; native `window.confirm()` replaced with a
proper `ConfirmDialog`; transparent-over-Hero navbar; a real Toast
notification system; JSON-LD (Organization, Event, BlogPosting, FAQPage,
BreadcrumbList) and canonical URLs across the site; Breadcrumbs; `loading.tsx`
/ `error.tsx` at the marketing and admin route groups; a working Maintenance
Mode gate and Google Analytics injection; admin Profile page (name + password
change); CSV **and** Excel registration export; and per-event Gallery/Resources
sections plus a Share button on the event detail page. Still open, in rough
priority order: search/pagination/filters on admin tables, a rich-text editor
for blog content (currently raw HTML), event Duplicate/Archive quick actions,
and the file-upload pipeline (still URL-input only — needs a storage provider
decision).

Also since the last update: admin Events/Registrations/Blog/Resources lists
now have real search, filters, and URL-driven pagination (25/page, per
`docs/05_DATABASE.md`); blog content is authored with a Tiptap rich-text
editor instead of a raw HTML textarea, with output sanitized via
`isomorphic-dompurify` server-side in `blogActions.ts` before it's ever
persisted (not just trusting the editor).

## Known limitations / next steps

This was built in a network-restricted sandbox, so a few things need to happen
on a machine with normal internet access before it's fully verified:

1. **`npx prisma generate` was never run here** — `binaries.prisma.sh` wasn't
   reachable, so the Prisma Client types don't exist yet in this checkout.
   Run `npm install` (triggers `postinstall: prisma generate`) locally first.
2. **`next build` was not run end-to-end** for the same reason (font fetch +
   Prisma). Please run `npm run build` locally and fix anything the compiler
   flags — the code was written carefully against the Prisma schema and
   TypeScript strict mode, but this is not a substitute for a real build.
3. **shadcn/ui CLI could not reach its registry**, so `components/ui/*` were
   hand-authored on Radix + CVA in the same spirit. If you'd prefer the
   official shadcn components, `npx shadcn@latest add <component>` should work
   fine outside this sandbox and can replace these files directly.
4. **Admin panel is fully wired up**: auth, layout, and full create/edit/delete
   screens for Events (with timeline builder), Blog, FAQ, Rules, Resources,
   Gallery (add/remove image by URL), Registrations (list + CSV export), and
   Site Settings. There's no file-upload pipeline yet — images go in by URL —
   and the blog editor is a raw HTML textarea rather than a rich-text editor
   (see point 6).
5. **Contact form storage**: `docs/05_DATABASE.md` doesn't define a table for
   contact messages, so a minimal `ContactMessage` model was added — documented
   inline in `prisma/schema.prisma` and `sendContactMessage.ts`. Replace with an
   email provider integration when one is chosen.
6. **Blog/contact rich content** is rendered as HTML (`dangerouslySetInnerHTML`)
   assuming a rich-text editor in the admin panel. Sanitize on write (e.g. with
   `isomorphic-dompurify`) once that editor exists.

## Design system

All colors, radii, and spacing are CSS variables in `app/globals.css`, generated
from `docs/02_BRAND_IDENTITY.md` and `docs/04_DESIGN_SYSTEM.md`. Don't
introduce one-off hex colors or px values in components — extend the tokens
instead so light/dark mode and future rebrands stay centralized.
