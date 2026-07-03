"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ShadowOverlay() {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const skewX = useTransform(scrollYProgress, [0, 1], ["0deg", "-8deg"]);

  return (
    <motion.div 
      className="fixed -top-[5vh] -right-[10vw] w-[110vw] h-[110vh] z-[51] pointer-events-none mix-blend-multiply opacity-60"
      style={{
        maskImage: "linear-gradient(225deg, black 10%, transparent 70%)",
        WebkitMaskImage: "linear-gradient(225deg, black 10%, transparent 70%)",
        scale,
        skewX,
        transformOrigin: "top right"
      }}
    >
      <Image
        src="/shadow.png"
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover"
        style={{
          // Guarantees pixel-perfect upscaling without blurring if it's a pixelated image
          imageRendering: "pixelated",
          objectPosition: "top right"
        }}
      />
    </motion.div>
  );
}
