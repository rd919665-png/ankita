import React from 'react';
import { User, Phone, Mail, Heart, Calendar, Shield, Trash2, Sparkles, LogIn, Smartphone } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { PWAInstallButton } from '@/src/components/common/PWAInstallButton.tsx';

export const CustomerProfilePage: React.FC = () => {
  const {
    userProfile,
    wishlist,
    services,
    openBookingModal,
    toggleWishlist,
    setActivePage,
    loginAsDemoAdmin,
    loginWithGoogle,
    currentUser,
    signOut,
    settings,
  } = useApp();

  const wishlistedServices = services.filter((s) => wishlist.includes(s.id));

  return (
    <div id="customer-profile-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#f4ebe4] text-[#8e512d] flex items-center justify-center font-serif text-2xl font-bold ring-4 ring-[#faf4f0]">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              {userProfile?.name || 'Valued Client'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">{userProfile?.email || 'Guest Session'}</p>
            {userProfile?.phone && (
              <p className="text-xs text-stone-600 mt-0.5 flex items-center space-x-1">
                <Phone className="w-3 h-3 text-[#8e512d]" />
                <span>{userProfile.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('my-bookings')}
            className="px-4 py-2 bg-[#f4ebe4] text-[#8e512d] hover:bg-[#ebdcd1] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings</span>
          </button>

          {!currentUser ? (
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 flex items-center space-x-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-stone-500" />
              <span>Sign in with Google</span>
            </button>
          ) : (
            <button
              onClick={signOut}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium cursor-pointer"
            >
              Sign Out
            </button>
          )}

          {/* Quick Admin Toggle */}
          <button
            onClick={() => {
              loginAsDemoAdmin();
              setActivePage('admin');
            }}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Switch to Admin Panel</span>
          </button>
        </div>
      </div>

      {/* Mobile App & Quick Install Card */}
      <div className="bg-gradient-to-r from-[#241a14] to-[#3a281e] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4a34b] to-[#8e512d] p-0.5 shrink-0 flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-[#1c1613] flex items-center justify-center text-amber-300">
              <Smartphone className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-serif font-bold text-amber-100">
                Install as Mobile Phone App
              </h2>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PWA
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
              Install Ankita Makeup Studio directly to your smartphone home screen. Enjoy full-screen viewing, faster booking speeds, and offline viewing of your appointment receipts.
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <PWAInstallButton className="w-full sm:w-auto px-5 py-2.5 text-sm justify-center shadow-lg" />
        </div>
      </div>

      {/* Saved Wishlist Services */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <h2 className="text-2xl font-serif font-bold text-stone-900">Saved Looks & Wishlist</h2>
        </div>

        {wishlistedServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-xs">
            <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">Your wishlist is empty</p>
            <p className="text-xs text-stone-500 mt-1">
              Tap the heart icon on any service to save your favorite makeover looks.
            </p>
            <button
              onClick={() => setActivePage('services')}
              className="mt-4 px-5 py-2 bg-[#8e512d] text-white rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(service.id)}
                      className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full text-red-500 hover:bg-white"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold text-stone-900">{service.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{service.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                  <span className="font-serif font-bold text-[#8e512d] text-lg">
                    ₹{service.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => openBookingModal(service, 'service')}
                    className="px-4 py-1.5 bg-[#8e512d] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#743e1f] cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Policies & Information */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <h3 className="font-serif font-bold text-stone-900 text-base">Advance & Reservation Policy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            A {settings.advancePercentage || 25}% advance deposit is required to lock your auspicious date in Ankita's calendar. Balance is payable on event date.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <h3 className="font-serif font-bold text-stone-900 text-base">Cancellation Policy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {settings.cancellationPolicy ||
              'Cancellations made 15+ days prior to event receive a 50% refund. Rescheduling is complimentary subject to calendar slot availability.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <h3 className="font-serif font-bold text-stone-900 text-base">Hygiene & Sanitization Guarantee</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All makeup brushes, beauty sponges, and airbrush nozzles undergo medical-grade UV and alcohol sterilization before every bridal transformation.
          </p>
        </div>
      </div>
    </div>
  );
};
