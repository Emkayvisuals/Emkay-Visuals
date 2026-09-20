import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Testimonials: React.FC = () => {
  const { testimonials, testimonialsSection } = PORTFOLIO_CONTENT;

  if (testimonialsSection?.enabled === false) {
    return null;
  }

  const badgeMain = testimonialsSection?.badgeMain || 'Client';
  const badgeAccent = testimonialsSection?.badgeAccent || 'Endorsements';
  const headingMain = testimonialsSection?.headingMain || 'Proven Track Record of';
  const headingAccent = testimonialsSection?.headingAccent || 'Excellence';
  const satisfactionText =
    testimonialsSection?.satisfactionText || '5.0 Average Client Satisfaction';

  const visibleTestimonials = (testimonials || []).filter((t) => t.visible !== false);

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[400px] h-[300px] rounded-full blur-[160px] opacity-10"
        style={{ background: '#8116E0' }}
      />

      {/* Header with Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {badgeMain}{' '}
              {badgeAccent && (
                <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                  {badgeAccent}
                </span>
              )}
            </span>
          </div>
          <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight leading-[1.15]">
            {headingMain}{' '}
            <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
              {headingAccent}
            </span>
          </h2>
        </div>
        {satisfactionText && (
          <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
            <div className="flex text-[#D0FF00]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span>{satisfactionText}</span>
          </div>
        )}
      </motion.div>

      {/* Testimonials Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {visibleTestimonials.map((t, idx) => (
          <motion.div
            key={t.id}
            id={`testimonial-card-${t.id}`}
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
              scale: 1.012,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-[#D0FF00]/40 p-6 sm:p-8 flex flex-col justify-between cursor-default transition-colors duration-300 bg-[#050505]/80"
          >
            <div>
              {/* Header inside card: Stars & Project Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex text-[#D0FF00] gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  ))}
                </div>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#FEFFFC]/80 group-hover:border-[#D0FF00]/30 transition-colors">
                  {t.projectType}
                </span>
              </div>

              {/* Quote text */}
              <p className="font-baskervville italic text-base sm:text-lg text-[#FEFFFC]/90 leading-relaxed mb-6 font-normal">
                “{t.comment}”
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3.5">
              <img
                src={t.avatar}
                alt={t.avatarAlt || `${t.name} – ${t.role} at ${t.company}`}
                width="44"
                height="44"
                loading="lazy"
                className="w-11 h-11 rounded-full object-cover border border-white/20 group-hover:border-[#D0FF00]/50 transition-colors"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-montserrat font-medium italic text-sm text-[#D0FF00]">
                  {t.name}
                </h4>
                <p className="text-xs text-white/55 font-normal">
                  {t.role} • <span className="text-white/80 font-medium">{t.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
