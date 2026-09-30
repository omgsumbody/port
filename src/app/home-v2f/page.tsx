import ShorelineHero from "@/components/home-v2f/ShorelineHero";

// New home page, built section by section. Only the hero is designed so far.
export default function HomeV2f() {
  return (
    <main className="bg-parchment">
      <ShorelineHero />
      <section
        aria-label="Next section"
        className="flex min-h-screen items-center justify-center font-ui text-[15px] text-ashen"
      >
        Next section to be designed
      </section>
    </main>
  );
}
