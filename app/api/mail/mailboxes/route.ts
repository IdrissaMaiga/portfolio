import { NextRequest, NextResponse } from "next/server";
import { getOwner } from "@/lib/mail/owner";
import { adminCreds, listMailboxes } from "@/lib/mail/jmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 401 });
  const account = req.nextUrl.searchParams.get("account") ?? "";
  if (!account) return NextResponse.json({ ok: false, error: "account required" }, { status: 400 });
  try {
    const mailboxes = await listMailboxes(adminCreds(), account);
    return NextResponse.json({ ok: true, mailboxes });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
