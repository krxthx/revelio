"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { COLORS } from "@/lib/theme";

// Deterministic pseudo-random so the cloud is stable across renders
const rand = (seed: number): number => {
  let s = (seed + 1) * 2654435761;
  s ^= s << 13;
  s ^= s >> 17;
  s ^= s << 5;
  return (s >>> 0) / 4294967296;
};

type Pt = { x: number; y: number; z: number; accent: boolean };

const CLUSTER_CENTERS: [number, number, number][] = [
  [5, 2, 1],
  [-5, -2, 1],
  [0, 5, -2],
  [4, -4, 0],
  [-4, 1, 5],
  [1, -1, -5],
  [-2, 5, -1],
  [5, -1, 3],
  [0, -5, 2],
  [-1, 2, -5],
];

const POINTS: Pt[] = CLUSTER_CENTERS.flatMap(([cx, cy, cz], ci) =>
  Array.from({ length: 28 }, (_, i) => {
    const idx = ci * 28 + i;
    return {
      x: cx + (rand(idx * 3 + 0) - 0.5) * 4,
      y: cy + (rand(idx * 3 + 1) - 0.5) * 4,
      z: cz + (rand(idx * 3 + 2) - 0.5) * 4,
      accent: i < 2 && ci % 3 === 0,
    };
  }),
);

const Dot = ({ x, y, z, accent, accentColor }: Pt & { accentColor: string }) => (
  <mesh position={[x, y, z]}>
    <sphereGeometry args={[accent ? 0.1 : 0.07, 8, 8]} />
    <meshStandardMaterial
      color={accent ? accentColor : COLORS.mutedForeground}
      opacity={accent ? 1.0 : 0.75}
      transparent
    />
  </mesh>
);

interface Props {
  accentColor: string;
  onReady?: () => void;
}

const LandingCanvas = ({ accentColor, onReady }: Props) => (
  <Canvas
    camera={{ position: [0, 0, 24], fov: 55 }}
    style={{ background: COLORS.background }}
    gl={{ antialias: true }}
    onCreated={() => onReady?.()}
  >
    <ambientLight intensity={0.6} />
    <pointLight position={[10, 10, 10]} intensity={80} />
    <Suspense fallback={null}>
      {POINTS.map((p, i) => (
        <Dot key={i} {...p} accentColor={accentColor} />
      ))}
    </Suspense>
    <OrbitControls
      enableDamping
      dampingFactor={0.05}
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.4}
    />
  </Canvas>
);

export default LandingCanvas;
