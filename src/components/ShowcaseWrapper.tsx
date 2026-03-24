import React from 'react';

interface ShowcaseWrapperProps {
  children: React.ReactNode;
  legendTitle: string;
}

export const ShowcaseWrapper: React.FC<ShowcaseWrapperProps> = ({ children, legendTitle }) => {
  return (
    <div className="w-[960px] flex flex-col bg-[#F5F7F9]/40 border border-[#DADCDE]/60 shadow-[0_0_4px_rgba(218,220,222,0.2)] rounded-[12px] overflow-hidden">
      <div className="w-full min-h-[396px] relative overflow-hidden">
        {children}
      </div>
      <div className="w-full h-[38px] border-t border-[#DADCDE]/60 px-[16px] pt-[10px] pb-[8px] flex items-center">
        <span className="font-inter font-normal text-[16px] leading-[19px] text-[#535F6F]">
          {legendTitle}
        </span>
      </div>
    </div>
  );
};
