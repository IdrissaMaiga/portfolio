import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost, updatePost, deletePost } from "@/lib/blog";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-key") === process.env.ADMIN_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPosts();
  return NextResponse.json({
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      description: p.description,
      image: p.image,
      linkedinPosted: p.linkedinPosted,
    })),
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, tags, description, image, slug } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  try {
    const result = await createPost({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      description: description || "",
      image: image || "",
      slug,
    });

    return NextResponse.json({
      success: true,
      slug: result.slug,
      url: `/blog/${result.slug}`,
      message: `Blog post "${title}" created successfully`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create post";
    return NextResponse.json({ error: msg }, { status: 409 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, ...updates } = body;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    await updatePost(slug, updates);
    return NextResponse.json({ success: true, slug, message: `Post "${slug}" updated` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update post";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    await deletePost(slug);
    return NextResponse.json({ success: true, message: `Post "${slug}" deleted` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete post";
    return NextResponse.json({ error: msg }, { status: 404 });
  }
}
