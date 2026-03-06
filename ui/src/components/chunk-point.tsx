"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { Chunk } from "@/lib/corpus";
import { POINT_COLORS, POINT_OPACITY, POINT_RADIUS } from "@/lib/theme";

const SCALE_DEFAULT = 0.75;
const SCALE_HOVERED = 0.85;
const SCALE_RETRIEVED = 0.88;
const SCALE_CENTER = 1.05;
const SCALE_LERP_SPEED = 8;
const PULSE_SPEED = 0.004;
const PULSE_AMPLITUDE = 0.05;

interface Props {
  chunk: Chunk;
  isRetrieved: boolean;
  isCenter: boolean;
  isDimmed: boolean;
  streaming: boolean;
  retrievedColor: string;
  onHover: (chunk: Chunk | null) => void;
  onClick?: (chunk: Chunk) => void;
}

const ChunkPoint = ({
  chunk,
  isRetrieved,
  isCenter,
  isDimmed,
  streaming,
  retrievedColor,
  onHover,
  onClick,
}: Props) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const targetScale = isCenter ? SCALE_CENTER : isRetrieved ? SCALE_RETRIEVED : hovered ? SCALE_HOVERED : SCALE_DEFAULT;
  const radius = isCenter
    ? POINT_RADIUS.retrieved * 1.4
    : isRetrieved
    ? POINT_RADIUS.retrieved
    : hovered
    ? POINT_RADIUS.hovered
    : POINT_RADIUS.default;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const current = meshRef.current.scale.x;
    const next = current + (targetScale - current) * Math.min(delta * SCALE_LERP_SPEED, 1);
    const pulse = (isRetrieved || isCenter) && streaming ? 1 + Math.sin(Date.now() * PULSE_SPEED) * PULSE_AMPLITUDE : 1;
    meshRef.current.scale.setScalar(next * pulse);
  });

  const color = isCenter
    ? "#ffffff"
    : isRetrieved
    ? retrievedColor
    : hovered
    ? POINT_COLORS.hovered
    : isDimmed
    ? POINT_COLORS.dimmed
    : POINT_COLORS.default;

  const opacity = isCenter
    ? 1
    : isRetrieved
    ? POINT_OPACITY.retrieved
    : isDimmed
    ? POINT_OPACITY.dimmed
    : POINT_OPACITY.default;

  return (
    <mesh
      ref={meshRef}
      position={[chunk.x, chunk.y, chunk.z]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(chunk); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
      onClick={(e) => { e.stopPropagation(); onClick?.(chunk); }}
    >
      <sphereGeometry args={[radius, 8, 8]} />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        transparent
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
};

export default ChunkPoint;
