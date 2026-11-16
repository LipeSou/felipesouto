"use client";

import {
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";
import { profile } from "@/app/constants/profile";
import { useTypewriter } from "@/hooks/use-typewriter";

type HeroProps = {
  // A sequência de texto só começa quando o avatar pousou (ou após um
  // tempo limite, se o modelo demorar a carregar).
  started: boolean;
  // Progresso da queda: desloca as linhas do título na saída.
  progress: MotionValue<number>;
  speaking: MotionValue<number>;
  mood: MotionValue<number>;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function HeadlineLine({
  line,
  index,
  revealed,
  progress,
}: {
  line: string;
  index: number;
  revealed: boolean;
  progress: MotionValue<number>;
}) {
  // Na saída, cada linha sobe um pouco mais que a anterior.
  const exitY = useTransform(progress, [0, 0.2], [0, -18 * (index + 1)]);
  const highlighted = line.endsWith(profile.highlight);
  const prefix = highlighted ? line.slice(0, -profile.highlight.length) : line;

  return (
    <motion.span className="block" style={{ y: exitY }}>
      {/* Máscara: a linha sobe por trás dela. O padding guarda espaço
          para descendentes e para o sublinhado. */}
      <span className="-mb-[0.1em] block overflow-hidden pb-[0.16em]">
        <motion.span
          className="block"
          initial={{ y: "118%" }}
          animate={{ y: revealed ? "0%" : "118%" }}
          transition={{ duration: 0.8, ease: EASE, delay: index * 0.09 }}
        >
          {prefix}
          {highlighted && (
            <span className="relative inline-block">
              {profile.highlight}
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute inset-x-0 -bottom-[0.1em] h-[0.14em] w-full overflow-visible"
              >
                <motion.path
                  d="M3 8 C 40 2, 78 11, 118 6 S 176 3, 197 7"
                  fill="none"
                  stroke="var(--color-primary-600)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: revealed ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                />
              </svg>
            </span>
          )}
        </motion.span>
      </span>
    </motion.span>
  );
}

export default function Hero({ started, progress, speaking, mood }: HeroProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const greeting = `<${profile.greeting} />`;
  const { typed, rest, done } = useTypewriter(greeting, {
    speed: 38,
    startDelay: 120,
    enabled: !reducedMotion,
    paused: !started,
  });
  const typing = started && typed.length > 0 && !done;
  // O título entra quando a saudação termina de ser "falada".
  const revealed = started && done;

  useEffect(() => {
    speaking.set(typing ? 1 : 0);
    return () => speaking.set(0);
  }, [typing, speaking]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: revealed ? 1 : 0, y: revealed ? 0 : 12 },
    transition: { duration: 0.5, ease: EASE, delay: revealed ? delay : 0 },
  });
  const socials = [
    { label: "GitHub", href: profile.links.github, Icon: IconBrandGithub },
    { label: "LinkedIn", href: profile.links.linkedin, Icon: IconBrandLinkedin },
  ].filter((link) => link.href);

  return (
    <>
      <div className="w-full px-6 md:w-[54vw] md:px-0 md:pl-20">
        <motion.p
          {...fadeUp(0.75)}
          className="mb-4 inline-flex items-center gap-2.5 text-xs md:mb-6 md:text-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="opacity-70">{profile.availability}</span>
        </motion.p>

        <p className="min-h-[1.5em] font-secondary text-lg text-primary-900 md:text-2xl">
          <span className="sr-only">{profile.greeting}</span>
          <span aria-hidden className={started ? "" : "invisible"}>
            {typed}
            {!done && (
              <span className="animate-pulse-fast font-mono font-bold">|</span>
            )}
            <span className="opacity-0">{rest}</span>
          </span>
        </p>

        <h1 className="mt-2 font-secondary text-[2.5rem] font-bold leading-none tracking-tight md:mt-3 md:text-[clamp(3.5rem,6.4vw,6.75rem)] [@media(max-height:700px)]:max-md:text-[2rem]">
          <span className="sr-only">{profile.name}: </span>
          {profile.headline.map((line, index) => (
            <HeadlineLine
              key={line}
              line={line}
              index={index}
              revealed={revealed}
              progress={progress}
            />
          ))}
        </h1>

        <motion.p
          {...fadeUp(0.5)}
          className="mt-6 hidden max-w-md text-lg opacity-70 md:block"
        >
          {profile.summary}
        </motion.p>

        {/* No mobile os botões vão para a faixa livre abaixo do avatar. */}
        <motion.div
          {...fadeUp(0.65)}
          className="absolute inset-x-6 bottom-14 flex items-center justify-center gap-5 md:static md:mt-9 md:justify-start"
        >
          <a
            href={profile.cta.href}
            onPointerEnter={() => mood.set(1)}
            onPointerLeave={() => mood.set(0)}
            onFocus={() => mood.set(1)}
            onBlur={() => mood.set(0)}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground-dark px-6 text-sm font-medium text-white transition-colors hover:bg-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
          >
            {profile.cta.label}
            <IconArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="hidden opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-800 md:inline-flex"
            >
              <Icon size={22} stroke={1.6} />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, delay: revealed ? 1.2 : 0 }}
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-10 md:left-20 md:translate-x-0"
      >
        <span className="relative hidden h-10 w-px overflow-hidden bg-foreground-dark/15 md:block">
          <span className="animate-scroll-line absolute inset-x-0 top-0 h-4 bg-primary-800" />
        </span>
        <span className="font-secondary text-[11px] uppercase tracking-[0.2em] text-primary-900">
          {profile.scrollHint}
        </span>
      </motion.div>
    </>
  );
}
