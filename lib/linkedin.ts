import { db } from './db';

interface LinkedInToken {
  access_token: string;
  expires_at: number;
  refresh_token?: string;
}

const TOKEN_KEY = 'linkedin_token';

export async function getLinkedInToken(): Promise<string | null> {
  try {
    const setting = await db.appSetting.findUnique({ where: { key: TOKEN_KEY } });
    if (!setting) return null;
    const data: LinkedInToken = JSON.parse(setting.value);
    if (Date.now() > data.expires_at) return null;
    return data.access_token;
  } catch {
    return null;
  }
}

export async function saveLinkedInToken(access_token: string, expires_in: number, refresh_token?: string) {
  const data: LinkedInToken = {
    access_token,
    expires_at: Date.now() + expires_in * 1000,
    refresh_token,
  };
  await db.appSetting.upsert({
    where: { key: TOKEN_KEY },
    update: { value: JSON.stringify(data) },
    create: { key: TOKEN_KEY, value: JSON.stringify(data) },
  });
}

export async function getLinkedInProfileUrn(token: string): Promise<string> {
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.sub;
}

export async function shareToLinkedIn(params: {
  text: string;
  title?: string;
  url?: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = await getLinkedInToken();
  if (!token) return { success: false, error: 'No valid LinkedIn token. Authorize first.' };

  const profileUrn = await getLinkedInProfileUrn(token);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    author: `urn:li:person:${profileUrn}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: params.text },
        shareMediaCategory: params.url ? 'ARTICLE' : 'NONE',
        ...(params.url && {
          media: [{
            status: 'READY',
            originalUrl: params.url,
            ...(params.title && { title: { text: params.title } }),
          }],
        }),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  const result = await res.json();
  return { success: true, id: result.id };
}
