# Portfolio Platform — System Architecture

## Vision
A programmable, world-class portfolio platform with 3D immersive design, AI-powered interactions, and full MCP integration for management via Claude Code.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D | React Three Fiber + Drei |
| Animation | Framer Motion + GSAP |
| AI Chat | Groq (DeepSeek R1) → upgrade to RAG with pgvector |
| Database | Supabase (PostgreSQL + pgvector) |
| Blog | MDX (git-based, rendered at build time) |
| Auth | API key for admin routes |
| MCP | Custom MCP server (Next.js API route) |
| Deployment | Vercel |
| DNS/Email | Cloudflare |
| Domain | idrissamaiga.iditechs.com |

## Site Structure

```
/ (home)
├── Hero — 3D particle scene, name, roles, CTAs
├── About — Story arc, personal info, tabs
├── Experience — Interactive timeline (Mali → USA → Budapest → EISMEA → 4D)
├── Projects — Case study cards with full detail views
├── Skills — Interactive categorized visualization
├── Blog — Technical articles, project deep-dives
├── Testimonials — Social proof, metrics counters
├── Contact — Form, professional email, social links
└── Footer — Links, copyright

/blog/[slug] — Individual blog posts (MDX)
/projects/[id] — Full case study pages
```

## API Architecture

```
/api
├── /ai          — AI chat endpoint (existing, upgrade to RAG)
├── /contact     — Contact form email (existing)
├── /cv          — CV upload/download (existing)
├── /admin       — Protected admin routes
│   ├── /blog          POST/PUT/DELETE blog posts
│   ├── /projects      POST/PUT/DELETE projects
│   ├── /profile       PUT update profile data
│   ├── /deploy        POST trigger Vercel deployment
│   ├── /linkedin      POST share content to LinkedIn
│   └── /sync          GET check sync status across platforms
└── /mcp         — MCP server endpoint for Claude Code
```

## MCP Server Tools

```
portfolio-mcp-server
├── publish_blog_post(title, content, tags)
├── update_blog_post(slug, content)
├── add_project(name, description, tech, links)
├── update_project(id, fields)
├── update_profile(section, content)
├── share_to_linkedin(content, type)
├── get_sync_status()
├── deploy()
├── get_analytics()
└── send_test_email(to, subject, body)
```

## Data Model

### Profile (profile.json)
```json
{
  "name": "Idrissa Maiga",
  "title": "Full-Stack Engineer",
  "email": "idrissa.maiga@iditechs.com",
  "location": "Budapest, Hungary",
  "bio": "...",
  "experience": [...],
  "education": [...],
  "certifications": [...],
  "skills": {...},
  "social": {...}
}
```

### Project
```json
{
  "id": "neptun-api",
  "title": "Neptun API",
  "description": "...",
  "longDescription": "...",
  "techStack": ["Python", "Playwright"],
  "features": [...],
  "challenges": [...],
  "metrics": { "endpoints": 1100, "stars": 3 },
  "links": { "github": "...", "live": "..." },
  "images": [...],
  "category": "showcase"
}
```

### Blog Post (MDX)
```
---
title: "How I Reverse-Engineered 1,100 Neptun API Endpoints"
date: "2026-06-01"
tags: ["python", "reverse-engineering", "api"]
description: "..."
image: "/blog/neptun-api-cover.png"
---

Content here...
```

## Design System

### Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| bg-primary | #f9fafb | #030712 | Page background |
| bg-card | #ffffff | #0f1729 | Card backgrounds |
| bg-card-hover | #f3f4f6 | #162036 | Card hover state |
| text-primary | #1f2937 | #fafafa | Headings |
| text-secondary | #4b5563 | #a1a1aa | Body text |
| text-muted | #9ca3af | #71717a | Captions |
| accent-blue | #3b82f6 | #60a5fa | Primary accent |
| accent-cyan | #06b6d4 | #22d3ee | Secondary accent |
| accent-purple | #8b5cf6 | #a78bfa | Tertiary accent |
| accent-amber | #f59e0b | #fbbf24 | Warm accent |
| border | #e5e7eb | #1e293b | Borders |
| glass-bg | white/5% | white/5% | Glass morphism |
| glass-border | white/10% | white/10% | Glass borders |

### Typography
- Headings: Space Grotesk (700)
- Body: Inter (400, 500, 600)
- Code/Terminal: JetBrains Mono or system monospace

### Component Patterns
- Cards: rounded-xl, border, backdrop-blur on dark
- Buttons: rounded-xl, glow hover effect
- Badges: rounded-full, glass morphism
- Sections: alternating bg-primary / bg-card backgrounds
- Animations: scroll-triggered reveals, 0.6s duration, ease-out

## Build Phases

### Phase 1: 3D Design & Content (NOW)
- [x] 3D hero scene
- [ ] Redesign all sections for cohesive dark aesthetic
- [ ] Fix all content accuracy
- [ ] SEO meta tags + structured data
- [ ] Deploy to idrissamaiga.iditechs.com

### Phase 2: Data Layer & Admin
- [ ] profile.json as data source
- [ ] projects.json as data source  
- [ ] Admin API routes (key-protected)
- [ ] MCP server endpoint

### Phase 3: Blog System
- [ ] MDX setup with next-mdx-remote
- [ ] Blog index page
- [ ] Blog post template
- [ ] Auto-share to LinkedIn on publish

### Phase 4: AI & Integrations
- [ ] RAG chatbot (embed profile + projects + blog)
- [ ] LinkedIn OAuth + Share API
- [ ] GitHub API integration (live stats)
- [ ] Scheduled sync checker

### Phase 5: Polish
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization (Lighthouse 95+)
- [ ] prefers-reduced-motion fallbacks
- [ ] Custom 404 page
- [ ] Console.log easter egg
- [ ] Open Graph images per page
