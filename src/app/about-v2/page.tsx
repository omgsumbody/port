import Link from "next/link";
import AboutIntro from "@/components/about-v2/AboutIntro";
import { AboutExperience, AboutFavourites } from "@/components/about-v2/AboutSections";
import HomeFooter from "@/components/home-v2h/HomeFooter";

// New About page, built section by section.
export default function AboutV2() {
  return (
    <main className="bg-parchment">
      <nav className="flex items-center justify-between px-6 pt-7 lg:px-16">
        <Link href="/home-v2h" aria-label="Harsha Peddinti, home" className="block">
          <img src="/logo.svg" alt="" width={40} height={46} className="h-[46px] w-[40px]" />
        </Link>
        <div className="flex items-center gap-8 font-ui text-[16px] text-[#1b2330]">
          <Link href="/home-v2h#work" className="hover:opacity-70">
            Work
          </Link>
          <Link href="/about-v2" aria-current="page" className="font-semibold">
            About
          </Link>
          <a
            href="/Harsha_Peddinti.pdf"
            target="_blank"
            rel="noopener"
            className="bg-[#1b2330] px-[22px] py-3 text-white hover:bg-[#2a3444]"
          >
            Resume
          </a>
        </div>
      </nav>
      <AboutIntro />
      <AboutExperience />
      <AboutFavourites />
      <HomeFooter />
    </main>
  );
}
