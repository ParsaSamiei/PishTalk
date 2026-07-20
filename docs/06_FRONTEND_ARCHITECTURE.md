# 06_FRONTEND_ARCHITECTURE.md

Version: 1.0

---

# Purpose

This document defines the frontend architecture of Pishtalk.

The objective is to build a codebase that is:

- Maintainable
- Scalable
- Modular
- Reusable
- Type Safe
- Production Ready

The architecture must follow modern Next.js best practices.

---

# Technology Stack

Framework

Next.js 15

Rendering

App Router

Language

TypeScript (Strict Mode)

Styling

Tailwind CSS v4

UI Components

shadcn/ui

Icons

Lucide React

Animations

Framer Motion

Forms

React Hook Form

Validation

Zod

Theme

next-themes

Carousel

Embla Carousel

ORM

Prisma

Database

PostgreSQL

Authentication

Auth.js

Image Optimization

Next/Image

---

# Project Structure

app/

components/

features/

actions/

hooks/

lib/

services/

providers/

types/

utils/

styles/

public/

prisma/

docs/

---

# App Structure

app/

(layout.tsx)

(page.tsx)

about/

blog/

contact/

events/

faq/

gallery/

resources/

rules/

admin/

api/

globals.css

loading.tsx

not-found.tsx

error.tsx

Every route should remain independent.

---

# Features Folder

Every business feature lives here.

Example

features/

events/

blogs/

gallery/

resources/

registration/

faq/

contact/

admin/

Each feature contains

components/

hooks/

actions/

types/

utils/

---

# Components Folder

Global reusable components only.

components/

ui/

layout/

shared/

forms/

animations/

icons/

navigation/

feedback/

cards/

sections/

dialogs/

---

# UI Components

Button

Input

Textarea

Select

Card

Badge

Alert

Accordion

Dialog

Tooltip

Dropdown

Avatar

Tabs

Table

Pagination

Breadcrumb

Skeleton

Separator

Toast

These should wrap shadcn/ui components when customization is required.

---

# Shared Components

Navbar

Footer

Container

Section

PageHeader

SectionTitle

ThemeToggle

Countdown

EventCard

BlogCard

GalleryCard

ResourceCard

FAQAccordion

Timeline

ContactForm

RegistrationForm

SocialLinks

Logo

---

# Layout

Use nested layouts.

Public Layout

Navbar

↓

Content

↓

Footer

Admin Layout

Sidebar

↓

Top Bar

↓

Content

---

# Server Components

Use Server Components by default.

Client Components should only be used when necessary.

Examples

Forms

Theme Toggle

Carousel

Countdown

Animations

Search

Everything else should remain server rendered.

---

# Data Fetching

Always prefer

Server Components

↓

Server Actions

↓

Route Handlers

Avoid unnecessary client-side fetching.

---

# Server Actions

Server Actions should handle

Create Event

Edit Event

Delete Event

Register Event

Create Blog

Update Settings

Upload Resources

Validation happens before database operations.

---

# Route Handlers

Used for

Authentication

File Uploads

Webhooks

Future APIs

Avoid building unnecessary REST endpoints.

---

# State Management

Default

React State

Shared State

Context

Avoid Redux.

Only introduce a global state library if the project genuinely requires it in the future.

---

# Forms

Every form uses

React Hook Form

-

Zod

Validation happens

Client

↓

Server

↓

Database

Never trust client validation alone.

---

# File Uploads

Images

Videos

PDF

PowerPoint

ZIP

Uploads should support drag & drop.

Preview before upload.

Progress indicator.

---

# Error Handling

Every page

error.tsx

Every async action

try/catch

Friendly messages.

No raw stack traces.

---

# Loading States

Every route

loading.tsx

Every card

Skeleton

Every form

Loading Button

Never freeze the UI.

---

# Empty States

Every collection page

Blogs

Events

Gallery

Resources

FAQ

Must have meaningful empty states.

---

# Naming Convention

Components

PascalCase

Button.tsx

EventCard.tsx

Hooks

camelCase

useCountdown.ts

useTheme.ts

Actions

camelCase

createEvent.ts

registerUser.ts

Types

PascalCase

Event.ts

Blog.ts

Utilities

camelCase

formatDate.ts

slugify.ts

---

# Import Rules

Use aliases.

@

Example

@/components

@/lib

@/features

Avoid long relative imports.

---

# TypeScript Rules

Strict Mode

Enabled

Never use

any

Prefer

unknown

Generics

Discriminated Unions

Readonly

Enums only when appropriate.

---

# Styling Rules

Tailwind only.

No Bootstrap.

No Material UI.

No inline styles.

No CSS Modules unless absolutely necessary.

Global styles only for typography, variables and resets.

---

# Responsive Strategy

Mobile First.

Every component must support

Mobile

Tablet

Laptop

Desktop

Ultra-wide

without redesign.

---

# Accessibility

Keyboard Navigation

Visible Focus

ARIA Labels

Semantic HTML

Screen Reader Friendly

Reduced Motion

RTL Perfect

---

# Images

Always use

next/image

Responsive

Lazy Loaded

Blur Placeholder

Optimized

---

# Fonts

Google Fonts

Vazirmatn

Loaded once.

Never import fonts inside components.

---

# Icons

Lucide React only.

No mixed icon libraries.

---

# Theme

Light

Dark

System

Persist preference.

---

# SEO

Every page exports metadata.

Use

generateMetadata()

Dynamic routes generate their own metadata.

Canonical URLs

Open Graph

Twitter Cards

JSON-LD

---

# Performance

Code Splitting

Dynamic Imports

Server Components

Image Optimization

Minimal JavaScript

Streaming

Caching

Avoid unnecessary rerenders.

---

# Security

Escape user input.

Validate everything.

Never expose secrets.

Environment variables only.

Server-only utilities stay in server code.

---

# Folder Example

features/

events/

components/

EventCard.tsx

EventTimeline.tsx

EventHero.tsx

hooks/

useCountdown.ts

actions/

createEvent.ts

updateEvent.ts

deleteEvent.ts

types/

event.ts

utils/

formatEventDate.ts

---

# Code Quality

Small components.

Single Responsibility Principle.

Reusable before duplicated.

Readable over clever.

Meaningful names.

No magic numbers.

Comments explain why, not what.

---

# Git Strategy

main

Always deployable.

develop

Integration branch.

feature/navbar

feature/events

feature/blog

feature/admin

Every feature merged through Pull Request.

---

# Testing (Future)

Vitest

React Testing Library

Playwright

Unit

Integration

End-to-End

Not required for V1 but architecture should support them.

---

# Definition of Done

Frontend work is complete only if

✓ TypeScript passes

✓ ESLint passes

✓ No console errors

✓ Mobile responsive

✓ Dark mode works

✓ RTL works

✓ Lighthouse 95+

✓ Accessible

✓ Reusable components

✓ Uses Server Components where possible

✓ Uses shared UI library

✓ Production ready

No page is considered complete until every item above is satisfied.
