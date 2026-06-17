# Portfolio Rebuild — Master Plan

## Design Direction

- **Color palette**: Dark navy #0F172A base, neon cyan #22D3EE primary, cool gray #64748B secondary, off-white #FAFAFA text
- **Typography**: Space Grotesk (headings), Inter (body) — already in place
- **Theme**: Dark-first, developer identity, cinematic 3D hero
- **Inspiration**: Bruno Simon (world-building), Brittany Chiang (clean minimalism), Samsy (WebGPU performance)
- **Philosophy**: One signature 3D moment > 20 scattered effects

## Architecture

### Phase 1: 3D Hero & Core Design (IN PROGRESS)
- [x] Interactive particle sphere with mouse reactivity
- [x] Orbital ring, floating wireframe shapes, star field
- [x] Dynamic point light following cursor
- [x] Glass morphism text overlay with gradient typography
- [x] Terminal-style typing animation
- [x] Wave transition to next section
- [ ] Add `prefers-reduced-motion` fallback (static gradient hero)
- [ ] Performance tuning: reduce particles on mobile, cap DPR
- [ ] Add PerformanceMonitor from drei for dynamic quality

### Phase 2: SEO & Meta Foundation
- [ ] JSON-LD Person schema in layout.tsx
- [ ] Open Graph tags (og:title, og:description, og:image per page)
- [ ] Twitter Card meta tags
- [ ] Sitemap generation (next-sitemap)
- [ ] robots.txt
- [ ] Canonical URLs

### Phase 3: Content Overhaul
- [ ] Fix education dates (Sep 2023, not Sep 2022)
- [ ] Rewrite bio to be accurate and compelling
- [ ] Add horizoneurope.io / Projexel connection to experience
- [ ] Update project data with accurate GitHub links
- [ ] Add INDUSAC / EISMEA project prominently
- [ ] Add quantified metrics to all projects

### Phase 4: Project Case Studies
- [ ] Convert project cards to full case study format
- [ ] Each case study: Problem → Approach → Implementation → Results
- [ ] Quantified impact metrics for each project
- [ ] Architecture diagrams or code highlights
- [ ] Live demo links where available
- [ ] Dynamic project pages (not just a single section)

### Phase 5: AI Agent Upgrade
- [ ] Upgrade from basic Groq chat to RAG-based assistant
- [ ] Embed resume, projects, skills, education as vector chunks
- [ ] System prompt constrains to portfolio-relevant topics
- [ ] Streaming responses
- [ ] Suggested questions for visitors
- [ ] Agent can "navigate" visitor to relevant sections

### Phase 6: Blog / Content System
- [ ] MDX-powered blog with syntax highlighting
- [ ] BlogPosting JSON-LD schema per article
- [ ] Categories/tags
- [ ] "How I Built This" series for showcase projects
- [ ] Cross-post strategy to dev.to/Hashnode

### Phase 7: Dynamic GitHub Integration
- [ ] Pull latest repos via GitHub API
- [ ] Contribution graph / activity stats
- [ ] "Currently Working On" auto-updating section
- [ ] GitHub stats cards

### Phase 8: Polish & Accessibility
- [ ] WCAG AA contrast ratios throughout
- [ ] Keyboard navigation for all interactive elements
- [ ] Skip-to-content link
- [ ] Semantic HTML (proper heading hierarchy, landmarks)
- [ ] ARIA labels for 3D/decorative elements
- [ ] Static fallback for 3D scene (screen readers, no WebGL)
- [ ] Lighthouse targets: Performance > 90, Accessibility > 95, SEO > 95
- [ ] Custom 404 page
- [ ] Console.log easter egg for devs who inspect

### Phase 9: Deployment & Domain
- [ ] Redeploy to Vercel (site is currently DOWN)
- [ ] Verify idrissamaiga.info domain connection
- [ ] Set up Vercel Analytics
- [ ] Configure Cloudflare for CDN/security

## Sections Structure (Final Site)

1. **Hero** — 3D particle scene, name, typing roles, CTA buttons
2. **About** — Personal story (Mali → USA → Budapest), tabs for background/education/experience
3. **Projects** — Case study cards with expandable detail views
4. **Skills** — Interactive visualization, categorized by domain
5. **Experience Timeline** — Visual career journey with company logos
6. **Blog** — Technical articles, project deep-dives
7. **Testimonials** — Social proof, metrics counters
8. **Contact** — Form, email, phone, social links, availability status
9. **Footer** — Links, copyright, social icons

## Repo Health Fixes (for GitHub agent)

- Remove `.env` from Langchain and FilmuAppServer repos
- Remove `node_modules/` from Excel-Node-Js
- Clean Android build artifacts from Android-Filmu-ReactNative-MongoDb
- Archive skeleton repos (Kalanso-WebUI, Kalanso-API, buildx-voovo)

## Key Metrics to Display on Site

- 28+ open source projects
- 530+ commits across repos
- 10+ technologies mastered
- 5,000+ users served (horizoneurope.io)
- 1,100+ API endpoints reverse-engineered (neptun-api)
- HackerOne security disclosure (#3642470)
- 8.7/10 GPA at Óbuda University
- Kennedy Lugar YES Program Scholar
