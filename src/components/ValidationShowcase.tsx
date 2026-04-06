import React from 'react';

const ValidationShowcase = () => {
  return (
    <section className="w-full flex justify-center py-16 bg-white">
      <div className="w-full max-w-[960px] flex flex-col items-start gap-[24px]">
        
        {/* ==================== QUANTITATIVE VALIDATION ==================== */}
        <div className="w-full flex flex-col items-start gap-[4px]">
          <h3 className="font-inter font-medium text-[16px] leading-[29px] text-[#3D495A] m-0">
            Quantitative Validation
          </h3>
          
          <div className="w-full flex flex-col items-start">
            <p className="w-full font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 mb-[16px]">
              To understand where users struggled during Review Cycle Creation, I partnered with product to study Mixpanel metrics. The objective was to quantify friction across the configuration steps. After stepwise funnel metrics tracking, this revealed a clear gap between completed and dropped off review cycle configuration.
            </p>
            
            {/* Metrics Grid */}
            <div className="w-full flex flex-row items-center py-[16px] gap-[16px]">
              {/* Metric 1 */}
              <div className="flex-1 flex flex-col items-start p-[16px] gap-[4px] bg-[#FFE1D9]/40 border border-[#FFE1D9] rounded-[12px] h-[83px]">
                <span className="font-inter font-semibold text-[24px] leading-[29px] text-[#C62C02]">58–62%</span>
                <span className="font-inter font-normal text-[14px] leading-[18px] text-[#535F6F]">Completion vs abandonment</span>
              </div>
              {/* Metric 2 */}
              <div className="flex-1 flex flex-col items-start p-[16px] gap-[4px] bg-[#FFE1D9]/40 border border-[#FFE1D9] rounded-[12px] h-[83px]">
                <span className="font-inter font-semibold text-[24px] leading-[29px] text-[#C62C02]">2 Steps</span>
                <span className="font-inter font-normal text-[14px] leading-[18px] text-[#535F6F]">Avg. drop-off concentration</span>
              </div>
              {/* Metric 3 */}
              <div className="flex-1 flex flex-col items-start p-[16px] gap-[4px] bg-[#FFE1D9]/40 border border-[#FFE1D9] rounded-[12px] h-[83px]">
                <span className="font-inter font-semibold text-[24px] leading-[29px] text-[#C62C02]">2.6x</span>
                <span className="font-inter font-normal text-[14px] leading-[18px] text-[#535F6F]">Revisits per session</span>
              </div>
              {/* Metric 4 */}
              <div className="flex-1 flex flex-col items-start p-[16px] gap-[4px] bg-[#FFE1D9]/40 border border-[#FFE1D9] rounded-[12px] h-[83px]">
                <span className="font-inter font-semibold text-[24px] leading-[29px] text-[#C62C02]">0.8</span>
                <span className="font-inter font-normal text-[14px] leading-[18px] text-[#535F6F]">Validation errors avg/step</span>
              </div>
            </div>
            
            <p className="w-full font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 mt-[16px]">
              These signals indicated that friction was due to navigation difficulty, decision complexity and unclear configuration settings.
            </p>
          </div>
        </div>

        {/* Data Suggested vs Focused Design */}
        <div className="w-full flex flex-row items-center pt-[8px] gap-[16px]">
          {/* Left */}
          <div className="flex-1 flex flex-col items-start gap-[6px]">
            <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">Data suggested that users are:</h4>
            <div className="w-full flex flex-row items-start gap-[12px] h-[116px]">
              <div className="w-[6px] h-full bg-[#FFE1D9] rounded-[4px] shrink-0"></div>
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 flex-1">
                Hesitating before committing configuration decisions.<br/>Revisiting steps due to dependencies.<br/>Struggling to form a clear mental model of cycle.
              </p>
            </div>
          </div>
          {/* Right */}
          <div className="flex-1 flex flex-col items-start gap-[6px]">
            <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">So I focused creating a design that has:</h4>
            <div className="w-full flex flex-row items-center gap-[12px] h-[116px]">
              <div className="w-[6px] h-full bg-[#DBF2D3] rounded-[4px] shrink-0"></div>
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 flex-1">
                Progressive disclosure of settings.<br/>Modular configuration.<br/>Decision guidance using tooltips.<br/>Reusable default settings.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#DADCDE]/60 my-[24px]"></div>

        {/* ==================== QUALITATIVE AND STRUCTURE VALIDATION ==================== */}
        <div className="w-full flex flex-col items-start gap-[24px]">
          <div className="w-full flex flex-col items-start gap-[4px]">
            <h3 className="font-inter font-medium text-[16px] leading-[29px] text-[#3D495A] m-0">Qualitative and Structure Validation</h3>
            <div className="w-full flex flex-col items-start">
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 mb-[8px]">
                Mental Model Interviews with People Science founder, CSMs.
              </p>
              
              <div className="w-full flex flex-row items-center pt-[8px] gap-[16px]">
                {/* Left */}
                <div className="flex-1 flex flex-col items-start gap-[6px]">
                  <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">Interview outcomes:</h4>
                  <div className="w-full flex flex-row items-start gap-[12px] h-[140px]">
                    <div className="w-[6px] h-full bg-[#FFE1D9] rounded-[4px] shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center gap-[10px] h-full">
                      <p className="font-inter font-normal text-[16px] leading-[24px] text-[#535F6F] m-0">Users conceptualized review cycles as phases, not configuration forms.</p>
                      <p className="font-inter font-normal text-[16px] leading-[24px] text-[#535F6F] m-0">Dependencies between rating settings, deliverables and calibration were poorly understood.</p>
                      <p className="font-inter font-normal text-[16px] leading-[24px] text-[#535F6F] m-0">Confidence was strongly tied to visibility of timelines</p>
                    </div>
                  </div>
                </div>
                {/* Right */}
                <div className="flex-1 flex flex-col items-start gap-[6px]">
                  <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">So I focused creating a design that has:</h4>
                  <div className="w-full flex flex-row items-start gap-[12px] h-[140px]">
                    <div className="w-[6px] h-full bg-[#DBF2D3] rounded-[4px] shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-center h-full">
                      <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
                        Structured sequencing.<br/>Clearer dependency communication.<br/>Timeline-driven configuration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sketches Grid */}
          <div className="w-full flex flex-row justify-between items-end">
            <div className="w-[186px] h-[148px] rounded-[12px] bg-[#F5F7F9]/40 -rotate-[4.94deg]"></div>
            <div className="w-[186px] h-[148px] rounded-[12px] bg-[#F5F7F9]/40 rotate-[1.5deg]"></div>
            <div className="w-[186px] h-[148px] rounded-[12px] bg-[#F5F7F9]/40 rotate-[2.09deg]"></div>
            <div className="w-[186px] h-[148px] rounded-[12px] bg-[#F5F7F9]/40 rotate-[2.09deg]"></div>
            <div className="w-[186px] h-[148px] rounded-[12px] bg-[#F5F7F9]/40 rotate-[2.09deg]"></div>
          </div>

          {/* ==================== IA & A/B TESTING ==================== */}
          <div className="w-full flex flex-col items-start gap-[16px] mt-[16px]">
            <div className="w-full flex flex-col items-start">
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
                Information Architecture Tree Testing was conducted to validate whether users could correctly locate and interpret settings.
              </p>
              
              <div className="w-full flex flex-row items-center pt-[4px] gap-[16px]">
                {/* Left */}
                <div className="flex-1 flex flex-col items-start gap-[6px]">
                  <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">Key outcomes:</h4>
                  <div className="w-full flex flex-row items-start gap-[12px] h-[116px]">
                    <div className="w-[6px] h-full bg-[#FFE1D9] rounded-[4px] shrink-0"></div>
                    <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 flex-1">
                      Calibration and rating settings were frequently mis-grouped.<br/>Users expected settings to be applied across Views.<br/>Timeline was perceived as the anchor for all decisions.
                    </p>
                  </div>
                </div>
                {/* Right */}
                <div className="flex-1 flex flex-col items-start gap-[6px]">
                  <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">Validated the need for:</h4>
                  <div className="w-full flex flex-row items-start gap-[12px] h-[116px]">
                    <div className="w-[6px] h-full bg-[#DBF2D3] rounded-[4px] shrink-0"></div>
                    <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0 flex-1">
                      Reorganizing settings hierarchy.<br/>Aligning with user mental models.<br/>Elevating timeline visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* A/B validation testing */}
            <div className="w-full flex flex-col items-start gap-[4px] mt-[16px]">
              <h4 className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">A/B validation testing</h4>
              
              <div className="flex flex-col items-start gap-[10px] w-[434px]">
                {/* Row 1 */}
                <div className="w-full flex flex-row items-center gap-[12px]">
                  <div className="flex-1 flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">Sequential flow</span>
                  </div>
                  <span className="font-inter font-normal text-[16px] text-[#535F6F]">vs</span>
                  <div className="flex-[1.2] flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">Dense configuration flow</span>
                  </div>
                </div>
                {/* Row 2 */}
                <div className="w-full flex flex-row items-center gap-[12px]">
                  <div className="flex-[1.2] flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">Template-assisted setup</span>
                  </div>
                  <span className="font-inter font-normal text-[16px] text-[#535F6F]">vs</span>
                  <div className="flex-1 flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">manual setup</span>
                  </div>
                </div>
                {/* Row 3 */}
                <div className="w-full flex flex-row items-center gap-[12px]">
                  <div className="flex-[0.6] flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">Views</span>
                  </div>
                  <span className="font-inter font-normal text-[16px] text-[#535F6F]">vs</span>
                  <div className="flex-[1.4] flex justify-center items-center px-[12px] py-[4px] border border-[#DADCDE]/60 rounded-[12px]">
                    <span className="font-inter font-normal text-[16px] text-[#3D495A]">Multiple review cycles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CONCLUSION ==================== */}
        <div className="w-full h-[1px] bg-[#DADCDE]/60 my-[24px]"></div>
        
        <div className="w-full flex justify-center items-center">
          <p className="w-[730px] font-inter italic font-medium text-[16px] leading-[29px] text-center text-[#243244] m-0">
            With cumulative knowledge of the user interviews and feedbacks, competitive analysis and Mixpanel metrics a high level Review philosophy of businesses was made.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ValidationShowcase;
