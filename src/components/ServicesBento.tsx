import React from 'react';
import { PORTFOLIO_CONTENT, ServiceItem } from '../data/portfolioContent';
import {
  Film,
  Clapperboard,
  Image as ImageIcon,
  Palette,
  Disc3,
  Wand2,
  Layers,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesBentoProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectService }) => {
  const { services, servicesSection } = PORTFOLIO_CONTENT;

  // Icon mapping helper
  const getIcon = (name: string) => {
    switch (name) {
      case 'Film':
        return <Film className="w-5 h-5 text-[#D0FF00] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-[#FEFFFC] group-hover:-rotate-12 transition-transform duration-300" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-[#D0FF00] group-hover:rotate-6 transition-transform duration-300" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-[#8116E0] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Disc3':
        return <Disc3 className="w-5 h-5 text-[#D0FF00] group-hover:rotate-45 transition-transform duration-500" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5 text-[#FEFFFC] group-hover:rotate-12 transition-transform duration-300" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#8116E0] group-hover:scale-110 transition-transform duration-300" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#D0FF00] group-hover:rotate-45 transition-transform duration-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#D0FF00]" />;
    }
  };

  const handleInquire = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Section Glows - Very subtle low-opacity accents */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[160px] opacity-10"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[350px] h-[350px] rounded-full blur-[150px] opacity-08"
        style={{ background: '#D0FF00' }}
      />

      {/* Header with Smooth Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{servicesSection.badgeMain} <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">{servicesSection.badgeAccent}</span></span>
          </div>
          <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight leading-[1.15]">
            {servicesSection.headingMain} <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">{servicesSection.headingAccent}</span>
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base text-white/70 font-normal leading-relaxed">
          {servicesSection.subtext}
        </p>
      </motion.div>

      {/* Bento Grid: strictly single column on mobile, responsive bento on tablet/desktop */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {services.map((service: ServiceItem, idx: number) => {
          const colSpanClass = service.colSpan?.includes('lg:col-span-8')
            ? 'sm:col-span-2 lg:col-span-8'
            : 'sm:col-span-1 lg:col-span-4';

          return (
            <motion.div
              key={service.id}
              id={`service-bento-${service.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: Math.min(idx * 0.06, 0.35),
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -5,
                scale: 1.012,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              className={`group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-[#D0FF00]/40 p-5 sm:p-7 flex flex-col justify-between overflow-hidden cursor-default bg-[#050505]/90 col-span-1 ${colSpanClass}`}
            >
              {/* Subtle top yellow glow line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D0FF00]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Background ambient artwork on card hover */}
              {service.previewImage && (
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden pointer-events-none">
                  <img
                    src={service.previewImage}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
                </div>
              )}

              {/* Card Top: Tag + Icon */}
              <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#FEFFFC]/80 tracking-wide group-hover:border-[#D0FF00]/30 transition-colors">
                  {service.tag}
                </span>

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-[#D0FF00]/15 group-hover:border-[#D0FF00]/40 transition-all duration-300">
                  {getIcon(service.iconName)}
                </div>
              </div>

              {/* Card Middle: Title + Descriptions */}
              <div className="relative z-10 my-1">
                <h3 className="font-montserrat font-medium italic text-xl sm:text-2xl text-[#D0FF00] tracking-tight mb-2">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed mb-4">
                  {service.shortDesc}
                </p>

                {/* Deliverables tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 my-2.5">
                  {service.deliverables.map((deliv, dIdx) => (
                    <span
                      key={dIdx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-black/50 border border-white/[0.06] text-white/80 group-hover:border-white/15 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#D0FF00] shrink-0" />
                      <span>{deliv}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Inquire Action - 44px min tap target */}
              <div className="relative z-10 pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between min-h-[44px]">
                <span className="text-xs text-white/40 font-medium">
                  Ref // <span className="font-baskervville italic text-[#FEFFFC]/70">0{idx + 1}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleInquire(service.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D0FF00] hover:text-[#FEFFFC] transition-colors py-2 px-1 cursor-pointer group/btn min-h-[44px]"
                >
                  <span>Request Quote</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
