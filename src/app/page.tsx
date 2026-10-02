import ShorelineHero from "@/components/home-v2h/ShorelineHero";
import HomeFooter from "@/components/home-v2h/HomeFooter";
import WorkSection from "@/components/home-v2h/WorkSection";
import PageLoader from "@/components/PageLoader";

// New home page, built section by section.
export default function HomeV2h() {
  return (
    <main className="bg-parchment">
      <PageLoader />
      <ShorelineHero />
      <WorkSection />
      <HomeFooter />
    </main>
  );
}
