import { NextRequest, NextResponse } from "next/server";
import { getOwner } from "@/lib/mail/owner";
import { listPrincipals, createMailbox, resetPassword, deleteMailbox } from "@/lib/mail/stalwart";
import { setSecret, deleteSecret, getSecretsMap } from "@/lib/mail/secret-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 403 });
  try {
    const [mailboxes, secrets] = await Promise.all([listPrincipals(), getSecretsMap().catch((): Record<string, string> => ({}))]);
    const withPw = mailboxes.map((m) => ({ ...m, password: secrets[m.name] ?? null }));
    return NextResponse.json({ ok: true, mailboxes: withPw });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getOwner())) return NextResponse.json({ ok: false }, { status: 403 });
  const { op, name, password, description } = await req.json().catch(() => ({}) as Record<string, string>);
  const n = String(name ?? "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  try {
    if (op === "create") {
      if (!n || !password) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
      await createMailbox(n, password, description);
      await setSecret(n, password).catch(() => {});
    } else if (op === "reset") {
      if (!n || !password) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
      await resetPassword(n, password);
      await setSecret(n, password).catch(() => {});
    } else if (op === "delete") {
      if (!n) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
      await deleteMailbox(n);
      await deleteSecret(n).catch(() => {});
    } else {
      return NextResponse.json({ ok: false, error: "bad_op" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
