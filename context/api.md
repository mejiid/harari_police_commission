# API Design

## Status: Draft (pending full requirements)

---

## Public API Endpoints

### News
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /api/articles         | List published articles      |
| GET    | /api/articles/:slug   | Get single article by slug   |

### Reports
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | /api/reports          | List published reports       |
| GET    | /api/reports/:id      | Get single report details    |

### Contact
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | /api/contact          | Submit contact form          |

---

## Admin API Endpoints (Protected — requires auth)

### Articles
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/admin/articles         | List all articles        |
| POST   | /api/admin/articles         | Create new article       |
| PUT    | /api/admin/articles/:id     | Update article           |
| DELETE | /api/admin/articles/:id     | Delete article           |

### Reports
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/admin/reports          | List all reports         |
| POST   | /api/admin/reports          | Create report + upload PDF |
| PUT    | /api/admin/reports/:id      | Update report            |
| DELETE | /api/admin/reports/:id      | Delete report            |

### Contact Submissions
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/admin/contact              | List all submissions     |
| PATCH  | /api/admin/contact/:id/read     | Mark as read             |

### User Management (Super Admin only)
| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | /api/admin/users            | List all admin users         |
| POST   | /api/admin/users            | Create new admin user        |
| PATCH  | /api/admin/users/:id        | Update user (role, active)   |
| DELETE | /api/admin/users/:id        | Deactivate user              |



### Auth
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/auth/login       | Admin login              |
| POST   | /api/auth/logout      | Admin logout             |
| GET    | /api/auth/me          | Get current session user |

---

## i18n Query Pattern
All public content endpoints accept a `?lang=` query param (defaults to `en`).
Supported values: `en`, `am`, `har`, `orm`
Example: `GET /api/articles?lang=am`

---

## Notes
- All admin endpoints require a valid session token
- File uploads (PDF) will use multipart/form-data
- Super Admin endpoints return 403 if accessed by Editor role
