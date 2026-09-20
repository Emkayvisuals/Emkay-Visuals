import React, { useState, useEffect } from 'react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { PORTFOLIO_CONTENT, loadPortfolioFromFirestore, subscribeToPortfolio } from './data/portfolioContent';
import { trackVisit } from './lib/analytics';

export default function App() {
  const [tick, setTick] = useState(0);
  const [prefilledService, setPrefilledService] = useState<string | undefined>(undefined);
  const [prefilledProject, setPrefilledProject] = useState<string | undefined>(undefined);

  useEffect(() => {
    trackVisit();
    loadPortfolioFromFirestore();
    const unsubscribe = subscribeToPortfolio(() => {
      setTick(t => t + 1);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (PORTFOLIO_CONTENT.seo) {
      const { metaTitle, metaDescription, ogImage } = PORTFOLIO_CONTENT.seo;
      if (metaTitle) {
        document.title = metaTitle;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', metaTitle);
        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', metaTitle);
      }
      if (metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', metaDescription);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', metaDescription);
        const twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', metaDescription);
      }
      if (ogImage) {
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', ogImage);
        const twImg = document.querySelector('meta[name="twitter:image"]');
        if (twImg) twImg.setAttribute('content', ogImage);
      }
    }
  }, [tick]);

  const path = window.location.pathname;
  if (path === '/admin') {
    return <AdminDashboard />;
  }

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

