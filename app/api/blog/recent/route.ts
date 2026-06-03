import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      tags: post.tags,
      description: post.description,
      image: post.image,
      readingTime: post.readingTime,
    }));

  return NextResponse.json({ posts });
}
