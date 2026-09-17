import React, { useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { PackageItem } from '@/src/types/index.ts';

interface PackageDetailModalProps {
  pkg: PackageItem | null;
  onClose: () => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({ pkg, onClose }) => {
  const { openBookingModal } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!pkg) return null;

  const images = pkg.images && pkg.images.length > 0 ? pkg.images : ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBookNow = () => {
    onClose();
    openBookingModal(pkg, 'package');
  };

  const effectivePrice = pkg.discountPrice || pkg.price;
  const savings = pkg.discountPrice ? pkg.price - pkg.discountPrice : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Box */}
      <div
        id="package-detail-modal-card"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Carousel */}
        <div className="md:w-1/2 relative bg-stone-900 min-h-[300px] md:min-h-full flex flex-col justify-between">
          <div className="relative h-72 md:h-full w-full overflow-hidden">
            <img
              src={images[activeImageIndex]}
              alt={`${pkg.name} preview`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Prev / Next Image buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeImageIndex === idx ? 'bg-amber-400 w-6' : 'bg-white/50'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inclusions & Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
          <div className="space-y-5">
            <div>
              {pkg.isFeatured && (
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                  Featured Bridal Combo
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
                {pkg.name}
              </h2>

              <div className="flex items-center space-x-2 text-xs text-stone-500 mt-2">
                <Clock className="w-4 h-4 text-[#8e512d]" />
                <span>Estimated duration: {pkg.duration}</span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed font-light">{pkg.description}</p>

            {/* Included items */}
            <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8e512d] mb-3">
                Everything Included In This Package
              </p>
              <ul className="space-y-2">
                {pkg.includedItems.map((inc, i) => (
                  <li key={i} className="text-xs text-stone-700 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms & Conditions */}
            {pkg.terms && (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-950 space-y-1">
                <p className="font-bold uppercase tracking-wider flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Terms & Booking Notes</span>
                </p>
                <p className="leading-relaxed">{pkg.terms}</p>
              </div>
            )}
          </div>

          {/* Pricing and Book Now */}
          <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Package Total</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#8e512d]">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {savings > 0 && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  You save ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              id="package-modal-book-now-btn"
              onClick={handleBookNow}
              className="px-6 py-3.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book This Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
