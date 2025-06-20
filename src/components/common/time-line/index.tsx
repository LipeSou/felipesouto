"use client";
import { useEffect, useRef, useState } from "react";
import type { Experiences } from "../../../types/timeline";
import { useScroll, useTransform, motion } from "framer-motion";

export const Timeline = ({ data }: { data: Experiences[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto pt-20 px-4 md:px-8 lg:px-10">
        <h2 className="font-primary text-2xl md:text-4xl mb-6  max-w-4xl">
          Minhas experiências
        </h2>
        <p className="text-base md:text-xl max-w-sm">
          Eu tenho trabalhado profissionalmente de Front-End nos últimos 4 anos.
          Aqui está uma linha do tempo da minha jornada.
        </p>
      </div>
      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-midnight">
                <div className="w-4 h-4 p-2 border rounded-full bg-neutral-800 border-neutral-700" />
              </div>
              <div className="flex-col hidden gap-2 font-semibold md:flex md:pl-20 md:text-4xl ">
                <h3 className=" text-3xl">{item.job}</h3>
                <h3 className="font-primary text-2xl md:text-4xl">
                  {item.title}
                </h3>
                <div>
                  <h3 className="text-lg font-normal">{item.date}</h3>
                  <h3 className="text-lg font-normal">{item.time}</h3>
                </div>
              </div>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <div className="block mb-4  font-bold text-left  tex md:hidden ">
                <h3 className="text-2xl">{item.title}</h3>
                <h3 className="text-xl font-light">{item.job}</h3>
                <h3 className="font-light">{item.date}</h3>
                <h3 className="font-light">{item.time}</h3>
              </div>
              {item.contents.map((content, index) => (
                <p className="mb-3 font-normal " key={index}>
                  {content}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-primary-600 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
