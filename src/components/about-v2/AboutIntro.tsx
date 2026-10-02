"use client";

import { useEffect, useState } from "react";
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
    // Same side padding as the nav, so the text edges line up with the logo and the Resume button.
    <section className="w-full px-6 pt-16 pb-20 font-ui text-[16px] leading-[1.6] text-[#2e3a4a] lg:px-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-perfectly-nineties text-[24px] font-semibold leading-[1.1] text-[#1b2330]">
          Harsha Peddinti
        </h1>
        <p className="text-[15px] leading-[1.3] text-ashen">
          Product designer who builds · <LocalTime /> in Bengaluru
        </p>
      </div>
      {/* Two paragraphs either side of the portrait. Both blocks stretch to the same height, so
          their first and last lines sit level. */}
      <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_240px_1fr] lg:items-stretch lg:gap-14">
        <div className="flex flex-col justify-between gap-5">
          <p>
            I grew up on a computer with no internet, so the software was the toy. Slideshows, fonts, floor plans: I
            pushed every tool until it ran out of things to show me.
          </p>
          <p>
            I learnt design by copying. In{" "}
            <HoverCard title="Simulacra and Simulation" meta="Jean Baudrillard · 1981" body="How copies drift from what they copy, in four stages, until the copy needs no original and becomes real in its own right.">
              Simulacra and Simulation
            </HoverCard>
            , Jean Baudrillard follows a copy as it drifts from its source: it starts as a faithful reflection and
            ends with no original at all, true only to itself. My work takes the same road. It begins as imitation
            and ships as its own thing, and I still write the code for what I design.
          </p>
        </div>
        <PortraitShift styles={STYLES} className="aspect-square w-[240px] self-center lg:w-full" />
        <div className="flex flex-col justify-between gap-5 lg:text-right lg:[&_.hovercard]:right-0 lg:[&_.hovercard]:left-auto">
          <p>
            Nine years at{" "}
            <HoverCard href="https://www.nearbuy.com" title="Nearbuy.com" meta="Graphic Designer · 2017 – 2018" logo="/nearbuy.jpg" body="Deals on local food, spas and experiences across India.">
              Nearbuy
            </HoverCard>
            ,{" "}
            <HoverCard href="https://hypersonix.ai" title="Hypersonix.ai" meta="Senior Product Designer · 2020 – 2022" logo="/hypersonix.jpg" body="AI analytics that helps retail and e-commerce teams price and plan.">
              Hypersonix
            </HoverCard>{" "}
            and{" "}
            <HoverCard href="https://www.mesh.ai" title="Mesh.ai" meta="Lead Product Designer · 2022 – now" logo="/mesh.jpg" body="Performance reviews, engagement and people analytics for HR teams. I lead design across the product.">
              Mesh.ai
            </HoverCard>
            , always joining while the product was bare bones and staying until people relied on it. The hardest
            part was never the screens. It was getting executives, product and engineering to want the same thing.
          </p>
          <p>
            Earlier I played{" "}
            <HoverCard title="LXG Chennai" meta="Competitive Overwatch" body="I played Overwatch competitively for LXG Chennai, back when I was good at it.">
              Overwatch for LXG Chennai
            </HoverCard>
            , where you have no time to think, only to act on instinct. Design under pressure is the same, and it is
            where I do my best work. I have also been online since before it was a good idea, which is why I know
            things I have no reason to know.
          </p>
        </div>
      </div>
      {/* One line across the full width; on wide screens it stretches edge to edge. */}
      <p className="mt-10 min-[1440px]:whitespace-nowrap min-[1440px]:[text-align-last:justify] lg:[&_.hovercard]:right-0 lg:[&_.hovercard]:left-auto">
        You already know whether we would work well together. Trust that instinct, the way I trust mine, and say hello
        on{" "}
        <HoverCard href="https://www.linkedin.com/in/harshapeddinti/" title="Harsha Peddinti" meta="LinkedIn · harshapeddinti" logo="/about/styles/photo.webp" body="Product designer who builds. Work history, recommendations and the occasional post.">
          LinkedIn
        </HoverCard>{" "}
        or{" "}
        <HoverCard href="https://x.com/omgsumbody" title="Harsha" meta="X · @omgsumbody" logo="/about/styles/photo.webp" body="Chronically online. Design, games and whatever I am building this week.">
          X
        </HoverCard>{" "}
        before you talk yourself out of it.
      </p>
    </section>
  );
}
