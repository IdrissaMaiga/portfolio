"use client";

import { useRef, useMemo, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Stars,
  Sparkles,
  OrbitControls,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Code Character Particle Textures
// ---------------------------------------------------------------------------

function createCodeCharTexture(char: string, color: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = color;
  ctx.font = "bold 28px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Code Particle Group — a sphere of particles using a code-character texture
// ---------------------------------------------------------------------------

function CodeParticleGroup({
  texture,
  count,
  seed,
  clickPulse,
}: {
  texture: THREE.CanvasTexture;
  count: number;
  seed: number;
  clickPulse: React.MutableRefObject<number>;
}) {
  const points = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    // Offset each group so particles don't fully overlap
    const offset = seed * 0.1;

    for (let i = 0; i < count; i++) {
      const idx = i + seed * count;
      const theta = (2 * Math.PI * idx) / goldenRatio;
      const phi = Math.acos(1 - (2 * (idx + 0.5)) / (count * 6));
      const r = 2.5 + (Math.random() - 0.5) * 0.8 + offset * 0.2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const hue = 0.55 + Math.random() * 0.2;
      const saturation = 0.6 + Math.random() * 0.3;
      const lightness = 0.5 + Math.random() * 0.3;
      color.setHSL(hue, saturation, lightness);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, [count, seed]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    const { pointer } = state;

    points.current.rotation.y = time * 0.05 + seed * 0.3;

    const targetRotX = pointer.y * 0.5;
    const targetRotZ = -pointer.x * 0.5;
    points.current.rotation.x +=
      (targetRotX - points.current.rotation.x) * 0.04;
    points.current.rotation.z +=
      (targetRotZ - points.current.rotation.z) * 0.04;

    const breathingScale = 1 + Math.sin(time * 0.5 + seed) * 0.03;
    const pulseVal = clickPulse.current;
    const pulseScale = 1 + pulseVal * 0.15;

    points.current.scale.setScalar(breathingScale * pulseScale);
  });

  return (
    <points ref={points}>
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
        size={0.045}
        map={texture}
        alphaMap={texture}
        alphaTest={0.1}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Orbital Ring
// ---------------------------------------------------------------------------

function OrbitalRing({ radius = 1.8, count = 800 }) {
  const points = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.3;
      const y = (Math.random() - 0.5) * 0.4;

      positions[i * 3] = r * Math.cos(angle);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(angle);

      color.setHSL(0.5 + Math.random() * 0.1, 0.9, 0.7);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, [count, radius]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = -time * 0.15;
    points.current.rotation.x = Math.PI * 0.15;
  });

  return (
    <points ref={points}>
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
        size={0.015}
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

// ---------------------------------------------------------------------------
// Floating Wireframe Shapes (reduced to 2)
// ---------------------------------------------------------------------------

function FloatingShapes() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-4, 1.5, -3]}>
          <torusGeometry args={[1.2, 0.3, 16, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[4.5, -1, -4]}>
          <icosahedronGeometry args={[1.44, 1]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      </Float>
    </>
  );
}

// ---------------------------------------------------------------------------
// Floating Code Panel
// ---------------------------------------------------------------------------

function FloatingCodePanel({
  code,
  language,
  position,
  floatSpeed = 0.8,
}: {
  code: string;
  language: string;
  position: [number, number, number];
  floatSpeed?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={1}>
      <group position={position}>
        <Html
          transform
          occlude
          distanceFactor={8}
          style={{
            transition: "all 0.3s ease",
            opacity: hovered ? 1 : 0.7,
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: 220,
              borderRadius: 8,
              overflow: "hidden",
              background: "rgba(10, 15, 30, 0.9)",
              border: hovered
                ? "1px solid rgba(96, 165, 250, 0.5)"
                : "1px solid rgba(255,255,255,0.1)",
              boxShadow: hovered
                ? "0 0 30px rgba(96, 165, 250, 0.2)"
                : "none",
              backdropFilter: "blur(8px)",
              userSelect: "none",
            }}
          >
            {/* Title bar with traffic light dots */}
            <div
              style={{
                padding: "6px 10px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: "#9ca3af",
                  fontFamily: "monospace",
                }}
              >
                {language}
              </span>
            </div>
            {/* Code content */}
            <pre
              style={{
                padding: 10,
                margin: 0,
                fontSize: 11,
                lineHeight: 1.5,
                fontFamily: "'Courier New', monospace",
                color: "#e2e8f0",
                whiteSpace: "pre",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{ __html: code }}
            />
          </div>
        </Html>
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Code Panel Data (syntax-highlighted via inline spans)
// ---------------------------------------------------------------------------

const CODE_PANELS: {
  code: string;
  language: string;
  position: [number, number, number];
  floatSpeed: number;
}[] = [
  {
    language: "python",
    position: [-5, 1.5, -2],
    floatSpeed: 0.7,
    code: `<span style="color:#c586c0">async def</span> <span style="color:#dcdcaa">get_grades</span>(<span style="color:#9cdcfe">self</span>):
    response = <span style="color:#c586c0">await</span> <span style="color:#9cdcfe">self</span>.client.get(
        <span style="color:#ce9178">"/api/grades/all"</span>,
        headers=<span style="color:#9cdcfe">self</span>.auth_headers
    )
    <span style="color:#c586c0">return</span> response.json()`,
  },
  {
    language: "typescript",
    position: [5, 0.5, -1.5],
    floatSpeed: 0.9,
    code: `<span style="color:#c586c0">export async function</span> <span style="color:#dcdcaa">POST</span>(req: NextRequest) {
  <span style="color:#c586c0">const</span> { userCommand } = <span style="color:#c586c0">await</span> req.json();
  <span style="color:#c586c0">const</span> response = <span style="color:#c586c0">await</span> gemini
    .generateContent(userCommand);
  <span style="color:#c586c0">return</span> NextResponse.json(response);
}`,
  },
  {
    language: "java",
    position: [-4, -2, -1],
    floatSpeed: 0.6,
    code: `<span style="color:#dcdcaa">@PostMapping</span>(<span style="color:#ce9178">"/api/match"</span>)
<span style="color:#c586c0">public</span> ResponseEntity&lt;List&lt;Match&gt;&gt; <span style="color:#dcdcaa">findMatches</span>(
    <span style="color:#dcdcaa">@RequestBody</span> MatchRequest request) {
    <span style="color:#c586c0">return</span> ResponseEntity.ok(
        matchService.findByProfile(request)
    );
}`,
  },
];

// ---------------------------------------------------------------------------
// Mouse-Following Light
// ---------------------------------------------------------------------------

function MouseLight() {
  const light = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    target.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      3
    );
    light.current.position.lerp(target, 0.08);
  });

  return (
    <pointLight ref={light} intensity={2.5} color="#60a5fa" distance={10} />
  );
}

// ---------------------------------------------------------------------------
// Mouse-Following Sparkles
// ---------------------------------------------------------------------------

function MouseSparkles() {
  const groupRef = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    target.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      3
    );
    groupRef.current.position.lerp(target, 0.08);
  });

  return (
    <group ref={groupRef}>
      <Sparkles count={20} size={1} speed={0.5} color="#22d3ee" scale={2} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene Content
// ---------------------------------------------------------------------------

function SceneContent({
  clickPulse,
}: {
  clickPulse: React.MutableRefObject<number>;
}) {
  // Create 6 code character textures
  const codeTextures = useMemo(() => {
    if (typeof document === "undefined") return [];
    const chars = ["{ }", "=>", "< />", "fn()", "if", "[ ]"];
    const colors = [
      "#60a5fa",
      "#34d399",
      "#a78bfa",
      "#f472b6",
      "#fbbf24",
      "#22d3ee",
    ];
    return chars.map((char, i) => createCodeCharTexture(char, colors[i]));
  }, []);

  // Decay click pulse in a single frame callback
  useFrame(() => {
    if (clickPulse.current > 0) {
      clickPulse.current = Math.max(0, clickPulse.current - 0.035);
    }
  });

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 8, 30]} />

      <ambientLight intensity={0.08} />
      <MouseLight />
      <MouseSparkles />

      {/* Code Character Particle Sphere */}
      <group position={[1.5, -0.2, 0]}>
        {codeTextures.map(
          (tex, i) =>
            tex && (
              <CodeParticleGroup
                key={i}
                texture={tex}
                count={500}
                seed={i}
                clickPulse={clickPulse}
              />
            )
        )}
        <OrbitalRing />
      </group>

      {/* Floating Code Panels */}
      {CODE_PANELS.map((panel, i) => (
        <FloatingCodePanel
          key={i}
          code={panel.code}
          language={panel.language}
          position={panel.position}
          floatSpeed={panel.floatSpeed}
        />
      ))}

      {/* About Me Info Cards in 3D Space */}
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={1.2}>
        <Html transform distanceFactor={8} position={[4.5, 2.5, -3]} style={{ pointerEvents: "auto" }}>
          <div style={{ width: 200, background: "rgba(10,15,30,0.92)", border: "1px solid rgba(34,211,238,0.3)", borderRadius: 10, padding: 14, backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, color: "#22d3ee", fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>{"// About Me"}</div>
            <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.6 }}>
              <div><span style={{ color: "#9ca3af" }}>name:</span> Idrissa Maiga</div>
              <div><span style={{ color: "#9ca3af" }}>role:</span> Full-Stack Engineer</div>
              <div><span style={{ color: "#9ca3af" }}>from:</span> Bamako, Mali</div>
              <div><span style={{ color: "#9ca3af" }}>based:</span> Budapest, HU</div>
              <div><span style={{ color: "#9ca3af" }}>gpa:</span> 8.7 / 10</div>
            </div>
          </div>
        </Html>
      </Float>

      <Float speed={0.5} rotationIntensity={0.15} floatIntensity={1}>
        <Html transform distanceFactor={9} position={[-5.5, -0.5, -2.5]} style={{ pointerEvents: "auto" }}>
          <div style={{ width: 190, background: "rgba(10,15,30,0.92)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 10, padding: 14, backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>{"// Skills"}</div>
            <div style={{ fontSize: 11, color: "#d1d5db", lineHeight: 1.7, fontFamily: "monospace" }}>
              <div>Java &middot; TypeScript &middot; Python</div>
              <div>Spring Boot &middot; React &middot; Next.js</div>
              <div>PostgreSQL &middot; MongoDB &middot; AWS</div>
              <div>Docker &middot; AI/ML &middot; LangChain</div>
            </div>
          </div>
        </Html>
      </Float>

      <Float speed={0.7} rotationIntensity={0.25} floatIntensity={1.3}>
        <Html transform distanceFactor={10} position={[5, -2, -2]} style={{ pointerEvents: "auto" }}>
          <div style={{ width: 200, background: "rgba(10,15,30,0.92)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 10, padding: 14, backdropFilter: "blur(12px)" }}>
            <div style={{ fontSize: 11, color: "#34d399", fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>{"// Experience"}</div>
            <div style={{ fontSize: 11, color: "#d1d5db", lineHeight: 1.7 }}>
              <div style={{ marginBottom: 6 }}>
                <div style={{ color: "#e2e8f0", fontWeight: 600 }}>4D Consulting</div>
                <div style={{ color: "#9ca3af", fontSize: 10 }}>Software Dev Intern &middot; 2025–Present</div>
              </div>
              <div>
                <div style={{ color: "#e2e8f0", fontWeight: 600 }}>EISMEA</div>
                <div style={{ color: "#9ca3af", fontSize: 10 }}>Full Stack Engineer &middot; Jan–Jul 2025</div>
              </div>
            </div>
          </div>
        </Html>
      </Float>

      {/* Wireframe Shapes */}
      <FloatingShapes />

      {/* Background Stars */}
      <Stars
        radius={60}
        depth={60}
        count={2500}
        factor={4}
        saturation={0.3}
        fade
        speed={0.8}
      />
      <Sparkles
        count={60}
        scale={15}
        size={1.5}
        speed={0.3}
        color="#60a5fa"
        opacity={0.4}
      />

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Exported Component
// ---------------------------------------------------------------------------

export default function Hero3DScene() {
  const clickPulse = useRef(0);

  const handleClick = useCallback(() => {
    clickPulse.current = 1;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onClick={handleClick}
    >
      <Suspense fallback={null}>
        <SceneContent clickPulse={clickPulse} />
      </Suspense>
    </Canvas>
  );
}
