import React, { useState } from 'react';
import { PORTFOLIO_CONTENT, ProjectItem } from '../data/portfolioContent';
import { ProjectLightbox } from './ProjectLightbox';
import {
  Sparkles,
  Maximize2,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkGalleryProps {
  onSelectProjectForContact?: (title: string) => void;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({ onSelectProjectForContact }) => {
  const { categories, projects, projectsSection } = PORTFOLIO_CONTENT;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [id: string]: boolean }>({});

  // Filter items
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => {
          if (activeCategory === 'Branding') return p.category === 'Visual Branding';
          return p.category.toLowerCase() === activeCategory.toLowerCase();
        });

  // Lightbox navigation
  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIndex]);
  };

  const handleInquireFromLightbox = (projectTitle: string) => {
    if (onSelectProjectForContact) {
      onSelectProjectForContact(projectTitle);
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="work" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Section Glows - Very subtle low-opacity accents */}
      <div
        className="pointer-events-none absolute top-40 right-10 w-[400px] h-[400px] rounded-full blur-[170px] opacity-10"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-40 left-10 w-[350px] h-[350px] rounded-full blur-[160px] opacity-08"
        style={{ background: '#D0FF00' }}
      />

      {/* Header with Smooth Scroll Fade/Slide */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{projectsSection.badgeMain} <span className="font-baskervville italic text-[#FEFFFC]">{projectsSection.badgeAccent}</span></span>
          </div>
          <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight leading-[1.15]">
            {projectsSection.headingMain} <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">{projectsSection.headingAccent}</span>
          </h2>
        </div>
        <p className="max-w-md text-sm sm:text-base text-white/70 font-normal leading-relaxed">
          {projectsSection.subtext}
        </p>
      </motion.div>

      {/* Filter Buttons with 44px min tap targets */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mb-8 sm:mb-12 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
      >
        <div className="flex items-center gap-2 min-w-max">
          <div className="flex items-center gap-1.5 pl-1 pr-2 text-xs font-semibold text-white/50">
            <Filter className="w-3.5 h-3.5 text-[#D0FF00]" />
            <span>Filter:</span>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center active:scale-95 ${
                  isActive
                    ? 'bg-[#D0FF00] text-[#050505] font-bold shadow-[0_0_16px_rgba(208,255,0,0.35)]'
                    : 'glass-panel text-[#FEFFFC]/70 hover:text-[#FEFFFC] hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Portfolio Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => {
            const isMotion = project.category === 'Motion' || !!project.videoUrl;

            return (
              <motion.div
                layout
                key={project.id}
                id={`portfolio-item-${project.id}`}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.04, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -6,
                  scale: 1.015,
                  transition: { duration: 0.2, ease: 'easeOut' },
                }}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl glass-panel border border-white/[0.08] hover:border-[#D0FF00]/50 overflow-hidden cursor-pointer flex flex-col bg-[#050505]"
              >
                {/* Subtle top glow bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D0FF00]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                {/* Media Container with Zoom */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121212]">
                  {/* LQIP shimmer placeholder while loading */}
                  {!loadedImages[project.id] && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse filter blur-xl transform scale-105" />
                  )}
                  <img
                    src={project.image}
                    alt={project.title}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [project.id]: true }))}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
                      loadedImages[project.id] ? 'opacity-100 blur-0 scale-100' : 'opacity-60 blur-md scale-105'
                    }`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#FEFFFC]">
                      {project.category}
                    </span>
                    {isMotion && (
                      <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-[#D0FF00] text-[#050505] flex items-center gap-1 shadow-sm">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Motion
                      </span>
                    )}
                  </div>

                  {/* Year tag */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/70">
                      {project.year}
                    </span>
                  </div>

                  {/* Hover Center Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#D0FF00] text-[#050505] flex items-center justify-center shadow-[0_0_25px_rgba(208,255,0,0.6)] transform group-hover:scale-110 transition-transform duration-300">
                      {isMotion ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Maximize2 className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-[#050505]">
                  <div>
                    <h3 className="font-montserrat font-medium italic text-lg sm:text-xl text-[#D0FF00] tracking-tight line-clamp-1 mb-1">
                      {project.title}
                    </h3>
                    {project.client && (
                      <p className="text-xs text-white/50 mb-2.5 font-normal">
                        Client: <span className="text-white/80 font-medium">{project.client}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-white/65 line-clamp-2 leading-relaxed font-normal">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between min-h-[44px]">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/45">
                      <span>{project.tools[0]}</span>
                      {project.tools[1] && <span>• {project.tools[1]}</span>}
                    </div>
                    <span className="text-xs text-[#D0FF00] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                      View Project <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <ProjectLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        onInquire={handleInquireFromLightbox}
      />
    </section>
  );
};
