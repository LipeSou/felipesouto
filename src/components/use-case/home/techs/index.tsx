"use client";

import { IconHandClick } from "@tabler/icons-react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { myTechs } from "@/app/constants/myTechs";
import { FocusGlobe } from "./focus-globe";
import { SolarSystem, type FocusOrigin } from "./solar-system";
import {
  buildPlacements,
  clamp,
  orbitPoint,
} from "./solar-system/orbit-math";
import { useOrbitClock } from "./solar-system/use-orbit-clock";
import { TechDetail } from "./tech-detail";

type TechsProps = {
  // true quando o avatar já pousou na seção.
  active: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  // Para onde o avatar olha, de -1 a 1 em cada eixo.
  lookX: MotionValue<number>;
  lookY: MotionValue<number>;
  speaking: MotionValue<number>;
};

type Geometry = {
  desktop: boolean;
  stage: number;
  planet: number;
  globe: number;
  center: { x: number; y: number };
  anchor: { x: number; y: number };
  // Posição aproximada da cabeça do avatar na tela, para o olhar.
  head: { x: number; y: number };
  panel: CSSProperties;
  // Título do detalhe em px: cabe em uma linha na largura do painel.
  titleSize: number;
  // Em telas baixas não sobra espaço para os chips de relacionadas.
  showRelated: boolean;
};

// Tudo é posicionado em px a partir do tamanho da seção: o sistema à
// esquerda (o avatar ocupa os 40vw da direita) e, no foco, um tríptico
// globo | texto | rosto. No mobile vira uma pilha: globo, texto, rosto.
function computeGeometry(w: number, h: number): Geometry | null {
  if (!w || !h) return null;

  if (w >= 768) {
    const stage = Math.min(0.56 * w, 1.25 * (h - 250));
    const globe = Math.min(0.8 * h, 0.42 * w);
    const left = globe / 2 + 48;
    const width = Math.max(280, 0.6 * w - left - 32);
    return {
      desktop: true,
      stage,
      planet: clamp(stage * 0.078, 40, 60),
      globe,
      center: { x: 0.3 * w, y: 0.58 * h + 10 },
      anchor: { x: 0, y: 0.58 * h },
      head: { x: 0.8 * w, y: 0.27 * h },
      panel: { left, top: 96, width, height: h - 96 },
      titleSize: clamp(width / 8, 30, 56),
      showRelated: true,
    };
  }

  const stage = Math.min(0.9 * w, 0.9 * h);
  const globe = 1.15 * w;
  const arcBottom = -0.12 * w + globe / 2;
  return {
    desktop: false,
    stage,
    planet: clamp(stage * 0.105, 36, 44),
    globe,
    center: { x: 0.5 * w, y: 0.35 * h },
    anchor: { x: 0.5 * w, y: -0.12 * w },
    head: { x: 0.5 * w, y: 0.59 * h - 112 },
    // Vai até o rodapé da seção: o texto fica em cima e a navegação
    // desce para a faixa livre abaixo do avatar.
    panel: {
      left: 24,
      top: arcBottom + 16,
      width: w - 48,
      height: h - arcBottom - 40,
    },
    titleSize: clamp((w - 48) / 8.5, 26, 40),
    showRelated: h >= 740,
  };
}

export default function Techs({
  active,
  selectedId,
  onSelect,
  lookX,
  lookY,
  speaking,
}: TechsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reducedMotion = useReducedMotion() ?? false;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [stageHover, setStageHover] = useState(false);
  // Tech cujo globo está na tela: continua montado durante a volta.
  const [shownId, setShownId] = useState<string | null>(null);
  const [explored, setExplored] = useState(false);

  const focus = useMotionValue(0);
  const reveal = useMotionValue(0);
  const origin = useRef<FocusOrigin>({ x: 0, y: 0, scale: 1 });

  const placements = useMemo(() => buildPlacements(myTechs), []);
  const geo = useMemo(() => computeGeometry(box.w, box.h), [box]);

  const focused = selectedId !== null || shownId !== null;
  const speed =
    !active || reducedMotion || hoveredId ? 0 : stageHover ? 0.25 : 1;
  const clock = useOrbitClock(speed, focused);

  const titleOpacity = useTransform(focus, [0, 0.4], [1, 0]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Entrada: ao pousar, os planetas saem do sol para suas órbitas.
  useEffect(() => {
    const controls = animate(reveal, active ? 1 : 0, {
      duration: reducedMotion ? 0 : active ? 1.5 : 0.5,
      ease: "linear",
    });
    return () => controls.stop();
  }, [active, reducedMotion, reveal]);

  // Uma única linha do tempo (0 -> 1) dirige o mergulho inteiro.
  useEffect(() => {
    if (selectedId) {
      setShownId(selectedId);
      setExplored(true);
      setHoveredId(null);
      setStageHover(false);
      lookX.set(0);
      lookY.set(0);
    }
    const controls = animate(focus, selectedId ? 1 : 0, {
      duration: reducedMotion ? 0.01 : selectedId ? 1.1 : 0.85,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        if (!selectedId) setShownId(null);
      },
    });
    return () => controls.stop();
  }, [selectedId, reducedMotion, focus, lookX, lookY]);

  const select = useCallback(
    (id: string) => {
      const placement = placements.find((p) => p.tech.id === id);
      if (!placement || !geo) return;
      const point = orbitPoint(placement, clock.get(), geo.stage, 1);
      origin.current = { x: point.x, y: point.y, scale: point.scale };
      onSelect(id);
    },
    [placements, geo, clock, onSelect]
  );

  const close = useCallback(() => {
    const el = sectionRef.current;
    // Devolve o foco do teclado ao planeta de onde o usuário partiu.
    if (el && selectedId && el.contains(document.activeElement)) {
      el.querySelector<HTMLElement>(`[data-tech="${selectedId}"]`)?.focus({
        preventScroll: true,
      });
    }
    onSelect(null);
  }, [selectedId, onSelect]);

  const step = useCallback(
    (direction: 1 | -1) => {
      const index = myTechs.findIndex((t) => t.id === selectedId);
      if (index < 0) return;
      const next = (index + direction + myTechs.length) % myTechs.length;
      select(myTechs[next].id);
    },
    [selectedId, select]
  );

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, close, step]);

  // O avatar acompanha o cursor enquanto o usuário explora as órbitas.
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!active || selectedId || !geo) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    lookX.set(clamp((px - geo.head.x) / (box.w * 0.5), -1, 1));
    lookY.set(clamp((py - geo.head.y) / (box.h * 0.5), -1, 1));
  };
  const handlePointerLeave = () => {
    lookX.set(0);
    lookY.set(0);
  };

  const selectedTech = myTechs.find((t) => t.id === selectedId) ?? null;
  const shownTech = myTechs.find((t) => t.id === shownId) ?? null;

  return (
    <section
      ref={sectionRef}
      aria-label="Tecnologias"
      // overflow-clip (não hidden): o globo sai da seção e um container
      // rolável seria deslocado pelo browser ao focar um planeta.
      className="relative h-screen overflow-clip bg-background"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="absolute left-6 right-6 top-[4.5rem] z-[1] text-center md:left-20 md:right-auto md:top-32 md:max-w-md md:text-left"
        style={{
          opacity: titleOpacity,
          pointerEvents: selectedId ? "none" : "auto",
        }}
      >
        <h2 className="font-secondary text-3xl font-bold md:text-5xl">
          Tecnologias
        </h2>
        <p className="mt-2 text-sm opacity-70 md:mt-3 md:text-base">
          Quanto mais perto do centro, mais presente no meu dia a dia.
        </p>
        <p
          className={`mt-3 inline-flex items-center gap-2 font-secondary text-[11px] uppercase tracking-[0.18em] text-primary-800 transition-opacity duration-500 ${
            active && !explored ? "opacity-100" : "opacity-0"
          }`}
        >
          <IconHandClick size={16} />
          Escolha um planeta
        </p>
      </motion.div>

      {geo && (
        <div
          className="absolute"
          style={{ left: geo.center.x, top: geo.center.y }}
        >
          <SolarSystem
            placements={placements}
            clock={clock}
            reveal={reveal}
            focus={focus}
            stage={geo.stage}
            planetSize={geo.planet}
            active={active}
            interactive={active && !focused}
            hoveredId={hoveredId}
            shownId={shownId}
            origin={origin}
            anchor={{
              x: geo.anchor.x - geo.center.x,
              y: geo.anchor.y - geo.center.y,
            }}
            onHover={setHoveredId}
            onStageHover={setStageHover}
            onSelect={select}
          />
          {shownTech && (
            <FocusGlobe
              tech={shownTech}
              focus={focus}
              origin={origin}
              anchor={{
                x: geo.anchor.x - geo.center.x,
                y: geo.anchor.y - geo.center.y,
              }}
              globeSize={geo.globe}
              planetSize={geo.planet}
              litSide={geo.desktop ? "right" : "bottom"}
              reducedMotion={reducedMotion}
            />
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedTech && geo && (
          <TechDetail
            tech={selectedTech}
            techs={myTechs}
            panelStyle={geo.panel}
            titleSize={geo.titleSize}
            showRelated={geo.showRelated}
            compact={!geo.desktop}
            reducedMotion={reducedMotion}
            speaking={speaking}
            onClose={close}
            onStep={step}
            onSelect={select}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
