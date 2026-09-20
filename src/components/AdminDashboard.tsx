import React, { useState, useEffect } from 'react';
import { PORTFOLIO_CONTENT, savePortfolioToFirestore, resetPortfolioToDefault, PortfolioContentType } from '../data/portfolioContent';
import { auth, googleProvider, db } from '../lib/firebase';
import { uploadCompressedImageToFirebase } from '../lib/imageUpload';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Shield, LogOut, Save, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, CheckCircle, ArrowLeft, Lock, AlertCircle, BarChart2, MessageSquareText, Layers, FileText, Globe, Star, Users, Phone, Layout, Sparkles } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [content, setContent] = useState<PortfolioContentType>(JSON.parse(JSON.stringify(PORTFOLIO_CONTENT)));
  const [saving, setSaving] = useState(false);
  const [savedSectionName, setSavedSectionName] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<
    | 'analytics'
    | 'briefs'
    | 'seo'
    | 'hero'
    | 'stats'
    | 'services'
    | 'projects'
    | 'about'
    | 'process'
    | 'testimonials'
    | 'contact'
    | 'footer'
  >('analytics');

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [briefsList, setBriefsList] = useState<any[]>([]);
  const [briefSearchQuery, setBriefSearchQuery] = useState('');
  const [briefStatusFilter, setBriefStatusFilter] = useState('All');
  const [briefServiceFilter, setBriefServiceFilter] = useState('All');
  const [expandedBriefIds, setExpandedBriefIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(false);
      if (firebaseUser) {
        if (firebaseUser.email !== 'emkayvisuals@gmail.com') {
          setAccessDenied(true);
          await signOut(auth);
          setUser(null);
          window.location.href = '/';
        } else {
          setAccessDenied(false);
          setUser(firebaseUser);
          fetchAdminData();
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      const summarySnap = await getDoc(doc(db, 'analytics', 'summary'));
      if (summarySnap.exists()) {
        setAnalyticsData(summarySnap.data());
      }
      const briefsSnap1 = await getDocs(collection(db, 'briefs'));
      const briefsSnap2 = await getDocs(collection(db, 'projectBriefs'));
      const map = new Map();
      briefsSnap1.forEach(d => {
        map.set(d.id, { id: d.id, ...d.data() });
      });
      briefsSnap2.forEach(d => {
        if (!map.has(d.id)) {
          map.set(d.id, { id: d.id, ...d.data() });
        }
      });
      const briefs = Array.from(map.values());
      setBriefsList(briefs.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()));
    } catch (err) {
      console.log('Error fetching analytics/briefs:', err);
    }
  };

  const handleUpdateBriefField = async (id: string, field: 'status' | 'notes', value: string) => {
    try {
      await updateDoc(doc(db, 'briefs', id), { [field]: value });
    } catch (e) {
      try {
        await updateDoc(doc(db, 'projectBriefs', id), { [field]: value });
      } catch (err) {
        console.log("Error updating brief", err);
      }
    }
    setBriefsList(briefsList.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const toggleExpandBrief = (id: string) => {
    setExpandedBriefIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredBriefs = briefsList.filter(b => {
    const matchesSearch = (b.name || '').toLowerCase().includes(briefSearchQuery.toLowerCase()) ||
                          (b.email || '').toLowerCase().includes(briefSearchQuery.toLowerCase()) ||
                          (b.service || '').toLowerCase().includes(briefSearchQuery.toLowerCase());
    const matchesStatus = briefStatusFilter === 'All' || (b.status || 'New') === briefStatusFilter;
    const matchesService = briefServiceFilter === 'All' || b.service === briefServiceFilter;
    return matchesSearch && matchesStatus && matchesService;
  });

  const handleGoogleLogin = async () => {
    try {
      setAccessDenied(false);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== 'emkayvisuals@gmail.com') {
        setAccessDenied(true);
        await signOut(auth);
        setUser(null);
        window.location.href = '/';
      } else {
        setUser(result.user);
        fetchAdminData();
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleSaveSection = async (sectionName: string) => {
    setSaving(true);
    setSuccessMessage('');
    try {
      await savePortfolioToFirestore(content);
      setSavedSectionName(sectionName);
      setSuccessMessage(`${sectionName} saved successfully to Firestore!`);
      setTimeout(() => {
        setSuccessMessage('');
        setSavedSectionName(null);
      }, 3500);
    } catch (err) {
      alert('Failed to save changes. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all portfolio content to default?')) {
      try {
        await resetPortfolioToDefault();
      } catch (err) {
        alert('Failed to reset.');
      }
    }
  };

  const handleDeleteBrief = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project brief submission?')) {
      try {
        await deleteDoc(doc(db, 'briefs', id));
      } catch (e) {
        try {
          await deleteDoc(doc(db, 'projectBriefs', id));
        } catch (err) {
          console.log("Error deleting brief", err);
        }
      }
      setBriefsList(briefsList.filter(b => b.id !== id));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FEFFFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#D0FF00]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FEFFFC] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8116E0] to-[#D0FF00]" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#D0FF00]/10 border border-[#D0FF00]/30 flex items-center justify-center text-[#D0FF00]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-xs text-white/50">Restricted Access // Emkay Visuals</p>
            </div>
          </div>

          {accessDenied && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Access Denied</span>
                Only emkayvisuals@gmail.com is authorized to access the admin dashboard. Redirecting to home...
              </div>
            </div>
          )}

          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            Please sign in with the authorized Google account to manage your portfolio content, visitor analytics, and incoming briefs.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold hover:bg-[#D0FF00] transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <a href="/" className="text-xs text-white/40 hover:text-white transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FEFFFC] flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8116E0]/20 border border-[#8116E0]/40 flex items-center justify-center text-[#D0FF00]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg tracking-tight">Emkay Visuals Admin</h1>
            <p className="text-xs text-white/50">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/10 transition-colors"
          >
            Preview Site
          </a>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 transition-colors flex items-center gap-1.5"
            title="Reset to default content"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            onClick={() => handleSaveSection('All Sections')}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : savedSectionName === 'All Sections' ? 'Saved!' : 'Save All Changes'}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="bg-[#D0FF00]/10 border-b border-[#D0FF00]/30 text-[#D0FF00] px-4 py-3 text-sm flex items-center justify-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1.5">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">Overview</div>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
              activeTab === 'analytics' ? 'bg-[#D0FF00] text-black font-semibold shadow-md' : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Visitor Insights
          </button>
          {(() => {
            const newBriefsCount = briefsList.filter(b => !b.status || b.status === 'New').length;
            return (
              <button
                onClick={() => setActiveTab('briefs')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  activeTab === 'briefs' ? 'bg-[#D0FF00] text-black font-semibold shadow-md' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquareText className="w-4 h-4" /> Project Briefs
                </div>
                {newBriefsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    {newBriefsCount} New
                  </span>
                ) : (
                  <span className="text-xs opacity-60">({briefsList.length})</span>
                )}
              </button>
            );
          })()}

          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-3 mt-6 mb-2">Site Sections</div>
          {[
            { id: 'seo', label: 'SEO & Meta Tags', icon: Globe },
            { id: 'hero', label: 'Hero & Brand', icon: Sparkles },
            { id: 'stats', label: 'Stats Row', icon: BarChart2 },
            { id: 'services', label: 'Services Bento', icon: Layers },
            { id: 'projects', label: 'Featured Projects', icon: Layout },
            { id: 'about', label: 'About & Toolkit', icon: Users },
            { id: 'process', label: 'Creative Process', icon: FileText },
            { id: 'testimonials', label: 'Testimonials', icon: Star },
            { id: 'contact', label: 'Contact Settings', icon: Phone },
            { id: 'footer', label: 'Footer & Rights', icon: Shield },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                  activeTab === tab.id
                    ? 'bg-[#D0FF00] text-black font-semibold shadow-md'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4 opacity-70" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Forms & Views */}
        <div className="lg:col-span-3 space-y-6 pb-24">
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Visitor Insights & Analytics</h2>
                  <p className="text-xs text-white/50">Anonymous traffic stats, device breakdowns, and button engagement.</p>
                </div>
              </div>

              {analyticsData ? (
                <div className="space-y-6">
                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-[#161616] border border-white/10">
                      <div className="text-xs text-white/50 mb-1">Total Visits</div>
                      <div className="text-3xl font-extrabold text-[#D0FF00]">{analyticsData.totalVisits || 1}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#161616] border border-white/10">
                      <div className="text-xs text-white/50 mb-1">Project Briefs Received</div>
                      <div className="text-3xl font-extrabold text-[#8116E0]">{briefsList.length}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-[#161616] border border-white/10">
                      <div className="text-xs text-white/50 mb-1">Total Social/Contact Clicks</div>
                      <div className="text-3xl font-extrabold text-white">
                        {Number(Object.values(analyticsData.clicks || {}).reduce((a: number, b: any) => a + Number(b), 0))}
                      </div>
                    </div>
                  </div>

                  {/* Button Click Counts */}
                  <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3">
                    <h3 className="text-sm font-semibold text-white/80">Social & Contact Button Clicks</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-[#0f0f0f] border border-white/5">
                        <div className="text-xs text-white/50 mb-1">WhatsApp</div>
                        <div className="text-xl font-bold text-[#D0FF00]">{analyticsData.clicks?.whatsapp || 0}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0f0f0f] border border-white/5">
                        <div className="text-xs text-white/50 mb-1">Instagram</div>
                        <div className="text-xl font-bold text-[#D0FF00]">{analyticsData.clicks?.instagram || 0}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0f0f0f] border border-white/5">
                        <div className="text-xs text-white/50 mb-1">Email</div>
                        <div className="text-xl font-bold text-[#D0FF00]">{analyticsData.clicks?.email || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Device & Language Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3">
                      <h3 className="text-sm font-semibold text-white/80">Device Types</h3>
                      <div className="space-y-2">
                        {Object.entries(analyticsData.deviceTypes || { Desktop: 1 }).map(([device, count]: [string, any]) => (
                          <div key={device} className="flex items-center justify-between text-sm p-2 rounded bg-[#0f0f0f]">
                            <span className="text-white/70">{device}</span>
                            <span className="font-bold text-[#D0FF00]">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3">
                      <h3 className="text-sm font-semibold text-white/80">Approximate Region / Language</h3>
                      <div className="space-y-2">
                        {Object.entries(analyticsData.countries || { en: 1 }).map(([lang, count]: [string, any]) => (
                          <div key={lang} className="flex items-center justify-between text-sm p-2 rounded bg-[#0f0f0f]">
                            <span className="text-white/70">{lang.toUpperCase()}</span>
                            <span className="font-bold text-[#D0FF00]">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-white/50 text-sm">No visitor analytics recorded yet. Browse the public site to generate initial metrics.</div>
              )}
            </div>
          )}

          {/* PROJECT BRIEFS TAB */}
          {activeTab === 'briefs' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold">Project Brief Submissions</h2>
                  <p className="text-xs text-white/50">Manage incoming client inquiries, update statuses, and add private notes.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D0FF00]">
                    Total: {briefsList.length} ({briefsList.filter(b => !b.status || b.status === 'New').length} New)
                  </span>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Search by name, email or service..."
                  value={briefSearchQuery}
                  onChange={(e) => setBriefSearchQuery(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-[#D0FF00]"
                />
                <select
                  value={briefStatusFilter}
                  onChange={(e) => setBriefStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white outline-none focus:border-[#D0FF00] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
                <select
                  value={briefServiceFilter}
                  onChange={(e) => setBriefServiceFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white outline-none focus:border-[#D0FF00] cursor-pointer"
                >
                  <option value="All">All Services</option>
                  {PORTFOLIO_CONTENT.contact.servicesOptions.map(svc => (
                    <option key={svc} value={svc}>{svc}</option>
                  ))}
                </select>
              </div>

              {filteredBriefs.length > 0 ? (
                <div className="space-y-4">
                  {filteredBriefs.map((brief) => {
                    const status = brief.status || 'New';
                    const isExpanded = !!expandedBriefIds[brief.id];
                    const statusColors: Record<string, string> = {
                      New: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                      Contacted: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                      'In Progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
                      Completed: 'bg-[#D0FF00]/20 text-[#D0FF00] border-[#D0FF00]/40',
                      Archived: 'bg-white/10 text-white/50 border-white/20',
                    };

                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                      `Hi ${brief.name}, regarding your project brief for ${brief.service} with Emkay Visuals...`
                    )}`;
                    const mailtoUrl = `mailto:${brief.email}?subject=${encodeURIComponent(`Re: Project Brief - ${brief.service} (Emkay Visuals)`)}`;

                    return (
                      <div
                        key={brief.id}
                        className="rounded-2xl bg-[#161616] border border-white/15 transition-all overflow-hidden"
                      >
                        {/* Brief Card Summary Header (Click to Toggle Expand) */}
                        <div
                          onClick={() => toggleExpandBrief(brief.id)}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02]"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D0FF00] font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                              {brief.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-sm text-white">{brief.name}</h3>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[status] || statusColors['New']}`}>
                                  {status}
                                </span>
                              </div>
                              <p className="text-xs text-white/60 mt-0.5">{brief.service} &bull; <span className="text-[#D0FF00]">{brief.budget}</span></p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-white/50 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <span>{new Date(brief.date || Date.now()).toLocaleDateString()}</span>
                            <span className="text-[#D0FF00] font-medium">{isExpanded ? 'Hide Details ▲' : 'View Details ▼'}</span>
                          </div>
                        </div>

                        {/* Expanded Details Section */}
                        {isExpanded && (
                          <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-white/10 bg-[#0f0f0f] space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3">
                              <div className="p-3 rounded-xl bg-[#161616] border border-white/10">
                                <span className="text-white/40 block mb-1">Email Address</span>
                                <a href={mailtoUrl} className="text-[#D0FF00] hover:underline font-medium">{brief.email}</a>
                              </div>
                              <div className="p-3 rounded-xl bg-[#161616] border border-white/10">
                                <span className="text-white/40 block mb-1">Target Deadline</span>
                                <span className="text-white font-medium">{brief.deadline || 'Flexible'}</span>
                              </div>
                              <div className="p-3 rounded-xl bg-[#161616] border border-white/10">
                                <span className="text-white/40 block mb-1">Reference / Moodboard</span>
                                {brief.referenceLink ? (
                                  <a href={brief.referenceLink} target="_blank" rel="noopener noreferrer" className="text-[#D0FF00] hover:underline truncate block">
                                    {brief.referenceLink}
                                  </a>
                                ) : (
                                  <span className="text-white/40">None provided</span>
                                )}
                              </div>
                            </div>

                            {/* Message / Vision */}
                            <div>
                              <label className="block text-xs font-medium text-white/50 mb-1">Project Vision &amp; Deliverables</label>
                              <p className="text-sm text-white/95 bg-[#161616] p-4 rounded-xl border border-white/10 whitespace-pre-wrap leading-relaxed">
                                {brief.message}
                              </p>
                            </div>

                            {/* Status & Private Notes Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Update Status</label>
                                <select
                                  value={status}
                                  onChange={(e) => handleUpdateBriefField(brief.id, 'status', e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white outline-none focus:border-[#D0FF00] cursor-pointer"
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Archived">Archived</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Private Notes (Admin Only)</label>
                                <input
                                  type="text"
                                  placeholder="Add private notes (e.g. quoted $1,200, follow up Friday)..."
                                  defaultValue={brief.notes || ''}
                                  onBlur={(e) => handleUpdateBriefField(brief.id, 'notes', e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#161616] border border-white/15 text-xs text-white placeholder-white/30 outline-none focus:border-[#D0FF00]"
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <MessageSquareText className="w-3.5 h-3.5" /> Reply on WhatsApp
                                </a>
                                <a
                                  href={mailtoUrl}
                                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Reply via Email
                                </a>
                              </div>

                              <button
                                onClick={() => handleDeleteBrief(brief.id)}
                                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete Brief
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#161616] rounded-2xl border border-white/10 space-y-2">
                  <FileText className="w-8 h-8 text-white/30 mx-auto" />
                  <p className="text-white/70 text-sm font-medium">No project briefs match your filter.</p>
                  <p className="text-white/40 text-xs">Try adjusting your search terms or status/service filters.</p>
                </div>
              )}
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">SEO & Meta Tags</h2>
                <button
                  onClick={() => handleSaveSection('SEO Settings')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save SEO
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={content.seo?.metaTitle || ''}
                  onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), metaTitle: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D0FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={content.seo?.metaDescription || ''}
                  onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), metaDescription: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D0FF00]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Open Graph Image URL (WhatsApp & Instagram Previews)</label>
                <input
                  type="text"
                  value={content.seo?.ogImage || ''}
                  onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), ogImage: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D0FF00]"
                />
              </div>
            </div>
          )}

          {/* HERO & BRAND TAB */}
          {activeTab === 'hero' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Hero & Brand Settings</h2>
                <button
                  onClick={() => handleSaveSection('Hero & Brand')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Hero
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={content.brand.name}
                    onChange={(e) => setContent({ ...content, brand: { ...content.brand, name: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={content.brand.roleTitle}
                    onChange={(e) => setContent({ ...content, brand: { ...content.brand, roleTitle: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Tagline / Motto</label>
                <textarea
                  rows={2}
                  value={content.brand.tagline}
                  onChange={(e) => setContent({ ...content, brand: { ...content.brand, tagline: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Hero Badge Main Text</label>
                  <input
                    type="text"
                    value={content.hero.badgeMain}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badgeMain: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Hero Badge Accent (Italic)</label>
                  <input
                    type="text"
                    value={content.hero.badgeAccent}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, badgeAccent: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Hero Heading Main</label>
                  <input
                    type="text"
                    value={content.hero.headingMain}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, headingMain: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Hero Heading Accent (Italic)</label>
                  <input
                    type="text"
                    value={content.hero.headingAccent}
                    onChange={(e) => setContent({ ...content, hero: { ...content.hero, headingAccent: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Hero Subtext Description</label>
                <textarea
                  rows={3}
                  value={content.hero.subtext}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtext: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* STATS ROW TAB */}
          {activeTab === 'stats' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Key Stats Row</h2>
                <button
                  onClick={() => handleSaveSection('Stats Row')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Stats
                </button>
              </div>

              {content.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#161616] border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Value (number)</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...content.stats];
                          newStats[idx].value = Number(e.target.value);
                          setContent({ ...content, stats: newStats });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Suffix (e.g. +, %)</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => {
                          const newStats = [...content.stats];
                          newStats[idx].suffix = e.target.value;
                          setContent({ ...content, stats: newStats });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.stats];
                          newStats[idx].label = e.target.value;
                          setContent({ ...content, stats: newStats });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Sublabel</label>
                    <input
                      type="text"
                      value={stat.sublabel}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[idx].sublabel = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SERVICES BENTO TAB */}
          {activeTab === 'services' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Services Bento Items</h2>
                  <p className="text-xs text-white/50">Add, edit or remove service offerings.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newService = {
                        id: 'service-' + Date.now(),
                        title: 'New Service',
                        tag: 'New Tag',
                        shortDesc: 'Short description here...',
                        fullDesc: 'Full detailed description here...',
                        iconName: 'Sparkles',
                        deliverables: ['Deliverable 1', 'Deliverable 2'],
                        colSpan: 'col-span-12 sm:col-span-6 lg:col-span-4',
                        previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                      };
                      setContent({ ...content, services: [...content.services, newService] });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Service
                  </button>
                  <button
                    onClick={() => handleSaveSection('Services')}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Services
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {content.services.map((svc, idx) => (
                  <div key={svc.id} className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D0FF00]">Service #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const newSvcs = content.services.filter((_, i) => i !== idx);
                          setContent({ ...content, services: newSvcs });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Title</label>
                        <input
                          type="text"
                          value={svc.title}
                          onChange={(e) => {
                            const newSvcs = [...content.services];
                            newSvcs[idx].title = e.target.value;
                            setContent({ ...content, services: newSvcs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Tag</label>
                        <input
                          type="text"
                          value={svc.tag}
                          onChange={(e) => {
                            const newSvcs = [...content.services];
                            newSvcs[idx].tag = e.target.value;
                            setContent({ ...content, services: newSvcs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Short Description</label>
                      <input
                        type="text"
                        value={svc.shortDesc}
                        onChange={(e) => {
                          const newSvcs = [...content.services];
                          newSvcs[idx].shortDesc = e.target.value;
                          setContent({ ...content, services: newSvcs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Full Description</label>
                      <textarea
                        rows={2}
                        value={svc.fullDesc}
                        onChange={(e) => {
                          const newSvcs = [...content.services];
                          newSvcs[idx].fullDesc = e.target.value;
                          setContent({ ...content, services: newSvcs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Deliverables (comma separated)</label>
                      <input
                        type="text"
                        value={svc.deliverables.join(', ')}
                        onChange={(e) => {
                          const newSvcs = [...content.services];
                          newSvcs[idx].deliverables = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setContent({ ...content, services: newSvcs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Preview Image URL / Path</label>
                      <input
                        type="text"
                        value={svc.previewImage || ''}
                        onChange={(e) => {
                          const newSvcs = [...content.services];
                          newSvcs[idx].previewImage = e.target.value;
                          setContent({ ...content, services: newSvcs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURED PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Featured Design Projects</h2>
                  <p className="text-xs text-white/50">Add, edit, delete, reorder or update project details and image paths.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newProj = {
                        id: 'proj-' + Date.now(),
                        title: 'New Artwork Title',
                        category: 'Sports Design' as any,
                        image: '/Images/emkay.webp',
                        description: 'Project description here...',
                        client: 'Client Name',
                        year: '2026',
                        tools: ['Photoshop', 'Illustrator'],
                        aspectRatio: 'portrait' as const,
                        featured: true,
                      };
                      setContent({ ...content, projects: [newProj, ...content.projects] });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                  <button
                    onClick={() => handleSaveSection('Projects')}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Projects
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {content.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D0FF00]">#{idx + 1}</span>
                        <span className="text-xs text-white/50">({proj.category})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (idx === 0) return;
                            const newProjs = [...content.projects];
                            const temp = newProjs[idx];
                            newProjs[idx] = newProjs[idx - 1];
                            newProjs[idx - 1] = temp;
                            setContent({ ...content, projects: newProjs });
                          }}
                          disabled={idx === 0}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === content.projects.length - 1) return;
                            const newProjs = [...content.projects];
                            const temp = newProjs[idx];
                            newProjs[idx] = newProjs[idx + 1];
                            newProjs[idx + 1] = temp;
                            setContent({ ...content, projects: newProjs });
                          }}
                          disabled={idx === content.projects.length - 1}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const newProjs = content.projects.filter((_, i) => i !== idx);
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 ml-2"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const newProjs = [...content.projects];
                            newProjs[idx].title = e.target.value;
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Category</label>
                        <select
                          value={proj.category}
                          onChange={(e) => {
                            const newProjs = [...content.projects];
                            newProjs[idx].category = e.target.value as any;
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        >
                          {content.categories.filter(c => c !== 'All').map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Image File Path (e.g. /Images/poster-01.webp or URL)</label>
                      <input
                        type="text"
                        value={proj.image}
                        onChange={(e) => {
                          const newProjs = [...content.projects];
                          newProjs[idx].image = e.target.value;
                          setContent({ ...content, projects: newProjs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Upload Project Image (Auto WebP &lt;300KB to Firebase Storage)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setSaving(true);
                            setSuccessMessage('Compressing and uploading image to Firebase Storage...');
                            const url = await uploadCompressedImageToFirebase(file, 'projects');
                            const newProjs = [...content.projects];
                            newProjs[idx].image = url;
                            setContent({ ...content, projects: newProjs });
                            setSuccessMessage('Project image compressed to WebP and uploaded successfully!');
                            setTimeout(() => setSuccessMessage(''), 3000);
                          } catch (err) {
                            console.error(err);
                            alert('Image upload failed.');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="w-full text-xs text-white/75 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D0FF00] file:text-black hover:file:bg-[#b8e600] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const newProjs = [...content.projects];
                          newProjs[idx].description = e.target.value;
                          setContent({ ...content, projects: newProjs });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Client</label>
                        <input
                          type="text"
                          value={proj.client || ''}
                          onChange={(e) => {
                            const newProjs = [...content.projects];
                            newProjs[idx].client = e.target.value;
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Year</label>
                        <input
                          type="text"
                          value={proj.year}
                          onChange={(e) => {
                            const newProjs = [...content.projects];
                            newProjs[idx].year = e.target.value;
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Tools (comma separated)</label>
                        <input
                          type="text"
                          value={proj.tools.join(', ')}
                          onChange={(e) => {
                            const newProjs = [...content.projects];
                            newProjs[idx].tools = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setContent({ ...content, projects: newProjs });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT & TOOLKIT TAB */}
          {activeTab === 'about' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">About Section, Artist ID & Toolkit</h2>
                <button
                  onClick={() => handleSaveSection('About & Toolkit')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save About
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Artist ID Image Path (e.g. /Images/emkay.webp)</label>
                <input
                  type="text"
                  value={content.about.photoUrl}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, photoUrl: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">About Badge Main</label>
                  <input
                    type="text"
                    value={content.about.badgeMain}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, badgeMain: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">About Badge Accent (Italic)</label>
                  <input
                    type="text"
                    value={content.about.badgeAccent}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, badgeAccent: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">About Heading Main</label>
                  <input
                    type="text"
                    value={content.about.headingMain}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, headingMain: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">About Heading Accent (Italic)</label>
                  <input
                    type="text"
                    value={content.about.headingAccent}
                    onChange={(e) => setContent({ ...content, about: { ...content.about, headingAccent: e.target.value } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Bio Paragraphs (separated by blank line)</label>
                <textarea
                  rows={4}
                  value={content.about.bioParagraphs.join('\n\n')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean);
                    setContent({ ...content, about: { ...content.about, bioParagraphs: paragraphs } });
                  }}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Toolkit Stack */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-[#D0FF00]">Software Tools / Toolkit Stack</h3>
                {content.about.softwareTools.map((tool, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#161616] rounded-xl border border-white/5">
                    <input
                      type="text"
                      value={tool.name}
                      onChange={(e) => {
                        const newTools = [...content.about.softwareTools];
                        newTools[idx].name = e.target.value;
                        setContent({ ...content, about: { ...content.about, softwareTools: newTools } });
                      }}
                      className="bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      placeholder="Tool Name"
                    />
                    <input
                      type="text"
                      value={tool.level}
                      onChange={(e) => {
                        const newTools = [...content.about.softwareTools];
                        newTools[idx].level = e.target.value;
                        setContent({ ...content, about: { ...content.about, softwareTools: newTools } });
                      }}
                      className="bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      placeholder="Level"
                    />
                    <input
                      type="text"
                      value={tool.type}
                      onChange={(e) => {
                        const newTools = [...content.about.softwareTools];
                        newTools[idx].type = e.target.value;
                        setContent({ ...content, about: { ...content.about, softwareTools: newTools } });
                      }}
                      className="bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      placeholder="Type"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATIVE PROCESS TAB */}
          {activeTab === 'process' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Creative Process Steps</h2>
                <button
                  onClick={() => handleSaveSection('Process')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Process
                </button>
              </div>

              <div className="space-y-6">
                {content.process.map((step, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D0FF00]">Step {step.stepNumber}</span>
                      <input
                        type="text"
                        value={step.duration}
                        onChange={(e) => {
                          const newProc = [...content.process];
                          newProc[idx].duration = e.target.value;
                          setContent({ ...content, process: newProc });
                        }}
                        className="w-32 bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-right"
                        placeholder="Duration"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const newProc = [...content.process];
                          newProc[idx].title = e.target.value;
                          setContent({ ...content, process: newProc });
                        }}
                        className="bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm font-bold"
                        placeholder="Step Title"
                      />
                      <input
                        type="text"
                        value={step.highlightBadge}
                        onChange={(e) => {
                          const newProc = [...content.process];
                          newProc[idx].highlightBadge = e.target.value;
                          setContent({ ...content, process: newProc });
                        }}
                        className="bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        placeholder="Badge"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => {
                        const newProc = [...content.process];
                        newProc[idx].description = e.target.value;
                        setContent({ ...content, process: newProc });
                      }}
                      className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS TAB */}
          {activeTab === 'testimonials' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold">Client Testimonials</h2>
                  <p className="text-xs text-white/50">Add, edit, delete, reorder entries with name, role, feedback, star rating, and avatar.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newT = {
                        id: 't-' + Date.now(),
                        name: 'New Client',
                        role: 'Art Director',
                        company: 'Studio Name',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        comment: 'Outstanding visual work and prompt turnaround.',
                        projectType: 'Design Project',
                        rating: 5,
                      };
                      setContent({ ...content, testimonials: [...content.testimonials, newT] });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Testimonial
                  </button>
                  <button
                    onClick={() => handleSaveSection('Testimonials')}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                  >
                    <Save className="w-4 h-4" /> Save Testimonials
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {content.testimonials.map((t, idx) => (
                  <div key={t.id} className="p-5 rounded-xl bg-[#161616] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#D0FF00]">Testimonial #{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (idx === 0) return;
                            const newT = [...content.testimonials];
                            const temp = newT[idx];
                            newT[idx] = newT[idx - 1];
                            newT[idx - 1] = temp;
                            setContent({ ...content, testimonials: newT });
                          }}
                          disabled={idx === 0}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === content.testimonials.length - 1) return;
                            const newT = [...content.testimonials];
                            const temp = newT[idx];
                            newT[idx] = newT[idx + 1];
                            newT[idx + 1] = temp;
                            setContent({ ...content, testimonials: newT });
                          }}
                          disabled={idx === content.testimonials.length - 1}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const newT = content.testimonials.filter((_, i) => i !== idx);
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].name = e.target.value;
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Role / Title</label>
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].role = e.target.value;
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Company</label>
                        <input
                          type="text"
                          value={t.company}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].company = e.target.value;
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Project Type</label>
                        <input
                          type="text"
                          value={t.projectType}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].projectType = e.target.value;
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Rating (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={t.rating || 5}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].rating = Number(e.target.value);
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-1">Avatar / Photo Path</label>
                        <input
                          type="text"
                          value={t.avatar}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx].avatar = e.target.value;
                            setContent({ ...content, testimonials: newT });
                          }}
                          className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Upload Client Avatar (Auto WebP &lt;300KB to Firebase Storage)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setSaving(true);
                            setSuccessMessage('Compressing and uploading avatar to Firebase Storage...');
                            const url = await uploadCompressedImageToFirebase(file, 'testimonials');
                            const newT = [...content.testimonials];
                            newT[idx].avatar = url;
                            setContent({ ...content, testimonials: newT });
                            setSuccessMessage('Testimonial avatar compressed to WebP and uploaded successfully!');
                            setTimeout(() => setSuccessMessage(''), 3000);
                          } catch (err) {
                            console.error(err);
                            alert('Avatar upload failed.');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="w-full text-xs text-white/75 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D0FF00] file:text-black hover:file:bg-[#b8e600] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/70 mb-1">Feedback Comment</label>
                      <textarea
                        rows={2}
                        value={t.comment}
                        onChange={(e) => {
                          const newT = [...content.testimonials];
                          newT[idx].comment = e.target.value;
                          setContent({ ...content, testimonials: newT });
                        }}
                        className="w-full bg-[#0f0f0f] border border-white/15 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT DETAILS & SOCIALS TAB */}
          {activeTab === 'contact' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Contact Details & Social Networks</h2>
                <button
                  onClick={() => handleSaveSection('Contact & Socials')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Contact
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Email Address</label>
                <input
                  type="email"
                  value={content.socials.email}
                  onChange={(e) => setContent({ ...content, socials: { ...content.socials, email: e.target.value, emailMailto: 'mailto:' + e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={content.socials.whatsapp}
                    onChange={(e) => setContent({ ...content, socials: { ...content.socials, whatsapp: e.target.value, whatsappDisplay: e.target.value, whatsappUrl: 'https://wa.me/' + e.target.value.replace(/\D/g, '') } })}
                    className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#D0FF00]">Instagram Account 1 (Designs)</h3>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Handle</label>
                    <input
                      type="text"
                      value={content.socials.instagramDesigns.handle}
                      onChange={(e) => setContent({ ...content, socials: { ...content.socials, instagramDesigns: { ...content.socials.instagramDesigns, handle: e.target.value } } })}
                      className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">URL</label>
                    <input
                      type="text"
                      value={content.socials.instagramDesigns.url}
                      onChange={(e) => setContent({ ...content, socials: { ...content.socials, instagramDesigns: { ...content.socials.instagramDesigns, url: e.target.value } } })}
                      className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#D0FF00]">Instagram Account 2 (FX)</h3>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Handle</label>
                    <input
                      type="text"
                      value={content.socials.instagramFx.handle}
                      onChange={(e) => setContent({ ...content, socials: { ...content.socials, instagramFx: { ...content.socials.instagramFx, handle: e.target.value } } })}
                      className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">URL</label>
                    <input
                      type="text"
                      value={content.socials.instagramFx.url}
                      onChange={(e) => setContent({ ...content, socials: { ...content.socials, instagramFx: { ...content.socials.instagramFx, url: e.target.value } } })}
                      className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER TAB */}
          {activeTab === 'footer' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold">Footer & Copyright Settings</h2>
                <button
                  onClick={() => handleSaveSection('Footer')}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#D0FF00] hover:bg-[#b8e600] text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" /> Save Footer
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Footer Tagline</label>
                <textarea
                  rows={2}
                  value={content.footer.tagline}
                  onChange={(e) => setContent({ ...content, footer: { ...content.footer, tagline: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Copyright Notice</label>
                <input
                  type="text"
                  value={content.footer.copyright}
                  onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Rights Note</label>
                <input
                  type="text"
                  value={content.footer.rightsNote}
                  onChange={(e) => setContent({ ...content, footer: { ...content.footer, rightsNote: e.target.value } })}
                  className="w-full bg-[#161616] border border-white/15 rounded-xl px-4 py-3 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
