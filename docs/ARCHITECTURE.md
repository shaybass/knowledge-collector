# Knowledge Collector - System Architecture

## Overview
אפליקציית PWA לאיסוף ידע אישי בלחיצה אחת מהמובייל.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (PWA)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Share   │  │  Library │  │  Detail  │  │  Filter Overlay  │ │
│  │  Screen  │  │  (Home)  │  │   View   │  │                  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │
│       │             │             │                  │           │
│       └─────────────┴─────────────┴──────────────────┘           │
│                              │                                    │
│                    ┌─────────┴─────────┐                         │
│                    │   Service Worker  │                         │
│                    │   (Offline/PWA)   │                         │
│                    └─────────┬─────────┘                         │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ POST /api/save │  │ GET /api/items │  │ GET /api/items/:id │  │
│  └───────┬────────┘  └───────┬────────┘  └─────────┬──────────┘  │
│          │                   │                     │              │
│          ▼                   │                     │              │
│  ┌───────────────┐           │                     │              │
│  │  AI Pipeline  │           │                     │              │
│  │  (Claude API) │           │                     │              │
│  └───────┬───────┘           │                     │              │
│          │                   │                     │              │
└──────────┼───────────────────┼─────────────────────┼──────────────┘
           │                   │                     │
           ▼                   ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    knowledge_items                          │  │
│  │  id | url | title | summary | tags | source | platform |   │  │
│  │  created_at | content_type | raw_content                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Share Flow (שמירת לינק)
```
1. User shares URL from any app
          │
          ▼
2. PWA opens via Web Share Target API
          │
          ▼
3. POST /api/save { url }
          │
          ▼
4. Server: Fetch URL metadata
          │
          ▼
5. Server: AI Processing (Claude)
   - Content type detection
   - Text extraction
   - Summary generation
   - Tag extraction
   - Source/Platform detection
          │
          ▼
6. Save to Supabase
          │
          ▼
7. Return success + item data
          │
          ▼
8. Client shows "Open Library" button
```

### Library Flow (צפייה בספריה)
```
1. GET /api/items?search=&tags=&platform=&page=
          │
          ▼
2. Query Supabase with filters
          │
          ▼
3. Return paginated results
          │
          ▼
4. Client renders cards with infinite scroll
```

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js 14 (App Router) | PWA support, SSR, API routes |
| Styling | Tailwind CSS | Mobile-first, rapid development |
| State | React Query | Caching, infinite scroll |
| PWA | next-pwa | Service worker, offline |
| Backend | Next.js API Routes | Serverless, simple |
| Database | Supabase (PostgreSQL) | Free tier, real-time |
| AI | Claude API | Best text understanding |
| Auth | Single-user (env token) | MVP simplicity |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/save | Save new URL + AI processing |
| GET | /api/items | List items with filters |
| GET | /api/items/[id] | Get single item |
| GET | /api/tags | Get all unique tags |
| GET | /api/platforms | Get all platforms |

## Security (MVP)
- Single user - no auth needed for MVP
- API protected by simple token in env
- CORS restricted to app domain
