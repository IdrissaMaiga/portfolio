"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RingGaugeProps {
  level: number; // 0-100
  color: string; // hex string
  size?: number; // px, default 120
  strokeWidth?: number; // default 8
}

export default function RingGauge({
  level,
  color,
  size = 120,
  strokeWidth = 8,
}: RingGaugeProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillLength = (level / 100) * circumference;

  // Unique filter ID to avoid collisions when multiple gauges render
  const filterId = `glow-${color.replace("#", "")}-${size}`;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background track circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeOpacity={0.08}
        strokeWidth={strokeWidth}
      />

      {/* Animated filled arc with neon glow */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        filter={`url(#${filterId})`}
        style={{
          transformOrigin: "center",
          transform: "rotate(-90deg)",
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={
          isInView
            ? { strokeDashoffset: circumference - fillLength }
            : { strokeDashoffset: circumference }
        }
        transition={{
          duration: 1.4,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </svg>
  );
}
