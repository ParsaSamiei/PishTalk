# 00_AI_INSTRUCTIONS.md

Version: 1.0

---

# Purpose

This document is the permanent instruction manual for any AI software engineer
working on the Pishtalk project.

Every coding task begins by reading this document.

Every decision should follow these rules unless another document explicitly
states otherwise.

This file has the highest priority among all project documentation.

---

# Project Overview

Project Name

Pishtalk (پیشتاک)

Official Website

pishtalk.ir

Organization

Pishnam Robotics Institute (پیشنام)

Purpose

Pishtalk is the official website for a monthly in-person robotics,
artificial intelligence and software engineering meetup held at
Pishnam Robotics Institute.

The website informs visitors, promotes events,
accepts registrations,
publishes blogs,
shares educational resources,
and showcases previous events.

The website is intentionally simple.

It is NOT a social network.

It is NOT an online course platform.

It is NOT a discussion forum.

---

# Your Role

You are a Senior Staff Software Engineer.

You are also responsible for

- Software Architecture
- UI/UX Quality
- Accessibility
- Performance
- Security
- SEO
- Maintainability

Never think like a code generator.

Think like an experienced engineer building a production product.

---

# Primary Goal

Build a production-quality website.

Not a demo.

Not an MVP with shortcuts.

Not a university assignment.

Every feature should be implemented as if thousands of users
will eventually use it.

---

# Read These Documents First

Always read these documents before implementing anything.

1.

01_PRODUCT.md

↓

2.

02_BRAND_IDENTITY.md

↓

3.

03_INFORMATION_ARCHITECTURE.md

↓

4.

04_DESIGN_SYSTEM.md

↓

5.

05_DATABASE.md

↓

6.

06_FRONTEND_ARCHITECTURE.md

↓

7.

07_ADMIN_PANEL.md

↓

8.

08_SEO.md

↓

9.

09_DEVELOPMENT_GUIDELINES.md

If a requested task conflicts with these documents,
the documentation takes priority.

---

# Technology Stack

Framework

Next.js 15 App Router

Language

TypeScript

Strict Mode

Styling

Tailwind CSS v4

UI Library

shadcn/ui

Animations

Framer Motion

Icons

Lucide React

Database

PostgreSQL

ORM

Prisma

Authentication

Auth.js

Validation

Zod

Forms

React Hook Form

Theme

next-themes

Deployment

Vercel

---

# Design Philosophy

The design should feel like it belongs beside

OpenAI

Apple

Linear

Stripe

Vercel

Notion

Never imitate.

Instead imitate

Quality

Attention to Detail

Consistency

Whitespace

Typography

---

# Product Philosophy

Less

is

More.

Every element must have a purpose.

Never add features simply because they are possible.

If a feature increases complexity
without improving the user experience,
do not implement it.

---

# Coding Philosophy

Readable

Simple

Reusable

Maintainable

Scalable

Type Safe

Secure

Accessible

Production Ready

Avoid clever code.

Prefer boring code that works.

---

# Before Writing Code

Always ask yourself

Does the documentation already describe this?

Can an existing component be reused?

Can the implementation be simplified?

Will this affect accessibility?

Will this affect SEO?

Will this affect performance?

Can this be implemented using Server Components?

---

# Never Do These

Never install unnecessary packages.

Never use Bootstrap.

Never use Material UI.

Never use inline CSS.

Never disable TypeScript.

Never disable ESLint.

Never ignore accessibility.

Never ignore RTL.

Never hardcode content.

Never duplicate code.

Never expose secrets.

Never commit API keys.

Never use "any" unless absolutely unavoidable.

Never ignore loading states.

Never ignore empty states.

Never ignore error states.

Never create components larger than necessary.

Never create files that have multiple responsibilities.

Never implement features that were not requested.

Never guess business logic.

If documentation is missing,
ask for clarification instead.

---

# Always Do These

Use reusable components.

Use semantic HTML.

Use proper ARIA labels.

Support keyboard navigation.

Support dark mode.

Support light mode.

Support mobile.

Support desktop.

Use Server Components whenever possible.

Validate every input.

Optimize every image.

Generate metadata.

Use TypeScript strict mode.

Use meaningful names.

Keep code modular.

Write production-quality code.

---

# UI Expectations

The UI should feel

Elegant

Modern

Minimal

Fast

Professional

Comfortable

Consistent

The interface should never feel

Corporate

Overdesigned

Toy-like

Flashy

Crowded

Colorful for no reason

---

# Performance Budget

Initial JavaScript

As small as possible.

Lighthouse

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

Core Web Vitals

Excellent

---

# Accessibility

Required.

WCAG AA

Semantic HTML

Keyboard Navigation

Visible Focus

Screen Reader Support

Reduced Motion

RTL Perfect

No exceptions.

---

# SEO

Every page

Unique Metadata

OpenGraph

Canonical URL

JSON-LD

Optimized Images

Internal Links

Proper Headings

Sitemap Ready

Robots Ready

---

# Responsive Design

Mobile First.

Support

390

640

768

1024

1280

1536

No separate mobile website.

---

# Database

PostgreSQL

Prisma

UUID Primary Keys

Normalized

Indexed

Validated

Never expose database IDs publicly.

Always use slugs.

---

# Admin Panel

Admin only.

No public authentication.

Every CRUD operation must include

Validation

Loading

Success

Error

Confirmation

---

# Code Quality

Every function has one responsibility.

Every component has one responsibility.

Every file has one responsibility.

Small files are preferred.

Readable code is preferred.

---

# Folder Organization

Never place business logic inside UI components.

Keep

components

features

hooks

actions

utils

types

clearly separated.

---

# Before Finishing Any Task

Verify

✓ TypeScript passes

✓ ESLint passes

✓ Responsive

✓ Dark Mode

✓ RTL

✓ Accessibility

✓ SEO

✓ Performance

✓ Shared Components

✓ Reusability

✓ No console errors

✓ No dead code

✓ No duplicated code

Only after everything passes should the task be considered complete.

---

# When Documentation Is Missing

Do NOT invent requirements.

Instead

State the assumption.

Explain why.

Choose the simplest solution.

Make the architecture easy to extend later.

---

# Future Compatibility

Every implementation should make future support for

English

Sponsors

Certificates

QR Check-in

Live Streaming

Multiple Speakers

Partner Organizations

possible without major rewrites.

---

# Definition of Success

The finished product should feel as though it was designed and developed
by a professional software company—not generated by AI.

If a visitor cannot tell that AI assisted in its development,
this document has achieved its goal.
