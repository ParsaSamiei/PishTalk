# 08_SEO.md

Version: 1.0

---

# Purpose

This document defines the complete Search Engine Optimization (SEO)
strategy for Pishtalk.

SEO is considered a core product feature.

Every page must be discoverable, indexable, accessible and optimized
for both Persian and international search engines.

The objective is to build the website correctly from day one rather
than trying to improve SEO after launch.

---

# SEO Objectives

Primary Objectives

• Increase visibility for robotics events in Iran

• Become the first result for "پیشتاک"

• Rank for robotics and AI meetup related searches

• Drive registrations for monthly events

• Build long-term organic traffic through blogs and educational resources

---

# SEO Philosophy

SEO should be invisible.

Users should never notice "SEO tricks."

Instead the website should simply be:

Fast

Accessible

Useful

Well Structured

Technically Correct

Content Rich

---

# URL Structure

Always use readable URLs.

Correct

/

about

events

events/pishtalk-7

blog/introduction-to-ros2

gallery/pishtalk-7

resources/robot-navigation

faq

rules

Never expose

IDs

UUIDs

Query Parameters

---

# URL Rules

URLs

Lowercase

English

Hyphen separated

Stable forever

Never change published URLs.

If a slug changes

Create a permanent 301 redirect.

---

# Metadata

Every page must generate metadata dynamically.

Required Fields

Title

Description

Canonical URL

OpenGraph Image

Keywords

Authors

Language

Robots

Theme Color

Icons

---

# Title Rules

Maximum

60 Characters

Format

Page | پیشتاک

Examples

پیشتاک | جامعه مهندسان رباتیک و هوش مصنوعی

رویداد شماره ۷ | پیشتاک

وبلاگ | پیشتاک

قوانین | پیشتاک

---

# Meta Description

Length

140–160 Characters

Every page must have a unique description.

Never duplicate descriptions.

---

# Canonical URLs

Every page exports a canonical URL.

Avoid duplicate indexing.

---

# Open Graph

Every page supports

og:title

og:description

og:image

og:type

og:url

og:locale

Default Locale

fa_IR

---

# Twitter Cards

Even if Twitter is not widely used locally,
support it for compatibility.

Use

summary_large_image

---

# JSON-LD Structured Data

Use Schema.org.

Homepage

Organization

WebSite

BreadcrumbList

Events

Event

Blog

BlogPosting

Resources

CreativeWork

Gallery

ImageGallery

FAQ

FAQPage

Contact

ContactPage

About

AboutPage

Rules

WebPage

---

# Event Schema

Every event includes

Name

Description

Start Date

End Date

Location

Organizer

Image

URL

Event Status

Attendance Mode

---

# Organization Schema

Organization Name

Pishtalk

Parent Organization

Pishnam Robotics Institute

Website

Logo

Social Profiles

Instagram

Telegram

---

# Breadcrumbs

Visible

Blog

Resources

Events

Gallery

Hidden

Homepage

JSON-LD Breadcrumbs

Always included.

---

# Robots.txt

Allow

Public Pages

Disallow

Admin

API

Private Uploads

Draft Pages

---

# Sitemap

Generate automatically.

Include

Homepage

Blogs

Events

Gallery

Resources

Rules

FAQ

About

Contact

Exclude

Admin

Draft Content

Deleted Content

Error Pages

---

# Images

Every image requires

Alt Text

Width

Height

Caption (Optional)

Filename

Readable

Correct

robot-navigation.jpg

Wrong

IMG_938282.jpg

---

# Image Optimization

Use

Next Image

Responsive

Lazy Loading

AVIF

WebP

Blur Placeholder

Compression

---

# Internal Linking

Every blog should link to

Events

Resources

Related Blogs

Every event should link to

Gallery

Resources

Blog

Registration

No orphan pages.

---

# Blog SEO

Every article requires

Title

Description

Cover Image

Slug

Category

Reading Time

Published Date

Updated Date

Author

Table of Contents

Related Posts

---

# Content Rules

Minimum Blog Length

800 Words

Preferred

1200–2500 Words

Headings

H2

H3

H4

Never skip heading hierarchy.

---

# Event SEO

Every event page should contain

Summary

Agenda

Speaker

Location

Timeline

Registration

Resources

Gallery

FAQ

Structured Data

---

# Persian SEO

Correct RTL

UTF-8

Readable Persian URLs where appropriate for display, but English slugs internally.

Natural Persian writing.

Avoid keyword stuffing.

---

# Performance

Target Lighthouse

Performance

95+

Accessibility

100

Best Practices

100

SEO

100

---

# Core Web Vitals

LCP

<2.5 Seconds

CLS

<0.1

INP

<200ms

---

# Caching

Static Pages

ISR

Dynamic Pages

Server Rendering

Images

Long Cache

---

# Search Console

Website must be ready for

Google Search Console

Bing Webmaster Tools

Verification through metadata or DNS.

---

# Analytics

Support

Google Analytics 4

Google Tag Manager

Microsoft Clarity (Future)

Plausible (Optional)

Umami (Optional)

Analytics should be configurable from Site Settings.

---

# Open Graph Images

Every page automatically generates an OG image.

Events

Unique Image

Blogs

Unique Image

Homepage

Brand Image

---

# Favicons

Provide

favicon.ico

16x16

32x32

180x180 Apple Touch Icon

Android Icons

Manifest

Pinned Safari Icon

---

# RSS Feed

Automatically generate

/blog/rss.xml

Future

/events/rss.xml

---

# Search

Search pages must be indexable.

Search parameters should not create duplicate content.

---

# Pagination

Use rel="next"

rel="prev"

where appropriate.

---

# Security SEO

HTTPS Only

HSTS

No mixed content.

Canonical HTTPS URLs.

---

# Accessibility SEO

Semantic HTML

Landmarks

Proper Heading Structure

ARIA Labels

Keyboard Navigation

Screen Reader Support

---

# Localization

Language

Persian

Locale

fa-IR

Future

English

Locale

en-US

Architecture must support multilingual expansion.

---

# Redirects

301

Permanent

302

Temporary

Never allow broken links.

---

# Error Pages

404

Helpful Navigation

Search

Return Home

410

Future Support

---

# Content Strategy

Publish at least

1 Event

Every Month

2 Blog Posts

Every Month

1 Resource Update

Every Month

Fresh content is critical for long-term SEO.

---

# Technical Requirements

Use Next.js Metadata API.

Dynamic Metadata.

Automatic Sitemap.

Automatic Robots.

JSON-LD.

Open Graph.

Twitter Cards.

Canonical URLs.

No duplicate titles.

No duplicate descriptions.

---

# Deployment Checklist

HTTPS Enabled

Search Console Connected

Sitemap Submitted

Robots Verified

Analytics Installed

Open Graph Tested

Lighthouse Verified

Broken Links Checked

Metadata Validated

Structured Data Validated

---

# SEO Definition of Done

A page is SEO complete only if

✓ Unique Title

✓ Unique Description

✓ Canonical URL

✓ OpenGraph

✓ Twitter Card

✓ JSON-LD

✓ Optimized Images

✓ Internal Links

✓ Semantic HTML

✓ Accessible

✓ Fast

✓ Mobile Friendly

✓ Indexed

✓ No Broken Links

✓ Lighthouse SEO ≥ 100

Only then is a page considered production ready.
