import type { CSSProperties } from "react";
import { techOrbits } from "@/app/constants/myTechs";
import type { Tech } from "@/types/tech";

// O plano das órbitas é "deitado" (TILT achata o eixo vertical) e o
// sistema inteiro é girado alguns graus (ROLL) para ganhar dinamismo.
export const ORBIT_TILT = 0.42;
export const ORBIT_ROLL_DEG = -16;
const ROLL = (ORBIT_ROLL_DEG * Math.PI) / 180;
const COS = Math.cos(ROLL);
const SIN = Math.sin(ROLL);

export type Placement = {
  tech: Tech;
  baseAngle: number;
  radius: number;
  angularSpeed: number;
};

export type OrbitPoint = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Distribui as techs igualmente em cada órbita, na ordem do array.
export function buildPlacements(techs: Tech[]): Placement[] {
  const counts = techOrbits.map(
    (_, orbit) => techs.filter((t) => t.orbit === orbit).length
  );
  const seen = techOrbits.map(() => 0);

  return techs.map((tech) => {
    const orbit = techOrbits[tech.orbit];
    const index = seen[tech.orbit]++;
    return {
      tech,
      baseAngle:
        (index / counts[tech.orbit]) * Math.PI * 2 + tech.orbit * 0.9 + 0.4,
      radius: orbit.radius,
      angularSpeed: (Math.PI * 2) / orbit.period,
    };
  });
}

// Entrada escalonada por órbita, com um leve overshoot antes de assentar.
export function revealFor(orbit: number, reveal: number) {
  const t = clamp((reveal - orbit * 0.18) / 0.64, 0, 1);
  const c = 1.2;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

export function ellipsePoint(radiusPx: number, theta: number) {
  const lx = radiusPx * Math.cos(theta);
  const ly = radiusPx * Math.sin(theta) * ORBIT_TILT;
  return { x: lx * COS - ly * SIN, y: lx * SIN + ly * COS };
}

export function orbitPoint(
  placement: Placement,
  clock: number,
  stage: number,
  reveal: number
): OrbitPoint {
  const theta = placement.baseAngle + clock * placement.angularSpeed;
  const revealed = revealFor(placement.tech.orbit, reveal);
  const { x, y } = ellipsePoint(placement.radius * stage * revealed, theta);
  // sin(theta) > 0 = metade da frente da órbita (mais perto do observador).
  const depth = Math.sin(theta);
  const grow = clamp(revealed * 1.4, 0, 1);

  return {
    x,
    y,
    scale: (1 + 0.14 * depth) * grow,
    opacity: clamp(revealed * 2, 0, 1) * (0.82 + 0.18 * ((depth + 1) / 2)),
    zIndex: depth > 0 ? 30 : 10,
  };
}

export function planetFaceStyle(color: string): CSSProperties {
  return {
    background: `color-mix(in srgb, ${color} 14%, white)`,
    border: `1px solid color-mix(in srgb, ${color} 34%, white)`,
    boxShadow: `0 10px 22px -8px color-mix(in srgb, ${color} 60%, transparent)`,
    color: `color-mix(in srgb, ${color} 82%, #0f0602)`,
  };
}
