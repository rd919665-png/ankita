import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, Bell, Shield, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ActivePage } from '@/src/types/index.ts';
import { PWAInstallButton } from '@/src/components/common/PWAInstallButton.tsx';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    activePage,
    setActivePage,
    settings,
    isAdmin,
    currentUser,
    userProfile,
    signOut,
    loginAsDemoAdmin,
    loginAsRipanAdmin,
    loginAsDemoCustomer,
    wishlist,
    services,
    openBookingModal,
    notifications,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const navItems: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Packages', page: 'packages' },
    { label: 'Portfolio', page: 'portfolio' },
    { label: 'My Bookings', page: 'my-bookings' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleQuickBook = () => {
    // defaults to first popular service
    const targetService = services.find((s) => s.isPopular) || services[0];
    if (targetService) {
      openBookingModal(targetService, 'service');
    }
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e9dfd8] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <button
            id="nav-logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#99694e] to-[#cba690] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm ring-2 ring-[#e4d5cc] group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif tracking-wide text-[#2e2621] font-medium leading-none capitalize">
                {settings.businessName || 'Ankita Makeup Artist'}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-[#8e6e58] font-medium mt-1">
                By {settings.artistName || 'Ankita'} • Luxury Studio
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? 'text-[#8e512d] bg-[#f2e7df]'
                      : 'text-[#5a4d45] hover:text-[#8e512d] hover:bg-[#f6eee8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Wishlist Icon */}
            <button
              id="nav-wishlist-button"
              onClick={() => handleNavClick('profile')}
              title="Saved Services"
              className="relative p-2 text-[#5a4d45] hover:text-[#8e512d] hover:bg-[#f6eee8] rounded-full transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8e512d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              id="nav-notifications-button"
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative p-2 text-[#5a4d45] hover:text-[#8e512d] hover:bg-[#f6eee8] rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              )}
            </button>

            {/* Admin Switcher / User Profile Badge */}
            <div className="relative">
              <button
                id="nav-profile-menu-button"
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isAdmin
                    ? 'bg-amber-100/70 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-[#f4ebe4] border-[#e4d5cc] text-[#4d3d34] hover:bg-[#ecddd3]'
                }`}
              >
                {isAdmin ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Admin</span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-[#8e512d]" />
                    <span className="hidden sm:inline">
                      {userProfile?.name ? userProfile.name.split(' ')[0] : 'Client'}
                    </span>
                  </>
                )}
              </button>

              {/* Profile / Admin Switcher Menu Dropdown */}
              {authDropdownOpen && (
                <div
                  id="nav-profile-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#e8ded7] py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-stone-800">
                      {isAdmin ? 'Admin / Makeup Artist' : userProfile?.name || 'Guest Client'}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {isAdmin ? settings.email : userProfile?.email || 'Client Access'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-ripan-admin"
                      onClick={() => {
                        loginAsRipanAdmin();
                        setAuthDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center space-x-2 text-stone-800 hover:bg-[#faf4f0] hover:text-[#8e512d] font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <div className="text-xs">
                        <span className="font-bold block">Login as Super Admin</span>
                        <span className="text-[10px] text-stone-500 font-mono">ripan321321@gmail.com</span>
                      </div>
                    </button>

                    <button
                      id="dropdown-admin-panel"
                      onClick={() => {
                        loginAsDemoAdmin();
                        setAuthDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center space-x-2 text-stone-700 hover:bg-[#faf4f0] hover:text-[#8e512d]"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Admin Panel (Studio Suite)</span>
                    </button>

                    <button
                      id="dropdown-customer-mode"
                      onClick={() => {
                        loginAsDemoCustomer();
                        setAuthDropdownOpen(false);
                        setActivePage('home');
                      }}
                      className="w-full text-left px-4 py-2 flex items-center space-x-2 text-stone-700 hover:bg-[#faf4f0] hover:text-[#8e512d]"
                    >
                      <UserIcon className="w-4 h-4 text-[#8e512d]" />
                      <span>Switch to Customer View</span>
                    </button>

                    <button
                      id="dropdown-my-bookings"
                      onClick={() => {
                        setActivePage('my-bookings');
                        setAuthDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center space-x-2 text-stone-700 hover:bg-[#faf4f0]"
                    >
                      <Calendar className="w-4 h-4 text-stone-500" />
                      <span>My Bookings</span>
                    </button>
                  </div>

                  {(currentUser || isAdmin) && (
                    <div className="border-t border-stone-100 pt-1">
                      <button
                        id="dropdown-signout"
                        onClick={() => {
                          signOut();
                          setAuthDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-50 text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Book Now Button (Prominent Call to Action) */}
            <button
              id="nav-book-now-button"
              onClick={handleQuickBook}
              className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-[#915a3a] to-[#744327] hover:from-[#7e4c2f] hover:to-[#61361e] text-white px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#5a4d45] hover:text-[#8e512d] rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden bg-[#faf8f5] border-b border-[#e9dfd8] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150"
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                activePage === item.page
                  ? 'bg-[#f2e7df] text-[#8e512d]'
                  : 'text-[#4d3d34] hover:bg-[#f6eee8]'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}

          {isAdmin ? (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-3 rounded-lg text-base font-medium bg-amber-100 text-amber-950 flex items-center space-x-2"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin Management Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => {
                loginAsDemoAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-xs font-medium text-stone-600 hover:bg-[#f2e7df] flex items-center space-x-2"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Login as Admin (Ankita)</span>
            </button>
          )}

          <div className="pt-2 flex flex-col space-y-2">
            <PWAInstallButton className="w-full justify-center py-2.5" />
            <button
              onClick={() => {
                handleQuickBook();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#8e512d] text-white text-center rounded-xl text-sm font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Makeup Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
