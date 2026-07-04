"use client";

import React from 'react';

export default function FooterBar() {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center px-6 mb-9">
      {/* Left Side (Logo) */}
      <div className="w-[136px] h-[60px]">
        <img src="/logofull.svg" alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Right Side (Links & Copyright) */}
      <div className="flex flex-col items-center md:items-end gap-4">
        {/* Top Row (Social Icons) */}
        <div className="flex flex-row items-center gap-[18px]">
          <a
            href="https://www.linkedin.com/in/harshapeddinti/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="w-6 h-6">
              <img src="/linkedin.svg" alt="LinkedIn" className="w-full h-full object-contain" />
            </div>
          </a>
          <a
            href="https://x.com/omgsumbody"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="w-6 h-6">
              <img src="/twitter.svg" alt="Twitter" className="w-full h-full object-contain" />
            </div>
          </a>
          <a
            href="https://www.behance.net/harshapeddinti"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <div className="w-6 h-6">
              <img src="/behance.svg" alt="Behance" className="w-full h-full object-contain" />
            </div>
          </a>
        </div>

        {/* Bottom Row (Copyright) */}
        <div className="flex flex-row items-start gap-1">
          <div className="w-[20px] h-[20px]">
            <img src="/Copyright.svg" alt="Copyright" className="w-full h-full object-contain" />
          </div>
          <span className="font-sans font-normal text-base text-[#192434]">
            Harshapeddintidesign. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
