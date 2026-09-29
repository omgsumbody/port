"use client";

import { useState } from "react";
import { ChangePill, Chip, Eyebrow, SectionHeader, SplitRow, SubHeading } from "@/components/v2/ui";

const OUTCOME = [
  ["35%", "faster review cycle creation"],
  ["40%", "less abandonment overall"],
  ["17%", "better user feedback"],
  ["8%", "more review cycles created"],
];

const MEASURES: [string, [string, string[]][]][] = [
  [
    "User success",
    [
      ["Efficiency", ["Cycle setup time", "Step completion speed", "Backtracking frequency"]],
      ["Effectiveness", ["Completion rate", "Error frequency"]],
      ["Confidence", ["Post-task clarity", "Reduced hesitation"]],
    ],
  ],
  [
    "Business and decisions",
    [
      ["Adoption", ["Views usage", "Preconfigured template usage", "Timeline engagement"]],
      ["Independence", ["Less CSM intervention", "Support ticket volume"]],
      ["Behavioural signals", ["Template overrides", "Reconfiguration patterns"]],
    ],
  ],
];

const bars = <path d="M3 15V9M8 15V4M13 15v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />;

export function Impact() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        title="Impact & Metrics"
        intro="I defined success before launch, instrumented every step in Mixpanel, and measured the redesign against the old flow."
        aside={
          <ol aria-label="In this section" className="flex min-w-[200px] flex-col gap-1.5 font-ui text-sm leading-[1.5] text-ashen">
            {["The outcome", "How success was measured", "The evidence"].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="w-5 text-pebble tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ol>
        }
      />

      <section aria-label="The outcome" className="flex flex-col gap-8 pt-16">
        <div className="grid grid-cols-1 items-end gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
          <SubHeading>The outcome</SubHeading>
          <p className="font-ui text-base leading-[1.6] text-graphite">
            Overall impact of the Review Settings redesign, compared with the previous creation flow.
          </p>
        </div>
        <dl className="grid grid-cols-2 border-y border-chalk lg:grid-cols-4">
          {OUTCOME.map(([n, label], i) => (
            <div
              key={label}
              className={`flex flex-col gap-2.5 py-8 ${i % 2 ? "border-l border-chalk pl-6" : "pr-6"} ${i === 2 ? "lg:border-l lg:pl-6" : ""} ${i < 2 ? "border-b border-chalk lg:border-b-0" : ""}`}
            >
              <dd className="order-1 font-editorial text-[48px] leading-none text-ink tabular-nums xl:text-[64px]">{n}</dd>
              <dt className="order-2 font-ui text-base leading-[1.5] text-graphite">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <SplitRow label={<SubHeading>How success was measured</SubHeading>} className="py-16">
        <div className="overflow-hidden rounded-card border border-chalk">
          {MEASURES.map(([group, cols], r) => (
            <div key={group} className={`grid grid-cols-1 md:grid-cols-[136px_repeat(3,minmax(0,1fr))] ${r ? "" : "border-b border-chalk"}`}>
              <div className="bg-parchment p-5 font-ui text-sm leading-[1.4] font-medium text-ink">{group}</div>
              {cols.map(([k, items]) => (
                <div key={k} className="flex flex-col gap-2 border-t border-chalk p-5 md:border-t-0 md:border-l">
                  <p className="font-ui text-sm leading-[1.4] text-ashen">{k}</p>
                  <p className="font-ui text-[15px] leading-[1.6] text-ink">
                    {items.map((t) => (
                      <span key={t} className="block">
                        {t}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="flex items-center gap-2 font-ui text-sm leading-[1.5] text-ashen">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {bars}
          </svg>
          Instrumentation events were set up in Mixpanel to measure each metric and validate the decisions.
        </p>
      </SplitRow>

      <section aria-label="The evidence" className="flex flex-col gap-8 border-t border-chalk py-16">
        <div className="grid grid-cols-1 items-end gap-4 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
          <SubHeading>The evidence</SubHeading>
          <div className="flex flex-wrap items-center gap-5 font-ui text-sm leading-[1.5] text-ashen">
            <span className="flex items-center gap-2">
              <span className="h-2 w-4 rounded-[2px] bg-loss" />
              Before
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-4 rounded-[2px] bg-gain" />
              After
            </span>
            <span>Ranges measured over 30 to 60 days</span>
          </div>
        </div>

        <CreationScorecard />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DropOffTile />
          <AdoptionTile />
        </div>
      </section>

      <section aria-label="What customers said" className="flex flex-col gap-6 border-t border-chalk pt-16">
        <div className="flex items-baseline justify-between gap-6">
          <SubHeading>What customers said</SubHeading>
          <span className="font-ui text-sm leading-[1.5] text-ashen">Reviews after launch</span>
        </div>
        <ReviewCards images={[1, 2, 3, 4, 5, 6]} />
        <ReviewCards images={[7, 8, 9, 10, 11, 12]} reverse />
      </section>
    </div>
  );
}

function ReviewCards({ images, reverse = false }: { images: number[]; reverse?: boolean }) {
  const loop = [...images, ...images];
  return (
    <div className="relative -mx-6 overflow-hidden py-1 lg:-mx-16">
      <div className={`v2-marquee pause-hover flex w-max ${reverse ? "[animation-direction:reverse]" : ""}`}>
        {loop.map((k, i) => (
          <figure
            key={i}
            aria-hidden={i >= images.length}
            className="m-0 mr-4 flex h-32 w-[420px] max-w-[80vw] shrink-0 items-center justify-center rounded-card border border-chalk bg-paper p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/assets/Review settings/ireviw${k}.png`}
              alt={i < images.length ? "Customer review of Mesh after launch" : ""}
              loading="lazy"
              className="max-h-full max-w-full object-contain"
            />
          </figure>
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}

const CREATION_ROWS: { metric: string; impact: string; before: string; after: React.ReactNode; change?: string }[] = [
  { metric: "Completion rate", impact: "Less friction", before: "58–62%", after: "78–83%", change: "+20 pts" },
  { metric: "Median creation time", impact: "Faster time on task", before: "18–22 min", after: <>11–14<span className="text-lg"> min</span></>, change: "−38%" },
  { metric: "Step revisits per session", impact: "Lower cognitive load", before: "2.6", after: "1.4", change: "−46%" },
  { metric: "Drop-off per step", impact: "Clearer configuration", before: "2", after: <>0.7<span className="text-lg"> median</span></> },
];

const CREATION_EVENTS = [
  "cycle_creation_started",
  "cycle_basic_settings",
  "reviewees_configured",
  "templates_selected",
  "calibration_configured",
  "timeline_reviewed",
  "cycle_launched",
];

const icon16 = (d: React.ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
    {d}
  </svg>
);

function CreationScorecard() {
  const cols = "grid-cols-[minmax(0,1fr)_84px_136px_80px] lg:grid-cols-[minmax(0,1fr)_110px_170px_96px]";
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-card-lg border border-chalk min-[1400px]:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="flex flex-col gap-1.5">
          <h4 className="font-editorial text-[26px] leading-[1.3] font-normal text-ink">Review cycle creation success</h4>
          <p className="font-ui text-[15px] leading-[1.5] text-ashen">Validating the usability improvement, before and after the redesign</p>
        </div>
        <div className="flex flex-col">
          <div className={`grid gap-4 pb-2.5 ${cols}`}>
            <Eyebrow>Metric and impact</Eyebrow>
            <Eyebrow>Before</Eyebrow>
            <Eyebrow>After</Eyebrow>
            <Eyebrow className="text-right">Change</Eyebrow>
          </div>
          {CREATION_ROWS.map((r, i) => (
            <div key={r.metric} className={`grid items-center gap-4 border-t border-chalk py-[18px] ${cols} ${i === CREATION_ROWS.length - 1 ? "border-b" : ""}`}>
              <div className="flex flex-col gap-0.5">
                <span className="font-ui text-base leading-[1.4] text-ink">{r.metric}</span>
                <span className="font-ui text-[13px] leading-[1.4] text-ashen">{r.impact}</span>
              </div>
              <span className="font-ui text-lg leading-[1.3] text-loss tabular-nums">{r.before}</span>
              <span className="font-editorial text-[30px] leading-none text-gain tabular-nums lg:text-4xl">{r.after}</span>
              <span className="justify-self-end">
                {r.change ? <ChangePill>{r.change}</ChangePill> : <span className="font-ui text-sm leading-[1.4] text-pebble">New</span>}
              </span>
            </div>
          ))}
        </div>
        <p className="font-ui text-[13px] leading-[1.5] text-ashen">
          Ranges are the measured spread across 30 to 60 days. Change is calculated from range midpoints.
        </p>
      </div>

      <aside aria-label="Mixpanel widgets I built" className="flex flex-col gap-5 bg-ink px-8 py-10 text-parchment">
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-2 font-ui text-xs leading-[1.5] tracking-[0.06em] text-mist uppercase">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {bars}
            </svg>
            Mixpanel
          </p>
          <h5 className="font-editorial text-[22px] leading-[1.3] font-normal">Widgets I built to track it</h5>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[14px] border border-graphite p-4">
          <p className="flex items-center gap-2 font-ui text-[15px] leading-[1.4] font-medium">
            {icon16(<path d="M2 3h12l-4.5 5v5l-3-1.5V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />)}
            Journey funnel
          </p>
          <p className="font-ui text-[13px] leading-[1.7] text-mist">
            Start › Basic settings › Reviewees › Templates › Calibration › Timelines › Results › Summary ›{" "}
            <span className="text-parchment">Launch</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 font-ui text-[15px] leading-[1.4]">
          <p className="flex items-center gap-2.5">
            {icon16(<path d="M6 4 2 8l4 4M2 8h9a3 3 0 0 1 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />)}
            Back navigation frequency
          </p>
          <p className="flex items-center gap-2.5">
            {icon16(
              <>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </>,
            )}
            Median creation time
          </p>
          <p className="flex items-center gap-2.5">
            {icon16(<path d="M3 3v10M7 6v7M11 9v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />)}
            Drop-off by each step
          </p>
        </div>
        <div className="flex flex-col gap-2 border-t border-graphite pt-4">
          <p className="font-ui text-xs leading-[1.5] text-pebble">Instrumentation_events</p>
          <div className="flex flex-wrap gap-1.5">
            {CREATION_EVENTS.map((e) => (
              <Chip key={e} tone="dark">
                {e}
              </Chip>
            ))}
          </div>
        </div>
      </aside>
    </article>
  );
}

const STEP_EVENTS = [
  "cycle_creation_started",
  "first_time",
  "cycle_basic_settings",
  "employee_count",
  "review_design_used",
  "reviewees_configured",
  "reviewers_configured",
  "templates_selected",
  "calibration_configured",
  "results_configured",
  "timeline_reviewed",
  "cycle_summary_viewed",
  "cycle_launched",
];
const STEP_PROPS = ["organization size", "cycle type", "views used", "review design used", "template type", "creation time seconds"];

function DropOffTile() {
  const cols = "grid-cols-[minmax(0,1fr)_64px_112px]";
  const rows = [
    ["Elements setup", "Improved clarity", "~44%", "11–13%", "−32 pts"],
    ["Calibration setup", "Modular decision structure", "~19%", "9–11%", "−9 pts"],
    ["Timelines setup", "Better planning visibility", "~16%", "6–8%", "−9 pts"],
  ];
  return (
    <MetricTile
      title="Drop-off by step"
      subtitle="Where decision fatigue eased most"
      widgets={["Step time distribution", "Back navigation frequency", "Idle time tracker", "Tooltip and help interaction counter"]}
      events={STEP_EVENTS}
      properties={STEP_PROPS}
    >
      <div className={`grid gap-3 pb-2.5 ${cols}`}>
        <Eyebrow>Step and impact</Eyebrow>
        <Eyebrow>Before</Eyebrow>
        <Eyebrow>After</Eyebrow>
      </div>
      {rows.map(([step, impact, before, after, change], i) => (
        <div key={step} className={`grid items-center gap-3 border-t border-chalk py-4 ${cols} ${i === rows.length - 1 ? "border-b" : ""}`}>
          <div className="flex flex-col gap-0.5">
            <span className="font-ui text-base leading-[1.4] text-ink">{step}</span>
            <span className="font-ui text-[13px] leading-[1.4] text-ashen">{impact}</span>
          </div>
          <span className="font-ui text-lg leading-[1.3] text-loss tabular-nums">{before}</span>
          <div className="flex flex-col items-start gap-2">
            <span className="font-editorial text-[30px] leading-none text-gain tabular-nums">{after}</span>
            <span className="rounded-full bg-gain-tint px-[9px] py-[3px] font-ui text-[13px] leading-[1.4] font-medium text-gain tabular-nums">
              {change}
            </span>
          </div>
        </div>
      ))}
    </MetricTile>
  );
}

function AdoptionTile() {
  const cols = "grid-cols-[minmax(0,1fr)_150px]";
  const rows = [
    ["Views configuration", "Validates the need to scale", "52–64%", "Large businesses"],
    ["Review design", "Reduced decision fatigue", "68–75%", "SMBs"],
    ["Template usage", "More efficient behaviour", "58–66%", "All cycles"],
    ["Timeline interactions", "Easier alignment", "70–78%", "Cycles that used it"],
  ];
  return (
    <MetricTile
      title="Feature adoption"
      subtitle="Review design, Views, templates and timelines"
      widgets={["Review design usage, SMBs vs LBs", "Views configuration, SMBs vs LBs", "Template frequencies", "Timeline interaction rate"]}
      events={[
        "view_created",
        "view_applied_to_cycle",
        "view_edited",
        "multi_view_used",
        "defaults_loaded",
        "defaults_modified",
        "defaults_overridden",
        "template_opened",
        "template_adjusted",
        "suggested_used",
        "timeline_opened",
        "timeline_reviewed",
      ]}
      properties={["organization size", "views size", "views used", "review design used", "template type", "creation time seconds"]}
    >
      <div className={`grid gap-3 pb-2.5 ${cols}`}>
        <Eyebrow>Feature and impact</Eyebrow>
        <Eyebrow className="text-right">Adoption</Eyebrow>
      </div>
      {rows.map(([feature, impact, rate, segment], i) => (
        <div key={feature} className={`grid items-center gap-3 border-t border-chalk py-4 ${cols} ${i === rows.length - 1 ? "border-b" : ""}`}>
          <div className="flex flex-col gap-0.5">
            <span className="font-ui text-base leading-[1.4] text-ink">{feature}</span>
            <span className="font-ui text-[13px] leading-[1.4] text-ashen">{impact}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5 justify-self-end">
            <span className="font-editorial text-[30px] leading-none text-gain tabular-nums">{rate}</span>
            <span className="font-ui text-[13px] leading-[1.4] text-ashen">{segment}</span>
          </div>
        </div>
      ))}
    </MetricTile>
  );
}

/**
 * Metric tile with a Mixpanel drawer that rises inside the tile, so opening it never
 * changes the page height.
 */
function MetricTile({
  title,
  subtitle,
  widgets,
  events,
  properties,
  children,
}: {
  title: string;
  subtitle: string;
  widgets: string[];
  events: string[];
  properties: string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const label = (t: string) => <Eyebrow>{t}</Eyebrow>;
  return (
    <article className="relative flex flex-col gap-6 overflow-hidden rounded-card-lg border border-chalk px-6 pt-8 pb-24 lg:px-10 lg:pt-10">
      <div className="flex flex-col gap-1.5">
        <h4 className="font-editorial text-[26px] leading-[1.3] font-normal text-ink">{title}</h4>
        <p className="font-ui text-[15px] leading-[1.5] text-ashen">{subtitle}</p>
      </div>
      <div className="flex flex-col">{children}</div>

      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col overflow-hidden border-t border-chalk bg-parchment transition-[height] duration-500 ease-[var(--ease-editorial)] ${
          open ? "h-full" : "h-14"
        }`}
      >
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-14 w-full shrink-0 cursor-pointer items-center justify-between px-6 font-ui text-sm leading-[1.5] text-graphite lg:px-10"
        >
          <span className="flex gap-4">
            <span className="font-medium text-ink">Mixpanel</span>
            <span>Widgets, events and properties</span>
          </span>
          <span aria-hidden="true" className={`text-lg leading-none transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
            +
          </span>
        </button>
        <div inert={!open} className="flex flex-col gap-5 overflow-y-auto px-6 pt-1 pb-8 lg:px-10">
          <div className="flex flex-col gap-2.5">
            {label("Widgets I built")}
            <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
              {widgets.map((w) => (
                <p key={w} className="flex items-start gap-2.5 font-ui text-[15px] leading-[1.4] text-ink">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                    <path d="M3 3v10M7 6v7M11 9v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {w}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 border-t border-chalk pt-[18px]">
            {label("Instrumentation_events")}
            <div className="flex flex-wrap gap-1.5">
              {events.map((e) => (
                <Chip key={e} tone="paper">
                  {e}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-chalk pt-[18px]">
            {label("Filters and properties")}
            <p className="font-ui text-sm leading-[1.6] text-graphite">{properties.join(" · ")}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
