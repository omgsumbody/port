"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ShorelineHandle } from "./shoreline/scene";
import { SKY_DAWN } from "./shoreline/palette";

// The hero pins for one extra screen of scrolling; that scroll drives the sunrise.
const PIN_SCREENS = 1;

export default function ShorelineHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [built, setBuilt] = useState(false); // headline waits for the world to finish loading

  useEffect(() => {
    const section = sectionRef.current;
    const sceneBox = sceneRef.current;
    const stage = stageRef.current;
    if (!section || !sceneBox || !stage) return;

    // Each scene gets a canvas of its own. A canvas keeps its WebGL context for life, so
    // reusing one after dispose() released that context (hot reload, remount) would hand
    // the new scene a dead context.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    sceneBox.appendChild(canvas);

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
    const toNdc = (e: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1] as const;
    };
    // Pointer over text or links belongs to them, not to the sand behind.
    const overUi = (e: Event) => (e.target as HTMLElement).closest("a, button, h1, p, nav") !== null;
    const onPointer = (e: PointerEvent) => {
      handle?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      if (!handle) return;
      const inside = stage.contains(e.target as Node) && !overUi(e);
      const hit = inside ? handle.hover(...toNdc(e)) : handle.hover(9, 9);
      stage.style.cursor = hit ? "pointer" : "";
    };
    const onClick = (e: MouseEvent) => {
      if (!handle || overUi(e)) return;
      handle.click(...toNdc(e));
    };
    const failSafe = window.setTimeout(() => setBuilt(true), 4000);

    const resizeObserver = new ResizeObserver(() => handle?.resize());
    const visibility = new IntersectionObserver(([entry]) => handle?.setActive(entry.isIntersecting));

    // three.js loads after the headline has painted.
    import("./shoreline/scene").then(({ createShoreline }) => {
      if (cancelled) return;
      try {
        handle = createShoreline(canvas, {
          reducedMotion,
          onBuilt: () => setBuilt(true),
          onContextLost: (lost) => setReady(!lost), // the CSS sky shows while the GPU recovers
        });
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[shoreline] WebGL unavailable, showing the CSS sky. Check chrome://gpu.", err);
        }
        setBuilt(true);
        return; // no WebGL: the CSS sky behind the canvas stays as the hero
      }
      handle.setProgress(progress());
      resizeObserver.observe(canvas);
      visibility.observe(section);
      setReady(true);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    stage.addEventListener("click", onClick);
    onScroll();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      stage.removeEventListener("click", onClick);
      window.clearTimeout(failSafe);
      resizeObserver.disconnect();
      visibility.disconnect();
      handle?.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative"
      style={{ height: `${(PIN_SCREENS + 1) * 100}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Shown before the scene loads, and in place of it without WebGL */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${SKY_DAWN[9]} 0%, ${SKY_DAWN[6]} 40%, ${SKY_DAWN[1]} 64%, #2c4a6e 65%, #3e5670 84%, #5f6c78 85%)`,
          }}
        />
        <div
          ref={sceneRef}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700"
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

        <div
          className="pointer-events-none absolute inset-x-0 top-[27vh] z-10 flex flex-col items-center gap-4 px-6 text-center transition-[opacity,transform] duration-700 ease-out [&>*]:pointer-events-auto"
          style={{ opacity: built ? 1 : 0, transform: built ? "none" : "translateY(10px)" }}
        >
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
