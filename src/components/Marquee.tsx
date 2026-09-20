import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles } from 'lucide-react';

export const Marquee: React.FC = () => {
  const items = PORTFOLIO_CONTENT.hero.marqueeTicker;
  // Duplicate for seamless loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-4 sm:py-5 border-y border-white/[0.08] bg-[#050505]">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#050505] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-6 sm:gap-10 whitespace-nowrap">
        {displayItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-5 sm:gap-8 group cursor-default"
          >
            <span className="font-medium text-base sm:text-xl tracking-wide text-[#FEFFFC]/85 group-hover:text-[#D0FF00] transition-colors duration-300 font-montserrat italic">
              {item}
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D0FF00] opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#8116E0]"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
