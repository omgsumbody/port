"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

/*
 * Small game cameos over the work cards. Each plays when its card comes into view, then
 * again every REPLAY_AFTER_MS while the card stays on screen:
 * 1. Bill (Contra) drops in curled up, lands on the first card, runs a few steps and
 *    somersaults off the right edge of the screen.
 * 2. The Contra power-up capsule swoops through the gap between the cards. Click it and it
 *    pops, dropping the falcon "S" onto the card below, as in the game.
 * They stay off for reduced motion. Only the capsule and the falcon take clicks; the cards
 * only move for the 3px dip when Bill lands.
 */

type Strip = { src: string; frames: number; w: number; h: number; footX: number; footY: number };

// Sheets made by the voxel sprite script: frame cell size in px (rendered at 10px per NES
// pixel) and where the feet sit inside a cell.
const BILL_RUN: Strip = { src: "/sprites/bill-run.webp", frames: 5, w: 359, h: 359, footX: 0.4875, footY: 0.9749 };
const BILL_FLIP: Strip = { src: "/sprites/bill-flip.webp", frames: 4, w: 219, h: 209, footX: 0.4795, footY: 0.9569 };
const CAPSULE: Strip = { src: "/sprites/capsule.webp", frames: 1, w: 279, h: 149, footX: 0.5, footY: 0.5 };
const FALCON: Strip = { src: "/sprites/falcon-s.webp", frames: 1, w: 279, h: 159, footX: 0.4839, footY: 0.9434 };

const NES_PX = 3; // screen px per NES pixel for the cameos
const SCALE = NES_PX / 10;
const REPLAY_AFTER_MS = 15000;

type Sprite = {
  el: HTMLDivElement;
  use: (strip: Strip, frame?: number) => void;
  frame: (n: number) => void;
  play: (frames: number[], ms: number) => void;
  stop: () => void;
  remove: () => void;
};

// A div that shows one frame of a strip, positioned by its feet (x, y) in the layer.
function makeSprite(layer: HTMLElement): Sprite {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;will-change:transform;background-repeat:no-repeat;";
  layer.appendChild(el);
  let strip: Strip = BILL_RUN;
  let timer = 0;
  const frame = (n: number) => {
    el.style.backgroundPosition = strip.frames > 1 ? `${(n / (strip.frames - 1)) * 100}% 0` : "0 0";
  };
  const use = (s: Strip, n = 0) => {
    strip = s;
    el.style.width = `${s.w * SCALE}px`;
    el.style.height = `${s.h * SCALE}px`;
    el.style.backgroundImage = `url(${s.src})`;
    el.style.backgroundSize = `${s.frames * 100}% 100%`;
    el.style.marginLeft = `${-s.footX * s.w * SCALE}px`;
    el.style.marginTop = `${-s.footY * s.h * SCALE}px`;
    frame(n);
  };
  const stop = () => window.clearInterval(timer);
  const play = (frames: number[], ms: number) => {
    stop();
    let i = 0;
    frame(frames[0]);
    timer = window.setInterval(() => frame(frames[++i % frames.length]), ms);
  };
  return { el, use, frame, play, stop, remove: () => (stop(), el.remove()) };
}

/**
 * Plays a cameo when `target` is far enough on screen, and again every REPLAY_AFTER_MS
 * after the last run finished, as long as it is still on screen.
 */
function replayWhileInView(target: Element, ratio: number, play: (done: () => void) => void) {
  let inView = false;
  let playing = false;
  let lastEnd = -Infinity;
  const tryPlay = () => {
    if (!inView || playing || document.hidden || performance.now() - lastEnd < REPLAY_AFTER_MS) return;
    playing = true;
    play(() => {
      playing = false;
      lastEnd = performance.now();
    });
  };
  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.intersectionRatio >= ratio;
      tryPlay();
    },
    { threshold: [0, ratio, 1] },
  );
  io.observe(target);
  const tick = window.setInterval(tryPlay, 1000);
  return () => {
    io.disconnect();
    window.clearInterval(tick);
  };
}

export default function WorkCameos({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card1 = section.querySelector<HTMLElement>('[data-cameo="card-1"]');
    const card2 = section.querySelector<HTMLElement>('[data-cameo="card-2"]');
    if (!card1 || !card2) return;

    // warm the sheets so the first frames are ready
    [BILL_RUN, BILL_FLIP, CAPSULE, FALCON].forEach((s) => (new Image().src = s.src));

    const sprites = new Set<Sprite>();
    const timelines = new Set<gsap.core.Timeline>();
    const spawn = () => {
      const s = makeSprite(layer);
      sprites.add(s);
      return s;
    };
    const drop = (s: Sprite) => {
      s.remove();
      sprites.delete(s);
    };
    const timeline = (onDone: () => void) => {
      const tl = gsap.timeline({
        onComplete: () => {
          timelines.delete(tl);
          onDone();
        },
      });
      timelines.add(tl);
      return tl;
    };
    // positions inside the layer, which covers the section
    const box = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const s = layer.getBoundingClientRect();
      return { left: r.left - s.left, top: r.top - s.top, right: r.right - s.left, bottom: r.bottom - s.top, width: r.width };
    };
    const offLeft = () => -layer.getBoundingClientRect().left - 80;
    const offRight = () => window.innerWidth - layer.getBoundingClientRect().left + 80;

    // 1. Bill lands on the first card
    const bill = (done: () => void) => {
      const c = box(card1);
      const s = spawn();
      const landX = c.left + c.width * 0.62;
      const pos = { x: landX, y: c.top - 520 };
      const place = () => gsap.set(s.el, { x: pos.x, y: pos.y });
      s.use(BILL_FLIP);
      s.play([0, 1, 2, 3], 60);
      place();
      timeline(() => (drop(s), done()))
        .to(pos, { y: c.top, duration: 0.55, ease: "power2.in", onUpdate: place })
        .add(() => {
          s.use(BILL_RUN, 0); // lands standing, gun forward
          s.stop();
        })
        .to(card1, { y: 3, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, "<")
        .add(() => s.play([1, 2, 3, 4], 90), "+=0.3")
        .to(pos, { x: landX + 150, duration: 0.6, ease: "none", onUpdate: place })
        .add(() => {
          s.use(BILL_FLIP);
          s.play([0, 1, 2, 3], 60);
        })
        .to(pos, { x: offRight(), duration: 0.9, ease: "none", onUpdate: place })
        .to(pos, { keyframes: { y: [c.top - 150, c.top - 190, c.top - 120, c.top + 220] }, duration: 0.9, ease: "none", onUpdate: place }, "<");
    };

    // The falcon "S" pops out of the capsule, arcs up and falls onto the card below.
    const falcon = (x: number, y: number) => {
      const floor = box(card2).top;
      const s = spawn();
      s.use(FALCON);
      s.el.style.pointerEvents = "auto";
      s.el.style.cursor = "pointer";
      const pos = { x, y };
      const place = () => gsap.set(s.el, { x: pos.x, y: pos.y });
      place();
      const tl = timeline(() => drop(s));
      tl.to(pos, { y: y - 70, duration: 0.28, ease: "power2.out", onUpdate: place })
        .to(pos, { y: floor, duration: 0.42, ease: "power2.in", onUpdate: place })
        .to(pos, { x: x + 70, duration: 0.7, ease: "none", onUpdate: place }, 0)
        .to(pos, { y: floor - 10, duration: 0.1, ease: "power1.out", yoyo: true, repeat: 1, onUpdate: place })
        // sits there a while, then blinks out like an uncollected pickup
        .to(s.el, { opacity: 0, duration: 0.08, repeat: 9, yoyo: true, ease: "steps(1)" }, "+=3.2")
        .to(s.el, { opacity: 0, duration: 0.01 });
      // collect it: a click picks it up
      s.el.addEventListener(
        "click",
        () => {
          tl.kill();
          timelines.delete(tl);
          gsap.to(s.el, { scale: 1.6, opacity: 0, duration: 0.18, ease: "power2.out", onComplete: () => drop(s) });
        },
        { once: true },
      );
    };

    // 2. The power-up capsule swoops through the gap between the cards
    const capsule = (done: () => void) => {
      const a = box(card1);
      const b = box(card2);
      const gapY = (a.bottom + b.top) / 2;
      const s = spawn();
      s.use(CAPSULE);
      s.el.style.pointerEvents = "auto";
      s.el.style.cursor = "pointer";
      const start = offLeft();
      const end = offRight();
      const t = { p: 0 };
      const at = () => ({ x: start + (end - start) * t.p, y: gapY + Math.sin(t.p * Math.PI * 4) * 34 });
      const place = () => gsap.set(s.el, at()); // Contra's up-and-down swoop
      place();
      const tl = timeline(() => (drop(s), done()));
      tl.to(t, { p: 1, duration: 4.5, ease: "none", onUpdate: place });
      s.el.addEventListener(
        "click",
        () => {
          const { x, y } = at();
          tl.kill();
          timelines.delete(tl);
          gsap.to(s.el, {
            scale: 1.4,
            opacity: 0,
            duration: 0.14,
            ease: "power2.out",
            onComplete: () => (drop(s), done()),
          });
          falcon(x, y + (FALCON.h * SCALE) / 2);
        },
        { once: true },
      );
    };

    // Dev-only: jump a cameo to a moment, since animation frames pause in hidden tabs.
    if (process.env.NODE_ENV !== "production") {
      const plays = { bill, capsule };
      (window as unknown as Record<string, unknown>).__cameos = {
        at(name: keyof typeof plays, t: number) {
          timelines.forEach((tl) => tl.kill());
          timelines.clear();
          sprites.forEach((sp) => sp.remove());
          sprites.clear();
          plays[name](() => {});
          [...timelines].pop()?.pause().seek(t, false);
        },
        popCapsule() {
          [...sprites].pop()?.el.click();
        },
      };
    }

    const cleanups = [
      replayWhileInView(card1, 0.55, bill),
      replayWhileInView(card2, 0.35, capsule),
    ];

    return () => {
      cleanups.forEach((c) => c());
      timelines.forEach((t) => t.kill());
      sprites.forEach((s) => s.remove());
      gsap.set(card1, { clearProps: "transform" });
    };
  }, [sectionRef]);

  return <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0 z-30" />;
}
