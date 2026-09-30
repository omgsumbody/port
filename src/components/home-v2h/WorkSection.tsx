"use client";

import Link from "next/link";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import WorkCameos from "./WorkCameos";

type Work = {
  title: string;
  description: string;
  stats: [string, string][];
  tag: { label: string; tone: "gold" | "blue"; star?: boolean };
  href: string;
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
    href: "/review-settings-v2",
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
    href: "/mesh-ai",
  },
];

const TAG_TONES = {
  gold: "bg-[#FFF3DE] text-[#845200]",
  blue: "bg-[#E6EEF7] text-[#1F4E86]",
};

// The warm border that follows the pointer, as on the current home page cards.
const trackPointer = (e: ReactPointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
};

function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <article
      data-cameo={`card-${index + 1}`}
      onPointerMove={trackPointer}
      className="group relative flex flex-col items-center gap-8 rounded-[24px] bg-[#FCFDFD] p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.08)] lg:flex-row lg:items-stretch lg:gap-10 lg:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), #FCC378 0%, #FD6253 40%, transparent 100%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      <div className="aspect-video w-full shrink-0 overflow-hidden rounded-[16px] bg-[#E5E5E5] lg:w-[52%]">
        {work.video ? (
          <video
            src={work.video}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-inter text-[15px] text-[#8A93A0]">
            Preview coming soon
          </div>
        )}
      </div>

      <div className="flex w-full flex-1 flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="m-0 font-inter text-[28px] font-medium leading-tight text-[#243244] lg:text-[32px]">
            {work.title}
          </h3>
          <p className="m-0 font-inter text-[16px] leading-[1.4] text-[#3D495A]">{work.description}</p>
        </div>

        <div className="flex w-full flex-col items-start gap-4 rounded-[16px] border border-[#EDEDED] bg-[#F8F8F8] p-5 sm:flex-row sm:items-center lg:gap-7 lg:p-6">
          {work.stats.map(([value, label], i) => (
            <div key={value} className="contents">
              {i > 0 && <div aria-hidden className="h-px w-full shrink-0 bg-[#EDEDED] sm:h-[39px] sm:w-[2px]" />}
              <div className="flex flex-1 items-center gap-3 lg:gap-4">
                <span className="shrink-0 font-inter text-[32px] font-medium leading-[39px] text-[#243244]">
                  {value}
                </span>
                <span className="font-inter text-[16px] leading-[19px] text-[#243244]">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex w-full flex-wrap items-center justify-start gap-2 lg:justify-end">
          <span
            className={`flex h-12 items-center gap-2.5 rounded-[32px] px-4 font-inter text-[16px] font-semibold tracking-[0.01em] ${TAG_TONES[work.tag.tone]}`}
          >
            {work.tag.star && <img src="/Star.svg" alt="" width={16} height={16} className="shrink-0" />}
            {work.tag.label}
          </span>
          <Link
            href={work.href}
            className="group/btn relative z-20 flex h-12 items-center gap-2 rounded-[12px] bg-[#FFDED3] px-6 font-inter text-[16px] font-semibold tracking-[0.01em] text-[#980D01] transition-colors duration-300 hover:bg-[#990C02] hover:text-white"
          >
            Know More
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-[2px]">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Selected work: the two case studies, stacked, in the home page card style. */
export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      className="relative scroll-mt-8 overflow-x-clip px-6 py-[110px] lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-[1484px] flex-col gap-12">
        <div className="flex flex-col gap-2.5">
          <span className="font-ui text-[13px] tracking-[0.08em] text-ashen uppercase">Selected work</span>
          <h2 id="work-title" className="font-perfectly-nineties text-[clamp(36px,3.4vw,48px)] font-semibold text-[#1b2330]">
            Two projects, start to finish.
          </h2>
        </div>
        {WORK.map((work, i) => (
          <WorkCard key={work.title} work={work} index={i} />
        ))}
      </div>
      <WorkCameos sectionRef={sectionRef} />
    </section>
  );
}
