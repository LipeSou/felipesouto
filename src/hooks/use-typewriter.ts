"use client";

import { useEffect, useState } from "react";

type TypewriterOptions = {
  // ms por caractere.
  speed?: number;
  // ms antes de começar a digitar.
  startDelay?: number;
  // false = mostra o texto inteiro de uma vez (ex.: reduced motion).
  enabled?: boolean;
  // true = ainda não começa a digitar (ex.: esperando a entrada do avatar).
  paused?: boolean;
};

export function useTypewriter(
  text: string,
  {
    speed = 22,
    startDelay = 0,
    enabled = true,
    paused = false,
  }: TypewriterOptions = {}
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!enabled || paused) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      current++;
      setCount(current);
      if (current < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay, enabled, paused]);

  const shown = enabled ? Math.min(count, text.length) : text.length;
  return {
    typed: text.slice(0, shown),
    rest: text.slice(shown),
    done: shown >= text.length,
  };
}
