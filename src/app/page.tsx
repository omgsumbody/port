"use client";

import TopNavigation from "@/components/TopNavigation";
import MainBodyShowcase from "@/components/MainBodyShowcase";
import FooterGraphic from "@/components/FooterGraphic";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50">
        <TopNavigation />
      </header>

      <main className="flex-grow">
        <section className="hero-section w-full min-h-[calc(100vh-350px)] grid place-items-center relative">
          <div className="flex flex-col items-center justify-center text-center relative max-w-5xl px-[56px] py-10 my-auto">

            {/* Intro Text */}
            <p className="text-[16px] font-medium text-[#3D495A] tracking-[0.02em] leading-[16px] font-sans mb-8">
              Hello, I'm Harsha! Product Designer and ex frontend developer
            </p>

            {/* Main Headline */}
            <div className="relative mb-8 w-full max-w-[800px] flex justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10, rotate: 10 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[-18px] left-[50%] -ml-[140px] md:ml-[0px] md:left-[80px] lg:left-[120px] bg-[#FEF9C3] rounded-2xl px-4 py-1 text-[#64748b] font-medium font-sans text-[20px] z-10 pointer-events-none shadow-sm"
              >
                0-10x
              </motion.div>
              <h1 className="relative text-[40px] font-bold tracking-[-0.02em] leading-[52px] text-[#3D495A] font-sans z-20 pointer-events-none">
                Turning ideas into impactful products from concept to production.
              </h1>
            </div>

            {/* Narrative Line */}
            <p className="text-[16px] font-medium text-[#3D495A] tracking-[0.02em] leading-[16px] font-sans">
              Previously at{" "}
              <span className="bg-gradient-to-r from-[#C28108] to-[#F05B28] bg-clip-text text-transparent">
                Mesh.ai, Hypersonix.ai and Nearbuy
              </span>
            </p>
          </div>
        </section>

        <section className="main-body w-full py-20 px-[56px]">
          <MainBodyShowcase />
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
        </div>
      </footer>
    </div>
  );
}
