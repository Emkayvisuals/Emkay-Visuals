import React from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { ArrowUp, Instagram, MessageSquare, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { footer, socials, navigation } = PORTFOLIO_CONTENT;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              <div className="w-8 h-8 rounded-full bg-[#D0FF00] text-[#050505] font-extrabold flex items-center justify-center text-xs shadow-[0_0_12px_rgba(208,255,0,0.4)]">
                EV
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-wide text-[#FEFFFC]">
                Emkay <span className="text-[#D0FF00]">//</span> Visuals
              </span>
            </div>
            <p className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-white/70 font-normal leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-medium text-white/60 hover:text-[#D0FF00] transition-colors py-1.5 min-h-[36px] flex items-center"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Socials with both Instagram handles labeled + WhatsApp + Email */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp */}
            <a
              href={socials.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#25D366] hover:text-[#25D366] transition-all text-white/70 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span className="text-xs font-semibold">{socials.whatsappDisplay}</span>
            </a>

            {/* Instagram Main: Graphic & Motion */}
            <a
              href={socials.instagramDesigns.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Graphic & Motion Designs"
              className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E1306C] hover:text-[#FEFFFC] transition-all text-white/70 min-h-[44px]"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white group-hover:text-[#D0FF00]">
                  {socials.instagramDesigns.handle}
                </span>
                <span className="text-[10px] text-white/50 leading-none">
                  {socials.instagramDesigns.label}
                </span>
              </div>
            </a>

            {/* Instagram FX: Digital Art & Manipulations */}
            <a
              href={socials.instagramFx.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Digital Art & Photo Manipulations"
              className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#8116E0] hover:text-[#FEFFFC] transition-all text-white/70 min-h-[44px]"
            >
              <Instagram className="w-4 h-4 text-[#8116E0]" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white group-hover:text-[#D0FF00]">
                  {socials.instagramFx.handle}
                </span>
                <span className="text-[10px] text-white/50 leading-none">
                  {socials.instagramFx.label}
                </span>
              </div>
            </a>

            {/* Direct Email */}
            <a
              href={socials.emailMailto}
              aria-label="Email"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 hover:border-[#D0FF00] hover:text-[#D0FF00] transition-all text-white/70 min-h-[44px]"
              title={socials.email}
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to Top"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#D0FF00] text-[#050505] hover:scale-105 transition-all shadow-[0_0_15px_rgba(208,255,0,0.35)] cursor-pointer ml-1 min-h-[44px]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Rights */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-normal">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D0FF00]"></span>
            <span>{footer.rightsNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
