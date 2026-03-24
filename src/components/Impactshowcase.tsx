"use client";

import React, { useState } from 'react';

export default function Impactshowcase() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full max-w-[960px] bg-white border border-[#DADCDE]/60 shadow-[0_0_4px_rgba(218,220,222,0.2)] rounded-[12px] flex flex-col overflow-hidden">
            <div className="w-full flex flex-col px-[24px] pt-[14px] pb-[16px] gap-[12px]">
                <div className="flex flex-row items-center gap-[12px]">
                    <div className="w-[24px] h-[24px] bg-[#F5F7F9] border border-[#DADCDE] rounded-[4px] flex items-center justify-center shrink-0">
                        {/* Placeholder SVG */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#535F6F]">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[16px] font-medium text-[#243244] leading-[1.2]">Review Cycle creation success</span>
                        <span className="text-[14px] text-[#535F6F] leading-[1.2] mt-[2px]">Validate usability improvement</span>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-[#DADCDE]/60" />

                <div className="flex flex-row gap-[56px] w-full">
                    <div className="flex flex-col flex-1 gap-[8px]">
                        <div className="text-[12px] font-semibold text-[#3D495A]">Metric</div>
                        <div className="flex flex-col gap-[8px] text-[16px] text-[#535F6F]">
                            <div>Completion rate</div>
                            <div>Median creation time</div>
                            <div>Drop-off by each step</div>
                            <div>Step revisit frequency</div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-[8px]">
                        <div className="text-[12px] font-semibold text-[#3D495A]">Before</div>
                        <div className="flex flex-col gap-[8px] text-[16px] text-[#535F6F]">
                            <div>58–62%</div>
                            <div>18–22 min</div>
                            <div>~</div>
                            <div>2.6</div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-[8px]">
                        <div className="text-[12px] font-semibold text-[#3D495A]">After</div>
                        <div className="flex flex-col gap-[8px] text-[16px] text-[#535F6F]">
                            <div>78–83%</div>
                            <div>11–14 min</div>
                            <div>0.7 median</div>
                            <div>1.4</div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-[8px]">
                        <div className="text-[12px] font-semibold text-[#3D495A]">Impact</div>
                        <div className="flex flex-col gap-[8px] text-[16px] text-[#535F6F]">
                            <div>Reduced friction</div>
                            <div>Faster ToT</div>
                            <div>Clearer configuration</div>
                            <div>Lower cognitive load</div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-[#DADCDE]/60" />

                <div className="flex flex-col w-full">
                    <div className="text-[12px] font-semibold text-[#3D495A]">Widgets created</div>
                    <div className="flex flex-row gap-[66px] mt-2">
                        <div className="w-[423px] text-[16px] text-[#535F6F] flex items-start">
                            Journey Funnel: Start &gt; Basic Settings &gt; Reviewees &gt; Templates &gt; Calibration &gt; Timelines &gt; Results &gt; Summary &gt; Launch
                        </div>
                        <div className="w-[423px] flex flex-col gap-[8px] text-[16px] text-[#535F6F]">
                            <div>Back navigation frequency</div>
                            <div>Median Review Cycle creation time</div>
                            <div>Drop-off by each step</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#F5F7F9]/40 border-t border-[#DADCDE]/60 flex flex-col">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-[24px] py-[16px] flex flex-row items-center border-none bg-transparent cursor-pointer"
                >
                    <div className="w-[500px] text-left text-[16px] text-[#535F6F]">Filters/Properties</div>
                    <div className="w-[392px] text-left text-[16px] text-[#535F6F]">Instrumentation Events</div>
                    <div className="ml-auto flex items-center justify-center">
                        <svg 
                            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                            className="text-[#535F6F] transition-transform duration-300"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </button>

                {isExpanded && (
                    <div className="w-full px-[24px] pb-[16px] flex flex-row pt-2">
                        <div className="w-[500px] flex flex-col gap-3 text-[12px] text-[#535F6F]">
                            <div>organization size</div>
                            <div>cycle type</div>
                            <div>views used</div>
                            <div>Review design used</div>
                            <div>template type</div>
                            <div>creation time seconds</div>
                        </div>
                        <div className="w-[412px] flex flex-row gap-[50px]">
                            <div className="flex flex-col gap-[12px] text-[12px] text-[#535F6F]">
                                <div>cycle_creation_started</div>
                                <div>first_time</div>
                                <div>review_design_used</div>
                                <div>cycle_basic_settings</div>
                                <div>employee_count</div>
                                <div>reviewees_configured</div>
                                <div>reviewers_configured</div>
                            </div>
                            <div className="flex flex-col gap-[12px] text-[12px] text-[#535F6F]">
                                <div>cycle_launched</div>
                                <div>templates_selected</div>
                                <div>calibration_configured</div>
                                <div>results_configured</div>
                                <div>timeline_reviewed</div>
                                <div>cycle_summary_viewed</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
