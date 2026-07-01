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

  let body: { postSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { postSlug } = body;
  if (!postSlug) {
    return NextResponse.json(
      { error: "postSlug is required" },
      { status: 400 }
    );
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { postSlug_userId: { postSlug, userId } },
      });

      if (existing) {
        await tx.like.delete({ where: { id: existing.id } });
        const count = await tx.like.count({ where: { postSlug } });
        return { count, liked: false };
      }

      await tx.like.create({ data: { postSlug, userId } });
      const count = await tx.like.count({ where: { postSlug } });
      return { count, liked: true };
    });

    return NextResponse.json(result, { status: result.liked ? 201 : 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
