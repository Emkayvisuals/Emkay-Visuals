import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsLoading(false);
      onLoadingComplete();
      return;
    }

    // Total animation time: ~1.4 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete();
    }, 1300);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden pointer-events-auto"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Background ambient glow */}
            <div className="absolute w-64 h-64 rounded-full bg-[#8116E0]/20 blur-[90px] pointer-events-none" />

            {/* EV Logo Mark Fading & Scaling in */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D0FF00] flex items-center justify-center font-bold text-[#050505] text-xl sm:text-2xl shadow-[0_0_30px_rgba(208,255,0,0.5)]">
                EV
              </div>
              <div className="flex items-center gap-1.5 font-montserrat font-semibold tracking-wider text-sm sm:text-base text-[#FEFFFC]">
                <span>EMKAY</span>
                <span className="text-[#D0FF00]">//</span>
                <span className="text-white/70">VISUALS</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
