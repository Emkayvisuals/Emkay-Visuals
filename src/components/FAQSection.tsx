import React, { useState } from 'react';
import { PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC = () => {
  const { faqSection, faq } = PORTFOLIO_CONTENT;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqSection?.enabled === false) {
    return null;
  }

  const visibleFaqs = (faq || []).filter((item) => item.visible !== false);

  if (visibleFaqs.length === 0) {
    return null;
  }

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
      {/* Background ambient glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[160px] opacity-10"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-1/4 w-[300px] h-[300px] rounded-full blur-[140px] opacity-08"
        style={{ background: '#D0FF00' }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-3xl mx-auto mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {faqSection.badgeMain}{' '}
            <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
              {faqSection.badgeAccent}
            </span>
          </span>
        </div>
        <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight">
          {faqSection.headingMain}{' '}
          <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
            {faqSection.headingAccent}
          </span>
        </h2>
        {faqSection.subtext && (
          <p className="mt-3.5 text-sm sm:text-base text-white/70 font-normal max-w-xl mx-auto leading-relaxed">
            {faqSection.subtext}
          </p>
        )}
      </motion.div>

      {/* FAQ Accordion List */}
      <div className="relative z-10 space-y-3.5 sm:space-y-4">
        {visibleFaqs.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-[#0a0a0a] border-[#D0FF00]/40 shadow-[0_4px_25px_rgba(208,255,0,0.06)]'
                  : 'bg-[#050505]/90 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer min-h-[56px] focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#D0FF00] shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-montserrat font-semibold text-sm sm:text-base text-[#FEFFFC] tracking-wide">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-[#D0FF00]/15 text-[#D0FF00] border-[#D0FF00]/40' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-white/75 font-normal leading-relaxed border-t border-white/[0.05] pl-15 sm:pl-17">
                      <p className="whitespace-pre-line">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
