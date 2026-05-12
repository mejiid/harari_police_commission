# HPPC Project Wiki

## Architecture Overview
- **Framework**: Next.js 16.2.6 (App Router)
- **Database**: PostgreSQL (Neon) via Prisma ORM
- **Auth**: Better Auth (Email/Password + Roles)
- **i18n**: 4 Locales (EN, AM, HAR, ORM) using `next-intl`

## Core Modules
### [Admin Dashboard](file:///C:/Users/MEJID/Desktop/harari%20prison%20website/prison/app/admin)
The administrative heart of the project.
- **Articles**: Multi-language news management.
- **Reports**: Institutional PDF archive.
- **Pages**: Dynamic static-text editor.
- **Users**: RBAC (Super Admin / Editor).

### [Public Interface](file:///C:/Users/MEJID/Desktop/harari%20prison%20website/prison/app/[locale])
The public-facing portal.
- **Homepage**: Bento-grid dashboard for institutional status.
- **Contact**: Automated email inquiry system.

### [Library & Utilities](file:///C:/Users/MEJID/Desktop/harari%20prison%20website/prison/lib)
Infrastructure clients and helper functions.
- `db.ts`: Central DB client.
- `auth.ts`: Session management.
- `resend.ts`: Email delivery.

## Design System: Authoritative Archive
- **Colors**: Navy (#000666), Coral (#FF635A), Institutional Gold.
- **Typography**: Public Sans, Inter, Noto Sans Ethiopic.
- **Aesthetic**: Premium glassmorphism, institutional stability.

## Development Workflows
1. **Migrations**: `npx prisma migrate dev`
2. **Seeding**: `npx prisma db seed`
3. **i18n**: Edit `messages/*.json` for static UI text.
