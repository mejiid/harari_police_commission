# Task List

## Status: Ready for implementation

---

## Confirmed Requirements
- [x] Multi-language: English, Amharic, Harari, Oromo
- [x] Admin roles: super_admin and editor
- [x] Branding: logo provided, navy/gold color scheme
- [x] Hosting: Vercel + Neon + ImageKit + Vercel Blob + Resend
- [x] SEO: basic (meta tags, sitemap, robots.txt)

---

## Phase 1 — Project Setup

- [x] Initialize Next.js 16.2.6 project with App Router and TypeScript ✅ — project folder: `prison/`
- [x] Configure Tailwind CSS ✅ — Tailwind v4 already installed
- [ ] Set up Neon database and connect via DATABASE_URL
- [x] Initialize Prisma with schema ✅ — full schema.prisma created
- [x] Configure next-intl for 4 locales ✅ — i18n/routing.ts, i18n/request.ts, messages/*.json
- [x] Set up middleware.ts for locale detection and admin route protection ✅
- [x] Configure Better Auth with Prisma adapter ✅ — lib/auth.ts
- [x] Set up ImageKit client ✅ — lib/imagekit.ts
- [x] Set up Resend email client ✅ — lib/resend.ts
- [ ] Set up Vercel Blob for PDF uploads
- [x] Create environment variables structure ✅ — .env created

---

## Phase 2 — Database & Models

- [x] Define Prisma schema: User, Article, ArticleTranslation ✅
- [x] Define Prisma schema: Report, ReportTranslation ✅
- [x] Define Prisma schema: PageContent (static pages per locale) ✅
- [x] Define Prisma schema: ContactSubmission ✅
- [x] Connect DATABASE_URL to Neon and run migrations ✅ — migration `init` applied
- [x] Seed initial super_admin user ✅

---

## Phase 3 — Public Pages

- [x] Home page (per locale) ✅
- [x] About page (per locale, content from DB) ✅
- [x] News listing page (paginated, per locale) ✅
- [x] Article detail page (per locale, by slug) ✅
- [x] Reports listing page (per locale, with PDF download links) ✅
- [x] Contact page with form (per locale) ✅
- [x] Language switcher component ✅ — in Header
- [x] Header and footer components ✅
- [x] Basic SEO: meta tags, sitemap.xml, robots.txt ✅

---

## Phase 4 — Contact Form & Email

- [x] Contact form UI with validation (name, email, subject, message) ✅
- [x] POST /api/contact endpoint ✅
- [x] Send email via Resend on form submission ✅
- [x] Save submission to ContactSubmission table ✅
- [x] Success/error feedback to visitor ✅

---

## Phase 5 — Admin Panel

- [x] Admin login page (/admin/login) ✅
- [x] Protected admin layout with sidebar navigation ✅
- [x] Dashboard overview page ✅
- [x] Articles list page ✅
- [x] Article create/edit form (Tiptap editor, 4-language tabs) ✅
- [x] Article publish/unpublish (super_admin only) ✅
- [x] Article delete (super_admin only) ✅
- [x] Reports list page ✅
- [x] Report create/edit form (4-language, PDF upload) ✅
- [x] PDF upload to Vercel Blob ✅
- [x] Report delete (super_admin only) ✅
- [x] Contact submissions inbox (list, mark as read) ✅
- [x] Static pages editor (Home, About — per language) ✅
- [x] User management (super_admin only): list, create, deactivate ✅

---

## Phase 6 — Polish & Launch

- [x] Responsive design audit (mobile, tablet, desktop) ✅ — all pages use responsive grid
- [x] Font setup: Noto Sans + Noto Sans Ethiopic ✅
- [x] Apply color scheme (navy primary, gold accent) ✅
- [x] Rate limiting on contact form endpoint ✅
- [x] Input sanitization on all form fields ✅
- [x] Security headers (X-Frame-Options, CSP, etc.) ✅
- [x] Error pages (404, 500) per locale ✅
- [x] Production build passing ✅
- [ ] Final deployment to Vercel
- [ ] Connect custom domain

---

## Phase 7 — Post-Launch

- [ ] Set up Vercel Analytics
- [ ] Configure error monitoring (Sentry or Vercel's built-in)
- [ ] Document admin panel usage for commission staff
- [ ] Database backup strategy on Neon
