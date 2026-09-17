import React from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Phone,
  Heart,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { PackageItem, ServiceItem } from '@/src/types/index.ts';

export const HomePage: React.FC = () => {
  const {
    settings,
    services,
    packages,
    portfolio,
    reviews,
    offers,
    setActivePage,
    openBookingModal,
    openPackageDetail,
    wishlist,
    toggleWishlist,
    generateWhatsAppLink,
  } = useApp();

  const popularServices = services.filter((s) => s.isPopular).slice(0, 4);
  const featuredPackages = packages.slice(0, 3);
  const portfolioPreview = portfolio.slice(0, 6);
  const approvedReviews = reviews.filter((r) => r.isApproved).slice(0, 3);

  const categories = [
    { name: 'Bridal Makeup', cat: 'Bridal', img: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&auto=format&fit=crop&q=80' },
    { name: 'Reception Glam', cat: 'Reception', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=80' },
    { name: 'Engagement', cat: 'Engagement', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80' },
    { name: 'Party Makeup', cat: 'Party', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80' },
    { name: 'Haldi & Mehendi', cat: 'Haldi & Mehendi', img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&auto=format&fit=crop&q=80' },
    { name: 'Hair Styling', cat: 'Hair Styling', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&auto=format&fit=crop&q=80' },
    { name: 'Saree Draping', cat: 'Saree Draping', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80' },
    { name: 'Bridal Combos', cat: 'Combos', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=80' },
  ];

  return (
    <div id="home-page-container" className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#211b17] via-[#2d241f] to-[#1a1512] text-white">
        {/* Subtle background ambient overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
          <img
            src={settings.bannerUrl || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1600&auto=format&fit=crop&q=80'}
            alt="Luxury Beauty Studio"
            className="w-full h-full object-cover object-center filter blur-xs"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Award-Winning Bridal & HD Airbrush Artistry</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#fbf6f0] leading-[1.12]">
              Timeless Elegance For Your Most Cherished Celebrations
            </h1>

            <p className="text-base sm:text-lg text-[#d8c8bc] font-light max-w-2xl leading-relaxed">
              {settings.description ||
                'Specializing in handcrafted Royal Bengali Bridal with Chandan art, 24-hour waterproof HD Airbrush, and red-carpet reception glam.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-book-appointment-btn"
                onClick={() => {
                  const target = services[0];
                  if (target) openBookingModal(target, 'service');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-600/30 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>Book Your Makeup Appointment</span>
              </button>

              <button
                id="hero-view-portfolio-btn"
                onClick={() => setActivePage('portfolio')}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[#fbf6f0] font-medium text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold">500+</p>
                <p className="text-[11px] uppercase tracking-wider text-[#b8a497]">Brides Adorned</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold">4.9 ★</p>
                <p className="text-[11px] uppercase tracking-wider text-[#b8a497]">Verified Reviews</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif text-amber-300 font-bold">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#b8a497]">Sanitized Tools</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80"
                  alt="Ankita Bridal Makeup Look"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <span className="px-3 py-1 rounded-full bg-amber-500/90 text-stone-900 text-xs font-bold uppercase tracking-wider">
                    Signature Artistry
                  </span>
                  <p className="text-xl font-serif font-bold text-white mt-2">Royal Bengali Bridal Makeup</p>
                  <p className="text-xs text-amber-200">With intricate forehead Chandan work & Alta styling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIAL OFFERS BANNER */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#8e512d] via-[#a36239] to-[#743e1f] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{offers[0].badge || 'Exclusive Season Offer'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold">{offers[0].title}</h2>
              <p className="text-sm text-amber-100 max-w-xl">{offers[0].description}</p>
            </div>
            <button
              id="claim-special-offer-btn"
              onClick={() => setActivePage('packages')}
              className="px-6 py-3.5 bg-white text-[#743e1f] hover:bg-amber-50 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              {offers[0].ctaText || 'View Packages'}
            </button>
          </div>
        </section>
      )}

      {/* 3. CATEGORY QUICK DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8e512d]">
            Curated For Every Occasion
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2e2621] mt-1">Explore Services by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((c) => (
            <button
              key={c.name}
              id={`cat-card-${c.cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActivePage('services')}
              className="group flex flex-col items-center bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-[#8e512d]/40 transition-all text-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2.5 ring-2 ring-[#ebdcd1] group-hover:scale-105 transition-transform">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium text-stone-800 group-hover:text-[#8e512d] transition-colors line-clamp-2">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED BRIDAL PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8e512d]">
              Complete Makeover Combos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2e2621] mt-1">Featured Makeup Packages</h2>
          </div>
          <button
            onClick={() => setActivePage('packages')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-[#8e512d] hover:text-[#6a391c] group cursor-pointer"
          >
            <span>View All Packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {featuredPackages.map((pkg) => (
            <div
              key={pkg.id}
              id={`pkg-card-${pkg.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#ebdcd1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.images[0]}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {pkg.discountPrice && (
                  <div className="absolute top-4 left-4 bg-[#8e512d] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Special Offer
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pkg.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 leading-snug">{pkg.name}</h3>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">{pkg.description}</p>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-2">
                    {pkg.includedItems.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block uppercase">All-Inclusive</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-serif font-bold text-[#8e512d]">
                        ₹{(pkg.discountPrice || pkg.price).toLocaleString('en-IN')}
                      </span>
                      {pkg.discountPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openPackageDetail(pkg)}
                      className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-[#8e512d] transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      id={`book-pkg-btn-${pkg.id}`}
                      onClick={() => openBookingModal(pkg, 'package')}
                      className="px-4 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8e512d]">
              Most Requested Artistry
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2e2621] mt-1">Popular Makeup Services</h2>
          </div>
          <button
            onClick={() => setActivePage('services')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-[#8e512d] hover:text-[#6a391c] group cursor-pointer"
          >
            <span>View All Services</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((srv) => {
            const isWished = wishlist.includes(srv.id);
            return (
              <div
                key={srv.id}
                id={`srv-card-${srv.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggleWishlist(srv.id)}
                    title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-stone-700 hover:text-red-500 shadow-sm transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 bg-stone-950/75 text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {srv.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base leading-snug">{srv.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{srv.description}</p>
                    <div className="flex items-center space-x-1 text-stone-500 text-[11px] mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.duration}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Starting at</span>
                      <span className="text-lg font-serif font-bold text-[#8e512d]">
                        ₹{srv.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      id={`book-srv-btn-${srv.id}`}
                      onClick={() => openBookingModal(srv, 'service')}
                      className="px-3.5 py-1.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INTERNATIONAL LUXURY BRANDS USED */}
      <section className="bg-[#f5ece5] py-12 border-y border-[#ebdcd1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8e6e58] font-bold mb-6">
            Crafted Exclusively With World-Class Professional Products
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-stone-700 font-serif font-semibold text-lg sm:text-xl tracking-wider">
            <span>MAC COSMETICS</span>
            <span>HUDA BEAUTY</span>
            <span>TEMPTU AIRBRUSH</span>
            <span>BOBBI BROWN</span>
            <span>CHARLOTTE TILBURY</span>
            <span>KRYOLAN PRO</span>
            <span>DIOR BACKSTAGE</span>
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO PREVIEW GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8e512d]">
              Artistry In Every Brush Stroke
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2e2621] mt-1">Real Brides Portfolio</h2>
          </div>
          <button
            onClick={() => setActivePage('portfolio')}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-[#8e512d] hover:text-[#6a391c] group cursor-pointer"
          >
            <span>Explore All 50+ Looks</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {portfolioPreview.map((item) => (
            <div
              key={item.id}
              id={`portfolio-preview-${item.id}`}
              onClick={() => setActivePage('portfolio')}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.type === 'video' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                  {item.category}
                </span>
                <p className="text-sm sm:text-base font-serif font-bold leading-snug line-clamp-2">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CLIENT REVIEWS */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">Loved By Discerning Brides</h2>
            <p className="text-sm text-stone-600 mt-2">
              Real experiences from clients who trusted Ankita for their once-in-a-lifetime moments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {approvedReviews.map((rev) => (
              <div
                key={rev.id}
                id={`home-review-${rev.id}`}
                className="bg-[#faf8f5] p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-stone-700 text-sm italic leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="pt-4 mt-6 border-t border-stone-200/60 flex items-center space-x-3">
                  {rev.photoUrl ? (
                    <img
                      src={rev.photoUrl}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#ebdcd1] text-[#8e512d] flex items-center justify-center font-bold text-sm">
                      {rev.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-stone-900">{rev.customerName}</p>
                    <p className="text-xs text-[#8e512d]">{rev.serviceName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT / BOOKING INQUIRY CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2e2621] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-bold">
              Reserve Your Auspicious Date
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
              Dates Fill Quickly During Wedding Seasons
            </h2>
            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              We accept limited bridal appointments per day to ensure Ankita personally devotes undivided attention to you.
              Verify availability now or contact us directly on WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-300">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Double Booking Guarantee</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Transparent Advance Breakdown</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              id="cta-book-appointment-btn"
              onClick={() => {
                const target = services[0];
                if (target) openBookingModal(target, 'service');
              }}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all text-center cursor-pointer"
            >
              Book Online Now
            </button>
            <a
              id="cta-whatsapp-inquiry-btn"
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct Inquiry</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
