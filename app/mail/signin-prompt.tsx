"use client";

import { signIn, useSession } from "next-auth/react";

export function SignInPrompt() {
  const { status, data } = useSession();
  const signedInNotOwner = status === "authenticated";
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand">iDi<b>Techs</b> Mail</div>
        {signedInNotOwner ? (
          <>
            <div className="login-sub">
              Connecté en tant que <b>{data?.user?.email}</b>, mais ce compte n&apos;est pas autorisé à gérer les boîtes.
            </div>
            <button className="btn-primary" style={{ padding: 11, width: "100%" }} onClick={() => signIn("google")}>
              Changer de compte
            </button>
          </>
        ) : (
          <>
            <div className="login-sub">Connectez-vous avec votre compte pour accéder à toutes vos boîtes iditechs.com.</div>
            <button className="btn-primary" style={{ padding: 11, width: "100%" }} onClick={() => signIn("google")}>
              Se connecter
            </button>
          </>
        )}
        <a className="muted-link" href="/">← Retour au site</a>
      </div>
    </div>
  );
}
