"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadButtonProps {
    href: string;
    fileName?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function DownloadButton({ href, fileName, className = '' }: DownloadButtonProps) {
    const [mode, setMode] = useState<0 | 1 | 2>(0);
    const [direction, setDirection] = useState<number>(1);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateMode = (newMode: 0 | 1 | 2) => {
        if (mode !== newMode) {
            setDirection(newMode > mode ? 1 : -1);
            setMode(newMode);
        }
    };

    const handleMouseEnter = () => {
        if (mode !== 2) updateMode(1);
    };

    const handleMouseLeave = () => {
        if (mode !== 2) updateMode(0);
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (mode === 2) {
            e.preventDefault();
            return;
        }

        updateMode(2);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            updateMode(0); // Return to default state after 2 seconds
        }, 2000);
    };

    const variants = {
        initial: (dir: number) => ({
            y: dir > 0 ? -40 : 40,
            opacity: 0,
        }),
        animate: {
            y: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            y: dir > 0 ? 40 : -40,
            opacity: 0,
        })
    };

    const springConfig = {
        type: "spring" as const,
        stiffness: 500,
        damping: 60,
        mass: 1,
    };

    return (
        <a
            href={href}
            download={fileName}
            className={`relative overflow-hidden inline-flex items-center justify-center cursor-pointer ${className} ${mode === 2 ? 'pointer-events-none' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Default Background */}
            <div
                className="absolute inset-0 bg-[#535F6F] transition-opacity duration-300 pointer-events-none"
                style={{ opacity: mode === 0 ? 1 : 0 }}
            />

            {/* Gradient Background */}
            <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                    opacity: mode > 0 ? 1 : 0,
                    background: "linear-gradient(135deg, #D84E22 0%, #942906 100%)"
                }}
            />

            {/* Text Content */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                <AnimatePresence custom={direction} initial={false}>
                    {mode === 0 && (
                        <motion.span
                            key="resume"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={springConfig}
                            className="absolute text-white"
                        >
                            Resume
                        </motion.span>
                    )}
                    {mode === 1 && (
                        <motion.span
                            key="download"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={springConfig}
                            className="absolute text-white"
                        >
                            Download
                        </motion.span>
                    )}
                    {mode === 2 && (
                        <motion.span
                            key="downloaded"
                            custom={direction}
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={springConfig}
                            className="absolute text-[#FFA182]"
                        >
                            Downloaded
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </a>
    );
}
