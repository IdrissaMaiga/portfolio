import { getOwner } from "@/lib/mail/owner";
import { listAccounts } from "@/lib/mail/jmap";
import { MailClient } from "./mail-client";
import { SignInPrompt } from "./signin-prompt";

export const dynamic = "force-dynamic";

export default async function MailHome() {
  const owner = await getOwner();
  if (!owner) return <SignInPrompt />;
  const accounts = await listAccounts().catch(() => []);
  return <MailClient owner={owner} accounts={accounts} />;
}
