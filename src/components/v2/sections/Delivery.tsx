import { Prose } from "@/components/v2/ui";
import { Summarizable, SummarizeButton, SummaryText } from "@/components/v2/Summarize";

function TitleWithToggle({ title }: { title: string }) {
  return (
    <header className="flex items-end justify-between gap-6 pb-10 lg:gap-12">
      <h2 className="font-editorial text-[34px] leading-[1.1] font-normal text-ink lg:text-[40px]">{title}</h2>
      <SummarizeButton />
    </header>
  );
}

const SOLUTIONS: { name: string; built: boolean; body: React.ReactNode }[] = [
  {
    name: "Views",
    built: true,
    body: (
      <div className="flex flex-col gap-5">
        <Prose>A new feature that saves groups of employees from a set of filters, so one review cycle can treat each group differently.</Prose>
        <dl className="grid grid-cols-1 items-baseline gap-x-4 gap-y-3 sm:grid-cols-[136px_minmax(0,1fr)]">
          <dt className="font-ui text-sm leading-[1.5] text-ashen">Employee filters</dt>
          <dd className="font-ui text-[15px] leading-[1.6] text-ink">Names &amp; teams · Level · Function · Roles · Location · Joining date · DoB · Ethnicity</dd>
          <dt className="font-ui text-sm leading-[1.5] text-ashen">Performance filters</dt>
          <dd className="font-ui text-[15px] leading-[1.6] text-ink">Goals · 1:1s · Competencies · Reviews · Engagement</dd>
        </dl>
      </div>
    ),
  },
  { name: "Calibration & scoring", built: true, body: <Prose>Calibration and score settings can now be set for each View, or for the review cycle as a whole.</Prose> },
  {
    name: "A new creation flow",
    built: true,
    body: <Prose>A redesigned review cycle creation flow to hold the new features, and to clear UX debt found during research that had been deferred before.</Prose>,
  },
  {
    name: "Plug and play",
    built: true,
    body: <Prose>A plug-and-play setup with detailed explanations of every setting, and conversational search to find the right one.</Prose>,
  },
  { name: "Timeline", built: true, body: <Prose>A timeline that visualises the whole review cycle, ready to share with company leaders before launch.</Prose> },
  {
    name: "Conversational Search",
    built: false,
    body: (
      <div className="flex flex-col gap-3.5">
        <Prose>
          Find any setting by describing what you need, instead of hunting through menus and tables. An HR manager could type
          &ldquo;hide peer names from managers in Q4&rdquo; and land on the exact control.
        </Prose>
        <Prose>
          We moved it to UX debt deliberately. The tech lead showed that time to release would drop significantly without it, and our
          backend data wasn&rsquo;t yet clean enough to feed an AI model without GDPR risk. The strict, structured rules in this
          redesign are the groundwork for bringing it back.
        </Prose>
      </div>
    ),
  },
];

export function Solutions() {
  return (
    <Summarizable summary="I introduced a plug-and-play, modular review cycle system: filter-based Views, calibration and scoring per View, a timeline for leadership, and a redesigned creation flow that clears old UX debt. Conversational search was deliberately deferred.">
      <div className="flex flex-col">
        <TitleWithToggle title="Proposed Solutions & MVPs" />
        <SummaryText className="border-y border-chalk py-8 font-ui text-base leading-[1.6] text-graphite">
          <ul className="flex flex-col">
            {SOLUTIONS.map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-4 border-b border-chalk py-8 xl:grid-cols-[280px_minmax(0,1fr)_96px] xl:gap-12"
              >
                <h3 className="font-editorial text-2xl leading-[1.3] font-normal text-ink">{s.name}</h3>
                <span
                  className={`inline-flex items-center gap-1.5 justify-self-end font-ui text-[13px] leading-[1.4] xl:order-last ${s.built ? "text-ink" : "text-mist"}`}
                >
                  <span className={`size-[7px] rounded-full ${s.built ? "bg-ink" : "bg-mist"}`} />
                  {s.built ? "Built" : "Deferred"}
                </span>
                <div className="col-span-2 xl:col-span-1">{s.body}</div>
              </li>
            ))}
          </ul>
        </SummaryText>
      </div>
    </Summarizable>
  );
}

export function Development() {
  return (
    <Summarizable summary="I set up a page-by-page workflow with backend APIs built ahead from the wireframes, structured Figma handoffs, continuous design and engineering syncs, and documentation everyone could refer back to.">
      <div className="flex flex-col">
        <TitleWithToggle title="Development & Implementation" />
        <SummaryText className="font-ui text-base leading-[1.6] text-graphite lg:text-xl">
          <div className="flex flex-col gap-4">
            <Prose size="lg">
              We set up a page-by-page development cycle. Backend built their APIs ahead of time from the high-fidelity wireframes, and
              front-end started as soon as stakeholders gave final approval of each page&apos;s design.
            </Prose>
            <Prose size="lg">
              I laid out the flow page by page in Figma and handed each section to developers, with walkthrough syncs throughout the
              design cycle to check feasibility and plan bandwidth. Explanations and questions raised in daily syncs were documented for
              everyone to refer back to.
            </Prose>
          </div>
        </SummaryText>
      </div>
    </Summarizable>
  );
}

const LAUNCH_FACTS = [
  ["Release", "Phase 2 of a three-phase plan, 2025"],
  ["Rollout", "New cycles first, ongoing cycles after sign-off"],
  ["Support", "Release newsletter and CSM onboarding calls"],
];

export function Launch() {
  return (
    <Summarizable summary="The redesign shipped in phase two of a three-phase 2025 plan, with a release newsletter, CSM-led onboarding, and two release paths so new and ongoing review cycles both moved over safely.">
      <div className="flex flex-col">
        <TitleWithToggle title="The Launch" />
        <SummaryText className="font-ui text-base leading-[1.6] text-graphite lg:text-xl">
          <div className="flex flex-col gap-4">
            <Prose size="lg">
              A three-phase release plan was set at the start of 2025, and this project shipped in phase two. A newsletter went out with
              every change and how it would affect businesses&apos; existing and ongoing review cycles, and CSMs ran onboarding calls on
              the new experience with HR managers at most businesses.
            </Prose>
            <Prose size="lg">
              We created two release instances: one for businesses with no ongoing review cycles, and one for those mid-cycle. Once
              businesses with ongoing cycles gave the green light, the second release went out.
            </Prose>
          </div>
        </SummaryText>
        <dl className="mt-10 grid grid-cols-1 border-y border-chalk md:grid-cols-3">
          {LAUNCH_FACTS.map(([dt, dd], i) => (
            <div
              key={dt}
              className={`flex flex-col gap-2 py-6 ${i ? "border-t border-chalk md:border-t-0 md:border-l md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}
            >
              <dt className="font-ui text-sm leading-[1.5] text-ashen">{dt}</dt>
              <dd className="font-ui text-base leading-[1.6] text-ink">{dd}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Summarizable>
  );
}
