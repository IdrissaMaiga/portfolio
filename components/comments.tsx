"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  parentId: string | null;
  replies: Comment[];
}

function CommentForm({
  postSlug,
  parentId,
  onSubmit,
  onCancel,
  placeholder,
}: {
  postSlug: string;
  parentId?: string;
  onSubmit: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!session) {
    return (
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          Sign in to join the conversation
        </p>
        <button
          onClick={() => signIn("google")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postSlug, parentId }),
      });
      if (res.ok) {
        const newComment = await res.json();
        onSubmit(newComment);
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-start gap-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || ""}
            width={parentId ? 28 : 36}
            height={parentId ? 28 : 36}
            className="rounded-full mt-1"
          />
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder || "Write a comment..."}
            rows={parentId ? 2 : 3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Posting..." : parentId ? "Reply" : "Post Comment"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  postSlug,
  depth,
  onReplyAdded,
}: {
  comment: Comment;
  postSlug: string;
  depth: number;
  onReplyAdded: (parentId: string, reply: Comment) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 3;

  return (
    <div className={depth > 0 ? "ml-6 sm:ml-10 border-l-2 border-gray-100 dark:border-gray-800 pl-4" : ""}>
      <div className="flex gap-3">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name || ""}
            width={depth > 0 ? 28 : 36}
            height={depth > 0 ? 28 : 36}
            className={`rounded-full ${depth > 0 ? "h-7 w-7" : "h-9 w-9"}`}
          />
        ) : (
          <div className={`${depth > 0 ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"} rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium`}>
            {(comment.author.name || "?")[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {comment.author.name || "Anonymous"}
            </span>
            <time className="text-xs text-gray-400 shrink-0">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
            {comment.content}
          </p>
          {depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-1 text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-3 ml-6 sm:ml-10">
          <CommentForm
            postSlug={postSlug}
            parentId={comment.id}
            placeholder={`Reply to ${comment.author.name || "Anonymous"}...`}
            onSubmit={(reply) => {
              onReplyAdded(comment.id, reply);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postSlug={postSlug}
              depth={depth + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function countAllComments(comments: Comment[]): number {
  return comments.reduce(
    (sum, c) => sum + 1 + (c.replies ? countAllComments(c.replies) : 0),
    0
  );
}

export default function Comments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postSlug]);

  const addReplyToTree = (comments: Comment[], parentId: string, reply: Comment): Comment[] => {
    return comments.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies || []), reply] };
      }
      if (c.replies?.length) {
        return { ...c, replies: addReplyToTree(c.replies, parentId, reply) };
      }
      return c;
    });
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments((prev) => addReplyToTree(prev, parentId, reply));
  };

  const totalCount = countAllComments(comments);

  return (
    <section className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({totalCount})
      </h2>

      <div className="mb-8">
        <CommentForm
          postSlug={postSlug}
          onSubmit={(comment) => setComments((prev) => [comment, ...prev])}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postSlug={postSlug}
              depth={0}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </section>
  );
}
