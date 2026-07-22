# 04_DESIGN_SYSTEM.md

Version: 1.0

---

# Purpose

This document defines the visual language of Pishtalk.

Every component, page, interaction and layout must follow this design system.

The objective is consistency, usability, accessibility and long-term maintainability.

The design should feel like a premium technology product rather than a university project or event landing page.

---

# Design Philosophy

Pishtalk should feel:

Professional

Modern

Minimal

Warm

Human

Technical

Elegant

Focused

The interface should never feel crowded.

Whitespace is a design element.

Typography is the primary visual hierarchy.

Content always comes before decoration.

---

# Design References

The level of quality should resemble

- OpenAI
- Apple
- Vercel
- Linear
- Stripe
- Notion

Do NOT imitate their appearance.

Instead, imitate their attention to detail.

---

# Design Principles

1.

Clarity before creativity.

2.

Simple beats complicated.

3.

Every element must have a purpose.

4.

Motion supports interaction.

Never decoration.

5.

Accessibility is mandatory.

6.

Performance is a feature.

---

# Grid System

Desktop

12 Columns

Container Width

1280px

Large Desktop

1440px

Tablet

8 Columns

Mobile

4 Columns

Container Padding

Desktop

32px

Tablet

24px

Mobile

16px

---

# Responsive Breakpoints

Mobile

390px

Small Tablet

640px

Tablet

768px

Laptop

1024px

Desktop

1280px

Large Desktop

1536px

Design Mobile First.

---

# Spacing System

Use an 8-point grid.

Allowed spacing values

4

8

12

16

20

24

32

40

48

56

64

72

80

96

128

Never use arbitrary spacing.

---

# Border Radius

Buttons

12px

Inputs

12px

Cards

20px

Dialogs

24px

Hero Containers

32px

---

# Shadows

Only three elevation levels.

Small

Cards

Medium

Dropdowns

Large

Dialogs

Avoid heavy shadows.

Never use glowing shadows.

---

# Color Palette

Primary

#0F172A

Primary Hover

#1E293B

Accent

#F4B942

Accent Hover

#D89E2E

Surface

#FFFFFF

Surface Secondary

#F8FAFC

Dark Background

#020817

Border

#E2E8F0

Text Primary

#0F172A

Text Secondary

#475569

Text Light

#94A3B8

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Information

#3B82F6

---

# Typography

Primary Font

Vazirmatn

Fallback

sans-serif

Heading 1

48px

Bold

Heading 2

40px

Bold

Heading 3

32px

SemiBold

Heading 4

24px

SemiBold

Heading 5

20px

Medium

Heading 6

18px

Medium

Body Large

18px

Body

16px

Small

14px

Caption

12px

Buttons

16px

SemiBold

Navigation

15px

Medium

---

# Icons

Library

Lucide React

Style

Outline

Size

16

20

24

32

Stroke

2px

Never mix icon styles.

---

# Buttons

Variants

Primary

Secondary

Outline

Ghost

Danger

Icon Button

Loading Button

Disabled Button

Sizes

Small

Medium

Large

Hover

150ms

Active

100ms

Focus Ring

Always visible.

---

# Inputs

Text

Textarea

Select

Search

Phone

Email

Date

Time

Checkbox

Radio

Switch

Upload

Validation

Inline

Error Message

Green Success State

---

# Cards

Every card shares the same structure.

Padding

24px

Radius

20px

Hover Lift

2px

Border

1px

Background

White

---

# Navigation

Sticky

Transparent on Hero

Solid after scrolling

Desktop

Horizontal

Mobile

Drawer

Maximum Height

72px

---

# Hero

Height

Minimum

80vh

Content

Centered vertically

Contains

Title

Subtitle

Countdown

CTA

Background Illustration

Never place too much text inside the hero.

---

# Countdown

Boxes

Rounded

Large Numbers

Accent Color

Updates live.

---

# Timeline

Vertical

Animated

Connected Line

Each Item

Time

Title

Description

Icon

---

# Gallery

Masonry Layout

Responsive

Lazy Loaded

Lightbox

Keyboard Navigation

Swipe Support

---

# Blog Cards

Cover

Category Badge

Title

Reading Time

Publish Date

Arrow Icon

Hover Lift

---

# Resource Cards

Icon

Title

Description

Download Button

External Link

Type Badge

---

# FAQ

Accordion

One Item Open

Smooth Animation

Accessible

---

# Rules

Cards

Icon

Title

Description

Simple

Readable

---

# Contact

Card Layout

Interactive Map

Social Links

Contact Form

---

# Forms

Rounded

Minimal

Clear Labels

Large Click Targets

Never rely on placeholders as labels.

---

# Tables

Only inside Admin Panel.

Striped Rows

Hover Highlight

Sticky Header

Pagination

Search

---

# Modals

Rounded

24px

Blur Background

ESC closes

Focus Trap

---

# Notifications

Top Right

Auto Dismiss

Success

Warning

Error

Information

---

# Animations

Duration

150ms

200ms

300ms

Preferred

Fade

Slide

Scale

Opacity

Avoid

Bounce

Elastic

Rotate

Flash

Heavy Parallax

---

# Loading States

Skeleton Components

Buttons

Cards

Gallery

Blog

Timeline

Never use spinners for page loading.

---

# Empty States

Illustration

Title

Description

Primary Action

Example

"No events yet"

---

# Error States

Friendly

Clear

Helpful

Never expose technical errors.

---

# Dark Mode

Every component must support

Light

Dark

System

No component should break in dark mode.

---

# Accessibility

WCAG AA

Keyboard Navigation

Visible Focus

Screen Reader Labels

Minimum Touch Area

44px

Reduced Motion Support

RTL Perfect

---

# Performance

Animations

GPU Accelerated

Images

Next Image

Lazy Loading

Code Splitting

Server Components

Minimal JavaScript

---

# Components

Global Components

Navbar

Footer

Button

Input

Textarea

Select

Dialog

Card

Badge

Timeline

Gallery

FAQ

Blog Card

Event Card

Resource Card

Pagination

Breadcrumb

Countdown

Theme Toggle

Scroll To Top

Social Icons

Loading Skeleton

Empty State

Error State

Section Title

Container

Divider

Map

Registration Form

Contact Form

Newsletter (Future)

---

# Things We Never Do

Never use Bootstrap styling.

Never use neon colors.

Never use glassmorphism.

Never autoplay videos.

Never use flashing animations.

Never use multiple primary buttons in one section.

Never use inconsistent spacing.

Never mix icon packs.

Never use lorem ipsum in production.

Never sacrifice readability for aesthetics.

Never make animations slower than 300ms.

Never place important information inside carousels.

Never use stock illustrations that don't match the engineering identity.

---

# Definition of Done

A page is only considered complete if

✓ Responsive

✓ Accessible

✓ RTL Perfect

✓ Dark Mode Ready

✓ Lighthouse 95+

✓ Uses Design System

✓ Consistent Typography

✓ Consistent Spacing

✓ Uses Shared Components

✓ Keyboard Accessible

✓ SEO Ready

✓ No Visual Bugs

✓ No Console Errors

✓ Type Safe

✓ Production Ready

Only then is a page considered finished.
