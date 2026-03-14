"use client";

import React from "react";
import Image from "next/image";

const socialLinks = [
  { label: "linkedin", href: "#" },
  { label: "twitter", href: "#" },
  { label: "behance", href: "#" },
];

export default function FooterBar() {
  return (
    <div className="w-full bg-white flex items-center justify-between px-10 py-10">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Image
          src="/1.svg"
          alt="Logo"
          width={136}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Center: Social links */}
      <div className="flex items-center gap-[86px]">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] font-normal text-[#3D495A] underline transition-colors duration-150 hover:text-[#990C02]"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right: Copyright block */}
      <div className="flex flex-col items-end gap-3">
        {/* Top row: tagline */}
        <p className="text-[16px] font-normal text-[#3D495A] text-right">
          Designed with love, coded with vibes.
        </p>
        {/* Bottom row: © + name */}
        <div className="flex items-center gap-1">
          {/* Copyright circle SVG */}
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <circle
              cx="8.5"
              cy="8.5"
              r="8"
              stroke="#3D495A"
              strokeWidth="0.75"
              fill="none"
            />
            <path
              d="M10.8 6.7C10.3 6.1 9.5 5.7 8.6 5.7C7.0 5.7 5.8 7.0 5.8 8.5C5.8 10.1 7.0 11.3 8.6 11.3C9.5 11.3 10.3 10.9 10.8 10.3"
              stroke="#3D495A"
              strokeWidth="0.75"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-[16px] font-normal text-[#3D495A]">
            Harshapeddintidesign. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
