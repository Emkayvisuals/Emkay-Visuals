import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONTENT, WEB3FORMS_ACCESS_KEY } from '../data/portfolioContent';
import {
  Mail,
  MessageSquare,
  Instagram,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ContactSectionProps {
  prefilledService?: string;
  prefilledProject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledService,
  prefilledProject,
}) => {
  const { contact, socials } = PORTFOLIO_CONTENT;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: contact.servicesOptions[0],
    budget: contact.budgetRanges[1],
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // If user clicked "Request Quote" or "Inquire Similar Project", prefill form
  useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({
        ...prev,
        service:
          contact.servicesOptions.find((s) => s.toLowerCase().includes(prefilledService.toLowerCase())) ||
          prefilledService,
        message: prev.message ? prev.message : `Hi Emkay, I would like to inquire about your ${prefilledService} service.`,
      }));
    }
  }, [prefilledService, contact.servicesOptions]);

  useEffect(() => {
    if (prefilledProject) {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Emkay, I was looking at your portfolio project "${prefilledProject}" and would love to discuss a similar design/motion scope for our upcoming project.`,
      }));
    }
  }, [prefilledProject]);

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please provide your name or brand name.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter a valid email address.';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please provide brief details about your project.';
    } else if (formData.message.trim().length < 5) {
      errors.message = 'Please provide a bit more detail (at least 5 characters).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name.trim(),
          email: formData.email.trim(),
          service: formData.service,
          budget: formData.budget,
          message: formData.message.trim(),
          subject: `New Project Brief from ${formData.name.trim()} - Emkay Visuals`,
          from_name: formData.name.trim(),
          replyto: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        // If placeholder access key or submission issue, show helpful message and WhatsApp fallback
        const msg = data.message || 'Submission error. Please connect directly via WhatsApp.';
        setErrorMessage(msg);
      }
    } catch (err: unknown) {
      const fallbackMsg = err instanceof Error ? err.message : 'Network error';
      setErrorMessage(
        `Unable to dispatch form at this moment (${fallbackMsg}). Please connect directly on WhatsApp!`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Pre-formatted WhatsApp link including current message draft if any
  const whatsappFallbackUrl = `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    formData.name
      ? `Hi Emkay, my name is ${formData.name}. I'm inquiring about ${formData.service} (${formData.budget}). Project details: ${formData.message}`
      : `Hi Emkay, I saw your portfolio and would like to discuss a project!`
  )}`;

  return (
    <section id="contact" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Glows - Very subtle */}
      <div
        className="pointer-events-none absolute top-10 left-10 w-[400px] h-[400px] rounded-full blur-[170px] opacity-10"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full blur-[160px] opacity-08"
        style={{ background: '#D0FF00' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Direct Links & Instant Comms */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#D0FF00] text-xs font-semibold tracking-wide mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let's <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">Collaborate</span></span>
            </div>

            <h2 className="font-montserrat font-medium italic text-2xl sm:text-4xl lg:text-5xl text-[#D0FF00] tracking-tight leading-[1.15] mb-3 sm:mb-4">
              Ready to Bring Your Vision to <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">Life?</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed mb-6 sm:mb-8">
              {contact.subtext}
            </p>

            {/* Direct Connect Action Buttons */}
            <div className="space-y-3 mb-6 sm:mb-8">
              <span className="text-xs font-semibold text-white/45 tracking-wide block mb-1.5">
                Direct Channels:
              </span>

              {/* WhatsApp Button - 44px+ tap target */}
              <motion.a
                href={socials.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-whatsapp-btn"
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#25D366]/60 transition-colors duration-300 min-h-[56px] bg-[#050505]/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-all shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#FEFFFC] block">
                      Chat on WhatsApp
                    </span>
                    <span className="text-xs text-white/50 font-normal">
                      {socials.whatsappDisplay}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#25D366] transition-transform shrink-0" />
              </motion.a>

              {/* Instagram #1: Graphic & Motion Designs */}
              <motion.a
                href={socials.instagramDesigns.url}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-instagram-designs-btn"
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#E1306C]/60 transition-colors duration-300 min-h-[56px] bg-[#050505]/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1306C]/20 border border-[#E1306C]/40 flex items-center justify-center text-[#E1306C] group-hover:scale-105 transition-all shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#FEFFFC]">
                        {socials.instagramDesigns.handle}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-[#D0FF00] tracking-wide">
                        Main
                      </span>
                    </div>
                    <span className="text-xs text-white/55 font-normal">
                      {socials.instagramDesigns.label}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#E1306C] transition-transform shrink-0" />
              </motion.a>

              {/* Instagram #2: Digital Art & Photo Manipulations */}
              <motion.a
                href={socials.instagramFx.url}
                target="_blank"
                rel="noopener noreferrer"
                id="contact-instagram-fx-btn"
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#8116E0]/60 transition-colors duration-300 min-h-[56px] bg-[#050505]/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8116E0]/20 border border-[#8116E0]/40 flex items-center justify-center text-[#FEFFFC] group-hover:scale-105 transition-all shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#FEFFFC]">
                        {socials.instagramFx.handle}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#8116E0]/30 text-[#FEFFFC] tracking-wide">
                        FX / Art
                      </span>
                    </div>
                    <span className="text-xs text-white/55 font-normal">
                      {socials.instagramFx.label}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#8116E0] transition-transform shrink-0" />
              </motion.a>

              {/* Email Direct Button */}
              <motion.a
                href={socials.emailMailto}
                id="contact-email-btn"
                whileHover={{ scale: 1.015, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#D0FF00]/60 transition-colors duration-300 min-h-[56px] bg-[#050505]/70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D0FF00]/15 border border-[#D0FF00]/30 flex items-center justify-center text-[#D0FF00] group-hover:scale-105 transition-all shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#FEFFFC] block">
                      Direct Email
                    </span>
                    <span className="text-xs text-white/50 font-normal">
                      {socials.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#D0FF00] transition-transform shrink-0" />
              </motion.a>
            </div>

            {/* Quick Copy Email action - 44px min tap target */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#D0FF00] transition-colors py-2 cursor-pointer min-h-[44px]"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#D0FF00]" />
                  <span className="text-[#D0FF00] font-medium">Email copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Click to copy email ({socials.email})</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/45 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D0FF00] animate-pulse"></span>
            <span>{contact.responseTime}</span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Inquiry Form with Web3Forms */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="rounded-3xl glass-panel border border-white/12 p-5 sm:p-8 md:p-10 bg-[#080808] shadow-2xl relative overflow-hidden">
            {/* Corner Tech Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#8116E0]/10 blur-3xl pointer-events-none" />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-12 sm:py-16 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D0FF00]/20 border border-[#D0FF00] flex items-center justify-center text-[#D0FF00] mb-5 shadow-[0_0_25px_rgba(208,255,0,0.4)]">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="font-montserrat font-medium italic text-2xl sm:text-3xl text-[#D0FF00] mb-2">
                  Transmission Received
                </h3>
                <p className="text-white/70 max-w-md mb-6 font-normal text-sm sm:text-base leading-relaxed px-2">
                  Thank you, <span className="text-[#D0FF00] font-bold">{formData.name}</span>. Your project brief has been successfully sent to <span className="text-white font-medium">{socials.email}</span>. Emkay will review your specifications and reply to{' '}
                  <span className="text-white font-medium">{formData.email}</span> within 4 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: contact.servicesOptions[0],
                        budget: contact.budgetRanges[1],
                        message: '',
                      });
                    }}
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FEFFFC] text-xs font-semibold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
                  >
                    Send Another Message
                  </button>
                  <a
                    href={socials.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-colors min-h-[44px] flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                  <h3 className="font-montserrat font-medium italic text-base sm:text-lg text-[#D0FF00]">
                    Project Inquiry &amp; Commission Brief
                  </h3>
                  <span className="text-xs font-semibold text-[#FEFFFC]/70">
                    Step <span className="font-baskervville italic text-[#D0FF00]">01</span> // Form
                  </span>
                </div>

                {/* Error Banner with WhatsApp fallback button */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-red-200 font-medium">
                          {errorMessage}
                        </p>
                        <p className="text-[11px] text-red-300/70 mt-0.5">
                          You can also chat directly on WhatsApp right away.
                        </p>
                      </div>
                    </div>

                    <a
                      href={whatsappFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-4 py-2 rounded-full bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.3)] min-h-[40px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </motion.div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      Your Name / Company *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova / Aether Records"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) {
                          setValidationErrors({ ...validationErrors, name: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px] ${
                        validationErrors.name
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                          : 'border-white/10 focus:border-[#D0FF00] focus:ring-1 focus:ring-[#D0FF00]'
                      }`}
                    />
                    {validationErrors.name && (
                      <span className="text-[11px] text-red-400 mt-1 block">
                        {validationErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) {
                          setValidationErrors({ ...validationErrors, email: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px] ${
                        validationErrors.email
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                          : 'border-white/10 focus:border-[#D0FF00] focus:ring-1 focus:ring-[#D0FF00]'
                      }`}
                    />
                    {validationErrors.email && (
                      <span className="text-[11px] text-red-400 mt-1 block">
                        {validationErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                    Service Required
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/10 focus:border-[#D0FF00] focus:ring-1 focus:ring-[#D0FF00] text-sm text-[#FEFFFC] outline-none transition-colors cursor-pointer min-h-[46px]"
                  >
                    {contact.servicesOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget Range - Tap targets at least 44px */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                    Estimated Budget Tier (USD)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {contact.budgetRanges.map((b) => {
                      const isSelected = formData.budget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: b })}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#D0FF00] text-[#050505] font-bold shadow-[0_0_15px_rgba(208,255,0,0.25)]'
                              : 'bg-white/[0.04] border border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message / Project Specs */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                    Project Vision &amp; Deliverables *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your release date, narrative references, dimensions, sound/theme inspirations, and key deliverables..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (validationErrors.message) {
                        setValidationErrors({ ...validationErrors, message: undefined });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors resize-none ${
                      validationErrors.message
                        ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                        : 'border-white/10 focus:border-[#D0FF00] focus:ring-1 focus:ring-[#D0FF00]'
                    }`}
                  />
                  {validationErrors.message && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {validationErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Pill Button - min-h-[48px] with loading state */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  id="contact-form-submit"
                  whileHover={loading ? {} : { scale: 1.015, boxShadow: '0 0 30px rgba(208,255,0,0.5)' }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  className={`w-full py-3.5 sm:py-4 rounded-full bg-[#D0FF00] text-[#050505] font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(208,255,0,0.35)] transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#050505] animate-spin" />
                      <span>Sending Project Brief...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#050505] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Send Project Brief</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
