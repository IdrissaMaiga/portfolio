"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface ProjectCard3DProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProjectCard3D({
  children,
  className = "",
}: ProjectCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  const disabled = reducedMotion || isTouchDevice;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -1..1
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      // Invert Y for natural tilt feel, max 8 degrees
      setRotateX(-normalizedY * 8);
      setRotateY(normalizedX * 8);

      // Gradient follows the mouse as a percentage
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      setGradientPos({ x: pctX, y: pctY });
    },
    [disabled]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovering(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
    setGradientPos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      style={{ perspective: "1000px" }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovering
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {children}
        {/* Radial gradient light overlay */}
        {isHovering && !disabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              background: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
