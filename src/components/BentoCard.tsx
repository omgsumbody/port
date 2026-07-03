"use client";
import React, { useState } from 'react';

interface BentoCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  variant?: 'row' | 'col' | 'wide';
  onClick?: () => void;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  variant = 'row', 
  onClick 
}) => {
  const isWide = variant === 'wide';
  const isCol = variant === 'col';
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
      className={`group relative bg-[#FCFDFD] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] rounded-[24px] p-6 lg:p-[32px] flex w-full h-full ${isWide ? 'flex-col sm:flex-row items-start sm:items-center justify-between gap-6' : 'flex-col xl:flex-row items-stretch gap-[32px]'}`}
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

      {/* Image Section (Hidden on Wide Variant) */}
      {!isWide && (
        <div className="w-full xl:w-1/2 shrink-0 bg-[#E5E5E5] rounded-[16px] overflow-hidden min-h-[200px]">
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#99A1AC] text-sm">Image Placeholder</div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className={`flex flex-col ${isWide ? 'flex-row items-center w-full justify-between gap-6' : 'justify-between w-full xl:w-1/2 gap-[12px]'}`}>
        
        <div className={`flex flex-col gap-[12px] ${isWide ? 'w-auto' : 'flex-1'}`}>
          <h3 className="font-inter font-medium text-[28px] lg:text-[32px] leading-[39px] text-[#192434] m-0">
            {title}
          </h3>
          <p className="font-inter font-normal text-[16px] leading-[19px] text-[#3D495A] m-0">
            {description}
          </p>
        </div>

        {/* Button */}
        <button 
          onClick={onClick}
          className={`group flex flex-row justify-center items-center h-[48px] px-6 gap-[8px] bg-[#FFDED3] text-[#980D01] hover:bg-[#990C02] hover:text-white rounded-[12px] transition-colors duration-300 cursor-pointer border-none ${isWide ? 'w-full sm:w-fit shrink-0' : 'w-full mt-auto'}`}
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
  );
};

export default BentoCard;
