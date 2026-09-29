import Pic from "@/components/v2/Pic";

// Shared building blocks for the v2 case study. Sizes follow the approved canvas at 1440px;
// below lg the two-column rows stack.

export function SectionHeader({
  title,
  intro,
  aside,
  ruled = false,
  className = "",
}: {
  title: string;
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  ruled?: boolean;
  className?: string;
}) {
  return (
    <header
      className={`flex flex-col gap-6 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 ${ruled ? "border-b border-chalk" : ""} ${className}`}
    >
      <div className="flex flex-col gap-3">
        <h2 className="font-editorial text-[34px] leading-[1.1] font-normal text-ink lg:text-[40px]">{title}</h2>
        {intro && <p className="max-w-[60ch] font-ui text-lg leading-[1.55] text-graphite">{intro}</p>}
      </div>
      {aside}
    </header>
  );
}

export function SubHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-editorial text-[26px] leading-[1.2] font-normal text-ink lg:text-[28px] ${className}`}>{children}</h3>;
}

/** 280px label column + content column, the rhythm used across the page. */
export function SplitRow({
  label,
  children,
  className = "",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-12 ${className}`}>
      <div className="flex flex-col gap-3">{label}</div>
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </section>
  );
}

export function Prose({ children, size = "md", className = "" }: { children: React.ReactNode; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = size === "lg" ? "text-lg leading-[1.6] lg:text-xl" : size === "sm" ? "text-base leading-[1.63]" : "text-lg leading-[1.6]";
  return <p className={`font-ui ${s} text-graphite ${className}`}>{children}</p>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-ui text-xs leading-[1.5] tracking-[0.06em] text-ashen uppercase ${className}`}>{children}</p>;
}

export function Chip({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" | "paper" }) {
  const t =
    tone === "dark"
      ? "border-graphite text-mist"
      : tone === "paper"
        ? "border-chalk bg-paper text-graphite"
        : "border-chalk text-graphite";
  return <span className={`rounded-md border px-2 py-0.5 font-ui text-xs leading-[1.6] ${t}`}>{children}</span>;
}

export function ChangePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-gain-tint px-2.5 py-1 font-ui text-sm leading-[1.4] font-medium text-gain tabular-nums">
      {children}
    </span>
  );
}

/** Screenshot sitting in a stone well, anchored top-left like the canvas tiles. */
export function ScreenWell({
  src,
  alt,
  className = "",
  frameClassName = "",
  inset = "pt-8 pl-8",
  sizes = "(min-width: 1024px) 640px, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  inset?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-card bg-stone ${inset} ${className}`}>
      <div className={`relative h-full w-full overflow-hidden rounded-tl-[10px] border border-chalk bg-paper ${frameClassName}`}>
        <Pic src={src} alt={alt} sizes={sizes} priority={priority} className="object-cover object-left-top" />
      </div>
    </div>
  );
}
