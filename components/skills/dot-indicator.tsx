"use client";

interface DotIndicatorProps {
  level: number; // 0-100
  color: string; // hex string
  size?: number; // dot diameter in px, default 8
}

export default function DotIndicator({
  level,
  color,
  size = 8,
}: DotIndicatorProps) {
  const totalDots = 5;
  // Map 0-100 to 0-5 filled dots
  const filledDots = (level / 100) * totalDots;
  const fullDots = Math.floor(filledDots);
  const partialFraction = filledDots - fullDots;

  return (
    <div className="flex items-center" style={{ gap: size * 0.5 }}>
      {Array.from({ length: totalDots }, (_, i) => {
        const isFullyFilled = i < fullDots;
        const isPartial = i === fullDots && partialFraction > 0;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: size,
              height: size,
              borderRadius: "50%",
              background: isFullyFilled
                ? color
                : isPartial
                  ? `linear-gradient(to right, ${color} ${partialFraction * 100}%, rgba(255,255,255,0.1) ${partialFraction * 100}%)`
                  : "rgba(255,255,255,0.1)",
              boxShadow: isFullyFilled
                ? `0 0 ${size}px ${color}44`
                : undefined,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}
