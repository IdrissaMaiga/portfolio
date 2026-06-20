"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { FiBell, FiCheck, FiMail } from "react-icons/fi";

export default function SubscribeForm({ variant = "full" }: { variant?: "inline" | "full" }) {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: session?.user?.email ? "{}" : JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      } else {
        setStatus("success");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  if (variant === "inline") {
    if (status === "success") {
      return (
        <span className="inline-flex items-center gap-1.5 text-green-400 text-sm">
          <FiCheck className="w-3.5 h-3.5" /> Subscribed
        </span>
      );
    }

    return (
      <button
        onClick={() => session?.user?.email ? handleSubscribe() : signIn("google")}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] disabled:opacity-50 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
      >
        <FiBell className="w-3.5 h-3.5 text-blue-400" />
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-green-400 text-sm">
        <FiCheck className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 text-gray-400 text-sm mb-4">
        <FiBell className="w-3.5 h-3.5 text-blue-400" />
        <span>Get new posts delivered to your inbox</span>
      </div>

      {session?.user?.email ? (
        <div className="flex justify-center">
          <button
            onClick={() => handleSubscribe()}
            disabled={status === "loading"}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] disabled:opacity-50 text-gray-200 rounded-lg text-sm transition-colors"
          >
            <FiMail className="w-3.5 h-3.5 text-blue-400" />
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}

      {!session && (
        <p className="text-gray-600 text-xs mt-2">
          Or{" "}
          <button onClick={() => signIn("google")} className="text-blue-400/70 hover:underline">
            sign in
          </button>{" "}
          to subscribe with one click.
        </p>
      )}
    </div>
  );
}
