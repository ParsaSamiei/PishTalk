# 09_DEVELOPMENT_GUIDELINES.md

Version: 1.0

---

# Purpose

This document defines the engineering standards for the Pishtalk project.

Every piece of code written for Pishtalk must follow these guidelines.

Consistency is considered more important than personal preference.

The objective is to create a codebase that remains maintainable for many years.

---

# Engineering Philosophy

The project should feel like it was written by one senior engineer.

Not multiple developers with different coding styles.

Code should prioritize

- Readability
- Simplicity
- Maintainability
- Predictability
- Performance

Never write clever code when simple code solves the problem.

---

# General Rules

Always use TypeScript.

Always enable strict mode.

Never ignore TypeScript errors.

Never disable ESLint rules.

Never leave TODO comments in production code.

Never leave commented-out code.

Every file should have a single responsibility.

---

# Naming

Variables

camelCase

Functions

camelCase

Components

PascalCase

Types

PascalCase

Interfaces

PascalCase

Enums

PascalCase

Constants

UPPER_SNAKE_CASE

Folders

kebab-case

Files

PascalCase for React Components

camelCase for utilities

---

# Components

A component should do one thing.

If a component exceeds approximately 250 lines,
consider splitting it.

Never create massive page components.

---

# Props

Always define prop types.

Never use

any

Prefer

Readonly<Props>

---

# Hooks

Every hook begins with

use

Example

useCountdown

useTheme

useRegistration

Hooks should never contain UI.

Hooks should contain logic only.

---

# Utilities

Utilities must be pure functions.

Never mutate inputs.

Always return new values.

Example

formatDate()

slugify()

formatPhone()

---

# Types

Store shared types inside

/types

Avoid duplicate types.

Never redefine an existing type.

---

# Comments

Comments explain

WHY

Never

WHAT

Bad

// increment i

Good

// API requires a one-based index

---

# Functions

Maximum

40 lines

If longer

Split.

Functions should have descriptive names.

Avoid generic names like

handleData()

process()

run()

---

# Async

Always use

async/await

Never chain

.then()

unless absolutely necessary.

---

# Error Handling

Every async function

try/catch

Never ignore errors.

Never expose internal error messages.

Return user-friendly messages.

Log technical details separately.

---

# Logging

Development

console.log allowed

Production

No console.log

Use proper logging if needed.

---

# Environment Variables

Use

.env.local

Never commit secrets.

Never expose server secrets to the client.

Use NEXT_PUBLIC only for safe variables.

---

# Styling

Tailwind CSS only.

No inline styles.

No CSS-in-JS.

Avoid arbitrary values.

Use design tokens.

---

# Components

Prefer composition over inheritance.

Never duplicate UI.

Create reusable primitives.

---

# State

Local state

React

Shared state

Context

Server state

Server Components

Avoid unnecessary global state.

---

# Data Fetching

Prefer

Server Components

↓

Server Actions

↓

Client Fetching

Client fetching only when interactivity requires it.

---

# Validation

Every input validated

Client

Server

Database

Validation never relies on the frontend alone.

---

# Forms

React Hook Form

-

Zod

Error messages

Persian

Validation

Instant

Accessible

---

# Accessibility

Every button

Keyboard accessible

Every input

Label

Every image

Alt text

Every dialog

Focus trap

Every icon button

ARIA label

---

# RTL

Everything supports

RTL

Perfectly.

Never assume LTR.

Icons should mirror where appropriate.

Spacing should use logical properties.

---

# Performance

Avoid unnecessary renders.

Memoize only when profiling proves benefit.

Lazy load heavy components.

Optimize images.

Keep bundle size small.

---

# Imports

Use absolute imports.

Example

@/components

Never use

../../../

---

# Dependency Rules

Before installing a package ask

Does Next.js already solve this?

Can this be implemented simply?

Is the package maintained?

Does it increase bundle size significantly?

Avoid dependency bloat.

---

# Git

One feature

One branch

One pull request

Small commits

Meaningful messages

Example

feat(events): add event timeline component

fix(blog): correct RTL spacing

refactor(admin): simplify event editor

---

# Commit Convention

feat

fix

docs

style

refactor

test

chore

build

ci

---

# Pull Requests

Every PR should include

Description

Screenshots

Checklist

Testing notes

No unrelated changes.

---

# Code Review Checklist

Readable

Type Safe

Responsive

Accessible

No duplicated logic

No unnecessary dependencies

Dark mode works

RTL works

No console errors

SEO preserved

---

# Security

Never trust client data.

Escape user input.

Validate uploads.

Sanitize HTML.

Protect server actions.

Prevent CSRF.

Rate limit sensitive endpoints.

Hash passwords.

---

# Images

Always use

next/image

Never use plain img unless necessary.

Optimize every image.

Provide alt text.

---

# Animations

Purposeful only.

Maximum duration

300ms

Respect reduced motion.

Avoid distracting effects.

---

# Testing Philosophy

Future

Unit Tests

Integration Tests

End-to-End Tests

Critical paths first

Registration

Admin Login

Event Creation

Blog Publishing

---

# Documentation

Complex logic must be documented.

Every exported utility should have JSDoc.

Public APIs documented.

---

# Refactoring

Improve code continuously.

Never rewrite working code without reason.

Refactor before duplication spreads.

---

# Definition of Done

Code is complete only if

✓ Builds successfully

✓ No TypeScript errors

✓ No ESLint errors

✓ Responsive

✓ Accessible

✓ RTL verified

✓ Dark mode verified

✓ SEO unaffected

✓ Performance maintained

✓ Reusable

✓ Production ready

Only then may code be merged into the main branch.

---

# Design Language

The visual identity of Pishtalk is defined not only by colors and typography,
but also by how every interface element communicates its purpose.

The interface should feel cohesive, calm and intentionally designed.

Every component should share the same visual language.

## Cards

Cards should feel like lightweight pieces of paper floating above the background.

They should never feel heavy or overly elevated.

Use soft borders and subtle shadows instead of dramatic effects.

Cards should invite interaction without demanding attention.

---

## Buttons

Buttons should feel precise, tactile and reliable.

Primary buttons should clearly communicate the most important action.

Secondary buttons should remain visually quiet.

Buttons should never feel oversized or aggressive.

Hover and active states should provide immediate feedback without excessive animation.

---

## Forms

Forms should feel approachable rather than bureaucratic.

Large touch targets.

Clear labels.

Simple validation.

Helpful error messages.

Users should never feel intimidated when filling a form.

Completing registration should feel effortless.

---

## Navigation

Navigation should always provide confidence.

Visitors should instantly know:

- Where they are
- Where they can go
- How to return

Navigation should never compete with page content.

---

## Sections

Every section should tell one story.

Each section answers exactly one question.

Example

Hero

"What is Pishtalk?"

About

"Why does Pishtalk exist?"

Why Attend

"Why should I participate?"

Next Event

"What is happening next?"

Gallery

"What does Pishtalk look like?"

Avoid mixing multiple purposes into a single section.

---

## Empty States

Empty states should feel intentional.

They should reassure the user that nothing is broken.

Whenever appropriate, suggest the next action.

Example

"رویداد بعدی به‌زودی معرفی خواهد شد."

instead of

"No Data"

---

## Loading States

Loading should communicate progress.

Prefer skeleton components over spinners.

The interface should appear responsive immediately.

Avoid long blank screens.

---

## Motion

Motion should reinforce interaction.

Animations should make interfaces easier to understand.

Every animation must have a purpose.

Examples

- Hover feedback
- Smooth page transitions
- Accordion expansion
- Dialog opening
- Timeline appearance

Motion should never distract from the content.

---

## Typography

Typography is the primary design element.

Hierarchy should come from spacing and typography before color.

Large headings should create confidence.

Body text should maximize readability.

Avoid decorative typography.

---

## Color Usage

Accent colors should guide attention.

They should never dominate the interface.

Dark backgrounds create focus.

White space creates breathing room.

Gold is used to highlight importance, not decoration.

---

## Photography

Photography should document real community moments.

Images should communicate:

Learning

Discussion

Engineering

Curiosity

Collaboration

Avoid generic stock photography whenever possible.

---

## Visual Rhythm

Pages should have a consistent reading rhythm.

Alternate between:

Content

Whitespace

Visual Element

Content

Whitespace

This rhythm reduces cognitive load and makes long pages enjoyable to read.

---

## Overall Feeling

When someone opens Pishtalk, the experience should feel:

Calm

Professional

Modern

Welcoming

Trustworthy

Focused

The interface should disappear behind the content.

Visitors should remember the community, not the UI.

---

# Things We Never Do

To preserve the Pishtalk identity, the following design decisions are prohibited.

- Never use glassmorphism.
- Never use neon colors.
- Never use excessive gradients.
- Never use more than one primary CTA in a section.
- Never autoplay videos or animations.
- Never use carousels for critical information.
- Never hide important actions behind hover effects.
- Never use stock illustrations that don't reflect engineering or technology.
- Never use inconsistent spacing or typography.
- Never create visual noise through unnecessary decorations.
- Never prioritize aesthetics over readability.
- Never sacrifice performance for visual effects.
- Never introduce animations that delay interaction.
- Never use trendy UI patterns unless they clearly improve usability.
- Never let branding overpower the content—the community and events are always the focus.
