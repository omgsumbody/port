/* eslint-disable */
const fs = require('fs');

console.log('Starting footer fix script...');

let code = fs.readFileSync('src/components/FooterGraphic.tsx', 'utf8');

// 1. Remove max-w and mx-auto
code = code.replace('w-full h-auto max-w-[1328px] mx-auto pointer-events-none select-none', 'w-[1328px] h-auto shrink-0 pointer-events-none select-none');

// 2. Extract just the SVG part so we can duplicate it.
// The regex extracts the entire SVG element.
const svgMatch = code.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
if (!svgMatch) {
  console.error("Could not find SVG in the component!");
  process.exit(1);
}
const svgStr = svgMatch[0];

// The container should hold a flex row of these SVGs. Let's make 3 of them so it's 3984px wide, easily covering 4K.
// We center the flex row so it expands outwards from the middle.

const replacement = `<div className="w-full overflow-hidden flex justify-center pt-0 pb-20 pointer-events-none select-none">
      <div className="flex w-full justify-center min-w-max">
        ${svgStr}
        <div className="hidden xl:block">
          ${svgStr}
        </div>
        <div className="hidden 2xl:block">
          ${svgStr}
        </div>
      </div>
    </div>`;

// Replace the outer div wrapper
code = code.replace(/<div className="w-full overflow-hidden flex justify-center py-20 pointer-events-none select-none">([\s\S]*?)<\/div>/, replacement + '\n$1\n</div>');

// also replace if it already has pt-0 pb-20
code = code.replace(/<div className="w-full overflow-hidden flex justify-center pt-0 pb-20 pointer-events-none select-none">[\s\S]*?<\/div>/, replacement);

fs.writeFileSync('src/components/FooterGraphic.tsx', code);
console.log('Done mapping SVG repetitions safely!');
