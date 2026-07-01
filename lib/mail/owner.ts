// Mailbox access is gated by the portfolio's own login (NextAuth), restricted to the
// owner email(s). One platform login -> access to all mailboxes via the admin credential.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwnerEmail } from "@/lib/is-owner";

export async function getOwner(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  return isOwnerEmail(email) ? email : null; // fail-closed, single source of truth
}
