"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface DesignShowProps {
  variant?: 'showleft' | 'showright' | 'showcenter';
  text: React.ReactNode;
  imageSrc: string;
  fullscreenSrc: string;
}

const DesignShow: React.FC<DesignShowProps> = ({ 
  variant = 'showleft', 
  text, 
  imageSrc, 
  fullscreenSrc 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Minimap states
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Minimap math
  const MINIMAP_WIDTH = 240;
  const scaleRatio = imgSize.width > 0 ? MINIMAP_WIDTH / imgSize.width : 1;
  const highlightWidth = viewportSize.width * scaleRatio;
  const highlightHeight = viewportSize.height * scaleRatio;

  const highlightX = useTransform(x, (value) => -value * scaleRatio);
  const highlightY = useTransform(y, (value) => -value * scaleRatio);

  // Lock body scroll when overlay is open
  useEffect(() => {
    let handleResize: () => void;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsImgLoaded(false);
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });

      handleResize = () => {
        setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isOpen]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsImgLoaded(true);
    setImgSize({ 
      width: e.currentTarget.naturalWidth, 
      height: e.currentTarget.naturalHeight 
    });
  };

  // Wrapper alignment separates container position from content alignment
  let wrapperClasses = "justify-start";
  let textMaxWidth = "max-w-[435px]";
  
  if (variant === 'showright') {
    wrapperClasses = "justify-end";
  } else if (variant === 'showcenter') {
    wrapperClasses = "justify-start";
    textMaxWidth = "w-full max-w-[1464px]";
  }

  return (
    <>
      {/* Main Card Container */}
      <div className="relative w-full min-h-[630px] bg-[#F9F9F9] border border-[#EAEAEA] shadow-[0_0_4px_rgba(177,177,177,0.25)] rounded-[16px] p-[44px] overflow-hidden flex flex-col">
        
        {/* Absolute Background Image - Flush to edges */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-end justify-center">
          <img 
            src={imageSrc} 
            alt="Feature preview" 
            className={`w-full h-full object-bottom ${variant === 'showcenter' ? 'object-cover' : 'object-contain'}`} 
          />
        </div>

        {/* Layout Wrapper & Content */}
        <div className={`relative z-10 w-full flex flex-row ${wrapperClasses}`}>
          <div className={`flex flex-col gap-[24px] items-start text-left ${textMaxWidth}`}>
            <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 whitespace-pre-wrap text-justify">
              {text}
            </p>
            
            <button 
              onClick={() => setIsOpen(true)} 
              className="flex flex-row items-center justify-center px-[16px] py-[8px] gap-[10px] bg-[#444B55] rounded-[14px] shadow-[0_0_4px_rgba(218,220,222,0.2)] hover:scale-105 transition-transform cursor-pointer border-none"
            >
              <span className="font-inter font-medium text-[16px] leading-[29px] text-white">View details</span>
              <img src="/assets/Review settings/Expand.svg" alt="Expand" className="w-[24px] h-[24px] object-contain" />
            </button>
          </div>
        </div>

      </div>

      {/* Fullscreen Draggable Overlay */}
      {isOpen && (
        <div ref={constraintsRef} className="fixed inset-0 z-[100] bg-[#f5f7f9] overflow-hidden">
          
          {/* Static Close Button */}
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

          {/* Hidden image to trigger load */}
          {fullscreenSrc && !isImgLoaded && (
            <img 
              src={fullscreenSrc} 
              className="hidden" 
              onLoad={handleImageLoad} 
              alt="Preload" 
            />
          )}

          {/* Loading Indicator */}
          {fullscreenSrc && !isImgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
               <span className="font-inter font-medium text-[16px] text-[#535F6F] bg-white/80 px-[24px] py-[12px] rounded-[12px] shadow-sm backdrop-blur-sm">
                 Loading image...
               </span>
            </div>
          )}

          {/* Draggable Canvas - Using the proven logic from ImageShowcase */}
          {(!fullscreenSrc || isImgLoaded) && (
            <motion.div 
              drag 
              dragConstraints={constraintsRef}
              initial={{ x: 0, y: 0, scale: 0.85 }}
              style={{ x, y, originX: 0, originY: 0 }}
              className="absolute top-0 left-0 cursor-grab active:cursor-grabbing z-10"
            >
              {fullscreenSrc ? (
                <img src={fullscreenSrc} alt="Expanded View" className="max-w-none pointer-events-none select-none" />
              ) : (
                <div className="w-[800px] h-[600px] flex items-center justify-center border border-gray-300 rounded-xl bg-white shadow-xl">
                  <span className="font-inter text-[#535F6F]">Image not found</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Minimap / Navigator */}
          {isOpen && isImgLoaded && fullscreenSrc && (
            <div className="fixed bottom-8 left-8 w-[240px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[120]">
              <div className="relative w-full h-full">
                {/* Minimap Image */}
                <img 
                  src={fullscreenSrc} 
                  alt="Minimap" 
                  className="w-full h-auto object-contain pointer-events-none select-none" 
                />
                {/* Highlight Box */}
                <motion.div 
                  className="absolute top-0 left-0 border-2 border-gray-800 bg-gray-800/30 pointer-events-none"
                  style={{
                    width: highlightWidth,
                    height: highlightHeight,
                    x: highlightX,
                    y: highlightY,
                  }}
                />
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default DesignShow;
