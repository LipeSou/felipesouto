"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  orbitPoint,
  planetFaceStyle,
  type OrbitPoint,
  type Placement,
} from "./orbit-math";

type PlanetProps = {
  placement: Placement;
  clock: MotionValue<number>;
  reveal: MotionValue<number>;
  stage: number;
  size: number;
  hovered: boolean;
  dimmed: boolean;
  // Escondido enquanto o globo de foco ocupa o lugar dele.
  hidden: boolean;
  interactive: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export function Planet({
  placement,
  clock,
  reveal,
  stage,
  size,
  hovered,
  dimmed,
  hidden,
  interactive,
  onHover,
  onSelect,
}: PlanetProps) {
  const { tech } = placement;
  const Icon = tech.icon;

  const point = useTransform<number, OrbitPoint>([clock, reveal], ([t, r]) =>
    orbitPoint(placement, t, stage, r)
  );
  const x = useTransform(point, (p) => p.x);
  const y = useTransform(point, (p) => p.y);
  const scale = useTransform(point, (p) => p.scale);
  const opacity = useTransform(point, (p) => p.opacity);
  const zIndex = useTransform(point, (p) => p.zIndex);

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{ x, y, scale, opacity, zIndex: hovered ? 40 : zIndex }}
    >
      <motion.button
        type="button"
        data-tech={tech.id}
        aria-label={`${tech.name}: ver detalhes`}
        tabIndex={interactive ? 0 : -1}
        onPointerEnter={() => onHover(tech.id)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(tech.id)}
        onBlur={() => onHover(null)}
        onClick={() => onSelect(tech.id)}
        animate={{
          opacity: hidden ? 0 : dimmed ? 0.4 : 1,
          scale: hovered ? 1.14 : 1,
        }}
        transition={{ duration: hidden ? 0 : 0.25 }}
        className="absolute flex cursor-pointer items-center justify-center rounded-full outline-none before:absolute before:-inset-1.5 before:rounded-full focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
        style={{
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          ...planetFaceStyle(tech.color),
        }}
      >
        {Icon ? (
          <Icon size={Math.round(size * 0.52)} stroke={1.6} />
        ) : (
          <span
            className="font-secondary font-bold"
            style={{ fontSize: size * 0.34 }}
          >
            {tech.name.slice(0, 2)}
          </span>
        )}
      </motion.button>
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground-dark px-2.5 py-1 text-xs font-medium text-white transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: size / 2 + 10 }}
      >
        {tech.name}
      </span>
    </motion.div>
  );
}
