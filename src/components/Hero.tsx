import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { ArrowDown, Sparkles, Film, Palette, Layers, Eye } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export const Hero: React.FC = () => {
  const { hero, brand } = PORTFOLIO_CONTENT;
  const { scrollY } = useScroll();
  const glowY1 = useTransform(scrollY, [0, 800], [0, 100]);
  const glowY2 = useTransform(scrollY, [0, 800], [0, -80]);
  const glowY3 = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505]"
    >
      {/* Soft Blurred Background Glows with subtle parallax movement */}
      <motion.div
        style={{
          y: glowY1,
          background: 'radial-gradient(circle, #8116E0 20%, #D0FF00 90%)',
        }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[700px] h-[350px] sm:h-[450px] rounded-full blur-[140px] opacity-15"
      />
      <motion.div
        style={{
          y: glowY2,
          background: '#8116E0',
        }}
        className="pointer-events-none absolute top-1/3 -left-32 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full blur-[130px] opacity-10"
      />
      <motion.div
        style={{
          y: glowY3,
          background: '#D0FF00',
        }}
        className="pointer-events-none absolute bottom-10 -right-32 w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full blur-[130px] opacity-08"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Info Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full glass-panel border border-white/10 mb-6 sm:mb-8 max-w-full text-center"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D0FF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D0FF00]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#FEFFFC]/90 tracking-wide">
            {hero.badge}
          </span>
          <span className="text-[#8116E0] text-xs hidden xs:inline">●</span>
          <span className="text-[11px] sm:text-xs font-medium text-[#D0FF00] tracking-wide">
            {brand.statusBadge}
          </span>
        </motion.div>

        {/* Hero Headline: "Your Vision, Visualized" entirely Montserrat Medium (weight 500), in Title Case, not italic.
            "Your" in yellow #D0FF00, and "Vision, Visualized" in white #FEFFFC */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-montserrat font-medium not-italic text-[clamp(2.2rem,7.2vw,5.5rem)] tracking-tight leading-[1.12] max-w-4xl px-2 break-words"
          style={{ fontStyle: 'normal' }}
        >
          <span className="font-cormorant italic font-medium sm:font-semibold text-[#D0FF00] text-[1.12em]">Your </span>
          <span className="font-montserrat font-medium text-[#FEFFFC]">Vision, Visualized</span>
        </motion.h1>

        {/* Short Subtext with Montserrat Regular, italic */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 sm:mt-7 max-w-2xl text-sm sm:text-base md:text-lg text-[#FEFFFC]/75 leading-relaxed font-normal italic px-2"
        >
          {hero.subtext}
        </motion.p>

        {/* Floating Tag Chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-xl px-2"
        >
          {hero.floatingTags.map((tag, idx) => {
            return (
              <span
                key={tag.label}
                id={`hero-chip-${idx}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 min-h-[32px] ${
                  tag.color === 'yellow'
                    ? 'bg-[#D0FF00]/10 border border-[#D0FF00]/30 text-[#D0FF00] shadow-[0_0_12px_rgba(208,255,0,0.12)]'
                    : tag.color === 'violet'
                    ? 'bg-[#8116E0]/15 border border-[#8116E0]/40 text-[#FEFFFC] shadow-[0_0_15px_rgba(129,22,224,0.15)]'
                    : 'bg-white/5 border border-white/10 text-[#FEFFFC]/80'
                }`}
              >
                {tag.label === 'Motion Graphics' ? (
                  <Film className="w-3.5 h-3.5 text-[#D0FF00]" />
                ) : tag.label === 'Visual Branding' ? (
                  <Palette className="w-3.5 h-3.5 text-[#8116E0]" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-[#D0FF00]" />
                )}
                <span>{tag.label}</span>
              </span>
            );
          })}
        </motion.div>

        {/* Two Call To Action Buttons - At least 44px tall tap targets */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto px-4"
        >
          <a
            href={hero.primaryButtonLink}
            id="hero-view-work-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#FEFFFC] border border-white/15 font-semibold text-sm tracking-wide transition-all duration-300 hover:border-[#D0FF00]/50 active:scale-95 min-h-[46px]"
          >
            <Eye className="w-4 h-4 text-[#D0FF00]" />
            <span>{hero.primaryButtonText}</span>
            <ArrowDown className="w-4 h-4 text-white/60" />
          </a>

          <a
            href={hero.secondaryButtonLink}
            id="hero-hire-me-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full bg-[#D0FF00] text-[#050505] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(208,255,0,0.4)] hover:shadow-[0_0_35px_rgba(208,255,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 min-h-[46px]"
          >
            <Sparkles className="w-4 h-4 text-[#050505]" />
            <span>{hero.secondaryButtonText}</span>
          </a>
        </motion.div>

        {/* Sub-label for software stack - No 3D mentions */}
        <div className="mt-10 sm:mt-12 text-center text-[11px] sm:text-xs text-white/40 tracking-wider flex flex-wrap justify-center items-center gap-x-3 gap-y-1 px-4 max-w-full font-medium">
          <span>After Effects</span>
          <span className="text-[#8116E0]">●</span>
          <span>Photoshop</span>
          <span className="text-[#8116E0]">●</span>
          <span>Illustrator</span>
          <span className="text-[#8116E0]">●</span>
          <span>Key Art Master</span>
        </div>
      </div>
    </section>
  );
};
