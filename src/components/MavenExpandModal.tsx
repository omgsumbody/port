import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { triggerTransition } from './PageTransition';

const PercentageCounter = dynamic(() => import('./PercentageCounter'), { ssr: false });
const PercentageCounterMaven = dynamic(() => import('./PercentageCounterMaven'), { ssr: false });

interface MavenExpandModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardIndex: number;
    cardInfo?: {
        title: string;
        body: string;
    };
}

export default function MavenExpandModal({ isOpen, onClose, cardIndex, cardInfo }: MavenExpandModalProps) {
    const router = useRouter();

    const handleNavigate = () => {
        document.body.style.overflow = 'unset';
        onClose();
        triggerTransition('/review-settings');
    };

    const [bottomGifKey, setBottomGifKey] = useState(Date.now());

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setBottomGifKey(Date.now());
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] overflow-y-auto backdrop-blur-sm pt-[138px] pb-[138px] flex justify-center px-8 bg-[url('/assets/Landing/cards%20exp/modalbg.svg')] bg-cover bg-center bg-fixed"
        >
            {/* Modal Container */}
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like curve
                className="relative w-full max-w-[1486px] bg-white rounded-[24px] border border-grey-00 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] p-[48px] h-fit mx-auto"
            >
                {/* Close Button Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-[48px] right-[48px] w-[48px] h-[48px] flex items-center justify-center rounded-full bg-grey-10 hover:bg-grey-20 transition-colors"
                    aria-label="Close modal"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey-100">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Header Section */}
                <div className="flex justify-between items-start mb-[48px]">
                    <div className="max-w-[600px]">
                        <h2 className="font-inter font-medium text-[32px] leading-[46px] text-grey-100 mb-[20px]">
                            Elevating Performance Management with AI-Driven Context
                        </h2>
                        <p className="max-w-[472px] font-inter font-normal text-[16px] leading-[24px] text-grey-80 mb-[32px]">
                            Integrating Maven into the reviews and engagement modules transforms generic feedback into actionable, evidence-based insights. By enforcing structured frameworks and tonality control, Maven completely eliminates the friction of drafting reviews, fostering a positive work environment while radically accelerating the entire performance cycle for enterprise teams.
                        </p>
                        {/* Sample Buttons aligned horizontally */}
                        <div className="flex gap-4">
                            <div className="h-[48px] px-6 flex items-center justify-center bg-[#FEEBCB] rounded-[52px] font-inter font-regular text-[16px] leading-[24px] text-[#990C02] gap-2">
                                <Image src="/Star.svg" alt="star" width={20} height={20} />
                                Coming soon
                            </div>
                        </div>
                    </div>

                    {/* Stats List Text */}
                    <div className="flex flex-col gap-[12px] mt-[12px] mr-[192px] min-w-[340px] shrink-0">
                        <div className="flex items-start gap-[6px]">
                            <Image src="/assets/Landing/cards exp/statlistup.svg" alt="up" width={18} height={18} className="shrink-0 mt-1" />
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                60% reduction in time to complete feedback forms.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            <Image src="/assets/Landing/cards exp/statlistup.svg" alt="up" width={18} height={18} className="shrink-0 mt-1" />
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                215% improvement in qualitative feedback quality.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            <Image src="/assets/Landing/cards exp/statlistup.svg" alt="up" width={18} height={18} className="shrink-0 mt-1" />
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                $5,000 saved per manager in operational efficiency.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            <Image src="/assets/Landing/cards exp/statlistd.svg" alt="down" width={18} height={18} className="shrink-0 mt-1" />
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                0% tolerance for vague, unsubstantiated review ratings.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero Media Boxes Matrix */}
                <div className="flex gap-[24px] mb-[48px]">
                    {/* Big Left Box */}
                    <div className="relative overflow-hidden w-[683px] h-[524px] rounded-xl flex items-center justify-center bg-[url('/assets/Landing/cards%20exp/modalbg.svg')] bg-cover bg-center bg-fixed">
                        <div className="absolute inset-0 bg-grey-00/[0.18]"></div>
                        <span className="relative z-10 text-[#3D495A] font-medium text-center">Placeholder: Hero Image Section with Dashboard Previews</span>
                    </div>
                    {/* Stacked Right Boxes */}
                    <div className="flex flex-col gap-[24px]">
                        <div className="relative overflow-hidden w-[683px] h-[250px] rounded-xl flex items-center justify-center bg-[url('/assets/Landing/cards%20exp/modalbg.svg')] bg-cover bg-center bg-fixed">
                            <div className="absolute inset-0 bg-grey-00/[0.18]"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center gap-[6px]">
                                <PercentageCounterMaven isOpen={isOpen} />
                            </div>
                        </div>
                        <div className="relative overflow-hidden w-[683px] h-[250px] rounded-xl flex items-center justify-center bg-[url('/assets/Landing/cards%20exp/modalbg.svg')] bg-cover bg-center bg-fixed">
                            <div className="absolute inset-0 bg-grey-00/[0.18]"></div>
                            <span className="relative z-10 text-[#3D495A] font-medium text-center">Placeholder (Bottom Right Media)</span>
                        </div>
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="grid grid-cols-3 gap-[24px] mb-[36px]">
                    {[
                        {
                            title: "Evidence-Based Objectivity:",
                            text: "Eliminate bias and vague comments by enforcing a strict Context, Observation, Impact, and Next steps (COIN) framework, ensuring every piece of feedback is intentional and data-backed.",
                            contentPaddingClass: "pt-[20px] pb-[20px] pr-[20px] pl-0",
                            iconSrc: "/assets/Landing/cards exp/h1.svg"
                        },
                        {
                            title: "Calibrated Fairness:",
                            text: "Bridge performance perspectives through an AI engine that cross-analyzes qualitative text against quantitative ratings, instantly surfacing subtle misalignments or unsubstantiated high scores.",
                            contentPaddingClass: "p-[20px]",
                            iconSrc: "/assets/Landing/cards exp/h2.svg"
                        },
                        {
                            title: "Continuous Impact:",
                            text: "Move past mundane 2-3 word comments. Maven assists managers in writing meaningful praise and constructive advice that actively aligns with core company values.",
                            contentPaddingClass: "pt-[20px] pb-[20px] pl-[20px] pr-0",
                            iconSrc: "/assets/Landing/cards exp/h3.svg"
                        }
                    ].map((item, index) => (
                        <div
                            key={`highlight-${index}`}
                            className={`flex flex-col gap-4 ${item.contentPaddingClass}`}
                        >
                            <img src={item.iconSrc} alt={`Highlight Icon ${index + 1}`} className="w-[32px] h-[32px] object-contain shrink-0" />
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80">
                                <strong>{item.title}</strong> {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Features Section Header */}
                <h3 className="font-inter font-medium text-[24px] leading-[46px] text-grey-100 mb-[24px]">
                    Features
                </h3>

                {/* Features Boxes */}
                <div className="grid grid-cols-3 gap-[24px] mb-[64px]">
                    {[
                        {
                            title: "Intelligent Drafting & Tonality Control",
                            text: "Leverage generative AI to instantly draft, rephrase, and adjust the tone of reviews. Empower employees to deliver insightful feedback tailored to resonate with their peers, drastically speeding up the review process."
                        },
                        {
                            title: "COIN Feedback Analysis",
                            text: "Ensure high-quality communication by running inputs through Maven’s rigorous text analysis. The AI automatically grades feedback against four critical pillars: Context, Observation, Impact, and Next steps, prompting users to re-evaluate weak entries."
                        },
                        {
                            title: "Guided Action Plans",
                            text: "Transform completed performance reviews into actionable steps. Maven generates tailored post-review coaching plans and development goals, giving managers concrete, intentional discussion points for their 1:1s."
                        }
                    ].map((item, index) => (
                        <div key={`feature-${index}`} className="flex flex-col w-full">
                            <div className="w-full h-[300px] bg-red-50 rounded-xl flex items-center justify-center border border-red-100 mb-[12px]">
                                <span className="text-red-300 font-medium">Feature Media Placeholder ({index + 1})</span>
                            </div>
                            <h4 className="font-inter font-medium text-[18px] leading-[26px] text-grey-100 mb-2">{item.title}</h4>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Divider 1 */}
                <div className="w-full h-[1px] bg-grey-00 mb-[74px]"></div>

                {/* Testimonial Section */}
                <div className="flex items-center justify-center w-full mb-[74px]">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-[32px] flex items-center justify-center text-[24px] font-bold text-grey-100">
                            Dana
                        </div>

                        <blockquote className="w-[914px] font-inter font-medium text-[20px] leading-[32px] text-grey-70 mb-[32px]">
                            "Dana integrated Mesh's suite of AI-powered features, including AI rephrasing and analysis, into its performance review process. This saved them 60% time per form, significantly improving efficiency. The platform also achieved a 215% improvement in feedback quality and saved up to $5,000 per manager, enabling managers to focus on strategic tasks."
                        </blockquote>

                        <p className="font-inter font-medium text-[20px] leading-[32px] text-grey-80 mb-[32px]">
                            — Dana (Enterprise Client)
                        </p>

                        <a
                            href="https://www.mesh.ai/case-studies-copy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex w-max items-center font-inter font-medium text-[16px] text-[#990C02] hover:text-[#661900] transition-colors decoration-transparent"
                        >
                            Read the featured story
                            <div className="relative w-[14px] h-[14px] ml-[8px] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-[2px]">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                                    <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                    <path d="M7 3L11 7L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 7H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Divider 2 */}
                <div className="w-full h-[1px] bg-grey-00 mb-[74px]"></div>

                {/* Footer CTA Section */}
                <div className="flex flex-col items-center justify-center w-full pb-[64px]">
                    <div className="h-[48px] px-6 flex items-center justify-center bg-[#FEEBCB] rounded-[52px] font-inter font-regular text-[16px] leading-[24px] text-[#990C02] gap-2">
                        <Image src="/Star.svg" alt="star" width={20} height={20} />
                        Coming soon
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
