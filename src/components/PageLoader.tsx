"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { isBooted, isHeroReady, revealIntro, setIntroPlaying } from "@/lib/boot";

// The cube restyled eight ways, in playing order. Every frame is 16:9 with the cube
// centred at CUBE of its height, so the flip reads as one object changing material.
// `hold` is how long the style stays up: an even run, then the last three slow down
// into the real logo. `bg` is the frame's edge colour, used behind it where a portrait
// screen is taller than the frame.
const FRAMES = [
  { src: "/loader/03-gallery.webp", bg: "#be9c7a", hold: 0.15 },
  { src: "/loader/04-blister.webp", bg: "#b04924", hold: 0.15 },
  { src: "/loader/05-steel.webp", bg: "#1a120b", hold: 0.15 },
  { src: "/loader/06-poster.webp", bg: "#a07b56", hold: 0.15 },
  { src: "/loader/07-pixel.webp", bg: "#fad3a4", hold: 0.15 },
  { src: "/loader/01-chrome.webp", bg: "#f5f2ec", hold: 0.18 },
  { src: "/loader/02-knit.webp", bg: "#f0e6db", hold: 0.2 },
  { src: "/loader/08-toy.webp", bg: "#e1dbd7", hold: 0.22 },
];

const CUBE = 0.56; // cube height as a share of frame height
const LOGO_INK = 0.936; // share of logo.svg's height the cube itself occupies
const LOGO_RATIO = 110 / 125; // logo.svg width / height
const LOGO_HOLD = 0.22; // the real logo rests this long after the flip before it moves
const MIN_HOLD = 0.4; // the plain logo always shows this long before the flip
const MAX_WAIT = 3; // give up on the frames after this and go straight to the lockup
const MAX_CYCLES = 3; // the flip repeats while the hero's scene is still booting

// Height of a frame: covers the screen in landscape, sized off the width in portrait
// so the cube still fits. Mirrors the --fh custom property below.
const frameHeight = (vw: number, vh: number) => (vh > vw ? vw * 1.28 : Math.max(vh, (vw * 9) / 16));

const wait = (seconds: number) => new Promise<void>((res) => window.setTimeout(res, seconds * 1000));

/** Home-page intro: logo, a flip through its restyled twins, the name, then straight to the page. */
export default function PageLoader() {
  // Only on a hard load of the home page; arriving from another page skips it.
  const [done, setDone] = useState(isBooted);
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLImageElement>(null);
  const name = useRef<HTMLImageElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    setIntroPlaying(true);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    let cancelled = false;
    const ctx = gsap.context(() => {}, el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Runs a timeline inside the context and resolves when it finishes.
    const play = (build: (tl: gsap.core.Timeline) => void) =>
      new Promise<void>((res) => ctx.add(() => build(gsap.timeline({ onComplete: res }))));

    const imgs = frames.current.filter((img): img is HTMLImageElement => !!img);
    const loaded = Promise.all(
      imgs.map((img) => (img.complete && img.naturalWidth ? img.decode() : new Promise<void>((res, rej) => {
        img.addEventListener("load", () => img.decode().then(res, rej), { once: true });
        img.addEventListener("error", () => rej(), { once: true });
      }))),
    ).then(() => true, () => false);

    const finish = () => {
      revealIntro(); // in case the timeline never reached its own call
      html.style.overflow = prevOverflow;
      setDone(true);
    };

    const run = async () => {
      const [ready] = await Promise.all([
        reduced ? false : Promise.race([loaded, wait(MAX_WAIT).then(() => false)]),
        wait(MIN_HOLD),
      ]);
      if (cancelled) return;

      // Hard cuts through the styles; repeats only while the hero's scene is still booting,
      // so its heavy start-up is over before anything has to move smoothly.
      for (let cycle = 0; ready && cycle < MAX_CYCLES && !cancelled; cycle++) {
        await play((tl) => {
          let at = 0;
          imgs.forEach((img, i) => {
            tl.set(img, { visibility: "visible" }, at);
            tl.set(bg.current, { backgroundColor: FRAMES[i].bg }, at);
            if (i > 0) tl.set(imgs[i - 1], { visibility: "hidden" }, at);
            at += FRAMES[i].hold;
          });
          const end = at;
          // Between cycles the last style cuts straight back to the first.
          tl.set(imgs[imgs.length - 1], { visibility: "hidden" }, end);
          tl.set(bg.current, { clearProps: "backgroundColor" }, end);
        });
        if (isHeroReady()) break;
      }
      if (cancelled) return;

      const { innerWidth: vw, innerHeight: vh } = window;
      const from = (frameHeight(vw, vh) * CUBE) / LOGO_INK;
      const to = Math.max(56, Math.min(vh * 0.14, vw * 0.3));
      const gap = to * 0.12;
      const nameH = to * LOGO_INK * 0.56;
      const nameW = (nameH * 76) / 33;
      const lockW = to * LOGO_RATIO + gap + nameW;
      const nameX = -lockW / 2 + to * LOGO_RATIO + gap;

      // Cube settles left while the name opens out to its right.
      const settle = reduced ? 0 : 0.9;
      await play((tl) => {
        tl.set(name.current, { width: nameW, height: nameH, x: nameX });
        tl.to(
          cube.current,
          { scale: to / from, x: -lockW / 2 + (to * LOGO_RATIO) / 2, duration: settle, ease: "expo.inOut" },
          reduced ? 0 : LOGO_HOLD,
        );
        tl.fromTo(
          name.current,
          { opacity: 0, x: nameX - nameW * 0.3, clipPath: "inset(0% 100% 0% 0%)" },
          { opacity: 1, x: nameX, clipPath: "inset(0% 0% 0% 0%)", duration: settle * 0.62, ease: "expo.out" },
          reduced ? 0 : LOGO_HOLD + settle * 0.38,
        );
        // No hold: as the lockup comes to rest the overlay clears and the hero starts
        // assembling its world, so the page's own intro is the second half of this one.
        const out = reduced ? 0.2 : LOGO_HOLD + settle * 0.86;
        tl.call(revealIntro, undefined, out);
        tl.to(el, { opacity: 0, duration: 0.45, ease: "power1.out" }, out);
      });
      if (!cancelled) finish();
    };
    run();

    return () => {
      cancelled = true;
      setIntroPlaying(false);
      ctx.revert();
      html.style.overflow = prevOverflow;
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[9999] overflow-hidden [--fh:max(100vh,56.25vw)] portrait:[--fh:128vw]"
    >
      <div ref={bg} className="absolute inset-0 bg-parchment" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={cube}
        src="/logo.svg"
        alt=""
        width={110}
        height={125}
        // Centred with auto margins, not translate: GSAP owns this element's transform.
        className="absolute inset-0 m-auto h-[calc(var(--fh)*0.598)] w-auto max-w-none will-change-transform"
      />
      <div className="absolute inset-y-0 left-1/2 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={name} src="/wordmark.svg" alt="" width={76} height={33} className="max-w-none opacity-0" />
      </div>

      {FRAMES.map(({ src }, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          ref={(node) => {
            frames.current[i] = node;
          }}
          src={src}
          alt=""
          width={1920}
          height={1080}
          className="invisible absolute left-1/2 top-1/2 h-(--fh) w-[calc(var(--fh)*16/9)] max-w-none -translate-x-1/2 -translate-y-1/2 portrait:[mask-image:linear-gradient(transparent,#000_10%,#000_90%,transparent)]"
        />
      ))}
    </div>
  );
}
