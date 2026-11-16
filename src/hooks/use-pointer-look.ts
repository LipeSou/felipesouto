"use client";

import type { MotionValue } from "framer-motion";
import { useEffect } from "react";

const clamp = (v: number) => Math.min(1, Math.max(-1, v));

// Converte a posição do cursor em "para onde o avatar olha" (-1 a 1 em
// cada eixo), relativo à posição aproximada da cabeça dele na tela.
// Desligado, o olhar volta ao centro.
export function usePointerLook(
  lookX: MotionValue<number>,
  lookY: MotionValue<number>,
  enabled: boolean
) {
  useEffect(() => {
    const reset = () => {
      lookX.set(0);
      lookY.set(0);
    };
    if (!enabled) {
      reset();
      return;
    }

    const onMove = (event: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Desktop: canvas nos 40vw da direita. Mobile: 55vh na base da tela.
      const desktop = w >= 768;
      const headX = desktop ? 0.8 * w : 0.5 * w;
      const headY = desktop ? 0.27 * h : 0.59 * h - 112;
      lookX.set(clamp((event.clientX - headX) / (w * 0.5)));
      lookY.set(clamp((event.clientY - headY) / (h * 0.5)));
    };
    // No toque não existe "cursor parado": ao soltar, volta ao centro.
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") reset();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [enabled, lookX, lookY]);
}
