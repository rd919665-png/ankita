import React from 'react';
import { Home, Sparkles, Image as ImageIcon, Calendar, User, Shield, Plus } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ActivePage } from '@/src/types/index.ts';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, isAdmin, myBookings, services, openBookingModal } = useApp();

  const handleCenterBook = () => {
    const popularService = services.find((s) => s.isPopular) || services[0];
    if (popularService) {
      openBookingModal(popularService, 'service');
    } else {
      setActivePage('services');
    }
  };

  return (
    <div
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-t border-[#e8ded7] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] shadow-2xl"
    >
      <div className="flex items-center justify-around relative">
        {/* Home */}
        <button
          id="bottom-nav-home"
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative min-w-[56px] min-h-[44px] active:scale-90 duration-100 ${
            activePage === 'home'
              ? 'text-[#8e512d] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${activePage === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
          {activePage === 'home' && (
            <span className="w-1 h-1 bg-[#8e512d] rounded-full mt-0.5" />
          )}
        </button>

        {/* Services */}
        <button
          id="bottom-nav-services"
          onClick={() => setActivePage('services')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative min-w-[56px] min-h-[44px] active:scale-90 duration-100 ${
            activePage === 'services'
              ? 'text-[#8e512d] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Services"
        >
          <Sparkles className={`w-5 h-5 ${activePage === 'services' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Services</span>
          {activePage === 'services' && (
            <span className="w-1 h-1 bg-[#8e512d] rounded-full mt-0.5" />
          )}
        </button>

        {/* Center Raised "Book Now" Button */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            id="bottom-nav-quick-book"
            onClick={handleCenterBook}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#7a4221] to-[#a8653b] text-white flex items-center justify-center shadow-lg shadow-[#8e512d]/40 ring-4 ring-[#faf8f5] active:scale-90 transition-transform duration-150 cursor-pointer"
            aria-label="Book Makeup Appointment"
            title="Book Makeup Appointment"
          >
            <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
          </button>
          <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider text-[#8e512d]">
            Book
          </span>
        </div>

        {/* My Bookings */}
        <button
          id="bottom-nav-my-bookings"
          onClick={() => setActivePage('my-bookings')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative min-w-[56px] min-h-[44px] active:scale-90 duration-100 ${
            activePage === 'my-bookings'
              ? 'text-[#8e512d] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="My Bookings"
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activePage === 'my-bookings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {myBookings.length > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-3.5 h-3.5 px-0.5 bg-[#8e512d] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {myBookings.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Bookings</span>
          {activePage === 'my-bookings' && (
            <span className="w-1 h-1 bg-[#8e512d] rounded-full mt-0.5" />
          )}
        </button>

        {/* Admin or Profile */}
        <button
          id={`bottom-nav-${isAdmin ? 'admin' : 'profile'}`}
          onClick={() => setActivePage(isAdmin ? 'admin' : 'profile')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative min-w-[56px] min-h-[44px] active:scale-90 duration-100 ${
            (isAdmin ? activePage === 'admin' : activePage === 'profile')
              ? 'text-[#8e512d] font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label={isAdmin ? 'Admin' : 'Profile'}
        >
          {isAdmin ? (
            <Shield className={`w-5 h-5 ${activePage === 'admin' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          ) : (
            <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          )}
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            {isAdmin ? 'Admin' : 'Profile'}
          </span>
          {(isAdmin ? activePage === 'admin' : activePage === 'profile') && (
            <span className="w-1 h-1 bg-[#8e512d] rounded-full mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

