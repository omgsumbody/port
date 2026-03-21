"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import CardExpandModal from "./CardExpandModal";

const fannedCardsData = [
    { title: "Review Settings", body: "Empowering HR with Scalable, Modular Performance Settings", left: 265, top: 258.65, rotate: -4 },
    { title: "Views", body: "Create and save custom analytical views across all Mesh products.", left: 495.76, top: 295.36, rotate: -5 },
    { title: "Mesh Ai(Maven)", body: "Improve the quality and tonality of review feedback.", left: 677.37, top: 229.31, rotate: -1 },
    { title: "Review Home", body: "Home for performance, development, calibration & talent decisions.", left: 912.88, top: 306.66, rotate: 0 },
    { title: "Review Formfilling", body: "A performance feedback form which brings data together from all modules.", left: 1134.9, top: 227, rotate: 2 },
    { title: "Rabbit Design System", body: "Design system used by Mesh organization and products.", left: 1372.9, top: 302, rotate: 2 }
];

const bottomRowSlots = [
    { left: 332, top: 578, rotate: -5 },
    { left: 587, top: 580, rotate: -1 },
    { left: 833, top: 582, rotate: 0 },
    { left: 1060, top: 580, rotate: 2 },
    { left: 1307, top: 578, rotate: 2 }
];

// Inactive slot index for a given card index (skips the active card)
function getSlotIndex(cardIndex: number, activeCard: number): number {
    return fannedCardsData
        .map((_, i) => i)
        .filter(i => i !== activeCard)
        .indexOf(cardIndex);
}

// Reusable hook for 3D tilt effect on hover
function use3DTilt() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useSpring(0, { stiffness: 300, damping: 20 });
    const y = useSpring(0, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normalizedX = (e.clientX - centerX) / rect.width;
        const normalizedY = (e.clientY - centerY) / rect.height;
        x.set(normalizedX);
        y.set(normalizedY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rotateX = useTransform(y, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(x, [-0.5, 0.5], ["-15deg", "15deg"]);

    return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// Sub-component for individual tilted cards (fanned + bottom row states)
function TiltedCard({
    cardInfo,
    onClick,
    layoutId,
    style
}: {
    cardInfo: { title: string; body: string };
    onClick: (e: React.MouseEvent) => void;
    layoutId?: string;
    style?: React.CSSProperties | import("framer-motion").MotionStyle;
}) {
    const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();
    const springTransition = { type: "spring" as const, duration: 0.8, bounce: 0 };

    return (
        <motion.div
            layoutId={layoutId}
            layout
            transition={springTransition}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ rotateX, rotateY, transformPerspective: 1000, ...style }}
            className="w-[272px] h-[290px] flex flex-col items-start p-[24px] gap-[16px] bg-[#FBFCFD] rounded-[12px] border border-[#DADCDE]/60 shadow-[0px_0px_4px_0px_rgba(222,220,217,0.4)] cursor-pointer hover:z-50 hover:-translate-y-4 hover:scale-105 transition-transform duration-300"
        >
            <div className="w-[224px] h-[129px] bg-white shrink-0 rounded-md border border-gray-100" />
            <h3 className="font-inter font-medium text-[20px] leading-[24px] text-[#192434] w-[224px] shrink-0">
                {cardInfo.title}
            </h3>
            <p className="font-inter font-normal text-[16px] leading-[19px] text-[#3D495A] w-[224px]">
                {cardInfo.body}
            </p>
        </motion.div>
    );
}

export default function SandboxMainBodyShowcase() {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
    const [gradientAngle, setGradientAngle] = useState(-126);
    const [syncTick, setSyncTick] = useState(0);

    useEffect(() => {
        const tickInterval = setInterval(() => setSyncTick((prev) => prev + 1), 5000);
        return () => clearInterval(tickInterval);
    }, []);

    const handleCenterMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        setGradientAngle((radians * 180) / Math.PI + 90);
    };

    const springTransition = { type: "spring" as const, duration: 0.8, bounce: 0 };

    return (
        <LayoutGroup>
            <main className="w-full flex flex-col items-center relative">
                <div
                    className="relative w-full max-w-[1920px] h-[898px] mx-auto overflow-visible"
                    onClick={() => { if (activeCard !== null) setActiveCard(null); }}
                >
                    {fannedCardsData.map((cardInfo, index) => {
                        const isCenter = activeCard !== null && index === activeCard;

                        // ── CENTER (HERO) CARD ──────────────────────────────────
                        if (isCenter) {
                            return (
                                <motion.div
                                    key={index}
                                    layoutId={`card-${index}`}
                                    layout
                                    transition={springTransition}
                                    onMouseLeave={() => setGradientAngle(-126)}
                                    onMouseMove={handleCenterMouseMove}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        '--gradient-angle': `${gradientAngle}deg`,
                                        zIndex: 100,
                                        position: "absolute",
                                        left: "calc(50% - 1484px / 2)",
                                        top: "calc(50% - 544px / 2)"
                                    } as React.CSSProperties}
                                    className="bg-[#FCFDFD] border border-grey-00 rounded-[24px] shadow-sm overflow-hidden w-full h-[544px] hover-center-card pointer-events-auto max-w-[1484px]"
                                >
                                    {/* Background Layer */}
                                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[24px] overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {activeCard === 0 ? (
                                                <motion.div
                                                    key="card-bg-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="absolute inset-0 w-full h-full"
                                                >
                                                    <Image
                                                        src="/assets/Landing/cards/card0_bg.svg"
                                                        alt="Background for Card 0"
                                                        fill
                                                        className="object-cover"
                                                        priority
                                                    />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key={`card-bg-${activeCard}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="absolute inset-0 w-full h-full bg-gray-50/20 flex items-center justify-center border border-dashed border-gray-200"
                                                >
                                                    <span className="text-gray-300 font-medium">Card {activeCard} Background</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Foreground Layer — fades content when activeCard changes */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`foreground-${activeCard}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="absolute inset-0 z-10 pointer-events-none"
                                        >
                                            {/* Title */}
                                            <div className="absolute top-[46px] left-[52px] w-[352px] text-[#192434] font-inter font-medium text-[32px] leading-[39px] z-20">
                                                {cardInfo.title}
                                            </div>

                                            {/* Body */}
                                            <div className="absolute top-[97px] left-[52px] w-[352px] text-[#3D495A] font-inter font-normal text-[16px] leading-[19px] z-20">
                                                {cardInfo.body}
                                            </div>

                                            {/* Card-specific content */}
                                            {index === 0 && (
                                                <>
                                                    {/* Left Box (Carousel) */}
                                                    <div className="absolute left-[46px] top-[184px] w-[358px] h-[96px] bg-[#F8F8F8] rounded-xl overflow-hidden shadow-[inset_0_0_4px_0_rgba(0,0,0,0.08)] pointer-events-auto z-[10]">
                                                        <AnimatePresence>
                                                            <motion.div
                                                                key={syncTick}
                                                                initial={{ y: 20, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                exit={{ y: -20, opacity: 0 }}
                                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                                                className="absolute inset-0 w-full h-full flex items-center justify-center"
                                                            >
                                                                <span className="text-gray-500 font-medium">Carousel Item {syncTick % 4}</span>
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Right Box (Scrolling) */}
                                                    <div className="absolute right-[46px] top-[216px] w-[490px] h-[168px] overflow-hidden pointer-events-auto bg-white rounded-xl shadow-sm border border-gray-100 z-[10]">
                                                        <AnimatePresence>
                                                            <motion.div
                                                                key={syncTick}
                                                                initial={{ y: "100%" }}
                                                                animate={{ y: 0 }}
                                                                exit={{ y: "-100%" }}
                                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                                                className="absolute inset-0 w-full h-full flex items-center justify-center"
                                                            >
                                                                <span className="text-gray-700 font-medium text-lg">Scrolling Event {syncTick % 6}</span>
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Center SVG Placeholder */}
                                                    <div className="absolute bottom-0 right-[244px] w-[790px] h-[498px] bg-transparent flex items-end justify-center pointer-events-auto overflow-hidden z-[5]">
                                                        <div className="w-full h-full border-t border-l border-r border-dashed border-gray-300 rounded-t-2xl flex items-center justify-center bg-gray-50/50">
                                                            <span className="text-gray-400 font-medium">Review Design SVG 790x498</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {index !== 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                                                    <span className="text-2xl font-semibold text-gray-400">
                                                        Placeholder content for Card {index}
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Expand Button — always on top, not inside fading foreground */}
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedCardIndex(activeCard);
                                        }}
                                        className="absolute top-[46px] right-[46px] w-12 h-12 border border-grey-10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto bg-white hover:bg-gray-50 transition-colors z-[30]"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                        </svg>
                                    </div>
                                </motion.div>
                            );
                        }

                        // ── FANNED / BOTTOM ROW CARD ────────────────────────────
                        let cardStyle: React.CSSProperties | import("framer-motion").MotionStyle;

                        if (activeCard === null) {
                            // Default fanned state
                            cardStyle = {
                                position: "absolute",
                                left: cardInfo.left,
                                top: cardInfo.top,
                                rotateZ: cardInfo.rotate,
                                zIndex: index
                            };
                        } else {
                            // Active state — place in bottom row slot
                            const slotIndex = getSlotIndex(index, activeCard);
                            cardStyle = {
                                position: "absolute",
                                left: bottomRowSlots[slotIndex].left,
                                top: bottomRowSlots[slotIndex].top,
                                rotateZ: bottomRowSlots[slotIndex].rotate,
                                zIndex: 10
                            };
                        }

                        return (
                            <TiltedCard
                                key={index}
                                cardInfo={cardInfo}
                                layoutId={`card-${index}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCard(index);
                                }}
                                style={cardStyle}
                            />
                        );
                    })}
                </div>

                {/* Expanded Modal */}
                <AnimatePresence>
                    {expandedCardIndex !== null && (
                        <CardExpandModal
                            isOpen={true}
                            onClose={() => setExpandedCardIndex(null)}
                            cardIndex={expandedCardIndex}
                            cardInfo={expandedCardIndex === 0 ? {
                                title: "Empowering HR with Scalable, Modular Performance Settings",
                                body: "Replacing a rigid 12-step maze with a bifurcated architecture empowers HR to independently launch customized, scalable performance reviews in minutes without support."
                            } : {
                                title: fannedCardsData[expandedCardIndex].title,
                                body: fannedCardsData[expandedCardIndex].body
                            }}
                        />
                    )}
                </AnimatePresence>
            </main>
        </LayoutGroup>
    );
}
