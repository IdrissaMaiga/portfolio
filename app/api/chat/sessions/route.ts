import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await db.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { text: true, sender: true },
      },
    },
  });

  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      title: s.title,
      updatedAt: s.updatedAt,
      lastMessage: s.messages[0]?.text?.slice(0, 100) || null,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { title?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const chatSession = await db.chatSession.create({
    data: {
      userId,
      title: body.title || null,
    },
  });

  return NextResponse.json({ id: chatSession.id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const chatSession = await db.chatSession.findUnique({ where: { id } });
  if (!chatSession || chatSession.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.chatSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
