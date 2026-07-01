import { NextRequest, NextResponse } from "next/server";
import { getOwner } from "@/lib/mail/owner";
import { adminCreds, setKeyword, deleteEmail, moveEmail } from "@/lib/mail/jmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 401 });
  const { account, action, id, value, mailboxId } = await req.json().catch(() => ({}) as Record<string, string>);
  if (!account || !id) return NextResponse.json({ ok: false, error: "account and id required" }, { status: 400 });
  const c = adminCreds();
  try {
    if (action === "read") await setKeyword(c, account, id, "$seen", value !== "false");
    else if (action === "delete") await deleteEmail(c, account, id);
    else if (action === "move" && mailboxId) await moveEmail(c, account, id, mailboxId);
    else return NextResponse.json({ ok: false, error: "bad_action" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
