"use client";

import { IconChevronDown, IconMouse } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function SectionOne() {
  const phrase = "Oi! Eu sou Felipe, um desenvolvedor Front-End com ";
  const wordAlma = "alma!";

  const parent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.045,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="pt-32 h-dvh md:pt-60 px-20 md:grid md:grid-cols-[40%_60%]">
      <div>
        <motion.h1
          className="text-center text-4xl md:text-7xl font-heading font-secondary"
          variants={parent}
          initial="hidden"
          animate="visible"
        >
          {phrase.split("").map((char, idx) => (
            <motion.span
              key={char + idx}
              variants={child}
              style={{ display: char === " " ? "inline-block" : "inline" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          {/* Alma destacada */}
          {wordAlma.split("").map((char, idx) => (
            <motion.span
              key={"alma" + idx}
              variants={child}
              className="font-bold"
              style={{
                color: "#68cac9",
                fontFamily: "Space Grotesk, sans-serif",
                display: char === " " ? "inline-block" : "inline",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
      </div>
      <div className=""></div>
      <div
        className="absolute 
            left-1/2 
            -translate-x-1/2 
            bottom-8
            sm:bottom-20
            flex flex-col 
            items-center 
            text-[--color-primary-900] 
            animate-bounce-slow"
      >
        <IconMouse size={32} />
        <span className="text-sm mt-2 font-secondary tracking-wide uppercase opacity-70">
          Scroll para ver mais
        </span>
        <IconChevronDown size={28} className="mt-1 opacity-70" />
      </div>
    </section>
  );
}
