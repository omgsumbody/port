"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ComponentType, type CSSProperties } from "react";
import WorkCameos from "./WorkCameos";
import WorkCartridge from "./WorkCartridge";
import { SUNLIGHT, watchDaylight } from "./daylight";

// The expanded project summaries from the first home page, loaded on first open (or on
// hovering a cartridge, so they are usually ready by the click).
const loadCardModal = () => import("@/components/CardExpandModal");
const loadMavenModal = () => import("@/components/MavenExpandModal");
const CardExpandModal = dynamic(loadCardModal, { ssr: false });
const MavenExpandModal = dynamic(loadMavenModal, { ssr: false });

type ModalId = "review-settings" | "maven";

export type Work = {
  title: string;
  description: string;
  stats: [string, string][];
  tag: { label: string; tone: "gold" | "blue"; star?: boolean };
  modal: ModalId; // Know More opens this summary; the full case study is linked from inside it
  video?: string;
};

const WORK: Work[] = [
  {
    title: "Reviews Settings",
    description: "Empowering HRs with scalable, modular performance management settings.",
    stats: [
      ["35%", "faster creation of review cycles."],
      ["8%", "more review cycles created."],
    ],
    tag: { label: "Most Popular", tone: "gold", star: true },
    modal: "review-settings",
    video: "https://res.cloudinary.com/des7zr831/video/upload/v1780566788/Video_Project_9_mpw1np.mp4",
  },
  {
    title: "Mesh.ai (Maven)",
    description: "Improving the quality and tonality of review feedback with AI.",
    stats: [
      ["60%", "less time to complete feedback forms."],
      ["215%", "better qualitative feedback."],
    ],
    tag: { label: "Snapshot · 3 min", tone: "blue" },
    modal: "maven",
  },
];

const REVIEW_SETTINGS_INFO = {
  title: "Empowering HR with Scalable, Modular Performance Settings",
  body: "Replacing a rigid 12-step maze with a bifurcated architecture empowers HR to independently launch customized, scalable performance reviews in minutes without support.",
};

// Opened by a cartridge, which animates its own way in.
type ModalProps = { revealed: boolean; onClose: () => void };
const MODALS: Record<ModalId, { Modal: ComponentType<ModalProps>; preload: () => void }> = {
  "review-settings": {
    Modal: ({ revealed, onClose }) => (
      <CardExpandModal isOpen enter="none" revealed={revealed} onClose={onClose} cardIndex={0} cardInfo={REVIEW_SETTINGS_INFO} />
    ),
    preload: () => void loadCardModal(),
  },
  maven: {
    Modal: ({ revealed, onClose }) => (
      <MavenExpandModal isOpen enter="none" revealed={revealed} onClose={onClose} cardIndex={2} />
    ),
    preload: () => void loadMavenModal(),
  },
};

// The page's sun (see daylight.ts) throws each cartridge's shadow along the page. A cartridge
// stands SLAB_DEPTH off the page, so the shadow starts from its foot: its outline, that much
// lower. It is drawn small and scaled up, because a blur costs by the area it covers.
const SLAB_DEPTH = 16;
const CAST_SCALE = 4;
// `part` of the full throw; the nearer copy is tighter, so the shadow hardens toward the cartridge.
const cast = (part: number, strength: number): CSSProperties => ({
  top: SLAB_DEPTH,
  left: 0,
  width: `${100 / CAST_SCALE}%`,
  height: `${100 / CAST_SCALE}%`,
  borderRadius: 24 / CAST_SCALE,
  background: "var(--sun-shade)",
  opacity: `calc(var(--sun-o, 0) * ${strength})`,
  filter: `blur(calc((4px + var(--sun-reach, 0) * ${SLAB_DEPTH * part * 0.22}px) / ${CAST_SCALE}))`,
  transformOrigin: "0 0",
  // --lift: standing further off the page (lifted on hover) throws further.
  transform: `translate3d(calc(var(--sun-x, 0) * (${SLAB_DEPTH * part}px + var(--lift, 0px) * ${part})), calc(var(--sun-y, 0) * (${SLAB_DEPTH * part}px + var(--lift, 0px) * ${part})), 0) scale(${CAST_SCALE})`,
  willChange: "transform, opacity, filter",
});
const CAST_FAR = cast(1, 1);
const CAST_NEAR = cast(0.4, 0.9);

// What is left of the sunrise in the light, on the card with everything on it and on the
// page under it. One flat colour each: a gradient this faint shows its steps.
const LIGHT = 0.2;
const CARD_LIGHT: CSSProperties = {
  inset: `0 0 -${SLAB_DEPTH}px`,
  background: `rgb(${SUNLIGHT})`,
  opacity: `calc(var(--sun-warm, 0) * ${LIGHT})`,
};
const PAPER_LIGHT: CSSProperties = {
  background: `rgb(${SUNLIGHT})`,
  opacity: `calc(var(--sun-warm, 0) * ${LIGHT})`,
  willChange: "opacity",
};

/** Selected work: the two case studies, stacked, each a cartridge lying on the page. */
export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) return watchDaylight(sectionRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      className="relative scroll-mt-8 overflow-x-clip px-6 py-[110px] lg:px-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={PAPER_LIGHT} />
      <div className="relative mx-auto flex w-full max-w-[1484px] flex-col gap-12">
        <div className="flex flex-col gap-2.5">
          <span className="font-ui text-[13px] tracking-[0.08em] text-ashen uppercase">Selected work</span>
          <h2 id="work-title" className="font-perfectly-nineties text-[clamp(36px,3.4vw,48px)] font-semibold text-[#1b2330]">
            Two projects, start to finish.
          </h2>
        </div>
        {WORK.map((work, i) => (
          <WorkCartridge
            key={work.title}
            work={work}
            index={i}
            castFar={CAST_FAR}
            castNear={CAST_NEAR}
            light={CARD_LIGHT}
            preload={MODALS[work.modal].preload}
            Modal={MODALS[work.modal].Modal}
          />
        ))}
      </div>
      <WorkCameos sectionRef={sectionRef} />
    </section>
  );
}
