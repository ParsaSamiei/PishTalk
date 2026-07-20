# 07_ADMIN_PANEL.md

Version: 1.0

---

# Purpose

This document defines the complete administration dashboard of Pishtalk.

The admin dashboard is the only place where website content is managed.

There are no public user accounts.

Only administrators can access the dashboard.

The admin panel should feel like a professional SaaS application rather than a CMS.

Design inspiration:

- Vercel Dashboard
- Stripe Dashboard
- Linear
- Notion

The dashboard should be simple, clean and fast.

---

# URL

/admin

---

# Authentication

Only administrators can log in.

Authentication is handled using Auth.js.

Passwords are stored using bcrypt.

Sessions use secure cookies.

Future support:

- Google Login
- Two Factor Authentication

---

# Dashboard Layout

Sidebar

↓

Top Navigation

↓

Main Content

The sidebar remains fixed.

Content scrolls independently.

---

# Sidebar

Dashboard

Events

Registrations

Blogs

Resources

Gallery

FAQ

Rules

Site Settings

Profile

Logout

---

# Dashboard

Purpose

Provide an overview of the website.

Widgets

Upcoming Event

Total Registrations

Published Blogs

Resources

Gallery Images

Website Status

Recent Activity

Quick Actions

---

# Quick Actions

Create Event

Write Blog

Upload Gallery

Add Resource

Edit Homepage

---

# Events

Table Columns

Title

Date

Status

Registrations

Created At

Actions

Actions

View

Edit

Duplicate

Archive

Delete

Filters

Upcoming

Past

Draft

Archived

Cancelled

Search

Pagination

Sorting

Newest First

---

# Create Event

Fields

Title

Subtitle

Slug

Cover Image

Description

Date

Start Time

End Time

Location

Speaker Name

Speaker Biography

Timeline

Capacity

Status

SEO Title

SEO Description

Open Graph Image

Buttons

Save Draft

Publish

Preview

---

# Timeline Editor

Add Timeline Item

Drag & Drop Sorting

Time

Title

Description

Delete Item

Unlimited Items

---

# Registrations

Purpose

View attendees.

Columns

Name

Phone

Email

University

Company

Profession

Registration Time

Search

Export CSV

Export Excel

Delete Registration

Future

Attendance

QR Code

Certificates

---

# Blogs

Table

Title

Category

Status

Reading Time

Published Date

Actions

Create

Edit

Preview

Delete

Rich Text Editor

Cover Image

SEO Fields

Slug

Category

Tags (Future)

---

# Resources

Table

Title

Type

Event

Created At

Actions

Upload

Edit

Delete

Supported Types

PDF

PowerPoint

GitHub

Video

ZIP

External Link

---

# Gallery

Grid View

Cover Image

Event

Images

Videos

Created At

Upload

Delete

Edit

Drag & Drop Upload

Image Preview

Video Preview

Automatic Compression

---

# FAQ

Table

Question

Sort Order

Published

Actions

Edit

Delete

Drag & Drop Sorting

---

# Rules

Card View

Title

Icon

Description

Sort Order

Published

---

# Site Settings

General

Site Name

Tagline

Logo

Favicon

Theme

Homepage

Hero Title

Hero Subtitle

Hero Background

Contact

Phone

Email

Address

Google Maps

Instagram

Telegram

Pishnam Website

SEO

Default Title

Default Description

Open Graph Image

Analytics

Google Analytics

Future

Microsoft Clarity

Maintenance Mode

On / Off

---

# Media Library

Centralized media manager.

Folders

Images

Videos

Documents

Search

Preview

Delete

Replace

Copy URL

---

# Notifications

Success

Error

Warning

Information

Top Right

Auto Close

Undo when possible

---

# Search

Global Search

Events

Blogs

Resources

Gallery

FAQ

Rules

---

# Keyboard Shortcuts

Future

Ctrl + K

Global Search

N

New Event

B

New Blog

Esc

Close Dialog

---

# Tables

Pagination

Sorting

Filtering

Search

Bulk Actions

Responsive

Sticky Header

---

# Confirmation Dialogs

Required Before

Delete Event

Delete Blog

Delete Resource

Delete Gallery

Delete FAQ

Delete Rule

Delete Media

---

# Autosave

Blog Drafts

Event Drafts

Every 30 Seconds

Show Saved Status

---

# Permissions

V1

Single Admin Role

Future

Super Admin

Editor

Content Manager

Moderator

---

# Security

CSRF Protection

Rate Limiting

Secure Sessions

Audit Logging (Future)

Environment Variables

Server-side Validation

---

# Performance

Instant Navigation

Optimistic Updates

Skeleton Loading

Image Lazy Loading

Minimal JavaScript

---

# Accessibility

Keyboard Navigation

ARIA Labels

Visible Focus

Screen Reader Support

RTL Support

Dark Mode

---

# Definition of Done

Admin Panel is complete only if

✓ Authentication works

✓ CRUD works

✓ Validation works

✓ File Upload works

✓ Responsive

✓ Dark Mode

✓ Accessible

✓ Fast

✓ Secure

✓ Production Ready
