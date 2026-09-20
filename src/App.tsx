import React, { useState } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { StatsRow } from './components/StatsRow';
import { ServicesBento } from './components/ServicesBento';
import { WorkGallery } from './components/WorkGallery';
import { AboutSection } from './components/AboutSection';
import { ProcessSection } from './components/ProcessSection';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingContactBar } from './components/FloatingContactBar';

export default function App() {
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);
  const [prefilledProject, setPrefilledProject] = useState<string | undefined>(undefined);

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledService(serviceTitle);
  };

  const handleSelectProjectForContact = (projectTitle: string) => {
    setPrefilledProject(projectTitle);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FEFFFC] selection:bg-[#D0FF00] selection:text-[#050505] overflow-x-hidden w-full">
      {/* Curtain Preloader on first load */}
      <Preloader onLoadingComplete={() => {}} />

      {/* Floating Pill Navigation Bar */}
      <Navbar />

      {/* Hero Section with Glowing Gradients and Floating Tags */}
      <Hero />

      {/* Infinite Scrolling Ribbon / Marquee of Services */}
      <Marquee />

      {/* Key Stats Row: 5+ Years Experience, Projects Completed, Happy Clients */}
      <StatsRow />

      {/* Bento-Style Services Grid */}
      <ServicesBento onSelectService={handleSelectService} />

      {/* Work Gallery: Filter Buttons, Portfolio Grid, Motion Video Embeds & Lightbox */}
      <WorkGallery onSelectProjectForContact={handleSelectProjectForContact} />

      {/* About Me Section with Photo Placeholder & Software Stack */}
      <AboutSection />

      {/* Simple 4-Step Creative Process */}
      <ProcessSection />

      {/* Client Testimonials & Endorsements */}
      <Testimonials />

      {/* Contact Section: Interactive Form + WhatsApp, Instagram, Email Buttons */}
      <ContactSection
        prefilledService={prefilledService}
        prefilledProject={prefilledProject}
      />

      {/* Footer */}
      <Footer />

      {/* Floating Quick Contact Bar with WhatsApp, Instagram & Email */}
      <FloatingContactBar />
    </div>
  );
}
