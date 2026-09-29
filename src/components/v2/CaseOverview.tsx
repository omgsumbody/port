"use client";

import { motion } from "framer-motion";
import { revealGroup, revealUp } from "@/lib/motion";

export interface CaseStat {
  value: string;
  label: string;
  trend: "up" | "down";
}

export interface CaseMeta {
  label: string;
  items: string[];
}

interface CaseOverviewProps {
  eyebrow: string;
  title: string;
  lede: string;
  stats: CaseStat[];
  summary: string;
  meta: CaseMeta[];
}

function TrendArrow({ trend }: { trend: CaseStat["trend"] }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-ashen ${trend === "down" ? "rotate-180" : ""}`}
    >
      <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CaseOverview({ eyebrow, title, lede, stats, summary, meta }: CaseOverviewProps) {
  return (
    <motion.div
      className="flex w-full flex-col"
      variants={revealGroup}
      initial="hidden"
      animate="visible"
    >
      {/* Eyebrow — the clay dot is the page's single chromatic mark */}
      <motion.p variants={revealUp} className="flex items-center gap-2 font-ui text-caption font-medium uppercase tracking-[0.08em] text-ashen">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-clay" />
        {eyebrow}
      </motion.p>

      <motion.h1 variants={revealUp} className="mt-4 font-editorial text-display font-normal text-ink">
        {title}
      </motion.h1>

      <motion.p variants={revealUp} className="mt-4 max-w-[36ch] font-ui text-lede font-normal text-graphite sm:max-w-[44ch]">
        {lede}
      </motion.p>

      {/* Headline outcomes */}
      <motion.dl variants={revealGroup} className="mt-10 grid grid-cols-2 gap-3 md:mt-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={revealUp}
            className="flex flex-col justify-between gap-6 rounded-card border border-chalk bg-paper p-5 md:p-6"
          >
            <dt className="order-2 font-ui text-body text-ashen">{stat.label}</dt>
            <dd className="order-1 flex items-center gap-1.5">
              <span className="font-editorial text-stat font-normal tabular-nums text-ink">{stat.value}</span>
              <TrendArrow trend={stat.trend} />
              <span className="sr-only">{stat.trend === "up" ? "increase" : "decrease"}</span>
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <motion.p variants={revealUp} className="mt-10 max-w-[68ch] font-ui text-prose text-graphite md:mt-12">
        {summary}
      </motion.p>

      {/* Project facts */}
      <motion.dl
        variants={revealUp}
        className="mt-10 grid grid-cols-1 gap-6 border-t border-chalk pt-6 sm:grid-cols-3 md:mt-12"
      >
        {meta.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <dt className="font-ui text-caption font-medium uppercase tracking-[0.08em] text-ashen">{group.label}</dt>
            <dd>
              <ul className="flex flex-col gap-1 font-ui text-prose text-ink">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}
