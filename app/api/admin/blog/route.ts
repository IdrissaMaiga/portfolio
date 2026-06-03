import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    description: p.description,
    linkedinPosted: p.linkedinPosted,
  }));

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, tags, description, image, slug: customSlug } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const slug = customSlug || title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const date = new Date().toISOString().split("T")[0];
  const tagList = Array.isArray(tags) ? tags : [];

  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `tags: [${tagList.map((t: string) => `"${t}"`).join(", ")}]`,
    `description: "${(description || "").replace(/"/g, '\\"')}"`,
    `image: "${image || "/logos/skills.png"}"`,
    `linkedinPosted: false`,
    "---",
    "",
  ].join("\n");

  const mdxContent = frontmatter + content;

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Post with slug "${slug}" already exists` }, { status: 409 });
  }

  fs.writeFileSync(filePath, mdxContent, "utf-8");

  return NextResponse.json({
    success: true,
    slug,
    url: `/blog/${slug}`,
    message: `Blog post "${title}" created successfully`,
  });
}

export async function PUT(req: NextRequest) {
  const apiKey = req.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, title, content, tags, description, image } = body;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Post "${slug}" not found` }, { status: 404 });
  }

  const existing = fs.readFileSync(filePath, "utf-8");
  const frontmatterMatch = existing.match(/^---\n([\s\S]*?)\n---\n/);
  const existingContent = existing.replace(/^---\n[\s\S]*?\n---\n/, "");

  const date = frontmatterMatch?.toString().match(/date: "(.*)"/)?.[1] || new Date().toISOString().split("T")[0];
  const linkedinPosted = frontmatterMatch?.toString().includes("linkedinPosted: true") || false;

  const tagList = tags || [];
  const frontmatter = [
    "---",
    `title: "${(title || "").replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `tags: [${tagList.map((t: string) => `"${t}"`).join(", ")}]`,
    `description: "${(description || "").replace(/"/g, '\\"')}"`,
    `image: "${image || "/logos/skills.png"}"`,
    `linkedinPosted: ${linkedinPosted}`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(filePath, frontmatter + (content || existingContent), "utf-8");

  return NextResponse.json({ success: true, slug, message: `Post "${slug}" updated` });
}

export async function DELETE(req: NextRequest) {
  const apiKey = req.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: `Post "${slug}" not found` }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true, message: `Post "${slug}" deleted` });
}
