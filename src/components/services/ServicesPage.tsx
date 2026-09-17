import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Check,
  Sparkles,
  Heart,
  SlidersHorizontal,
  Info,
  Shield,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ServiceItem } from '@/src/types/index.ts';

export const ServicesPage: React.FC = () => {
  const { services, openBookingModal, wishlist, toggleWishlist } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [onlyPopular, setOnlyPopular] = useState(false);

  const categories = [
    'All',
    'Bridal',
    'Reception',
    'Engagement',
    'Party',
    'Haldi & Mehendi',
    'Hair Styling',
    'Saree Draping',
    'Combos',
  ];

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch =
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.productsUsed && service.productsUsed.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPopular = onlyPopular ? !!service.isPopular : true;

        return matchesCategory && matchesSearch && matchesPopular;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [services, selectedCategory, searchQuery, sortBy, onlyPopular]);

  return (
    <div id="services-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8e512d]">
          Artistry & Treatment Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2e2621]">
          Our Professional Makeup Services
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Every look is customized to celebrate your unique bone structure, skin tone, wedding attire, and aesthetic preferences.
        </p>
      </div>

      {/* Controls: Search, Filter Tabs, Sort */}
      <div className="space-y-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="service-search-input"
              type="text"
              placeholder="Search bridal, airbrush, chandan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8e512d]/30"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <label className="flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                id="filter-popular-toggle"
                type="checkbox"
                checked={onlyPopular}
                onChange={(e) => setOnlyPopular(e.target.checked)}
                className="rounded text-[#8e512d] focus:ring-[#8e512d]"
              />
              <span>Popular Looks Only</span>
            </label>

            <div className="flex items-center space-x-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                id="service-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort services by price or popularity"
                className="bg-[#faf8f5] border border-stone-200 rounded-lg py-1.5 px-2.5 text-stone-700 text-xs focus:outline-none"
              >
                <option value="featured">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`service-cat-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8e512d] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-stone-700 hover:bg-[#f3e9e2] border border-stone-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-700 font-serif text-lg">No services match your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyPopular(false);
            }}
            className="mt-4 text-xs font-bold text-[#8e512d] uppercase tracking-wider underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const isWished = wishlist.includes(service.id);

            return (
              <div
                key={service.id}
                id={`service-item-${service.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-[#ebdcd1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Header Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="bg-stone-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold">
                      {service.category}
                    </span>
                    {service.isPopular && (
                      <span className="bg-amber-500 text-stone-950 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Client Favorite
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(service.id)}
                    title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-700 hover:text-red-500 shadow-md transition-colors cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                      {service.name}
                    </h2>
                    <div className="flex items-center space-x-3 text-xs text-amber-200 mt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration}</span>
                      </span>
                      <span>•</span>
                      <span>1-on-1 Personalized Session</span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* What is Included */}
                    {service.includedServices && service.includedServices.length > 0 && (
                      <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-stone-200/70">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8e512d] mb-2">
                          What's Included
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-1.5">
                          {service.includedServices.map((inc, i) => (
                            <li key={i} className="text-xs text-stone-700 flex items-start space-x-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Products/Materials Used */}
                    {service.productsUsed && (
                      <div className="text-xs text-stone-600">
                        <span className="font-semibold text-stone-900">Products & Brands: </span>
                        <span>{service.productsUsed}</span>
                      </div>
                    )}

                    {/* Extra charges if applicable */}
                    {service.extraCharges && (
                      <div className="flex items-start space-x-1.5 text-[11px] text-stone-500 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{service.extraCharges}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                        Starting Price
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-[#8e512d]">
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-stone-500">/ session</span>
                      </div>
                    </div>

                    <button
                      id={`book-service-now-${service.id}`}
                      onClick={() => openBookingModal(service, 'service')}
                      className="px-6 py-3 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
