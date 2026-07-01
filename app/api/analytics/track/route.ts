import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, referrer, sessionId } = body;

    if (!path || typeof path !== "string" || !sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let userId: string | null = null;
    try {
      const session = await getServerSession(authOptions);
      userId = (session?.user as { id?: string })?.id || null;
    } catch {}

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || null;

    await db.pageView.create({
      data: {
        path: path.slice(0, 500),
        referrer: referrer?.slice(0, 1000) || null,
        userId,
        sessionId: sessionId.slice(0, 100),
        ip,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
