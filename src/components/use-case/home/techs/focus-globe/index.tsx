"use client";

import {
  AnimatePresence,
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { RefObject } from "react";
import type { Tech } from "@/types/tech";
import { lerp, planetFaceStyle } from "../solar-system/orbit-math";
import type { FocusOrigin } from "../solar-system";

const DOT_GRID = 16;

type FocusGlobeProps = {
  tech: Tech;
  focus: MotionValue<number>;
  origin: RefObject<FocusOrigin>;
  anchor: { x: number; y: number };
  globeSize: number;
  planetSize: number;
  // Lado visível do globo: recebe o brilho e a marca d'água.
  litSide: "right" | "bottom";
  reducedMotion: boolean;
};

// O planeta escolhido, fora do grupo do sistema: viaja da órbita até a
// âncora enquanto cresce de "planetinha" até um globo que ocupa a tela.
export function FocusGlobe({
  tech,
  focus,
  origin,
  anchor,
  globeSize,
  planetSize,
  litSide,
  reducedMotion,
}: FocusGlobeProps) {
  const x = useTransform(focus, (f) => lerp(origin.current.x, anchor.x, f));
  const y = useTransform(focus, (f) => lerp(origin.current.y, anchor.y, f));
  // Interpolação geométrica: o zoom parece ter velocidade constante.
  const scale = useTransform(focus, (f) => {
    const start = (origin.current.scale * planetSize) / globeSize;
    return start * Math.pow(1 / start, f);
  });
  const tokenOpacity = useTransform(focus, [0, 0.35], [1, 0]);
  const surfaceOpacity = useTransform(focus, [0.05, 0.5], [0, 1]);

  const Icon = tech.icon;
  const c = tech.color;
  const highlight = litSide === "right" ? "68% 30%" : "38% 72%";
  const dotsMask =
    litSide === "right"
      ? "radial-gradient(circle at 74% 62%, black 0%, transparent 66%)"
      : "radial-gradient(circle at 56% 82%, black 0%, transparent 62%)";
  const box = {
    width: globeSize,
    height: globeSize,
    left: -globeSize / 2,
    top: -globeSize / 2,
  };

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0"
      style={{ x, y, scale }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={tech.id}
          className="absolute rounded-full"
          style={{
            ...box,
            background: `radial-gradient(circle at ${highlight}, color-mix(in srgb, ${c} 7%, white) 0%, color-mix(in srgb, ${c} 20%, white) 45%, color-mix(in srgb, ${c} 44%, white) 100%)`,
            boxShadow: `0 40px 120px -30px color-mix(in srgb, ${c} 55%, transparent), inset 0 0 0 1.5px color-mix(in srgb, ${c} 38%, white)`,
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{
              opacity: surfaceOpacity,
              maskImage: dotsMask,
              WebkitMaskImage: dotsMask,
            }}
          >
            {/* Textura pontilhada derivando devagar: sugere rotação. */}
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                width: globeSize + DOT_GRID * 10,
                opacity: 0.5,
                backgroundImage: `radial-gradient(circle, color-mix(in srgb, ${c} 72%, #0f0602) 1.3px, transparent 1.8px)`,
                backgroundSize: `${DOT_GRID}px ${DOT_GRID}px`,
              }}
              animate={reducedMotion ? undefined : { x: [0, -DOT_GRID * 10] }}
              transition={{ duration: 26, ease: "linear", repeat: Infinity }}
            />
          </motion.div>
          {Icon && (
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                opacity: surfaceOpacity,
                left: litSide === "right" ? "74%" : "50%",
                top: litSide === "right" ? "50%" : "80%",
                color: `color-mix(in srgb, ${c} 60%, white)`,
              }}
            >
              <Icon size={Math.round(globeSize * 0.2)} stroke={1} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cópia do planetinha por cima do globo: some nos primeiros 35%
          do mergulho, então a troca planeta -> globo é imperceptível. */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full"
        style={{ ...box, ...planetFaceStyle(c), opacity: tokenOpacity }}
      >
        {Icon ? (
          <Icon size={Math.round(globeSize * 0.52)} stroke={1.6} />
        ) : (
          <span
            className="font-secondary font-bold"
            style={{ fontSize: globeSize * 0.34 }}
          >
            {tech.name.slice(0, 2)}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
