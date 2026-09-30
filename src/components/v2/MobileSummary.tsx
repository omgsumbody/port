"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Pic from "@/components/v2/Pic";

// Phone layout: a timed splash explaining this is the short version, one screen of
// summary per section, then a nudge to open the full study on a laptop.

const A = "/assets/Review settings";
const SPLASH_MS = 4200;

function Laptop({ size = 40, stroke = 1.5 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="7" y="9" width="26" height="17" rx="2" stroke="currentColor" strokeWidth={stroke} />
      <path d="M3 30h34" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

function Splash() {
  const [visible, setVisible] = useState(true);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGo(true), 60);
    const t2 = setTimeout(() => setVisible(false), SPLASH_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="About this summary"
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-parchment px-6 pt-6 pb-8 transition-[opacity,visibility] duration-500 ${
        visible ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logofull.svg" alt="Harsha Peddinti" className="h-9 w-auto self-start" />
      <div className="flex flex-col gap-4 text-ink">
        <Laptop />
        <p className="font-ui text-xs leading-[1.5] tracking-[0.06em] text-ashen uppercase">Overall summary</p>
        <h1 className="font-editorial text-4xl leading-[1.1] font-normal">Review Settings</h1>
        <p className="font-ui text-[17px] leading-[1.55] text-graphite">
          You&rsquo;re reading a short, high-level summary. Desktop view is recommended for the full case study, with every flow, study
          and number.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-0.5 overflow-hidden rounded-sm bg-chalk">
          <div className="h-full bg-ink transition-[width] ease-linear" style={{ width: go ? "100%" : "0%", transitionDuration: `${SPLASH_MS - 400}ms` }} />
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          tabIndex={visible ? 0 : -1}
          className="h-12 rounded-[10px] border border-ink font-ui text-[15px] font-medium text-ink"
        >
          Continue to summary
        </button>
      </div>
    </div>
  );
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-editorial text-[28px] leading-[1.15] font-normal text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => <p className="font-ui text-base leading-[1.6] text-graphite">{children}</p>;
const Strong = ({ children }: { children: React.ReactNode }) => (
  <span className="font-ui text-base leading-[1.4] font-medium text-ink">{children}</span>
);
const Muted = ({ children }: { children: React.ReactNode }) => <span className="font-ui text-sm leading-[1.5] text-ashen">{children}</span>;
const Green = ({ children }: { children: React.ReactNode }) => (
  <span className="font-editorial text-[26px] leading-[1.1] text-gain tabular-nums">{children}</span>
);
const Rows = ({ children }: { children: React.ReactNode }) => <div className="mt-2 flex flex-col border-t border-chalk">{children}</div>;
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col gap-1 border-b border-chalk py-3.5">{children}</div>;
const Quote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="mt-2 border-l-2 border-clay pl-4 font-editorial text-xl leading-[1.4] text-ink">{children}</blockquote>
);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <section aria-label={title} className="flex flex-col gap-4 px-5 py-12">
        <H2>{title}</H2>
        {children}
      </section>
      <div aria-hidden="true" className="h-px bg-chalk" />
    </>
  );
}

const STATS: [string, string, string][] = [
  ["35%", "▲", "faster review cycle creation"],
  ["40%", "▼", "lower abandonment rate"],
  ["17%", "▲", "better user feedback"],
  ["8%", "▲", "more review cycles created"],
];

const TILES: [string, string][] = [
  ["ex2.png", "Frequency, duration and type, up front"],
  ["ex5.png", "Letting the machine carry the maths"],
  ["ex6.png", "Score visibility by employee type"],
  ["ex7.png", "Calibration and scoring inside every cycle"],
  ["ex8.png", "Skip ahead, then see the whole cycle"],
  ["ex9.png", "Edge cases, then one summary to launch"],
  ["ex10.png", "A command centre for every cycle"],
];

export default function MobileSummary() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="bg-paper font-ui text-ink">
      <Splash />

      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-nav-rule bg-parchment px-5">
        <Link href="/" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logofull.svg" alt="Harsha Peddinti" className="h-[30px] w-auto" />
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[13px] leading-[1.4] text-ashen">
          <Laptop size={14} stroke={3} />
          Summary
        </span>
      </header>

      <main>
        <section aria-label="Overview" className="flex flex-col gap-5 px-5 pt-5">
          <figure className="m-0 h-[200px] overflow-hidden rounded-[18px] bg-stone pt-6 pl-6">
            <div className="relative h-full w-full overflow-hidden rounded-tl-[10px] border border-chalk">
              <Pic src={`${A}/ex3.png`} alt="The redesigned review cycle setup with Views" sizes="100vw" priority className="object-cover object-left-top" />
            </div>
          </figure>
          <div className="flex flex-col gap-3 pt-2">
            <h1 className="font-editorial text-[44px] leading-none font-normal tracking-[-0.01em]">Review Settings</h1>
            <p className="text-base leading-[1.5] text-graphite">
              Helping businesses run performance reviews their way, with modular settings and a faster path to launching a cycle.
            </p>
          </div>
          <dl className="flex flex-col gap-2.5 text-sm leading-[1.5]">
            <div className="flex gap-3">
              <dt className="w-[88px] shrink-0 text-ashen">Role</dt>
              <dd>Product Designer, end to end</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-[88px] shrink-0 text-ashen">Team</dt>
              <dd>1 product leader, 6 developers</dd>
            </div>
          </dl>
          <dl className="-mx-5 mt-2 grid grid-cols-2 border-y border-chalk">
            {STATS.map(([n, a, l], i) => (
              <div key={l} className={`flex flex-col gap-1.5 p-5 ${i % 2 ? "border-l border-chalk" : ""} ${i < 2 ? "border-b border-chalk" : ""}`}>
                <dd className="order-1 flex items-baseline gap-1.5">
                  <span className="font-editorial text-[40px] leading-none font-bold tabular-nums">{n}</span>
                  <span className="text-xs font-bold text-gain">{a}</span>
                </dd>
                <dt className="order-2 text-sm leading-[1.4] text-graphite">{l}</dt>
              </div>
            ))}
          </dl>
        </section>
        <div className="h-2" />
        <div aria-hidden="true" className="h-px bg-chalk" />

        <Section title="The Challenge">
          <P>Review cycle settings were uncategorised, so HR managers couldn&rsquo;t build a cycle around how their company runs reviews.</P>
          <Rows>
            <Row>
              <Strong>HR managers</Strong>
              <Muted>Couldn&rsquo;t shape a cycle around their own philosophy.</Muted>
            </Row>
            <Row>
              <Strong>Our CSMs</Strong>
              <Muted>Had to hand-hold every custom cycle from start to launch.</Muted>
            </Row>
          </Rows>
        </Section>

        <Section title="Goals">
          <P>Four goals set at kickoff, each paired with what it delivered.</P>
          <Rows>
            {[
              ["Fit every company's philosophy", "52–64%", "of large businesses adopted Views"],
              ["Plug and play, yet modular", "12 → 4", "pages to set up a cycle"],
              ["Faster, more accurate setup", "35%", "faster cycle creation"],
              ["Fewer people dropping off", "40%", "lower abandonment"],
            ].map(([g, n, r]) => (
              <Row key={g}>
                <Strong>{g}</Strong>
                <span className="flex items-baseline gap-2.5">
                  <Green>{n}</Green>
                  <Muted>{r}</Muted>
                </span>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Kickoff & Early Insights">
          <P>
            I learned the module the way a new customer would: PM calls, the PRD, a mind map, then demo accounts as different users.
            Creating a cycle was painstaking, and most settings made no sense to a first-timer.
          </P>
          <Quote>My sentiment was to get through to the end of the review cycle, somehow.</Quote>
        </Section>

        <Section title="Research & Discovery">
          <P>I benchmarked the category leaders, used AI to synthesise all user feedback on Reviews, then interviewed the founders, CSMs and HR leaders.</P>
          <Rows>
            {[
              ["Competitive study", "Where the industry sets the standard for setup"],
              ["AI feedback synthesis", "Validated the insights we already had"],
              ["Stakeholder interviews", "Leadership, CSMs, HR and product leaders"],
            ].map(([a, b]) => (
              <Row key={a}>
                <Strong>{a}</Strong>
                <Muted>{b}</Muted>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Strategy">
          <P>
            Product data showed four in ten setups were abandoned. Interviews showed people think in phases, not forms. Tree and A/B tests
            showed the timeline anchored every decision.
          </P>
          <Rows>
            {[
              ["Product data", "reusable default settings"],
              ["Interviews", "timeline-driven configuration"],
              ["Tree and A/B tests", "a more visible timeline"],
            ].map(([a, b]) => (
              <Row key={a}>
                <Muted>{a}</Muted>
                <Strong>So I designed for {b}</Strong>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Proposed Solutions & MVPs">
          <Rows>
            {(
              [
                ["Views", "One cycle, each group of employees treated differently", true],
                ["Calibration & scoring", "Set per View, or for the whole cycle", true],
                ["A new creation flow", "Holds the new features and clears UX debt", true],
                ["Plug and play", "Sensible defaults with every setting explained", true],
                ["Timeline", "The whole cycle, visualised and shareable", true],
                ["Conversational search", "Paused for clean data and GDPR safety", false],
              ] as const
            ).map(([name, line, built]) => (
              <Row key={name}>
                <span className="flex items-baseline justify-between gap-3">
                  <Strong>{name}</Strong>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 text-[13px] leading-[1.4] ${built ? "text-gain" : "text-pebble"}`}>
                    <span className={`size-[7px] rounded-full ${built ? "bg-gain" : "bg-mist"}`} />
                    {built ? "Built" : "Deferred"}
                  </span>
                </span>
                <Muted>{line}</Muted>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Design & Iteration">
          <P>I mapped several journeys, wireframed the flow and worked it through with the founders, product and tech leads.</P>
          <div className="no-scrollbar -mx-5 mt-2 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1">
            {TILES.map(([file, title], i) => (
              <figure key={file} className="m-0 flex w-[280px] shrink-0 snap-start flex-col gap-3">
                <div className="h-[190px] overflow-hidden rounded-card bg-stone pt-5 pl-5">
                  <div className="relative h-full w-full overflow-hidden rounded-tl-lg border border-chalk">
                    <Pic src={`${A}/${file}`} alt={title} sizes="280px" className="object-cover object-left-top" />
                  </div>
                </div>
                <figcaption className="flex gap-2 text-[15px] leading-[1.4]">
                  <span className="text-pebble tabular-nums">
                    {i + 1}/{TILES.length}
                  </span>
                  {title}
                </figcaption>
              </figure>
            ))}
          </div>
          <Muted>Swipe to see each step of the new setup.</Muted>
        </Section>

        <Section title="Development & Implementation">
          <P>A page-by-page build: backend wrote APIs from the high-fidelity wireframes, and front-end picked up each page as soon as it was approved.</P>
        </Section>

        <Section title="The Launch">
          <P>
            Shipped in phase two of a three-phase 2025 plan, with new cycles first and ongoing cycles after sign-off, backed by a release
            newsletter and CSM onboarding calls.
          </P>
        </Section>

        <Section title="Impact & Metrics">
          <P>Instrumented in Mixpanel and measured against the old flow over 30 to 60 days.</P>
          <Rows>
            {[
              ["Completion rate", "58–62%", "78–83%", "+20 pts"],
              ["Median creation time", "18–22 min", "11–14 min", "−38%"],
              ["Step revisits per session", "2.6", "1.4", "−46%"],
            ].map(([label, before, after, change]) => (
              <Row key={label}>
                <Strong>{label}</Strong>
                <span className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[15px] text-loss tabular-nums">{before}</span>
                  <span className="text-pebble">→</span>
                  <Green>{after}</Green>
                  <span className="rounded-full bg-gain-tint px-2 py-0.5 text-[13px] leading-[1.4] font-medium text-gain tabular-nums">{change}</span>
                </span>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Challenges & Learnings">
          <P>Three moments where I held a design line, and what we traded to do it.</P>
          <Rows>
            {[
              ["Tabs vs. “copy to selected”", "Traded tab familiarity for a model that scales to 40 departments."],
              ["The AI and GDPR pivot", "Paused AI to fix the manual screens first; clean rules make it safe next."],
              ["Protecting simplicity", "Custom settings went to the advanced flow to keep the 11-minute setup."],
            ].map(([a, b]) => (
              <Row key={a}>
                <Strong>{a}</Strong>
                <Muted>{b}</Muted>
              </Row>
            ))}
          </Rows>
        </Section>

        <Section title="Future Evolution">
          <P>
            The clean data behind this redesign makes the next step possible: an AI co-pilot that drafts a cycle from one sentence, and
            search that fixes bottlenecks in plain language.
          </P>
          <Quote>The burden of complexity belongs to the machine, never the human.</Quote>
        </Section>

        <section aria-label="Read the full case study" className="px-5 pt-12">
          <div className="flex flex-col gap-4 rounded-[20px] border border-chalk bg-parchment p-6">
            <Laptop size={32} />
            <p className="font-editorial text-2xl leading-[1.25]">This was the short version.</p>
            <p className="text-[15px] leading-[1.6] text-graphite">The full case study has every flow, study and number. Desktop view is recommended.</p>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-11 items-center gap-2 self-start rounded-[10px] bg-ink px-[18px] text-[15px] font-medium text-parchment"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 3.5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
