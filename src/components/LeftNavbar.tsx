import React from "react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const NavItem = ({ label, href = "#", active = false, onClick }: NavItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group w-[256px] flex items-center py-[12px] px-[24px] transition-colors duration-200 ease-in-out ${
        active
          ? "text-grey-90 font-semibold"
          : "text-grey-60 font-normal hover:text-grey-90"
      }`}
    >
      {/* Text Container */}
      <div className="max-w-[145px] font-[Inter] text-[16px] leading-[20px]">
        {label}
      </div>

      {/* Active State Indicator */}
      {active && (
        <div className="flex-1 flex items-center justify-end">
          <div className="w-[24px] h-[4px] bg-grey-80 rounded-[2px]" />
        </div>
      )}
    </Link>
  );
};
