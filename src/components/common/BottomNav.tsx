import React from 'react';
import { Home, Sparkles, Image as ImageIcon, Calendar, User, Shield } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ActivePage } from '@/src/types/index.ts';

export const BottomNav: React.FC = () => {
  const { activePage, setActivePage, isAdmin, myBookings } = useApp();

  const navItems: { label: string; page: ActivePage; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Home', page: 'home', icon: Home },
    { label: 'Services', page: 'services', icon: Sparkles },
    { label: 'Portfolio', page: 'portfolio', icon: ImageIcon },
    { label: 'Bookings', page: 'my-bookings', icon: Calendar },
    { label: isAdmin ? 'Admin' : 'Profile', page: isAdmin ? 'admin' : 'profile', icon: isAdmin ? Shield : User },
  ];

  return (
    <div
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-t border-[#e8ded7] px-2 py-1.5 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.page;

          return (
            <button
              key={item.page}
              id={`bottom-nav-${item.page}`}
              onClick={() => setActivePage(item.page)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#8e512d] font-semibold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.page === 'my-bookings' && myBookings.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8e512d] rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
