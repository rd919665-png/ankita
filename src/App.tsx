import React, { useState } from 'react';
import { AppProvider, useApp } from '@/src/context/AppContext.tsx';
import { SplashScreen } from '@/src/components/common/SplashScreen.tsx';
import { Navbar } from '@/src/components/common/Navbar.tsx';
import { BottomNav } from '@/src/components/common/BottomNav.tsx';
import { Footer } from '@/src/components/common/Footer.tsx';
import { WhatsAppButton } from '@/src/components/common/WhatsAppButton.tsx';
import { NotificationDrawer } from '@/src/components/common/NotificationDrawer.tsx';
import { HomePage } from '@/src/components/home/HomePage.tsx';
import { ServicesPage } from '@/src/components/services/ServicesPage.tsx';
import { PackagesPage } from '@/src/components/packages/PackagesPage.tsx';
import { PortfolioPage } from '@/src/components/portfolio/PortfolioPage.tsx';
import { MyBookingsPage } from '@/src/components/bookings/MyBookingsPage.tsx';
import { CustomerProfilePage } from '@/src/components/profile/CustomerProfilePage.tsx';
import { ContactPage } from '@/src/components/contact/ContactPage.tsx';
import { AdminPanel } from '@/src/components/admin/AdminPanel.tsx';
import { BookingModal } from '@/src/components/booking/BookingModal.tsx';
import { PackageDetailModal } from '@/src/components/packages/PackageDetailModal.tsx';
import { OfflineIndicator } from '@/src/components/common/OfflineIndicator.tsx';

const AppContent: React.FC = () => {
  const {
    activePage,
    settings,
    bookingModalOpen,
    bookingModalTarget,
    closeBookingModal,
    packageDetailTarget,
    closePackageDetail,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#2e2621] selection:bg-[#8e512d] selection:text-white font-sans antialiased">
      {/* 1. Initial Animated Splash Screen */}
      {showSplash && (
        <SplashScreen
          appName={settings.businessName}
          artistName={settings.artistName}
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* 2. Top Header Navigation */}
      <Navbar onOpenNotifications={() => setNotificationsOpen(true)} />

      {/* 3. Main Dynamic Content Page */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'services' && <ServicesPage />}
        {activePage === 'packages' && <PackagesPage />}
        {activePage === 'portfolio' && <PortfolioPage />}
        {activePage === 'my-bookings' && <MyBookingsPage />}
        {activePage === 'profile' && <CustomerProfilePage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'admin' && <AdminPanel />}
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Mobile Bottom Navigation */}
      <BottomNav />

      {/* 6. Floating WhatsApp Direct Chat */}
      <WhatsAppButton />

      {/* 6.5 Offline Status Indicator */}
      <OfflineIndicator />

      {/* 7. Notifications Slide-over Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* 8. Online Booking & Advance Payment Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        target={bookingModalTarget}
        onClose={closeBookingModal}
      />

      {/* 9. Detailed Package Modal */}
      <PackageDetailModal
        pkg={packageDetailTarget}
        onClose={closePackageDetail}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
