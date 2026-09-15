"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { NavItem } from '@/components/LeftNavbar';
import SectionTitle from '@/components/SectionTitle';

const SECTIONS = [
    'Overview'
];

export default function MeshAI() {
    const [activeSection, setActiveSection] = useState(SECTIONS[0]);
    const isManualScrolling = useRef(false);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Using IntersectionObserver to detect which section is in view
        observer.current = new IntersectionObserver((entries) => {
            if (isManualScrolling.current) return;

            // Iterate and find entries that are passing the viewport near top threshold
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            root: null,
            // Offset logic: triggers when element crosses near top [10% to 50% from top of screen]
            rootMargin: '-10% 0px -60% 0px',
            threshold: 0
        });

        SECTIONS.forEach(section => {
            const el = document.getElementById(section);
            if (el) observer.current?.observe(el);
        });

        return () => {
            observer.current?.disconnect();
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault();
        isManualScrolling.current = true;
        setActiveSection(section);

        const el = document.getElementById(section);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Re-enable observational behavior tracking post scroll (approx 800ms)
            setTimeout(() => {
                isManualScrolling.current = false;
            }, 800);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-white">
            {/* Left sticky navigation */}
            <aside className="w-[256px] h-screen sticky top-0 border-r border-grey-10 shrink-0 bg-white flex flex-col">
                {/* Logo Container - border removed directly below logo container */}
                <div className="h-[96px] flex items-center">
                    <Link
                        href="/"
                        className="ml-[28px] flex items-center hover:opacity-80 transition-opacity"
                        aria-label="Home"
                    >
                        <img
                            src="/logofull.svg"
                            alt="Logo"
                            className="h-[48px] w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Navigation Items (stacked exactly one below the other with no gaps) */}
                <nav className="flex flex-col w-full h-full overflow-y-auto">
                    {SECTIONS.map((section) => (
                        <NavItem
                            key={section}
                            label={section}
                            active={activeSection === section}
                            onClick={(e) => handleNavClick(e, section)}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Page Content - sections added here corresponding strictly to nav items */}
            <main className="flex-1 relative overflow-x-hidden">
                {SECTIONS.map((section) => (
                    <React.Fragment key={section}>
                        <section
                            id={section}
                            className={`flex flex-col items-center w-full ${section === 'Overview' ? '' : 'py-[56px]'}`}
                        >
                            {section === 'Overview' && (
                                <div className="w-full h-[70vh] min-h-[500px] bg-[#fafafa] border-b border-[#E5E7EB] flex items-center justify-center">
                                    {/* Auto-playing Cloudinary embed space */}
                                    <span className="text-[#9CA3AF] font-inter text-sm">Cloudinary Embed Space</span>
                                </div>
                            )}
                            <div className={`flex flex-col items-start w-full max-w-[960px] gap-[12px] ${section === 'Overview' ? 'py-[56px]' : ''}`}>
                                {section === 'Overview' ? (
                                    <>
                                        <SectionTitle title="Mesh AI" />
                                        <p className="text-body-m">Engineering a high-trust AI Co-Pilot for Enterprise Performance Management.</p>

                                        <div className="flex flex-row w-full max-w-[960px] gap-[24px] h-fit">
                                            {[
                                                { value: '~$5k', subtitle: 'Saved per Manager / Year', icon: '/assets/Review settings/up.svg' },
                                                { value: '60%', subtitle: 'Faster Completion Time', icon: '/assets/Review settings/up.svg' },
                                                { value: '215%', subtitle: 'Increase in Feedback Quality', icon: '/assets/Review settings/down.svg' },
                                                { value: '63%', subtitle: 'Initial Adoption Rate', icon: '/assets/Review settings/up.svg' }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex-1 flex flex-col h-[132px] rounded-[12px] bg-[#f5f7f9] overflow-hidden border border-[#D9DCDE]/50 shadow-[0px_0px_2px_0px_rgba(217,220,222,0.4)] p-[20px] justify-start items-start gap-[12px]">
                                                    <div className="flex flex-row items-end">
                                                        <span className="font-inter font-semibold text-grey-50 text-[40px] leading-[1.2em]">
                                                            {stat.value}
                                                        </span>
                                                        <img src={stat.icon} alt="" className="ml-[4px] mb-[4px] shrink-0" />
                                                    </div>
                                                    <div className="font-inter font-normal text-grey-70 text-[14px] tracking-[0.02em] leading-[16px] w-full">
                                                        {stat.subtitle}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-body-r mt-[12px]">
                                            We replaced the intimidating blank text box with a guided AI workflow that cites real employee data. By keeping the manager as the final editor, Mesh AI accelerates the review process by 60% while completely mitigating the risk of AI hallucinations or biased feedback.
                                        </p>

                                        <div className="flex flex-row w-full max-w-[960px] gap-[12px] h-fit mt-[24px]">
                                            <div className="flex flex-col gap-[8px] w-[333px]">
                                                <div className="text-body-m">Team</div>
                                                <div className="text-body-r whitespace-pre-wrap">
                                                    {`6 Developers\n1 Product Leader\n1 Product Designer (Me)`}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-[8px] flex-1">
                                                <div className="text-body-m">Tools</div>
                                                <div className="text-body-r whitespace-pre-wrap">
                                                    {`Figma\nCoda\nMiro`}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-[8px] flex-1">
                                                <div className="text-body-m">Disciplines</div>
                                                <div className="text-body-r whitespace-pre-wrap">
                                                    {`Product Strategy\nExperience Research\nInteraction Design`}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </section>
                    </React.Fragment>
                ))}
            </main>
        </div>
    );
}
