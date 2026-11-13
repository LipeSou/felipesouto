import type { ComponentType } from "react";

type TechIcon = ComponentType<{
  size?: number | string;
  stroke?: number | string;
  className?: string;
}>;

// 0 = núcleo (dia a dia), 1 = uso frequente, 2 = ferramentas/periferia.
type TechOrbit = 0 | 1 | 2;

type Tech = {
  id: string;
  name: string;
  // Opcional: sem ícone, o planeta mostra um monograma com as iniciais.
  icon?: TechIcon;
  // Cor da marca. Tinge o planeta, o globo e a luz no avatar.
  color: string;
  orbit: TechOrbit;
  since: number;
  // Texto em primeira pessoa, "falado" pelo avatar.
  speech: string;
  highlights: string[];
  // Deve bater com `job` em myExperiences.
  usedAt: string[];
  // ids de outras techs.
  related?: string[];
};

type TechOrbitConfig = {
  label: string;
  // Raio relativo ao tamanho do palco (0–0.5).
  radius: number;
  // Segundos para uma volta completa.
  period: number;
};

export type { Tech, TechIcon, TechOrbit, TechOrbitConfig };
