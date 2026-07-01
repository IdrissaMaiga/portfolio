"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { FiMessageCircle } from "react-icons/fi";

export default function PostEngagementHeader({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/likes?postSlug=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        setLikeCount(data.count);
        setLiked(data.liked);
      })
      .catch(() => {});

    fetch(`/api/engagement?slugs=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (data[slug]) setCommentCount(data[slug].comments);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [slug]);

  const handleLike = async () => {
    if (!session) { signIn("google"); return; }
    if (loading) return;
    setLoading(true);
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug: slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.count);
      } else {
        setLiked(prev => !prev);
        setLikeCount(prev => liked ? prev + 1 : prev - 1);
      }
    } catch {
      setLiked(prev => !prev);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setLoading(false);
    }
  };

  const scrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/[0.06]">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
          liked
            ? "bg-red-500/15 border-red-500/30 text-red-400"
            : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-400"
        }`}
      >
        <svg
          className={`w-5 h-5 transition-transform ${loading ? "scale-90" : ""}`}
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={liked ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likeCount > 0 ? likeCount : "Like"}
      </button>

      <button
        onClick={scrollToComments}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/30 hover:text-blue-400 transition-all text-sm font-medium"
      >
        <FiMessageCircle className="w-5 h-5" />
        {commentCount > 0 ? `${commentCount} Comments` : "Comment"}
      </button>
    </div>
  );
}
