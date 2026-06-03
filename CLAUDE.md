# Portfolio Platform — Idrissa Maiga

## Project
Next.js 14 portfolio with 3D (Three.js/R3F), AI chatbot (Gemini), blog (MDX), LinkedIn integration, Cloudflare R2 uploads, and MCP server.

## Key Info
- **Live**: https://idrissamaiga.iditechs.com
- **Email**: idrissa.maiga@iditechs.com
- **GitHub**: IdrissaMaiga/portfolio
- **Vercel team**: idrissamaigas-projects
- **R2 bucket**: portfolio-uploads
- **R2 public**: https://pub-5dbae7ae21f345449868f710152b690e.r2.dev

## Common Tasks

### Publish a blog post
1. Write MDX content
2. Generate cover image: `POST /api/admin/upload` with `{"action":"generate-image","prompt":"...","filename":"slug.png"}`
3. Create post: `POST /api/admin/blog` with title, content, tags, description, image URL
4. Share to LinkedIn: `POST /api/linkedin/share`
5. `git add -A && git commit && git push && npx vercel deploy --prod`

### Deploy
```bash
git add -A && git commit -m "msg" && git push origin main
VERCEL_TOKEN=$(grep 'VERCEL_TOKEN=' .env.local | cut -d'=' -f2 | tr -d '\r\n ')
npx vercel deploy --prod --token "$VERCEL_TOKEN" --scope idrissamaigas-projects --yes --no-wait
```

### Admin API auth
All admin routes require header: `x-admin-key: <ADMIN_API_KEY from .env.local>`

## Rules
- Never expose maigadrisking@gmail.com in user-facing code. Use idrissa.maiga@iditechs.com
- Dark theme only. No light mode toggle
- Blog posts should sound natural, not AI-generated. No em dashes
- All nav links use `/#section` format except Blog which is `/blog`
- Section IDs: home, story, projects, skills, insights, connect
- Git email must be maigadrisking@gmail.com (not the noreply one) or Vercel blocks deploys
