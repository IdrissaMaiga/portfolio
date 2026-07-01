import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const MAX_COMMENT_LENGTH = 5000;
const MAX_NESTING_DEPTH = 3;

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

  let body: { content?: string; postSlug?: string; parentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, postSlug, parentId } = body;
  if (!content?.trim() || !postSlug) {
    return NextResponse.json(
      { error: "content and postSlug are required" },
      { status: 400 }
    );
  }

  if (content.trim().length > MAX_COMMENT_LENGTH) {
    return NextResponse.json(
      { error: `Comment must be under ${MAX_COMMENT_LENGTH} characters` },
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

    // Enforce max nesting depth by walking up the parent chain
    let depth = 1;
    let currentParentId: string | null = parent.parentId;
    while (currentParentId) {
      depth++;
      if (depth >= MAX_NESTING_DEPTH) {
        return NextResponse.json(
          { error: "Maximum reply depth reached" },
          { status: 400 }
        );
      }
      const ancestor = await db.comment.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });
      currentParentId = ancestor?.parentId ?? null;
    }
  }

  try {
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
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
