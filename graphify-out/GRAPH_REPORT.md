# Graph Report - .  (2026-05-10)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 74 nodes · 30 edges · 50 communities (4 shown, 46 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad9c7707`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]

## God Nodes (most connected - your core abstractions)
1. `Prisma DB Client` - 14 edges
2. `API: Public Inquiry Submission` - 3 edges
3. `Public Homepage` - 3 edges
4. `Admin Article Editorial Form` - 3 edges
5. `Better Auth Server Config` - 3 edges
6. `Admin Article Editing` - 2 edges
7. `Admin Contact Inquiry Inbox` - 2 edges
8. `Public Website Header` - 2 edges
9. `i18n Routing Setup` - 2 edges
10. `Database Seeding Script` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Architecture Doc` --describes--> `Prisma DB Client`  [EXTRACTED]
  context/architecture.md → lib/db.ts
- `Admin Article Editing` --calls--> `Prisma DB Client`  [EXTRACTED]
  app/admin/(dashboard)/articles/[id]/page.tsx → lib/db.ts
- `Admin Contact Inquiry Inbox` --calls--> `Prisma DB Client`  [EXTRACTED]
  app/admin/(dashboard)/contact/page.tsx → lib/db.ts
- `Architecture Doc` --describes--> `Better Auth Server Config`  [EXTRACTED]
  context/architecture.md → lib/auth.ts
- `Sitemap Generator` --calls--> `Prisma DB Client`  [EXTRACTED]
  app/sitemap.ts → lib/db.ts

## Communities (50 total, 46 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (11): Admin Articles Management, Admin Dashboard Overview, Admin Edit Report Page, Admin Reports Management, Admin Users Management, API: Admin Articles CRUD, Better Auth Server Config, Architecture Doc (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.4
Nodes (5): Public Website Footer, Public Website Header, i18n Request Config, i18n Routing Setup, Public Homepage

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (4): Admin Article Editorial Form, Admin Rich Text Editor, Admin Article Editing, Admin New Article Creation

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (3): Public Inquiry Form, API: Public Inquiry Submission, Resend Email Client

## Knowledge Gaps
- **63 isolated node(s):** `ESLint Configuration`, `Next.js Configuration`, `Prisma Configuration`, `Auth & i18n Proxy Middleware`, `Root Layout` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prisma DB Client` connect `Community 0` to `Community 1`, `Community 2`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Public Homepage` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `Admin Article Editing` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `ESLint Configuration`, `Next.js Configuration`, `Prisma Configuration` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._