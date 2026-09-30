"use client";

import { useEffect, useRef, useState } from "react";
import type { PortraitGL } from "./portrait-gl";

export type PortraitStyle = { src: string; label: string };

const DURATION = { shatter: 950, smear: 1150 };

/**
 * The portrait, in several styles lined up on the eyes. Hovering moves to the next style,
 * alternating a shatter and a pixel smear. Without WebGL, or with reduced motion, the
 * styles simply cross-fade.
 */
export default function PortraitShift({ styles, className }: { styles: PortraitStyle[]; className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [gl, setGl] = useState(false); // true once the WebGL canvas has taken over
  const nextRef = useRef<() => void>(() => {});

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let busy = false;
    let raf = 0;
    let mode: 0 | 1 = 0;
    let renderer: PortraitGL | null = null;
    let cancelled = false;
    // a canvas of its own: a canvas keeps its WebGL context for life
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    canvas.setAttribute("aria-hidden", "true");

    const fallbackNext = () => {
      current = (current + 1) % styles.length;
      setIndex(current);
    };
    nextRef.current = fallbackNext;
    if (reducedMotion) return;

    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all(styles.map((s) => load(s.src)))
      .then(async (images) => {
        if (cancelled) return;
        const { createPortraitGL } = await import("./portrait-gl");
        if (cancelled) return;
        box.appendChild(canvas);
        try {
          renderer = createPortraitGL(canvas, images);
        } catch {
          canvas.remove();
          return; // no WebGL: keep the cross-fading images
        }
        renderer.draw(0, 0, 0, 0, 0, 0);
        setGl(true);
        // Dev-only: draw one moment of a transition, since animation frames pause in hidden tabs.
        if (process.env.NODE_ENV !== "production") {
          (window as unknown as Record<string, unknown>).__portrait = {
            at: (from: number, to: number, other: number, p: number, m: 0 | 1, seed = 7) =>
              renderer?.draw(from, to, other, p, m, seed),
          };
        }

        nextRef.current = () => {
          if (busy || !renderer) return;
          busy = true;
          const from = current;
          const to = (current + 1) % styles.length;
          const other = (current + 2) % styles.length;
          const m = mode;
          mode = mode === 0 ? 1 : 0;
          const seed = Math.random() * 100;
          const duration = m === 0 ? DURATION.shatter : DURATION.smear;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // quick start, soft landing
            const p = 1 - Math.pow(1 - t, 2.2);
            renderer?.draw(from, to, other, p, m, seed);
            if (t < 1) raf = requestAnimationFrame(tick);
            else {
              current = to;
              setIndex(to);
              busy = false;
            }
          };
          raf = requestAnimationFrame(tick);
        };
      })
      .catch(() => {});

    const ro = new ResizeObserver(() => {
      if (!renderer) return;
      renderer.resize();
      if (!busy) renderer.draw(current, current, current, 0, 0, 0);
    });
    ro.observe(box);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer?.dispose();
      canvas.remove();
    };
  }, [styles]);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={`Portrait of Harsha, ${styles[index].label}`}
      onPointerEnter={() => nextRef.current()}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      {/* plain images until WebGL is ready, and in place of it */}
      {styles.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
          style={{ opacity: !gl && i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
