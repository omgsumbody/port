"use client";

import TopNavigation from "@/components/TopNavigation";
import AboutHero from "@/components/AboutHero";
import AboutBody from "@/components/AboutBody";
import FooterGraphic from "@/components/FooterGraphic";
import FooterBar from "@/components/FooterBar";
import ShadowOverlay from "@/components/ShadowOverlay";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col font-sans relative">
            <ShadowOverlay />
            <header className="sticky top-0 z-50">
                <TopNavigation />
            </header>

            <main className="flex-grow">
                <AboutHero />
                <AboutBody />
            </main>

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
        </div>
    );
}
