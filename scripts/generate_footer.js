/* eslint-disable */
const fs = require('fs');

let svg = fs.readFileSync('public/footer.txt', 'utf8');

// Replace colors as requested
svg = svg.replace(/#001847/gi, '#535F6F');
svg = svg.replace(/#5E007E/gi, '#D44A00');
svg = svg.replace(/#C238DA/gi, '#E5DA2E');

// Add React & Tailwind stuff to SVG root
// Use w-full and h-auto to make the SVG responsive
svg = svg.replace('<svg xmlns="http://www.w3.org/2000/svg"', '<svg className="w-full h-auto pointer-events-none select-none drop-shadow-sm"');

// ...
const componentCode = `import React from 'react';

export default function FooterGraphic() {
  return (
    <div className="w-full flex justify-center pb-10 sm:pb-20">
      ${svg}
    </div>
  );
}
`;

fs.writeFileSync('src/components/FooterGraphic.tsx', componentCode);
console.log('Successfully generated FooterGraphic.tsx');
