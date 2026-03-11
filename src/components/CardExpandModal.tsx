import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CardExpandModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardInfo: {
        title: string;
        body: string;
    };
}

export default function CardExpandModal({ isOpen, onClose, cardInfo }: CardExpandModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
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
            className="fixed inset-0 z-[100] bg-black/12 overflow-y-auto backdrop-blur-sm pt-[138px] pb-[138px] flex justify-center px-8"
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
                        <h2 className="font-inter font-medium text-[28px] leading-[46px] text-grey-100 mb-[20px]">
                            {cardInfo.title}
                        </h2>
                        <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 mb-[32px]">
                            {cardInfo.body}
                        </p>
                        {/* Sample Buttons aligned horizontally */}
                        <div className="flex gap-4">
                            <button className="h-[48px] px-6 flex items-center justify-center bg-grey-10 rounded-full font-inter font-regular text-[16px] leading-[24px] text-grey-80 hover:bg-grey-20 transition-colors">
                                Read full case study
                            </button>
                            <button className="h-[48px] px-6 flex items-center justify-center bg-grey-10 rounded-full font-inter font-regular text-[16px] leading-[24px] text-grey-80 hover:bg-grey-20 transition-colors">
                                Try it now
                            </button>
                        </div>
                    </div>

                    {/* Stats List Text, positioned 120px left from close button right edge */}
                    {/* The close button is right-[48px] + w-[48px] = 96px from the right edge. */}
                    {/* To align 120px left of that (which would be 96+120=216px from the right container edge), we can use an absolute container or let flex handle it width a flexible width. I'm taking off the rigid max-w so the content doesn't truncate, and applying pr-[120px] on the flex element. */}
                    <div className="flex flex-col gap-[12px] mt-[12px] mr-[72px] min-w-[340px] shrink-0">
                        <div className="flex items-start gap-[6px]">
                            {/* Icon Placeholder */}
                            <div className="w-[18px] h-[18px] bg-gray-200 shrink-0 flex items-center justify-center mt-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                35% faster creation of review cycles.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            {/* Icon Placeholder */}
                            <div className="w-[18px] h-[18px] bg-gray-200 shrink-0 flex items-center justify-center mt-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                40% reduction in abandonment/drop-off rates.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            {/* Icon Placeholder */}
                            <div className="w-[18px] h-[18px] bg-gray-200 shrink-0 flex items-center justify-center mt-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                17% improvement in qualitative user feedback.
                            </p>
                        </div>
                        <div className="flex items-start gap-[6px]">
                            {/* Icon Placeholder */}
                            <div className="w-[18px] h-[18px] bg-gray-200 shrink-0 flex items-center justify-center mt-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10" /></svg>
                            </div>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 break-words">
                                8% increase in total review cycles created.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero Media Boxes Matrix */}
                {/* Big Box (683x524) on Left, Two Smaller Boxes (683x250) stacked on right with 24px gap */}
                <div className="flex gap-[24px] mb-[48px]">
                    {/* Big Left Box */}
                    <div className="w-[683px] h-[524px] bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                        <span className="text-red-300 font-medium">Hero Media Main (683x524)</span>
                    </div>
                    {/* Stacked Right Boxes */}
                    <div className="flex flex-col gap-[24px]">
                        <div className="w-[683px] h-[250px] bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                            <span className="text-red-300 font-medium">Top Right Media (683x250)</span>
                        </div>
                        <div className="w-[683px] h-[250px] bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                            <span className="text-red-300 font-medium">Bottom Right Media (683x250)</span>
                        </div>
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="grid grid-cols-3 gap-[24px] mb-[36px]">
                    {[
                        {
                            text: "Modular & Plug-and-Play Control: Categorize and redesign current settings to offer both plug-and-play simplicity and deep modular control.",
                            contentPaddingClass: "pt-[20px] pb-[20px] pr-[20px] pl-0"
                        },
                        {
                            text: "Organizational Alignment: Achieve a creation cycle philosophy catered to every small, medium, large organization's needs.",
                            contentPaddingClass: "p-[20px]"
                        },
                        {
                            text: "Friction Reduction: Decrease drop-off rates while helping HR managers build better, faster performance Review Cycles.",
                            contentPaddingClass: "pt-[20px] pb-[20px] pl-[20px] pr-0"
                        }
                    ].map((item, index) => (
                        <div
                            key={`highlight-${index}`}
                            // Removed container padding as requested, padding relies purely on content limits or spacing out child elements
                            className={`flex flex-col gap-4 border border-dashed border-gray-200 rounded-lg ${item.contentPaddingClass}`}
                        >
                            {/* Icon Box within the card */}
                            <div className="w-[32px] h-[32px] bg-gray-200 rounded flex items-center justify-center shrink-0">
                                {/* SVG Placeholder */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                            </div>
                            {/* Highlight Body Text */}
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80">
                                {item.text}
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
                    {/* 3 identical feature boxes */}
                    {[1, 2, 3].map((item) => (
                        <div key={`feature-${item}`} className="flex flex-col w-full">
                            <div className="w-full h-[300px] bg-red-50 rounded-xl flex items-center justify-center border border-red-100 mb-[18px]">
                                <span className="text-red-300 font-medium">Feature Media ({item})</span>
                            </div>
                            <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80">
                                Automated Departmental Scaling: Configure a core review template with 'Views' and instantly push localized rules across your entire org chart with zero manual replication.
                            </p>
                        </div>
                    ))}
                </div>

                {/* Divider 1 */}
                <div className="w-full h-[1px] bg-grey-00 mb-[74px]"></div>

                {/* Testimonial Section */}
                <div className="flex items-center justify-center w-full mb-[74px]">
                    <div className="flex flex-col items-center text-center">
                        {/* Logo Box */}
                        <div className="w-[176px] h-[48px] bg-gray-100 rounded-lg flex items-center justify-center mb-[32px]">
                            <span className="text-gray-500 font-bold text-xl">Groww Logo</span>
                        </div>

                        {/* Quote */}
                        <blockquote className="w-[914px] font-inter font-medium text-[20px] leading-[32px] text-grey-70 mb-[32px]">
                            "By leveraging Mesh's redesigned platform, Groww successfully doubled its talent density. The improved performance review and calibration processes allowed us to elevate our high-performer density from 5% to 15%. This transformation significantly enhanced our workforce effectiveness, driving highly efficient, data-driven, and fundamentally fair outcomes."
                        </blockquote>

                        {/* Attribution */}
                        <p className="font-inter font-normal text-[16px] leading-[24px] text-grey-80 mb-[32px]">
                            — Groww (Fast-growing Fintech)
                        </p>

                        {/* Action CTA */}
                        <button className="h-[48px] px-6 flex items-center justify-center bg-red-50 text-red-400 rounded-full font-inter font-medium text-[16px] hover:bg-red-100 transition-colors">
                            Read this featured story
                        </button>
                    </div>
                </div>

                {/* Divider 2 */}
                <div className="w-full h-[1px] bg-grey-00 mb-[74px]"></div>

                {/* Footer CTA Section */}
                <div className="flex flex-col items-center justify-center w-full pb-[100px]">
                    <h2 className="font-inter font-medium text-[48px] leading-[46px] text-grey-100 mb-[40px]">
                        Get started with full case study
                    </h2>
                    <button className="h-[48px] px-8 flex items-center justify-center bg-red-100 text-red-500 rounded-lg font-inter font-medium text-[16px] hover:bg-red-200 transition-colors">
                        Read full case study
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
