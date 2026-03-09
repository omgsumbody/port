"use client";

import { useState, useEffect } from "react";
// Preparing for future integration:
// import { motion, AnimatePresence } from "framer-motion";

export default function MainBodyShowcase() {
    const [activeCard, setActiveCard] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-playing carousel logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 6);
        }, 2000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <main className="flex flex-col items-center gap-12 w-full pt-16 pb-32">
            {/* 
        Center Card
        - Future: Will become a <motion.div> for layout expansion
        - Future: Will house the complex Case Study graphic and 2x2 grid
      */}
            <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="bg-[#FCFDFD] border border-gray-100 rounded-[24px] shadow-sm overflow-hidden relative flex flex-col items-center justify-center transition-all duration-300 w-full max-w-[1484px] h-[544px]"
            >
                <span className="text-2xl font-semibold text-gray-500">
                    Showing content for Card {activeCard}
                </span>
            </div>

            {/* 
        Bottom Cards (The Carousel)
        - Future: Will be horizontally stacked with <motion.div> and paper-crease styling
      */}
            <div className="flex flex-row items-end justify-center w-full relative h-[152px]">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                    const isActive = index === activeCard;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => {
                                setActiveCard(index);
                                setIsPaused(true);
                            }}
                            onMouseLeave={() => setIsPaused(false)}
                            className={`bg-[#FCFDFD] border border-gray-100 rounded-t-[24px] rounded-b-none transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center shadow-sm relative ${isActive ? "z-10" : "z-0"
                                }`}
                            style={{
                                width: "684px",
                                height: isActive ? "152px" : "122px",
                                marginLeft: index === 0 ? "0px" : "-524px", // Overlapping stack horizontally
                                zIndex: isActive ? 10 : 10 - Math.abs(activeCard - index),
                            }}
                        >
                            <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                Card Index: {index}
                            </span>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
