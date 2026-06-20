"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

function getSessionId() {
  const key = "pv_sid";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = useCallback((path: string) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || null,
        sessionId: getSessionId(),
      }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    track(pathname);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => track(pathname), 90_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname, track]);

  return null;
}
