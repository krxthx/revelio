"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import ChunkPoint from "./ChunkPoint";
import type { Chunk } from "@/lib/corpus";
import { COLORS } from "@/lib/theme";

const CAMERA_POSITION: [number, number, number] = [0, 0, 18];
const CAMERA_FOV = 55;
const AMBIENT_INTENSITY = 0.6;
const POINT_LIGHT_INTENSITY = 80;
const POINT_LIGHT_POSITION: [number, number, number] = [10, 10, 10];

interface Props {
  chunks: Chunk[];
  retrievedIds: Set<string>;
  streaming: boolean;
  onHoverChunk: (chunk: Chunk | null) => void;
}

export default function EmbeddingSpace({ chunks, retrievedIds, streaming, onHoverChunk }: Props) {
  const hasRetrieval = retrievedIds.size > 0;

  return (
    <Canvas
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      style={{ background: COLORS.background }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={AMBIENT_INTENSITY} />
      <pointLight position={POINT_LIGHT_POSITION} intensity={POINT_LIGHT_INTENSITY} />

      <Suspense fallback={null}>
        {chunks.map((chunk) => (
          <ChunkPoint
            key={chunk.id}
            chunk={chunk}
            isRetrieved={retrievedIds.has(chunk.id)}
            isDimmed={hasRetrieval && !retrievedIds.has(chunk.id)}
            streaming={streaming}
            onHover={onHoverChunk}
          />
        ))}
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
      />
    </Canvas>
  );
}
