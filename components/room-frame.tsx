"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

const ACCENT_COLORS: Record<string, string> = {
  blue: "rgba(59,130,246,0.2)",
  indigo: "rgba(99,102,241,0.2)",
  purple: "rgba(168,85,247,0.2)",
  cyan: "rgba(6,182,212,0.2)",
  amber: "rgba(245,158,11,0.2)",
};

interface Props {
  children: ReactNode;
  accent?: string;
}

export default function RoomFrame({ children, accent = "blue" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const wallOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const topLine = useTransform(scrollYProgress, [0.02, 0.12], [0, 1]);
  const bottomLine = useTransform(scrollYProgress, [0.88, 0.98], [1, 0]);

  const color = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;

  return (
    <div ref={ref} className="relative">
      {/* Left wall */}
      <motion.div
        style={{
          opacity: wallOpacity,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        }}
        className="absolute left-0 top-0 bottom-0 w-px z-20 hidden lg:block"
      />

      {/* Right wall */}
      <motion.div
        style={{
          opacity: wallOpacity,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        }}
        className="absolute right-0 top-0 bottom-0 w-px z-20 hidden lg:block"
      />

      {/* Top threshold */}
      <motion.div
        style={{
          scaleX: topLine,
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
        className="absolute top-0 left-0 right-0 h-px z-20 origin-center"
      />

      {/* Bottom threshold */}
      <motion.div
        style={{
          scaleX: bottomLine,
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }}
        className="absolute bottom-0 left-0 right-0 h-px z-20 origin-center"
      />

      {children}
    </div>
  );
}
