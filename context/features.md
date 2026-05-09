# Feature Requirements

## Status: In Progress (requirements gathering)

---

## Public-Facing Features

### 1. News Section
- Display list of news articles (title, date, summary, full content)
- Articles written and published via admin CMS
- Paginated listing page + individual article detail page

### 2. Reports Section
- Display list of official reports
- Each report can have: title, description, date, downloadable PDF attachment
- Visitors can download PDF files directly

### 3. Contact Form
- Fields: Name, Email, Subject, Message
- On submission: sends email to the commission's designated email address
- Basic validation (required fields, valid email format)
- Success/error feedback to the visitor after submission

### 4. Static Pages
- Home / Landing page
- About the Commission
- Contact Us page (with form)

---

## Admin / CMS Features

### 5. Admin Panel
- Secure login for commission staff (multiple accounts)
- Role-based access control:
  - **Super Admin**: full access — publish/unpublish, delete, manage users, all content
  - **Editor**: create and edit drafts, upload PDFs, cannot publish or delete
- Create, edit, delete news articles (with multi-language content entry)
- Create, edit, delete reports (with PDF upload, multi-language title/description)
- Manage static page content (About, Home) per language
- View and manage contact form submissions inbox
- User management (Super Admin only): create/deactivate admin accounts, assign roles

---

## Design System
- Logo: provided by commission
- Color scheme:
  - Primary: `#1a2e4a` (deep navy)
  - Accent: `#c9a84c` (gold)
  - Background: `#ffffff`
  - Text: `#1f2937`
- Typography: Noto Sans + Noto Sans Ethiopic (covers all 4 languages including Ethiopic script)
- Aesthetic: professional, institutional, government-grade
- Responsive: mobile, tablet, desktop

## Internationalization (i18n)
- 4 supported languages: English (en), Amharic (am), Harari (har), Oromo (orm)
- All public content (articles, reports, static pages) must be available in all 4 languages
- Admin panel allows entering content in multiple languages per item
- Language switcher visible on all public pages
- Default/fallback language: English

---

## Open Questions
- [ ] How many admin users will there be? Any role differences (editor vs super admin)?
- [ ] Are there any branding/design guidelines to follow?
- [ ] Does the commission already have a domain and hosting preference?
