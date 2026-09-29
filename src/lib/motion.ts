// Shared motion language for the v2 design system.
// Mirrors --ease-editorial in globals.css so CSS and Framer Motion feel identical.
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,   // hovers, colour shifts
  base: 0.45,  // reveals, small layout moves
  slow: 0.7,   // overlays, large layout moves
} as const;

export const STAGGER = 0.06;

// Content rises a short distance and fades in, once, as it enters the viewport.
export const revealUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_EDITORIAL } },
};

export const revealGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};
