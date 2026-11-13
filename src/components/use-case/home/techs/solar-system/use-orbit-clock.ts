"use client";

import { useAnimationFrame, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

// Relógio das órbitas em MotionValue: avança fora do ciclo de render do
// React. `targetSpeed` é amortecido (1 = normal, 0 = parado) para que
// desacelerar no hover pareça inércia, não um corte. `frozen` para na hora.
export function useOrbitClock(targetSpeed: number, frozen: boolean) {
  const clock = useMotionValue(0);
  const speed = useRef(0);
  const target = useRef(targetSpeed);
  const isFrozen = useRef(frozen);

  useEffect(() => {
    target.current = targetSpeed;
    isFrozen.current = frozen;
  }, [targetSpeed, frozen]);

  useAnimationFrame((_, delta) => {
    if (isFrozen.current) {
      speed.current = 0;
      return;
    }
    const dt = Math.min(delta, 64) / 1000;
    speed.current += (target.current - speed.current) * (1 - Math.exp(-5 * dt));
    if (Math.abs(speed.current) < 0.0005) return;
    clock.set(clock.get() + dt * speed.current);
  });

  return clock;
}
