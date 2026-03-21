"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const PIXEL_SIZE = 24;          // Each block is 24x24px
const BRUSH_RADIUS = 48;        // Mouse reveals squares within this radius
const FADE_DELAY_MS = 14000;    // Squares start filling back in after 14 seconds
const FADE_DURATION_MS = 1200;  // Duration for the refill animation per block

interface PixelRevealHeroProps {
    hideContent?: boolean;
}

export default function PixelRevealHero({ hideContent = false }: PixelRevealHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Map of "col,row" -> timestamp when that cell was last touched
    const cellTimers = useRef<Map<string, number>>(new Map());
    const animFrameRef = useRef<number>(0);

    const getGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return { cols: 0, rows: 0 };
        const cols = Math.ceil(canvas.width / PIXEL_SIZE);
        const rows = Math.ceil(canvas.height / PIXEL_SIZE);
        return { cols, rows };
    }, []);

    // Initial fill of the canvas with solid white
    const fillWhite = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    // Resize canvas to match container
    const resizeCanvas = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        fillWhite();
        cellTimers.current.clear();
    }, [fillWhite]);

    // Erase pixel blocks near the mouse position
    const eraseAroundMouse = useCallback((mouseX: number, mouseY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const now = performance.now();

        const { cols, rows } = getGrid();
        const affectedCol = Math.floor(mouseX / PIXEL_SIZE);
        const affectedRow = Math.floor(mouseY / PIXEL_SIZE);

        // How many blocks does brush_radius span?
        const blockRadius = Math.ceil(BRUSH_RADIUS / PIXEL_SIZE);

        for (let dc = -blockRadius; dc <= blockRadius; dc++) {
            for (let dr = -blockRadius; dr <= blockRadius; dr++) {
                const col = affectedCol + dc;
                const row = affectedRow + dr;

                // Bounds check
                if (col < 0 || col >= cols || row < 0 || row >= rows) continue;

                // Circular brush mask
                const cx = (col + 0.5) * PIXEL_SIZE;
                const cy = (row + 0.5) * PIXEL_SIZE;
                const dist = Math.hypot(cx - mouseX, cy - mouseY);
                if (dist > BRUSH_RADIUS) continue;

                const key = `${col},${row}`;
                cellTimers.current.set(key, now);

                // Erase this block on canvas (sets it transparent so gradient shows through)
                ctx.clearRect(
                    col * PIXEL_SIZE,
                    row * PIXEL_SIZE,
                    PIXEL_SIZE,
                    PIXEL_SIZE
                );
            }
        }
    }, [getGrid]);

    // Animate logic: check which cells should start filling back in
    const animateFade = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const now = performance.now();

        cellTimers.current.forEach((touchedAt, key) => {
            const elapsed = now - touchedAt;
            if (elapsed < FADE_DELAY_MS) return;

            const fadeProgress = Math.min((elapsed - FADE_DELAY_MS) / FADE_DURATION_MS, 1);

            const [colStr, rowStr] = key.split(",");
            const col = parseInt(colStr, 10);
            const row = parseInt(rowStr, 10);

            const x = col * PIXEL_SIZE;
            const y = row * PIXEL_SIZE;

            // Clear then draw white with increasing opacity
            ctx.clearRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
            ctx.fillStyle = `rgba(255,255,255,${fadeProgress})`;
            ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);

            // Once fully opaque, remove from the timer map so we stop animating it
            if (fadeProgress >= 1) {
                cellTimers.current.delete(key);
            }
        });

        animFrameRef.current = requestAnimationFrame(animateFade);
    }, []);

    useEffect(() => {
        resizeCanvas();
        const observer = new ResizeObserver(resizeCanvas);
        if (containerRef.current) observer.observe(containerRef.current);

        animFrameRef.current = requestAnimationFrame(animateFade);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [resizeCanvas, animateFade]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        eraseAroundMouse(mouseX, mouseY);
    }, [eraseAroundMouse]);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={`${hideContent ? "h-full" : "h-[576px]"} w-full flex flex-col items-center justify-center relative overflow-hidden`}
        >
            {/* Layer 0: Gradient background (bottom) */}
            <div
                className="absolute inset-0 bg-[url('/assets/Landing/herograd.svg')] bg-cover bg-center"
                aria-hidden="true"
            />

            {/* Layer 1: Pixel mask canvas on top of the gradient */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={{ display: "block" }}
                aria-hidden="true"
            />

            {/* Layer 2: Hero content — stays on top of everything */}
            {!hideContent && (
                <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl px-[56px] py-10 pointer-events-none">

                    {/* Intro Text */}
                    <p className="text-[16px] font-medium text-[#3D495A] tracking-[0.02em] leading-[16px] font-sans mb-8">
                        Hello, I&apos;m Harsha! Product Designer and ex frontend developer
                    </p>

                    {/* Main Headline */}
                    <div className="relative mb-8 w-full max-w-[800px] flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20, y: -10, rotate: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0, rotate: -3 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-[-18px] left-[50%] -ml-[140px] md:ml-[0px] md:left-[80px] lg:left-[120px] bg-[#FEF9C3] rounded-2xl px-4 py-1 text-[#64748b] font-medium font-sans text-[20px] z-10"
                        >
                            0-10x
                        </motion.div>
                        <h1 className="relative text-[40px] font-bold tracking-[-0.02em] leading-[52px] text-[#3D495A] font-sans z-20">
                            Turning ideas into impactful products from concept to production.
                        </h1>
                    </div>

                    {/* Narrative Line */}
                    <p className="text-[16px] font-medium text-[#3D495A] tracking-[0.02em] leading-[16px] font-sans">
                        Previously at{" "}
                        <span className="bg-gradient-to-r from-[#C28108] to-[#F05B28] bg-clip-text text-transparent">
                            Mesh.ai, Hypersonix.ai and Nearbuy
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
