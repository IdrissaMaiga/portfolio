"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { FiBell, FiCheck, FiMail } from "react-icons/fi";

export default function SubscribeForm() {
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

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-4">
          <FiCheck className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-white font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <FiBell className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Stay in the loop</h3>
      </div>
      <p className="text-gray-400 text-sm mb-5">
        Get notified when I publish new posts. No spam, unsubscribe anytime.
      </p>

      {session?.user?.email ? (
        <button
          onClick={() => handleSubscribe()}
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
        >
          <FiMail className="w-4 h-4" />
          {status === "loading" ? "Subscribing..." : `Subscribe as ${session.user.email}`}
        </button>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">{message}</p>
      )}

      {!session && (
        <p className="text-gray-500 text-xs mt-3">
          Or{" "}
          <button onClick={() => signIn("google")} className="text-blue-400 hover:underline">
            sign in with Google
          </button>{" "}
          to subscribe with one click.
        </p>
      )}
    </div>
  );
}
