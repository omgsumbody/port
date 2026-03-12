'use client';

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

// SVG viewBox: 0 0 1296 984
// Frame 3528 (navbar) = top 153px → clip top = 153/984 = 15.55%
// Footer top ≈ y=900 → clip bottom = (984-900)/984 = 8.54%
// Scroll: translate the animated image up by ~430 SVG units = 43.7% of SVG height

const NAVBAR_CLIP_TOP_PCT = 15.55;
const FOOTER_CLIP_BOTTOM_PCT = 8.54;
const SCROLL_DISTANCE_PCT = 43.7;

const SVG_SRC = '/assets/Landing/cards exp/card0hm.svg';

export default function Card0HeroMedia() {
    const controls = useAnimation();

    useEffect(() => {
        let cancelled = false;

        const runAnimation = async () => {
            if (cancelled) return;

            // Reset to top
            await controls.set({ y: 0 });

            if (cancelled) return;

            // Scroll content upward over 3s linear
            await controls.start({
                y: `-${SCROLL_DISTANCE_PCT}%`,
                transition: { duration: 3, ease: 'linear' },
            });

            if (cancelled) return;

            // Pause 1s at bottom, then restart
            await new Promise<void>((res) => setTimeout(res, 1000));
            if (!cancelled) runAnimation();
        };

        runAnimation();

        return () => {
            cancelled = true;
            controls.stop();
        };
    }, [controls]);

    return (
        /* Outer wrapper: sits inside the 683×524 hero box.
           43px gap L/R, touches bottom, clips everything to box bounds */
        <div
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '43px',
                right: '43px',
                overflow: 'hidden',
            }}
        >
            {/* ── STATIC LAYER ──────────────────────────────────────
                Full SVG shown at natural aspect ratio, anchored to bottom.
                Navbar (Frame3528) and footer are visible here and stay fixed.
            ──────────────────────────────────────────────────────── */}
            <img
                src={SVG_SRC}
                alt="Review Settings UI"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    zIndex: 10,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            />

            {/* ── ANIMATED CONTENT LAYER ────────────────────────────
                Second copy clipped to body area (between navbar & footer).
                Translates upward to simulate scrolling.
                clip-path inset hides the navbar & footer on this copy
                so only the scrollable body region moves.
            ──────────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    clipPath: `inset(${NAVBAR_CLIP_TOP_PCT}% 0% ${FOOTER_CLIP_BOTTOM_PCT}% 0%)`,
                    overflow: 'hidden',
                    zIndex: 20,
                    pointerEvents: 'none',
                }}
            >
                <motion.img
                    src={SVG_SRC}
                    alt=""
                    animate={controls}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        userSelect: 'none',
                    }}
                />
            </div>
        </div>
    );
}
