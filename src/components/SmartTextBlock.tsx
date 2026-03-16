"use client";

import React, { useState, useRef, useEffect } from 'react';

export interface SmartTextBlockProps {
  originalText: string;
  summaryText: string;
}

const STAR_SVG_PATH = "M9.01151 0C9.24464 0 9.42857 0.195443 9.42857 0.428571C9.42857 4.92575 13.0743 8.57143 17.5714 8.57143C17.8046 8.57143 18 8.75536 18 8.98849V9.0107C18 9.24381 17.8045 9.42857 17.5714 9.42857C13.0743 9.42857 9.42857 13.0743 9.42857 17.5714C9.42857 17.8046 9.24464 18 9.01151 18H8.98849C8.75536 18 8.57143 17.8046 8.57143 17.5714C8.57143 13.0743 4.92575 9.42857 0.428571 9.42857C0.195454 9.42857 0 9.24381 0 9.0107V8.98849C0 8.75536 0.195443 8.57143 0.428571 8.57143C4.92575 8.57143 8.57143 4.92575 8.57143 0.428571C8.57143 0.195443 8.75536 0 8.98849 0H9.01151Z";
const STAR_MASK_BASE64 = `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCI+PHBhdGggZD0iTTkuMDExNTEgMEM5LjI0NDY0IDAgOS40Mjg1NyAwLjE5NTQ0MyA5LjQyODU3IDAuNDI4NTcxQzkuNDI4NTcgNC45MjU3NSAxMy4wNzQzIDguNTcxNDMgMTcuNTcxNCA4LjU3MTQzQzE3LjgwNDYgOC41NzE0MyAxOCA4Ljc1NTM2IDE4IDguOTg4NDlWOS4wMTA3QzE4IDkuMjQzODEgMTcuODA0NSA5LjQyODU3IDE3LjU3MTQgOS40Mjg1N0MxMy4wNzQzIDkuNDI4NTcgOS40Mjg1NyAxMy4wNzQzIDkuNDI4NTcgMTcuNTcxNEM5LjQyODU3IDE3LjgwNDYgOS4yNDQ2NCAxOCA5LjAxMTUxIDE4SDguOTg4NDlDOC43NTUzNiAxOCA4LjU3MTQzIDE3LjgwNDYgOC41NzE0MyAxNy41NzE0QzguNTcxNDMgMTMuMDc0MyA0LjkyNTc1IDkuNDI4NTcgMC40Mjg1NzEgOS40Mjg1N0MwLjE5NTQ1NCA5LjQyODU3IDAgOS4yNDM4MSAwIDkuMDEwN1Y4Ljk4ODQ5QzAgOC43NTUzNiAwLjE5NTQ0MyA4LjU3MTQzIDAuNDI4NTcxIDguNTcxNDNDNC45MjU3NSA4LjU3MTQzIDguNTcxNDMgNC45MjU3NSA4LjU3MTQzIDAuNDI4NTcxQzguNTcxNDMgMC4xOTU0NDMgOC43NTUzNiAwIDguOTg4NDkgMEg5LjAxMTUxWiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=`;

export const SmartTextBlock: React.FC<SmartTextBlockProps> = ({ originalText, summaryText }) => {
  const [isSummarized, setIsSummarized] = useState(false);
  const [displayedText, setDisplayedText] = useState(originalText);
  const [showCursor, setShowCursor] = useState(false);
  
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
    };
  }, []);

  const clearTimeouts = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
  };

  const handleToggle = () => {
    if (isSummarized) {
      // Revert to original
      setIsSummarized(false);
      clearTimeouts();
      setShowCursor(false);
      setDisplayedText(originalText);
    } else {
      // Summarize
      setIsSummarized(true);
      setDisplayedText("");
      setShowCursor(true);
      
      clearTimeouts();

      let charIndex = 0;
      typingIntervalRef.current = setInterval(() => {
        charIndex++;
        setDisplayedText(summaryText.substring(0, charIndex));
        
        if (charIndex >= summaryText.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          cursorTimeoutRef.current = setTimeout(() => {
            setShowCursor(false);
          }, 1400); // exactly 1400ms after typing finished
        }
      }, 15);
    }
  };

  const MASK_URL = `url('data:image/svg+xml;base64,${STAR_MASK_BASE64}')`;

  return (
    <div className="flex flex-col w-full max-w-[960px] mx-auto">
      <style>{`
        @keyframes bgFlow {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        .animate-bgFlow {
          animation: bgFlow 2s linear infinite;
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blinkCursor 0.8s step-end infinite;
        }
        @keyframes starSparkle {
          0% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 0 transparent); animation-timing-function: ease-out; }
          12.5% { transform: rotate(45deg) scale(1.3); filter: drop-shadow(0 0 4px rgba(253,98,83,0.8)); animation-timing-function: ease-in; }
          25% { transform: rotate(90deg) scale(1); filter: drop-shadow(0 0 0 transparent); animation-timing-function: ease-out; }
          37.5% { transform: rotate(135deg) scale(1.3); filter: drop-shadow(0 0 4px rgba(253,98,83,0.8)); animation-timing-function: ease-in; }
          50% { transform: rotate(180deg) scale(1); filter: drop-shadow(0 0 0 transparent); animation-timing-function: ease-out; }
          62.5% { transform: rotate(225deg) scale(1.3); filter: drop-shadow(0 0 4px rgba(253,98,83,0.8)); animation-timing-function: ease-in; }
          75% { transform: rotate(270deg) scale(1); filter: drop-shadow(0 0 0 transparent); animation-timing-function: ease-out; }
          87.5% { transform: rotate(315deg) scale(1.3); filter: drop-shadow(0 0 4px rgba(253,98,83,0.8)); animation-timing-function: ease-in; }
          100% { transform: rotate(360deg) scale(1); filter: drop-shadow(0 0 0 transparent); }
        }
        .group:hover .animate-starSparkle {
          animation: starSparkle 3.2s linear infinite;
        }

        /* Unified flow that spans EXACTLY 150px, so both mask and clip-text move exactly at the same simulated speed and spatial position */
        @keyframes bgFlowSeamless {
          0% { background-position: 0px center; }
          100% { background-position: -150px center; }
        }
        .animate-bgFlowSeamless {
          animation: bgFlowSeamless 2s linear infinite;
        }
      `}</style>
      
      <div className="flex w-full justify-end">
        <button 
          onClick={handleToggle}
          className="group relative flex items-center cursor-pointer ml-auto"
          aria-label={isSummarized ? "Elaborate text" : "Summarize text"}
        >
          {/* Default State (always rendered, base text) */}
          <div className="flex items-center gap-[6px] text-grey-60 font-inter font-bold transition-opacity duration-300 group-hover:opacity-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d={STAR_SVG_PATH} />
            </svg>
            <span className="relative grid place-items-center">
              <span className="invisible pointer-events-none select-none" aria-hidden="true">Summarize</span>
              <span className={`absolute whitespace-nowrap transition-opacity duration-300 ${isSummarized ? "opacity-0" : "opacity-100"}`}>Summarize</span>
              <span className={`absolute whitespace-nowrap transition-opacity duration-300 ${isSummarized ? "opacity-100" : "opacity-0"}`}>Elaborate</span>
            </span>
          </div>

          {/* Hover State (Overlay) */}
          <div className="absolute inset-0 flex items-center gap-[6px] opacity-0 group-hover:opacity-100 pointer-events-none font-inter font-bold transition-opacity duration-300">
            <div 
              className="w-[18px] h-[18px] shrink-0 bg-gradient-to-r from-[#FCC378] via-[#FD6253] to-[#FCC378] bg-[length:150px_auto] animate-bgFlowSeamless animate-starSparkle"
              style={{
                WebkitMaskImage: MASK_URL,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: MASK_URL,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center"
              }}
              aria-hidden="true"
            />
            <span className="relative grid place-items-center">
              <span className="invisible pointer-events-none select-none" aria-hidden="true">Summarize</span>
              <span className={`absolute whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#FCC378] via-[#FD6253] to-[#FCC378] bg-[length:150px_auto] animate-bgFlowSeamless transition-opacity duration-300 ${isSummarized ? "opacity-0" : "opacity-100"}`}>Summarize</span>
              <span className={`absolute whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#FCC378] via-[#FD6253] to-[#FCC378] bg-[length:150px_auto] animate-bgFlowSeamless transition-opacity duration-300 ${isSummarized ? "opacity-100" : "opacity-0"}`}>Elaborate</span>
            </span>
          </div>
        </button>
      </div>

      <div className="mt-[2px]">
        <p className="text-body-r m-0 whitespace-pre-wrap">
          {displayedText}
          {showCursor && (
            <span className="animate-blink font-bold ml-[1px] inline-block font-inter text-grey-70">
              |
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SmartTextBlock;
