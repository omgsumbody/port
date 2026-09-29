"use client";

import { useState } from "react";
import { RoundButton } from "@/components/v2/sections/Discovery";

type Slide = { src: string; alt: string };

/**
 * Stage + thumbnail strip. `header` receives the prev/next buttons so each section can
 * place them in its own title row, as on the canvas.
 */
export default function Carousel({
  slides,
  header,
  stageClassName = "h-[420px] lg:h-[520px] p-8 lg:p-12",
  thumbHeight = "h-[88px]",
}: {
  slides: Slide[];
  header: (controls: React.ReactNode) => React.ReactNode;
  stageClassName?: string;
  thumbHeight?: string;
}) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = (next: number) => setI((next + n) % n);

  const controls = (
    <div className="flex items-center gap-2">
      <RoundButton label="Previous" onClick={() => go(i - 1)} d="M10 3 5 8l5 5" />
      <RoundButton label="Next" onClick={() => go(i + 1)} d="m6 3 5 5-5 5" />
    </div>
  );

  return (
    <>
      {header(controls)}
      <div
        className={`relative flex items-center justify-center rounded-card-lg bg-stone ${stageClassName}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(i - 1);
          if (e.key === "ArrowRight") go(i + 1);
        }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${slides[i].alt}, ${i + 1} of ${n}`}
      >
        {slides.map((s, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={k === i ? s.alt : ""}
            aria-hidden={k !== i}
            loading={k === 0 ? "lazy" : "lazy"}
            className={`absolute max-h-[calc(100%-4rem)] max-w-[calc(100%-4rem)] rounded-xl bg-paper object-contain p-5 shadow-lift transition-opacity duration-500 ease-[var(--ease-editorial)] lg:max-h-[calc(100%-6rem)] lg:max-w-[calc(100%-6rem)] ${k === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <span className="absolute bottom-5 left-6 font-ui text-[13px] leading-[1.5] text-ashen tabular-nums">
          {i + 1} of {n}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {slides.map((s, k) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setI(k)}
            aria-label={s.alt}
            aria-current={k === i}
            className={`flex cursor-pointer items-center justify-center rounded-xl bg-paper p-2.5 transition-[opacity,border-color] duration-300 ${thumbHeight} ${
              k === i ? "border-[1.5px] border-ink opacity-100" : "border border-chalk opacity-60 hover:opacity-90"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
          </button>
        ))}
      </div>
    </>
  );
}
