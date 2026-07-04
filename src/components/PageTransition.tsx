"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const blocks = [
    { color: '#E5DA2E' }, // Block 1
    { color: '#FBB040' }, // Block 2
    { color: '#F2693C' }, // Block 3
];

export const triggerTransition = (href: string) => {
    window.dispatchEvent(new CustomEvent('page-transition', { detail: href }));
};

export default function PageTransition() {
    const pathname = usePathname();
    const router = useRouter();
    const [isExiting, setIsExiting] = useState(false);

    const duration = 0.3;
    const stagger = 0.05;

    useEffect(() => {
        const handleTransition = (e: any) => {
            const targetHref = e.detail;
            setIsExiting(true);
            setTimeout(() => {
                router.push(targetHref);
                setIsExiting(false);
            }, 400); // Wait for the blocks to fully slide down (0.3s + delay)
        };
        window.addEventListener('page-transition', handleTransition);
        return () => window.removeEventListener('page-transition', handleTransition);
    }, [router]);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {blocks.map((b, i) => (
                <motion.div
                    key={`${pathname}-block-${i}`}
                    className="absolute w-[33.34vw] h-[100dvh]"
                    style={{
                        backgroundColor: b.color,
                        left: `${i * 33.3333}vw`,
                        top: 0
                    }}
                    initial={{ y: "0%" }}
                    animate={{ y: isExiting ? "0%" : "-100%", transition: { duration, ease: [0.76, 0, 0.24, 1], delay: i * stagger } }}
                />
            ))}
        </div>
    );
}
