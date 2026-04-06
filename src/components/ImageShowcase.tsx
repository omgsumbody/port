import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageShowcaseProps {
  variant: 'type1' | 'type2';
  texts: string[];
  thumbnailSrc?: string;
  fullscreenSrc?: string;
}

const ImageShowcase: React.FC<ImageShowcaseProps> = ({ variant, texts, thumbnailSrc, fullscreenSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reusable Text Block
  const TextContent = (
    <div className="w-[498px] shrink-0 flex flex-col items-start gap-[24px] relative z-20">
      <div className="flex flex-col gap-[24px]">
        {texts.map((text, i) => (
          <p key={i} className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
            {text}
          </p>
        ))}
      </div>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex flex-row items-center justify-center px-[16px] py-[10px] gap-[10px] bg-[#990C02] rounded-[12px] shadow-[0_0_4px_rgba(218,220,222,0.2)] hover:scale-105 transition-transform cursor-pointer border-none"
      >
        <span className="font-inter font-medium text-[16px] leading-[29px] text-white">View details</span>
      </button>
    </div>
  );

  // Reusable Image Block
  const ImageContent = (
    <div className="w-[1054px] h-[630px] shrink-0 border border-[rgba(218,220,222,0.57)] bg-[rgba(255,253,211,0.2)] overflow-hidden flex items-center justify-center relative">
      {/* Glowing Orbs */}
      <div className="absolute w-[1025px] h-[1029px] left-[115px] bottom-[-681px] bg-[rgba(252,195,120,0.6)] rounded-full" style={{ filter: 'blur(149.55px)' }}></div>
      <div className="absolute w-[941px] h-[945px] left-[877px] bottom-[-657px] bg-[rgba(253,98,83,0.6)] rounded-full" style={{ filter: 'blur(149.55px)' }}></div>
      
      {/* Conditional Thumbnail */}
      {thumbnailSrc ? (
        <img src={thumbnailSrc} className="relative z-10 w-full h-full object-contain" alt="Showcase Thumbnail" />
      ) : (
        <span className="relative z-10 font-inter text-[#535F6F]">Image Pending</span>
      )}
    </div>
  );

  return (
    <>
      {/* CSS Breakout Wrapper - Spans full main content area (viewport minus 256px sidebar) */}
      <div className="relative overflow-hidden" style={{ width: 'calc(100vw - 256px)', left: 'calc(50% - (100vw - 256px) / 2)' }}>
        
        {variant === 'type1' ? (
          // Type 1: Text anchored Left, Image bleeds Right
          <div className="flex flex-row items-center justify-start pl-[56px] gap-[56px] w-full">
            {TextContent}
            {ImageContent}
          </div>
        ) : (
          // Type 2: Image bleeds Left, Text anchored Right
          <div className="flex flex-row items-center justify-end pr-[56px] gap-[56px] w-full">
            {ImageContent}
            {TextContent}
          </div>
        )}

      </div>

      {/* Fullscreen Draggable Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#f5f7f9] overflow-hidden flex items-center justify-center">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-[56px] right-[56px] z-[110] flex flex-row items-center justify-center px-[16px] py-[10px] gap-[10px] bg-[#990C02] rounded-[12px] shadow-[0_0_4px_rgba(218,220,222,0.2)] hover:scale-105 transition-transform cursor-pointer border-none"
          >
            <span className="font-inter font-medium text-[16px] leading-[29px] text-white">Close</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <motion.div 
            drag 
            dragConstraints={{ top: -1500, left: -1500, right: 1500, bottom: 1500 }}
            className="absolute cursor-grab active:cursor-grabbing"
          >
            {fullscreenSrc ? (
              <img src={fullscreenSrc} alt="Expanded View" className="max-w-none pointer-events-none select-none" />
            ) : (
              <div className="w-[800px] h-[600px] flex items-center justify-center bg-gray-200 rounded-lg">
                <span className="font-inter text-[#535F6F]">High-Res Image Pending</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ImageShowcase;
