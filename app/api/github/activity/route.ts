import { NextResponse } from 'next/server';
import { fetchGitHubActivity } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activity = await fetchGitHubActivity();
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json({ recentRepos: [], publicRepos: 0, followers: 0 });
  }
}
