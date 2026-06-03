"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  variant: "light-sweep" | "morph-boost" | "spotlight-in";
}

export default function SectionTransition({ variant }: Props) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.5, 1.2, 0.5]);

  return (
    <div ref={ref} className="relative w-full h-32 -my-16 pointer-events-none z-20 overflow-visible">
      <motion.div
        style={{ opacity, scale }}
        className={`absolute inset-0 ${
          variant === "light-sweep"
            ? "bg-gradient-to-r from-transparent via-blue-500/25 to-transparent"
            : variant === "morph-boost"
            ? "bg-gradient-to-r from-purple-600/30 via-cyan-400/20 to-purple-600/30 blur-[40px] rounded-full mx-auto max-w-3xl"
            : "bg-amber-500/15 blur-[60px] rounded-full mx-auto max-w-md"
        }`}
      />
    </div>
  );
}
