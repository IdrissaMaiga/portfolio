"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";
import {
  FiEdit, FiSettings, FiArrowLeft, FiMenu, FiRefreshCw, FiTrash2, FiCornerUpLeft,
  FiPaperclip, FiLogOut, FiSend, FiShuffle, FiInbox, FiFileText, FiAlertOctagon, FiArchive, FiFolder,
  FiChevronDown, FiCheck,
} from "react-icons/fi";

const FOLDER_ICON: Record<string, ReactNode> = {
  inbox: <FiInbox />, sent: <FiSend />, drafts: <FiFileText />,
  trash: <FiTrash2 />, junk: <FiAlertOctagon />, archive: <FiArchive />,
};

type Account = { accountId: string; name: string; email: string; description: string | null };
type Mailbox = { id: string; name: string; role: string | null; totalEmails: number; unreadEmails: number };
type Addr = { name: string | null; email: string };
type Summary = { id: string; subject: string; from: Addr[]; to: Addr[]; receivedAt: string; preview: string; unread: boolean; hasAttachment: boolean };
type Full = Summary & { cc: Addr[]; html: string | null; text: string | null; attachments: { name: string; type: string; size: number }[] };

const FOLDER_FR: Record<string, string> = { inbox: "Boîte de réception", sent: "Envoyés", drafts: "Brouillons", trash: "Corbeille", junk: "Spam", archive: "Archives" };
const addrLabel = (a: Addr[]) => (!a?.length ? "—" : a.map((x) => x.name || x.email).join(", "));
function fmtDate(s: string): string {
  const d = new Date(s), now = new Date();
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
function initials(a: Addr[]): string {
  const s = (a?.[0]?.name || a?.[0]?.email || "?").trim();
  const parts = s.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? s[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}
const AV_COLORS = ["#4da6ff", "#22c55e", "#f59e0b", "#ec4899", "#a855f7", "#14b8a6", "#fb7185", "#38bdf8"];
function avatarColor(a: Addr[]): string {
  const s = (a?.[0]?.email || a?.[0]?.name || "?");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return AV_COLORS[h % AV_COLORS.length];
}

export function MailClient({ owner, accounts }: { owner: string; accounts: Account[] }) {
  const [account, setAccount] = useState(accounts[0]?.accountId ?? "");
  const [folders, setFolders] = useState<Mailbox[]>([]);
  const [active, setActive] = useState("");
  const [emails, setEmails] = useState<Summary[]>([]);
  const [total, setTotal] = useState(0);
  const [sel, setSel] = useState<Full | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [compose, setCompose] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [admin, setAdmin] = useState(false);

  const loadFolders = useCallback(async (acc: string) => {
    if (!acc) return;
    setSel(null); setEmails([]);
    const r = await fetch(`/api/mail/mailboxes?account=${acc}`).then((x) => x.json());
    if (!r.ok) return;
    setFolders(r.mailboxes);
    const inbox = r.mailboxes.find((m: Mailbox) => m.role === "inbox") ?? r.mailboxes[0];
    setActive(inbox ? inbox.id : "");
  }, []);

  const loadList = useCallback(async (acc: string, mb: string) => {
    if (!acc || !mb) return;
    setLoadingList(true); setSel(null);
    const r = await fetch(`/api/mail/list?account=${acc}&mailbox=${mb}`).then((x) => x.json());
    setLoadingList(false);
    if (r.ok) { setEmails(r.emails); setTotal(r.total); }
  }, []);

  useEffect(() => { if (account) loadFolders(account); }, [account, loadFolders]);
  useEffect(() => { if (account && active) loadList(account, active); }, [account, active, loadList]);

  async function openEmail(id: string) {
    setLoadingMsg(true);
    const r = await fetch(`/api/mail/get?account=${account}&id=${id}`).then((x) => x.json());
    setLoadingMsg(false);
    if (r.ok) {
      setSel(r.email);
      setEmails((p) => p.map((e) => (e.id === id ? { ...e, unread: false } : e)));
      setFolders((p) => p.map((f) => (f.id === active ? { ...f, unreadEmails: Math.max(0, f.unreadEmails - 1) } : f)));
    }
  }
  async function del(id: string) {
    await fetch("/api/mail/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ account, action: "delete", id }) });
    setSel(null); setEmails((p) => p.filter((e) => e.id !== id));
  }

  const activeFolder = folders.find((f) => f.id === active);
  const folderName = activeFolder ? (FOLDER_FR[activeFolder.role ?? ""] || activeFolder.name) : "";
  const currentEmail = accounts.find((a) => a.accountId === account)?.email ?? "";

  if (admin) return <Admin onBack={() => setAdmin(false)} />;

  return (
    <div className={`shell ${sel ? "has-reader" : ""} ${showFolders ? "show-folders" : ""}`}>
      <aside className="sidebar" onClick={(e) => { if (e.target === e.currentTarget) setShowFolders(false); }}>
        <div className="side-top"><span className="brand">iDi<b>Techs</b> Mail</span></div>
        <div className="side-actions">
          <AccountSwitcher accounts={accounts} account={account} onChange={setAccount} />
          <button className="compose-btn btn-primary" onClick={() => setCompose(true)}><FiEdit /> Nouveau message</button>
        </div>
        <nav className="folders">
          {folders.map((f) => (
            <div key={f.id} className={`folder ${f.id === active ? "active" : ""}`} onClick={() => { setActive(f.id); setShowFolders(false); }}>
              <span className="folder-label">{FOLDER_ICON[f.role ?? ""] ?? <FiFolder />} {FOLDER_FR[f.role ?? ""] || f.name}</span>
              {f.unreadEmails > 0 ? <span className="unread">{f.unreadEmails}</span> : <span className="count">{f.totalEmails || ""}</span>}
            </div>
          ))}
        </nav>
        <div className="side-foot">
          <span className="me">{owner}</span>
          <button onClick={() => setAdmin(true)}><FiSettings /> Gérer les boîtes</button>
          <a href="/"><FiArrowLeft /> Retour au site</a>
          <button onClick={() => signOut({ callbackUrl: "/" })}><FiLogOut /> Se déconnecter</button>
        </div>
      </aside>

      <section className="list">
        <div className="list-head">
          <div className="lh-left">
            <button className="back-btn icon-btn" onClick={() => setShowFolders((s) => !s)}><FiMenu /></button>
            <span className="lh-title">{folderName}</span>
            <span className="lh-sub">{currentEmail}</span>
          </div>
          <div className="lh-right">
            <span className="lh-count">{total}</span>
            <button className="icon-btn" onClick={() => loadList(account, active)} title="Rafraîchir"><FiRefreshCw /></button>
          </div>
        </div>
        <div className="msgs">
          {loadingList ? <div className="empty">Chargement…</div>
            : emails.length === 0 ? <div className="empty">Aucun message.</div>
            : emails.map((m) => {
              const who = activeFolder?.role === "sent" ? m.to : m.from;
              return (
              <div key={m.id} className={`msg ${m.unread ? "unread" : ""} ${sel?.id === m.id ? "active" : ""}`} onClick={() => openEmail(m.id)}>
                <div className="msg-av" style={{ background: avatarColor(who) }}>{initials(who)}</div>
                <div className="msg-body">
                  <div className="msg-row1">
                    <span className="msg-from">{addrLabel(who)}</span>
                    <span className="msg-date">{fmtDate(m.receivedAt)}</span>
                  </div>
                  <div className="msg-subj">{m.hasAttachment && <FiPaperclip className="clip" />}{m.subject}</div>
                  <div className="msg-prev">{m.preview}</div>
                </div>
                {m.unread && <span className="msg-dot" />}
              </div>
              );
            })}
        </div>
      </section>

      <section className="reader">
        {loadingMsg ? <div className="placeholder">Ouverture…</div>
          : !sel ? <div className="placeholder">Sélectionnez un message</div>
          : (
            <>
              <div className="reader-head">
                <div className="reader-subj">{sel.subject}</div>
                <div className="reader-sender">
                  <div className="reader-av" style={{ background: avatarColor(sel.from) }}>{initials(sel.from)}</div>
                  <div className="reader-meta">
                    <div><b>{addrLabel(sel.from)}</b> <span className="reader-date">{new Date(sel.receivedAt).toLocaleString("fr-FR")}</span></div>
                    <div>À : {addrLabel(sel.to)}{sel.cc.length ? ` · Cc : ${addrLabel(sel.cc)}` : ""}</div>
                  </div>
                </div>
                <div className="reader-actions">
                  <button className="back-btn" onClick={() => setSel(null)}><FiArrowLeft /> Retour</button>
                  <button onClick={() => setCompose(true)}><FiCornerUpLeft /> Répondre</button>
                  <button className="btn-danger" onClick={() => del(sel.id)}><FiTrash2 /> Supprimer</button>
                </div>
              </div>
              <div className="reader-body">
                {sel.html ? (
                  <iframe
                    sandbox="allow-popups allow-popups-to-escape-sandbox"
                    srcDoc={`<!doctype html><html><head><base target="_blank"><meta name="color-scheme" content="light"><style>body{margin:14px;font-family:-apple-system,Segoe UI,system-ui,sans-serif;color:#1a1a1a;line-height:1.55} a{color:#2b6df6}</style></head><body>${sel.html}</body></html>`}
                    title="message"
                  />
                ) : (
                  <div className="reader-text">{sel.text || "(message vide)"}</div>
                )}
              </div>
              {sel.attachments.length > 0 && <div className="attach"><FiPaperclip /> {sel.attachments.length} pièce(s) jointe(s) : {sel.attachments.map((a) => a.name).join(", ")}</div>}
            </>
          )}
      </section>

      {compose && <Compose account={account} from={currentEmail} defaultTo={sel ? sel.from[0]?.email ?? "" : ""} defaultSubject={sel ? `Re: ${sel.subject}` : ""} onClose={() => setCompose(false)} onSent={() => setCompose(false)} />}
    </div>
  );
}

function AccountSwitcher({ accounts, account, onChange }: { accounts: Account[]; account: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = accounts.find((a) => a.accountId === account);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const av = (email: string): Addr[] => [{ name: null, email }];
  return (
    <div className="acct-switch-wrap" ref={ref}>
      <button className="acct-switch" onClick={() => setOpen((o) => !o)} title="Choisir une boîte">
        <span className="acct-av" style={{ background: avatarColor(av(cur?.email ?? "")) }}>{initials(av(cur?.email ?? "?"))}</span>
        <span className="acct-email">{cur?.email ?? "—"}</span>
        <FiChevronDown className="acct-chev" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="acct-menu">
          {accounts.map((a) => (
            <button key={a.accountId} className={`acct-item ${a.accountId === account ? "active" : ""}`} onClick={() => { onChange(a.accountId); setOpen(false); }}>
              <span className="acct-av" style={{ background: avatarColor(av(a.email)) }}>{initials(av(a.email))}</span>
              <span className="acct-email">{a.email}</span>
              {a.accountId === account && <FiCheck className="acct-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Compose({ account, from, defaultTo, defaultSubject, onClose, onSent }: { account: string; from: string; defaultTo: string; defaultSubject: string; onClose: () => void; onSent: () => void }) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  async function send() {
    setError(""); setSending(true);
    const r = await fetch("/api/mail/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ account, to, cc, subject, text }) }).then((x) => x.json());
    setSending(false);
    if (r.ok) onSent(); else setError(r.error === "no_recipient" ? "Destinataire invalide." : "Échec de l'envoi.");
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Nouveau message <span className="tag">de {from}</span></h3>
        <input placeholder="À : destinataire@exemple.com" value={to} onChange={(e) => setTo(e.target.value)} />
        <input placeholder="Cc (optionnel)" value={cc} onChange={(e) => setCc(e.target.value)} />
        <input placeholder="Objet" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Votre message…" value={text} onChange={(e) => setText(e.target.value)} />
        {error && <p className="err">{error}</p>}
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={send} disabled={sending || !to.trim()}><FiSend /> {sending ? "Envoi…" : "Envoyer"}</button>
        </div>
      </div>
    </div>
  );
}

function Admin({ onBack }: { onBack: () => void }) {
  type Box = { id: number; name: string; emails: string[]; description: string | null; quota: number; usedQuota: number };
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const gen = () => { const c = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; const a = new Uint32Array(16); crypto.getRandomValues(a); let s = ""; for (let i = 0; i < 16; i++) s += c[a[i] % c.length]; return s; };
  const mb = (b: number) => (b / 1048576).toFixed(1) + " MB";
  const load = useCallback(async () => { setLoading(true); const r = await fetch("/api/mail/admin").then((x) => x.json()); setLoading(false); if (r.ok) setBoxes(r.mailboxes); }, []);
  useEffect(() => { setPw(gen()); load(); }, [load]);
  async function op(body: Record<string, string>, okMsg: string) {
    setBusy(true); setMsg("");
    const r = await fetch("/api/mail/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((x) => x.json());
    setBusy(false);
    if (r.ok) { setMsg(okMsg); await load(); } else setMsg("Erreur : " + (r.error || "inconnue"));
  }
  return (
    <div className="admin-wrap">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <div className="brand">Boîtes <b>iditechs.com</b></div>
        <button onClick={onBack}><FiArrowLeft /> Retour au courrier</button>
      </div>
      <h3 style={{ fontSize: 15, marginBottom: 8 }}>Créer une boîte</h3>
      <div className="row" style={{ marginBottom: 8 }}>
        <input placeholder="nom" value={name} onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))} style={{ width: 150 }} />
        <span className="tag">@iditechs.com</span>
        <input value={pw} onChange={(e) => setPw(e.target.value)} style={{ width: 190, fontFamily: "ui-monospace, monospace" }} />
        <button className="icon-btn" onClick={() => setPw(gen())} title="Générer un mot de passe"><FiShuffle /></button>
        <button className="btn-primary" disabled={busy || !name || !pw} onClick={() => op({ op: "create", name, password: pw }, `Boîte ${name}@iditechs.com créée — mot de passe : ${pw}`)}>Créer</button>
      </div>
      {msg && <p style={{ color: msg.startsWith("Erreur") ? "var(--red)" : "var(--green)", fontSize: 13, margin: "8px 0" }}>{msg}</p>}
      <h3 style={{ fontSize: 15, margin: "20px 0 8px" }}>Boîtes existantes</h3>
      {loading ? <p style={{ color: "var(--dim)" }}>Chargement…</p> : (
        <table>
          <thead><tr><th>Adresse(s)</th><th>Description</th><th>Stockage</th><th>Actions</th></tr></thead>
          <tbody>
            {boxes.map((b) => (
              <tr key={b.id}>
                <td><b>{b.name}</b><br /><span style={{ color: "var(--dim)", fontSize: 12 }}>{b.emails.join(", ")}</span></td>
                <td style={{ color: "var(--dim)" }}>{b.description || "—"}</td>
                <td style={{ whiteSpace: "nowrap" }}>{mb(b.usedQuota)} / {mb(b.quota)}</td>
                <td><div className="row">
                  <button onClick={() => { const np = gen(); if (confirm(`Réinitialiser le mot de passe de ${b.name}@iditechs.com ?`)) op({ op: "reset", name: b.name, password: np }, `Nouveau mot de passe ${b.name} : ${np}`); }}>Reset MDP</button>
                  <button className="btn-danger" onClick={() => { if (confirm(`Supprimer définitivement ${b.name}@iditechs.com ?`)) op({ op: "delete", name: b.name }, `Boîte ${b.name} supprimée.`); }}>Suppr.</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
