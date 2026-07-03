"use client";

import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
// import MainBodyShowcase from "@/components/MainBodyShowcase"; // Stashed for later
import FooterGraphic from "@/components/FooterGraphic";
import PixelRevealHero from "@/components/PixelRevealHero";
import FooterBar from "@/components/FooterBar";
import HeroCard from "@/components/HeroCard";
import BentoCard from "@/components/BentoCard";
import ShadowOverlay from "@/components/ShadowOverlay";
import CardExpandModal from "@/components/CardExpandModal";

export default function Home() {
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <ShadowOverlay />
      <header className="sticky top-0 z-50">
        <TopNavigation />
      </header>

      {/* ─── SECTION 1: HERO ─────────────────────────────────── */}
      <section aria-label="Hero">
        <PixelRevealHero />
      </section>

      {/* ─── NEW SECTION: Placeholder ──────────────────────────── */}
      {/* 
        This section has a height of 1708px, auto width, and a temporary border.
        The flex container is set up so that elements added here can dynamically resize.
      */}
      <section 
        aria-label="New Dynamic Section" 
        className="w-full h-auto min-h-[1708px] bg-[#FFFDF6] flex flex-col items-center justify-start py-8 px-4"
      >
        <HeroCard onKnowMoreClick={() => setIsHeroModalOpen(true)} />

        {/* Bento Grid Wrapper */}
        <div className="w-full max-w-[1484px] mx-auto mt-[32px] flex flex-col gap-[32px]">
          
          {/* Staggered Columns */}
          <div className="flex flex-col xl:flex-row gap-[32px] w-full">
            
            {/* Left Column (800px width on desktop) */}
            <div className="flex flex-col gap-[32px] w-full xl:w-[800px] shrink-0">
              <div className="h-auto xl:h-[463px]">
                <BentoCard 
                  variant="row" 
                  title="Mesh Ai (Maven)" 
                  description="Improve the quality and tonality of review feedback." 
                />
              </div>
              <div className="h-auto xl:h-[280px]">
                <BentoCard 
                  variant="row" 
                  title="Reviews Formfilling" 
                  description="A performance feedback form which brings data together from all modules." 
                />
              </div>
            </div>

            {/* Right Column (652px width on desktop) */}
            <div className="flex flex-col gap-[32px] w-full xl:w-[652px] shrink-0">
              <div className="h-auto xl:h-[280px]">
                <BentoCard 
                  variant="col" 
                  title="Views" 
                  description="Create and save custom analytical views across all Mesh products." 
                />
              </div>
              <div className="h-auto xl:h-[463px]">
                <BentoCard 
                  variant="col" 
                  title="Reviews Home" 
                  description="Home for performance, development, calibration and talent decisions." 
                />
              </div>
            </div>

          </div>

          {/* Bottom Wide Strip (1484px width, 134px height) */}
          <div className="h-auto xl:h-[134px] w-full">
            <BentoCard 
              variant="wide" 
              title="Rabbit Design System" 
              description="Design system used by Mesh organization and products." 
            />
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: MAIN BODY (Cards & Interactions) ─────── */}
      {/* 
      <section aria-label="Main Body" className="w-full" style={{ backgroundColor: "#fffdf6" }}>
        <MainBodyShowcase />
      </section>
      */}

      {/* ─── SECTION 3: FOOTER ───────────────────────────────── */}
      <footer aria-label="Footer" className="footer-section w-full bg-[#FFFDF5] flex flex-col items-center">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center">
          <FooterBar />
          <img
            src="/footer cid.svg"
            alt="Footer Brand Banner"
            className="w-full h-auto object-contain block"
          />
          <FooterGraphic />
        </div>
      </footer>

      <CardExpandModal 
        isOpen={isHeroModalOpen} 
        onClose={() => setIsHeroModalOpen(false)} 
        cardIndex={0} 
        cardInfo={{ 
          title: 'Empowering HR with Scalable, Modular Performance Settings', 
          body: 'Replacing a rigid 12-step maze with a bifurcated architecture empowers HR to independently launch customized, scalable performance reviews in minutes without support.' 
        }} 
      />
    </div>
  );
}
