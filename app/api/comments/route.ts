import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const authorSelect = { id: true, name: true, image: true };

export async function GET(req: NextRequest) {
  const postSlug = req.nextUrl.searchParams.get("postSlug");
  if (!postSlug) {
    return NextResponse.json(
      { error: "postSlug is required" },
      { status: 400 }
    );
  }

  const comments = await db.comment.findMany({
    where: { postSlug, parentId: null },
    include: {
      author: { select: authorSelect },
      replies: {
        include: {
          author: { select: authorSelect },
          replies: {
            include: {
              author: { select: authorSelect },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, postSlug, parentId } = await req.json();
  if (!content?.trim() || !postSlug) {
    return NextResponse.json(
      { error: "content and postSlug are required" },
      { status: 400 }
    );
  }

  if (parentId) {
    const parent = await db.comment.findUnique({
      where: { id: parentId },
    });
    if (!parent || parent.postSlug !== postSlug) {
      return NextResponse.json(
        { error: "Invalid parent comment" },
        { status: 400 }
      );
    }
  }

  const comment = await db.comment.create({
    data: {
      content: content.trim(),
      postSlug,
      authorId: (session.user as { id: string }).id,
      parentId: parentId || null,
    },
    include: {
      author: { select: authorSelect },
      replies: {
        include: { author: { select: authorSelect } },
      },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
