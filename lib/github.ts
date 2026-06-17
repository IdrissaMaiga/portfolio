export interface GitHubRepo {
  name: string;
  description: string | null;
  updatedAt: string;
  language: string | null;
  stars: number;
  url: string;
}

export interface GitHubActivity {
  recentRepos: GitHubRepo[];
  publicRepos: number;
  followers: number;
  totalStars: number;
}

export async function fetchGitHubActivity(): Promise<GitHubActivity> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    const [reposRes, userRes, allReposRes] = await Promise.all([
      fetch("https://api.github.com/user/repos?sort=pushed&per_page=5&type=public", {
        headers,
        next: { revalidate: 600 },
      }),
      fetch("https://api.github.com/user", {
        headers,
        next: { revalidate: 600 },
      }),
      fetch("https://api.github.com/user/repos?per_page=100&type=public", {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    const repos = reposRes.ok ? await reposRes.json() : [];
    const user = userRes.ok ? await userRes.json() : {};
    const allRepos = allReposRes.ok ? await allReposRes.json() : [];

    const totalStars = Array.isArray(allRepos)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? allRepos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
      : 0;

    return {
      recentRepos: Array.isArray(repos)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? repos.map((r: any) => ({
            name: r.name,
            description: r.description,
            updatedAt: r.pushed_at || r.updated_at,
            language: r.language,
            stars: r.stargazers_count,
            url: r.html_url,
          }))
        : [],
      publicRepos: user.public_repos || 0,
      followers: user.followers || 0,
      totalStars,
    };
  } catch (err) {
    console.error("GitHub API fetch failed:", err);
    return { recentRepos: [], publicRepos: 0, followers: 0, totalStars: 0 };
  }
}
