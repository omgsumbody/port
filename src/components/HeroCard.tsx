"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface HeroCardProps {
  onKnowMoreClick?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onKnowMoreClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
      className="group relative w-full max-w-[1484px] mx-auto bg-[#FCFDFD] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] rounded-[24px] p-6 lg:p-[32px] flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-[40px]"
    >
      {/* Gradient Border Overlay */}
      <div 
        className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), #FCC378 0%, #FD6253 40%, transparent 100%)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />

      {/* Left: Hardcoded Auto-playing Video Section */}
      <div className="w-full lg:w-[768px] aspect-video lg:h-[432px] shrink-0 bg-[#E5E5E5] rounded-[16px] overflow-hidden">
        <video
          src="https://res.cloudinary.com/des7zr831/video/upload/v1780566788/Video_Project_9_mpw1np.mp4"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Right: Content Section */}
      <div className="w-full lg:w-[612px] flex flex-col gap-6 lg:gap-[32px] flex-1 lg:h-[432px]">

        {/* Header */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="font-inter font-medium text-[28px] lg:text-[32px] leading-tight lg:leading-[39px] text-[#243244] m-0">
            Reviews Settings
          </h2>
          <p className="font-inter font-normal text-[16px] leading-[19px] text-[#3D495A] m-0">
            Empowering HRs with Scalable, Modular Performance management settings.
          </p>
        </div>

        {/* Stats Box */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center p-5 lg:p-[24px] gap-[16px] lg:gap-[28px] bg-[#F8F8F8] border border-[#EDEDED] rounded-[16px]">
          {/* Stat 1 */}
          <div className="flex-1 flex flex-row items-center gap-[12px] lg:gap-[28px]">
            <span className="font-inter font-medium text-[32px] leading-[39px] text-[#243244] shrink-0">35%</span>
            <span className="font-inter font-normal text-[16px] leading-[19px] text-[#243244]">faster creation of review cycles.</span>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] sm:w-[2px] sm:h-[39px] bg-[#EDEDED] shrink-0"></div>

          {/* Stat 2 */}
          <div className="flex-1 flex flex-row items-center gap-[12px] lg:gap-[28px]">
            <span className="font-inter font-medium text-[32px] leading-[39px] text-[#243244] shrink-0">8%</span>
            <span className="font-inter font-normal text-[16px] leading-[19px] text-[#243244]">More review cycles created</span>
          </div>
        </div>

        {/* Bottom Tags / Buttons */}
        <div className="w-full flex flex-row flex-wrap justify-start lg:justify-end items-center gap-[8px] mt-auto">

          {/* Most Popular Tag */}
          <div className="flex flex-row justify-center items-center h-[48px] px-[16px] gap-[10px] bg-[#FFF3DE] rounded-[32px]">
            <Image src="/Star.svg" alt="Star" width={16} height={16} className="shrink-0" />
            <span className="font-inter font-semibold text-[16px] leading-[19px] tracking-[0.01em] text-[#845200]">
              Most Popular
            </span>
          </div>

          {/* Know More Button */}
          <button 
            onClick={onKnowMoreClick}
            className="group flex flex-row justify-center items-center h-[48px] px-6 gap-[8px] bg-[#FFDED3] text-[#980D01] hover:bg-[#990C02] hover:text-white rounded-[12px] transition-colors duration-300 cursor-pointer border-none"
          >
            <span className="font-inter font-semibold text-[16px] leading-[19px] tracking-[0.01em]">
              Know More
            </span>
            <div className="relative w-[14px] h-[14px] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-[2px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <path d="M7 3L11 7L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

export default HeroCard;
