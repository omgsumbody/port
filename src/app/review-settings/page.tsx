"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import MobileSummary from "@/components/v2/MobileSummary";
import { Overview, Challenge, Goals } from "@/components/v2/sections/Opening";
import { Kickoff, Research } from "@/components/v2/sections/Discovery";
import { Strategy } from "@/components/v2/sections/Strategy";
import { Solutions, Development, Launch } from "@/components/v2/sections/Delivery";
import { DesignIteration } from "@/components/v2/sections/DesignIteration";
import { Impact } from "@/components/v2/sections/Impact";
import { Learnings, Future, Ending } from "@/components/v2/sections/Closing";

const SECTIONS: { id: string; label: string; Body: () => React.ReactNode }[] = [
  { id: "overview", label: "Overview", Body: Overview },
  { id: "the-challenge", label: "The Challenge", Body: Challenge },
  { id: "goals", label: "Goals", Body: Goals },
  { id: "kickoff", label: "Kickoff & Early Insights", Body: Kickoff },
  { id: "research", label: "Research & Discovery", Body: Research },
  { id: "strategy", label: "Strategy", Body: Strategy },
  { id: "solutions", label: "Proposed Solutions & MVPs", Body: Solutions },
  { id: "design", label: "Design & Iteration", Body: DesignIteration },
  { id: "development", label: "Development & Implementation", Body: Development },
  { id: "launch", label: "The Launch", Body: Launch },
  { id: "impact", label: "Impact & Metrics", Body: Impact },
  { id: "learnings", label: "Challenges & Learnings", Body: Learnings },
  { id: "future", label: "Future Evolution", Body: Future },
];

export default function ReviewSettingsV2() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const jumping = useRef(false);

  // Highlight the section crossing the upper part of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (jumping.current) return;
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    jumping.current = true;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    window.setTimeout(() => (jumping.current = false), 900);
  };

  return (
    <>
      <div className="md:hidden">
        <MobileSummary />
      </div>

      <div className="hidden min-h-screen bg-paper font-ui text-ink md:flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-nav-rule bg-parchment lg:flex">
          <div className="flex h-24 shrink-0 items-center">
            <Link href="/" aria-label="Home" className="ml-7 flex items-center transition-opacity hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logofull.svg" alt="Harsha Peddinti" className="h-12 w-auto" />
            </Link>
          </div>
          <nav aria-label="Case study sections" className="no-scrollbar flex flex-col overflow-y-auto pb-6">
            {SECTIONS.map(({ id, label }) => {
              const on = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => jump(e, id)}
                  aria-current={on ? "location" : undefined}
                  className={`flex w-64 items-center px-6 py-3 text-base leading-5 transition-colors duration-200 ${
                    on ? "font-semibold text-nav-active" : "font-normal text-nav-idle hover:text-nav-active"
                  }`}
                >
                  <span className="max-w-[145px]">{label}</span>
                  <span className="flex flex-1 justify-end">
                    <span
                      className={`h-1 rounded-[2px] bg-nav-mark transition-[width,opacity] duration-300 ease-[var(--ease-editorial)] ${on ? "w-6 opacity-100" : "w-0 opacity-0"}`}
                    />
                  </span>
                </a>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Tablet: the side nav folds into a slim top bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-nav-rule bg-parchment px-10 lg:hidden">
            <Link href="/" aria-label="Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logofull.svg" alt="Harsha Peddinti" className="h-9 w-auto" />
            </Link>
            <span className="text-sm text-ashen">{SECTIONS.find((s) => s.id === active)?.label}</span>
          </header>

          <main className="pt-16 lg:pt-24">
            {SECTIONS.map(({ id, label, Body }, i) => (
              <Fragment key={id}>
                {i > 0 && <div aria-hidden="true" className="my-24 h-px bg-chalk" />}
                <section id={id} aria-label={label} className="scroll-mt-24 px-10 lg:px-16">
                  <div className="mx-auto max-w-[1056px]">
                    <Body />
                  </div>
                </section>
              </Fragment>
            ))}
            <div aria-hidden="true" className="mt-24 h-px bg-chalk" />
            <Ending />
          </main>
        </div>
      </div>
    </>
  );
}
