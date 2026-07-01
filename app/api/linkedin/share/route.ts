import { NextRequest, NextResponse } from 'next/server';
import { shareToLinkedIn } from '@/lib/linkedin';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-admin-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { text, title, description, url, imageUrl } = body;

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const result = await shareToLinkedIn({ text, title, description, url, imageUrl });
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, postId: result.id });
}
