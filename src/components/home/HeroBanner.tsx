import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  Heart,
  Star,
  ArrowRight,
  Maximize2,
  X,
  Layers,
  Eye,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ServiceItem } from '@/src/types/index.ts';

export const HeroBanner: React.FC = () => {
  const { settings, services, openBookingModal, generateWhatsAppLink, isAdmin, setActivePage } = useApp();
  const [showFullBannerModal, setShowFullBannerModal] = useState(false);
  const [viewMode, setViewMode] = useState<'poster' | 'interactive'>('poster');

  // Candidate fallback paths for the banner image to guarantee it always renders
  const BANNER_FALLBACKS = [
    '/images/hero_banner_full.jpg',
    '/images/ankita_banner.jpg',
    '/images/ankita_banner.png',
    '/images/user_banner.jpg',
    '/images/user_banner.png',
  ];

  const [currentBannerUrl, setCurrentBannerUrl] = useState<string>(() => {
    if (settings.bannerUrl && !settings.bannerUrl.startsWith('blob:')) {
      return settings.bannerUrl;
    }
    return '/images/hero_banner_full.jpg';
  });
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  useEffect(() => {
    if (settings.bannerUrl && !settings.bannerUrl.startsWith('blob:')) {
      setCurrentBannerUrl(settings.bannerUrl);
    } else {
      setCurrentBannerUrl('/images/hero_banner_full.jpg');
    }
    setFallbackAttempt(0);
    setBannerLoaded(false);
  }, [settings.bannerUrl]);

  const handleBannerImgError = () => {
    if (fallbackAttempt < BANNER_FALLBACKS.length) {
      const nextUrl = BANNER_FALLBACKS[fallbackAttempt];
      setFallbackAttempt((prev) => prev + 1);
      setCurrentBannerUrl(nextUrl);
    }
  };

  // Dynamic banner configurations from settings
  const title = settings.bannerTitle || 'Makeup';
  const subtitle = settings.bannerSubtitle || 'A R T I S T';
  const slogan = settings.bannerSlogan || 'LOOK GOOD • FEEL CONFIDENT';
  const tagline = settings.bannerTagline || 'Your Beauty Our Passion ♡';
  const rightBadge = settings.bannerRightBadge || 'BEAUTY BEGINS WITH SELF LOVE';
  const rightQuote = settings.bannerRightQuote || 'Be Your Own Kind of Beautiful';
  const bannerImage = currentBannerUrl;
  const trust1 = settings.bannerTrust1 || 'Professional Service';
  const trust2 = settings.bannerTrust2 || '100% Hygiene';
  const trust3 = settings.bannerTrust3 || 'Natural & Long Lasting Look';

  // Helper to find related service or fallback to first
  const handleServiceClick = (categoryName: string) => {
    const match =
      services.find((s) => s.name.toLowerCase().includes(categoryName.toLowerCase())) ||
      services.find((s) => s.category.toLowerCase().includes(categoryName.toLowerCase())) ||
      services[0];
    if (match) {
      openBookingModal(match, 'service');
    }
  };

  // 8 Specific Banner Services with custom handcrafted vector icons matching the original design
  const bannerServices = [
    {
      id: 'party',
      name: 'Party Makeup',
      category: 'Party',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="currentColor">
          <path d="M12 28c0-3 3-5 6-5s6 2 6 5v2H12v-2z" opacity="0.3"/>
          <path d="M28 6l5 5-14 14-5-5L28 6zm-2 2l-11 11 3 3 11-11-3-3z"/>
          <circle cx="10" cy="30" r="3"/>
          <path d="M22 25l-4 4 2 2 4-4-2-2z"/>
        </svg>
      ),
    },
    {
      id: 'bridal',
      name: 'Bridal Makeup',
      category: 'Bridal',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7c-6 0-11 5-11 11v14h22V18c0-6-5-11-11-11z" strokeWidth="1.5" fill="#ffd9e2" fillOpacity="0.4"/>
          <path d="M15 17a5 5 0 0010 0v-2a5 5 0 00-10 0v2z"/>
          <circle cx="20" cy="14" r="1.5" fill="currentColor"/>
          <path d="M14 26c1.5 2 3.5 3 6 3s4.5-1 6-3"/>
          <path d="M11 13l9-6 9 6" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'eye',
      name: 'Eye Makeup',
      category: 'Party',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 20c3-6 8-9 12-9s9 3 12 9c-3 6-8 9-12 9s-9-3-12-9z" strokeWidth="2"/>
          <circle cx="20" cy="20" r="4.5" fill="#7a1236"/>
          <circle cx="21.5" cy="18.5" r="1.5" fill="#ffffff"/>
          <path d="M13 13l-3-3M20 9V5M27 13l3-3" strokeLinecap="round" strokeWidth="1.8"/>
        </svg>
      ),
    },
    {
      id: 'hd',
      name: 'HD Makeup',
      category: 'Bridal',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="20" r="11"/>
          <path d="M16 19c.5-1 2-1 2.5 0M21.5 19c.5-1 2-1 2.5 0"/>
          <path d="M17 24c1 1.5 5 1.5 6 0" strokeLinecap="round"/>
          <path d="M6 10l2 2M34 10l-2 2M30 6l1 3" strokeWidth="1.5"/>
          <circle cx="31" cy="28" r="1.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      id: 'hair',
      name: 'Hair Styling',
      category: 'Hair Styling',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="12" r="6" fill="#ffd9e2"/>
          <path d="M13 18c0 4 3 8 7 8s7-4 7-8"/>
          <path d="M15 26c0 3 2 7 5 7s5-4 5-7"/>
          <path d="M11 12c-2 4-2 9 1 12M29 12c2 4 2 9-1 12" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'nail',
      name: 'Nail Art',
      category: 'Party',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 28V15a4 4 0 018 0v13" strokeWidth="2"/>
          <path d="M17 15a3 3 0 016 0v3h-6v-3z" fill="#7a1236"/>
          <path d="M12 28v-7a3 3 0 016 0v7M28 28v-7a3 3 0 00-6 0v7"/>
          <path d="M13 21a2 2 0 014 0v2h-4v-2z" fill="#ffd9e2"/>
        </svg>
      ),
    },
    {
      id: 'skincare',
      name: 'Skincare',
      category: 'Bridal',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 17a6 6 0 0012 0c0-4-6-10-6-10s-6 6-6 10z" fill="#ffd9e2"/>
          <path d="M12 28c2 3 5 4 8 4s6-1 8-4" strokeLinecap="round"/>
          <circle cx="16" cy="22" r="1.5" fill="currentColor"/>
          <circle cx="24" cy="22" r="1.5" fill="currentColor"/>
        </svg>
      ),
    },
    {
      id: 'classes',
      name: 'Makeup Classes',
      category: 'Combos',
      icon: (
        <svg viewBox="0 0 40 40" className="w-6 h-6 text-[#7a1236]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 32h12a3 3 0 003-3v-7H11v7a3 3 0 003 3z" fill="#ffd9e2"/>
          <path d="M15 22L13 8l3 1 2 13M20 22V7l3 1v14M25 22l2-14 3 1-2 13" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div id="hero-banner-showcase" className="relative w-full overflow-hidden bg-[#fff0f3]">
      {/* ========================================================================= */}
      {/* MAIN BANNER CONTAINER WITH PRECISE DESIGN FROM THE UPLOADED BANNER       */}
      {/* ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-0">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/80 bg-gradient-to-br from-[#fef5f7] via-[#fdebed] to-[#fcd9e2]">
          {/* Top Control Bar: Mode Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 pt-4 pb-3 border-b border-rose-200/70 bg-white/70 backdrop-blur-xs">
            <div className="flex items-center space-x-2">
              <button
                id="banner-mode-poster-btn"
                onClick={() => setViewMode('poster')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === 'poster'
                    ? 'bg-gradient-to-r from-[#6b0f2b] to-[#8a143a] text-white shadow-md ring-2 ring-rose-300'
                    : 'bg-rose-100/80 hover:bg-rose-200 text-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>👑 অফিসিয়াল ব্যানার ফটো (Official Banner)</span>
              </button>

              <button
                id="banner-mode-interactive-btn"
                onClick={() => setViewMode('interactive')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-gradient-to-r from-[#6b0f2b] to-[#8a143a] text-white shadow-md ring-2 ring-rose-300'
                    : 'bg-rose-100/80 hover:bg-rose-200 text-stone-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                <span>💄 সার্ভিস মেনু ভিউ (Services Menu)</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() => setActivePage('admin')}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs shadow-md flex items-center space-x-1.5 border border-amber-300/80 transition-all hover:scale-105 cursor-pointer"
                  title="Open Banner Manager in Admin Panel"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>ব্যানার এডিট (Admin)</span>
                </button>
              )}

              <button
                onClick={() => setShowFullBannerModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 text-[#7a1236] border border-rose-200 text-xs font-bold shadow-xs flex items-center space-x-1 cursor-pointer transition-colors"
                title="View Full High-Resolution Banner"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#7a1236]" />
                <span className="hidden sm:inline">ব্যানার বড় করে দেখুন</span>
              </button>
            </div>
          </div>
          
          {/* Background Decorative Blossom Blooms (Top Left & Ambient) */}
          <div className="absolute -top-10 -left-10 w-44 h-44 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,#fb7185,transparent_70%)] blur-2xl" />
          <div className="absolute top-2 left-2 pointer-events-none opacity-80 hidden sm:block">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-rose-300 fill-current opacity-75">
              <path d="M50 0C55 25 75 45 100 50C75 55 55 75 50 100C45 75 25 55 0 50C25 45 45 25 50 0Z" opacity="0.3"/>
              <circle cx="45" cy="35" r="8" fill="#fda4af"/>
              <circle cx="35" cy="45" r="7" fill="#fb7185"/>
              <circle cx="55" cy="45" r="7" fill="#fda4af"/>
              <circle cx="45" cy="55" r="8" fill="#f43f5e"/>
            </svg>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: FULL OFFICIAL BANNER POSTER (DEFAULT & HIGHLY EYE-CATCHING)       */}
          {/* ========================================================================= */}
          {viewMode === 'poster' ? (
            <div className="relative p-3 sm:p-5 lg:p-6 space-y-4">
              {/* Full Banner Poster Container */}
              <div 
                onClick={() => setShowFullBannerModal(true)}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[3/2] min-h-[220px] sm:min-h-[360px] md:min-h-[460px] max-h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/90 bg-gradient-to-br from-[#6b0f2b] via-[#851238] to-[#590a21] group cursor-pointer ring-2 ring-rose-200/60 flex items-center justify-center"
                title="Click to view full high-resolution banner"
              >
                {/* Background ambient pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f43f5e22,transparent_70%)] pointer-events-none" />

                {/* Shimmer loading placeholder */}
                {!bannerLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#590a21] via-[#7d1235] to-[#590a21] animate-pulse flex flex-col items-center justify-center text-rose-100 space-y-2 z-0">
                    <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                    <span className="text-xs sm:text-sm font-semibold tracking-wider text-rose-200">
                      অফিসিয়াল ব্যানার লোড হচ্ছে...
                    </span>
                  </div>
                )}

                <img
                  key={bannerImage}
                  src={bannerImage}
                  alt="Ankita Makeup Artist Official Banner"
                  onLoad={() => setBannerLoaded(true)}
                  onError={handleBannerImgError}
                  className={`relative z-10 w-full h-full object-contain mx-auto transition-all duration-500 ${
                    bannerLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } group-hover:scale-[1.01]`}
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Subtle Hover Zoom Overlay */}
                <div className="absolute inset-0 z-20 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-2 border border-white/30 shadow-xl">
                    <Maximize2 className="w-4 h-4 text-amber-300" />
                    <span>ফুল স্ক্রিনে দেখতে ক্লিক করুন</span>
                  </div>
                </div>

                {/* Floating Bottom Left Studio Badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-[#7a1236]/90 backdrop-blur-md text-amber-200 text-[11px] font-bold tracking-wider uppercase border border-amber-300/40 shadow-lg flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Ankita Makeup Artist • Official Studio</span>
                  </div>
                </div>
              </div>

              {/* Instant High-Conversion Action Bar Directly Below Poster */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-rose-200/80 shadow-md">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    id="poster-banner-book-now"
                    onClick={() => {
                      const bridalService = services.find((s) => s.name.includes('Bridal')) || services[0];
                      if (bridalService) openBookingModal(bridalService, 'service');
                    }}
                    className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-[#6b0f2b] via-[#7d1235] to-[#590a21] hover:from-[#7e1236] hover:to-[#4a071a] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer border border-amber-300/40"
                  >
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>BOOK APPOINTMENT (বুক করুন)</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>

                  <a
                    href={`tel:${settings.phone}`}
                    className="px-4 py-3 bg-white hover:bg-rose-50 text-[#7a1236] rounded-xl border border-rose-300 font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-transform hover:scale-105"
                  >
                    <Phone className="w-4 h-4 text-[#7a1236]" />
                    <span className="hidden sm:inline font-mono">{settings.phone}</span>
                    <span className="sm:hidden">কল করুন</span>
                  </a>

                  <a
                    href={generateWhatsAppLink("Hello Ankita! I saw your banner and would like to book a makeup appointment.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span className="hidden sm:inline">হোয়াটসঅ্যাপ</span>
                  </a>
                </div>

                {/* Quick Service Tags for fast booking */}
                <div className="hidden lg:flex items-center space-x-2 text-xs text-stone-600 font-medium">
                  <span className="text-[#7a1236] font-bold">সার্ভিস সমূহ:</span>
                  {['Bridal', 'HD Makeup', 'Party Makeup', 'Saree Draping', 'Nail Art'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleServiceClick(tag)}
                      className="px-2.5 py-1 rounded-lg bg-rose-100/80 hover:bg-rose-200 text-[#7a1236] font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: INTERACTIVE SERVICES & ARTIST PORTRAIT GRID                       */
            /* ========================================================================= */
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-4 items-center pt-6 sm:pt-10 px-4 sm:px-8 lg:px-12 pb-6 lg:pb-8">
              
              {/* ------------------------------------------------------------- */}
              {/* LEFT COLUMN: BRAND HEADER, 8 SERVICES, AND CTA BUTTON        */}
              {/* ------------------------------------------------------------- */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
                
                {/* Top Row: Crown + Line Art Face + Brand Title */}
                <div className="space-y-1 sm:space-y-2">
                  {/* Gold Crown */}
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="relative inline-flex items-center justify-center">
                      <svg viewBox="0 0 60 40" className="w-10 sm:w-12 h-7 sm:h-8 drop-shadow-sm">
                        <path
                          d="M6 32h48v3H6zm2-4l4-18 10 11 8-15 8 15 10-11 4 18H8z"
                          fill="url(#goldGradient)"
                        />
                        <circle cx="12" cy="8" r="2.5" fill="#fef08a"/>
                        <circle cx="30" cy="4" r="3" fill="#fef08a"/>
                        <circle cx="48" cy="8" r="2.5" fill="#fef08a"/>
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d97706" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Brand Title: Makeup ARTIST with Woman Silhouette */}
                  <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                    {/* Woman Beauty Line Silhouette */}
                    <svg viewBox="0 0 50 60" className="w-10 sm:w-14 h-12 sm:h-16 text-[#7a1236] shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8c8-4 18-2 22 6 3 6 1 14-2 18-3 4-8 8-12 10" strokeLinecap="round"/>
                      <path d="M18 20c4-1 8 0 10 3" strokeWidth="1.5"/>
                      <path d="M22 28c3 1 6 0 7-1" strokeLinecap="round"/>
                      <path d="M23 34c2 2 5 2 7 0" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="10" cy="42" r="5" fill="#fb7185" stroke="#7a1236"/>
                      <path d="M8 38c2 4 6 4 8 0" stroke="#7a1236"/>
                    </svg>

                    {/* Typography */}
                    <div className="text-left">
                      <h1
                        style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                        className="text-5xl sm:text-7xl lg:text-8xl text-[#7a1236] font-normal leading-[0.9] drop-shadow-xs tracking-wide"
                      >
                        {title}
                      </h1>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-black tracking-[0.35em] text-stone-900 uppercase ml-1 sm:ml-2 mt-1">
                        {subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle with Heart: e.g. LOOK GOOD ♥ FEEL CONFIDENT */}
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-stone-700 pt-1">
                    <span className="w-6 sm:w-8 h-[1.5px] bg-[#7a1236]/50 inline-block" />
                    <span className="tracking-[0.2em] font-serif">{slogan}</span>
                    <span className="w-6 sm:w-8 h-[1.5px] bg-[#7a1236]/50 inline-block" />
                  </div>

                  {/* Tagline Cursive: Your Beauty Our Passion ♡ */}
                  <p
                    style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                    className="text-2xl sm:text-3xl lg:text-4xl text-[#9f1239] font-normal pt-1"
                  >
                    {tagline}
                  </p>
                </div>

                {/* 8 Custom Services */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-w-lg mx-auto lg:mx-0">
                    {bannerServices.map((srv) => (
                      <button
                        key={srv.id}
                        onClick={() => handleServiceClick(srv.name)}
                        className="flex items-center space-x-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/90 hover:bg-white border border-rose-200/90 shadow-xs hover:shadow-md hover:border-rose-400 transition-all text-left group cursor-pointer"
                        title={`Book ${srv.name}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-100/70 group-hover:bg-rose-200 flex items-center justify-center shrink-0 transition-colors">
                          {srv.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-[#7a1236] transition-colors leading-tight">
                          {srv.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Button & Actions */}
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <button
                    id="banner-book-now-main-btn"
                    onClick={() => {
                      const bridalService = services.find((s) => s.name.includes('Bridal')) || services[0];
                      if (bridalService) openBookingModal(bridalService, 'service');
                    }}
                    className="w-full sm:w-auto px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#6b0f2b] via-[#7d1235] to-[#590a21] hover:from-[#7e1236] hover:to-[#4a071a] text-white font-bold text-xs sm:text-sm tracking-widest uppercase shadow-xl hover:shadow-rose-950/40 hover:scale-[1.03] active:scale-98 transition-all flex items-center justify-center space-x-2.5 cursor-pointer border border-amber-300/40 group"
                  >
                    <Calendar className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                    <span>BOOK NOW</span>
                    <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${settings.phone}`}
                      className="p-3 bg-white/90 hover:bg-white text-[#7a1236] rounded-full border border-rose-200 shadow-sm transition-transform hover:scale-110"
                      title={`Call Ankita at ${settings.phone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={generateWhatsAppLink("Hello Ankita! I am contacting you directly from your banner to book makeup services.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-sm transition-transform hover:scale-110"
                      title="Chat with Ankita on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </a>
                    <button
                      onClick={() => setShowFullBannerModal(true)}
                      className="px-3 py-2 bg-white/90 hover:bg-white text-stone-700 text-xs font-semibold rounded-full border border-rose-200 shadow-sm flex items-center space-x-1 cursor-pointer"
                      title="View Full High-Resolution Banner"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#7a1236]" />
                      <span className="hidden sm:inline">View Banner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* RIGHT COLUMN: ANKITA PORTRAIT & LUXURY BADGES                */}
              {/* ------------------------------------------------------------- */}
              <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0">
                {/* Self-Love Magenta Brush Badge (Top Right) */}
                <div className="absolute -top-3 sm:-top-6 right-2 sm:right-6 z-20 pointer-events-none transform rotate-3">
                  <div className="relative bg-gradient-to-r from-[#b51750] via-[#9d174d] to-[#831843] text-white px-4 py-2 rounded-2xl shadow-lg border border-pink-300/40 text-center">
                    <p className="text-[10px] sm:text-xs font-serif font-black tracking-widest uppercase leading-tight">
                      {rightBadge}
                    </p>
                  </div>

                  <div
                    style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
                    className="text-lg sm:text-xl text-[#831843] font-semibold text-right mt-1 drop-shadow-xs"
                  >
                    {rightQuote}
                  </div>
                </div>

                {/* Main Model/Artist Image Container with Extracted Bride Portrait */}
                <div 
                  onClick={() => setShowFullBannerModal(true)}
                  className="relative w-full max-w-xs sm:max-w-md aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-gradient-to-t from-[#6b0f2b] to-rose-200 ring-4 ring-rose-300/40 cursor-pointer group"
                  title="Click to view full banner"
                >
                  <img
                    src="/images/bride_portrait.jpg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = bannerImage;
                    }}
                    alt="Ankita - Professional Makeup Artist"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Soft gradient bottom vignette for visual warmth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Overlay Label */}
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                      Lead Artist • Ankita
                    </span>
                    <p className="text-xs sm:text-sm font-serif font-semibold text-rose-100 mt-1">
                      Signature Bengali Bridal & Waterproof HD Makeovers
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM CURVED BURGUNDY RIBBON (EXACTLY MATCHING THE BANNER)             */}
          {/* ========================================================================= */}
          <div className="relative w-full bg-gradient-to-r from-[#50081d] via-[#740f2e] to-[#590a21] text-white py-3 sm:py-4 px-4 sm:px-8 border-t-2 border-amber-300/40">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around gap-4 text-center sm:text-left">
              
              {/* 1. Professional Service */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-amber-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-100">{trust1}</p>
                </div>
              </div>

              {/* 2. 100% Hygiene */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-rose-300 shrink-0">
                  <Heart className="w-4 h-4 fill-rose-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-100">{trust2}</p>
                </div>
              </div>

              {/* 3. Natural & Long Lasting Look */}
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-amber-300 shrink-0">
                  <Star className="w-4 h-4 fill-amber-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-100">{trust3}</p>
                </div>
              </div>

              {/* Gold Floral Ornamental Leaf Motif */}
              <div className="hidden md:flex items-center space-x-1 text-amber-300/80">
                <svg viewBox="0 0 100 24" className="w-24 h-6 fill-current">
                  <path d="M0 12c15-4 25-10 35-10s20 8 35 10c-15 4-25 10-35 10s-20-8-35-10z" opacity="0.4"/>
                  <circle cx="50" cy="12" r="3" fill="#fef08a"/>
                  <circle cx="35" cy="12" r="2" fill="#fef08a"/>
                  <circle cx="65" cy="12" r="2" fill="#fef08a"/>
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL HD BANNER GRAPHIC MODAL PREVIEW                                      */}
      {/* ========================================================================= */}
      {showFullBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-stone-950 rounded-3xl overflow-hidden border border-rose-500/30 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-[#7a1236] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Ankita Makeup Artist — Official HD Banner
                </span>
              </div>
              <button
                onClick={() => setShowFullBannerModal(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Graphic Image Display */}
            <div className="p-2 sm:p-4 bg-stone-900 flex justify-center">
              <img
                src={bannerImage}
                onError={handleBannerImgError}
                alt="Official Ankita Makeup Artist Banner"
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-lg"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-stone-400">
                Contact Ankita directly at <span className="text-amber-400 font-bold">{settings.phone}</span>
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href={`tel:${settings.phone}`}
                  className="px-4 py-2 bg-[#7a1236] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <button
                  onClick={() => {
                    setShowFullBannerModal(false);
                    const b = services[0];
                    if (b) openBookingModal(b, 'service');
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Book Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
