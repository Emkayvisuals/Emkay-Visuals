import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles, Cpu, CheckCircle2, User } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { about, brand } = PORTFOLIO_CONTENT;

  return (
    <section id="about" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glows - very subtle low-opacity accents */}
      <div
        className="pointer-events-none absolute top-1/3 left-0 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full blur-[160px] opacity-10"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[150px] opacity-08"
        style={{ background: '#D0FF00' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Photo Container with Futuristic Tech Frame */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center w-full"
        >
          <motion.div
            whileHover={{
              scale: 1.015,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className="relative w-full max-w-md group"
          >
            {/* Violet ambient aura behind portrait */}
            <div
              className="absolute -inset-3 rounded-3xl blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, #8116E0, #D0FF00)' }}
            />

            {/* Futuristic Portrait Container */}
            <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 group-hover:border-[#D0FF00]/50 p-2 bg-[#050505] shadow-2xl transition-colors duration-300">
              {/* Tech Bracket Corners */}
              <div className="absolute top-3.5 left-3.5 w-4 h-4 border-t-2 border-l-2 border-[#D0FF00] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute top-3.5 right-3.5 w-4 h-4 border-t-2 border-r-2 border-[#D0FF00] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3.5 left-3.5 w-4 h-4 border-b-2 border-l-2 border-[#D0FF00] z-20 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3.5 right-3.5 w-4 h-4 border-b-2 border-r-2 border-[#D0FF00] z-20 group-hover:scale-110 transition-transform" />

              {/* Photo or Clean Green Vector Avatar */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#070707] flex items-center justify-center">
                {about.photoUrl ? (
                  <img
                    src={about.photoUrl}
                    alt={about.photoAlt}
                    width="400"
                    height="500"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/artist-avatar.svg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0e0e0e] to-[#050505]">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#D0FF00]/10 border-2 border-[#D0FF00]/40 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(208,255,0,0.15)] group-hover:scale-105 transition-transform">
                      <User className="w-12 h-12 sm:w-14 sm:h-14 text-[#D0FF00]" />
                    </div>
                    <span className="text-xs font-semibold text-[#D0FF00] tracking-widest">EMKAY VISUALS</span>
                    <span className="text-[10px] text-white/50 font-normal mt-1">Artist ID // Active</span>
                  </div>
                )}

                {/* Cybernetic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />

                {/* Tag on bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 z-10 p-2.5 sm:p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] sm:text-[11px] font-semibold text-[#D0FF00] tracking-wide">
                      Artist ID // 2026.ev
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#FEFFFC]">
                      {brand.name}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded bg-[#8116E0]/40 text-[#FEFFFC] border border-[#8116E0]/60">
                    5+ Yrs Pro
                  </span>
                </div>
              </div>

              {/* Coordinates sub-bar */}
              <div className="px-3 py-2 flex items-center justify-between text-[10px] sm:text-[11px] text-white/45 font-medium">
                <span>Worldwide / Remote</span>
                <span>•</span>
                <span>Status: Active</span>
                <span>•</span>
                <span>60 FPS Ready</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Bio & Core Philosophy */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-4 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behind the <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">Screen</span></span>
          </div>

          <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight leading-[1.15] mb-5">
            Engineering Visual Worlds with Uncompromising <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">Precision</span>
          </h2>

          <div className="space-y-3.5 text-sm sm:text-base text-white/75 font-normal leading-relaxed mb-8">
            {about.bioParagraphs.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Value Highlights - Single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
            {about.highlights.map((item) => (
              <motion.div
                key={item.number}
                whileHover={{ y: -3, scale: 1.015 }}
                className="p-4 rounded-2xl glass-panel border border-white/[0.07] hover:border-[#D0FF00]/40 transition-all cursor-default bg-[#050505]/70"
              >
                <span className="text-xs font-bold text-[#D0FF00] block mb-1">
                  // <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em]">{item.number}</span>
                </span>
                <h4 className="font-montserrat font-medium italic text-sm text-[#D0FF00] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-white/60 font-normal leading-normal">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Software & Tech Stack - No 3D software */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-[#D0FF00]" />
              <span className="text-xs font-semibold text-white/50 tracking-wide">
                Production Software &amp; Toolkit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {about.softwareTools.map((tool) => (
                <motion.div
                  key={tool.name}
                  whileHover={{ y: -2, scale: 1.015 }}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#D0FF00]/40 transition-all flex flex-col justify-between cursor-default min-h-[44px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#D0FF00]">
                      {tool.level}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8116E0]" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#FEFFFC]">
                    {tool.name}
                  </span>
                  <span className="text-[11px] text-white/45 font-normal mt-0.5">
                    {tool.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
