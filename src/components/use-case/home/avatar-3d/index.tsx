"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import Avatar3DModel from "./avatar-3d-model";

type Avatar3DProps = {
  animation: string;
  progress: MotionValue<number>;
  // Cor da tech em foco; null = câmera na posição normal.
  focusColor: string | null;
  lookX: MotionValue<number>;
  lookY: MotionValue<number>;
  speaking: MotionValue<number>;
};

export function Avatar3D({
  animation,
  progress,
  focusColor,
  lookX,
  lookY,
  speaking,
}: Avatar3DProps) {
  function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 30 }}
        className="w-full h-full"
      >
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <ambientLight intensity={2} />
        <Suspense fallback={null}>
          <Avatar3DModel
            animation={animation}
            progress={progress}
            focusColor={focusColor}
            lookX={lookX}
            lookY={lookY}
            speaking={speaking}
          />
        </Suspense>
      </Canvas>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="absolute inset-0 pointer-events-none"></div>
      </Suspense>
    </div>
  );
}
