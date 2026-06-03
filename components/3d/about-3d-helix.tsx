"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "./use-reduced-motion";
import { useDeviceTier } from "./use-device-tier";

const POINT_COUNT = 200;
const HELIX_RADIUS = 1.2;
const HELIX_HEIGHT = 6;
const HELIX_TURNS = 4;

function DoubleHelix({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const { strand1Positions, strand2Positions, strand1Colors, strand2Colors } =
    useMemo(() => {
      const s1Pos = new Float32Array(POINT_COUNT * 3);
      const s2Pos = new Float32Array(POINT_COUNT * 3);
      const s1Col = new Float32Array(POINT_COUNT * 3);
      const s2Col = new Float32Array(POINT_COUNT * 3);
      const color = new THREE.Color();

      for (let i = 0; i < POINT_COUNT; i++) {
        const t = i / (POINT_COUNT - 1);
        const angle = t * Math.PI * 2 * HELIX_TURNS;
        const y = t * HELIX_HEIGHT - HELIX_HEIGHT / 2;

        // Strand 1
        s1Pos[i * 3] = HELIX_RADIUS * Math.cos(angle);
        s1Pos[i * 3 + 1] = y;
        s1Pos[i * 3 + 2] = HELIX_RADIUS * Math.sin(angle);

        // Strand 2 (offset by PI)
        s2Pos[i * 3] = HELIX_RADIUS * Math.cos(angle + Math.PI);
        s2Pos[i * 3 + 1] = y;
        s2Pos[i * 3 + 2] = HELIX_RADIUS * Math.sin(angle + Math.PI);

        // Blue-to-cyan gradient based on Y position
        const hue = 0.55 + t * 0.1; // blue to cyan
        color.setHSL(hue, 0.8, 0.6);
        s1Col[i * 3] = color.r;
        s1Col[i * 3 + 1] = color.g;
        s1Col[i * 3 + 2] = color.b;

        color.setHSL(hue + 0.02, 0.7, 0.55);
        s2Col[i * 3] = color.r;
        s2Col[i * 3 + 1] = color.g;
        s2Col[i * 3 + 2] = color.b;
      }

      return {
        strand1Positions: s1Pos,
        strand2Positions: s2Pos,
        strand1Colors: s1Col,
        strand2Colors: s2Col,
      };
    }, []);

  // Build connecting line segments between paired points
  const lineGeometry = useMemo(() => {
    const linePositions: number[] = [];
    // Connect every 10th pair
    for (let i = 0; i < POINT_COUNT; i += 10) {
      linePositions.push(
        strand1Positions[i * 3],
        strand1Positions[i * 3 + 1],
        strand1Positions[i * 3 + 2],
        strand2Positions[i * 3],
        strand2Positions[i * 3 + 1],
        strand2Positions[i * 3 + 2]
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    return geo;
  }, [strand1Positions, strand2Positions]);

  useFrame(() => {
    if (reducedMotion) return;
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={POINT_COUNT}
            array={strand1Positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={POINT_COUNT}
            array={strand1Colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Strand 2 */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={POINT_COUNT}
            array={strand2Positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={POINT_COUNT}
            array={strand2Colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Connecting lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

function PulsingOrb({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (reducedMotion) return;
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 1.5) * 0.15;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

function HelixScene() {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  if (tier === "low") {
    return <PulsingOrb reducedMotion={reducedMotion} />;
  }

  return <DoubleHelix reducedMotion={reducedMotion} />;
}

export default function About3DHelix({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
      >
        <HelixScene />
      </Canvas>
    </div>
  );
}
