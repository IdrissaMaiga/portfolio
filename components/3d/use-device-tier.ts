"use client";
import { useState, useEffect } from "react";

export type DeviceTier = "low" | "medium" | "high";

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("medium");
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const width = window.innerWidth;
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile || width < 768 || cores < 4) setTier("low");
    else if (cores >= 8 && width >= 1024) setTier("high");
    else setTier("medium");
  }, []);
  return tier;
}
