import Pic from "@/components/v2/Pic";
import Carousel from "@/components/v2/Carousel";
import { SectionHeader, SplitRow, SubHeading } from "@/components/v2/ui";

const A = "/assets/Review settings";

const PROBLEMS: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "One cycle, many review types",
    body: "Different groups of employees needed different reviews in the same cycle. Teams were duplicating whole cycles for the same period to get there.",
    icon: (
      <>
        <rect x="3" y="7" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 4h11a2 2 0 0 1 2 2v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Calibration only worked globally",
    body: "Calibration and score settings applied company-wide. They needed to work per cycle and per group of employees.",
    icon: (
      <>
        <path d="M4 6h14M4 11h14M4 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="6" r="2" fill="var(--color-stone)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="11" r="2" fill="var(--color-stone)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="16" r="2" fill="var(--color-stone)" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: "Settings nobody could find",
    body: "Most settings were hard to discover and poorly understood.",
    icon: (
      <>
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="m14.5 14.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 8.6a1.6 1.6 0 1 1 2.2 1.5c-.5.2-.7.6-.7 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="10" cy="13" r=".8" fill="currentColor" />
      </>
    ),
  },
  {
    title: "Cycles based on joining dates",
    body: "Companies wanted review cycles that start from each employee's joining date.",
    icon: (
      <>
        <rect x="3" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h16M7 3v4M15 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="1.6" fill="currentColor" />
      </>
    ),
  },
];

const MAPS = [1, 2, 3, 4, 5].map((k) => ({ src: `${A}/strategy${k}.png`, alt: `How businesses review, map ${k}` }));

const ICON = {
  data: <path d="M3 15V9M8 15V4M13 15v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />,
  talk: <path d="M3 4h12v8H8l-3 3v-3H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  tree: <path d="M9 3v4M9 7H4v4M9 7h5v4M4 11v4M14 11v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
};

function Icon18({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

export function Strategy() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        ruled
        title="Strategy"
        intro="I framed the business problems, mapped how different companies run reviews, then tested where setup broke down with product data, interviews and tree testing."
        aside={
          <ol aria-label="In this section" className="flex min-w-[200px] flex-col gap-1.5 font-ui text-sm leading-[1.5] text-ashen">
            {["The problems", "How businesses review", "Validation"].map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="w-5 text-pebble tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ol>
        }
      />

      <SplitRow label={<Numbered n="01">The problems businesses brought us</Numbered>} className="py-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-stone text-ink">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  {p.icon}
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-ui text-base leading-[1.5] font-medium text-ink">{p.title}</p>
                <p className="font-ui text-base leading-[1.6] text-graphite">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SplitRow>

      <section aria-label="Understanding businesses" className="flex flex-col gap-6 border-t border-chalk py-16">
        <Carousel
          slides={MAPS}
          header={(controls) => (
            <div className="grid grid-cols-1 items-end gap-4 xl:grid-cols-[280px_minmax(0,1fr)_auto] xl:gap-12">
              <Numbered n="02">How businesses review</Numbered>
              <p className="font-ui text-base leading-[1.6] text-graphite">
                Company size, review type and frequency decide what a business needs from a cycle. These maps became the basis for our
                defaults.
              </p>
              {controls}
            </div>
          )}
        />
      </section>

      <section aria-label="Validation" className="flex flex-col gap-8 border-t border-chalk py-16">
        <div className="grid grid-cols-1 items-end gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
          <Numbered n="03">Validating where setup broke</Numbered>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                ["data", "Product data"],
                ["talk", "Interviews"],
                ["tree", "Tree and A/B tests"],
              ] as const
            ).map(([k, t]) => (
              <div key={t} className="flex items-center gap-2.5 rounded-xl border border-chalk bg-paper px-3.5 py-3 text-ink">
                <Icon18>{ICON[k]}</Icon18>
                <span className="font-ui text-sm leading-[1.4]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <Finding
          icon={ICON.data}
          kind="Product data"
          title="Four in ten setups were abandoned"
          body="With product, I tracked the Mixpanel funnel step by step to see where people struggled while creating a review cycle."
          visual={<AbandonBar />}
          middle={
            <dl className="grid grid-cols-3 border-y border-chalk">
              {[
                ["2 steps", "held most of the drop-off"],
                ["2.6×", "revisits per session"],
                ["0.8", "validation errors per step"],
              ].map(([dd, dt], i) => (
                <div key={dt} className={`flex flex-col gap-1.5 py-6 ${i ? "border-l border-chalk pl-4 lg:pl-6" : "pr-4 lg:pr-6"} ${i === 1 ? "pr-4 lg:pr-6" : ""}`}>
                  <dd className="order-1 font-editorial text-[28px] leading-[1.1] text-ink tabular-nums lg:text-4xl">{dd}</dd>
                  <dt className="order-2 font-ui text-sm leading-[1.5] text-ashen">{dt}</dt>
                </div>
              ))}
            </dl>
          }
          heard="The data showed people were"
          heardItems={["Hesitating before committing to a setting", "Going back to earlier steps because of dependencies", "Struggling to picture the whole cycle"]}
          so="So I designed for"
          soItems={["Progressive disclosure of settings", "Modular configuration", "Decision guidance with tooltips", "Reusable default settings"]}
        />

        <Finding
          icon={ICON.talk}
          kind="Interviews"
          title="People think in phases, not forms"
          body="Mental-model interviews with the People Science founder and CSMs, worked through in my notebook."
          visual={<NotebookStack />}
          heard="What we heard"
          heardItems={["Review cycles are phases, not configuration forms", "Links between ratings, deliverables and calibration were unclear", "Confidence came from seeing the timeline"]}
          so="So I designed for"
          soItems={["Structured sequencing", "Clearer communication of dependencies", "Timeline-driven configuration"]}
        />

        <Finding
          icon={ICON.tree}
          kind="Tree and A/B tests"
          title="The timeline is the anchor"
          body="Tree tests checked whether people could find and understand each setting. A/B tests compared the structures we were choosing between."
          visual={
            <div className="flex flex-col gap-2">
              {[
                ["Sequential flow", "Dense configuration"],
                ["Template-assisted setup", "Manual setup"],
                ["Views", "Multiple review cycles"],
              ].map(([a, b]) => (
                <div key={a} className="grid grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)] items-center overflow-hidden rounded-xl border border-chalk">
                  <span className="px-4 py-3 font-ui text-[15px] leading-[1.4] text-ink">{a}</span>
                  <span className="flex h-full items-center justify-center border-x border-chalk bg-parchment font-ui text-[11px] text-ashen">vs</span>
                  <span className="px-4 py-3 font-ui text-[15px] leading-[1.4] text-graphite">{b}</span>
                </div>
              ))}
            </div>
          }
          heard="Key outcomes"
          heardItems={["Calibration and rating settings were often grouped wrongly", "People expected settings to carry across Views", "The timeline anchored every decision"]}
          so="This validated the need for"
          soItems={["A reorganised settings hierarchy", "Structure that matches mental models", "A more visible timeline"]}
        />
      </section>

      <figure className="m-0 grid grid-cols-1 gap-6 border-t border-chalk pt-16 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
        <span aria-hidden="true" className="font-editorial text-[96px] leading-[0.8] text-clay xl:text-right">
          &ldquo;
        </span>
        <blockquote className="m-0 font-editorial text-[26px] leading-[1.3] text-balance text-ink lg:text-[30px]">
          Together, the interviews, feedback, competitive analysis and Mixpanel data became one philosophy of how businesses run reviews.
        </blockquote>
      </figure>
    </div>
  );
}

function Numbered({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-ui text-sm leading-[1.5] text-pebble tabular-nums">{n}</span>
      <SubHeading>{children}</SubHeading>
    </div>
  );
}

function Finding({
  icon,
  kind,
  title,
  body,
  visual,
  middle,
  heard,
  heardItems,
  so,
  soItems,
}: {
  icon: React.ReactNode;
  kind: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  middle?: React.ReactNode;
  heard: string;
  heardItems: string[];
  so: string;
  soItems: string[];
}) {
  return (
    <article className="flex flex-col gap-8 rounded-card-lg border border-chalk bg-paper p-6 lg:p-10">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2 font-ui text-sm leading-[1.5] text-ashen">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {icon}
            </svg>
            {kind}
          </p>
          <h4 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">{title}</h4>
          <p className="font-ui text-base leading-[1.6] text-graphite">{body}</p>
        </div>
        {visual}
      </div>
      {middle}
      <div className={`grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] lg:gap-0 ${middle ? "" : "border-t border-chalk pt-8"}`}>
        <div className="flex flex-col gap-3 rounded-card bg-parchment p-6">
          <p className="font-ui text-sm leading-[1.5] text-ashen">{heard}</p>
          <ul className="flex flex-col gap-2.5 font-ui text-base leading-[1.5] text-graphite">
            {heardItems.map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="text-pebble">–</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center text-pebble" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-90 lg:rotate-0">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-chalk p-6">
          <p className="font-ui text-sm leading-[1.5] text-ashen">{so}</p>
          <ul className="flex flex-col gap-2.5 font-ui text-base leading-[1.5] text-ink">
            {soItems.map((t) => (
              <li key={t} className="flex gap-2.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-1 shrink-0">
                  <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function AbandonBar() {
  return (
    <div className="flex flex-col gap-3.5 pt-2">
      <div className="flex justify-between font-ui text-sm leading-[1.5] text-ashen">
        <span>Completed</span>
        <span>Abandoned</span>
      </div>
      <div role="img" aria-label="58 to 62 percent of setups completed, the rest abandoned" className="relative h-10 overflow-hidden rounded-[10px] bg-stone">
        <div className="absolute inset-y-0 left-0 w-[58%] bg-ink" />
        <div className="absolute inset-y-0 left-[58%] w-[4%] bg-[repeating-linear-gradient(135deg,var(--color-ink)_0_2px,var(--color-stone)_2px_5px)]" />
      </div>
      <div className="relative h-5 font-ui text-[13px] leading-[1.5] text-graphite tabular-nums">
        <span className="absolute left-[58%] flex -translate-x-1/2 flex-col items-center">
          <span className="mb-0.5 h-1.5 w-px bg-clay" />
          58–62%
        </span>
      </div>
    </div>
  );
}

function NotebookStack() {
  const notes: [string, string, string][] = [
    ["st1.png", "Notebook sketch of review settings structure", "left-6 top-7 -rotate-[5deg]"],
    ["st4.png", "Notebook sketch of calibration", "left-[35%] top-[72px] rotate-[3deg]"],
    ["st5.png", "Notebook sketch of timelines", "right-6 top-[22px] -rotate-2"],
  ];
  return (
    <div className="relative h-60 overflow-hidden rounded-card bg-stone">
      {notes.map(([file, alt, pos]) => (
        <div
          key={file}
          className={`absolute h-[136px] w-[180px] overflow-hidden rounded-lg shadow-soft transition-transform duration-500 ease-[var(--ease-editorial)] hover:z-10 hover:scale-105 hover:rotate-0 ${pos}`}
        >
          <Pic src={`${A}/${file}`} alt={alt} sizes="180px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
