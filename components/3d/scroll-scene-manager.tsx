"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "./use-reduced-motion";
import { useDeviceTier, type DeviceTier } from "./use-device-tier";

/* ---------- helpers ---------- */

function getParticleCount(tier: DeviceTier): number {
  switch (tier) {
    case "high":
      return 400;
    case "medium":
      return 300;
    case "low":
      return 150;
  }
}

/** Build one flat Float32Array of x,y,z triples for a given formation. */
function buildFormation(
  kind: "sphere" | "helix" | "grid" | "hexagons" | "drift",
  count: number,
): Float32Array {
  const arr = new Float32Array(count * 3);

  switch (kind) {
    /* ---- Hero: loose spherical cluster ---- */
    case "sphere": {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random() * 3;
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      }
      break;
    }

    /* ---- About: double-helix / spiral ---- */
    case "helix": {
      for (let i = 0; i < count; i++) {
        const strand = i % 2 === 0 ? 0 : Math.PI;
        const t = (i / count) * Math.PI * 6;
        const r = 2.5 + Math.random() * 0.4;
        arr[i * 3] = Math.cos(t + strand) * r;
        arr[i * 3 + 1] = (i / count) * 8 - 4;
        arr[i * 3 + 2] = Math.sin(t + strand) * r;
      }
      break;
    }

    /* ---- Projects: flat grid ---- */
    case "grid": {
      const cols = Math.ceil(Math.sqrt(count));
      const spacing = 0.55;
      for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        arr[i * 3] = (col - cols / 2) * spacing;
        arr[i * 3 + 1] = (row - cols / 2) * spacing;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
      break;
    }

    /* ---- Skills: 6 hexagonal clusters ---- */
    case "hexagons": {
      const centers = [
        [-2.5, 1.5, 0],
        [0, 2.5, 0],
        [2.5, 1.5, 0],
        [-2.5, -1.5, 0],
        [0, -2.5, 0],
        [2.5, -1.5, 0],
      ];
      for (let i = 0; i < count; i++) {
        const c = centers[i % 6];
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.2;
        arr[i * 3] = c[0] + Math.cos(angle) * r;
        arr[i * 3 + 1] = c[1] + Math.sin(angle) * r;
        arr[i * 3 + 2] = c[2] + (Math.random() - 0.5) * 0.5;
      }
      break;
    }

    /* ---- Contact: outward drift ---- */
    case "drift": {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 4 + Math.random() * 6;
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      }
      break;
    }
  }

  return arr;
}

/** Color palette per section (HSL). */
const sectionColors: [number, number, number][] = [
  [0.58, 0.7, 0.55], // hero   – blue
  [0.52, 0.7, 0.55], // about  – cyan
  [0.9, 0.65, 0.55],  // projects – pink
  [0.38, 0.65, 0.5], // skills – green
  [0.1, 0.7, 0.55],  // contact – amber
];

/* ---------- Particle system ---------- */

function ScrollParticles({
  count,
  reducedMotion,
}: {
  count: number;
  reducedMotion: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null!);
  const scrollProgress = useRef(0);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = docHeight > 0 ? window.scrollY / docHeight : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pre-compute formations
  const formations = useMemo(
    () => [
      buildFormation("sphere", count),
      buildFormation("helix", count),
      buildFormation("grid", count),
      buildFormation("hexagons", count),
      buildFormation("drift", count),
    ],
    [count],
  );

  // Working position + color buffers
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    // Start at formation 0
    pos.set(formations[0]);
    const c = new THREE.Color();
    c.setHSL(...sectionColors[0]);
    for (let i = 0; i < count; i++) {
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, formations]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const progress = scrollProgress.current;

    // Determine the two formations we are between
    const sectionCount = formations.length;
    const scaled = progress * (sectionCount - 1); // 0 .. 4
    const indexA = Math.min(Math.floor(scaled), sectionCount - 2);
    const indexB = indexA + 1;
    const t = scaled - indexA; // local 0..1

    const fromPos = formations[indexA];
    const toPos = formations[indexB];
    const fromHSL = sectionColors[indexA];
    const toHSL = sectionColors[indexB];

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;

    // Interpolate colour
    const h = fromHSL[0] + (toHSL[0] - fromHSL[0]) * t;
    const s = fromHSL[1] + (toHSL[1] - fromHSL[1]) * t;
    const l = fromHSL[2] + (toHSL[2] - fromHSL[2]) * t;
    const baseColor = new THREE.Color();
    baseColor.setHSL(h, s, l);

    for (let i = 0; i < posArr.length; i++) {
      // Lerp position
      if (reducedMotion) {
        // Snap to nearer formation
        posArr[i] = t < 0.5 ? fromPos[i] : toPos[i];
      } else {
        posArr[i] += (fromPos[i] + (toPos[i] - fromPos[i]) * t - posArr[i]) * 0.05;
      }
    }

    // Write colors (with slight per-particle randomness baked into hue)
    const tmpColor = new THREE.Color();
    for (let i = 0; i < posArr.length / 3; i++) {
      const hueJitter = ((i * 0.618) % 1) * 0.06 - 0.03;
      tmpColor.setHSL(h + hueJitter, s, l);
      colArr[i * 3] = tmpColor.r;
      colArr[i * 3 + 1] = tmpColor.g;
      colArr[i * 3 + 2] = tmpColor.b;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- Scene wrapper ---------- */

function ScrollScene() {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const count = getParticleCount(tier);

  return <ScrollParticles key={count} count={count} reducedMotion={reducedMotion} />;
}

/* ---------- Exported canvas ---------- */

export default function ScrollSceneManager() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <ScrollScene />
      </Canvas>
    </div>
  );
}
