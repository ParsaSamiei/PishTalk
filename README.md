# پیشتاک (PishTalk)

A modern, full-featured website and admin panel for **Pishtalk** — the monthly robotics, AI, and software engineering meetup organized by Pishnam Robotics Academy.

PishTalk is a production-ready Next.js application combining a public marketing site with a powerful admin dashboard for event management, blog publishing, registrations, galleries, and more.

## 🎯 Features

### Public Site

- **Event Management**: Browse upcoming and past meetups with detailed information
- **Event Registration**: Simple registration form with optional email confirmation
- **Blog**: Articles about robotics, AI, and software engineering
- **Gallery**: Photo galleries for past events
- **Resources**: Curated learning materials, presentations, and research papers
- **FAQ**: Frequently asked questions and community guidelines
- **Contact Form**: Direct communication channel with organizers
- **Responsive Design**: Mobile-first UI with dark mode support
- **SEO Optimized**: Complete metadata, JSON-LD structured data, sitemaps, and robots.txt

### Admin Dashboard

- **Authentication**: Secure admin-only access with role-based permissions
- **Event Management**: Create, edit, publish, archive events with timeline builder for detailed schedules
- **Blog Management**: Rich-text editor for blog posts with real-time preview
- **Registration Management**: View registrations, filter by event, export to CSV and Excel
- **Gallery Management**: Organize event photos with image URLs
- **Resources Management**: Add and organize learning resources by type
- **FAQ Management**: Manage community questions and guidelines
- **Site Settings**: Configure global site metadata and branding
- **Admin Profile**: Manage admin account and password changes

## 🏗️ Tech Stack

| Layer                 | Technology                                                   |
| --------------------- | ------------------------------------------------------------ |
| **Frontend**          | React 19, Next.js 15 (App Router), TypeScript (strict mode)  |
| **Styling**           | Tailwind CSS v4 with design tokens, class-variance-authority |
| **Database**          | Prisma ORM + PostgreSQL                                      |
| **Authentication**    | Auth.js v5 (Credentials provider, admin-only)                |
| **Forms**             | React Hook Form + Zod (schema validation)                    |
| **UI Components**     | Radix UI primitives with custom styling                      |
| **Rich Text Editing** | Tiptap (blog editor with sanitization)                       |
| **Data Export**       | ExcelJS, XLSX for registration exports                       |
| **Animations**        | Framer Motion                                                |
| **Icons**             | Lucide React                                                 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ (local or remote via Neon, Supabase, etc.)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ParsaSamiei/PishTalk.git
   cd PishTalk
   ```

2. **Install dependencies**

   ```bash
   npm install
   # Prisma client is generated automatically via postinstall hook
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Set up your .env file**

   ```env
   # PostgreSQL connection string
   # Examples:
   #   Neon: postgresql://user:password@host/database?sslmode=require
   #   Supabase: postgresql://user:password@db.xxx.supabase.co:5432/postgres
   #   Local: postgresql://user:password@localhost:5432/pishtalk
   DATABASE_URL="postgresql://..."

   # Generate with: npx auth secret
   AUTH_SECRET="your-secret-key-here"

   # Public site URL (used for SEO, sitemaps, etc.)
   NEXT_PUBLIC_SITE_URL="https://pishtalk.ir"
   ```

5. **Initialize the database**

   ```bash
   # Create tables
   npx prisma migrate deploy

   # Or if starting fresh:
   npx prisma db push

   # Seed with sample data (creates a default admin user)
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the application**
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login
   - Default credentials: printed by `db:seed` (change password immediately in /admin/profile)

## 📚 Project Structure

```
PishTalk/
├── app/                           # Next.js app router
│   ├── (marketing)/               # Public site routes (Navbar + Footer layout)
│   │   ├── page.tsx              # Homepage
│   │   ├── events/               # Event listing and detail pages
│   │   ├── blog/                 # Blog listing and article pages
│   │   ├── gallery/              # Event galleries
│   │   ├── resources/            # Learning resources
│   │   ├── faq/                  # FAQ section
│   │   └── contact/              # Contact form
│   │
│   ├── admin/                     # Admin dashboard
│   │   ├── login/                # Public login page
│   │   ├── (dashboard)/          # Protected routes with sidebar + topbar
│   │   │   ├── events/           # Event management CRUD
│   │   │   ├── blog/             # Blog post management
│   │   │   ├── registrations/    # Registration list and exports
│   │   │   ├── gallery/          # Gallery image management
│   │   │   ├── resources/        # Resource management
│   │   │   ├── faq/              # FAQ management
│   │   │   ├── profile/          # Admin profile and password
│   │   │   └── settings/         # Site settings
│   │   │
│   │   └── auth/                 # Auth.js route handler
│   │
│   ├── api/                       # API routes (Auth.js, etc.)
│   ├── layout.tsx                 # Root layout with providers
│   ├── sitemap.ts                 # Dynamic sitemap generation
│   └── robots.ts                  # robots.txt generation
│
├── components/
│   ├── ui/                        # Reusable UI primitives
│   │   ├── button/               # Button component
│   │   ├── card/                 # Card layout
│   │   ├── input/                # Form inputs
│   │   ├── form/                 # Form wrapper
│   │   ├── dialog/               # Modal dialogs
│   │   ├── accordion/            # Accordions
│   │   ├── select/               # Select dropdowns
│   │   ├── tabs/                 # Tab components
│   │   ├── alert-dialog/         # Confirmation dialogs
│   │   ├── toast/                # Toast notifications
│   │   └── tooltip/              # Tooltips
│   │
│   ├── layout/                    # Layout components
│   │   ├── Navbar.tsx            # Public navigation
│   │   ├── Footer.tsx            # Public footer
│   │   ├── AdminSidebar.tsx       # Admin sidebar
│   │   ├── AdminTopbar.tsx        # Admin top bar
│   │   └── Container.tsx          # Content container
│   │
│   ├── navigation/                # Navigation components
│   │   ├── NavLinks.tsx           # Header navigation links
│   │   └── MobileNav.tsx          # Mobile navigation menu
│   │
│   ├── cards/                     # Card components for listings
│   │   ├── EventCard.tsx          # Event preview card
│   │   ├── BlogCard.tsx           # Blog post card
│   │   ├── ResourceCard.tsx       # Resource card
│   │   └── GalleryCard.tsx        # Gallery preview card
│   │
│   ├── sections/                  # Homepage sections
│   │   ├── HeroSection.tsx        # Hero banner
│   │   ├── EventsSection.tsx      # Featured events
│   │   ├── StatsSection.tsx       # Statistics
│   │   ├── FeaturesSection.tsx    # Feature highlights
│   │   └── CTASection.tsx         # Call-to-action
│   │
│   └── shared/                    # Cross-feature components
│       ├── EmptyState.tsx         # Empty state placeholder
│       ├── Countdown.tsx          # Event countdown timer
│       ├── Timeline.tsx           # Event timeline display
│       ├── Breadcrumbs.tsx        # Navigation breadcrumbs
│       ├── ConfirmDialog.tsx      # Confirmation modal
│       └── Pagination.tsx         # Table pagination
│
├── features/                      # Feature modules (each has actions/ types/ components/)
│   ├── events/                    # Event management feature
│   ├── blog/                      # Blog feature
│   ├── gallery/                   # Gallery feature
│   ├── resources/                 # Resources feature
│   ├── registration/              # Registration feature
│   ├── faq/                       # FAQ feature
│   ├── contact/                   # Contact form feature
│   └── admin/                     # Admin-specific features
│
├── lib/                           # Utilities and configurations
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # Auth.js configuration
│   ├── site-settings.ts           # Global site settings
│   ├── navigation.ts              # Navigation config
│   └── utils.ts                   # Helper functions
│
├── middleware.ts                  # Next.js middleware for auth protection
├── types/
│   ├── next-auth.d.ts            # Auth.js type augmentation
│   └── rule.ts                    # Custom types
│
├── providers/                     # React context providers
│   ├── ThemeProvider.tsx          # Dark mode provider
│   └── ToastProvider.tsx          # Toast notifications provider
│
├── prisma/
│   ├── schema.prisma              # Database schema (source of truth)
│   ├── migrations/                # Database migration history
│   └── seed.ts                    # Seed script for development data
│
├── public/                        # Static assets
│   ├── images/                    # Optimized images
│   ├── icons/                     # Icon assets
│   └── ...
│
├── docs/                          # Comprehensive documentation
│   ├── 00_AI_INSTRUCTIONS.md      # Instructions for AI assistants
│   ├── 01_PRODUCT.md              # Product specification
│   ├── 02_BRAND_IDENTITY.md       # Brand guidelines
│   ├── 03_Information_Architecture.md # Site structure
│   ├── 04_DESIGN_SYSTEM.md        # Design tokens and components
│   ├── 05_DATABASE.md             # Database schema reference
│   ├── 06_FRONTEND_ARCHITECTURE.md # Frontend patterns
│   ├── 07_ADMIN_PANEL.md          # Admin dashboard spec
│   ├── 08_SEO.md                  # SEO strategy
│   └── 09_DEVELOPMENT_GUIDELINES.md # Coding standards
│
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.mjs             # PostCSS configuration
├── eslint.config.mjs              # ESLint configuration
└── .env.example                   # Environment variables template
```

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Linting
npm run lint             # Run ESLint

# Database
npm run db:push          # Push schema to database (no migrations)
npm run db:migrate       # Create and run migration interactively
npm run db:generate      # Generate Prisma client types
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio GUI (http://localhost:5555)
```

## 🗄️ Database Schema

The database includes the following models:

- **Admin**: User accounts with role-based access control
- **Event**: Meetup details with status (draft/published/archived/cancelled)
- **EventTimeline**: Detailed event schedule with timestamps
- **Registration**: Event registrations with attendance tracking
- **BlogPost**: Published articles with Tiptap rich-text content
- **Gallery**: Event photo galleries
- **GalleryMedia**: Images/videos in galleries
- **Resource**: Learning materials with categorization
- **FAQ**: Frequently asked questions
- **Rule**: Community guidelines
- **ContactMessage**: Submissions from contact form
- **SiteSettings**: Global configuration

See `prisma/schema.prisma` for the complete schema and `docs/05_DATABASE.md` for detailed specifications.

## 🔐 Authentication & Authorization

- **Admin-Only Access**: No public signup; admins are created by seeding or direct database manipulation
- **Auth.js v5**: Credentials provider (username/password)
- **Role-Based Access Control**: ADMIN, SUPER_ADMIN, EDITOR roles
- **Middleware Protection**: `/admin/(dashboard)` routes require authentication
- **Session Management**: Secure session tokens with configurable expiration

Default admin credentials (created by seed script):

- Email: admin@example.com
- Password: printed by `npm run db:seed`

**⚠️ Change the default password immediately in the admin profile.**

## 🎨 Design System

All colors, spacing, radii, and typography are CSS variables defined in `app/globals.css`, generated from:

- `docs/02_BRAND_IDENTITY.md` (brand colors, typography, tone)
- `docs/04_DESIGN_SYSTEM.md` (design tokens, component specs)

**No arbitrary hex colors or px values in components.** Extend design tokens instead to keep light/dark mode and future rebrands centralized.

### Theming

- Dark mode support via `next-themes`
- Automatic theme persistence
- CSS variable-based token system
- Framer Motion for smooth transitions

## 📱 Features in Detail

### Event Management

- Full CRUD for events
- Multiple statuses: Draft, Published, Archived, Cancelled
- Detailed event timeline with speaker/session information
- Event sharing on social media
- Automatic event listing (published only)
- Past events archive

### Blog System

- Rich-text editor (Tiptap) for blog content
- HTML sanitization with `isomorphic-dompurify`
- Markdown-friendly authoring
- Author and publish date tracking
- Blog search and filtering in admin panel

### Registration System

- Simple event registration form
- Optional email confirmation
- CSV and Excel export capabilities
- Attendance tracking
- Registration status (Registered, Cancelled, Attended)
- Pagination (25 per page)

### Gallery Management

- Image and video support
- URL-based image/video upload
- Per-event galleries
- Organized by event

### Resources Management

- Categorized by type (PDF, Presentation, GitHub, Video, etc.)
- Direct links to external resources
- Searchable resource library

### Admin Tools

- Table pagination and searching
- URL-driven filtering
- Bulk export capabilities
- Real-time form validation
- Confirmation dialogs for destructive actions

## 🔧 Configuration

### Environment Variables

All configuration is via `.env`:

```env
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key

# Optional
NEXT_PUBLIC_SITE_URL=https://pishtalk.ir
```

### Site Settings

Global branding and metadata configured in `/admin/settings`:

- Site name, description
- Social media links
- Contact information
- Google Analytics tracking (if needed)

## 🧪 Development Guidelines

- **TypeScript**: Strict mode enforced for type safety
- **Code Style**: ESLint configured; run `npm run lint` before committing
- **Forms**: Always use React Hook Form + Zod for validation
- **Database**: Direct Prisma client in server actions; no raw SQL
- **Components**: Modular, reusable, documented with JSDoc
- **Styling**: Tailwind CSS with design tokens; no inline styles
- **Testing**: Unit tests recommended; integration tests via `npm run build`

See `docs/09_DEVELOPMENT_GUIDELINES.md` for comprehensive coding standards.

## 📖 Documentation

The `docs/` folder contains comprehensive specifications:

| Document                         | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| `00_AI_INSTRUCTIONS.md`          | Instructions for AI assistants working on the project |
| `01_PRODUCT.md`                  | Product specification and requirements                |
| `02_BRAND_IDENTITY.md`           | Brand guidelines, colors, typography                  |
| `03_Information_Architecture.md` | Site structure and information hierarchy              |
| `04_DESIGN_SYSTEM.md`            | Design tokens, components, patterns                   |
| `05_DATABASE.md`                 | Database schema and entity relationships              |
| `06_FRONTEND_ARCHITECTURE.md`    | Frontend patterns and best practices                  |
| `07_ADMIN_PANEL.md`              | Admin dashboard specification                         |
| `08_SEO.md`                      | SEO strategy and implementation                       |
| `09_DEVELOPMENT_GUIDELINES.md`   | Coding standards and conventions                      |

**Start here if picking up the project with an AI assistant**: Read `docs/00_AI_INSTRUCTIONS.md` first.

## 🚢 Deployment

### Prerequisites

- PostgreSQL database (Neon, Supabase, AWS RDS, etc.)
- Node.js hosting (Vercel, Railway, Heroku, etc.)

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables (DATABASE_URL, AUTH_SECRET)
4. Deploy automatically on push

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup

```bash
# On your hosting provider, set:
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Migration

```bash
# Run once after initial deployment
npx prisma migrate deploy
npm run db:seed  # Optional, only for initial data
```

## 🐛 Known Limitations & Future Work

### Current Limitations

1. **File Uploads**: Currently accepts image URLs only; no direct file storage pipeline (needs S3, Azure Blob, or similar)
2. **Email Notifications**: Contact form emails go to ContactMessage table; needs email provider integration
3. **Search/Filters**: Tables have search and pagination; full-text search not implemented
4. **Event Duplication**: No quick "duplicate event" feature in admin
5. **Analytics**: Google Analytics can be injected via site settings; no internal analytics

### Planned Features

- [ ] File upload pipeline for images/PDFs
- [ ] Email notifications for registrations and contact form
- [ ] Advanced search with filters
- [ ] Event duplication quick action
- [ ] Built-in analytics dashboard
- [ ] Automated email reminders
- [ ] Social media integration
- [ ] Multi-language support

## 🤝 Contributing

1. **Read the docs**: Start with `docs/00_AI_INSTRUCTIONS.md` and `docs/09_DEVELOPMENT_GUIDELINES.md`
2. **Follow code standards**: ESLint, TypeScript strict mode, design tokens
3. **Test locally**: Run `npm run dev` and test changes before committing
4. **Create feature branches**: `git checkout -b feature/feature-name`
5. **Commit with clear messages**: Follow conventional commit style
6. **Push and create PR**: Reference related issues

## 📝 License

This project is part of Pishnam Robotics Academy. All rights reserved.

## 👥 Support & Community

- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for feature requests
- **Contact**: Reach out via the contact form at http://pishtalk.ir/contact

---

**Questions?** Check `docs/` first, then open a GitHub issue or discussion.

**Last Updated**: July 2026  
**Maintained by**: Pishnam Robotics Academy  
**Status**: ✅ Production Ready
