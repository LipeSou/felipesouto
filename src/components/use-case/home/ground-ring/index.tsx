"use client";

import { motion, type MotionValue } from "framer-motion";
import { ORBIT_TILT } from "../techs/solar-system/orbit-math";

type GroundRingProps = {
  visible: boolean;
  // Cada incremento dispara uma ondulação (impacto do pouso).
  pulseKey: number;
  opacity?: MotionValue<number>;
};

const RX = 100;
const RY = RX * ORBIT_TILT;

const ring = {
  fill: "none",
  stroke: "var(--color-primary-600)",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke" as const,
};

// "Chão" do avatar: anéis no mesmo traço das órbitas da seção de techs.
// O wrapper repete o retângulo do canvas do avatar (ver page.tsx); com a
// câmera atual os pés ficam a 80% da altura dele. É DOM e pertence à
// seção, então rola com ela enquanto o avatar (sticky) fica: ele "cai"
// da plataforma do hero e pousa na das techs.
export function GroundRing({ visible, pulseKey, opacity }: GroundRingProps) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute bottom-28 left-0 h-[55vh] w-full md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[40vw]"
      style={{ opacity }}
    >
      <svg
        viewBox={`${-RX} ${-RY} ${RX * 2} ${RY * 2}`}
        className="absolute left-1/2 top-[80%] h-[17%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        {[1, 0.62].map((size, index) => (
          <motion.ellipse
            key={size}
            {...ring}
            rx={RX * size}
            ry={RY * size}
            initial={{ pathLength: 0, strokeOpacity: 0 }}
            animate={{
              pathLength: visible ? 1 : 0,
              strokeOpacity: visible ? (index === 0 ? 0.75 : 0.45) : 0,
            }}
            transition={{
              duration: visible ? 0.9 : 0.3,
              delay: visible ? index * 0.12 : 0,
              ease: "easeInOut",
            }}
          />
        ))}
        {pulseKey > 0 && (
          <motion.ellipse
            key={pulseKey}
            {...ring}
            rx={RX * 0.62}
            ry={RY * 0.62}
            initial={{ scale: 0.7, strokeOpacity: 0.9 }}
            animate={{ scale: 2.2, strokeOpacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </svg>
    </motion.div>
  );
}
