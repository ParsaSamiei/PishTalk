# Pishtalk — Product Requirements Document (PRD)

Version: 1.0

---

# Product Name

پیشتاک (Pishtalk)

---

# Vision

Pishtalk is the official website of the Pishtalk community, a monthly robotics and artificial intelligence meetup organized by Pishnam Robotics Institute.

The website is not intended to be a social network, an online learning platform, or a discussion forum.

Its purpose is to become the official digital home of the Pishtalk community where engineers, students, researchers and technology enthusiasts can discover upcoming events, register for them, access educational resources, read articles, and explore previous meetups.

The experience should feel professional, modern, welcoming and trustworthy.

The overall quality should resemble products created by companies such as Vercel, OpenAI, Apple and Linear while respecting Persian language conventions and right-to-left layouts.

---

# Mission

Build the highest quality Persian website dedicated to monthly robotics and AI community events.

The website should communicate professionalism, simplicity, openness and innovation.

Visitors should immediately understand:

• What Pishtalk is
• Who organizes it
• Why they should attend
• How they can register
• What previous events looked like

---

# Objectives

The website must:

- Introduce Pishtalk
- Promote upcoming events
- Allow online registration
- Archive previous meetups
- Publish blog articles
- Share educational resources
- Showcase galleries from previous events
- Present community rules
- Answer common questions
- Introduce Pishnam Institute
- Redirect visitors to the official Pishnam website

---

# What Pishtalk Is NOT

The project intentionally avoids unnecessary complexity.

It is NOT:

- a social network
- a messaging platform
- a forum
- LinkedIn
- Discord
- Meetup
- Eventbrite
- an online classroom

Users cannot create accounts.

Users cannot create posts.

Users cannot comment.

Users cannot follow each other.

All published content is managed exclusively by administrators.

---

# Target Audience

Primary Audience

- Robotics engineers
- Artificial Intelligence engineers
- Software developers
- Embedded systems engineers
- Electronics engineers
- Computer engineering students
- Robotics competition teams
- University students
- Researchers
- Startup founders

Secondary Audience

- Technology enthusiasts
- University professors
- Companies looking for talent
- Industry professionals

---

# Language

Primary Language

Persian (Farsi)

RTL

Future versions may support English.

---

# Event Model

Pishtalk is an in-person monthly meetup.

Events are usually held on one Wednesday each month at Pishnam Robotics Institute.

Every event has its own dedicated webpage.

Each event includes:

- title
- subtitle
- date
- time
- location
- speaker
- description
- agenda
- timeline
- gallery
- downloadable resources
- registration form

Completed events become part of the permanent archive.

---

# Registration

Visitors can register without creating an account.

Registration is intentionally simple.

Required information:

- First Name
- Last Name
- Mobile Number

Optional:

- Email
- University
- Company
- Field of Study / Profession

After registration, users receive a success confirmation page.

Capacity management exists internally for administrators but is not displayed publicly.

---

# Content Types

The website contains the following content:

Upcoming Events

Past Events

Blog Articles

Educational Resources

Photo Galleries

Videos

Rules

FAQ

About Pishtalk

Contact Information

---

# Administration

Only administrators can:

Create events

Edit events

Publish blog posts

Upload galleries

Manage resources

Edit homepage content

Edit FAQ

Edit Rules

Manage registrations

Update contact information

---

# Brand Personality

Professional

Modern

Minimal

Friendly

Innovative

Technical

Welcoming

Community Driven

Educational

---

# Design Principles

The interface must emphasize clarity over decoration.

Avoid unnecessary visual noise.

Prioritize typography.

Use generous spacing.

Animations should be subtle.

Performance always has priority over visual effects.

Every component should have a clear purpose.

---

# Success Criteria

A visitor should understand the purpose of Pishtalk within the first 10 seconds.

The next event should be immediately visible.

Registration should require less than one minute.

The website should achieve Lighthouse scores above 95.

The interface should feel comparable to modern technology companies.

The website should become the official reference for every Pishtalk event.

---

# Technical Stack

Frontend

Next.js 15

React 19

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

Backend

Next.js Route Handlers

PostgreSQL

Prisma ORM

Authentication

Auth.js

Admin only

No public accounts

---

<!-- # Long-Term Vision

The project should be designed for future expansion without major architectural changes.

Possible future additions include:

- Sponsors
- Live streaming
- English language
- Event ticket QR codes
- Certificates of attendance
- Newsletter
- Search
- Advanced analytics
- Event recordings
- Speaker profiles
- Partner organizations

The architecture should make these additions straightforward while keeping the first version intentionally simple. -->
