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
  const activeNow = new Date(now.getTime() - 2 * 60 * 1000);

  const [
    totalUsers,
    totalSubscribers,
    totalPageViews,
    todayViews,
    weekViews,
    monthViews,
    activeVisitors,
    uniqueVisitorsToday,
    uniqueVisitorsWeek,
    uniqueVisitorsMonth,
    uniqueVisitorsAllTime,
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
    db.subscriber.count({ where: { verified: true } }),
    db.pageView.count(),
    db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    db.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    db.pageView.count({ where: { createdAt: { gte: monthStart } } }),
    db.pageView.findMany({
      where: { createdAt: { gte: activeNow } },
      select: { ip: true, sessionId: true, path: true, userId: true },
      orderBy: { createdAt: "desc" },
    }),
    db.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: todayStart } },
    }).then((r) => r.length),
    db.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: weekStart } },
    }).then((r) => r.length),
    db.pageView.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: monthStart } },
    }).then((r) => r.length),
    db.pageView.groupBy({
      by: ["sessionId"],
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

  const uniqueIPs = new Set(activeVisitors.map((v) => v.ip || v.sessionId));
  const activeNowList = Array.from(
    activeVisitors.reduce((map, v) => {
      const key = v.ip || v.sessionId;
      if (!map.has(key)) {
        map.set(key, { ip: v.ip, path: v.path, userId: v.userId });
      }
      return map;
    }, new Map<string, { ip: string | null; path: string; userId: string | null }>())
  ).map(([, v]) => v);

  const userIds = activeNowList.filter((v) => v.userId).map((v) => v.userId!);
  const activeUsers = userIds.length > 0
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, image: true },
      })
    : [];
  const userMap = new Map(activeUsers.map((u) => [u.id, u]));

  const activeNowDetails = activeNowList.map((v) => {
    const user = v.userId ? userMap.get(v.userId) : null;
    return {
      ip: v.ip,
      path: v.path,
      name: user?.name || null,
      image: user?.image || null,
      isRegistered: !!user,
    };
  });

  return NextResponse.json({
    overview: {
      totalUsers,
      totalSubscribers,
      totalPageViews,
      activeNow: uniqueIPs.size,
      todayViews,
      weekViews,
      monthViews,
      uniqueVisitors: {
        today: uniqueVisitorsToday,
        week: uniqueVisitorsWeek,
        month: uniqueVisitorsMonth,
        allTime: uniqueVisitorsAllTime,
      },
    },
    engagement: {
      totalComments,
      totalLikes,
      totalChatSessions,
      totalChatMessages,
    },
    activeNowDetails,
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
