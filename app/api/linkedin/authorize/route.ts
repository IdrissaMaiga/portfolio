import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  // Store state in a cookie for CSRF validation
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    redirect_uri: (process.env.NODE_ENV === 'production'
      ? process.env.LINKEDIN_REDIRECT_URI_PROD
      : process.env.LINKEDIN_REDIRECT_URI_DEV) || '',
    state,
    scope: 'openid profile w_member_social',
  });

  const response = NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
  response.cookies.set('linkedin_state', state, { httpOnly: true, maxAge: 600, sameSite: 'lax' });
  return response;
}
