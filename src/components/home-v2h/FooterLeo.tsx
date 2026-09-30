"use client";

import { useEffect, useRef, useState } from "react";

// Leonardo from TMNT III, turned into soft voxels: three spin frames, then two idle frames.
const STRIP = "/sprites/leo.webp";
const FRAMES = 5;
const CELL_ASPECT = 859 / 509;
const FOOT_X = 0.4948; // where his feet sit inside a frame, as fractions of it
const FOOT_Y = 0.9823;
const SPIN = [0, 1, 2, 0, 1, 2, 0, 1, 2]; // the spin attack cycles its three frames
const SPIN_FRAME_MS = 70;
const IDLE = [3, 4]; // standing, bandana tails fluttering
const IDLE_FRAME_MS = 420;

/**
 * Leo stands on the Skyline's roof in the footer collage, bandana fluttering, and now and
 * then spins; hovering him spins him straight away.
 */
export default function FooterLeo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(IDLE[0]);
  const [spinning, setSpinning] = useState(false);
  const spinRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false;
    let busy = false;
    let timers: number[] = [];
    let idleTimer = 0;
    let idleTick = 0;
    let idleStep = 0;

    // between spins, alternate the two idle frames
    const idle = () => {
      window.clearInterval(idleTick);
      if (reducedMotion) return;
      idleTick = window.setInterval(() => {
        idleStep = (idleStep + 1) % IDLE.length;
        setFrame(IDLE[idleStep]);
      }, IDLE_FRAME_MS);
    };

    const spin = () => {
      if (busy || reducedMotion) return;
      busy = true;
      window.clearInterval(idleTick);
      setSpinning(true);
      SPIN.forEach((f, i) => timers.push(window.setTimeout(() => setFrame(f), i * SPIN_FRAME_MS)));
      timers.push(
        window.setTimeout(() => {
          idleStep = 0;
          setFrame(IDLE[0]);
          setSpinning(false);
          busy = false;
          idle();
        }, SPIN.length * SPIN_FRAME_MS),
      );
    };
    spinRef.current = spin;

    // Every so often while the footer is on screen, he spins on his own.
    const scheduleIdleSpin = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (visible) spin();
        scheduleIdleSpin();
      }, 5000 + Math.random() * 4000);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) window.setTimeout(spin, 600); // a spin to greet you on arrival
    });
    io.observe(root);
    if (!reducedMotion) {
      idle();
      scheduleIdleSpin();
    }

    return () => {
      io.disconnect();
      window.clearTimeout(idleTimer);
      window.clearInterval(idleTick);
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      onPointerEnter={() => spinRef.current()}
      className="absolute"
      style={{
        // feet on the car roof: 14% across, 61% down the collage
        left: "14%",
        bottom: "39%",
        height: "32%",
        aspectRatio: CELL_ASPECT,
        transform: `translate(${-FOOT_X * 100}%, ${(1 - FOOT_Y) * 100}%)`,
      }}
    >
      {/* soft shadow on the roof */}
      <div
        className="absolute rounded-[50%] transition-transform duration-150"
        style={{
          width: "26%",
          height: "7%",
          left: `${FOOT_X * 100}%`,
          top: `${FOOT_Y * 100}%`,
          transform: `translate(-50%, -55%) scale(${spinning ? 0.8 : 1})`,
          background: "radial-gradient(closest-side, rgba(38, 44, 52, 0.38), rgba(38, 44, 52, 0))",
        }}
      />
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{
          backgroundImage: `url(${STRIP})`,
          backgroundSize: `${FRAMES * 100}% 100%`,
          backgroundPosition: `${(frame / (FRAMES - 1)) * 100}% 0`,
          transform: spinning ? "translateY(-6%)" : undefined,
          transformOrigin: "50% 100%",
        }}
      />
    </div>
  );
}
