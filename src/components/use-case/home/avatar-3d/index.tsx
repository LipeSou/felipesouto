"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
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
  introY: MotionValue<number>;
  mood: MotionValue<number>;
  onReady?: () => void;
};

export function Avatar3D(props: Avatar3DProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 2, 5], fov: 30 }}
        className="h-full w-full"
      >
        {/* Estúdio procedural (sem baixar HDR): painéis de luz suaves dão
            volume ao rosto e à roupa em vez da luz ambiente chapada. */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={1.7}
            position={[0, 4, 4]}
            scale={[8, 5, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[-5, 1.5, 2]}
            scale={[4, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[5, 1.5, 2]}
            scale={[4, 6, 1]}
          />
          <Lightformer
            form="rect"
            color="#68cac9"
            intensity={3}
            position={[0, 2.5, -5]}
            scale={[8, 5, 1]}
          />
        </Environment>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} />
        {/* Contraluz na cor da marca: recorta a silhueta. */}
        <directionalLight position={[-3, 3, -4]} color="#68cac9" intensity={2.2} />
        <Suspense fallback={null}>
          <Avatar3DModel {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
