"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function RoomFrame({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const topBorder = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const bottomBorder = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const sideGlow = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 0.4, 0.4, 0]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Top frame edge */}
      <motion.div
        style={{ scaleX: topBorder }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-10 origin-center"
      />

      {/* Bottom frame edge */}
      <motion.div
        style={{ scaleX: bottomBorder }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-10 origin-center"
      />

      {/* Left side glow */}
      <motion.div
        style={{ opacity: sideGlow }}
        className="absolute left-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent z-10"
      />

      {/* Right side glow */}
      <motion.div
        style={{ opacity: sideGlow }}
        className="absolute right-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent z-10"
      />

      {/* Corner accents */}
      <motion.div style={{ opacity: sideGlow }} className="absolute top-0 left-0 w-6 h-6 z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-white/[0.15]" />
        <div className="absolute top-0 left-0 w-px h-full bg-white/[0.15]" />
      </motion.div>
      <motion.div style={{ opacity: sideGlow }} className="absolute top-0 right-0 w-6 h-6 z-10">
        <div className="absolute top-0 right-0 w-full h-px bg-white/[0.15]" />
        <div className="absolute top-0 right-0 w-px h-full bg-white/[0.15]" />
      </motion.div>
      <motion.div style={{ opacity: sideGlow }} className="absolute bottom-0 left-0 w-6 h-6 z-10">
        <div className="absolute bottom-0 left-0 w-full h-px bg-white/[0.15]" />
        <div className="absolute bottom-0 left-0 w-px h-full bg-white/[0.15]" />
      </motion.div>
      <motion.div style={{ opacity: sideGlow }} className="absolute bottom-0 right-0 w-6 h-6 z-10">
        <div className="absolute bottom-0 right-0 w-full h-px bg-white/[0.15]" />
        <div className="absolute bottom-0 right-0 w-px h-full bg-white/[0.15]" />
      </motion.div>

      {children}
    </div>
  );
}
