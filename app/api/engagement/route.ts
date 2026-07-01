import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get("slugs");
  if (!slugsParam) {
    return NextResponse.json({ error: "slugs parameter is required" }, { status: 400 });
  }

  const slugs = slugsParam.split(",").filter(Boolean).slice(0, 50);

  const [likeCounts, commentCounts] = await Promise.all([
    db.like.groupBy({
      by: ["postSlug"],
      where: { postSlug: { in: slugs } },
      _count: true,
    }),
    db.comment.groupBy({
      by: ["postSlug"],
      where: { postSlug: { in: slugs } },
      _count: true,
    }),
  ]);

  const result: Record<string, { likes: number; comments: number }> = {};
  for (const slug of slugs) {
    result[slug] = { likes: 0, comments: 0 };
  }
  for (const row of likeCounts) {
    if (result[row.postSlug]) result[row.postSlug].likes = row._count;
  }
  for (const row of commentCounts) {
    if (result[row.postSlug]) result[row.postSlug].comments = row._count;
  }

  return NextResponse.json(result);
}
