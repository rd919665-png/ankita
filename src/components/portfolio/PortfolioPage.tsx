import React, { useState, useMemo } from 'react';
import { Play, X, Eye, Sparkles, Filter } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { PortfolioItem } from '@/src/types/index.ts';

export const PortfolioPage: React.FC = () => {
  const { portfolio, settings, generateWhatsAppLink } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const categories = [
    'All',
    'Bridal',
    'Bengali Bridal',
    'Reception',
    'Engagement',
    'Party Makeup',
    'HD Makeup',
    'Natural Makeup',
    'Hair Styling',
    'Saree Draping',
  ];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return portfolio;
    return portfolio.filter((item) => item.category === selectedCategory);
  }, [portfolio, selectedCategory]);

  return (
    <div id="portfolio-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8e512d]">
          Artistic Masterpieces
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2e2621]">
          Makeup & Styling Portfolio
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Explore our real bridal transformations, authentic Bengali Chandan art, HD airbrush perfection, red-carpet evening glam, and master saree pleating.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`portfolio-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#8e512d] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-[#f3e9e2] border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`portfolio-card-${item.id}`}
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-900 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* Media preview */}
            <img
              src={item.type === 'video' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Video or Image icon badge */}
            <div className="absolute top-4 right-4">
              {item.type === 'video' ? (
                <div className="w-10 h-10 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Category tag */}
            <div className="absolute top-4 left-4">
              <span className="bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/20">
                {item.category}
              </span>
            </div>

            {/* Title & Description */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="font-serif font-bold text-lg sm:text-xl leading-snug text-[#fdfbf9]">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Video Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            id="portfolio-lightbox-modal"
            className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Box */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] max-h-[65vh] overflow-hidden">
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              ) : (
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-6 bg-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-stone-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  {selectedItem.category}
                </span>
                <h2 className="text-xl font-serif font-bold text-white">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-xs text-stone-400 max-w-xl">{selectedItem.description}</p>
                )}
              </div>

              <a
                href={generateWhatsAppLink(`Hello Ankita! I really loved the portfolio look "${selectedItem.title}". Can I book a similar look for my upcoming event?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#8e512d] hover:bg-[#a36239] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inquire For This Look</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
