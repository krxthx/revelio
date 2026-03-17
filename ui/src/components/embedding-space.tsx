"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import ChunkPoint from "./chunk-point";
import WordGraph from "./word-graph";
import type { Chunk } from "@/lib/corpus";
import { COLORS } from "@/lib/theme";

const CAMERA_POSITION: [number, number, number] = [0, 0, 18];
const CAMERA_FOV = 55;
const AMBIENT_INTENSITY = 0.35;
const POINT_LIGHT_INTENSITY = 120;
const POINT_LIGHT_POSITION: [number, number, number] = [10, 10, 10];

const EDGE_MAX_DIST_SQ = 0.32 * 0.32;
const RETRIEVED_EDGE_MAX_DIST_SQ = 0.9 * 0.9;

interface EdgeProps {
  chunks: Chunk[];
  retrievedIds: Set<string>;
  retrievedColor: string;
}

const ChunkEdges = ({ chunks, retrievedIds, retrievedColor }: EdgeProps) => {
  const hasRetrieval = retrievedIds.size > 0;

  const defaultGeo = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < chunks.length; i++) {
      for (let j = i + 1; j < chunks.length; j++) {
        const dx = chunks[i].x - chunks[j].x;
        const dy = chunks[i].y - chunks[j].y;
        const dz = chunks[i].z - chunks[j].z;
        if (dx * dx + dy * dy + dz * dz < EDGE_MAX_DIST_SQ) {
          positions.push(chunks[i].x, chunks[i].y, chunks[i].z);
          positions.push(chunks[j].x, chunks[j].y, chunks[j].z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [chunks]);

  const retrievedGeo = useMemo(() => {
    if (retrievedIds.size === 0) return null;
    const retrieved = chunks.filter((c) => retrievedIds.has(c.id));
    const positions: number[] = [];
    for (let i = 0; i < retrieved.length; i++) {
      for (let j = i + 1; j < retrieved.length; j++) {
        const dx = retrieved[i].x - retrieved[j].x;
        const dy = retrieved[i].y - retrieved[j].y;
        const dz = retrieved[i].z - retrieved[j].z;
        if (dx * dx + dy * dy + dz * dz < RETRIEVED_EDGE_MAX_DIST_SQ) {
          positions.push(retrieved[i].x, retrieved[i].y, retrieved[i].z);
          positions.push(retrieved[j].x, retrieved[j].y, retrieved[j].z);
        }
      }
    }
    if (positions.length === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [chunks, retrievedIds]);

  const accentMatRef = useRef<THREE.LineBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (accentMatRef.current && hasRetrieval) {
      accentMatRef.current.opacity = 0.38 + Math.sin(clock.getElapsedTime() * 1.4) * 0.14;
    }
  });

  return (
    <>
      <lineSegments geometry={defaultGeo}>
        <lineBasicMaterial
          color={COLORS.mutedForeground}
          opacity={hasRetrieval ? 0.07 : 0.15}
          transparent
        />
      </lineSegments>
      {retrievedGeo && (
        <lineSegments geometry={retrievedGeo}>
          <lineBasicMaterial ref={accentMatRef} color={retrievedColor} opacity={0.45} transparent />
        </lineSegments>
      )}
    </>
  );
};

const ZOOM_DISTANCE = 6;
const CAMERA_LERP_SPEED = 0.055;

interface CameraControllerProps {
  focusTarget: [number, number, number] | null;
  autoRotate: boolean;
}

const CameraController = ({ focusTarget, autoRotate }: CameraControllerProps) => {
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const animTargetPos = useRef(new THREE.Vector3(...CAMERA_POSITION));
  const animTargetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  useEffect(() => {
    if (focusTarget) {
      const ft = new THREE.Vector3(...focusTarget);
      const dir = camera.position.clone().sub(ft).normalize();
      animTargetPos.current.copy(ft).addScaledVector(dir, ZOOM_DISTANCE);
      animTargetLook.current.copy(ft);
    } else {
      animTargetPos.current.set(...CAMERA_POSITION);
      animTargetLook.current.set(0, 0, 0);
    }
    isAnimating.current = true;
  // camera intentionally excluded — we only want direction at the moment focus changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTarget]);

  useFrame(() => {
    if (!isAnimating.current || !controlsRef.current) return;
    camera.position.lerp(animTargetPos.current, CAMERA_LERP_SPEED);
    controlsRef.current.target.lerp(animTargetLook.current, CAMERA_LERP_SPEED);
    controlsRef.current.update();
    if (
      camera.position.distanceTo(animTargetPos.current) < 0.01 &&
      controlsRef.current.target.distanceTo(animTargetLook.current) < 0.01
    ) {
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      autoRotate={autoRotate}
      autoRotateSpeed={-0.5}
    />
  );
};

interface Props {
  chunks: Chunk[];
  retrievedIds: Set<string>;
  /** Normalized scores [0, 1] per chunk id — 1 = highest scorer in the retrieved set. */
  retrievedScores?: Map<string, number>;
  streaming: boolean;
  retrievedColor: string;
  onHoverChunk: (chunk: Chunk | null) => void;
  onClickChunk?: (chunk: Chunk) => void;
  graphCenter?: Chunk;
  graphNeighbors?: Chunk[];
  autoRotate?: boolean;
  focusTarget?: [number, number, number] | null;
}

const EmbeddingSpace = ({
  chunks,
  retrievedIds,
  retrievedScores,
  streaming,
  retrievedColor,
  onHoverChunk,
  onClickChunk,
  graphCenter,
  graphNeighbors,
  autoRotate = true,
  focusTarget = null,
}: Props) => {
  const hasRetrieval = retrievedIds.size > 0;

  return (
    <Canvas
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      style={{ background: COLORS.background }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={AMBIENT_INTENSITY} />
      <hemisphereLight args={["#a8c0e8", "#1a1a2e", 0.7]} />
      <pointLight position={POINT_LIGHT_POSITION} intensity={POINT_LIGHT_INTENSITY} />
      <pointLight position={[-8, -6, -8]} intensity={40} color="#6080c0" />

      <Suspense fallback={null}>
        <ChunkEdges
          chunks={chunks}
          retrievedIds={retrievedIds}
          retrievedColor={retrievedColor}
        />
        {chunks.map((chunk) => (
          <ChunkPoint
            key={chunk.id}
            chunk={chunk}
            isRetrieved={retrievedIds.has(chunk.id) && chunk.id !== graphCenter?.id}
            isCenter={chunk.id === graphCenter?.id}
            isDimmed={hasRetrieval && !retrievedIds.has(chunk.id)}
            streaming={streaming}
            retrievedColor={retrievedColor}
            retrievalScore={retrievedScores?.get(chunk.id)}
            onHover={onHoverChunk}
            onClick={onClickChunk}
          />
        ))}
        {graphCenter && graphNeighbors && graphNeighbors.length > 0 && (
          <WordGraph
            center={graphCenter}
            neighbors={graphNeighbors}
            color={retrievedColor}
          />
        )}
      </Suspense>

      <CameraController focusTarget={focusTarget} autoRotate={autoRotate} />
    </Canvas>
  );
};

export default EmbeddingSpace;
