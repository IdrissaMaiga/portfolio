"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  variant?: "double-door" | "single-door" | "slide-up" | "iris";
}

export default function SectionTransition({ variant = "double-door" }: Props) {
  switch (variant) {
    case "double-door": return <DoubleDoor />;
    case "single-door": return <SingleDoor />;
    case "slide-up": return <SlideUp />;
    case "iris": return <Iris />;
  }
}

function useScrollSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return { ref, scrollYProgress };
}

function DoubleDoor() {
  const { ref, scrollYProgress } = useScrollSection();
  const leftX = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "-105%"]);
  const rightX = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "105%"]);
  const doorOpacity = useTransform(scrollYProgress, [0.2, 0.55, 0.65], [1, 1, 0]);
  const glow = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const frameScale = useTransform(scrollYProgress, [0.2, 0.5], [1, 1.02]);

  return (
    <div ref={ref} className="relative w-full h-[40vh] -my-[20vh] pointer-events-none z-30 overflow-hidden" style={{ perspective: "1200px" }}>
      <motion.div style={{ opacity: doorOpacity }} className="absolute inset-0 flex">
        {/* Left door panel */}
        <motion.div style={{ x: leftX, scale: frameScale }} className="w-1/2 h-full origin-left">
          <div className="w-full h-full bg-[#070b17] border-r border-white/[0.06] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/[0.03]" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full bg-white/[0.08] border border-white/[0.12]" />
            <div className="absolute right-8 top-[15%] bottom-[15%] left-[20%] border border-white/[0.04] rounded-sm" />
          </div>
        </motion.div>

        {/* Right door panel */}
        <motion.div style={{ x: rightX, scale: frameScale }} className="w-1/2 h-full origin-right">
          <div className="w-full h-full bg-[#070b17] border-l border-white/[0.06] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/[0.03]" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/40 to-transparent" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-full bg-white/[0.08] border border-white/[0.12]" />
            <div className="absolute left-8 top-[15%] bottom-[15%] right-[20%] border border-white/[0.04] rounded-sm" />
          </div>
        </motion.div>
      </motion.div>

      {/* Light spill */}
      <motion.div style={{ opacity: glow }} className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.08] via-indigo-500/[0.05] to-transparent" />
      {/* Center crack glow */}
      <motion.div style={{ opacity: glow }} className="absolute left-1/2 -translate-x-1/2 top-[10%] bottom-[10%] w-[2px] bg-gradient-to-b from-transparent via-blue-400/60 to-transparent blur-[2px]" />
    </div>
  );
}

function SingleDoor() {
  const { ref, scrollYProgress } = useScrollSection();
  const rotateY = useTransform(scrollYProgress, [0.2, 0.6], [0, -95]);
  const doorOpacity = useTransform(scrollYProgress, [0.2, 0.55, 0.7], [1, 1, 0]);
  const glow = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);

  return (
    <div ref={ref} className="relative w-full h-[35vh] -my-[17vh] pointer-events-none z-30 overflow-hidden" style={{ perspective: "1200px" }}>
      <motion.div
        style={{ rotateY, opacity: doorOpacity, transformOrigin: "left center" }}
        className="absolute inset-0"
      >
        <div className="w-full h-full bg-[#070b17] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent" />
          <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-2 h-14 rounded-full bg-white/[0.1] border border-white/[0.15]" />
          <div className="absolute left-[8%] right-[8%] top-[12%] bottom-[12%] border border-white/[0.05] rounded-sm" />
          <div className="absolute left-[12%] right-[12%] top-[18%] bottom-[18%] border border-white/[0.03] rounded-sm" />
        </div>
      </motion.div>
      <motion.div style={{ opacity: glow }} className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.06] via-blue-400/[0.04] to-transparent" />
    </div>
  );
}

function SlideUp() {
  const { ref, scrollYProgress } = useScrollSection();
  const y = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "-100%"]);
  const doorOpacity = useTransform(scrollYProgress, [0.2, 0.55, 0.65], [1, 1, 0]);
  const revealGlow = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <div ref={ref} className="relative w-full h-[35vh] -my-[17vh] pointer-events-none z-30 overflow-hidden">
      <motion.div style={{ y, opacity: doorOpacity }} className="absolute inset-0">
        <div className="w-full h-full bg-[#070b17] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
          <div className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <div className="absolute left-0 right-0 bottom-[20%] top-[20%] flex flex-col justify-between px-[15%]">
            <div className="h-px bg-white/[0.03]" />
            <div className="h-px bg-white/[0.03]" />
            <div className="h-px bg-white/[0.03]" />
          </div>
        </div>
      </motion.div>
      <motion.div style={{ opacity: revealGlow }} className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-purple-500/[0.06] to-transparent" />
    </div>
  );
}

function Iris() {
  const { ref, scrollYProgress } = useScrollSection();
  const clipProgress = useTransform(scrollYProgress, [0.2, 0.6], [0, 150]);
  const irisOpacity = useTransform(scrollYProgress, [0.55, 0.65], [1, 0]);
  const ringGlow = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const clipPath = useTransform(clipProgress, (v: number) => `circle(${v}% at 50% 50%)`);

  return (
    <div ref={ref} className="relative w-full h-[35vh] -my-[17vh] pointer-events-none z-30 overflow-hidden">
      <motion.div style={{ opacity: irisOpacity, clipPath }} className="absolute inset-0 bg-[#070b17]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent" />
      </motion.div>
      <motion.div style={{ opacity: ringGlow }} className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]" />
      </motion.div>
    </div>
  );
}
