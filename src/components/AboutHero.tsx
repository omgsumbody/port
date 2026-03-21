export default function AboutHero() {
    return (
        <section className="w-full flex justify-center bg-white overflow-hidden">
            <div className="relative w-full max-w-[1920px] h-[624px]">
                {/* Main Heading */}
                <h1 className="absolute left-[76px] top-[76px] w-[685px] font-inter font-extrabold text-[64px] leading-[77px] text-[#192434] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    Making things better for the people,
                </h1>
                
                {/* Subheading */}
                <p className="absolute left-[76px] top-[274px] w-[685px] font-inter font-normal text-[24px] leading-[39px] text-[#3D495A]">
                    bringing design and leadership expertise to startups in SaaS, Ai, HR Tech and Healthcare.
                </p>
                
                {/* Image Placeholder */}
                <div className="absolute left-[920px] top-[76px] w-[924px] h-[472px] bg-[#F2F2F2]">
                    {/* Image will be injected here later */}
                </div>
            </div>
        </section>
    );
}
