"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

// The locked SmartTextBlock concept, restyled: every text block stores a full and a
// summarised write-up, and one toggle types the summary in or restores the full copy.

const STAR_PATH =
  "M9 0c.2 0 .4.2.4.4a8.2 8.2 0 0 0 8.2 8.2c.2 0 .4.2.4.4s-.2.4-.4.4a8.2 8.2 0 0 0-8.2 8.2c0 .2-.2.4-.4.4s-.4-.2-.4-.4A8.2 8.2 0 0 0 .4 9.4C.2 9.4 0 9.2 0 9s.2-.4.4-.4A8.2 8.2 0 0 0 8.6.4c0-.2.2-.4.4-.4Z";

type SummaryState = {
  summarised: boolean;
  typed: string;
  typing: boolean;
  toggle: () => void;
};

const SummaryContext = createContext<SummaryState | null>(null);

function useSummary() {
  const ctx = useContext(SummaryContext);
  if (!ctx) throw new Error("Summarize parts must sit inside <Summarizable>");
  return ctx;
}

export function Summarizable({ summary, children }: { summary: string; children: React.ReactNode }) {
  const [summarised, setSummarised] = useState(false);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const toggle = () => {
    if (timer.current) clearInterval(timer.current);
    if (summarised) {
      setSummarised(false);
      setTyping(false);
      return;
    }
    setSummarised(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(summary);
      return;
    }
    let i = 0;
    setTyped("");
    setTyping(true);
    timer.current = setInterval(() => {
      i += 1;
      setTyped(summary.slice(0, i));
      if (i >= summary.length) {
        if (timer.current) clearInterval(timer.current);
        setTyping(false);
      }
    }, 14);
  };

  return (
    <SummaryContext.Provider value={{ summarised, typed, typing, toggle }}>{children}</SummaryContext.Provider>
  );
}

export function SummarizeButton({ className = "" }: { className?: string }) {
  const { summarised, toggle } = useSummary();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={summarised}
      className={`group inline-flex shrink-0 cursor-pointer items-center gap-1.5 py-1 font-ui text-[15px] leading-[1.4] font-medium text-graphite transition-colors hover:text-ink ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 18"
        aria-hidden="true"
        className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:rotate-90"
      >
        <path fill="var(--color-clay)" d={STAR_PATH} />
      </svg>
      {summarised ? "Elaborate" : "Summarize"}
    </button>
  );
}

/** The full copy, swapped for the typed summary while summarised. */
export function SummaryText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { summarised, typed, typing } = useSummary();
  if (!summarised) return <>{children}</>;
  return (
    <p className={className} aria-live="polite">
      {typed}
      {typing && <span className="ml-px inline-block animate-pulse text-graphite">|</span>}
    </p>
  );
}

export function StarIcon({ size = 16, color = "var(--color-clay)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill={color} d={STAR_PATH} />
    </svg>
  );
}
