# Portfolio Platform Skill

Manage Idrissa Maiga's portfolio platform at D:\Projects\Idrissamaigainfo. This skill automates blog publishing, LinkedIn sharing, image generation, deployment, and content management.

## When to use
- User says "publish", "post", "blog", "write", "article"
- User says "share to linkedin", "post on linkedin"
- User says "deploy", "push", "ship"
- User says "generate image", "cover image"
- User says "update project", "add project"
- User says "check site", "site status"

## Configuration

- **Site URL (prod)**: https://idrissamaiga.iditechs.com
- **Site URL (dev)**: http://localhost:3000
- **Admin API key**: Read from `D:\Projects\Idrissamaigainfo\.env.local` line `ADMIN_API_KEY=`
- **Blog posts dir**: `D:\Projects\Idrissamaigainfo\content\blog/`
- **R2 public URL**: https://pub-5dbae7ae21f345449868f710152b690e.r2.dev

## Commands

### /publish — Create and publish a blog post

Full automated flow:

1. Ask the user for topic (or take it from args)
2. Generate the blog post content (MDX format)
3. Generate a cover image using Gemini Imagen via the upload API
4. Create the blog post via the admin API with the R2 image URL
5. Optionally share to LinkedIn
6. Commit, push, and deploy to Vercel

**Steps:**

```bash
# Step 1: Read admin key
ADMIN_KEY=$(grep 'ADMIN_API_KEY=' D:/Projects/Idrissamaigainfo/.env.local | cut -d'=' -f2 | tr -d '\r\n ')
BASE_URL="http://localhost:3000"  # or https://idrissamaiga.iditechs.com for prod

# Step 2: Generate cover image
curl -s -X POST "$BASE_URL/api/admin/upload" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{"action":"generate-image","prompt":"YOUR PROMPT HERE","filename":"YOUR-SLUG.png"}'
# Returns: {"url":"https://pub-xxx.r2.dev/blog/YOUR-SLUG.png"}

# Step 3: Create blog post
curl -s -X POST "$BASE_URL/api/admin/blog" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{
    "title": "Post Title",
    "content": "## Heading\n\nContent here in MDX...",
    "tags": ["tag1", "tag2"],
    "description": "Short description for SEO",
    "image": "https://pub-xxx.r2.dev/blog/YOUR-SLUG.png"
  }'

# Step 4: Share to LinkedIn (optional)
curl -s -X POST "$BASE_URL/api/linkedin/share" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{
    "text": "Post summary for LinkedIn...\n\nRead more: https://idrissamaiga.iditechs.com/blog/YOUR-SLUG\n\n#hashtags",
    "title": "Post Title",
    "url": "https://idrissamaiga.iditechs.com/blog/YOUR-SLUG"
  }'

# Step 5: Commit, push, deploy
cd D:\Projects\Idrissamaigainfo
git add -A
git commit -m "New post: Post Title"
git push origin main
VERCEL_TOKEN=$(grep 'VERCEL_TOKEN=' .env.local | cut -d'=' -f2 | tr -d '\r\n ')
npx vercel deploy --prod --token "$VERCEL_TOKEN" --scope idrissamaigas-projects --yes --no-wait
```

### /deploy — Deploy to Vercel

```bash
cd D:\Projects\Idrissamaigainfo
git add -A
git commit -m "Deploy update"
git push origin main
VERCEL_TOKEN=$(grep 'VERCEL_TOKEN=' .env.local | cut -d'=' -f2 | tr -d '\r\n ')
npx vercel deploy --prod --token "$VERCEL_TOKEN" --scope idrissamaigas-projects --yes --no-wait
```

### /status — Check site health

```bash
BASE_URL="https://idrissamaiga.iditechs.com"
echo "Home: $(curl -s -o /dev/null -w '%{http_code}' $BASE_URL)"
echo "Blog: $(curl -s -o /dev/null -w '%{http_code}' $BASE_URL/blog)"
echo "AI: $(curl -s -o /dev/null -w '%{http_code}' -X POST $BASE_URL/api/ai -H 'Content-Type:application/json' -d '{"userCommand":"hi"}')"
echo "GitHub: $(curl -s -o /dev/null -w '%{http_code}' $BASE_URL/api/github/activity)"
```

### /linkedin — Share content to LinkedIn

```bash
ADMIN_KEY=$(grep 'ADMIN_API_KEY=' D:/Projects/Idrissamaigainfo/.env.local | cut -d'=' -f2 | tr -d '\r\n ')
curl -s -X POST "https://idrissamaiga.iditechs.com/api/linkedin/share" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{"text":"YOUR TEXT","title":"OPTIONAL TITLE","url":"OPTIONAL URL"}'
```

### /generate-image — Generate an image with Gemini and upload to R2

```bash
ADMIN_KEY=$(grep 'ADMIN_API_KEY=' D:/Projects/Idrissamaigainfo/.env.local | cut -d'=' -f2 | tr -d '\r\n ')
curl -s -X POST "http://localhost:3000/api/admin/upload" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{"action":"generate-image","prompt":"YOUR PROMPT","filename":"output.png"}'
```

## Blog Post Guidelines

When writing blog posts:
- Write in first person, natural developer voice
- No AI-sounding em dashes or filler
- Use practical examples from real projects
- Include code snippets where relevant
- Keep paragraphs short (2-3 sentences)
- No "study notes" or "course material" disclaimers
- Tags should be lowercase, relevant tech terms

## API Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/admin/blog | x-admin-key | List all posts |
| POST | /api/admin/blog | x-admin-key | Create a post |
| PUT | /api/admin/blog | x-admin-key | Update a post |
| DELETE | /api/admin/blog | x-admin-key | Delete a post |
| POST | /api/admin/upload | x-admin-key | Upload file or generate image |
| POST | /api/linkedin/share | x-admin-key | Share to LinkedIn |
| POST | /api/admin/publish-to-linkedin | x-admin-key | Share a blog post to LinkedIn by slug |
| GET | /api/github/activity | none | GitHub repo activity |
| GET | /api/blog/recent | none | Recent blog posts |
| GET | /api/feed | none | RSS feed |
| POST | /api/ai | none | AI chat |
| POST | /api/contact | none | Contact form |

## Project Structure

```
D:\Projects\Idrissamaigainfo\
├── app/                    # Next.js pages and API routes
│   ├── api/admin/          # Protected admin APIs
│   ├── api/linkedin/       # LinkedIn OAuth + share
│   ├── blog/               # Blog pages
│   └── page.tsx            # Homepage
├── components/             # React components (31)
│   ├── 3d/                 # Three.js 3D components (5)
│   ├── skills/             # Bento grid skills (7)
│   └── blog/               # Blog components (3)
├── content/blog/           # MDX blog posts
├── lib/                    # Utilities (blog, github, linkedin, r2, data)
├── mcp-server/             # MCP server for Claude Code (12 tools)
├── public/logos/           # Images
└── .env.local              # All secrets
```
