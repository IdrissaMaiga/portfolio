"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function LikeButton({ postSlug }: { postSlug: string }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?postSlug=${encodeURIComponent(postSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setLiked(data.liked);
      });
  }, [postSlug]);

  const handleLike = async () => {
    if (!session) {
      signIn("google");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
        liked
          ? "bg-red-500/15 border-red-500/30 text-red-400"
          : "bg-white/5 border-white/10 text-gray-400 hover:border-red-500/30"
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
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
