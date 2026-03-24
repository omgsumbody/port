import React from 'react';

const ValidationShowcase = () => {
  return (
    <section className="w-full flex justify-center py-16 border-t border-[#DADCDE]/60 bg-white">
      <div className="w-full max-w-[960px]">
        {/* Step 2: Quantitative Validation */}
        <h3 className="text-[24px] font-medium text-[#192434] mb-4">Quantitative Validation</h3>
        <p className="font-inter text-[16px] leading-[26px] text-[#3D495A] mb-8">
          To understand where users struggled during Review Cycle Creation, I partnered with product to study Mixpanel metrics. The objective was to quantify friction across the configuration steps. After stepwise funnel metrics tracking, this revealed a clear gap between completed and dropped off review cycle configuration.
        </p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[16px]">
            <div className="text-[32px] font-semibold text-[#192434] leading-tight mb-2">58–62%</div>
            <div className="text-[14px] text-[#3D495A]">Completion vs abandonment</div>
          </div>
          <div className="bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[16px]">
            <div className="text-[32px] font-semibold text-[#192434] leading-tight mb-2">2 Steps</div>
            <div className="text-[14px] text-[#3D495A]">Avg. drop-off concentration</div>
          </div>
          <div className="bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[16px]">
            <div className="text-[32px] font-semibold text-[#192434] leading-tight mb-2">2.6x</div>
            <div className="text-[14px] text-[#3D495A]">Revisits per session</div>
          </div>
          <div className="bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[16px]">
            <div className="text-[32px] font-semibold text-[#192434] leading-tight mb-2">0.8</div>
            <div className="text-[14px] text-[#3D495A]">Validation errors avg/step</div>
          </div>
        </div>

        <p className="font-inter text-[16px] leading-[26px] text-[#3D495A] mb-8">
          These signals indicated that friction was due to navigation difficulty, decision complexity and unclear configuration settings.
        </p>

        {/* Step 3: Translation Block */}
        <div className="flex flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <h4 className="font-medium text-[#192434] mb-4">Data suggested that users are:</h4>
            <ul className="border-l-2 border-[#DADCDE] pl-4 mb-4 flex flex-col gap-2 m-0">
              <li className="text-[16px] text-[#3D495A]">Hesitating before committing configuration decisions.</li>
              <li className="text-[16px] text-[#3D495A]">Revisiting steps due to dependencies.</li>
              <li className="text-[16px] text-[#3D495A]">Struggling to form a clear mental model of cycle.</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="flex-1 bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-md">
            <h4 className="font-medium text-[#192434] m-0 bg-[#F5F7F9]/40 p-4 rounded-t-md border-b border-[#DADCDE]/60">
              So I focused creating a design that has:
            </h4>
            <ul className="p-4 list-disc pl-8 flex flex-col gap-2 m-0 text-[#3D495A]">
              <li>Progressive disclosure of settings.</li>
              <li>Modular configuration.</li>
              <li>Decision guidance using tooltips.</li>
              <li>Reusable default settings.</li>
            </ul>
          </div>
        </div>

        {/* Step 4: Qualitative & Structure Validation */}
        <div className="mt-16">
          <h3 className="text-[24px] font-medium text-[#192434] mb-2">Qualitative and Structure Validation</h3>
          <p className="font-inter text-[16px] text-[#3D495A] mb-8">Mental Model Interviews with People Science founder, CSMs.</p>

          {/* Insights Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-3">
              <svg className="w-8 h-8 text-[#192434]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <p className="text-[15px] text-[#3D495A]">Users conceptualized review cycles as phases, not configuration forms.</p>
            </div>
            <div className="flex flex-col gap-3">
              <svg className="w-8 h-8 text-[#192434]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <p className="text-[15px] text-[#3D495A]">Dependencies between rating settings, deliverables and calibration were poorly understood.</p>
            </div>
            <div className="flex flex-col gap-3">
              <svg className="w-8 h-8 text-[#192434]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <p className="text-[15px] text-[#3D495A]">Confidence was strongly tied to visibility of timelines.</p>
            </div>
          </div>

          {/* Mandate Checklist */}
          <div className="bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[24px]">
            <h4 className="font-medium text-[#192434] mb-4">Validated the need for:</h4>
            <ul className="flex flex-col gap-3 m-0">
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Structured sequencing.
              </li>
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Clearer dependency communication.
              </li>
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Timeline-driven configuration.
              </li>
            </ul>
          </div>
        </div>

        {/* Step 5: The Artifact Desk (Sketches) */}
        <div className="flex flex-row justify-center gap-4 mt-8 mb-16 [perspective:1000px]">
          <img src="/sketch-1.jpg" alt="Sketch 1" className="w-1/3 aspect-[4/3] object-cover rounded-md border border-[#DADCDE] shadow-md -rotate-2" />
          <img src="/sketch-2.jpg" alt="Sketch 2" className="w-1/3 aspect-[4/3] object-cover rounded-md border border-[#DADCDE] shadow-md rotate-1" />
          <img src="/sketch-3.jpg" alt="Sketch 3" className="w-1/3 aspect-[4/3] object-cover rounded-md border border-[#DADCDE] shadow-md -rotate-1" />
        </div>

        {/* Step 6: IA & A/B Testing */}
        <h3 className="text-[24px] font-medium text-[#192434] mb-4">IA & A/B Testing</h3>
        <p className="font-inter text-[16px] text-[#3D495A] mb-8">
          Information Architecture Tree Testing was conducted to validate whether users could correctly locate and interpret settings.
        </p>

        <div className="flex flex-row gap-8 mb-12">
          {/* Left Column */}
          <div className="flex-1">
            <h4 className="font-medium text-[#192434] mb-4">Key Outcomes</h4>
            <ol className="list-decimal pl-5 flex flex-col gap-3 m-0 text-[#3D495A]">
              <li>Calibration and rating settings were frequently mis-grouped.</li>
              <li>Users expected settings to be applied across Views.</li>
              <li>Timeline was perceived as the anchor for all decisions.</li>
            </ol>
          </div>

          {/* Right Column */}
          <div className="flex-1 bg-[#F5F7F9]/40 border border-[#DADCDE]/60 rounded-[8px] p-[24px]">
            <h4 className="font-medium text-[#192434] mb-4">Validated the need for:</h4>
            <ul className="flex flex-col gap-3 m-0">
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Reorganizing settings hierarchy.
              </li>
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Aligning with user mental models.
              </li>
              <li className="flex items-center gap-2 text-[#3D495A]">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Elevating timeline visibility.
              </li>
            </ul>
          </div>
        </div>

        <h4 className="text-[20px] font-medium text-[#192434] mb-4">A/B validation testing</h4>
        
        <div className="flex flex-col gap-3 mt-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Sequential flow</span> 
            <span className="text-[12px] text-gray-400 font-mono">VS</span> 
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Dense configuration flow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Template-assisted</span> 
            <span className="text-[12px] text-gray-400 font-mono">VS</span> 
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Manual setup</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Views</span> 
            <span className="text-[12px] text-gray-400 font-mono">VS</span> 
            <span className="px-3 py-1 bg-white border border-[#DADCDE] rounded-full text-[14px] text-[#3D495A] shadow-sm">Multiple review cycles</span>
          </div>
        </div>

        {/* Step 7: Conclusion Footer */}
        <div className="w-full h-[1px] bg-[#DADCDE]/60 mb-8"></div>
        <p className="text-center text-[18px] leading-[28px] text-[#192434] font-medium max-w-[800px] mx-auto">
          With cumulative knowledge of the user interviews and feedbacks, competitive analysis and Mixpanel metrics a high level Review philosophy of businesses was made.
        </p>
      </div>
    </section>
  );
};

export default ValidationShowcase;
