import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    description: post.description,
    image: post.image,
    readingTime: post.readingTime,
  }));

  return NextResponse.json({ posts: recent });
}
