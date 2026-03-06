"use client";

import { Line } from "@react-three/drei";
import type { Chunk } from "@/lib/corpus";

interface Props {
  center: Chunk;
  neighbors: Chunk[];
  color: string;
}

const WordGraph = ({ center, neighbors, color }: Props) => {
  const from: [number, number, number] = [center.x, center.y, center.z];

  return (
    <>
      {neighbors.map((neighbor, i) => {
        const opacity = 0.7 - (i / neighbors.length) * 0.5;
        const to: [number, number, number] = [neighbor.x, neighbor.y, neighbor.z];
        return (
          <Line
            key={neighbor.id}
            points={[from, to]}
            color={color}
            lineWidth={1.2}
            transparent
            opacity={opacity}
          />
        );
      })}
    </>
  );
};

export default WordGraph;
