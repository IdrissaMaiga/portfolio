import { NextRequest, NextResponse } from "next/server";
import { getOwner } from "@/lib/mail/owner";
import { adminCreds, getEmail } from "@/lib/mail/jmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 401 });
  const account = req.nextUrl.searchParams.get("account") ?? "";
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!account || !id) return NextResponse.json({ ok: false, error: "account and id required" }, { status: 400 });
  try {
    const email = await getEmail(adminCreds(), account, id);
    if (!email) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, email });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
