import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/blog';
import { shareToLinkedIn } from '@/lib/linkedin';

export async function POST(req: NextRequest) {
  // Auth check
  const apiKey = req.headers.get('x-admin-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse body
  let body: { slug: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { slug } = body;
  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  // Load the blog post
  const post = getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Format text for LinkedIn
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://idrissamaiga.iditechs.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Take first two sentences of the description
  const sentences = post.description.match(/[^.!?]+[.!?]+/g) || [post.description];
  const excerpt = sentences.slice(0, 2).join(' ').trim();

  // Build hashtags from tags
  const hashtags = post.tags
    .map((tag) => `#${tag.replace(/[^a-zA-Z0-9]/g, '')}`)
    .join(' ');

  const text = `${post.title}\n\n${excerpt}\n\nRead more: ${postUrl}\n\n${hashtags}`;

  // Share to LinkedIn
  const result = await shareToLinkedIn({
    text,
    title: post.title,
    url: postUrl,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, postId: result.id });
}
