import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Award, Briefcase, Users, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const StatsRow: React.FC = () => {
  const { stats } = PORTFOLIO_CONTENT;

  const icons = [
    <Award className="w-5 h-5 text-[#D0FF00] group-hover:rotate-12 transition-transform duration-300" key="award" />,
    <Briefcase className="w-5 h-5 text-[#FEFFFC] group-hover:-rotate-12 transition-transform duration-300" key="briefcase" />,
    <Users className="w-5 h-5 text-[#D0FF00] group-hover:rotate-12 transition-transform duration-300" key="users" />,
    <Zap className="w-5 h-5 text-[#FEFFFC] group-hover:scale-110 transition-transform duration-300" key="zap" />,
  ];

  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Background ambient glow - very subtle */}
      <div
        className="pointer-events-none absolute inset-x-12 top-1/2 -translate-y-1/2 h-24 blur-[100px] opacity-10 rounded-full"
        style={{ background: 'linear-gradient(90deg, #8116E0, #D0FF00)' }}
      />

      {/* Grid: single column on mobile, 2 columns on tablet, 4 on desktop */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            id={`stat-card-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.5,
              delay: idx * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -4,
              scale: 1.015,
              transition: { duration: 0.2 },
            }}
            className="group relative rounded-2xl glass-panel p-5 sm:p-6 border border-white/[0.08] hover:border-[#D0FF00]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default bg-[#050505]/80"
          >
            {/* Corner Tech Notch Indicator */}
            <div className="absolute top-0 right-0 w-7 h-7 border-t border-r border-white/10 group-hover:border-[#D0FF00]/50 transition-colors" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white/40 group-hover:text-[#D0FF00] tracking-wide transition-colors">
                // <span className="font-baskervville italic text-[#FEFFFC]/70">0{idx + 1}</span>
              </span>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:bg-[#D0FF00]/15 group-hover:border-[#D0FF00]/40 transition-all duration-300">
                {icons[idx % icons.length]}
              </div>
            </div>

            <div>
              <div className="font-montserrat font-medium italic text-3xl sm:text-4xl text-[#FEFFFC] tracking-tight group-hover:text-[#D0FF00] transition-colors duration-300">
                {stat.value}
              </div>
              <div className="font-montserrat font-medium text-sm sm:text-base text-[#FEFFFC]/90 mt-1">
                {stat.label}
              </div>
              <p className="text-xs text-white/55 mt-1 leading-normal font-normal">
                {stat.sublabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
