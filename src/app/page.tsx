"use client";

import { Avatar3D } from "@/components/use-case/home/avatar-3d";
import Experiences from "@/components/use-case/home/experiences";
import Hero from "@/components/use-case/home/hero";
import Techs from "@/components/use-case/home/techs";
import { useControls } from "leva";

export default function Home() {
  const { animation } = useControls({
    animation: {
      value: "StandingGreeting",
      options: ["StandingGreeting", "FallingIdle"],
    },
  });
  return (
    <>
      <div className="flex items-center justify-center">
        <Hero />
        <Avatar3D animation={animation} />
      </div>

      <Techs />
      <Experiences />
    </>
  );
}
