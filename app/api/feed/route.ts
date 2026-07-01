import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { Feed } from 'feed';
import { getAllPosts } from '@/lib/blog';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://idrissamaiga.iditechs.com';
  const posts = await getAllPosts();

  const feed = new Feed({
    title: 'Idrissa Maiga — Blog',
    description:
      'Technical blog posts about full-stack development, reverse engineering, AI integration, and building real-world projects.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/logos/id_og.jpg`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Idrissa Maiga`,
    author: {
      name: 'Idrissa Maiga',
      email: 'idrissa.maiga@iditechs.com',
      link: siteUrl,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}`,
      link: `${siteUrl}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.date),
      author: [
        {
          name: 'Idrissa Maiga',
          email: 'idrissa.maiga@iditechs.com',
          link: siteUrl,
        },
      ],
      ...(post.image && { image: post.image.startsWith("http") ? post.image : `${siteUrl}${post.image}` }),
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
