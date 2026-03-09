"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DownloadButton from './DownloadButton';

export default function TopNavigation() {
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 bg-white h-[87px] w-full pl-[56px] flex justify-between items-center border-b border-[#DADCDE]/50">
            {/* 1. Left Side (Logo) */}
            <div className="pb-[22px]">
                <Link
                    href="/"
                    className="flex relative items-center justify-center w-[101px] h-[65px]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence>
                        {!isHovered ? (
                            <motion.div
                                key="logo-default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <img src="/1.svg" alt="Default Logo" width={101} height={65} className="w-[101px] h-[65px] object-contain" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-hover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <img src="/2.svg" alt="Hover Logo" width={101} height={65} className="w-[101px] h-[65px] object-contain" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* 2. Right Side (Navigation Links & Button) */}
            <div className="flex items-center h-full">
                <div className="flex gap-1 mr-[32px]">
                    <Link
                        href="/"
                        className={`w-[84px] h-[54px] flex items-center justify-center text-[16px] font-normal leading-[1.8em] transition-colors ${(pathname === '/' || pathname === '/work') ? 'text-[#661900]' : 'text-[#3D495A] hover:text-[#990C02]'}`}
                    >
                        <span className="relative">
                            {(pathname === '/' || pathname === '/work') && (
                                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-[6px] w-[6px] h-[6px] rounded-full bg-[#661900]"></span>
                            )}
                            Work
                        </span>
                    </Link>

                    <Link
                        href="/about"
                        className={`w-[84px] h-[54px] flex items-center justify-center text-[16px] font-normal leading-[1.8em] transition-colors ${pathname === '/about' ? 'text-[#661900]' : 'text-[#3D495A] hover:text-[#990C02]'}`}
                    >
                        <span className="relative">
                            {pathname === '/about' && (
                                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-[6px] w-[6px] h-[6px] rounded-full bg-[#661900]"></span>
                            )}
                            About
                        </span>
                    </Link>
                </div>

                <DownloadButton
                    href="/resume.pdf"
                    fileName="Harsha_Resume.pdf"
                    className="w-[140px] h-[87px] text-[16px] font-normal leading-[1.8em]"
                />
            </div>
        </nav>
    );
}
