const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harshapeddinti/" },
  { label: "X", href: "https://x.com/omgsumbody" },
];

// The collage's own background, so the image runs into the section without a seam.
const COLLAGE_BG = "#f0f1ec";

/**
 * End of the page: the sign-off sits in the empty top of the collage, the games lie on the
 * floor below, running off the page edges, and the links sit in the clear floor at bottom right.
 */
export default function HomeFooter() {
  return (
    <footer className="relative w-full overflow-hidden" style={{ background: COLLAGE_BG }}>
      <img
        src="/home/footer-collage.webp"
        alt="Soft voxel toys from the games Harsha grew up with, left on the floor: a silver Skyline R32 from Need for Speed II, Leonardo's katanas and a pizza box from TMNT III, the Contra power-up and S emblem, an MP5 from Modern Warfare 2, GTA V cash and Franklin's bandana, the C4 from Counter-Strike 2, Tracer's chronal accelerator and Reinhardt's hammer from Overwatch, and Arthur Morgan's hat, revolver and journal from Red Dead Redemption 2."
        width={2000}
        height={1116}
        loading="lazy"
        className="block h-auto w-full"
      />
      <p className="absolute inset-x-0 top-[8%] px-6 text-center font-perfectly-nineties text-[clamp(40px,5vw,80px)] font-semibold leading-none text-[#1b2330]">
        create . deliver . inspire
      </p>
      {/* the one clear patch of floor, bottom right */}
      <div className="absolute right-[2.5%] bottom-[5%] flex flex-col items-end gap-2">
        <nav aria-label="Social links" className="flex items-center gap-6 font-ui text-[15px] text-[#1b2330]">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#1b2330]/30 underline-offset-4 transition-colors hover:decoration-[#1b2330]"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <p className="font-ui text-[13px] text-[#5b5a56]">© Harshapeddintidesign. All rights reserved.</p>
      </div>
    </footer>
  );
}
