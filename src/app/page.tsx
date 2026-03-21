"use client";

import TopNavigation from "@/components/TopNavigation";
import MainBodyShowcase from "@/components/MainBodyShowcase";
import FooterGraphic from "@/components/FooterGraphic";
import PixelRevealHero from "@/components/PixelRevealHero";
import FooterBar from "@/components/FooterBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-[999]">
        <TopNavigation />
      </header>

      {/* ─── SECTION 1: HERO ─────────────────────────────────── */}
      <section aria-label="Hero">
        <PixelRevealHero />
      </section>

      {/* ─── SECTION 2: MAIN BODY (Cards & Interactions) ─────── */}
      <section aria-label="Main Body" className="w-full" style={{ backgroundColor: "#fffdf6" }}>
        <MainBodyShowcase />
      </section>

      {/* ─── SECTION 3: FOOTER ───────────────────────────────── */}
      <footer aria-label="Footer" className="footer-section w-full bg-[#FFFDF5] flex flex-col items-center">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center">
          <img
            src="/footer cid.svg"
            alt="Footer Brand Banner"
            className="w-full h-auto object-contain block"
          />
          <FooterGraphic />
          <FooterBar />
        </div>
      </footer>
    </div>
  );
}
