import { Prose, SectionHeader, SplitRow, SubHeading, ScreenWell } from "@/components/v2/ui";
import Pic from "@/components/v2/Pic";
import { Summarizable, SummarizeButton, SummaryText } from "@/components/v2/Summarize";

const A = "/assets/Review settings";

const FACTS = [
  ["Role", "Product Designer, end to end"],
  ["Team", "1 product leader, 6 developers"],
  ["Disciplines", "Product strategy, experience research, interaction design"],
];

const STATS: { value: string; label: string; up: boolean }[] = [
  { value: "35%", label: "faster review cycle creation", up: true },
  { value: "40%", label: "lower abandonment rate", up: false },
  { value: "17%", label: "better user feedback", up: true },
  { value: "8%", label: "more review cycles created", up: true },
];

export function Overview() {
  return (
    <div className="flex flex-col">
      <ScreenWell
        src={`${A}/ex3.png`}
        alt="The redesigned review cycle setup with Views"
        priority
        sizes="(min-width: 1024px) 1056px, 100vw"
        className="h-[220px] rounded-card-lg lg:h-[282px]"
        frameClassName="rounded-tl-xl shadow-lift"
        inset="pt-8 pl-8 lg:pt-12 lg:pl-12"
      />

      <header className="grid grid-cols-1 lg:grid-cols-4">
        <div className="flex flex-col justify-center gap-5 py-10 lg:col-span-3 lg:py-14 lg:pr-12">
          <h1 className="font-editorial text-[34px] leading-[1.1] font-normal text-ink lg:text-[40px]">
            Review Settings
          </h1>
          <p className="font-ui text-xl leading-[1.45] text-graphite lg:text-[22px]">
            Helping businesses run performance reviews their way, with modular settings and a faster path to launching a cycle.
          </p>
        </div>
        <dl className="flex flex-col justify-center gap-[18px] border-chalk pb-10 lg:border-l lg:py-14 lg:pl-6">
          {FACTS.map(([dt, dd]) => (
            <div key={dt} className="flex flex-col gap-1">
              <dt className="font-ui text-[13px] leading-[1.4] text-ashen">{dt}</dt>
              <dd className="font-ui text-[15px] leading-[1.5] text-ink">{dd}</dd>
            </div>
          ))}
        </dl>
      </header>

      <dl className="grid grid-cols-2 border-y border-chalk lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-2.5 py-7 ${i % 2 ? "border-l border-chalk pl-6" : "pr-6"} ${i === 2 ? "lg:border-l lg:pl-6" : ""} ${i < 2 ? "border-b border-chalk lg:border-b-0" : ""} ${i > 0 && i < 3 ? "lg:pr-6" : ""}`}
          >
            <dd className="order-1 flex items-baseline gap-2">
              <span className="font-editorial text-[44px] leading-none font-bold text-ink tabular-nums xl:text-[56px]">{s.value}</span>
              <span className="font-ui text-sm leading-none font-bold text-gain">{s.up ? "▲" : "▼"}</span>
              <span className="sr-only">{s.up ? "increase" : "decrease"}</span>
            </dd>
            <dt className="order-2 font-ui text-[15px] leading-[1.5] text-graphite">{s.label}</dt>
          </div>
        ))}
      </dl>

      <SplitRow label={<SubHeading>About the project</SubHeading>} className="pt-16">
        <Prose>
          Reviews &amp; 360s is the performance module in Mesh. Its settings help Head of Resources and HR managers build a complete
          performance feedback cycle from continuous inputs. I redesigned two parts of it end to end.
        </Prose>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ProjectCard
            title="Review cycle creation flow"
            body="From a twelve-page form to a guided, four-page setup."
            icon={
              <>
                <circle cx="4" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 10h8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
              </>
            }
          />
          <ProjectCard
            title="Review settings dashboard"
            body="Modular settings, calibration and scoring per cycle."
            icon={
              <>
                <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </>
            }
          />
        </div>
      </SplitRow>
    </div>
  );
}

function ProjectCard({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-chalk p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-stone text-ink">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {icon}
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-ui text-base leading-[1.4] font-medium text-ink">{title}</p>
        <p className="font-ui text-[15px] leading-[1.5] text-graphite">{body}</p>
      </div>
    </div>
  );
}

const REVIEWS_A = ["ov1", "ov4", "ov3", "ov2"];
const REVIEWS_B = ["ov5", "ov6", "ov1", "ov3"];

export function Challenge() {
  return (
    <Summarizable summary="The platform's rigid review settings limited HR managers and burdened our CSMs with babysitting custom performance reviews.">
      <div className="flex flex-col">
        <header className="flex items-end justify-between gap-12 pb-10">
          <h2 className="font-editorial text-[34px] leading-[1.1] font-normal text-ink lg:text-[40px]">The Challenge</h2>
          <SummarizeButton />
        </header>

        <div className="flex flex-col gap-10 pb-16">
          <SummaryText className="font-ui text-base leading-[1.6] text-graphite lg:text-xl">
            <Prose size="lg">
              Say you&apos;re a Head of People or an HR manager setting up a performance review for your organisation. The
              platform&apos;s review cycle settings were uncategorised, and they didn&apos;t give HR managers the freedom to build a
              cycle around their organisation&apos;s philosophy. It also took a toll on our CSMs, who had to babysit cycle creation
              every time a company started a custom performance review.
            </Prose>
          </SummaryText>

          <div className="grid grid-cols-1 border-y border-chalk sm:grid-cols-2">
            <Persona
              title="HR managers"
              body="Couldn't shape a cycle around how their company runs reviews."
              icon={
                <>
                  <circle cx="11" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 19c.8-3.8 3.6-6 7-6s6.2 2.2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              }
              className="py-6 sm:pr-8"
            />
            <Persona
              title="Our CSMs"
              body="Had to hand-hold every custom review cycle from start to launch."
              icon={
                <>
                  <path d="M5 13v-2a6 6 0 0 1 12 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="3.5" y="12" width="3.5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="15" y="12" width="3.5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M17 17c0 1.5-1.5 2-3 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
              }
              className="border-t border-chalk py-6 sm:border-t-0 sm:border-l sm:pl-8"
            />
          </div>
        </div>

        <section aria-label="What customers said" className="flex flex-col gap-6">
          <ReviewMarquee images={REVIEWS_A} />
          <ReviewMarquee images={REVIEWS_B} reverse />
        </section>
      </div>
    </Summarizable>
  );
}

function Persona({ title, body, icon, className }: { title: string; body: string; icon: React.ReactNode; className: string }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <p className="flex items-center gap-2.5 font-ui text-base leading-[1.4] font-medium text-ink">
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          {icon}
        </svg>
        {title}
      </p>
      <p className="font-ui text-base leading-[1.6] text-graphite">{body}</p>
    </div>
  );
}

/** Borderless customer reviews drifting sideways, faded at both edges. */
export function ReviewMarquee({ images, reverse = false, height = "h-[190px]", width = "w-[460px]" }: { images: string[]; reverse?: boolean; height?: string; width?: string }) {
  const loop = [...images, ...images];
  return (
    <div className="relative -mx-6 overflow-hidden py-1 lg:-mx-16">
      <div
        className={`v2-marquee pause-hover flex w-max ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {loop.map((name, i) => (
          <figure key={i} className={`relative m-0 mr-12 shrink-0 ${height} ${width} max-w-[80vw]`} aria-hidden={i >= images.length}>
            <Pic src={`${A}/${name}.png`} alt={i < images.length ? "Customer review of Mesh before the redesign" : ""} sizes="460px" className="object-contain" />
          </figure>
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}

const GOALS = [
  {
    title: "Fit every company's philosophy",
    body: "Create a review cycle setup that caters to each organisation's own way of running reviews.",
    result: "52–64%",
    note: "of large businesses adopted Views",
    icon: (
      <>
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="1" fill="currentColor" />
      </>
    ),
  },
  {
    title: "Plug and play, yet modular",
    body: "Categorise and redesign the existing settings so teams can use sensible defaults or take full modular control.",
    result: "12 → 4",
    note: "pages to set up a review cycle",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15.5 12.5v6M12.5 15.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Faster, more accurate setup",
    body: "Help HR managers configure and launch review cycles with greater speed and accuracy.",
    result: "35%",
    note: "faster creation, 18–22 down to 11–14 minutes",
    icon: <path d="M12 2 4 13h7l-1 7 8-11h-7l1-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
  {
    title: "Fewer people dropping off",
    body: "Significantly reduce drop-off by streamlining the whole review cycle creation experience.",
    result: "40%",
    note: "lower abandonment, completion up to 78–83%",
    icon: <path d="M3 5h16l-6 7v5l-4 2v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
];

export function Goals() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        title="Goals"
        intro="Four goals set at kickoff, each paired with what it delivered after launch."
        aside={
          <p className="flex items-center gap-4 font-ui text-sm leading-[1.5] text-ashen">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full border-[1.5px] border-ink" />
              Goal
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-gain" />
              Result
            </span>
          </p>
        }
      />
      <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
        {GOALS.map((g, i) => (
          <article key={g.title} className="flex flex-col overflow-hidden rounded-card-lg border border-chalk">
            <div className="flex grow flex-col gap-8 p-8">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-stone text-ink">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                    {g.icon}
                  </svg>
                </div>
                <span className="font-ui text-sm leading-[1.5] text-pebble tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-editorial text-2xl leading-[1.3] font-normal text-ink">{g.title}</h3>
                <p className="font-ui text-base leading-[1.6] text-graphite">{g.body}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-3 border-t border-gain-line bg-gain-wash px-8 py-5">
              <span className="font-editorial text-[32px] leading-none text-gain tabular-nums">{g.result}</span>
              <span className="font-ui text-sm leading-[1.4] text-graphite">{g.note}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
