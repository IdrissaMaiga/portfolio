import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { components } from "@/components/blog/mdx-components";
import BlogHeader from "@/components/blog/blog-header";
import { FiArrowLeft } from "react-icons/fi";

interface PageProps {
  params: { slug: string };
}

/* ---------- Static params for SSG ---------- */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/* ---------- Dynamic metadata ---------- */
export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Idrissa Maiga`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Idrissa Maiga"],
      tags: post.tags,
      ...(post.image && { images: [{ url: post.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/* ---------- Page ---------- */
export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-600/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-24 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 mb-8 group"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to blog
          </Link>

          {/* Post header */}
          <BlogHeader post={post} />

          {/* MDX content */}
          <article className="prose-invert max-w-none">
            <MDXRemote source={post.content} components={components} />
          </article>

          {/* Bottom back link */}
          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
