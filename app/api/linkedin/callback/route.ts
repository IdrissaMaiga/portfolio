import { NextRequest, NextResponse } from 'next/server';
import { saveLinkedInToken } from '@/lib/linkedin';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const storedState = req.cookies.get('linkedin_state')?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.json({ error: 'Invalid OAuth callback' }, { status: 400 });
  }

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: (process.env.NODE_ENV === 'production'
        ? process.env.LINKEDIN_REDIRECT_URI_PROD
        : process.env.LINKEDIN_REDIRECT_URI_DEV) || '',
      client_id: process.env.LINKEDIN_CLIENT_ID || '',
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return NextResponse.json({ error: 'Token exchange failed', details: err }, { status: 500 });
  }

  const tokenData = await tokenRes.json();
  saveLinkedInToken(tokenData.access_token, tokenData.expires_in, tokenData.refresh_token);

  return NextResponse.json({ success: true, message: 'LinkedIn connected successfully' });
}
