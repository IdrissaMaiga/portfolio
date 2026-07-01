import { NextRequest, NextResponse } from "next/server";
import { getOwner } from "@/lib/mail/owner";
import { adminCreds, sendEmail } from "@/lib/mail/jmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseAddrs(s: string): { name: null; email: string }[] {
  return String(s ?? "")
    .split(/[,;]/).map((x) => x.trim())
    .filter((x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x))
    .map((email) => ({ name: null, email }));
}

export async function POST(req: NextRequest) {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 401 });
  const { account, to, cc, subject, text } = await req.json().catch(() => ({}) as Record<string, string>);
  if (!account) return NextResponse.json({ ok: false, error: "account required" }, { status: 400 });
  const toList = parseAddrs(to);
  if (!toList.length) return NextResponse.json({ ok: false, error: "no_recipient" }, { status: 400 });
  try {
    await sendEmail(adminCreds(), account, {
      to: toList, cc: parseAddrs(cc ?? ""),
      subject: String(subject ?? "").trim() || "(sans objet)", text: String(text ?? ""),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
