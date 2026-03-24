"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShowcaseWrapper } from './ShowcaseWrapper';

export const DraggableFlowchart: React.FC = () => {
  const constraintsRef = useRef(null);

  return (
    <ShowcaseWrapper legendTitle="Old Product Architecture">
      {/* This div acts as the boundary for the drag */}
      <div ref={constraintsRef} className="w-full h-[396px] relative cursor-grab active:cursor-grabbing">
          <motion.div 
              drag="x" 
              dragConstraints={constraintsRef}
              className="absolute top-0 left-0 h-full w-max flex items-center"
          >
              {/* Ensure the image fills the 396px height exactly. max-w-none is crucial so it overflows properly. */}
              <img 
                  src="/assets/Review settings/Kidckoff-old-prod2.png" 
                  alt="Old Product Flowchart" 
                  className="h-[396px] w-auto max-w-none pointer-events-none select-none" 
              />
          </motion.div>
      </div>
  </ShowcaseWrapper>
  );
};
