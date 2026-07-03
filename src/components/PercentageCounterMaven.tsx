'use client';

import { useEffect, useState } from 'react';

// Counts from 10 to 15, rapidly going through each integer, then settles at 15.
// Resets whenever `isOpen` flips from false → true.

interface PercentageCounterProps {
    isOpen: boolean;
}

const START = 200;
const END = 215;
// How long to show each intermediate number (ms) — fast flicker feel
const STEP_INTERVAL = 80;

export default function PercentageCounterMaven({ isOpen }: PercentageCounterProps) {
    const [count, setCount] = useState(START);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset when modal closes
            setCount(START);
            setDone(false);
            return;
        }

        // Already finished — don't re-run
        if (done) return;

        // Kick off only once per open
        let current = START;
        const timer = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= END) {
                clearInterval(timer);
                setDone(true);
            }
        }, STEP_INTERVAL);

        return () => clearInterval(timer);
    }, [isOpen, done]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
            }}
        >
            {/* Gradient percentage number */}
            <span
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: '64px',
                    lineHeight: 1.1,
                    background: 'linear-gradient(to bottom, #D54C21, #962A07)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                }}
            >
                {count}%
            </span>

            {/* Sub-text */}
            <p
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'var(--color-grey-80, #4B5563)',
                    textAlign: 'center',
                    maxWidth: '360px',
                    margin: 0,
                }}
            >
                increase in feedback quality for Dana
                <br />
                with Maven AI
            </p>
        </div>
    );
}
