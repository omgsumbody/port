"use client";

import React from "react";
import { motion } from "framer-motion";

const customEasing = [0.76, 0, 0.24, 1] as const;
const defaultDuration = 1;

// 1. Hero Typography Reveal
export const HeroTypographyReveal = ({ text, className = "", as: Component = "h1" }: { text: string; className?: string, as?: any }) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const childVariants = {
    hidden: { y: "120%" },
    visible: {
      y: "0%",
      transition: {
        duration: defaultDuration,
        ease: customEasing,
      },
    },
  };

  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      className={`flex flex-wrap gap-[0.25em] ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-block">
          <motion.span className="inline-block" variants={childVariants}>
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};

// 2. Bento Grid Viewport Stagger
export const BentoGridViewportStagger = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  );
};

export const BentoCardMotionWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: customEasing,
      },
    },
  };

  return (
    <motion.div variants={cardVariants} className={className}>
      {children}
    </motion.div>
  );
};

// 3. Editorial Profile Image Reveal
export const EditorialProfileImageReveal = ({
  src,
  alt,
  className = "",
  overlayColor = "#000000",
}: {
  src: string;
  alt: string;
  className?: string;
  overlayColor?: string;
}) => {
  const overlayVariants = {
    hidden: { x: "0%" },
    visible: {
      x: "100%",
      transition: {
        duration: 1.2,
        ease: customEasing,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.1 },
    visible: {
      scale: 1,
      transition: {
        duration: 1.2,
        ease: customEasing,
      },
    },
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.img
        src={src}
        alt={alt}
        variants={imageVariants}
        // Strict image rendering properties to guarantee pixel-perfect scaling without blur or jitter
        className="w-full h-full object-cover"
        style={{
          imageRendering: "pixelated",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute inset-0 z-10 origin-left"
        style={{ backgroundColor: overlayColor }}
        variants={overlayVariants}
      />
    </motion.div>
  );
};

// 4. Generic Scroll Reveal Wrapper
export const GenericScrollRevealWrapper = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: customEasing,
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
};
