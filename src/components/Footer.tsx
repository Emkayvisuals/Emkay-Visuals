import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { getResolvedSocialLinks, getPlatformMeta } from '../lib/socialLinks';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { footer, socials, navigation, brand } = PORTFOLIO_CONTENT;

  if (footer?.enabled === false) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleNav = (navigation || []).filter((item) => item.visible !== false);
  const resolvedLinks = getResolvedSocialLinks(socials).filter(
    (item) => item.visible !== false && item.isValid
  );

  return (
    <footer className="relative border-t border-white/10 bg-[#050505] pt-14 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle top glow line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #8116E0, #D0FF00, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Brand Logo & Tagline */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              {brand?.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.logoAlt || 'Emkay Visuals Logo'}
                  width="32"
                  height="32"
                  loading="lazy"
                  className="w-8 h-8 rounded-full object-cover border border-[#D0FF00]/40 shrink-0 shadow-[0_0_12px_rgba(208,255,0,0.4)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#D0FF00] text-[#050505] font-extrabold flex items-center justify-center text-xs shadow-[0_0_12px_rgba(208,255,0,0.4)]">
                  {footer?.logoAbbr || 'EV'}
                </div>
              )}
              <span className="font-extrabold text-lg sm:text-xl tracking-wide text-[#FEFFFC]">
                {brand?.name ? (
                  <>
                    {brand.name.split(' ')[0]}{' '}
                    <span className="text-[#D0FF00]">//</span>{' '}
                    {brand.name.split(' ').slice(1).join(' ')}
                  </>
                ) : (
                  <>Emkay <span className="text-[#D0FF00]">//</span> Visuals</>
                )}
              </span>
            </div>
            <p className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-white/70 font-normal leading-relaxed">
              {footer?.tagline}
            </p>
          </div>

          {/* Nav Quick Links */}
          {visibleNav.length > 0 && (
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {visibleNav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs font-medium text-white/60 hover:text-[#D0FF00] transition-colors py-1.5 min-h-[36px] flex items-center"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Dynamic Social Links - Icon Only */}
          <div className="flex flex-wrap items-center gap-2.5">
            {resolvedLinks.map((item, idx) => {
              const meta = getPlatformMeta(item.platform);
              const IconComp = meta.icon;
              const isExternal = !item.isMailto;

              return (
                <a
                  key={item.id || idx}
                  href={item.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={item.label || item.platform}
                  title={`${item.label} (${item.displayHandle})`}
                  id={`footer-social-${item.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`}
                  className={`group w-11 h-11 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 ${meta.hoverBorder} hover:bg-white/[0.08] hover:scale-110 transition-all duration-200 text-white/80 hover:text-[#D0FF00] shrink-0 min-h-[44px] min-w-[44px]`}
                >
                  <IconComp className="w-5 h-5 text-white/80 group-hover:text-[#D0FF00] group-hover:scale-105 transition-all" />
                </a>
              );
            })}

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to Top"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#D0FF00] text-[#050505] hover:scale-105 transition-all shadow-[0_0_15px_rgba(208,255,0,0.35)] cursor-pointer ml-1 shrink-0 min-h-[44px] min-w-[44px]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Rights */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-normal">
          <div>{footer?.copyright}</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D0FF00]"></span>
            <span>{footer?.rightsNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
