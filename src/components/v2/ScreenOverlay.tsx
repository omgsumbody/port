"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type OverlayScreen = { src: string; title: string; alt: string };

type View = { s: number; x: number; y: number };

const TOP = 104; // clear of the floating header
const BOTTOM = 88; // clear of the floating footer
const MAX_SCALE = 2;
const MINIMAP_W = 220;

/**
 * Full-screen viewer for the final-flow screens: fit, zoom, drag to pan, step through
 * screens, with a minimap showing where you are. Keyboard: Esc, ←/→, +/−, 0.
 */
export default function ScreenOverlay({
  screens,
  index,
  onIndex,
  onClose,
}: {
  screens: OverlayScreen[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState<{ src: string; w: number; h: number } | null>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [fit, setFit] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const screen = screens[index];
  const natural = loaded && loaded.src === screen.src ? loaded : null;
  const n = screens.length;

  const viewport = () => {
    const el = stage.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: window.innerWidth, h: window.innerHeight };
  };

  const fitTo = useCallback((nat: { w: number; h: number }) => {
    const vp = viewport();
    const s = Math.min((vp.w - 48) / nat.w, (vp.h - TOP - BOTTOM) / nat.h, 1);
    setVp(vp);
    setFit(s);
    setView({ s, x: (vp.w - nat.w * s) / 2, y: TOP + (vp.h - TOP - BOTTOM - nat.h * s) / 2 });
  }, []);

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      if (!natural) return;
      const vp = viewport();
      const px = cx ?? vp.w / 2;
      const py = cy ?? vp.h / 2;
      setView((v) => {
        const s = Math.min(MAX_SCALE, Math.max(fit, v.s * factor));
        const k = s / v.s;
        return { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
      });
    },
    [natural, fit],
  );

  // Lock page scroll, move focus in, restore it on close.
  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
      else if (e.key === "+" || e.key === "=") zoomAt(1.25);
      else if (e.key === "-" || e.key === "_") zoomAt(0.8);
      else if (e.key === "0" && natural) fitTo(natural);
    };
    const onResize = () => natural && fitTo(natural);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [index, n, natural, onClose, onIndex, zoomAt, fitTo]);

  // Wheel: pinch / ctrl+wheel zooms toward the cursor, plain wheel pans.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
      else setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const miniH = natural ? Math.min(140, Math.round((MINIMAP_W * natural.h) / natural.w)) : 94;
  const mini = natural
    ? (() => {
        const k = MINIMAP_W / (natural.w * view.s);
        const left = Math.max(0, -view.x * k);
        const top = Math.max(0, -(view.y - TOP) * k);
        return {
          left,
          top,
          width: Math.max(8, Math.min(MINIMAP_W - left, vp.w * k)),
          height: Math.max(8, Math.min(miniH - top, (vp.h - TOP) * k)),
        };
      })()
    : null;
  const zoomLabel = !natural || Math.abs(view.s - fit) < 0.001 ? "Fit" : `${Math.round(view.s * 100)}%`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={screen.title}
      className="fixed inset-0 z-50 overflow-hidden bg-parchment bg-[radial-gradient(var(--color-chalk)_1px,transparent_1px)] [background-size:24px_24px]"
    >
      <div
        ref={stage}
        className={`absolute inset-0 touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={(e) => {
          drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y };
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          setView((v) => ({ ...v, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py }));
        }}
        onPointerUp={() => {
          drag.current = null;
          setDragging(false);
        }}
        onDoubleClick={(e) => {
          if (view.s - fit < 0.01) zoomAt(2.5, e.clientX, e.clientY);
          else if (natural) fitTo(natural);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={screen.src}
          src={screen.src}
          alt={screen.alt}
          draggable={false}
          onLoad={(e) => {
            const nat = { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight };
            setLoaded({ src: screen.src, ...nat });
            fitTo(nat);
          }}
          className={`absolute top-0 left-0 max-w-none origin-top-left rounded-lg shadow-lift select-none ${natural ? "opacity-100" : "opacity-0"} ${
            dragging ? "" : "transition-[transform,opacity] duration-300 ease-[var(--ease-editorial)]"
          }`}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        />
      </div>

      <header className="absolute inset-x-4 top-4 flex items-center justify-between gap-4 rounded-card border border-chalk bg-paper py-3 pr-3 pl-5 shadow-lift lg:inset-x-6 lg:top-6">
        <p className="min-w-0 truncate font-editorial text-xl leading-[1.3] text-ink">{screen.title}</p>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Previous step" onClick={() => onIndex((index - 1 + n) % n)} d="M10 3 5 8l5 5" />
          <span className="min-w-12 text-center font-ui text-sm leading-5 text-ashen tabular-nums">
            {index + 1} / {n}
          </span>
          <IconButton label="Next step" onClick={() => onIndex((index + 1) % n)} d="m6 3 5 5-5 5" />
          <span className="mx-1 h-6 w-px bg-chalk" aria-hidden="true" />
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 cursor-pointer items-center gap-2.5 rounded-control border border-mist pr-3 pl-4 font-ui text-[15px] leading-[1.4] font-medium text-graphite transition-colors hover:border-ink hover:text-ink"
          >
            Close
            <Key>Esc</Key>
          </button>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-6 hidden rounded-control border border-chalk bg-paper p-2 shadow-lift lg:block"
      >
        <div className="relative overflow-hidden rounded bg-stone" style={{ width: MINIMAP_W, height: miniH }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={screen.src} alt="" className="block h-full w-full object-cover object-left-top" />
          {mini && (
            <div
              className="absolute rounded-[3px] border-[1.5px] border-ink bg-ink/5"
              style={{ left: mini.left, top: mini.top, width: mini.width, height: mini.height }}
            />
          )}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 flex items-center gap-3 rounded-control border border-chalk bg-paper py-1.5 pr-3.5 pl-1.5 font-ui text-sm leading-5 text-ashen shadow-lift lg:right-6 lg:bottom-6">
        <div role="group" aria-label="Zoom" className="flex items-center gap-0.5">
          <ZoomButton label="Zoom out" onClick={() => zoomAt(0.8)} d="M4 8h8" />
          <button
            type="button"
            aria-label="Fit to screen"
            onClick={() => natural && fitTo(natural)}
            className="h-8 min-w-14 cursor-pointer rounded-md font-ui text-sm text-ink tabular-nums hover:bg-stone"
          >
            {zoomLabel}
          </button>
          <ZoomButton label="Zoom in" onClick={() => zoomAt(1.25)} d="M4 8h8M8 4v8" />
        </div>
        <span className="h-4 w-px bg-chalk" aria-hidden="true" />
        <span>Drag to pan</span>
        <span className="hidden h-4 w-px bg-chalk lg:block" aria-hidden="true" />
        <span className="hidden items-center gap-1 lg:flex">
          <Key>−</Key>
          <Key>+</Key> zoom
        </span>
        <span className="hidden items-center gap-1 lg:flex">
          <Key>←</Key>
          <Key>→</Key> steps
        </span>
      </div>
    </div>,
    document.body,
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-mist px-[5px] py-[3px] font-ui text-[11px] leading-none text-graphite">{children}</span>;
}

function IconButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 cursor-pointer items-center justify-center rounded-control border border-mist text-graphite transition-colors hover:border-ink hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function ZoomButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-md text-graphite hover:bg-stone hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
