import React from 'react';
import { Clock, CheckCircle2, Sparkles, Eye } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { PackageItem } from '@/src/types/index.ts';

export const PackagesPage: React.FC = () => {
  const { packages, openBookingModal, openPackageDetail } = useApp();

  return (
    <div id="packages-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8e512d]">
          All-Inclusive Luxury Combos
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2e2621]">
          Bridal & Occasion Makeup Packages
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Comprehensive multi-event packages designed for brides, engagement celebrations, and family members. Save up to 20% compared to booking single services individually.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const effectivePrice = pkg.discountPrice || pkg.price;
          const savings = pkg.discountPrice ? pkg.price - pkg.discountPrice : 0;

          return (
            <div
              key={pkg.id}
              id={`package-card-${pkg.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#ebdcd1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  {savings > 0 && (
                    <div className="absolute top-4 left-4 bg-[#8e512d] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                      Special Offer
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Included Items */}
                  <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8e512d] mb-2">
                      Package Inclusions
                    </p>
                    <ul className="space-y-1.5">
                      {pkg.includedItems.slice(0, 4).map((inc, i) => (
                        <li key={i} className="text-xs text-stone-700 flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                      Package Price
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-serif font-bold text-[#8e512d]">
                        ₹{effectivePrice.toLocaleString('en-IN')}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openPackageDetail(pkg)}
                      className="p-2.5 rounded-full bg-[#faf8f5] text-stone-700 hover:text-[#8e512d] hover:bg-[#f2e7df] transition-colors cursor-pointer"
                      title="View all details & photos"
                      aria-label={`View details for ${pkg.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      id={`pkg-page-book-btn-${pkg.id}`}
                      onClick={() => openBookingModal(pkg, 'package')}
                      className="px-4 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
