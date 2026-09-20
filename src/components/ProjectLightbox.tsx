import React, { useEffect } from 'react';
import { ProjectItem } from '../data/portfolioContent';
import { X, ChevronLeft, ChevronRight, Sparkles, Play, Layers } from 'lucide-react';

interface ProjectLightboxProps {
  project: ProjectItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onInquire: (title: string) => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
  onInquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      id="project-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Container - Stop propagation so clicking inside doesn't close modal */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] glass-panel bg-[#050505] border border-white/15 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_25px_60px_rgba(0,0,0,0.9)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - 44px min tap target */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Lightbox"
          className="absolute top-3.5 right-3.5 z-30 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white/85 hover:text-[#D0FF00] hover:bg-black border border-white/10 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual / Media Side */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[260px] sm:min-h-[400px] lg:min-h-[550px] overflow-hidden group">
          {project.videoUrl ? (
            <div className="w-full h-full aspect-video flex items-center justify-center bg-black">
              <iframe
                src={project.videoUrl}
                title={project.title}
                className="w-full h-full min-h-[260px] sm:min-h-[400px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[55vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Previous / Next Arrow Controls - 44px min tap targets */}
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous Project"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-[#D0FF00] text-white hover:text-black transition-all border border-white/15 cursor-pointer shadow-lg z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next Project"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-[#D0FF00] text-white hover:text-black transition-all border border-white/15 cursor-pointer shadow-lg z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Info & Meta Details Side */}
        <div className="w-full lg:w-[360px] xl:w-[400px] p-5 sm:p-7 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-[#050505]">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#8116E0]/20 border border-[#8116E0]/40 text-[#FEFFFC]">
                {project.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70">
                {project.year}
              </span>
              {project.videoUrl && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D0FF00]/15 border border-[#D0FF00]/30 text-[#D0FF00]">
                  <Play className="w-3 h-3 fill-current" />
                  Video Embed
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-montserrat font-medium italic text-xl sm:text-2xl text-[#D0FF00] tracking-tight leading-snug mb-2">
              {project.title}
            </h3>

            {/* Client info */}
            {project.client && (
              <div className="flex items-center gap-2 mb-4 text-xs text-white/50">
                <span>Client:</span>
                <span className="text-[#D0FF00] font-medium">{project.client}</span>
              </div>
            )}

            {/* Description */}
            <div className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed mb-5">
              {project.description}
            </div>

            {/* Software / Tools stack */}
            <div className="mb-5">
              <span className="block text-xs font-semibold text-white/45 mb-2 tracking-wide">
                Software &amp; Tools Used
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/80"
                  >
                    <Layers className="w-3 h-3 text-[#D0FF00]" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer in Lightbox - 44px min tap targets */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(project.title);
              }}
              className="w-full py-3.5 rounded-full bg-[#D0FF00] text-[#050505] font-bold text-sm tracking-wide transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(208,255,0,0.35)] flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
            >
              <Sparkles className="w-4 h-4 text-[#050505]" />
              <span>Inquire Similar Project</span>
            </button>
            <p className="text-center text-[11px] text-white/40 font-normal">
              Use arrow keys ← → to browse works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
