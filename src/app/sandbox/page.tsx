"use client";

import TopNavigation from "@/components/TopNavigation";
import SandboxMainBodyShowcase from "@/components/SandboxMainBodyShowcase";
import FooterGraphic from "@/components/FooterGraphic";
import PixelRevealHero from "@/components/PixelRevealHero";
import FooterBar from "@/components/FooterBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50">
        <TopNavigation />
      </header>

      <main className="flex-grow">
        {/* Pixel Reveal Hero */}
        <PixelRevealHero />

        <section className="main-body w-full py-20 px-[56px]">
          <SandboxMainBodyShowcase />
        </section>
      </main>

      <footer className="footer-section w-full bg-[#FFFDF5] flex flex-col items-center">
        {/* Full-width responsive container for the Footer group */}
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
