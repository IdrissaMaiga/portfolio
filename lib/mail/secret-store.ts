// Encrypted-at-rest store for mailbox passwords, so the owner can SEE a mailbox
// password later (the mail server only keeps a one-way hash). AES-256-GCM with a
// key derived from MAIL_SESSION_SECRET. Only ever read behind the owner gate.
import crypto from "crypto";
import { db } from "@/lib/db";

const keyMaterial = process.env.STALWART_ADMIN_SECRET || process.env.MAIL_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "";
const KEY = crypto.createHash("sha256").update("mailpw:" + keyMaterial).digest();

function enc(plain: string): string {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString("base64");
}

function dec(blob: string): string | null {
  try {
    const b = Buffer.from(blob, "base64");
    const d = crypto.createDecipheriv("aes-256-gcm", KEY, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export async function setSecret(name: string, password: string): Promise<void> {
  const secret = enc(password);
  await db.mailboxSecret.upsert({ where: { name }, create: { name, secret }, update: { secret } });
}

export async function deleteSecret(name: string): Promise<void> {
  await db.mailboxSecret.deleteMany({ where: { name } });
}

/** name -> plaintext password, for every stored secret. */
export async function getSecretsMap(): Promise<Record<string, string>> {
  const rows = await db.mailboxSecret.findMany();
  const out: Record<string, string> = {};
  for (const r of rows) {
    const p = dec(r.secret);
    if (p) out[r.name] = p;
  }
  return out;
}
