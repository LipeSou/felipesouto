"use client";

import { Avatar3D } from "@/components/use-case/home/avatar-3d";
import Experiences from "@/components/use-case/home/experiences";
import Hero from "@/components/use-case/home/hero";
import Techs from "@/components/use-case/home/techs";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AvatarPhase = "greeting" | "falling" | "landed";

const PHASE_ANIMATION: Record<AvatarPhase, string> = {
  greeting: "StandingGreeting",
  falling: "FallingIdle",
  landed: "HappyIdle",
};

// Thresholds de entrada/saída diferentes (histerese) para o clip não
// ficar piscando quando o scroll para exatamente na fronteira.
function nextPhase(prev: AvatarPhase, p: number): AvatarPhase {
  if (prev === "greeting" && p > 0.15) return "falling";
  if (prev === "falling" && p < 0.08) return "greeting";
  if (prev === "falling" && p > 0.85) return "landed";
  if (prev === "landed" && p < 0.75) return "falling";
  return prev;
}

export default function Home() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });
  const [phase, setPhase] = useState<AvatarPhase>("greeting");

  // Hero sai de cena junto com o início da queda do avatar.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setPhase((prev) => nextPhase(prev, p));
  });

  useEffect(() => {
    // Refresh no meio da página: começa na fase certa, não em "greeting".
    const p = scrollYProgress.get();
    setPhase((prev) => {
      let phase = prev;
      let next = nextPhase(phase, p);
      while (next !== phase) {
        phase = next;
        next = nextPhase(phase, p);
      }
      return phase;
    });
  }, [scrollYProgress]);

  return (
    <>
      <div ref={journeyRef} className="relative">
        <div className="pointer-events-none sticky top-0 z-10 h-screen">
          <div className="absolute bottom-28 left-0 h-[55vh] w-full md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[40vw]">
            <Avatar3D
              animation={PHASE_ANIMATION[phase]}
              progress={scrollYProgress}
            />
          </div>
        </div>
        <div className="-mt-[100vh]">
          <motion.section
            className="relative flex h-screen items-start pt-24 md:items-center md:pt-0"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <Hero />
          </motion.section>
          <Techs />
        </div>
      </div>

      <Experiences />
    </>
  );
}
