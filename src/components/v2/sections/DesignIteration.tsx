"use client";

import { useState } from "react";
import Carousel from "@/components/v2/Carousel";
import ScreenOverlay, { type OverlayScreen } from "@/components/v2/ScreenOverlay";
import Pic from "@/components/v2/Pic";
import { Prose, ScreenWell } from "@/components/v2/ui";
import { Summarizable, SummarizeButton, SummaryText } from "@/components/v2/Summarize";

const A = "/assets/Review settings";

const JOURNEYS = [1, 2, 3, 4, 5].map((k) => ({ src: `${A}/DC${k}.png`, alt: `Journey flow exploration ${k}` }));

type Tile = {
  title: string;
  image: string;
  alt: string;
  layout: "wide" | "imageLeft" | "imageRight";
  body: React.ReactNode;
};

const Hl = ({ children }: { children: React.ReactNode }) => <span className="font-medium text-ink">{children}</span>;

const TILES: Tile[] = [
  {
    title: "Twelve pages of setup, down to four",
    image: "ex1.png",
    alt: "Prefilled review cycle settings",
    layout: "wide",
    body: (
      <p>
        We studied review cycles across our customer base and ranked every setting by how often it was used. The common path became a
        prefilled default for small and mid-sized companies. <Hl>A twelve-page process became four pages.</Hl>
      </p>
    ),
  },
  {
    title: "Frequency, duration and type, up front",
    image: "ex2.png",
    alt: "Review frequency, duration and type settings",
    layout: "imageLeft",
    body: <p>HR managers set the frequency, duration and type of review on the very first page of the modular settings.</p>,
  },
  {
    title: "One cycle, a view for every department",
    image: "ex3.png",
    alt: "Views set up inside a review cycle",
    layout: "imageRight",
    body: (
      <p>
        HR had to duplicate whole review cycles to treat departments differently. I designed Views, a master-and-child model:
        enterprises get granular control, smaller teams keep plug-and-play defaults.{" "}
        <Hl>Views reached 52–64% enterprise adoption, and CSM-assisted setups fell 32–45%.</Hl>
      </p>
    ),
  },
  {
    title: "Separating who is reviewed from how",
    image: "ex4.png",
    alt: "Participant cards with progressive settings",
    layout: "imageLeft",
    body: (
      <p>
        A wall of checkboxes made this the step where most setups were abandoned. I split the who from the how, using visual cards and
        settings that appear only when needed. <Hl>Drop-off on this step fell from ~24% to 11–13%.</Hl>
      </p>
    ),
  },
  {
    title: "Letting the machine carry the maths",
    image: "ex5.png",
    alt: "Evaluation criteria and scoring setup",
    layout: "imageRight",
    body: (
      <p>
        Configuring evaluation criteria and scoring carries real systemic risk. I shifted that cognitive and mathematical load to the
        system, with AI-driven template recommendations and visual constraints.{" "}
        <Hl>Validation errors fell from 3.2 to 1.7, and step revisits from 2.6 to 1.4.</Hl>
      </p>
    ),
  },
  {
    title: "Score visibility by employee type",
    image: "ex6.png",
    alt: "Score visibility settings by employee type",
    layout: "imageLeft",
    body: <p>HR managers can also configure forms by who sees scores, for each type of employee.</p>,
  },
  {
    title: "Calibration and scoring inside every cycle",
    image: "ex7.png",
    alt: "Calibration and 9-box grid settings in a review cycle",
    layout: "wide",
    body: (
      <>
        <p>
          Calibration and score settings now live inside each review cycle; before, they couldn&rsquo;t be set per cycle at all.
          Bringing them in also made the analytics in Reviews Home legible.
        </p>
        <p>
          This story is featured on Mesh Studio. Created by McKinsey to compare business units, the 9-box grid is now a staple of talent
          reviews and succession planning.{" "}
          <a
            href="https://www.mesh.ai/guides/how-to-use-the-9-box-grid-for-talent-reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-graphite underline underline-offset-[3px] hover:text-ink"
          >
            Read the featured story
          </a>
        </p>
      </>
    ),
  },
  {
    title: "Skip ahead, then see the whole cycle",
    image: "ex8.png",
    alt: "Review cycle timeline as a Gantt chart",
    layout: "wide",
    body: (
      <p>
        HR managers can jump straight here with settings preconfigured for mid-sized and small companies, or bring their own philosophy.
        A timeline lays out the entire review cycle as a Gantt chart, ready to share with stakeholders before launch.
      </p>
    ),
  },
  {
    title: "Edge cases, then one summary to launch",
    image: "ex9.png",
    alt: "Validation of edge cases and final summary",
    layout: "imageRight",
    body: (
      <>
        <p>
          Employees missing goals, managers or grades need validation and an HR acknowledgement; in most established companies these cases
          are rare.
        </p>
        <p>A final summary shows every setting, so HR managers can save a draft or launch the cycle right away.</p>
      </>
    ),
  },
  {
    title: "A command centre for every cycle",
    image: "ex10.png",
    alt: "Review cycle creation dashboard",
    layout: "imageLeft",
    body: (
      <>
        <p>
          The review cycle dashboard is the command centre for the new modular setup, bringing clarity to managing complex, global
          cohorts.
        </p>
        <p>With visibility in one place and simpler paths to create, HR leaders can launch and manage cycles far faster.</p>
      </>
    ),
  },
];

const SCREENS: OverlayScreen[] = TILES.map((t) => ({ src: `${A}/${t.image}`, title: t.title, alt: t.alt }));

const LEFT = [1, 2, 3, 4, 5].map((k) => `${A}/dcleft${k}.png`);
const RIGHT = [1, 2, 3, 4, 5].map((k) => `${A}/dcright${k}.png`);

export function DesignIteration() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 pb-4">
        <h2 className="font-editorial text-[34px] leading-[1.1] font-normal text-ink lg:text-[40px]">Design &amp; Iteration</h2>
        <p className="max-w-[62rem] font-ui text-base leading-[1.55] text-graphite">
          I mapped several journeys and wireframed the creation flow, then worked through them in syncs with the founders, product and
          tech leads. Each step below is one stage of the review cycle setup.
        </p>
      </header>

      <section aria-label="Journey flow explorations" className="flex flex-col gap-5 pt-2">
        <Carousel
          slides={JOURNEYS}
          stageClassName="h-[360px] lg:h-[460px] p-6 lg:p-10"
          thumbHeight="h-[72px]"
          header={(controls) => (
            <div className="flex items-end justify-between gap-6">
              <h3 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">Journey flow explorations</h3>
              {controls}
            </div>
          )}
        />
      </section>

      <section aria-label="Wireframes across journey flows" className="flex flex-col gap-5 pt-10">
        <h3 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">Wireframes across journey flows</h3>
        <div className="pause-hover-children relative grid h-[440px] grid-cols-2 gap-4 overflow-hidden rounded-card-lg bg-stone px-4 lg:px-6">
          <WireColumn images={LEFT} />
          <WireColumn images={RIGHT} reverse />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-stone to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone to-transparent" />
        </div>
      </section>

      <Summarizable summary="I aligned the founders, design, product and tech leaders on the final flow, secured sign-off from every affected module, and shortened time to release by moving conversational search to UX debt.">
        <section aria-label="Aligning with leadership" className="flex flex-col gap-5 pt-10">
          <div className="flex items-end justify-between gap-6">
            <h3 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">Aligning with leadership</h3>
            <SummarizeButton />
          </div>
          <SummaryText className="font-ui text-base leading-[1.6] text-graphite">
            <div className="flex flex-col gap-3.5">
              <Prose>
                I then held syncs with the founders, design, product and tech leaders to finalise the flow and move ahead with
                high-fidelity designs. The founders&rsquo; sync ended with a decided flow.
              </Prose>
              <Prose>
                A product leaders&rsquo; sync flagged the changes that would affect their modules. Once every product leader gave the
                green light and their requests were accommodated, I moved on to the tech leaders.
              </Prose>
              <Prose>
                With the tech lead, we found that time to release would drop significantly if conversational search moved to UX debt, to
                be picked up when feasible.
              </Prose>
            </div>
          </SummaryText>
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            {["fin1.png", "fin2.png"].map((f) => (
              <div key={f} className="relative h-[280px] overflow-hidden rounded-card bg-stone">
                <Pic src={`${A}/${f}`} alt="Sync with tech leaders" sizes="(min-width: 1024px) 520px, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      </Summarizable>

      <div className="border-b border-chalk pt-14" />
      <h3 className="mt-4 font-editorial text-2xl leading-[1.33] font-normal text-ink">The final flow, step by step</h3>

      {TILES.map((t, i) => (
        <FlowTile key={t.title} tile={t} onOpen={() => setOpen(i)} />
      ))}

      {open !== null && <ScreenOverlay screens={SCREENS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function WireColumn({ images, reverse = false }: { images: string[]; reverse?: boolean }) {
  const loop = [...images, ...images];
  return (
    <div className={`v2-marquee-y flex flex-col ${reverse ? "[animation-direction:reverse]" : ""}`}>
      {loop.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={i < images.length ? `Wireframe ${i + 1}` : ""}
          aria-hidden={i >= images.length}
          loading="lazy"
          className="mb-4 block h-auto w-full rounded-lg border border-chalk bg-paper"
        />
      ))}
    </div>
  );
}

function ViewDetails({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-2 rounded-control bg-ink px-5 py-2.5 font-ui text-[15px] leading-[1.4] font-medium text-parchment transition-colors hover:bg-graphite"
    >
      View details
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function FlowTile({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  const title = <h3 className="font-editorial text-2xl leading-[1.33] font-normal text-ink">{tile.title}</h3>;
  const body = <div className="flex flex-col gap-4 font-ui text-base leading-[1.63] text-graphite">{tile.body}</div>;
  const well = (h: string) => (
    <button type="button" onClick={onOpen} aria-label={`Open ${tile.title}`} className={`group block min-w-0 cursor-zoom-in ${h}`}>
      <ScreenWell
        src={`${A}/${tile.image}`}
        alt={tile.alt}
        sizes={tile.layout === "wide" ? "(min-width: 1024px) 990px, 100vw" : "(min-width: 1024px) 580px, 60vw"}
        className="h-full"
        frameClassName="transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.015] origin-top-left"
      />
    </button>
  );

  if (tile.layout === "wide") {
    return (
      <article className="flex flex-col gap-8 rounded-card-lg border border-chalk bg-paper p-6 lg:p-8">
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-8">
          {title}
          <div className="flex flex-col items-start gap-4">
            {body}
            <ViewDetails onClick={onOpen} />
          </div>
        </div>
        {well("h-[300px] lg:h-[420px]")}
      </article>
    );
  }

  const text = (
    <div className="flex min-w-0 flex-col items-start gap-4">
      {title}
      {body}
      <ViewDetails onClick={onOpen} />
    </div>
  );
  return (
    <article
      className={`grid grid-cols-1 items-start gap-8 rounded-card-lg border border-chalk bg-paper p-6 lg:p-8 ${
        tile.layout === "imageLeft" ? "md:grid-cols-[7fr_5fr]" : "md:grid-cols-[5fr_7fr]"
      }`}
    >
      {tile.layout === "imageLeft" ? (
        <>
          {well("h-[300px] lg:h-[400px]")}
          {text}
        </>
      ) : (
        <>
          {text}
          {well("h-[300px] lg:h-[400px]")}
        </>
      )}
    </article>
  );
}
