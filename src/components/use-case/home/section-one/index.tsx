import { IconChevronDown, IconMouse } from "@tabler/icons-react";

export default function SectionOne() {
  return (
    <section className="pt-32 h-dvh md:pt-60 px-20 md:grid md:grid-cols-[40%_60%]">
      <div>
        <h1 className="text-3xl md:text-7xl font-heading font-secondary ">
          Oi! eu sou Felipe, um desenvolvedor Front-End!
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
