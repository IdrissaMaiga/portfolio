/* eslint-disable @typescript-eslint/no-explicit-any */
// Stalwart management API (list/create/reset/delete mailboxes) via the gated gateway.
const BASE = process.env.STALWART_URL || "https://mailapi.iditechs.com";
const GW = process.env.STALWART_GATEWAY_TOKEN || "";
const ADMIN_USER = process.env.STALWART_ADMIN_USER || "";
const ADMIN_SECRET = process.env.STALWART_ADMIN_SECRET || "";
const DOMAIN = process.env.MAIL_DOMAIN || "iditechs.com";

async function adminApi(method: string, path: string, body?: unknown): Promise<any> {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      Authorization: "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_SECRET}`).toString("base64"),
      "X-Gateway-Token": GW,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-json */ }
  if (!res.ok) throw new Error(json?.error || json?.detail || `stalwart_${res.status}`);
  return json;
}

export type MailboxPrincipal = {
  id: number; name: string; emails: string[]; description: string | null; quota: number; usedQuota: number;
};

export async function listPrincipals(): Promise<MailboxPrincipal[]> {
  const r = await adminApi("GET", "/principal?types=individual&limit=200");
  const items = r?.data?.items ?? [];
  return items
    .filter((p: any) => (p.emails ?? []).some((e: string) => e.endsWith(`@${DOMAIN}`)))
    .map((p: any) => ({
      id: p.id, name: p.name, emails: p.emails ?? [],
      description: p.description ?? null, quota: p.quota ?? 0, usedQuota: p.usedQuota ?? 0,
    }));
}

export async function resolveLoginName(email: string): Promise<string | null> {
  try {
    const r = await adminApi("GET", "/principal?types=individual&limit=200");
    const items = r?.data?.items ?? [];
    const lower = email.toLowerCase();
    const p = items.find((x: any) => (x.emails ?? []).some((e: string) => e.toLowerCase() === lower));
    return p?.name ?? null;
  } catch {
    return null;
  }
}

export async function createMailbox(name: string, password: string, description?: string): Promise<void> {
  await adminApi("POST", "/principal", {
    type: "individual", name, emails: [`${name}@${DOMAIN}`], secrets: [password],
    description: description || "iditechs mailbox", quota: 1073741824, roles: ["user"],
  });
}
export async function resetPassword(name: string, password: string): Promise<void> {
  await adminApi("PATCH", `/principal/${encodeURIComponent(name)}`, [{ action: "set", field: "secrets", value: [password] }]);
}
export async function deleteMailbox(name: string): Promise<void> {
  await adminApi("DELETE", `/principal/${encodeURIComponent(name)}`);
}
