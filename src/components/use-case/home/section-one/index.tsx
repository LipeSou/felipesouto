"use client";

import { IconChevronDown, IconMouse } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SectionOne() {
  const phrases = [
    "<Oi! />",
    "<Eu sou Felipe, />",
    "<Um desenvolvedor Front-End com alma! />",
  ];
  const [phraseIndex, setPhraseIndex] = useState(0); // Current phrase index
  const [typedText, setTypedText] = useState(""); // Text currently displayed
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setTypedText(""); // Always clear before typing a new phrase
    setIsTyping(true);

    let current = 0;
    const type = () => {
      if (current <= phrases[phraseIndex].length) {
        setTypedText(phrases[phraseIndex].slice(0, current));
        current++;
        setTimeout(type, 45); // Typing speed (ms)
      } else {
        setIsTyping(false);
        // Wait and then go to next phrase, if there is one
        if (phraseIndex < phrases.length - 1) {
          setTimeout(() => setPhraseIndex(phraseIndex + 1), 1100); // Wait time between phrases
        }
      }
    };
    type();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phraseIndex]);

  // Hide previous phrase after a short delay, except the last one (keep)
  useEffect(() => {
    if (!isTyping && phraseIndex < phrases.length - 1) {
      const timeout = setTimeout(() => setTypedText(""), 700);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, phraseIndex]);
  return (
    <section className="pt-32 h-dvh md:pt-60 px-20 md:grid md:grid-cols-[40%_60%]">
      <div>
        <h1 className="text-4xl md:text-7xl font-heading font-secondary h-[2.5em] flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { type: "spring", duration: 0.7 },
              }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              {typedText}
              {/* Blinking cursor */}
              <span
                className={`inline-block w-2 animate-pulse-fast`}
                style={{
                  color: "#0f0602", // preto do seu tema
                  marginLeft: "2px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "0.7em",
                  opacity: 0.8,
                }}
              >
                |
              </span>
            </motion.span>
          </AnimatePresence>
        </h1>
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
