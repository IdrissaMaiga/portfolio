"use client";
import { motion } from "framer-motion";

interface Props {
  variant: "hero" | "story" | "projects" | "skills" | "insights" | "connect";
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: i * 0.3, duration: 2, ease: "easeInOut" }, opacity: { delay: i * 0.3, duration: 0.5 } },
  }),
};

function FloatingShape({ d, color, delay, duration, x, y }: { d: string; color: string; delay: number; duration: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <motion.path d={d} stroke={color} strokeWidth="1" fill="none" initial="hidden" whileInView="visible" custom={delay} variants={draw} viewport={{ once: true }} />
      </svg>
    </motion.div>
  );
}

function GridDots({ color, opacity = 0.06 }: { color: string; opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-[1]"
      style={{ background: "linear-gradient(to right, transparent, rgba(99,102,241,0.15), transparent)" }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function ArtBg({ variant }: Props) {
  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridDots color="rgba(59,130,246,0.5)" opacity={0.04} />
        <ScanLine />

        {/* Circuit-like drawn lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <motion.line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(59,130,246,0.06)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
          <motion.line x1="85%" y1="0" x2="85%" y2="100%" stroke="rgba(99,102,241,0.05)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.8 }} />
          <motion.path d="M 70% 30% Q 77% 30% 77% 40% Q 77% 50% 85% 50%" stroke="rgba(59,130,246,0.08)" strokeWidth="1" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.5 }} />
          <motion.circle cx="70%" cy="30%" r="3" fill="rgba(59,130,246,0.2)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
          <motion.circle cx="85%" cy="50%" r="3" fill="rgba(99,102,241,0.2)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} />
        </svg>

        {/* Geometric floating shapes */}
        <FloatingShape d="M10 60 L60 10 L110 60 L60 110 Z" color="rgba(59,130,246,0.12)" delay={0} duration={6} x="60%" y="15%" />
        <FloatingShape d="M60 10 A50 50 0 1 1 60 110 A50 50 0 1 1 60 10" color="rgba(139,92,246,0.08)" delay={1} duration={8} x="75%" y="55%" />
        <FloatingShape d="M20 60 L60 20 L100 60 L60 100 Z M40 60 L60 40 L80 60 L60 80 Z" color="rgba(6,182,212,0.1)" delay={0.5} duration={7} x="80%" y="25%" />

        {/* Large ambient glow */}
        <div className="absolute top-1/4 right-[15%] w-[400px] h-[400px] bg-blue-600/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-[25%] w-[300px] h-[300px] bg-indigo-600/[0.05] rounded-full blur-[80px]" />
      </div>
    );
  }

  if (variant === "story") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridDots color="rgba(6,182,212,0.4)" opacity={0.03} />
        <FloatingShape d="M10 10 L110 10 L110 110 L10 110 Z" color="rgba(6,182,212,0.08)" delay={0} duration={9} x="5%" y="20%" />
        <FloatingShape d="M60 10 L110 110 L10 110 Z" color="rgba(99,102,241,0.07)" delay={0.5} duration={7} x="85%" y="60%" />
        {/* Timeline line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(6,182,212,0.1), transparent)" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
        />
      </div>
    );
  }

  if (variant === "projects") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridDots color="rgba(168,85,247,0.4)" opacity={0.03} />
        <FloatingShape d="M60 10 L110 40 L90 100 L30 100 L10 40 Z" color="rgba(168,85,247,0.08)" delay={0} duration={10} x="8%" y="30%" />
        <FloatingShape d="M10 60 Q60 10 110 60 Q60 110 10 60" color="rgba(139,92,246,0.06)" delay={1} duration={8} x="80%" y="15%" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      </div>
    );
  }

  if (variant === "skills") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridDots color="rgba(16,185,129,0.4)" opacity={0.03} />
        <FloatingShape d="M60 10 L110 60 L60 110 L10 60 Z" color="rgba(16,185,129,0.08)" delay={0} duration={7} x="90%" y="20%" />
        <FloatingShape d="M30 30 L90 30 L90 90 L30 90 Z M45 45 L75 45 L75 75 L45 75 Z" color="rgba(6,182,212,0.06)" delay={0.8} duration={9} x="5%" y="60%" />
        <ScanLine />
      </div>
    );
  }

  if (variant === "insights") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GridDots color="rgba(99,102,241,0.4)" opacity={0.03} />
        <FloatingShape d="M60 10 A50 50 0 1 1 60 110 A50 50 0 1 1 60 10 M60 30 A30 30 0 1 1 60 90 A30 30 0 1 1 60 30" color="rgba(99,102,241,0.07)" delay={0} duration={10} x="85%" y="25%" />
      </div>
    );
  }

  // connect
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <GridDots color="rgba(245,158,11,0.3)" opacity={0.03} />
      <FloatingShape d="M60 10 L90 50 L75 100 L45 100 L30 50 Z" color="rgba(245,158,11,0.08)" delay={0} duration={8} x="85%" y="30%" />
    </div>
  );
}
