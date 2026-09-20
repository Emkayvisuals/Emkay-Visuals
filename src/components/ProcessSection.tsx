import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const ProcessSection: React.FC = () => {
  const { process } = PORTFOLIO_CONTENT;

  return (
    <section id="process" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glow - Very subtle */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[170px] opacity-10"
        style={{ background: 'radial-gradient(circle, #8116E0 0%, #D0FF00 100%)' }}
      />

      {/* Header with Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Methodology // <span className="font-baskervville italic text-[#FEFFFC]">Zero Noise</span></span>
        </div>
        <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight">
          A Rigorous 4-Step Creative Roadmap
        </h2>
        <p className="mt-3.5 text-sm sm:text-base text-white/70 font-normal max-w-xl mx-auto">
          Every project moves through an airtight, predictable progression ensuring full creative
          alignment and pristine execution without unnecessary delays.
        </p>
      </motion.div>

      {/* 4-Step Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {process.map((step, idx) => (
          <motion.div
            key={step.stepNumber}
            id={`process-step-${step.stepNumber}`}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.5,
              delay: idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -5,
              scale: 1.015,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-[#D0FF00]/40 p-5 sm:p-6 flex flex-col justify-between cursor-default transition-colors duration-300 bg-[#050505]/80"
          >
            {/* Top Step Number & Duration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-baskervville italic text-3xl sm:text-4xl text-[#FEFFFC]/30 group-hover:text-[#D0FF00] group-hover:scale-105 transition-all duration-300 inline-block">
                  {step.stepNumber}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 group-hover:border-[#D0FF00]/30 transition-colors">
                  <Clock className="w-3 h-3 text-[#D0FF00]" />
                  <span>{step.duration}</span>
                </span>
              </div>

              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#8116E0]/20 text-[#FEFFFC] border border-[#8116E0]/40 mb-2.5 tracking-wide">
                {step.highlightBadge}
              </span>

              <h3 className="font-montserrat font-medium italic text-lg sm:text-xl text-[#D0FF00] mb-2">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Bottom Step Indicator */}
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/45 font-medium">
              <span>Phase // <span className="font-baskervville italic text-[#FEFFFC]/60">0{idx + 1}</span></span>
              <span className="w-2 h-2 rounded-full bg-[#D0FF00] opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#D0FF00] transition-all"></span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
