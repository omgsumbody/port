"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ShorelineHandle } from "./scene/scene";

// The hero pins for one extra screen of scrolling; that scroll drives the sunrise.
const PIN_SCREENS = 1;

export default function HeroV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let handle: ShorelineHandle | null = null;
    let cancelled = false;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      return travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
    };

    const onScroll = () => {
      const p = progress();
      handle?.setProgress(p);
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 12));
    };
    const onPointer = (e: PointerEvent) => {
      handle?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };

    const resizeObserver = new ResizeObserver(() => handle?.resize());
    const visibility = new IntersectionObserver(([entry]) => handle?.setActive(entry.isIntersecting));

    // three.js loads after the headline has painted.
    import("./scene/scene").then(({ createShoreline }) => {
      if (cancelled) return;
      try {
        handle = createShoreline(canvas, { reducedMotion });
      } catch {
        return; // no WebGL: the CSS sky behind the canvas stays as the hero
      }
      handle.setProgress(progress());
      resizeObserver.observe(canvas);
      visibility.observe(section);
      setReady(true);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      resizeObserver.disconnect();
      visibility.disconnect();
      handle?.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative"
      style={{ height: `${(PIN_SCREENS + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Shown before the scene loads, and in place of it without WebGL */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #a5c5d3 0%, #b7b7be 20%, #c99978 31%, #a84f25 41%, #3a66a8 41.5%, #6d7fa8 60%, #a8a4ad 75%, #b3aeb6 100%)",
          }}
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        />

        <nav className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-16 pt-7">
          <Link href="/" aria-label="Harsha Peddinti, home" className="block">
            <img src="/favicon.svg" alt="" width={40} height={46} className="h-[46px] w-[40px]" />
          </Link>
          <div className="flex items-center gap-8 font-ui text-[16px] text-[#1b2330]">
            <Link href="/" className="hover:opacity-70">
              Work
            </Link>
            <Link href="/about" className="hover:opacity-70">
              About
            </Link>
            <a
              href="/Harsha_Peddinti.pdf"
              target="_blank"
              rel="noopener"
              className="bg-[#1b2330] px-[22px] py-3 text-white hover:bg-[#2a3444]"
            >
              Resume
            </a>
          </div>
        </nav>

        <div className="absolute inset-x-0 top-[12vh] z-10 flex flex-col items-center gap-4 px-6 text-center">
          <h1 className="font-perfectly-nineties text-[clamp(40px,4.6vw,72px)] font-semibold leading-[1.08] text-[#1b2330]">
            Harsha means happiness.
            <br />
            The work is serious.
          </h1>
          <p className="font-ui text-[18px] text-[#2e3a4a]">
            Product designer who builds. Previously at Nearbuy, Hypersonix.ai and Mesh.ai.
          </p>
        </div>

        <div
          ref={hintRef}
          aria-hidden
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-ui text-[13px] tracking-[0.08em] text-white/85 uppercase"
        >
          Scroll to sunrise
          <span className="block h-6 w-[2px] animate-pulse bg-white/80" />
        </div>
      </div>
    </section>
  );
}
