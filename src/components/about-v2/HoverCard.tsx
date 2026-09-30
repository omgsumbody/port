import type { ReactNode } from "react";

type Props = {
  children: ReactNode; // the link text
  href?: string;
  title: string;
  meta?: string;
  body?: string;
  logo?: string;
};

const linkClass =
  "underline decoration-[#C9C4BA] underline-offset-4 transition-colors hover:decoration-[#1b2330] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b2330]";

/**
 * An inline link that shows a small preview card on hover or keyboard focus. The card is
 * a description of the link, so screen readers get it through aria-describedby.
 */
export default function HoverCard({ children, href, title, meta, body, logo }: Props) {
  const id = `card-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const trigger = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-describedby={id} className={linkClass}>
      {children}
    </a>
  ) : (
    <span tabIndex={0} aria-describedby={id} className={linkClass}>
      {children}
    </span>
  );
  return (
    <span className="group/card relative inline-block">
      {trigger}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute top-full left-0 z-30 mt-2 flex w-[300px] translate-y-1 flex-col gap-2 rounded-[14px] border border-[#E6E3DC] bg-white p-4 text-left opacity-0 shadow-[0_10px_30px_rgba(27,35,48,0.12)] transition-[opacity,transform] duration-200 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100"
      >
        <span className="flex items-center gap-3">
          {logo && <img src={logo} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-[10px] object-cover" />}
          <span className="flex flex-col">
            <span className="font-ui text-[15px] font-semibold leading-snug text-[#1b2330]">{title}</span>
            {meta && <span className="font-ui text-[13px] leading-snug text-ashen">{meta}</span>}
          </span>
        </span>
        {body && <span className="font-ui text-[14px] leading-[1.45] text-[#3D495A]">{body}</span>}
      </span>
    </span>
  );
}
