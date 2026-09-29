"use client";

import { useEffect, useRef, useState } from "react";
import Pic from "@/components/v2/Pic";
import { Prose, SectionHeader, SplitRow, SubHeading } from "@/components/v2/ui";
import { Summarizable, SummarizeButton, SummaryText, StarIcon } from "@/components/v2/Summarize";

const A = "/assets/Review settings";

const STEPS: { label: string; icon: React.ReactNode }[] = [
  { label: "Calls with the PM", icon: <path d="M3 4h12v8H8l-3 3v-3H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /> },
  {
    label: "Reading the PRD",
    icon: (
      <>
        <path d="M5 2h6l3 3v11H5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7.5 9h4M7.5 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "An initial mind map",
    icon: (
      <>
        <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="3.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="14.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="3.5" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="14.5" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7.4 7.5 4.6 5M10.6 7.5 13.4 5M7.4 10.5 4.6 13M10.6 10.5l2.8 2.5" stroke="currentColor" strokeWidth="1.3" />
      </>
    ),
  },
  {
    label: "Testing demo accounts as different users",
    icon: (
      <>
        <rect x="2" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 16h6M9 13v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
];

export function Kickoff() {
  return (
    <div className="flex flex-col">
      <SectionHeader title="Kickoff & Early Insights" intro="Before designing, I learned the module the way a new customer would." />

      <Summarizable summary="I began by aligning with the PM, reviewing the PRD and mapping my understanding, then tested the existing flow in demo accounts from several user perspectives. Setup was tedious and unclear, so first-time users focused on getting through it rather than understanding it.">
        <SplitRow label={<SubHeading>Learning it as a first-time user</SubHeading>} className="py-16">
          <ol aria-label="Kickoff steps" className="grid grid-cols-2 overflow-hidden rounded-card border border-chalk md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.label}
                className={`flex flex-col gap-3.5 p-5 ${i % 2 ? "border-l border-chalk" : ""} ${i > 1 ? "border-t border-chalk md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-[10px] bg-stone text-ink">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </span>
                  <span className="font-ui text-[13px] text-pebble tabular-nums">{i + 1}</span>
                </div>
                <span className="font-ui text-[15px] leading-[1.4] text-ink">{s.label}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <SummarizeButton />
            </div>
            <SummaryText className="font-ui text-lg leading-[1.6] text-graphite">
              <Prose>
                I started by understanding the module through calls with our PM and reading the PRD he had prepared. After collecting
                my thoughts into an initial mind map, I went into demo accounts and used the existing platform, testing the flow from
                different user perspectives and noting every pain point.
              </Prose>
              <Prose>
                The early insight: creating a review cycle was a painstaking process, and most settings were incomprehensible to a
                first-time user.
              </Prose>
            </SummaryText>
          </div>

          <figure className="m-0 grid grid-cols-[40px_minmax(0,1fr)] gap-2 rounded-card bg-parchment px-8 py-7">
            <span aria-hidden="true" className="font-editorial text-[56px] leading-[0.8] text-clay">
              &ldquo;
            </span>
            <div className="flex flex-col gap-2.5">
              <blockquote className="m-0 font-editorial text-2xl leading-[1.4] text-ink">
                My sentiment was to get through to the end of the review cycle, somehow.
              </blockquote>
              <figcaption className="font-ui text-sm leading-[1.5] text-ashen">My own note after the first walkthrough</figcaption>
            </div>
          </figure>
        </SplitRow>
      </Summarizable>

      <OldArchitecture />
    </div>
  );
}

/** The old flowchart: drag or step through it; the thumb tracks how far you've travelled. */
function OldArchitecture() {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [progress, setProgress] = useState({ width: 40, offset: 0 });

  const measure = () => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const width = Math.round((el.clientWidth / el.scrollWidth) * 100);
    setProgress({ width, offset: max > 0 ? Math.round((el.scrollLeft / max) * (100 - width)) : 0 });
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section aria-label="The old architecture" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-end gap-4 xl:grid-cols-[280px_minmax(0,1fr)_auto] xl:gap-12">
        <SubHeading>The old architecture</SubHeading>
        <p className="font-ui text-base leading-[1.6] text-graphite">Every setting in the old creation flow, mapped end to end.</p>
        <div className="flex items-center gap-2">
          <RoundButton label="Scroll left" onClick={() => step(-1)} d="M10 3 5 8l5 5" />
          <RoundButton label="Scroll right" onClick={() => step(1)} d="m6 3 5 5-5 5" />
        </div>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-card-lg border border-chalk bg-parchment lg:h-[420px]">
        <div
          ref={scroller}
          onScroll={measure}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") return;
            drag.current = { x: e.clientX, left: scroller.current?.scrollLeft ?? 0 };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current || !scroller.current) return;
            scroller.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          className="no-scrollbar h-full cursor-grab overflow-x-auto overflow-y-hidden px-10 pt-10 active:cursor-grabbing"
          tabIndex={0}
          aria-label="Old architecture flowchart, scrollable"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${A}/Kidckoff-old-prod2.png`}
            alt="Flowchart of the old review cycle creation architecture"
            loading="lazy"
            draggable={false}
            className="h-[280px] w-auto max-w-none select-none lg:h-[340px]"
          />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[120px] bg-gradient-to-l from-parchment to-transparent" />
        <div className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-2 rounded-full border border-chalk bg-paper px-3 py-1.5 font-ui text-[13px] leading-[1.4] text-ashen">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8h12M5 5 2 8l3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drag to explore
        </div>
        <div aria-hidden="true" className="absolute right-5 bottom-4 h-1 w-[120px] overflow-hidden rounded-sm bg-chalk">
          <div className="h-full rounded-sm bg-ink" style={{ width: `${progress.width}%`, marginLeft: `${progress.offset}%` }} />
        </div>
      </div>
    </section>
  );
}

export function RoundButton({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-chalk bg-paper text-graphite transition-colors hover:border-mist hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

const LOGOS = [
  ["lattice.svg", "Lattice"],
  ["15five.svg", "15Five"],
  ["leapsome.svg", "Leapsome"],
];

const PEOPLE = [
  ["Leadership", "CEO and co-founder (People Science)"],
  ["Customer success", "CSMs who set up review cycles for clients"],
  ["Customers", "HR leaders, Product leaders and GTM head"],
];

export function Research() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        title="Research & Discovery"
        intro="Before redesigning anything, I looked at how the category leaders handle review setup, then spoke to the people who run and sell review cycles every day."
        className="pb-16"
      />

      <section
        aria-label="Competitive research"
        className="grid grid-cols-1 items-center gap-8 rounded-card-lg border border-chalk bg-paper p-8 lg:grid-cols-[5fr_7fr]"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">Benchmarked against the category leaders</h3>
          <p className="font-ui text-base leading-[1.63] text-graphite">
            A detailed competitive study of how each product sets up a review cycle, and where they set the industry standard.
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-3 gap-3">
          {LOGOS.map(([file, name]) => (
            <div key={name} className="flex h-24 items-center justify-center rounded-card bg-stone p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${A}/${file}`} alt={name} loading="lazy" className="max-h-9 max-w-full object-contain opacity-85 grayscale" />
            </div>
          ))}
        </div>
      </section>

      <Summarizable summary="I studied the category leaders, used AI to synthesise every piece of user feedback on Reviews, then interviewed the founders, CSMs and HR leaders. The findings reshaped which features we added and how existing settings were grouped.">
        <SplitRow label={<SubHeading>What the research changed</SubHeading>} className="py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              <MethodChip
                icon={
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2" y="3" width="5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="9" y="3" width="5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                }
              >
                Competitive study
              </MethodChip>
              <MethodChip icon={<StarIcon color="var(--color-ink)" />}>AI feedback synthesis</MethodChip>
              <MethodChip
                icon={
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 4h12v8H8l-3 3v-3H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                }
              >
                Stakeholder interviews
              </MethodChip>
            </div>
            <SummarizeButton />
          </div>
          <SummaryText className="font-ui text-base leading-[1.63] text-graphite">
            <div className="flex flex-col gap-4">
              <Prose size="sm">
                Through this I drew parallels between our product and our competitors. With our product leader, I added new features
                and regrouped the existing settings by user need and sprint priority. I also used AI to synthesise all the user
                feedback on the Reviews module, which strengthened and validated the insights we already had.
              </Prose>
              <Prose size="sm">
                I then spoke with the CEO and the co-founder (People Science lead) to understand the business thinking behind Reviews
                and what makes the product desirable. After that came interviews with CSMs, to understand how different end users
                think and the business philosophies behind their review cycles, and with several HR leaders, alongside our product
                leader and GTM head.
              </Prose>
            </div>
          </SummaryText>
        </SplitRow>
      </Summarizable>

      <dl className="grid grid-cols-1 gap-6 border-t border-chalk py-6 md:grid-cols-3">
        {PEOPLE.map(([dt, dd]) => (
          <div key={dt} className="flex flex-col gap-1">
            <dt className="font-ui text-sm leading-[1.5] text-ashen">{dt}</dt>
            <dd className="font-ui text-base leading-[1.5] text-ink">{dd}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            ["rd-2.png", "Remote research session with Mesh leadership"],
            ["rd-1.png", "Interview call with the CEO and product leadership"],
          ].map(([file, alt]) => (
            <div key={file} className="relative h-[300px] overflow-hidden rounded-card bg-stone">
              <Pic src={`${A}/${file}`} alt={alt} sizes="(min-width: 1024px) 520px, 50vw" className="object-cover object-bottom" />
            </div>
          ))}
        </div>
        <p className="font-ui text-sm leading-[1.5] text-ashen">Research calls with the founders and product leadership.</p>
      </div>
    </div>
  );
}

function MethodChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-chalk px-3 py-2 font-ui text-sm leading-[1.4] text-ink">
      {icon}
      {children}
    </span>
  );
}
