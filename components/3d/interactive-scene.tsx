"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "./use-reduced-motion";
import { useDeviceTier } from "./use-device-tier";

function InteractiveParticles({ count, color, formation }: {
  count: number;
  color: string;
  formation: "sphere" | "helix" | "grid" | "ring" | "cube" | "spiral" | "wave" | "dna";
}) {
  const points = useRef<THREE.Points>(null!);
  const [hovered, setHovered] = useState(false);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      switch (formation) {
        case "sphere": {
          const phi = Math.acos(1 - 2 * (i + 0.5) / count);
          const theta = Math.PI * (1 + Math.sqrt(5)) * i;
          const r = 1.5 + (Math.random() - 0.5) * 0.3;
          pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i * 3 + 2] = r * Math.cos(phi);
          break;
        }
        case "helix": case "dna": {
          const t = (i / count) * Math.PI * 6;
          const strand = i % 2;
          const r = formation === "dna" ? 1.0 + Math.sin(t * 0.5) * 0.3 : 1.2;
          pos[i * 3] = r * Math.cos(t + strand * Math.PI);
          pos[i * 3 + 1] = (i / count) * 4 - 2;
          pos[i * 3 + 2] = r * Math.sin(t + strand * Math.PI);
          break;
        }
        case "grid": {
          const cols = Math.ceil(Math.sqrt(count));
          const row = Math.floor(i / cols);
          const col = i % cols;
          pos[i * 3] = (col / cols - 0.5) * 3;
          pos[i * 3 + 1] = (row / cols - 0.5) * 3;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
          break;
        }
        case "ring": {
          const angle = (i / count) * Math.PI * 2;
          const r2 = 1.5 + (Math.random() - 0.5) * 0.3;
          pos[i * 3] = r2 * Math.cos(angle);
          pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
          pos[i * 3 + 2] = r2 * Math.sin(angle);
          break;
        }
        case "cube": {
          pos[i * 3] = (Math.random() - 0.5) * 2.5;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
          break;
        }
        case "spiral": {
          const t2 = (i / count) * Math.PI * 10;
          const r3 = 0.3 + (i / count) * 1.5;
          pos[i * 3] = r3 * Math.cos(t2);
          pos[i * 3 + 1] = (i / count) * 3 - 1.5;
          pos[i * 3 + 2] = r3 * Math.sin(t2);
          break;
        }
        case "wave": {
          const x = (i % 30) / 30 * 4 - 2;
          const z = Math.floor(i / 30) / (count / 30) * 4 - 2;
          pos[i * 3] = x;
          pos[i * 3 + 1] = Math.sin(x * 2) * Math.cos(z * 2) * 0.5;
          pos[i * 3 + 2] = z;
          break;
        }
      }
    }
    return pos;
  }, [count, formation]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.1;
    points.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    const scale = hovered ? 1.1 : 1.0;
    points.current.scale.setScalar(scale + Math.sin(time * 0.5) * 0.02);
  });

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <points
      ref={points}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={threeColor}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

type SceneStyle = "code" | "bio" | "showcase" | "tech" | "blog" | "connect";

const SCENE_CONFIGS: Record<SceneStyle, {
  shapes: { geo: "torus" | "icosahedron" | "octahedron" | "dodecahedron" | "torusKnot" | "cone"; pos: [number, number, number]; speed: number }[];
}> = {
  code: {
    shapes: [
      { geo: "torusKnot", pos: [-2, 0.5, -1], speed: 0.6 },
      { geo: "icosahedron", pos: [2, -0.5, -1.5], speed: 0.9 },
    ],
  },
  bio: {
    shapes: [
      { geo: "dodecahedron", pos: [-1.8, 0.8, -1], speed: 0.5 },
      { geo: "torus", pos: [2, -0.3, -1.5], speed: 0.7 },
      { geo: "octahedron", pos: [0, 1.5, -2], speed: 1.0 },
    ],
  },
  showcase: {
    shapes: [
      { geo: "cone", pos: [-2.5, 0, -1], speed: 0.8 },
      { geo: "torusKnot", pos: [2.5, 0, -1.5], speed: 0.5 },
    ],
  },
  tech: {
    shapes: [
      { geo: "icosahedron", pos: [-2, 1, -1], speed: 1.2 },
      { geo: "icosahedron", pos: [2, -1, -1.5], speed: 0.8 },
      { geo: "icosahedron", pos: [0, 0, -2], speed: 0.6 },
    ],
  },
  blog: {
    shapes: [
      { geo: "octahedron", pos: [-1.5, 0.5, -1], speed: 0.7 },
      { geo: "dodecahedron", pos: [1.5, -0.5, -1.5], speed: 0.9 },
    ],
  },
  connect: {
    shapes: [
      { geo: "torus", pos: [-2, 0, -1], speed: 0.4 },
      { geo: "torus", pos: [2, 0, -1], speed: 0.4 },
      { geo: "cone", pos: [0, 1.5, -2], speed: 0.6 },
    ],
  },
};

function SceneShape({ geo, color, position, speed }: {
  geo: string;
  color: string;
  position: [number, number, number];
  speed: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh position={position}>
        {geo === "torus" && <torusGeometry args={[0.6, 0.2, 16, 32]} />}
        {geo === "icosahedron" && <icosahedronGeometry args={[0.5, 1]} />}
        {geo === "octahedron" && <octahedronGeometry args={[0.5]} />}
        {geo === "dodecahedron" && <dodecahedronGeometry args={[0.5]} />}
        {geo === "torusKnot" && <torusKnotGeometry args={[0.4, 0.15, 64, 8]} />}
        {geo === "cone" && <coneGeometry args={[0.4, 0.8, 6]} />}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

interface InteractiveSceneProps {
  formation?: "sphere" | "helix" | "grid" | "ring" | "cube" | "spiral" | "wave" | "dna";
  color?: string;
  height?: string;
  className?: string;
  style?: SceneStyle;
}

export default function InteractiveScene({
  formation = "sphere",
  color = "#60a5fa",
  height = "300px",
  className = "",
  style = "code",
}: InteractiveSceneProps) {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();

  if (tier === "low") return null;

  const count = tier === "high" ? 400 : 200;
  const config = SCENE_CONFIGS[style];

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 4], fov: 50 }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} intensity={0.5} color={color} />
        <InteractiveParticles key={`${count}-${formation}`} count={count} color={color} formation={formation} />
        {config.shapes.map((s, i) => (
          <SceneShape key={i} geo={s.geo} color={color} position={s.pos} speed={s.speed} />
        ))}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reduced}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
        />
      </Canvas>
      <div className="absolute bottom-2 right-3 text-[10px] text-gray-600 pointer-events-none">
        Drag to explore
      </div>
    </div>
  );
}
