"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const blocks = [
    { color: '#E5DA2E' }, // Block 1
    { color: '#FBB040' }, // Block 2
    { color: '#F2693C' }, // Block 3
];

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const duration = 0.2;
    const stagger = 0.05;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                exit={{ transition: { when: "afterChildren" } }}
            >
                {children}

                {blocks.map((b, i) => (
                    <motion.div
                        key={i}
                        className="fixed w-[33.34vw] h-[100dvh] z-[9999] pointer-events-none"
                        style={{
                            backgroundColor: b.color,
                            left: `${i * 33.3333}vw`
                        }}
                        initial={{ top: "0vh" }}
                        animate={{ top: "-100vh", transition: { duration, ease: [1, 0, 0, 1], delay: i * stagger } }}
                        exit={{ top: ["100vh", "0vh"], transition: { duration, ease: [1, 0, 0, 1], delay: i * stagger } }}
                    />
                ))}
            </motion.div>
        </AnimatePresence>
    );
}
