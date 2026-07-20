# 05_DATABASE.md

Version: 1.0

---

# Purpose

This document defines the complete database architecture for Pishtalk.

The database must be:

- Simple
- Scalable
- Type-safe
- Normalized
- Easy to maintain
- Optimized for Prisma ORM

Database Engine

PostgreSQL

ORM

Prisma

---

# Design Principles

The database should:

- Avoid duplicated data
- Use foreign keys correctly
- Support future features
- Be easy to query
- Be easy to extend

All timestamps use UTC.

Soft deletes should be supported where appropriate.

---

# Tables Overview

Core Tables

- admins
- events
- event_timelines
- registrations
- blogs
- categories
- galleries
- gallery_media
- resources
- faqs
- rules
- site_settings

---

# Admins

Purpose

Authorized users who manage the website.

Fields

id

uuid

name

email

password_hash

role

avatar

created_at

updated_at

Role

Currently

Admin

Future

Super Admin

Editor

---

# Events

Purpose

Stores every Pishtalk meetup.

Fields

id

uuid

slug

title

subtitle

description

cover_image

date

start_time

end_time

location

speaker_name

speaker_bio

capacity

status

created_at

updated_at

deleted_at

Status

Draft

Published

Archived

Cancelled

Relationships

One Event

↓

Many Timeline Items

Many Gallery Images

Many Resources

Many Registrations

---

# Event Timeline

Purpose

Defines the schedule of an event.

Fields

id

event_id

time

title

description

sort_order

Relationships

Belongs to Event.

---

# Registrations

Purpose

Stores attendee registrations.

Fields

id

event_id

first_name

last_name

phone

email

university

company

profession

notes

created_at

Status

Registered

Cancelled

Attended (Future)

No authentication required.

---

# Blogs

Purpose

Stores articles.

Fields

id

slug

title

excerpt

content

cover_image

category_id

published

published_at

reading_time

seo_title

seo_description

created_at

updated_at

---

# Categories

Purpose

Organizes blog posts.

Fields

id

name

slug

description

Relationships

One Category

↓

Many Blog Posts

Example Categories

Robotics

Artificial Intelligence

Programming

Electronics

News

Community

---

# Galleries

Purpose

Represents one gallery per event.

Fields

id

event_id

title

description

cover_image

created_at

---

# Gallery Media

Purpose

Stores images and videos.

Fields

id

gallery_id

type

url

thumbnail

caption

sort_order

Media Types

Image

Video

---

# Resources

Purpose

Educational material.

Fields

id

event_id

title

description

resource_type

file_url

external_url

created_at

Types

PDF

Presentation

GitHub

Video

Research Paper

External Link

---

# FAQ

Purpose

Frequently Asked Questions.

Fields

id

question

answer

sort_order

published

---

# Rules

Purpose

Community guidelines.

Fields

id

title

description

icon

sort_order

published

---

# Site Settings

Purpose

Stores global website configuration.

There should always be exactly one record.

Fields

site_name

tagline

description

logo

favicon

hero_title

hero_subtitle

contact_email

phone

address

instagram

telegram

pishnam_url

google_maps_embed

copyright

seo_title

seo_description

default_og_image

maintenance_mode

---

# Relationships

Admins

↓

Manage Everything

Events

↓

Timeline

↓

Gallery

↓

Resources

↓

Registrations

Blogs

↓

Category

Gallery

↓

Gallery Media

---

# Uploads

Supported Types

Images

Videos

PDF

PowerPoint

ZIP

Maximum Size

Images

10 MB

Videos

200 MB

Documents

25 MB

---

# File Naming

Use UUID filenames.

Never trust uploaded filenames.

---

# Slugs

Every public page must use slugs.

Examples

/events/pishtalk-7

/blog/introduction-to-ros2

/resources/path-planning

Never expose numeric IDs publicly.

---

# Validation

Every field must be validated using Zod.

Examples

Phone Number

Iranian mobile format

Email

RFC compliant

Slug

Unique

Title

Required

Description

Optional

---

# Search

Searchable Models

Events

Blogs

Resources

FAQ

Future

Gallery

---

# Pagination

Default

12 items

Admin

25 items

Maximum

100

---

# Sorting

Newest First

Events

Upcoming first

Past afterwards

Blogs

Newest

Gallery

Newest

Resources

Alphabetical

FAQ

Manual

Rules

Manual

---

# Indexes

Create indexes for

slug

event_date

published

category_id

created_at

phone

email

These improve performance.

---

# Soft Delete

Use deleted_at

Never permanently remove

Events

Blogs

Resources

Gallery

Admins

Future cleanup job may permanently remove deleted records.

---

# Audit

Future

created_by

updated_by

deleted_by

Not required for V1.

---

# Security

Passwords

bcrypt

Never store plaintext.

Parameterized queries only.

Prisma ORM exclusively.

No raw SQL unless necessary.

---

# Future Expansion

Database must support

Sponsors

Certificates

Live Streams

QR Tickets

Multiple Speakers

English Language

Partner Organizations

Event Ratings

Attendance Tracking

Newsletter

Without requiring schema redesign.

---

# Prisma Naming Convention

Model Names

PascalCase

Field Names

camelCase

Database Tables

snake_case

Primary Keys

UUID

Timestamps

createdAt

updatedAt

deletedAt

---

# Definition of Done

Database is considered complete only if

✓ Fully normalized

✓ Prisma compatible

✓ PostgreSQL optimized

✓ UUID based

✓ Indexed

✓ Validated

✓ Scalable

✓ Type-safe

✓ Secure

✓ Ready for production
