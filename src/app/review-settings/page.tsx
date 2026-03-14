"use client";

import Link from 'next/link';
import { NavItem } from '@/components/LeftNavbar';
import SmartTextBlock from '@/components/SmartTextBlock';
import { useEffect, useState, useRef } from 'react';

const SECTIONS = [
    'Overview',
    'The Challenge',
    'Goals',
    'Kickoff & Early Insights',
    'Research & Discovery',
    'Strategy',
    'Proposed Solutions & MVPs',
    'Design & Iteration',
    'Development & Implementation',
    'The Launch',
    'Impact & Metrics',
    'Challenges & Learnings',
    'Future Evolution'
];

export default function ReviewSettings() {
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
                <div className="h-[64px] flex items-center">
                    <Link 
                        href="/" 
                        className="ml-[28px] w-[32px] h-[32px] bg-red-100 rounded flex items-center justify-center text-red-500 font-bold hover:bg-red-200 transition-colors"
                        aria-label="Home"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
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
            <main className="flex-1 relative">
                {SECTIONS.map((section) => (
                    <section 
                        key={section} 
                        id={section}
                        className="h-[670px] w-full border border-grey-60 p-[48px] flex flex-col"
                    >
                        <h2 className="font-inter font-medium text-[48px] leading-[46px] text-grey-100 mb-[40px]">
                            {section}
                        </h2>
                        {section === 'The Challenge' && (
                            <SmartTextBlock 
                                originalText={`Say you are a Head of Resources/HR manager trying to create performance review for your organization's employees. Current platform's review cycle creation settings were uncategorized and does not provide the freedom to your HR managers create a cycle according to your organizations philosophy. This was also taking a toll on our CSMs as they need to babysit the cycle creation process every time an organization starts their custom employee performance review.`}
                                summaryText={`The platform's rigid review settings limited HR managers and burdened our CSMs with babysitting custom performance reviews.`}
                            />
                        )}
                        {section === 'Kickoff & Early Insights' && (
                            <SmartTextBlock 
                                originalText={`I started off with understanding the module by having calls with our PM and reading through the PRD he has prepared for the project. After collecting my thoughts and preparing a initial mind map of my understanding, i went into a demo accounts and started using the existing platform and user testing the flow from different user perspectives to note down the pain points.\n\nEarly insights were, it was painstaking process to create the Review cycle and majority of the settings were incomprehensible for a first time user. My sentiment was to get through to the end of review cycle somehow.`}
                                summaryText={`I began by aligning with the PM, reviewing the PRD, and mapping my initial understanding before testing the existing flow in demo accounts from multiple user perspectives.\n\nEarly insights showed that the review cycle setup was tedious and unclear, leaving first-time users focused solely on completing the process rather than understanding it.`}
                            />
                        )}
                        {section === 'Research & Discovery' && (
                            <SmartTextBlock 
                                originalText={`Through these i drew similarities between our product and competitors. Thus our product leader and me added new features and grouped our existing settings based on user requirement and priority of sprint release. I leveraged Ai to synthesize all user feedback on the Reviews module, strengthening and validating the insights we had already developed.\n\nLater calls were done with CEO and Co-founder (People Science Leader) for understanding the business acumen of Reviews and how business think for desirability of the product. After this we went on multiple user interviews with CSMs for understanding the various end-users mentality and business philosophy by which their Review Cycles were created. User interviews were also conducted with multiple HR leaders in presence of Product Leader and GTM head.`}
                                summaryText={`I collaborated with leadership and leveraged AI to analyze competitor and user data, directly shaping new features and prioritizing sprint releases based on deep end-user and business insights.`}
                            />
                        )}
                        {section === 'Proposed Solutions & MVPs' && (
                            <SmartTextBlock 
                                originalText={`• A new feature called Views was created to save employees based on an array of filters, which are categorized below.\n  Employee Filters: Names & Teams, Level, Function, Roles, Location, Joining Date, DoB, and Ethnicity.\n• Performance Filters: Goals, 1:1s, Competencies, Reviews, and Engagement.\n  Know more about Views here.\n• Calibration and score settings for each specific View or the overall Review Cycle were added.\n• A Plug-and-play methodology with detailed explanations and conversational search were proposed.\n• A Timeline feature for visualization and sharing with company leaders was proposed.\n• A new Review Cycle creation flow was added to accommodate new features and clear leftover UX debt discovered during research and previously deferred.`}
                                summaryText={`I introduced a plug-and-play, modular review cycle system with prefilled configurations, filter-based Views, configurable calibration and scoring, timeline visualization for leadership, and a redesigned creation flow to support scalability while addressing identified UX debt.`}
                            />
                        )}
                        {section === 'Design & Iteration' && (
                            <div className="flex flex-col gap-8 w-full">
                                <SmartTextBlock 
                                    originalText={`Later I had multiple syncs with Founders, Design, Product, and Tech Leaders to finalize and start ahead with high-fidelity flows.\nFounders sync came to an end with deciding a flow.\nProduct Leaders sync was conducted to notify the changes being made to the current product, which would affect their respective modules. After getting a green light from all Product Leaders and accommodating their requests, I moved on to sync with Tech Leaders.\nIn sync with the Tech Lead, it was discovered that time to release would significantly decrease if we move the conversational search to UX debt and pick up the project when feasible.`}
                                    summaryText={`I aligned with Founders, Design, Product, and Tech leaders to finalize high-fidelity flows, secure cross-module approval, and optimize time to release by deferring conversational search as UX debt.`}
                                />
                                <SmartTextBlock 
                                    originalText={`A plug-and-play methodology which is used by medium to small scale companies, here we gathered data from multiple review cycles created from our customer base. We optimized the gathered data to fit most-to-least used setting options depending on the frequency of reviews conducted.\n\nThus, an optimized set of settings was born which were already pre-filled. A whopping twelve-page process with ginormous effort was reduced to four pages.`}
                                    summaryText={`I designed a plug-and-play review cycle creation model for small and mid-sized companies by optimizing real customer data into prefilled, frequency-based settings, reducing a twelve-page flow to four pages.`}
                                />
                            </div>
                        )}
                        {section === 'Development & Implementation' && (
                            <SmartTextBlock 
                                originalText={`A page-by-page development cycle is established with backend working their APIs ahead of time with the high-fidelity wireframes, and front-end started as soon as stakeholders gave final approval of the design.\nI laid out page-by-page flow sections in Figma, which were handed off to developers, with detailed walkthrough syncs conducted throughout the design cycle to facilitate developer feasibility and bandwidth planning.\nNotes with detailed explanations and queries raised during daily syncs were also documented for better understanding.`}
                                summaryText={`I established a page-by-page development workflow with early backend API alignment, structured Figma handoffs, continuous design–engineering syncs, and detailed documentation to ensure feasibility, clarity, and execution efficiency.`}
                            />
                        )}
                        {section === 'The Launch' && (
                            <SmartTextBlock 
                                originalText={`We had a three-phase release plan set up at the start of the 2024 calendar year. This project was released into phase 2 of releases. A newsletter release was set up with all the new changes and how this project would affect the existing/on-going review cycles of the business.\nCSMs also held their new experience onboarding calls with HR managers of most businesses.\nWith this, there were two instances of release created for businesses: one without any on-going review cycles and one with on-going review cycles. Once a green light was given from businesses with on-going review cycles, a second-phase release was made.`}
                                summaryText={`I executed a phased rollout under the 2024 three-phase release plan, supported by stakeholder communication, CSM-led onboarding, and dual release paths to safely transition both new and ongoing review cycles by businesses.`}
                            />
                        )}
                    </section>
                ))}
            </main>
        </div>
    );
}
