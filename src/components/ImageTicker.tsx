import React from 'react';
import Image from 'next/image';

const ImageTicker: React.FC = () => {
    // 6 placeholder images as requested
    const placeholderImages = [
        { id: 1, src: '/placeholder.png', alt: 'Placeholder 1' },
        { id: 2, src: '/placeholder.png', alt: 'Placeholder 2' },
        { id: 3, src: '/placeholder.png', alt: 'Placeholder 3' },
        { id: 4, src: '/placeholder.png', alt: 'Placeholder 4' },
        { id: 5, src: '/placeholder.png', alt: 'Placeholder 5' },
        { id: 6, src: '/placeholder.png', alt: 'Placeholder 6' },
    ];

    // Duplicate the array of images inside the scrolling track so the infinite loop is seamless.
    const scrollingImages = [...placeholderImages, ...placeholderImages];

    return (
        <div className="w-full max-w-[960px] h-[158px] rounded-[12px] bg-[#f5f7f9] overflow-hidden border border-[#D9DCDE]/50 shadow-[0px_0px_2px_0px_rgba(217,220,222,0.4)] relative flex items-center group/ticker">
            
            {/* Left Edge Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-[24px] bg-gradient-to-r from-[#f5f7f9] to-transparent z-10 pointer-events-none"></div>
            
            {/* Right Edge Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-[24px] bg-gradient-to-l from-[#f5f7f9] to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div className="flex animate-ticker min-w-max gap-[18px] group-[&:hover]:[animation-play-state:paused] pause-hover">
                {scrollingImages.map((img, index) => (
                    <div 
                        key={`${img.id}-${index}`} 
                        className="h-[158px] shrink-0 flex items-center justify-center p-4 bg-white/50 border border-grey-10 rounded-lg w-[200px]"
                    >
                        <div className="text-grey-40 font-inter text-sm font-medium">Image {img.id}</div>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default ImageTicker;
