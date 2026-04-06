import React from 'react';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="flex flex-row items-center gap-[16px]">
      
      {/* Title Holder & Icon */}
      <div className="flex flex-row items-center gap-[10px] w-[21px] h-[34px] shrink-0">
        <img 
          src="/assets/Review settings/title-icon.svg" 
          alt="Section Icon" 
          className="w-[21px] h-[24px]" 
        />
      </div>

      {/* Title Text */}
      {/* Using whitespace-pre to strictly enforce exactly 2 spaces between the slash and the text */}
      <h2 className="font-['Perfectly_Nineties'] font-semibold text-[32px] leading-[34px] tracking-[0.01em] text-[#192434] m-0 whitespace-pre">
        {`/  ${title}`}
      </h2>
      
    </div>
  );
};

export default SectionTitle;
