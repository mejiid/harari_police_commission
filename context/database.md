# Database Design

## Status: Draft (pending full requirements)

---

## Core Entities (Preliminary)

### users (admin staff)
| Column       | Type      | Notes                          |
|--------------|-----------|--------------------------------|
| id           | UUID      | Primary key                    |
| email        | VARCHAR   | Unique, used for login         |
| password     | VARCHAR   | Hashed (bcrypt)                |
| name         | VARCHAR   | Display name                   |
| role         | ENUM      | super_admin, editor            |
| is_active    | BOOLEAN   | Deactivate without deleting    |
| created_at   | TIMESTAMP |                                |
| updated_at   | TIMESTAMP |                                |

### articles (news)
| Column       | Type      | Notes                    |
|--------------|-----------|--------------------------|
| id           | UUID      | Primary key              |
| title        | VARCHAR   |                          |
| slug         | VARCHAR   | URL-friendly identifier  |
| content      | TEXT      | Rich text / HTML         |
| summary      | TEXT      | Short preview text       |
| published_at | TIMESTAMP | Null = draft             |
| created_by   | UUID      | FK → users.id            |
| created_at   | TIMESTAMP |                          |
| updated_at   | TIMESTAMP |                          |

### reports
| Column       | Type      | Notes                    |
|--------------|-----------|--------------------------|
| id           | UUID      | Primary key              |
| title        | VARCHAR   |                          |
| description  | TEXT      |                          |
| file_url     | VARCHAR   | Path/URL to PDF file     |
| published_at | TIMESTAMP |                          |
| created_by   | UUID      | FK → users.id            |
| created_at   | TIMESTAMP |                          |

### contact_submissions
| Column       | Type      | Notes                    |
|--------------|-----------|--------------------------|
| id           | UUID      | Primary key              |
| name         | VARCHAR   |                          |
| email        | VARCHAR   |                          |
| subject      | VARCHAR   |                          |
| message      | TEXT      |                          |
| submitted_at | TIMESTAMP |                          |
| is_read      | BOOLEAN   | For admin inbox tracking |

---

### article_translations
| Column       | Type      | Notes                          |
|--------------|-----------|--------------------------------|
| id           | UUID      | Primary key                    |
| article_id   | UUID      | FK → articles.id               |
| language     | VARCHAR   | en, am, har, orm               |
| title        | VARCHAR   |                                |
| slug         | VARCHAR   | Language-specific URL slug     |
| content      | TEXT      | Rich text / HTML               |
| summary      | TEXT      | Short preview text             |

### report_translations
| Column       | Type      | Notes                          |
|--------------|-----------|--------------------------------|
| id           | UUID      | Primary key                    |
| report_id    | UUID      | FK → reports.id                |
| language     | VARCHAR   | en, am, har, orm               |
| title        | VARCHAR   |                                |
| description  | TEXT      |                                |

### page_translations (for static pages: Home, About)
| Column       | Type      | Notes                          |
|--------------|-----------|--------------------------------|
| id           | UUID      | Primary key                    |
| page_key     | VARCHAR   | e.g. "home", "about"           |
| language     | VARCHAR   | en, am, har, orm               |
| content      | TEXT      | Rich text / HTML               |
| updated_at   | TIMESTAMP |                                |

---

## Notes
- Schema uses a translations table pattern (industry standard for multi-language content)
- Supports 4 languages: English (en), Amharic (am), Harari (har), Oromo (orm)
- Fallback language is English if a translation is missing
