# Architecture

## Status: Finalized

---

## High-Level Architecture

```
[ Visitor Browser ]
       |
       v
[ Next.js — Public Pages (SSR/SSG) ]
[ Locale routing: /en/ /am/ /har/ /orm/ ]
       |
       v
[ Next.js API Routes ]
       |
  _____|___________________________________________
 |           |              |           |          |
 v           v              v           v          v
[Neon]   [ImageKit]   [Vercel Blob]  [Resend]  [NextAuth]
(PostgreSQL) (Images)    (PDFs)       (Email)   (Auth)
```

---

## Stack

| Layer          | Technology              | Reason                                               |
|----------------|-------------------------|------------------------------------------------------|
| Frontend       | Next.js 16.2.6 (App Router) | SSR/SSG, locale routing, Metadata API            |
| Backend        | Next.js API Routes      | Unified codebase, simple for this scale              |
| Database       | Neon                    | Serverless PostgreSQL, scales to zero, Vercel-native |
| ORM            | Prisma                  | Type-safe DB queries, migrations, great DX           |
| Image Storage  | @imagekit/nodejs        | Image optimization, CDN, thumbnails                  |
| File Storage   | Vercel Blob             | PDF report storage                                   |
| Email          | Resend                  | Contact form email delivery                          |
| Auth (Admin)   | Better Auth             | Modern auth library, clean API, built-in TypeScript  |
| i18n           | next-intl               | Locale routing, translation management               |
| Styling        | Tailwind CSS v4         | Utility-first, fast UI development                   |
| Rich Text      | Tiptap                  | Admin article editor with Ethiopic script support    |
| Deployment     | Vercel                  | Native Next.js, auto deployments, preview URLs       |

---

## Folder Structure

```
/
├── app/
│   ├── [locale]/                  # Public pages (en, am, har, orm)
│   │   ├── page.tsx               # Home
│   │   ├── about/page.tsx         # About
│   │   ├── news/
│   │   │   ├── page.tsx           # News listing
│   │   │   └── [slug]/page.tsx    # Article detail
│   │   ├── reports/
│   │   │   └── page.tsx           # Reports listing
│   │   └── contact/page.tsx       # Contact form
│   ├── admin/                     # Admin panel (no locale)
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── articles/
│   │   ├── reports/
│   │   ├── contact/
│   │   ├── pages/
│   │   └── users/
│   └── api/
│       ├── articles/
│       ├── reports/
│       ├── contact/
│       ├── admin/
│       └── auth/
├── components/
│   ├── public/                    # Public-facing UI components
│   └── admin/                    # Admin panel UI components
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── auth.ts                    # Better Auth config
│   ├── imagekit.ts                # ImageKit client
│   ├── resend.ts                  # Email client
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── messages/                      # i18n translation files
│   ├── en.json
│   ├── am.json
│   ├── har.json
│   └── orm.json
├── middleware.ts                  # Locale + auth middleware
└── public/
    └── logo.png
```

---

## Deployment

| Service        | Platform      | Notes                                          |
|----------------|---------------|------------------------------------------------|
| Frontend/API   | Vercel        | Native Next.js support, auto deployments       |
| Database       | Neon          | Serverless PostgreSQL, scales to zero          |
| Image Storage  | ImageKit      | Images, thumbnails, CDN optimization           |
| File Storage   | Vercel Blob   | PDF report uploads                             |
| Email          | Resend        | Contact form email delivery                    |

---

## Architecture Pattern
- Monolithic Next.js app (appropriate for this scale)
- Server-side rendering for public pages (SEO + i18n)
- Locale-based routing: /en/, /am/, /har/, /orm/
- REST API routes for admin panel operations
- Middleware handles locale detection and admin auth protection
