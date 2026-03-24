import React, { useRef, useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
  className?: string;
  imageClassName?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  images, 
  className = "h-[551px]", 
  imageClassName = "h-full w-auto" 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [images]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.7; // Scrolls most of the view
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative w-full flex items-center group ${className}`}>
      <div 
        ref={scrollRef} 
        onScroll={checkScroll}
        className="flex flex-row items-center h-full w-full px-[24px] py-[24px] gap-[32px] overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {images.map((src, index) => (
          <img 
            key={index}
            src={src} 
            alt={`Carousel item ${index + 1}`} 
            className={`${imageClassName} object-contain shrink-0 snap-center pointer-events-none select-none`} 
          />
        ))}
      </div>
      
      {canScrollLeft && (
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#000000]/20 rounded-full flex items-center justify-center z-10 hover:bg-[#000000]/30 transition-colors"
          aria-label="Scroll left"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button 
          onClick={() => scroll('right')} 
          className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-[#000000]/20 rounded-full flex items-center justify-center z-10 hover:bg-[#000000]/30 transition-colors"
          aria-label="Scroll right"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};
