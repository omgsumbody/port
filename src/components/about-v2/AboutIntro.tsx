"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HoverCard from "./HoverCard";
import PortraitShift, { type PortraitStyle } from "./PortraitShift";

// Styles of the same portrait, lined up on the eyes. Hovering moves to the next one.
const STYLES: PortraitStyle[] = [
  { src: "/about/styles/photo.webp", label: "photo" },
  { src: "/about/styles/voxel.webp", label: "as soft voxels" },
  { src: "/about/styles/ps1.webp", label: "as a PlayStation 1 character" },
  { src: "/about/styles/clay.webp", label: "in claymation" },
  { src: "/about/styles/chrome.webp", label: "in liquid chrome" },
  { src: "/about/styles/pixel.webp", label: "as voxel pixel art" },
];

// The time where Harsha is, shown after mount so server and client agree.
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
    const update = () => setTime(fmt.format(new Date()).toLowerCase());
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time ?? " "}</span>;
}

export default function AboutIntro() {
  return (
    <section className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-16 px-6 pt-16 pb-24 lg:grid-cols-[1fr_520px] lg:gap-20 lg:px-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-perfectly-nineties text-[clamp(44px,4.4vw,64px)] font-semibold leading-[1.05] text-[#1b2330]">
            Harsha Peddinti
          </h1>
          <p className="font-ui text-[17px] text-ashen">
            Product designer who builds · <LocalTime /> in Bengaluru
          </p>
        </div>
        <div className="flex max-w-[620px] flex-col gap-5 font-ui text-[19px] leading-[1.6] text-[#2e3a4a]">
          <p>
            For 9 years I have helped teams at{" "}
            <HoverCard href="https://www.mesh.ai" title="Mesh.ai" meta="Lead Product Designer · 2022 – now" logo="/mesh.jpg" body="Performance reviews, engagement and people analytics for HR teams. I lead design across the product.">
              Mesh.ai
            </HoverCard>
            ,{" "}
            <HoverCard href="https://hypersonix.ai" title="Hypersonix.ai" meta="Senior Product Designer · 2020 – 2022" logo="/hypersonix.jpg" body="AI analytics that helps retail and e-commerce teams price and plan.">
              Hypersonix
            </HoverCard>{" "}
            and{" "}
            <HoverCard href="https://www.nearbuy.com" title="Nearbuy.com" meta="Graphic Designer · 2017 – 2018" logo="/nearbuy.jpg" body="Deals on local food, spas and experiences across India.">
              Nearbuy
            </HoverCard>{" "}
            make things better for the people who use them, usually joining when the product is still bare bones.
          </p>
          <p>
            I learnt by copying. Interfaces, illustrations, anything on a screen, rebuilt until the copy stopped being a
            copy. Baudrillard called that a{" "}
            <HoverCard title="Simulacra and Simulation" meta="Jean Baudrillard · 1981" body="A copy so faithful it stops pointing back at the original and becomes real in its own right.">
              simulacrum
            </HoverCard>
            : a copy so faithful it becomes its own thing. It is still how I work, and I still write the code for what I
            design.
          </p>
          <p>
            Off the clock: I built my own PC, played{" "}
            <HoverCard title="LXG Chennai" meta="Competitive Overwatch" body="I played Overwatch competitively for LXG Chennai, back when I was good at it.">
              Overwatch for LXG Chennai
            </HoverCard>{" "}
            back when I was good at it, and lately I am deep into custom keyboards.
          </p>
          <p>
            I trust instinct. If something here resonates, reach me on{" "}
            <HoverCard href="https://www.linkedin.com/in/harshapeddinti/" title="Harsha Peddinti" meta="LinkedIn · harshapeddinti" logo="/about/styles/photo.webp" body="Product designer who builds. Work history, recommendations and the occasional post.">
              LinkedIn
            </HoverCard>{" "}
            or{" "}
            <HoverCard href="https://x.com/omgsumbody" title="Harsha" meta="X · @omgsumbody" logo="/about/styles/photo.webp" body="Chronically online. Design, games and whatever I am building this week.">
              X
            </HoverCard>
            .
          </p>
        </div>
        <Link href="/home-v2h" className="font-ui text-[15px] text-ashen hover:text-[#1b2330]">
          ← Back home
        </Link>
      </div>
      <PortraitShift styles={STYLES} className="aspect-square w-full" />
    </section>
  );
}
