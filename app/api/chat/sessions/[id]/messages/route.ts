import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const chatSession = await db.chatSession.findUnique({ where: { id } });
  if (!chatSession || chatSession.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await db.chatMessage.findMany({
    where: { sessionId: id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      sender: true,
      text: true,
      createdAt: true,
    },
  });

  return NextResponse.json(messages);
}
