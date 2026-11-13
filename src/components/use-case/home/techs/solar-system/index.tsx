"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";
import { techOrbits } from "@/app/constants/myTechs";
import {
  ellipsePoint,
  lerp,
  ORBIT_ROLL_DEG,
  ORBIT_TILT,
  type Placement,
} from "./orbit-math";
import { Planet } from "./planet";

// Quanto o sistema "cresce" quando a câmera mergulha num planeta.
const DIVE_SCALE = 3;

export type FocusOrigin = { x: number; y: number; scale: number };

type SolarSystemProps = {
  placements: Placement[];
  clock: MotionValue<number>;
  reveal: MotionValue<number>;
  focus: MotionValue<number>;
  stage: number;
  planetSize: number;
  active: boolean;
  interactive: boolean;
  hoveredId: string | null;
  shownId: string | null;
  // Posição do planeta escolhido no instante do clique e para onde ele vai,
  // ambos relativos ao centro do palco.
  origin: RefObject<FocusOrigin>;
  anchor: { x: number; y: number };
  onHover: (id: string | null) => void;
  onStageHover: (hovering: boolean) => void;
  onSelect: (id: string) => void;
};

export function SolarSystem({
  placements,
  clock,
  reveal,
  focus,
  stage,
  planetSize,
  active,
  interactive,
  hoveredId,
  shownId,
  origin,
  anchor,
  onHover,
  onStageHover,
  onSelect,
}: SolarSystemProps) {
  // O grupo escala em torno do centro e translada de modo que o planeta
  // escolhido chegue exatamente na âncora: p -> s·p + T.
  const groupScale = useTransform(focus, (f) => Math.pow(DIVE_SCALE, f));
  const groupX = useTransform(focus, (f) => {
    const p = origin.current;
    return lerp(p.x, anchor.x, f) - Math.pow(DIVE_SCALE, f) * p.x;
  });
  const groupY = useTransform(focus, (f) => {
    const p = origin.current;
    return lerp(p.y, anchor.y, f) - Math.pow(DIVE_SCALE, f) * p.y;
  });
  const groupOpacity = useTransform(focus, [0, 0.45], [1, 0]);

  const hoveredOrbit =
    placements.find((p) => p.tech.id === hoveredId)?.tech.orbit ?? null;
  const sunSize = stage * 0.13;

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        x: groupX,
        y: groupY,
        scale: groupScale,
        opacity: groupOpacity,
        pointerEvents: interactive ? "auto" : "none",
      }}
      onPointerEnter={() => onStageHover(true)}
      onPointerLeave={() => onStageHover(false)}
    >
      {/* Área de hover do palco: entrar aqui desacelera a rotação. */}
      <div
        aria-hidden
        className="absolute rounded-[50%]"
        style={{
          width: stage,
          height: stage * 0.62,
          left: -stage / 2,
          top: -stage * 0.31,
          rotate: `${ORBIT_ROLL_DEG}deg`,
          background:
            "radial-gradient(closest-side, var(--color-foreground-blue) 0%, transparent 100%)",
        }}
      />

      <svg
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
        width={stage}
        height={stage}
        viewBox={`${-stage / 2} ${-stage / 2} ${stage} ${stage}`}
        style={{ left: -stage / 2, top: -stage / 2 }}
      >
        <g transform={`rotate(${ORBIT_ROLL_DEG})`}>
          {techOrbits.map((orbit, index) => (
            <motion.ellipse
              key={orbit.label}
              cx={0}
              cy={0}
              rx={orbit.radius * stage}
              ry={orbit.radius * stage * ORBIT_TILT}
              fill="none"
              stroke="var(--color-primary-600)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, strokeOpacity: 0 }}
              animate={{
                pathLength: active ? 1 : 0,
                strokeOpacity: !active ? 0 : hoveredOrbit === index ? 1 : 0.4,
              }}
              transition={{
                pathLength: {
                  duration: active ? 1.1 : 0.4,
                  delay: active ? index * 0.15 : 0,
                  ease: "easeInOut",
                },
                strokeOpacity: { duration: 0.3 },
              }}
            />
          ))}
        </g>
      </svg>

      {/* Microrrótulos: explicam o que cada anel significa. */}
      {techOrbits.map((orbit, index) => {
        const p = ellipsePoint(orbit.radius * stage, -1.25);
        return (
          <motion.span
            key={orbit.label}
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-background px-1.5 font-secondary text-[10px] uppercase tracking-[0.18em] text-primary-800"
            style={{ left: p.x, top: p.y }}
            animate={{ opacity: active ? (hoveredOrbit === index ? 1 : 0.7) : 0 }}
            transition={{ duration: 0.4, delay: active ? 0.6 + index * 0.15 : 0 }}
          >
            {orbit.label}
          </motion.span>
        );
      })}

      <motion.div
        aria-hidden
        className="absolute flex items-center justify-center rounded-full font-secondary font-bold text-primary-900"
        style={{
          width: sunSize,
          height: sunSize,
          left: -sunSize / 2,
          top: -sunSize / 2,
          zIndex: 20,
          fontSize: sunSize * 0.3,
          background:
            "radial-gradient(circle at 35% 30%, var(--color-primary-400) 0%, var(--color-primary-600) 78%)",
          boxShadow:
            "0 18px 40px -12px color-mix(in srgb, var(--color-primary-600) 70%, transparent), 0 0 0 10px color-mix(in srgb, var(--color-primary-400) 35%, transparent)",
        }}
        animate={{ scale: active ? [1, 1.05, 1] : 0.6, opacity: active ? 1 : 0 }}
        transition={{
          scale: active
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 },
          opacity: { duration: 0.4 },
        }}
      >
        {"</>"}
      </motion.div>

      {placements.map((placement) => (
        <Planet
          key={placement.tech.id}
          placement={placement}
          clock={clock}
          reveal={reveal}
          stage={stage}
          size={planetSize}
          hovered={hoveredId === placement.tech.id}
          dimmed={hoveredId !== null && hoveredId !== placement.tech.id}
          hidden={shownId === placement.tech.id}
          interactive={interactive}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </motion.div>
  );
}
