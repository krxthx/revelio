"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Mesh } from "three";
import type { Chunk } from "@/lib/corpus";
import { COLORS, POINT_COLORS, POINT_OPACITY, POINT_RADIUS } from "@/lib/theme";

const SCALE_DEFAULT = 0.75;
const SCALE_HOVERED = 0.85;
const SCALE_RETRIEVED = 0.88;
const SCALE_CENTER = 1.05;
const SCALE_LERP_SPEED = 8;
const PULSE_SPEED = 0.004;
const PULSE_AMPLITUDE = 0.05;

const scoreToColor = (accentHex: string, t: number): string => {
  const accent = new Color(accentHex);
  const dim = new Color(COLORS.mutedForeground);
  return "#" + dim.clone().lerp(accent, t).getHexString();
};

interface Props {
  chunk: Chunk;
  isRetrieved: boolean;
  isCenter: boolean;
  isDimmed: boolean;
  streaming: boolean;
  retrievedColor: string;
  retrievalScore?: number;
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
  retrievalScore,
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

  const scoredColor = useMemo(() => {
    if (!isRetrieved || retrievalScore === undefined) return retrievedColor;
    return scoreToColor(retrievedColor, retrievalScore);
  }, [isRetrieved, retrievalScore, retrievedColor]);

  const color = isCenter
    ? "#ffffff"
    : isRetrieved
    ? scoredColor
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

  const roughness = isCenter ? 0 : isRetrieved ? 0.05 : hovered ? 0.05 : isDimmed ? 0.35 : 0.1;
  const metalness = isCenter ? 0.85 : isRetrieved ? 0.35 : hovered ? 0.9 : isDimmed ? 0.55 : 0.82;
  const clearcoat = isDimmed ? 0.3 : 1.0;
  const boostedEmissive = isRetrieved && retrievalScore !== undefined
    ? retrievalScore * 0.9
    : isCenter ? 0.35 : 0;

  return (
    <mesh
      ref={meshRef}
      position={[chunk.x, chunk.y, chunk.z]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(chunk); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
      onClick={(e) => { e.stopPropagation(); onClick?.(chunk); }}
    >
      <sphereGeometry args={[radius, 22, 16]} />
      <meshPhysicalMaterial
        color={color}
        opacity={opacity}
        transparent={opacity < 1}
        roughness={roughness}
        metalness={metalness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.05}
        emissive={isRetrieved ? scoredColor : isCenter ? "#ffffff" : "#000000"}
        emissiveIntensity={boostedEmissive}
      />
    </mesh>
  );
};

export default ChunkPoint;
