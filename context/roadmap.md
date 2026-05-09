# Project Roadmap

## Status: Requirements finalized — ready for implementation

---

## Phase 1 — Project Setup
- Initialize Next.js 14, Tailwind, TypeScript
- Connect Neon DB, configure Prisma
- Set up next-intl (4 locales), NextAuth.js, ImageKit, Resend, Vercel Blob
- Configure middleware for locale routing and admin auth

## Phase 2 — Database & Models
- Define and migrate full Prisma schema
- Seed initial super_admin account

## Phase 3 — Public Pages
- Home, About, News, Reports, Contact pages
- Language switcher, header, footer
- Basic SEO (meta tags, sitemap, robots.txt)

## Phase 4 — Contact Form & Email
- Contact form with validation
- Email delivery via Resend
- Submissions saved to DB

## Phase 5 — Admin CMS Panel
- Admin login, protected layout
- Articles CRUD (Tiptap editor, 4-language tabs, publish/draft)
- Reports CRUD (PDF upload via Vercel Blob, 4-language)
- Contact submissions inbox
- Static pages editor
- User management (super_admin only)

## Phase 6 — Polish & Launch
- Responsive design, Noto Sans Ethiopic font
- Navy/gold color scheme, commission logo
- Security hardening (rate limiting, sanitization)
- Error pages, final Vercel deployment, custom domain

## Phase 7 — Post-Launch
- Analytics, error monitoring, staff documentation, DB backups
