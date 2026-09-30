import HeroV3 from "@/components/home-v3/HeroV3";

// Home page v3: the hero rebuilt to match the reference image. Other sections come later.
export default function HomeV3() {
  return (
    <main className="bg-parchment">
      <HeroV3 />
      <section
        aria-label="Next section"
        className="flex min-h-screen items-center justify-center font-ui text-[15px] text-ashen"
      >
        Next section to be designed
      </section>
    </main>
  );
}
