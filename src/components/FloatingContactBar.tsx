import React, { useState } from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { MessageSquare, Instagram, Mail, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingContactBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { socials } = PORTFOLIO_CONTENT;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Contact Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-72 rounded-2xl glass-panel border border-white/15 bg-[#080808]/95 backdrop-blur-xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col gap-2"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
              <span className="text-[11px] font-bold text-[#D0FF00] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Quick Connect
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white"
                aria-label="Close Quick Connect"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* WhatsApp */}
            <a
              href={socials.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FEFFFC] group-hover:text-[#25D366] transition-colors">
                  WhatsApp Direct
                </span>
                <span className="text-[10px] text-white/50">{socials.whatsappDisplay}</span>
              </div>
            </a>

            {/* Instagram Main */}
            <a
              href={socials.instagramDesigns.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center text-[#E1306C] shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FEFFFC] group-hover:text-[#D0FF00] transition-colors">
                  {socials.instagramDesigns.handle}
                </span>
                <span className="text-[10px] text-white/50">{socials.instagramDesigns.label}</span>
              </div>
            </a>

            {/* Instagram FX */}
            <a
              href={socials.instagramFx.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8116E0]/20 border border-[#8116E0]/40 flex items-center justify-center text-[#FEFFFC] shrink-0">
                <Instagram className="w-4 h-4 text-[#8116E0]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FEFFFC] group-hover:text-[#D0FF00] transition-colors">
                  {socials.instagramFx.handle}
                </span>
                <span className="text-[10px] text-white/50">{socials.instagramFx.label}</span>
              </div>
            </a>

            {/* Email */}
            <a
              href={socials.emailMailto}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D0FF00]/15 border border-[#D0FF00]/30 flex items-center justify-center text-[#D0FF00] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FEFFFC] group-hover:text-[#D0FF00] transition-colors">
                  Email Emkay
                </span>
                <span className="text-[10px] text-white/50">{socials.email}</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        id="floating-contact-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Quick Contact"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-[#D0FF00] text-[#050505] shadow-[0_0_25px_rgba(208,255,0,0.45)] hover:shadow-[0_0_35px_rgba(208,255,0,0.65)] flex items-center justify-center cursor-pointer transition-shadow"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#050505]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8116E0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8116E0]"></span>
            </span>
            <MessageSquare className="w-5 h-5 text-[#050505]" />
          </div>
        )}
      </motion.button>
    </div>
  );
};
