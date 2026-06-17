"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "./use-reduced-motion";
import { useDeviceTier } from "./use-device-tier";

function FloatingWireframes({ reducedMotion }: { reducedMotion: boolean }) {
  const floatSpeed = reducedMotion ? 0 : 1.5;

  return (
    <>
      {/* Torus - blue */}
      <Float
        speed={floatSpeed}
        rotationIntensity={reducedMotion ? 0 : 1.2}
        floatIntensity={reducedMotion ? 0 : 1.5}
      >
        <mesh position={[-2, 1, -2]}>
          <torusGeometry args={[0.8, 0.25, 16, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* Octahedron - cyan */}
      <Float
        speed={floatSpeed * 0.8}
        rotationIntensity={reducedMotion ? 0 : 1.5}
        floatIntensity={reducedMotion ? 0 : 1.2}
      >
        <mesh position={[2, -0.5, -3]}>
          <octahedronGeometry args={[0.7]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>

      {/* Dodecahedron - purple */}
      <Float
        speed={floatSpeed * 1.2}
        rotationIntensity={reducedMotion ? 0 : 1}
        floatIntensity={reducedMotion ? 0 : 1.8}
      >
        <mesh position={[0, 2, -4]}>
          <dodecahedronGeometry args={[0.5]} />
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function ContactParticles({
  className = "",
}: {
  className?: string;
}) {
  const tier = useDeviceTier();
  const reducedMotion = useReducedMotion();

  if (tier === "low") return null;

  return (
    <div
      className={className}
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent", pointerEvents: "none" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <FloatingWireframes reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
