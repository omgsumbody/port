import ShorelineHero from "@/components/home-v2h/ShorelineHero";
import HomeFooter from "@/components/home-v2h/HomeFooter";
import WorkSection from "@/components/home-v2h/WorkSection";

// New home page, built section by section.
export default function HomeV2h() {
  return (
    <main className="bg-parchment">
      <ShorelineHero />
      <WorkSection />
      <HomeFooter />
    </main>
  );
}
