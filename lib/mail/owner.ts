// Mailbox access is gated by the portfolio's own login (NextAuth), restricted to the
// owner email(s). One platform login -> access to all mailboxes via the admin credential.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getOwner(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  const owners = (process.env.OWNER_EMAILS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return owners.length === 0 || owners.includes(email) ? email : null;
}
