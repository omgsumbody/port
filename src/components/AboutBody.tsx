"use client";

import PixelRevealHero from "@/components/PixelRevealHero";

const experiences = [
    { 
        company: "Mesh.ai", 
        subtitle: "Jun 2022 - Present · 3 yrs 10 mos",
        role: "Lead Product Designer",
        logo: "/mesh.jpg"
    },
    { 
        company: "Hypersonix.ai", 
        subtitle: "Feb 2020 - Jun 2022 · 2 yrs 5 mos",
        role: "Senior Product Designer",
        logo: "/hypersonix.jpg"
    },
    { 
        company: "Hypersonix.ai", 
        subtitle: "Feb 2020 - Jun 2022 · 2 yrs 5 mos",
        role: "Product Designer",
        logo: "/hypersonix.jpg"
    },
    { 
        company: "Zealth",
        exitedTo: "(exited to Findem.ai)",
        subtitle: "Aug 2018 - Feb 2020 · 1 yr 7 mos",
        role: "Product Designer",
        logo: "/zealth.jpg"
    },
    { 
        company: "Nearbuy.com", 
        subtitle: "Sep 2017 - Aug 2018 · 1 yr",
        role: "Graphic Designer",
        logo: "/nearbuy.jpg"
    },
    { 
        company: "Lincode Labs", 
        subtitle: "Dec 2017 - Jan 2018 · 2 mos",
        role: "Frontend Dev",
        logo: "/lincodelabs.jpg"
    },
];

export default function AboutBody() {
    return (
        <section className="w-full flex justify-center bg-white relative pt-12 pb-12">
            <div className="w-full max-w-[1788px] flex flex-row items-stretch justify-between">

                {/* Left Column — Gradient Canvas */}
                <div className="w-[865px] flex flex-col items-start gap-[10px] self-stretch">
                    <h2 className="text-[#3D495A] font-inter font-normal text-[18px] leading-[22px]">
                        Professional
                    </h2>
                    <div className="w-full flex-1 relative overflow-hidden bg-white rounded-md">
                        <PixelRevealHero hideContent />
                    </div>
                </div>

                {/* Right Column — Intro Text + Experience Cards */}
                <div className="w-[923px] flex flex-col items-start gap-[32px]">

                    {/* Intro Paragraph */}
                    <p className="w-full font-inter font-normal text-[18px] leading-[30px] text-[#3D495A]">
                        With over 8 years of experience, I&apos;ve had the privilege of helping companies like Mesh, Hypersonix,
                        and Nearbuy through design. I&apos;m an avid pc enthusiast (built my own), washed up video game pro
                        (played Overwatch for LXG Chennai), lately, I&apos;m diving into the world of custom keyboard building.
                        I believe in following your instincts, so if something here resonates with you, feel free to reach out.
                    </p>

                    {/* Experience Cards */}
                    <div className="w-full flex flex-col">
                        {experiences.map((exp, index) => (
                            <div
                                key={index}
                                className="w-full flex flex-row items-center py-[24px] pr-[10px] gap-[24px] border-b border-[#DADCDE] hover:border-grey-40 transition-colors duration-300 group cursor-pointer"
                            >
                                {/* Logo */}
                                <div className="w-[72px] h-[72px] bg-[#F3F3F3] shrink-0 overflow-hidden relative rounded-md">
                                    <img src={exp.logo} alt={`${exp.company} logo`} className="w-full h-full object-cover" />
                                </div>

                                {/* Company Info */}
                                <div className="w-[396px] flex flex-col gap-[8px]">
                                    <h3 className="font-inter font-normal text-[24px] leading-[32px] text-[#3D495A] flex items-center gap-[8px]">
                                        {exp.company}
                                        {exp.exitedTo && (
                                            <span className="text-[16px] leading-[24px] text-[#3D495A]">
                                                {exp.exitedTo}
                                            </span>
                                        )}
                                    </h3>
                                    <span className="font-inter font-normal text-[18px] leading-[24px] text-[#3D495A]">
                                        {exp.subtitle}
                                    </span>
                                </div>

                                {/* Role Info */}
                                <div className="w-[396px] flex flex-col gap-[4px]">
                                    <h4 className="font-inter font-normal text-[24px] leading-[32px] text-[#3D495A]">
                                        {exp.role}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
