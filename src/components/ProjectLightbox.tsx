import React, { useEffect, useState } from 'react';
import { ProjectItem, PORTFOLIO_CONTENT } from '../data/portfolioContent';
import { X, ChevronLeft, ChevronRight, Sparkles, Play, Layers, Film, Image as ImageIcon } from 'lucide-react';
import {
  isMotionCategory,
  getEmbedVideoUrl,
  getVideoType,
  getEffectiveProjectImage,
} from '../lib/videoUtils';

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
  const { projectsSection } = PORTFOLIO_CONTENT;
  const videoEmbedBadge = projectsSection?.videoEmbedBadge || 'Motion Reel';
  const toolsLabel = projectsSection?.toolsLabel || 'Software & Tools Used';
  const inquireButtonText = projectsSection?.inquireProjectButtonText || 'Inquire Similar Project';
  const lightboxHint = projectsSection?.lightboxHint || 'Use arrow keys ← → to browse works';

  // Active media inside the lightbox: 'video' | index of extra images or -1 for main cover
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | 'video'>('video');

  const isMotion = project ? isMotionCategory(project.category) || !!project.videoUrl : false;
  const hasVideo = !!(project && project.videoUrl && project.videoUrl.trim());

  useEffect(() => {
    if (hasVideo) {
      setActiveMediaIndex('video');
    } else {
      setActiveMediaIndex(-1); // main cover image
    }
  }, [project?.id, hasVideo]);

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

  const extraImages = project.extraImages || [];
  const mainCoverImage = getEffectiveProjectImage(project);
  const videoEmbedUrl = hasVideo ? getEmbedVideoUrl(project.videoUrl) : null;
  const videoType = hasVideo ? getVideoType(project.videoUrl) : null;

  return (
    <div
      id="project-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Container */}
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
        <div className="relative flex-1 bg-black flex flex-col items-center justify-center min-h-[280px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden group">
          <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-4">
            {activeMediaIndex === 'video' && hasVideo && videoEmbedUrl ? (
              <div className="w-full h-full aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl">
                {videoType === 'mp4' ? (
                  <video
                    src={project.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain max-h-[55vh] sm:max-h-[70vh]"
                  />
                ) : (
                  <iframe
                    src={videoEmbedUrl}
                    title={project.title}
                    className="w-full h-full min-h-[260px] sm:min-h-[400px] border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={
                    activeMediaIndex === -1 || activeMediaIndex === 'video'
                      ? mainCoverImage
                      : extraImages[activeMediaIndex]?.url || mainCoverImage
                  }
                  alt={
                    (activeMediaIndex !== -1 &&
                      activeMediaIndex !== 'video' &&
                      extraImages[activeMediaIndex]?.alt) ||
                    project.imageAlt ||
                    project.title
                  }
                  width="1600"
                  height="1200"
                  loading="lazy"
                  className="max-h-[52vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Multiple Gallery Images Strip (if extra images exist or video + cover image) */}
          {(extraImages.length > 0 || hasVideo) && (
            <div className="w-full px-4 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar z-10">
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMediaIndex('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px] ${
                    activeMediaIndex === 'video'
                      ? 'bg-[#D0FF00] text-[#050505] shadow-[0_0_12px_rgba(208,255,0,0.4)]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Video Player
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveMediaIndex(-1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px] ${
                  activeMediaIndex === -1
                    ? 'bg-[#D0FF00] text-[#050505] shadow-[0_0_12px_rgba(208,255,0,0.4)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                Cover Shot
              </button>

              {extraImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px] ${
                    activeMediaIndex === idx
                      ? 'bg-[#D0FF00] text-[#050505] shadow-[0_0_12px_rgba(208,255,0,0.4)]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                  View #{idx + 2}
                </button>
              ))}
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
              {project.year && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70">
                  {project.year}
                </span>
              )}
              {isMotion && hasVideo && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D0FF00]/15 border border-[#D0FF00]/30 text-[#D0FF00]">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {videoEmbedBadge}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-montserrat font-medium italic text-xl sm:text-2xl text-[#D0FF00] tracking-tight leading-snug mb-2">
              {project.title}
            </h3>

            {/* Description - Only if present and non-empty */}
            {project.description && project.description.trim() && (
              <div className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed mb-5">
                {project.description}
              </div>
            )}

            {/* Software / Tools stack - Only if present and non-empty */}
            {project.tools && project.tools.filter(Boolean).length > 0 && (
              <div className="mb-5">
                <span className="block text-xs font-semibold text-white/45 mb-2 tracking-wide">
                  {toolsLabel}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.filter(Boolean).map((tool, tIdx) => (
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
            )}
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
              <span>{inquireButtonText}</span>
            </button>
            <p className="text-center text-[11px] text-white/40 font-normal">
              {lightboxHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
