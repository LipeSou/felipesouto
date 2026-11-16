"use client";

import { myTechs } from "@/app/constants/myTechs";
import { Avatar3D } from "@/components/use-case/home/avatar-3d";
import { LoadBar } from "@/components/use-case/home/avatar-3d/load-bar";
import Experiences from "@/components/use-case/home/experiences";
import { GroundRing } from "@/components/use-case/home/ground-ring";
import Hero from "@/components/use-case/home/hero";
import Techs from "@/components/use-case/home/techs";
import { usePointerLook } from "@/hooks/use-pointer-look";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type AvatarPhase = "greeting" | "falling" | "landed";
// loading: modelo carregando · dropping: avatar caindo na tela · done.
type Intro = "loading" | "dropping" | "done";

const PHASE_ANIMATION: Record<AvatarPhase, string> = {
  greeting: "StandingGreeting",
  falling: "FallingIdle",
  landed: "HappyIdle",
};

// Se o modelo demorar, o texto do hero não fica esperando por ele.
const TEXT_FALLBACK_MS = 1800;

// Thresholds de entrada/saída diferentes (histerese) para o clip não
// ficar piscando quando o scroll para exatamente na fronteira.
function nextPhase(prev: AvatarPhase, p: number): AvatarPhase {
  if (prev === "greeting" && p > 0.15) return "falling";
  if (prev === "falling" && p < 0.08) return "greeting";
  if (prev === "falling" && p > 0.85) return "landed";
  if (prev === "landed" && p < 0.75) return "falling";
  return prev;
}

// Aplica as transições até estabilizar: um salto de scroll (tecla End,
// refresh no meio da página) pode pular mais de uma fase de uma vez.
function resolvePhase(prev: AvatarPhase, p: number): AvatarPhase {
  let phase = prev;
  let next = nextPhase(phase, p);
  while (next !== phase) {
    phase = next;
    next = nextPhase(phase, p);
  }
  return phase;
}

export default function Home() {
  // Mede só o trecho da queda (hero + entrada das techs): o progresso
  // continua indo de 0 a 1 em 100vh, mesmo com a seção fixada depois.
  const fallRef = useRef<HTMLDivElement>(null);
  const techsTrackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: fallRef,
    offset: ["start start", "end end"],
  });
  // 0 enquanto as techs estão fixadas; cresce quando começam a sair.
  const { scrollYProgress: techsExit } = useScroll({
    target: techsTrackRef,
    offset: ["end end", "end start"],
  });
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<AvatarPhase>("greeting");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [intro, setIntro] = useState<Intro>("loading");
  const [textStarted, setTextStarted] = useState(false);
  const [heroPulse, setHeroPulse] = useState(0);
  const introStarted = useRef(false);

  // Lidos direto no useFrame do avatar, sem re-render.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const speaking = useMotionValue(0);
  const mood = useMotionValue(0);
  // 1 = avatar fora do quadro, no alto; 0 = no chão.
  const introY = useMotionValue(1);

  // Hero sai de cena junto com o início da queda do avatar.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setPhase((prev) => resolvePhase(prev, p));
  });

  // Sem travar o scroll: rolar para fora da seção fecha o foco.
  useMotionValueEvent(techsExit, "change", (p) => {
    if (p > 0.12) setSelectedTechId(null);
  });

  useEffect(() => {
    if (phase !== "landed") setSelectedTechId(null);
  }, [phase]);

  useEffect(() => {
    // Refresh no meio da página: começa na fase certa, não em "greeting".
    const p = scrollYProgress.get();
    setPhase((prev) => resolvePhase(prev, p));
  }, [scrollYProgress]);

  // Entrada: com o modelo carregado, o avatar cai do alto e pousa. Só
  // acontece se a página abriu no topo e sem "reduzir movimento".
  const handleAvatarReady = useCallback(() => {
    if (introStarted.current) return;
    introStarted.current = true;

    if (reducedMotion || scrollYProgress.get() > 0.05) {
      introY.set(0);
      setIntro("done");
      return;
    }
    setIntro("dropping");
    animate(introY, 0, {
      duration: 0.8,
      ease: [0.5, 0, 0.9, 0.6],
      onComplete: () => {
        setIntro("done");
        setHeroPulse((key) => key + 1);
      },
    });
  }, [reducedMotion, scrollYProgress, introY]);

  useEffect(() => {
    if (intro === "done") setTextStarted(true);
  }, [intro]);

  useEffect(() => {
    const timer = setTimeout(() => setTextStarted(true), TEXT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  // A cabeça segue o cursor parado no hero e nas techs; nunca durante a
  // queda nem com uma tech em foco (aí ele olha para a câmera).
  usePointerLook(
    lookX,
    lookY,
    intro === "done" && phase !== "falling" && !selectedTechId
  );

  const selectedTech = myTechs.find((t) => t.id === selectedTechId) ?? null;

  return (
    <>
      <LoadBar hidden={intro !== "loading"} />
      <div className="relative">
        <div
          ref={fallRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[200vh]"
        />
        <div className="pointer-events-none sticky top-0 z-10 h-screen">
          {/* No mobile o topo do canvas fica no meio da tela: a máscara
              evita uma borda dura quando o avatar entra ou sobe. */}
          <div className="absolute bottom-28 left-0 h-[55vh] w-full [mask-image:linear-gradient(to_bottom,transparent,black_10%)] md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[40vw] md:[mask-image:none]">
            <Avatar3D
              animation={
                intro === "dropping" ? "FallingIdle" : PHASE_ANIMATION[phase]
              }
              progress={scrollYProgress}
              focusColor={selectedTech?.color ?? null}
              lookX={lookX}
              lookY={lookY}
              speaking={speaking}
              introY={introY}
              mood={mood}
              onReady={handleAvatarReady}
            />
          </div>
        </div>
        <div className="-mt-[100vh]">
          <motion.section
            className="relative flex h-screen items-start pt-24 md:items-center md:pt-0"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <GroundRing visible pulseKey={heroPulse} />
            <Hero
              started={textStarted}
              progress={scrollYProgress}
              speaking={speaking}
              mood={mood}
            />
          </motion.section>
          {/* Trilho de 200vh: a seção fica fixada por uma tela extra de
              scroll para dar tempo de explorar as órbitas. */}
          <div id="tecnologias" ref={techsTrackRef} className="h-[200vh]">
            <div className="sticky top-0 h-screen">
              <Techs
                active={phase === "landed"}
                selectedId={selectedTechId}
                onSelect={setSelectedTechId}
                speaking={speaking}
              />
            </div>
          </div>
        </div>
      </div>

      <Experiences />
    </>
  );
}
