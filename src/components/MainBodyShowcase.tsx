"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CardExpandModal from "./CardExpandModal";

export default function MainBodyShowcase() {
    const [activeCard, setActiveCard] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

    const [gradientAngle, setGradientAngle] = useState(-126);
    const [syncTick, setSyncTick] = useState(0);

    // Auto-playing carousel logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 6);
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused]);

    // 5000ms Synchronized Animation Loop (800ms transition + 4200ms static)
    useEffect(() => {
        const tickInterval = setInterval(() => {
            setSyncTick((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(tickInterval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        // Calculate the center point of the card
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate the distance between mouse and center
        const cursorX = e.clientX;
        const cursorY = e.clientY;

        // Calculate the angle using Math.atan2 (returns radians)
        // We add 90 degrees to visually align the gradient origin towards the mouse
        const radians = Math.atan2(cursorY - centerY, cursorX - centerX);
        let degrees = (radians * 180) / Math.PI + 90;

        setGradientAngle(degrees);
    };

    return (
        <main className="flex flex-col items-center gap-12 w-full pt-16 pb-32">
            {/* 
        Center Card
      */}
            <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                    setIsPaused(false);
                    setGradientAngle(-126); // Reset angle on leave
                }}
                onMouseMove={handleMouseMove}
                style={{ '--gradient-angle': `${gradientAngle}deg` } as React.CSSProperties}
                className="bg-[#FCFDFD] border border-grey-00 rounded-[24px] shadow-sm overflow-hidden relative w-full max-w-[1484px] h-[544px] hover-center-card transition-all duration-300"
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
                                transition={{ duration: 0.5 }}
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
                                key="card-bg-placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 w-full h-full bg-gray-50/20 flex items-center justify-center border border-dashed border-gray-200"
                            >
                                <span className="text-gray-300 font-medium">Card {activeCard} Background</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Foreground Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Persistent elements across all cards */}
                    {/* Title */}
                    <div className="absolute top-[46px] left-[46px] text-grey-100 font-inter font-medium text-[32px] leading-[46px]">
                        Engineering <br /> Trust at Scale
                    </div>

                    {/* Expand Button */}
                    <div 
                        onClick={() => setExpandedCardIndex(activeCard)}
                        className="absolute top-[46px] right-[46px] w-12 h-12 border border-grey-10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto bg-white hover:bg-gray-50 transition-colors z-[20]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                    </div>

                    {/* Card-specific content */}
                    {activeCard === 0 && (
                        <>
                            {/* Left Box (Carousel Content) */}
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

                            {/* Right Middle Box (Scrolling Animation) */}
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

                            {/* Center Box (Screenshot SVG Placeholder) */}
                            <div className="absolute bottom-0 right-[244px] w-[790px] h-[498px] bg-transparent flex items-end justify-center pointer-events-auto overflow-hidden z-[5]">
                                <div className="w-full h-full border-t border-l border-r border-dashed border-gray-300 rounded-t-2xl flex items-center justify-center bg-gray-50/50">
                                    <span className="text-gray-400 font-medium">Review Design SVG 790x498</span>
                                </div>
                            </div>
                        </>
                    )}

                    {activeCard !== 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                            <span className="text-2xl font-semibold text-gray-400">
                                Placeholder content for Card {activeCard}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* 
        Bottom Cards (The Carousel)
        - Future: Will be horizontally stacked with <motion.div> and paper-crease styling
      */}
            <div className="flex flex-row items-end justify-center w-full relative h-[152px] isolate">
                {[
                    {
                        title: "Review Settings",
                        body: "Dashboard & Review Cycle creation, helping business to empower their performance reviews with modular control."
                    },
                    {
                        title: "Mesh Ai (Maven)",
                        body: "Improve the quality and tonality of review feedback."
                    },
                    {
                        title: "Views",
                        body: "Create and save custom analytical views across all Mesh products."
                    },
                    {
                        title: "Reviews Home",
                        body: "Home for performance, development, calibration & talent decisions."
                    },
                    {
                        title: "Formfilling and Results",
                        body: "A feedback form which brings data together with continuous OKR check-ins, 1:1s, and previous feedback."
                    },
                    {
                        title: "Rabbit DS",
                        body: "Design system used by Mesh organization and across all products."
                    }
                ].map((cardInfo, index) => {
                    const isActive = index === activeCard;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => {
                                setActiveCard(index);
                                setIsPaused(true);
                            }}
                            onMouseLeave={() => setIsPaused(false)}
                            className={`bg-[#FCFDFD] border border-grey-00 rounded-t-[24px] rounded-b-none ease-in-out cursor-pointer flex items-center justify-center shadow-sm relative overflow-hidden ${isActive ? "z-10" : "z-0"
                                }`}
                            style={{
                                transitionProperty: "width, height, margin",
                                transitionDuration: "300ms",
                                width: "684px",
                                height: isActive ? "152px" : "122px",
                                marginLeft: index === 0 ? "0px" : "-524px", // Overlapping stack horizontally
                                zIndex: (() => {
                                    if (isActive) return 10;
                                    // Based on user provided hierarchy
                                    const hierarchies = {
                                        0: [10, 9, 8, 7, 6, 5],
                                        1: [9, 10, 9, 8, 7, 6],
                                        2: [8, 9, 10, 9, 8, 7],
                                        3: [7, 8, 9, 10, 9, 8],
                                        4: [6, 7, 8, 9, 10, 9],
                                        5: [5, 6, 7, 8, 9, 10]
                                    };
                                    return hierarchies[activeCard as keyof typeof hierarchies][index];
                                })(),
                            }}
                        >
                            {/* Text Container (Left Side) */}
                            <div className="absolute top-[40px] left-[46px] flex flex-col gap-[4px] max-w-[480px] pointer-events-none">
                                <h3 className="font-inter font-normal text-grey-90 leading-[30px] text-xl">
                                    {cardInfo.title}
                                </h3>
                                <p className="font-inter font-normal text-grey-80 text-sm md:text-base">
                                    {cardInfo.body}
                                </p>
                            </div>

                            {/* Expand Button (Right Side) */}
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent triggering card hover interactions if any
                                    setExpandedCardIndex(index);
                                }}
                                className="absolute top-[52px] right-[52px] w-12 h-12 border border-grey-10 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                </svg>
                            </div>
                        </div>
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
                            title: [
                                "Review Settings",
                                "Mesh Ai (Maven)",
                                "Views",
                                "Reviews Home",
                                "Formfilling and Results",
                                "Rabbit DS"
                            ][expandedCardIndex],
                            body: [
                                "Dashboard & Review Cycle creation, helping business to empower their performance reviews with modular control.",
                                "Improve the quality and tonality of review feedback.",
                                "Create and save custom analytical views across all Mesh products.",
                                "Home for performance, development, calibration & talent decisions.",
                                "A feedback form which brings data together with continuous OKR check-ins, 1:1s, and previous feedback.",
                                "Design system used by Mesh organization and across all products."
                            ][expandedCardIndex]
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
