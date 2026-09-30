import FooterGraphic from "@/components/FooterGraphic";
import { SectionHeader } from "@/components/v2/ui";
import { StarIcon } from "@/components/v2/Summarize";

const MOMENTS = [
  {
    title: "The C-suite UI pushback",
    sub: "Defending UI scalability: tabs vs. the “copy” model",
    rows: [
      ["Pushback", "While we were conceptualising Views, executive leadership pushed hard for a tab-based setup. Their mental model was simple: give HR a separate tab for each department’s settings."],
      ["My stance", "Tabs look great for three or four departments, but they break down at enterprise scale. Picture an HR admin working through dozens of tabs on a laptop: a horizontal-scrolling nightmare that forces repetitive manual setup."],
      ["Trade-off", "I proposed a “Copy to selected” model instead. We traded the instant familiarity of tabs for a system that scales. It added a slight learning curve, but let admins push one baseline rule to 40 departments and matched their mental model better."],
    ],
  },
  {
    title: "The technical feasibility trade-off",
    sub: "The AI and GDPR pivot",
    rows: [
      ["Pushback", "I pitched skipping manual setup entirely with a conversational AI interface. Product loved the vision."],
      ["My stance", "Engineering and Legal gave us a reality check: our backend data wasn’t clean, and feeding unstructured employee records into an LLM created serious GDPR privacy risks."],
      ["Trade-off", "We agreed to pause the AI work and fix the manual screens first. Enforcing strict, clean rules in the new design became the stepping stone needed to power that AI release safely next."],
    ],
  },
  {
    title: "The product management pushback",
    sub: "Protecting simplicity against scope creep",
    rows: [
      ["Pushback", "Once Product saw how fast the single-page Quick Wizard was for small businesses, there was immediate pressure to add “just a few more options”, like custom scoring weights and timeline overrides."],
      ["My stance", "I drew a hard line to protect the wizard’s simplicity. Its whole value was zero-decision setup. Adding custom toggles back would slowly turn it back into the overwhelming twelve-step maze."],
      ["Trade-off", "We kept a strict separation: businesses that wanted custom settings were routed to the advanced flow. We gave up “every feature on one page” to protect the 11-minute setup time for our core SMB users."],
    ],
  },
];

export function Learnings() {
  return (
    <div className="flex flex-col">
      <SectionHeader ruled title="Challenges & Learnings" intro="Three moments where I had to hold a design line, and what we traded to do it." />
      {MOMENTS.map((m, i) => (
        <article key={m.title} className="grid grid-cols-1 gap-6 border-b border-chalk py-12 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
          <div className="flex flex-col gap-4">
            <span aria-hidden="true" className="font-editorial text-[72px] leading-[0.9] text-[#d6d5d0] tabular-nums">
              {i + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-editorial text-[26px] leading-[1.25] font-normal text-ink">{m.title}</h3>
              <p className="font-ui text-[15px] leading-[1.5] text-ashen">{m.sub}</p>
            </div>
          </div>
          <dl className="flex flex-col xl:-mt-4">
            {m.rows.map(([k, v], r) => (
              <div
                key={k}
                className={`grid grid-cols-1 gap-1 py-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6 ${r < m.rows.length - 1 ? "border-b border-stone" : ""}`}
              >
                <dt className="font-ui text-sm leading-[1.8] text-ashen">{k}</dt>
                <dd className="font-ui text-[17px] leading-[1.65] text-graphite">{v}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote className="m-0 border-l-2 border-clay pl-5 font-editorial text-[22px] leading-[1.4] text-ink">{children}</blockquote>;
}

/** Designed keyframe standing in for the product demo video until it's recorded. */
function Keyframe({ children }: { children: React.ReactNode }) {
  return (
    <figure className="relative m-0 h-[360px] overflow-hidden rounded-[20px] bg-stone lg:h-[410px]">
      <div className="absolute inset-x-6 top-10 bottom-0 flex flex-col gap-4 rounded-t-xl border border-b-0 border-chalk bg-paper p-6 shadow-lift lg:inset-x-12">
        {children}
      </div>
    </figure>
  );
}

export function Future() {
  return (
    <div className="flex flex-col">
      <SectionHeader
        ruled
        title="Future Evolution"
        intro="The clean data behind this redesign makes the next step possible: setting up and managing reviews in plain language."
      />

      <article className="grid grid-cols-1 gap-6 border-b border-chalk py-12 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
        <Lead n={1} title="Conversational setup: the AI co-pilot" />
        <div className="flex flex-col gap-6">
          <p className="font-ui text-base leading-[1.6] text-graphite">
            Even with the streamlined Quick Wizard, an admin still clicks through a page of settings. The next evolution turns that into a
            conversation. Imagine an HR manager logging in and simply typing:
          </p>
          <Quote>
            &ldquo;I need to run a 360 performance review for the entire Engineering department starting next Monday, using our standard
            5-point scale.&rdquo;
          </Quote>
          <p className="font-ui text-base leading-[1.6] text-graphite">
            Instead of navigating menus, the co-pilot understands the intent, securely queries the backend data we spent months organising,
            and generates a fully configured cycle draft for review.
          </p>
          <Keyframe>
            <div className="max-w-[78%] self-end rounded-[14px_14px_4px_14px] border border-chalk bg-parchment px-4 py-3 font-ui text-sm leading-[1.5] text-ink">
              I need to run a 360 performance review for the entire Engineering department starting next Monday, using our standard 5-point
              scale.
            </div>
            <div className="flex max-w-[84%] flex-col gap-2.5 rounded-[14px_14px_14px_4px] border border-chalk p-4">
              <p className="flex items-center gap-2 font-ui text-[13px] leading-[1.4] text-ashen">
                <StarIcon size={14} color="var(--color-ink)" />
                Draft ready for review
              </p>
              <p className="font-ui text-[15px] leading-[1.4] font-medium text-ink">Engineering 360 review</p>
              <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-y-1.5 font-ui text-[13px] leading-[1.5]">
                <dt className="text-ashen">Participants</dt>
                <dd className="text-ink">Engineering · all members</dd>
                <dt className="text-ashen">Starts</dt>
                <dd className="text-ink">Next Monday</dd>
                <dt className="text-ashen">Rating scale</dt>
                <dd className="text-ink">Standard 5-point</dd>
              </dl>
              <span className="mt-1 self-start rounded-control bg-ink px-3 py-1.5 font-ui text-[13px] leading-[1.4] text-parchment">Review draft</span>
            </div>
          </Keyframe>
        </div>
      </article>

      <article className="grid grid-cols-1 gap-6 py-12 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12">
        <Lead n={2} title="Natural language search" />
        <div className="flex flex-col gap-6">
          <p className="font-ui text-base leading-[1.6] text-graphite">
            When you manage reviews for thousands of employees, finding one problem, like a missing manager or a late self-evaluation, is a
            real headache. Today HR managers hunt through complex filters and tables. The future replaces them with a conversational search
            bar. An HR manager could just ask:
          </p>
          <Quote>&ldquo;Update the Q4 review cycle to hide peers&rsquo; feedback names from their managers.&rdquo;</Quote>
          <p className="font-ui text-base leading-[1.6] text-graphite">
            It bypasses complex table manipulation entirely, so managers can surface and fix bottlenecks instantly in natural language.
          </p>
          <Keyframe>
            <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-ink px-3.5 py-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-graphite">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-ui text-sm leading-[1.4] text-ink">Update the Q4 review cycle to hide peers&rsquo; feedback names from their managers.</span>
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-chalk p-4">
              <p className="font-ui text-[13px] leading-[1.4] text-ashen">1 change to apply</p>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-ui text-[15px] leading-[1.4] font-medium text-ink">Q4 review cycle · Visibility</span>
                  <span className="font-ui text-[13px] leading-[1.5] text-graphite">
                    Peer feedback names: <span className="text-loss line-through">Visible to managers</span> →{" "}
                    <span className="text-gain">Hidden from managers</span>
                  </span>
                </div>
                <span className="rounded-control bg-ink px-3 py-1.5 font-ui text-[13px] leading-[1.4] text-parchment">Apply</span>
              </div>
            </div>
            <div aria-hidden="true" className="flex flex-col gap-2 opacity-55">
              <div className="h-2.5 w-[64%] rounded bg-stone" />
              <div className="h-2.5 w-[48%] rounded bg-stone" />
            </div>
          </Keyframe>
        </div>
      </article>

      <section aria-label="Closing" className="flex flex-col items-center gap-6 border-t border-chalk pt-16 text-center">
        <p className="max-w-[30ch] font-editorial text-[26px] leading-[1.35] text-balance text-ink lg:text-[30px]">
          We didn&rsquo;t just redesign a twelve-step configuration maze; we dismantled a system that treated HR leaders like data-entry
          clerks.
        </p>
        <p className="max-w-[44ch] font-ui text-base leading-[1.6] text-graphite">
          My design philosophy is absolute: the burden of complexity belongs to the machine, never the human.
        </p>
      </section>
    </div>
  );
}

function Lead({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <span aria-hidden="true" className="font-editorial text-[72px] leading-[0.9] text-[#d6d5d0] tabular-nums">
        {n}
      </span>
      <h3 className="font-editorial text-[26px] leading-[1.25] font-normal text-ink">{title}</h3>
    </div>
  );
}

/** The existing end of the case study: LinkedIn line over the animated footer graphic. */
export function Ending() {
  return (
    <div className="flex h-[640px] flex-col lg:h-[834px]">
      <div className="flex flex-1 items-center justify-center">
        <a
          href="https://www.linkedin.com/in/harshapeddinti/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-editorial text-[28px] leading-[1.2] text-nav-active transition-transform duration-300 ease-[var(--ease-editorial)] hover:scale-110 lg:text-[32px]"
        >
          I did. Will you?
        </a>
      </div>
      <div className="flex h-[124px] w-full shrink-0 items-start justify-start overflow-hidden bg-[rgba(218,220,222,0.57)]">
        <FooterGraphic />
      </div>
    </div>
  );
}
