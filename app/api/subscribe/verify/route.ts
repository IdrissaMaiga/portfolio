import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const action = req.nextUrl.searchParams.get("action");

  if (!token) {
    return NextResponse.redirect(new URL("/?subscribe=error", req.url));
  }

  const subscriber = await db.subscriber.findUnique({ where: { token } });
  if (!subscriber) {
    return NextResponse.redirect(new URL("/?subscribe=not-found", req.url));
  }

  if (action === "unsubscribe") {
    await db.subscriber.delete({ where: { token } });
    return NextResponse.redirect(new URL("/?subscribe=unsubscribed", req.url));
  }

  await db.subscriber.update({
    where: { token },
    data: { verified: true },
  });

  return NextResponse.redirect(new URL("/?subscribe=confirmed", req.url));
}
