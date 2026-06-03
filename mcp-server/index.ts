import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "lib", "data", "portfolio-data.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data: any) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

const server = new McpServer({
  name: "portfolio",
  version: "1.0.0",
});

// Tool: Get portfolio info
server.tool("get_portfolio_info", "Get personal info, experience, education, and skills summary", {}, async () => {
  const data = readData();
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        personal: data.personal,
        experience: data.experience,
        education: data.education,
        certifications: data.certifications,
      }, null, 2),
    }],
  };
});

// Tool: List projects
server.tool("list_projects", "List all portfolio projects", {}, async () => {
  const data = readData();
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data.projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        shortDesc: p.shortDesc,
        techStack: p.techStack,
        githubLink: p.githubLink,
        liveLink: p.liveLink,
      })), null, 2),
    }],
  };
});

// Tool: Get project details
server.tool("get_project", "Get full details of a specific project", { id: z.string().describe("Project ID") }, async ({ id }) => {
  const data = readData();
  const project = data.projects.find((p: any) => p.id === id);
  if (!project) return { content: [{ type: "text", text: "Project not found" }] };
  return { content: [{ type: "text", text: JSON.stringify(project, null, 2) }] };
});

// Tool: Add project
server.tool("add_project", "Add a new project to the portfolio", {
  id: z.string(),
  title: z.string(),
  shortDesc: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  features: z.array(z.string()),
  challenges: z.array(z.string()),
  solution: z.string(),
  image: z.string().default("/logos/skills.png"),
  githubLink: z.string().nullable().default(null),
  liveLink: z.string().nullable().default(null),
}, async (params) => {
  const data = readData();
  data.projects.push({ ...params, additionalImages: [] });
  writeData(data);
  return { content: [{ type: "text", text: `Project "${params.title}" added successfully.` }] };
});

// Tool: Update project
server.tool("update_project", "Update an existing project's fields", {
  id: z.string().describe("Project ID to update"),
  fields: z.record(z.string(), z.any()).describe("Fields to update (title, shortDesc, description, techStack, etc.)"),
}, async ({ id, fields }) => {
  const data = readData();
  const idx = data.projects.findIndex((p: any) => p.id === id);
  if (idx === -1) return { content: [{ type: "text", text: "Project not found" }] };
  data.projects[idx] = { ...data.projects[idx], ...fields };
  writeData(data);
  return { content: [{ type: "text", text: `Project "${id}" updated.` }] };
});

// Tool: Update experience
server.tool("update_experience", "Add or update an experience entry", {
  id: z.string(),
  title: z.string(),
  company: z.string(),
  dates: z.string(),
  location: z.string(),
  description: z.string(),
  current: z.boolean().default(false),
}, async (params) => {
  const data = readData();
  const idx = data.experience.findIndex((e: any) => e.id === params.id);
  if (idx >= 0) {
    data.experience[idx] = params;
  } else {
    data.experience.unshift(params);
  }
  writeData(data);
  return { content: [{ type: "text", text: `Experience "${params.title}" at ${params.company} saved.` }] };
});

// Tool: Update skill level
server.tool("update_skill", "Update a skill's proficiency level", {
  categoryId: z.string().describe("Skill category ID (languages, backend, frontend, database, cloud, ai)"),
  skillName: z.string(),
  level: z.number().min(0).max(100),
}, async ({ categoryId, skillName, level }) => {
  const data = readData();
  const cat = data.skillCategories.find((c: any) => c.id === categoryId);
  if (!cat) return { content: [{ type: "text", text: "Category not found" }] };
  const skill = cat.skills.find((s: any) => s.name === skillName);
  if (skill) {
    skill.level = level;
  } else {
    cat.skills.push({ name: skillName, level });
  }
  writeData(data);
  return { content: [{ type: "text", text: `Skill "${skillName}" in ${categoryId} set to ${level}%.` }] };
});

// Tool: Share to LinkedIn
server.tool("linkedin_share", "Post content to LinkedIn", {
  text: z.string().describe("The post text content"),
  title: z.string().optional().describe("Article title (optional)"),
  url: z.string().optional().describe("Article URL (optional)"),
}, async ({ text, title, url }) => {
  const baseUrl = process.env.NODE_ENV === "production"
    ? (process.env.SITE_URL_PROD || "https://idrissamaiga.iditechs.com")
    : (process.env.SITE_URL_DEV || "http://localhost:3000");
  const adminKey = process.env.ADMIN_API_KEY;
  const res = await fetch(`${baseUrl}/api/linkedin/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey || "",
    },
    body: JSON.stringify({ text, title, url }),
  });
  const result = await res.json();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// Tool: Create blog post
server.tool("create_blog_post", "Create a new blog post on the portfolio", {
  title: z.string().describe("Blog post title"),
  content: z.string().describe("MDX content (markdown with optional JSX)"),
  tags: z.array(z.string()).describe("Array of tags"),
  description: z.string().describe("Short description for SEO"),
  image: z.string().optional().describe("Cover image path (default: /logos/skills.png)"),
  slug: z.string().optional().describe("Custom URL slug (auto-generated from title if not provided)"),
}, async ({ title, content, tags, description, image, slug }) => {
  const baseUrl = process.env.NODE_ENV === "production"
    ? (process.env.SITE_URL_PROD || "https://idrissamaiga.iditechs.com")
    : (process.env.SITE_URL_DEV || "http://localhost:3000");
  const adminKey = process.env.ADMIN_API_KEY;
  const res = await fetch(`${baseUrl}/api/admin/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey || "" },
    body: JSON.stringify({ title, content, tags, description, image, slug }),
  });
  const result = await res.json();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// Tool: List blog posts
server.tool("list_blog_posts", "List all blog posts", {}, async () => {
  const baseUrl = process.env.NODE_ENV === "production"
    ? (process.env.SITE_URL_PROD || "https://idrissamaiga.iditechs.com")
    : (process.env.SITE_URL_DEV || "http://localhost:3000");
  const adminKey = process.env.ADMIN_API_KEY;
  const res = await fetch(`${baseUrl}/api/admin/blog`, {
    headers: { "x-admin-key": adminKey || "" },
  });
  const result = await res.json();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// Tool: Delete blog post
server.tool("delete_blog_post", "Delete a blog post by slug", {
  slug: z.string().describe("The post slug to delete"),
}, async ({ slug }) => {
  const baseUrl = process.env.NODE_ENV === "production"
    ? (process.env.SITE_URL_PROD || "https://idrissamaiga.iditechs.com")
    : (process.env.SITE_URL_DEV || "http://localhost:3000");
  const adminKey = process.env.ADMIN_API_KEY;
  const res = await fetch(`${baseUrl}/api/admin/blog`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey || "" },
    body: JSON.stringify({ slug }),
  });
  const result = await res.json();
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// Tool: Trigger rebuild
server.tool("trigger_rebuild", "Trigger a Vercel redeployment", {}, async () => {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!hookUrl) return { content: [{ type: "text", text: "VERCEL_DEPLOY_HOOK not configured" }] };
  const res = await fetch(hookUrl, { method: "POST" });
  const result = await res.json();
  return { content: [{ type: "text", text: `Rebuild triggered: ${JSON.stringify(result)}` }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
