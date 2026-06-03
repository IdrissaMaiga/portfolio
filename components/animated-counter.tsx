"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useInView,
  useTransform,
} from "framer-motion";

export default function AnimatedCounter({
  target,
  suffix = "",
  label,
  color,
}: {
  target: number;
  suffix?: string;
  label: string;
  color: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, motionValue, target]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl sm:text-5xl font-bold text-white mb-2"
        style={{ textShadow: `0 0 30px ${color}40` }}
      >
        <motion.span>{display}</motion.span>
        <span className="text-2xl sm:text-3xl ml-1" style={{ color }}>
          {suffix}
        </span>
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
