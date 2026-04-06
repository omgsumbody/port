import React from 'react';

const challenges = [
  {
    id: "1",
    title: "The C suite UI pushback",
    subtitle: "Defending UI Scalability (Tabs vs. The \"Copy\" Model).",
    pushback: "During the conceptualization of the \"Views\" feature, executive leadership strongly pushed for a tab-based configuration architecture. Their mental model was simple: Give HR a different tab for each department's settings.",
    stance: "While tabs look great for 3-4 departments, they completely break web DOM at an enterprise scale. Imagine an HR admin navigating n-number of tabs on a laptop, it becomes a horizontal scrolling nightmare that forces repetitive manual setup.",
    tradeoff: "I proposed the \"Copy to selected\" model instead. We traded the immediate familiarity of tabs for a system that actually scales. It required a slight learning curve, but allowed admins to push a baseline rule to 40 departments and align mental models better."
  },
  {
    id: "2",
    title: "The Technical Feasibility Trade-off",
    subtitle: "The AI & GDPR Pivot",
    pushback: "I aggressively pitched skipping manual setup entirely using a conversational AI interface. Product loved the vision.",
    stance: "Engineering and Legal gave a reality check: our backend data wasn't clean, and feeding unstructured employee records into an LLM created massive GDPR privacy risks.",
    tradeoff: "We agreed to pause the AI development and focus entirely on fixing the manual screens first. By enforcing strict, clean rules in the new design, the exact stepping stone needed to safely power that AI release next."
  },
  {
    id: "3",
    title: "The Product Management pushback",
    subtitle: "Protecting Simplicity Against Scope Creep.",
    pushback: "Once Product saw how fast and easy the single-page \"Quick Wizard\" was for small businesses, there was immediate pressure to add \"just a few more options\" like custom scoring weights and specific timeline overrides.",
    stance: "I drew a hard line to protect the wizard's simplicity. The entire psychological value of this fast-lane was zero-decision execution. If we started adding custom toggles back in, the wizard would slowly devolve right back into the overwhelming 12-step maze.",
    tradeoff: "We kept a strict separation. If a business really wanted custom settings, they were routed to the advanced flow. We intentionally traded \"having every feature on one page\" to fiercely protect that incredibly fast 11-minute setup time for our core SMB users."
  }
];

const ChallengesLearnings = () => {
  return (
    <div className="w-full flex flex-col items-center gap-8 mt-8">
      {challenges.map((challenge) => (
        <div 
          key={challenge.id} 
          className="w-full max-w-[960px] flex flex-row bg-white border border-[#DADCDE]/60 rounded-[12px] overflow-hidden"
        >
          {/* Left Column (Number & Title) */}
          <div className="w-[224px] shrink-0 bg-[#F5F7F9]/40 relative flex flex-col justify-end p-[40px] min-h-[341px]">
            <span className="absolute top-[20px] left-[40px] font-inter font-black text-[128px] leading-[1] text-[#DADCDE] select-none">
              {challenge.id}
            </span>
            <h4 className="font-['Perfectly_Nineties'] font-semibold text-[24px] leading-[33px] tracking-[0.02em] text-[#243244] relative z-10">
              {challenge.title}
            </h4>
          </div>

          {/* Right Column (Content) */}
          <div className="flex-1 flex flex-col p-[24px] gap-[16px] justify-center">
            <h5 className="font-inter font-medium text-[16px] leading-[20px] text-[#243244]">
              {challenge.subtitle}
            </h5>
            <div className="flex flex-col gap-[8px]">
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
                <strong className="font-semibold text-[#3D495A]">Pushback:</strong> {challenge.pushback}
              </p>
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
                <strong className="font-semibold text-[#3D495A]">Stance:</strong> {challenge.stance}
              </p>
              <p className="font-inter font-normal text-[16px] leading-[29px] text-[#535F6F] m-0">
                <strong className="font-semibold text-[#3D495A]">Trade-off:</strong> {challenge.tradeoff}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengesLearnings;
