// Single source of truth for "is this email the site owner?"
// Uses OWNER_EMAILS (comma-separated list); falls back to legacy OWNER_EMAIL.
// Fail-closed: if no owners are configured, nobody is the owner.
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.OWNER_EMAILS || process.env.OWNER_EMAIL || "";
  const owners = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (owners.length === 0) return false;
  return owners.includes(email.toLowerCase());
}
