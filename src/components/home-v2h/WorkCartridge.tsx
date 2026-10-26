"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import type { Work } from "./WorkSection";

/*
 * A work card as a cartridge lying on the page: a moulded plastic body with grip ridges along
 * the top, a recess holding the printed label (the preview and the story), and a narrower lip
 * along the bottom edge, the end that goes into the console.
 *
 * Know More plays it: the cartridge is pressed in, then the label grows into the expanded
 * summary, so the modal is the label at full size rather than something fading in over the
 * page. Closing runs the same way back and the cartridge springs out.
 *
 * --lift (registered in globals.css) is how far the cartridge stands off its rest: up a little
 * on hover, negative while pressed in. The shell rises with it and the sun's shadow under it
 * lengthens; pressed in, the top sinks into the front face instead.
 */

const DEPTH = 16; // the front face: how far the top stands off the page, as on the slab
const PRESS = 9; // how far Know More pushes the top in
const PAPER = "#fbfaf6";

// Each project is moulded in its own plastic, after its tag: warm grey, and a cool slate blue.
// lit/top: the top surface; face: the front face; recess: around the label; shade: the
// shadow colour inside the mouldings.
const PLASTICS = {
  gold: {
    lit: "#ebe8df",
    top: "#e2ded3",
    face: "linear-gradient(#cfcabd, #bdb8aa 60%, #b1ac9e)",
    recess: "#d3cfc3",
    shade: "70, 62, 44",
    tag: "bg-[#F6EBD3] text-[#6B4A0C]",
  },
  blue: {
    lit: "#dfe5ec",
    top: "#d3dbe4",
    face: "linear-gradient(#bcc7d3, #a8b5c3 60%, #9ba9b8)",
    recess: "#c3cdd8",
    shade: "36, 52, 74",
    tag: "bg-[#E4EAF1] text-[#2C4A6E]",
  },
};
type Plastic = (typeof PLASTICS)[keyof typeof PLASTICS];

// The top surface sinks into the front face when pressed (never rises out of it).
const SINK: CSSProperties = { transform: "translateY(max(calc(-1 * var(--lift)), 0px))" };
const top = (p: Plastic): CSSProperties => ({
  ...SINK,
  background: `linear-gradient(${p.lit}, ${p.top} 30%)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)",
});
// Grooves moulded into the grip: a dark line with a lit line under it, so they read as cut in.
const ridges = (p: Plastic): CSSProperties => ({
  backgroundImage: `repeating-linear-gradient(to bottom, rgba(${p.shade}, 0.2) 0 1px, rgba(255,255,255,0.7) 1px 2px, transparent 2px 6px)`,
});
const recess = (p: Plastic): CSSProperties => ({
  background: p.recess,
  boxShadow: `inset 0 2px 3px rgba(${p.shade}, 0.22), inset 0 -1px 0 rgba(255,255,255,0.6)`,
});

const MODAL_BACKDROP =
  "fixed inset-0 z-[99] backdrop-blur-sm bg-[url('/assets/Landing/cards%20exp/modalbg.svg')] bg-cover bg-center bg-fixed";

// Resolves when an animation finishes. (Awaiting a GSAP animation itself resolves to the
// animation, which is thenable again, and that never settles.)
const done = (anim: gsap.core.Animation) => new Promise<void>((resolve) => void anim.then(() => resolve()));

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The panel's box as far as it shows: it usually runs on below the fold.
function visibleRect(el: Element) {
  const r = el.getBoundingClientRect();
  const top = Math.max(r.top, 0);
  return { left: r.left, top, width: r.width, height: Math.min(r.bottom, window.innerHeight) - top };
}

// Resolves with the modal's panel once the (lazily loaded) modal has mounted it.
function panelMounted(): Promise<Element> {
  return new Promise((resolve) => {
    const look = () => {
      const panel = document.querySelector("[data-modal-panel]");
      if (panel) resolve(panel);
      else requestAnimationFrame(look);
    };
    look();
  });
}

// Back to the stylesheet: hover lifts it again.
const rest = (cart: HTMLElement) => {
  cart.style.removeProperty("--lift");
  cart.style.removeProperty("transition");
};

type ModalState = { revealed: boolean; onClose: () => void };

export default function WorkCartridge({
  work,
  index,
  castFar,
  castNear,
  light,
  preload,
  Modal,
}: {
  work: Work;
  index: number;
  castFar: CSSProperties;
  castNear: CSSProperties;
  light: CSSProperties;
  preload: () => void;
  Modal: ComponentType<ModalState>;
}) {
  const cartRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const layers = useRef<{ sheet: HTMLDivElement; backdrop: HTMLDivElement } | null>(null);
  const [open, setOpen] = useState<null | "loading" | "open">(null);
  const plastic = PLASTICS[work.tag.tone];

  useEffect(() => () => {
    layers.current?.sheet.remove();
    layers.current?.backdrop.remove();
  }, []);

  const play = async () => {
    const cart = cartRef.current;
    const label = labelRef.current;
    if (busy.current || !cart || !label) return;
    if (reduced()) return setOpen("open");
    busy.current = true;
    cart.style.transition = "none"; // GSAP drives --lift from here; the hover transition would drag it

    // Mount the modal unseen straight away, so it loads and lays out while the cartridge goes in.
    setOpen("loading");
    const press = gsap.to(cart, { "--lift": `-${PRESS}px`, duration: 0.18, ease: "power2.in" });
    const [panel] = await Promise.all([panelMounted(), done(press)]);

    const from = label.getBoundingClientRect();
    const to = visibleRect(panel);
    const backdrop = document.createElement("div");
    backdrop.className = MODAL_BACKDROP;
    backdrop.style.opacity = "0";
    const sheet = document.createElement("div");
    sheet.style.cssText = `position:fixed;z-index:101;pointer-events:none;background:${PAPER};opacity:0;`;
    gsap.set(sheet, { left: from.left, top: from.top, width: from.width, height: from.height, borderRadius: 12 });
    document.body.append(backdrop, sheet);
    layers.current = { sheet, backdrop };

    // The label grows into the panel; the paper whitens and the room behind it comes up.
    const grow = gsap.timeline({ defaults: { duration: 0.55, ease: "power3.inOut" } });
    grow
      .to(sheet, { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: 24, backgroundColor: "#ffffff" }, 0)
      .to(sheet, { opacity: 1, duration: 0.18, ease: "power1.out" }, 0)
      .to(backdrop, { opacity: 1, ease: "power1.inOut" }, 0);
    await done(grow);

    // The real modal is now exactly under the sheet: show it, then let its content come through.
    setOpen("open");
    await done(gsap.to(sheet, { opacity: 0, duration: 0.22, ease: "power1.out", delay: 0.03 }));
    busy.current = false;
  };

  const close = async () => {
    const cart = cartRef.current;
    const label = labelRef.current;
    const panel = document.querySelector("[data-modal-panel]");
    const l = layers.current;
    if (busy.current) return;
    if (!cart || !label || !panel || !l || reduced()) {
      setOpen(null);
      l?.sheet.remove();
      l?.backdrop.remove();
      layers.current = null;
      if (cart) rest(cart);
      return;
    }
    busy.current = true;

    // Cover the panel with blank paper, take the modal away underneath, then shrink back.
    const from = visibleRect(panel);
    gsap.set(l.sheet, { left: from.left, top: from.top, width: from.width, height: from.height, borderRadius: 24, backgroundColor: "#ffffff" });
    await done(gsap.to(l.sheet, { opacity: 1, duration: 0.16, ease: "power1.in" }));
    setOpen(null);

    const to = label.getBoundingClientRect();
    const shrink = gsap.timeline({ defaults: { duration: 0.5, ease: "power3.inOut" } });
    shrink
      .to(l.sheet, { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: 12, backgroundColor: PAPER }, 0)
      .to(l.sheet, { opacity: 0, duration: 0.16, ease: "power1.in" }, 0.36)
      .to(l.backdrop, { opacity: 0, ease: "power1.inOut" }, 0)
      // and the cartridge springs back out
      .to(cart, { "--lift": "0px", duration: 0.45, ease: "back.out(3)" }, 0.42);
    await done(shrink);

    l.sheet.remove();
    l.backdrop.remove();
    layers.current = null;
    rest(cart);
    busy.current = false;
  };

  return (
    <article
      ref={cartRef}
      data-cameo={`card-${index + 1}`}
      onPointerEnter={preload}
      className="group relative isolate [transition:--lift_350ms_cubic-bezier(0.2,0.8,0.2,1)] hover:[--lift:5px]"
    >
      {/* The shadow stays on the page; it reaches further as the cartridge stands up. */}
      <div aria-hidden className="pointer-events-none absolute -z-20" style={castFar} />
      <div aria-hidden className="pointer-events-none absolute -z-20" style={castNear} />

      <div className="relative" style={{ transform: "translateY(min(calc(-1 * var(--lift)), 0px))" }}>
        {/* Body: the wrapper's colour is the front face, showing below the top surface. */}
        <div className="relative rounded-[28px]" style={{ background: plastic.face, paddingBottom: DEPTH }}>
          <div className="relative rounded-[28px] px-4 pb-4 lg:px-6 lg:pb-6" style={top(plastic)}>
            <div aria-hidden className="flex h-11 items-center justify-center lg:h-14">
              <div className="h-[26px] w-[36%] max-w-[360px]" style={ridges(plastic)} />
            </div>

            <div className="rounded-[18px] p-[5px]" style={recess(plastic)}>
              <div
                ref={labelRef}
                className="flex flex-col items-center gap-8 rounded-[12px] p-5 lg:flex-row lg:items-stretch lg:gap-10 lg:p-7"
                style={{ background: PAPER, boxShadow: "0 1px 0 rgba(255,255,255,0.7), 0 0 0 1px rgba(60,52,36,0.06)" }}
              >
                <div className="aspect-video w-full shrink-0 overflow-hidden rounded-[8px] bg-[#EBEAE5] lg:w-[52%]">
                  {work.video ? (
                    <video
                      src={work.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-ui text-[15px] text-ashen">
                      Preview coming soon
                    </div>
                  )}
                </div>

                <div className="flex w-full min-w-0 flex-1 flex-col gap-6 lg:gap-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="m-0 font-perfectly-nineties text-[32px] font-semibold leading-[1.1] text-[#1b2330] lg:text-[40px]">
                      {work.title}
                    </h3>
                    <p className="m-0 font-ui text-[17px] leading-[1.45] text-[#2e3a4a]">{work.description}</p>
                  </div>

                  <div className="flex w-full flex-col items-start gap-4 border-y border-[#E2E0D9] py-5 sm:flex-row sm:items-center lg:gap-7">
                    {work.stats.map(([value, label], i) => (
                      <div key={value} className="contents">
                        {i > 0 && <div aria-hidden className="h-px w-full shrink-0 bg-[#E2E0D9] sm:h-[39px] sm:w-px" />}
                        <div className="flex flex-1 items-center gap-3 lg:gap-4">
                          <span className="shrink-0 font-ui text-[32px] font-medium leading-[39px] text-[#1b2330]">{value}</span>
                          <span className="font-ui text-[15px] leading-[19px] text-[#2e3a4a]">{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex w-full flex-wrap items-center justify-start gap-2 lg:justify-end">
                    <span className={`flex h-12 items-center gap-2.5 rounded-[32px] px-4 font-ui text-[15px] ${plastic.tag}`}>
                      {work.tag.star && <img src="/Star.svg" alt="" width={16} height={16} className="shrink-0" />}
                      {work.tag.label}
                    </span>
                    <button
                      type="button"
                      onClick={play}
                      className="group/btn relative z-20 flex h-12 cursor-pointer items-center gap-2 rounded-[12px] bg-[#1b2330] px-6 font-ui text-[16px] text-white transition-colors duration-300 hover:bg-[#2a3444]"
                    >
                      Know More
                      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-[2px]">
                        <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The lip: the narrower end that goes into the console, over the body's front face. */}
        <div
          aria-hidden
          className="relative z-10 mx-10 -mt-4 rounded-b-[16px] lg:mx-[72px]"
          // face only below where the top can sink to, so the body shows through above it
          style={{ backgroundImage: plastic.face, backgroundRepeat: "no-repeat", backgroundPosition: "bottom", backgroundSize: `100% calc(100% - ${PRESS}px)`, paddingBottom: DEPTH }}
        >
          <div className="h-[22px] rounded-b-[16px]" style={{ ...SINK, background: plastic.top, boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.05)" }} />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 z-[25] rounded-[28px] mix-blend-multiply" style={light} />
      </div>

      {open && createPortal(<Modal revealed={open === "open"} onClose={close} />, document.body)}
    </article>
  );
}
