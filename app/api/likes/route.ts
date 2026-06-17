import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const postSlug = req.nextUrl.searchParams.get("postSlug");
  if (!postSlug) {
    return NextResponse.json(
      { error: "postSlug is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  const [count, userLiked] = await Promise.all([
    db.like.count({ where: { postSlug } }),
    userId
      ? db.like.findUnique({
          where: { postSlug_userId: { postSlug, userId } },
        })
      : null,
  ]);

  return NextResponse.json({ count, liked: !!userLiked });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postSlug } = await req.json();
  if (!postSlug) {
    return NextResponse.json(
      { error: "postSlug is required" },
      { status: 400 }
    );
  }

  const existing = await db.like.findUnique({
    where: { postSlug_userId: { postSlug, userId } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
    const count = await db.like.count({ where: { postSlug } });
    return NextResponse.json({ count, liked: false });
  }

  await db.like.create({ data: { postSlug, userId } });
  const count = await db.like.count({ where: { postSlug } });
  return NextResponse.json({ count, liked: true }, { status: 201 });
}
