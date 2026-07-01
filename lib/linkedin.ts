import { db } from './db';

interface LinkedInToken {
  access_token: string;
  expires_at: number;
  refresh_token?: string;
}

const TOKEN_KEY = 'linkedin_token';
const LI_VERSION = '202401';

function liHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'LinkedIn-Version': LI_VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
  };
}

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
  if (!res.ok) throw new Error(`LinkedIn profile fetch failed: ${res.status}`);
  const data = await res.json();
  return data.sub;
}

async function uploadImage(token: string, ownerUrn: string, imageUrl: string): Promise<string | null> {
  try {
    const initRes = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
      method: 'POST',
      headers: liHeaders(token),
      body: JSON.stringify({
        initializeUploadRequest: { owner: ownerUrn },
      }),
    });

    if (!initRes.ok) {
      const errText = await initRes.text();
      console.error(`LinkedIn image init failed [${initRes.status}]: ${errText}`);
      return null;
    }

    const initData = await initRes.json();
    const { uploadUrl, image: imageUrn } = initData.value;

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      console.error(`Failed to download image [${imgRes.status}]: ${imageUrl}`);
      return null;
    }
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imgBuffer,
    });

    if (!uploadRes.ok) {
      console.error(`LinkedIn image upload failed [${uploadRes.status}]`);
      return null;
    }

    return imageUrn;
  } catch (err) {
    console.error('LinkedIn image upload error:', err);
    return null;
  }
}

async function postViaPostsAPI(token: string, authorUrn: string, params: ShareParams, imageUrn: string | null): Promise<{ success: boolean; id?: string; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: Record<string, any> = {
    author: authorUrn,
    commentary: params.text,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  if (params.url) {
    body.content = {
      article: {
        source: params.url,
        ...(params.title && { title: params.title }),
        ...(params.description && { description: params.description }),
        ...(imageUrn && { thumbnail: imageUrn }),
      },
    };
  } else if (imageUrn) {
    body.content = {
      media: {
        ...(params.title && { title: params.title }),
        id: imageUrn,
      },
    };
  }

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: liHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`LinkedIn Posts API failed [${res.status}]: ${err}`);
    return { success: false, error: `Posts API [${res.status}]: ${err}` };
  }

  const postId = res.headers.get('x-restli-id');
  return { success: true, id: postId || undefined };
}

async function postViaUGC(token: string, authorUrn: string, params: ShareParams): Promise<{ success: boolean; id?: string; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    author: authorUrn,
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
            ...(params.description && { description: { text: params.description } }),
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
    console.error(`LinkedIn UGC API failed [${res.status}]: ${err}`);
    return { success: false, error: `UGC API [${res.status}]: ${err}` };
  }

  const result = await res.json();
  return { success: true, id: result.id };
}

interface ShareParams {
  text: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export async function shareToLinkedIn(params: ShareParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = await getLinkedInToken();
  if (!token) return { success: false, error: 'No valid LinkedIn token. Authorize first.' };

  const profileUrn = await getLinkedInProfileUrn(token);
  const authorUrn = `urn:li:person:${profileUrn}`;

  // Try image upload if image provided
  let imageUrn: string | null = null;
  if (params.imageUrl) {
    imageUrn = await uploadImage(token, authorUrn, params.imageUrl);
    if (!imageUrn) console.log('Image upload failed, will try posting without image');
  }

  // Try Posts API first (supports images)
  const postsResult = await postViaPostsAPI(token, authorUrn, params, imageUrn);
  if (postsResult.success) {
    console.log('Posted via Posts API:', postsResult.id);
    return postsResult;
  }

  // Fall back to UGC API (no image support, but reliable)
  console.log('Posts API failed, falling back to UGC API');
  const ugcResult = await postViaUGC(token, authorUrn, params);
  if (ugcResult.success) {
    console.log('Posted via UGC API:', ugcResult.id);
    return ugcResult;
  }

  return { success: false, error: `Both APIs failed. Posts: ${postsResult.error} | UGC: ${ugcResult.error}` };
}
