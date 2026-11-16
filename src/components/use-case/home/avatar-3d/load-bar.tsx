"use client";

import { useProgress } from "@react-three/drei";

// Linha fina no topo enquanto o modelo e as animações do avatar carregam.
export function LoadBar({ hidden }: { hidden: boolean }) {
  const { progress } = useProgress();

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-0.5 origin-left bg-primary-600 transition-[transform,opacity] duration-300 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      style={{ transform: `scaleX(${Math.max(progress, 4) / 100})` }}
    />
  );
}
