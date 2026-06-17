import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "maigadrisking@gmail.com";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email || email !== OWNER_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);
  const activeThreshold = new Date(now.getTime() - 15 * 60 * 1000);

  const [
    totalUsers,
    totalPageViews,
    todayViews,
    weekViews,
    monthViews,
    activeSessions,
    totalComments,
    totalLikes,
    totalChatSessions,
    totalChatMessages,
    recentUsers,
    topPages,
    todayTopPages,
    viewsByDay,
    topReferrers,
  ] = await Promise.all([
    db.user.count(),
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    db.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    db.pageView.count({ where: { createdAt: { gte: monthStart } } }),
    db.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: activeThreshold } },
    }).then((r) => r.length),
    db.comment.count(),
    db.like.count(),
    db.chatSession.count(),
    db.chatMessage.count(),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    }),
    db.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    db.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: todayStart } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    db.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM page_views
      WHERE created_at >= ${monthStart}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    ` as Promise<{ date: Date; count: number }[]>,
    db.pageView.groupBy({
      by: ["referrer"],
      where: { referrer: { not: null }, createdAt: { gte: monthStart } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    overview: {
      totalUsers,
      totalPageViews,
      activeSessions,
      todayViews,
      weekViews,
      monthViews,
    },
    engagement: {
      totalComments,
      totalLikes,
      totalChatSessions,
      totalChatMessages,
    },
    recentUsers,
    topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
    todayTopPages: todayTopPages.map((p) => ({ path: p.path, count: p._count.path })),
    viewsByDay: viewsByDay.map((d) => ({
      date: typeof d.date === "string" ? d.date : new Date(d.date).toISOString().split("T")[0],
      count: d.count,
    })),
    topReferrers: topReferrers
      .filter((r) => r.referrer)
      .map((r) => ({ referrer: r.referrer, count: r._count.referrer })),
  });
}
