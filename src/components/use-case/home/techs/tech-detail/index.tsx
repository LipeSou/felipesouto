"use client";

import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import { techOrbits } from "@/app/constants/myTechs";
import { useTypewriter } from "@/hooks/use-typewriter";
import type { Tech } from "@/types/tech";

type TechDetailProps = {
  tech: Tech;
  techs: Tech[];
  panelStyle: CSSProperties;
  titleSize: number;
  showRelated: boolean;
  compact: boolean;
  reducedMotion: boolean;
  speaking: MotionValue<number>;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
  onSelect: (id: string) => void;
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function DetailBody({
  tech,
  techs,
  titleSize,
  showRelated,
  compact,
  reducedMotion,
  speaking,
  startDelay,
  onSelect,
}: Pick<
  TechDetailProps,
  | "tech"
  | "techs"
  | "titleSize"
  | "showRelated"
  | "compact"
  | "reducedMotion"
  | "speaking"
  | "onSelect"
> & { startDelay: number }) {
  const { typed, rest, done } = useTypewriter(tech.speech, {
    startDelay,
    enabled: !reducedMotion,
  });
  const isSpeaking = typed.length > 0 && !done;

  // A boca do avatar mexe enquanto o texto é digitado.
  useEffect(() => {
    speaking.set(isSpeaking ? 1 : 0);
    return () => speaking.set(0);
  }, [isSpeaking, speaking]);

  const related = (tech.related ?? [])
    .map((id) => techs.find((t) => t.id === id))
    .filter((t): t is Tech => Boolean(t));
  const accent = `color-mix(in srgb, ${tech.color} 78%, #0f0602)`;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.p
        variants={item}
        className="font-secondary text-xs uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {techOrbits[tech.orbit].label} · desde {tech.since}
      </motion.p>

      <motion.h3
        variants={item}
        className="mt-2 whitespace-nowrap font-secondary font-bold leading-tight"
        style={{ fontSize: titleSize }}
      >
        {`<${tech.name} />`}
      </motion.h3>

      <motion.p
        variants={item}
        className="mt-4 text-base leading-relaxed md:mt-6 md:text-xl"
      >
        <span className="sr-only">{tech.speech}</span>
        <span aria-hidden>
          {typed}
          {!done && (
            <span
              className="animate-pulse-fast font-mono font-bold"
              style={{ color: accent }}
            >
              |
            </span>
          )}
          <span className="opacity-0">{rest}</span>
        </span>
      </motion.p>

      <motion.div
        variants={item}
        className="mt-4 flex flex-wrap items-center gap-2 text-sm md:mt-6"
      >
        <span className="opacity-60">Usado em</span>
        {(tech.usedAt.length ? tech.usedAt : ["Projetos pessoais"]).map(
          (job) => (
            <span
              key={job}
              className="rounded-full bg-foreground-blue px-3 py-1 font-medium"
            >
              {job}
            </span>
          )
        )}
      </motion.div>

      {!compact && (
        <motion.ul variants={item} className="mt-6 space-y-2 text-base">
          {tech.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span className="opacity-80">{highlight}</span>
            </li>
          ))}
        </motion.ul>
      )}

      {showRelated && related.length > 0 && (
        <motion.div
          variants={item}
          className="mt-4 flex flex-wrap items-center gap-2 text-sm md:mt-6"
        >
          <span className="opacity-60">Combina com</span>
          {related.map((other) => (
            <button
              key={other.id}
              type="button"
              onClick={() => onSelect(other.id)}
              className="cursor-pointer rounded-full border border-primary-600/50 px-3 py-1 font-medium text-primary-900 transition-colors hover:bg-primary-400/40 focus-visible:outline-2 focus-visible:outline-primary-800"
            >
              {other.name}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export function TechDetail({
  tech,
  techs,
  panelStyle,
  titleSize,
  showRelated,
  compact,
  reducedMotion,
  speaking,
  onClose,
  onStep,
  onSelect,
}: TechDetailProps) {
  const backRef = useRef<HTMLButtonElement>(null);
  // Na abertura, espera o mergulho terminar; ao pular entre techs, é rápido.
  const isFirst = useRef(true);
  const startDelay = isFirst.current ? 750 : 200;

  useEffect(() => {
    isFirst.current = false;
    const timer = setTimeout(
      () => backRef.current?.focus({ preventScroll: true }),
      900
    );
    return () => clearTimeout(timer);
  }, []);

  const index = techs.findIndex((t) => t.id === tech.id);
  const navButton =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-foreground-dark/15 transition-colors hover:bg-foreground-blue focus-visible:outline-2 focus-visible:outline-primary-800";

  return (
    <motion.div
      className="absolute inset-0 z-[2]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: reducedMotion ? 0 : 0.55, duration: 0.4 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {/* Clicar fora do painel volta para a órbita. */}
      <div aria-hidden className="absolute inset-0" onClick={onClose} />

      <div
        role="region"
        aria-label={`Detalhes de ${tech.name}`}
        className="absolute flex flex-col md:justify-center"
        style={panelStyle}
      >
        <AnimatePresence mode="wait" initial>
          <DetailBody
            key={tech.id}
            tech={tech}
            techs={techs}
            titleSize={titleSize}
            showRelated={showRelated}
            compact={compact}
            reducedMotion={reducedMotion}
            speaking={speaking}
            startDelay={startDelay}
            onSelect={onSelect}
          />
        </AnimatePresence>

        {/* No mobile a navegação vai para a faixa livre abaixo do avatar. */}
        <div
          className={
            compact
              ? "mt-auto flex items-center gap-3"
              : "mt-10 flex items-center gap-3"
          }
        >
          <button
            ref={backRef}
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-foreground-dark px-4 text-sm font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
          >
            <IconArrowLeft size={16} />
            Voltar à órbita
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Tecnologia anterior"
              onClick={() => onStep(-1)}
              className={navButton}
            >
              <IconChevronLeft size={18} />
            </button>
            <span className="min-w-14 text-center font-secondary text-sm tabular-nums opacity-60">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(techs.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Próxima tecnologia"
              onClick={() => onStep(1)}
              className={navButton}
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
