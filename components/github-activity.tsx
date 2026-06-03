"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiStar, FiExternalLink } from "react-icons/fi";

interface GitHubRepo {
  name: string;
  description: string | null;
  updatedAt: string;
  language: string | null;
  stars: number;
  url: string;
}

interface GitHubActivity {
  recentRepos: GitHubRepo[];
  publicRepos: number;
  followers: number;
}

/* Language color mapping */
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
};

/* Relative time helper */
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  return `${diffMonth}mo ago`;
}

export default function GitHubActivityWidget() {
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/activity")
      .then((res) => res.json())
      .then((data) => {
        setActivity(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FiGithub className="w-5 h-5 text-gray-300" />
          <h3 className="text-sm font-semibold text-white font-display">
            Currently Building
          </h3>
        </div>
        {activity && (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{activity.publicRepos} repos</span>
            <span>{activity.followers} followers</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : activity && activity.recentRepos.length > 0 ? (
          <ul className="space-y-1">
            {activity.recentRepos.map((repo, i) => (
              <motion.li
                key={repo.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors duration-200"
                >
                  {/* Language dot */}
                  <span
                    className="mt-1.5 w-3 h-3 rounded-full flex-shrink-0 border border-white/10"
                    style={{
                      backgroundColor:
                        (repo.language && languageColors[repo.language]) ||
                        "#6b7280",
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-200 group-hover:text-blue-300 transition-colors truncate">
                        {repo.name}
                      </span>
                      <FiExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                    {repo.description && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {repo.description}
                      </p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0 mt-0.5">
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <FiStar className="w-3 h-3" />
                        {repo.stars}
                      </span>
                    )}
                    <span className="whitespace-nowrap">
                      {relativeTime(repo.updatedAt)}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            Unable to load GitHub activity.
          </p>
        )}
      </div>
    </motion.div>
  );
}
