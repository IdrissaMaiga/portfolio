import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import Comments from "@/components/comments";
import LikeButton from "@/components/like-button";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Idrissa Maiga`,
    description: post.description,
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-16">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Link
          href="/blog"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          &larr; Back to blog
        </Link>

        <header className="mt-6 mb-8">
          <time className="text-sm text-gray-400 dark:text-gray-500">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <LikeButton postSlug={post.slug} />
        </div>

        <Comments postSlug={post.slug} />
      </article>
    </main>
  );
}
