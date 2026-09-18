import React, { useState, useEffect } from 'react';
import {
  Shield,
  Calendar,
  Layers,
  Package,
  Image as ImageIcon,
  Star,
  Tag,
  Settings as SettingsIcon,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
  Phone,
  MessageCircle,
  Mail,
  Bell,
  UserPlus,
  UserCheck,
  Key,
  Upload,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import {
  Booking,
  BookingStatus,
  BusinessSettings,
  CouponItem,
  PackageItem,
  PortfolioItem,
  ReviewItem,
  ServiceItem,
} from '@/src/types/index.ts';
import { defaultBusinessSettings } from '@/src/data/defaultData.ts';
import { BannerManager } from '@/src/components/admin/BannerManager.tsx';

type AdminTab =
  | 'overview'
  | 'banner'
  | 'bookings'
  | 'services'
  | 'packages'
  | 'portfolio'
  | 'reviews'
  | 'coupons'
  | 'settings';

export const AdminPanel: React.FC = () => {
  const {
    adminStats,
    bookings,
    services,
    packages,
    portfolio,
    reviews,
    coupons,
    settings,
    updateBookingStatus,
    saveService,
    deleteService,
    savePackage,
    deletePackage,
    savePortfolioItem,
    deletePortfolioItem,
    approveReview,
    deleteReview,
    saveCoupon,
    deleteCoupon,
    updateSettings,
    seedInitialDataToFirestore,
    setActivePage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Booking Filtering
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Service Edit / Add State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);

  // Package Edit / Add State
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<PackageItem> | null>(null);

  // Portfolio Edit / Add State
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);

  // Coupon Edit / Add State
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<CouponItem> | null>(null);

  // Business Details Form State (27 fields)
  const [businessForm, setBusinessForm] = useState<BusinessSettings>({ ...settings });
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [adminAddSuccess, setAdminAddSuccess] = useState('');

  const handleAddAdminEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newAdminEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      alert('অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@gmail.com)');
      return;
    }
    const currentList = businessForm.authorizedAdminEmails || [];
    if (currentList.map((x) => x.toLowerCase().trim()).includes(clean)) {
      alert('এই ইমেইলটি ইতিমধ্যেই অনুমোদিত অ্যাডমিন হিসেবে যুক্ত রয়েছে!');
      return;
    }
    const updated = [...currentList, clean];
    const updatedForm = { ...businessForm, authorizedAdminEmails: updated };
    setBusinessForm(updatedForm);
    try {
      await updateSettings(updatedForm);
      setNewAdminEmailInput('');
      setAdminAddSuccess(`অ্যাডমিন ইমেইল (${clean}) সফলভাবে যুক্ত ও সংরক্ষিত হয়েছে!`);
      setTimeout(() => setAdminAddSuccess(''), 4000);
    } catch {
      alert('ইমেইল সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  const handleRemoveAdminEmail = async (emailToRemove: string) => {
    if (confirm(`আপনি কি "${emailToRemove}" কে অ্যাডমিন তালিকা থেকে মুছে ফেলতে চান?`)) {
      const currentList = businessForm.authorizedAdminEmails || [];
      const updated = currentList.filter(
        (e) => e.toLowerCase().trim() !== emailToRemove.toLowerCase().trim()
      );
      const updatedForm = { ...businessForm, authorizedAdminEmails: updated };
      setBusinessForm(updatedForm);
      try {
        await updateSettings(updatedForm);
      } catch {
        alert('আপডেট করতে সমস্যা হয়েছে।');
      }
    }
  };

  useEffect(() => {
    setBusinessForm({ ...settings });
  }, [settings]);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingStatusFilter === 'All' || b.bookingStatus === bookingStatusFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone.includes(bookingSearch);
    return matchesFilter && matchesSearch;
  });

  // Handle Business Settings Form Submit
  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(businessForm);
      setSaveSuccessMessage(true);
      setTimeout(() => setSaveSuccessMessage(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
  };

  const handleResetBusinessSettings = () => {
    if (confirm('Reset business settings to Ankita Makeup Artist defaults?')) {
      setBusinessForm({ ...defaultBusinessSettings });
      updateSettings(defaultBusinessSettings);
    }
  };

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-[#241c18] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-amber-400">
              <span>Verified Makeup Artist Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
              Studio Management Suite
            </h1>
            <p className="text-xs text-stone-400">
              Admin: {settings.artistName || 'Ankita'} • {settings.businessName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => seedInitialDataToFirestore()}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors border border-stone-700 flex items-center space-x-1.5 cursor-pointer"
            title="Seed sample services, packages, and portfolio items to Firestore"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Firestore Catalog</span>
          </button>

          <button
            onClick={() => setActivePage('home')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex space-x-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'overview', label: 'Dashboard', icon: TrendingUp },
          { key: 'banner', label: 'ব্যানার কন্ট্রোল (Banner)', icon: Sparkles },
          { key: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
          { key: 'services', label: `Services (${services.length})`, icon: Layers },
          { key: 'packages', label: `Packages (${packages.length})`, icon: Package },
          { key: 'portfolio', label: `Portfolio (${portfolio.length})`, icon: ImageIcon },
          { key: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { key: 'coupons', label: `Offers & Coupons (${coupons.length})`, icon: Tag },
          { key: 'settings', label: 'Business Settings (27 Fields)', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`admin-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#8e512d] text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB: BANNER MANAGEMENT & ADMIN EMAILS ================= */}
      {activeTab === 'banner' && <BannerManager />}

      {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 8 Statistics Cards requested in prompt */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Today's Bookings */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Today's Bookings
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {adminStats.todayBookings}
              </p>
              <span className="text-[10px] text-stone-500">Scheduled for today</span>
            </div>

            {/* 2. Upcoming Appointments */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Upcoming Appointments
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#8e512d]">
                {adminStats.upcomingAppointments}
              </p>
              <span className="text-[10px] text-stone-500">Confirmed upcoming dates</span>
            </div>

            {/* 3. Total Bookings */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Total Bookings
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {adminStats.totalBookings}
              </p>
              <span className="text-[10px] text-stone-500">All-time appointments</span>
            </div>

            {/* 4. Total Customers */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Total Customers
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {adminStats.totalCustomers}
              </p>
              <span className="text-[10px] text-stone-500">Unique bridal clients</span>
            </div>

            {/* 5. Today's Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Today's Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                ₹{adminStats.todayRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500">Advances collected today</span>
            </div>

            {/* 6. Monthly Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Monthly Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">
                ₹{adminStats.monthlyRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500">Total volume this month</span>
            </div>

            {/* 7. Pending Payments */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Pending Payments
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">
                ₹{adminStats.pendingPayments.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500">Remaining dues on event date</span>
            </div>

            {/* 8. Pending Reviews */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
                Pending Reviews
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {adminStats.pendingReviews}
              </p>
              <span className="text-[10px] text-stone-500">Awaiting approval</span>
            </div>
          </div>

          {/* Recent Bookings Quick Table */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900">Recent Appointments</h2>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-[#8e512d] hover:underline cursor-pointer"
              >
                View all bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Service</th>
                    <th className="py-2.5">Date & Slot</th>
                    <th className="py-2.5">Advance Paid</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50/50">
                      <td className="py-3 font-mono font-bold text-stone-900">{b.id}</td>
                      <td className="py-3">
                        <div className="font-semibold text-stone-900">{b.customerName}</div>
                        <div className="text-[11px] text-stone-400">{b.customerPhone}</div>
                      </td>
                      <td className="py-3 font-medium">{b.serviceName}</td>
                      <td className="py-3">
                        <div>{b.date}</div>
                        <div className="text-[10px] text-stone-400">{b.timeSlot}</div>
                      </td>
                      <td className="py-3 font-semibold text-emerald-700">
                        ₹{b.paidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: BANNER CONTROL & CUSTOMIZATION ================= */}
      {activeTab === 'banner' && (
        <div id="admin-banner-tab-content">
          <BannerManager />
        </div>
      )}

      {/* ================= TAB 2: BOOKINGS MANAGEMENT ================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Admin SMS / Mobile Notification Banner */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#8e512d] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Admin Alert Receiver: {settings.phone} (Audio Call & WhatsApp)
                </p>
                <p className="text-xs text-stone-600">
                  Whenever a client books, sound chimes & haptic vibration fire, and instant SMS / WhatsApp links are prepared for <span className="font-semibold">{settings.artistName}</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={`tel:${settings.phone}`}
                className="px-3 py-1.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Admin Phone</span>
              </a>
              <a
                href={`https://wa.me/918617312937?text=${encodeURIComponent('Admin Status Check: Booking system notifications active.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search booking ID, customer, phone..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {['All', 'Pending', 'Confirmed', 'Paid', 'Completed', 'Cancelled', 'Rescheduled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setBookingStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      bookingStatusFilter === status
                        ? 'bg-[#8e512d] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer & Contact</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Financials</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map((b) => {
                    const cleanPhone = b.customerPhone ? b.customerPhone.replace(/[^0-9]/g, '') : '';
                    const waPhone = cleanPhone.startsWith('91') ? cleanPhone : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone.startsWith('0') && cleanPhone.length === 11 ? `91${cleanPhone.slice(1)}` : cleanPhone;
                    const smsBody = encodeURIComponent(`Hello ${b.customerName}, regarding your booking (${b.id}) for ${b.serviceName} on ${b.date} (${b.timeSlot}) with Ankita Makeup Artist.`);

                    return (
                      <tr key={b.id} className="hover:bg-stone-50">
                        <td className="p-4 font-mono font-bold text-stone-900">{b.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-stone-900">{b.customerName}</div>
                          <div className="text-[11px] text-stone-500 font-mono">{b.customerPhone}</div>
                          <div className="text-[10px] text-stone-400">{b.customerEmail}</div>
                          <div className="flex items-center space-x-2 pt-1.5">
                            <a
                              href={`tel:${b.customerPhone}`}
                              title="Audio Call Client"
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`sms:${b.customerPhone}?body=${smsBody}`}
                              title="Send SMS to Client"
                              className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold"
                            >
                              SMS
                            </a>
                            <a
                              href={`https://wa.me/${waPhone}?text=${smsBody}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp Client"
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-stone-800">{b.serviceName}</div>
                          <div className="text-[11px] text-stone-500">{b.venue || 'Studio'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-stone-900">{b.date}</div>
                          <div className="text-stone-500">{b.timeSlot}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-emerald-700 font-bold">
                            Paid: ₹{b.paidAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Due: ₹{b.remainingAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-stone-400">Total: ₹{b.totalAmount.toLocaleString('en-IN')}</div>
                        </td>
                        <td className="p-4">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) =>
                              updateBookingStatus(b.id, e.target.value as BookingStatus)
                            }
                            aria-label={`Update status for booking ${b.id}`}
                            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-800 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Paid">Paid</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Rescheduled">Rescheduled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SERVICES MANAGEMENT ================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Makeup Services Catalog</h2>
              <p className="text-xs text-stone-500">Add, update prices, or remove services from client view.</p>
            </div>
            <button
              onClick={() => {
                setEditingService({
                  name: '',
                  category: 'Bridal',
                  price: 5000,
                  duration: '2 Hours',
                  description: '',
                  imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
                  includedServices: ['HD Makeup Base', 'Lashes', 'Hair Styling'],
                  productsUsed: 'MAC, Huda Beauty',
                  extraCharges: 'Travel beyond Kolkata metro charged at ₹25/km',
                  isPopular: false,
                });
                setServiceModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Services List Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                      {srv.category}
                    </span>
                    {srv.isPopular && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-stone-900 text-base">{srv.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{srv.description}</p>
                    <p className="text-xs font-semibold text-stone-700">Duration: {srv.duration}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <span className="font-serif font-bold text-lg text-[#8e512d]">
                    ₹{srv.price.toLocaleString('en-IN')}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingService(srv);
                        setServiceModalOpen(true);
                      }}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit Service"
                      aria-label={`Edit ${srv.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete service "${srv.name}"?`)) {
                          deleteService(srv.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Service"
                      aria-label={`Delete ${srv.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PACKAGES MANAGEMENT ================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Makeup Packages</h2>
              <p className="text-xs text-stone-500">Multi-service bridal bundles and combos.</p>
            </div>
            <button
              onClick={() => {
                setEditingPackage({
                  name: '',
                  price: 15000,
                  discountPrice: 13500,
                  duration: '4-5 Hours',
                  description: '',
                  images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80'],
                  includedItems: ['HD Bridal Makeup', 'Chandan Art', 'Hair Styling', 'Saree Draping'],
                  terms: 'Advance deposit non-refundable within 7 days of event.',
                  isFeatured: true,
                });
                setPackageModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Package</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44">
                    <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-stone-900 text-base">{pkg.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{pkg.description}</p>
                    <div className="text-[11px] text-stone-600">
                      <strong>Inclusions:</strong> {pkg.includedItems.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-lg text-[#8e512d]">
                      ₹{(pkg.discountPrice || pkg.price).toLocaleString('en-IN')}
                    </span>
                    {pkg.discountPrice && (
                      <span className="text-xs text-stone-400 line-through ml-1.5">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPackage(pkg);
                        setPackageModalOpen(true);
                      }}
                      className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit Package"
                      aria-label={`Edit ${pkg.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete package "${pkg.name}"?`)) {
                          deletePackage(pkg.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete Package"
                      aria-label={`Delete ${pkg.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: PORTFOLIO MANAGEMENT ================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Portfolio Media Gallery</h2>
              <p className="text-xs text-stone-500">Showcase high-resolution photos and video reels.</p>
            </div>
            <button
              onClick={() => {
                setEditingPortfolio({
                  title: '',
                  category: 'Bridal',
                  mediaUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
                  type: 'image',
                  description: 'Authentic bridal look with customized jewelry styling.',
                });
                setPortfolioModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Media</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs group relative aspect-square"
              >
                <img
                  src={item.type === 'video' ? item.thumbnailUrl || item.mediaUrl : item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold bg-black/60 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete portfolio item "${item.title}"?`)) {
                          deletePortfolioItem(item.id);
                        }
                      }}
                      className="p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg text-white"
                      title="Delete"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-bold line-clamp-1">{item.title}</p>
                    <p className="text-[10px] text-stone-300 capitalize">{item.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: REVIEWS MANAGEMENT ================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">Customer Testimonials & Moderation</h2>
            <p className="text-xs text-stone-500">Approve genuine client reviews before displaying on homepage.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 italic">"{r.comment}"</p>
                  <p className="text-xs font-bold text-stone-900">
                    {r.customerName} • <span className="text-[#8e512d] font-medium">{r.serviceName}</span>
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
                  {!r.isApproved && (
                    <button
                      onClick={() => approveReview(r.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Delete this review?')) deleteReview(r.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete Review"
                    aria-label={`Delete review by ${r.customerName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 7: COUPONS & OFFERS ================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">Promo Coupons & Discounts</h2>
              <p className="text-xs text-stone-500">Configure promotional discount codes for checkout.</p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon({
                  code: 'SUMMER2026',
                  discountType: 'percentage',
                  discountValue: 15,
                  minBookingAmount: 5000,
                  endDate: '2026-12-31',
                  isActive: true,
                });
                setCouponModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Promo Code</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-[#8e512d] bg-[#faf8f5] px-2.5 py-1 rounded border border-stone-200">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xl font-serif font-bold text-stone-900 mt-2">
                    {c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF`
                      : `₹${c.discountValue} Flat Discount`}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Min Spend: ₹{(c.minBookingAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-stone-400">Valid till: {c.endDate || 'Unlimited'}</p>
                </div>

                <div className="flex justify-end pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon "${c.code}"?`)) deleteCoupon(c.id);
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete Coupon"
                    aria-label={`Delete coupon ${c.code}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 8: BUSINESS DETAILS SETUP FORM (27 FIELDS) ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e512d]">
                Master Configuration
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                Business Details Setup Form
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                All 27 fields configured here dynamically update throughout the app (Header, Footer, Booking, UPI QR, WhatsApp, and Legal).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleResetBusinessSettings}
                className="px-3.5 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {saveSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Business settings saved successfully! All app pages updated.</span>
            </div>
          )}

          {/* ================= DEDICATED ADMIN MANAGEMENT SECTION ================= */}
          <div className="bg-gradient-to-br from-[#2a1715] via-[#3a1d1d] to-[#1f0f10] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-amber-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    <span>Role-Based Access Control</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                    👑 অ্যাডমিন এক্সেস ও পারমিশন কন্ট্রোল (Admin Access Management)
                  </h3>
                  <p className="text-xs text-stone-300">
                    অন্য কাউকে অ্যাডমিন বানাতে চাইলে তাদের ইমেইল অ্যাড্রেস নিচে যোগ করুন।
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Helper Explanations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-stone-200 space-y-1.5">
              <p className="font-semibold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>কীভাবে কাজ করে (How it works):</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px] sm:text-xs">
                <li>যাকে অ্যাডমিন বানাতে চান, তার <strong>Gmail Address</strong> নিচের বক্সে লিখে <strong>"অ্যাডমিন যোগ করুন"</strong> এ ক্লিক করুন।</li>
                <li>যুক্ত করার পর তিনি তার মোবাইল বা কম্পিউটার থেকে এই অ্যাপে ঢুকে <strong>Sign in with Google</strong> করলেই স্বয়ংক্রিয়ভাবে ফুল অ্যাডমিন অ্যাক্সেস পাবেন।</li>
                <li>তিনি বুকিং দেখা ও এক্সেপ্ট করা, নতুন সার্ভিস ও প্যাকেজ তৈরি, ব্যানার পরিবর্তন, মূল্য ও অফার এডিট করার সম্পূর্ণ ক্ষমতা পাবেন।</li>
              </ul>
            </div>

            {/* Add New Admin Email Form */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                নতুন অ্যাডমিন ইমেইল যোগ করুন (Add New Admin Email)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={newAdminEmailInput}
                    onChange={(e) => setNewAdminEmailInput(e.target.value)}
                    placeholder="e.g. colleague@gmail.com বা ankita.partner@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700 focus:border-amber-400 text-white rounded-xl text-xs placeholder:text-stone-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAdminEmail();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddAdminEmail()}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-all shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>অ্যাডমিন যোগ করুন</span>
                </button>
              </div>

              {adminAddSuccess && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{adminAddSuccess}</span>
                </div>
              )}
            </div>

            {/* Current Active Admins List */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                বর্তমানে অনুমোদিত অ্যাডমিন তালিকা (Active Authorized Admins):
              </span>

              <div className="grid sm:grid-cols-2 gap-2.5">
                {/* Master Super Admin */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                      👑
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-amber-200 truncate">ripan321321@gmail.com</p>
                      <p className="text-[10px] text-amber-400/80">Primary Super Admin (Owner)</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30 shrink-0">
                    Permanent
                  </span>
                </div>

                {/* Studio Default Email */}
                {businessForm.email && businessForm.email.toLowerCase() !== 'ripan321321@gmail.com' && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs shrink-0">
                        🏢
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-stone-200 truncate">{businessForm.email}</p>
                        <p className="text-[10px] text-stone-400">Studio Official Email</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-semibold shrink-0">
                      Studio Admin
                    </span>
                  </div>
                )}

                {/* Custom Authorized Admin Emails */}
                {(businessForm.authorizedAdminEmails || []).map((admEmail) => (
                  <div
                    key={admEmail}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 border border-stone-700 hover:border-amber-400/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">{admEmail}</p>
                        <p className="text-[10px] text-emerald-400">Authorized Co-Admin</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdminEmail(admEmail)}
                      title="অ্যাডমিন থেকে সরান"
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {(!businessForm.authorizedAdminEmails || businessForm.authorizedAdminEmails.length === 0) && (
                <p className="text-[11px] text-stone-400 italic pt-1">
                  এখনও অন্য কোনো অতিরিক্ত ইমেইল যোগ করা হয়নি। উপরের বক্সে যেকোনো ইমেইল লিখে যোগ করতে পারেন।
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveBusinessSettings} className="space-y-8">
            {/* Section A: Brand & Artist Details (Fields 1-6) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                1. Identity & Contact Information
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. App / Business Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    1. App / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.businessName}
                    onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 2. Makeup Artist Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    2. Makeup Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.artistName}
                    onChange={(e) => setBusinessForm({ ...businessForm, artistName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 3. Owner Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    3. Owner Name
                  </label>
                  <input
                    type="text"
                    value={businessForm.ownerName}
                    onChange={(e) => setBusinessForm({ ...businessForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 4. Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    4. Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 5. WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    5. WhatsApp Number (With Country Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessForm.whatsappNumber}
                    onChange={(e) => setBusinessForm({ ...businessForm, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 6. Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    6. Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={businessForm.email}
                    onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Location & Map (Fields 7-11) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                2. Studio Address & Location
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 7. Business Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    7. Business Address
                  </label>
                  <input
                    type="text"
                    value={businessForm.address}
                    onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 8. City */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    8. City
                  </label>
                  <input
                    type="text"
                    value={businessForm.city}
                    onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 9. State */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    9. State
                  </label>
                  <input
                    type="text"
                    value={businessForm.state}
                    onChange={(e) => setBusinessForm({ ...businessForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 10. PIN Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    10. PIN Code
                  </label>
                  <input
                    type="text"
                    value={businessForm.pincode}
                    onChange={(e) => setBusinessForm({ ...businessForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 11. Google Maps Link */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    11. Google Maps Link URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.googleMapsLink}
                    onChange={(e) => setBusinessForm({ ...businessForm, googleMapsLink: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Payment & UPI Setup (Fields 12-14) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                3. Online UPI & Payment Configuration
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* 12. UPI ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    12. UPI ID (For Direct Payments)
                  </label>
                  <input
                    type="text"
                    value={businessForm.upiId}
                    onChange={(e) => setBusinessForm({ ...businessForm, upiId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>

                {/* 13. UPI Payment Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    13. UPI Payment Name (Recipient)
                  </label>
                  <input
                    type="text"
                    value={businessForm.upiName}
                    onChange={(e) => setBusinessForm({ ...businessForm, upiName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 14. Payment QR Code URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    14. Payment QR Code Image URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.qrCodeUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, qrCodeUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section D: Social Media Links (Fields 15-17) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                4. Social Media Portals
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {/* 15. Instagram Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    15. Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.instagram}
                    onChange={(e) => setBusinessForm({ ...businessForm, instagram: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 16. Facebook Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    16. Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.facebook}
                    onChange={(e) => setBusinessForm({ ...businessForm, facebook: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 17. YouTube Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    17. YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.youtube}
                    onChange={(e) => setBusinessForm({ ...businessForm, youtube: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section E: Media & Description (Fields 18-20) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                5. Branding Media & Business Bio
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* 18. Business Logo URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    18. Business Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={businessForm.logoUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, logoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 19. Cover/Banner Image URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      19. Cover / Banner Image URL
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('banner')}
                      className="text-xs text-[#8e512d] hover:text-[#743e1f] font-bold flex items-center space-x-1 underline cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ব্যানার ম্যানেজার খুলুন →</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={businessForm.bannerUrl}
                    onChange={(e) => setBusinessForm({ ...businessForm, bannerUrl: e.target.value })}
                    placeholder="https://... অথবা /images/hero_banner_full.jpg"
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                  {businessForm.bannerUrl && (
                    <div className="mt-1 flex items-center space-x-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                      <img
                        src={businessForm.bannerUrl}
                        alt="Banner Preview"
                        className="w-16 h-10 object-cover rounded-lg border border-stone-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-[11px] text-stone-600">
                        <span className="font-semibold text-stone-900">বর্তমান ব্যানার প্রিভিউ</span>
                        <p className="text-[10px] text-stone-400 truncate max-w-xs">{businessForm.bannerUrl}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 19.5 Makeup Artist Photo URL */}
                <div className="sm:col-span-2 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden ring-2 ring-amber-300 shrink-0 bg-stone-200">
                      <img
                        src={businessForm.artistPhoto || '/images/ankita_artist.jpg'}
                        alt="Ankita Photo Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                        Makeup Artist Profile Photo (Featured on Hero Banner & Bio)
                      </label>
                      <input
                        type="text"
                        value={businessForm.artistPhoto || '/images/ankita_artist.jpg'}
                        onChange={(e) => setBusinessForm({ ...businessForm, artistPhoto: e.target.value })}
                        placeholder="/images/ankita_artist.jpg"
                        className="w-full px-3 py-2 bg-white border border-amber-300/80 rounded-xl text-xs font-mono"
                      />
                      <p className="text-[11px] text-stone-500 mt-1">
                        This photograph of Ankita is featured on the homepage hero banner card, direct consultation modules, and artist bio.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 20. Business Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    20. Business Description (Appears on Home & About)
                  </label>
                  <textarea
                    rows={3}
                    value={businessForm.description}
                    onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                    className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section F: Timings, Advance & Policies (Fields 21-27) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#8e512d] border-b border-stone-100 pb-2">
                6. Studio Hours, Advance Deposit & Policies
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 21. Opening Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    21. Opening Time
                  </label>
                  <input
                    type="text"
                    value={businessForm.openingTime}
                    onChange={(e) => setBusinessForm({ ...businessForm, openingTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 22. Closing Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    22. Closing Time
                  </label>
                  <input
                    type="text"
                    value={businessForm.closingTime}
                    onChange={(e) => setBusinessForm({ ...businessForm, closingTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 23. Working Days */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    23. Working Days
                  </label>
                  <input
                    type="text"
                    value={businessForm.workingDays}
                    onChange={(e) => setBusinessForm({ ...businessForm, workingDays: e.target.value })}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                {/* 24. Booking Advance Percentage */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    24. Booking Advance Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={businessForm.advancePercentage}
                    onChange={(e) =>
                      setBusinessForm({ ...businessForm, advancePercentage: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* 25. Cancellation Policy */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  25. Cancellation Policy
                </label>
                <textarea
                  rows={2}
                  value={businessForm.cancellationPolicy}
                  onChange={(e) =>
                    setBusinessForm({ ...businessForm, cancellationPolicy: e.target.value })
                  }
                  className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>

              {/* 26. Terms & Conditions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  26. Terms & Conditions
                </label>
                <textarea
                  rows={2}
                  value={businessForm.termsConditions}
                  onChange={(e) =>
                    setBusinessForm({ ...businessForm, termsConditions: e.target.value })
                  }
                  className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>

              {/* 27. Privacy Policy */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  27. Privacy Policy
                </label>
                <textarea
                  rows={2}
                  value={businessForm.privacyPolicy}
                  onChange={(e) =>
                    setBusinessForm({ ...businessForm, privacyPolicy: e.target.value })
                  }
                  className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                id="save-business-settings-btn"
                className="px-8 py-3.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All 27 Business Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SERVICE ================= */}
      {serviceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              {editingService.id ? 'Edit Service' : 'Add New Makeup Service'}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={editingService.name || ''}
                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={editingService.category || 'Bridal'}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Reception">Reception</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Party">Party</option>
                  <option value="Haldi & Mehendi">Haldi & Mehendi</option>
                  <option value="Hair Styling">Hair Styling</option>
                  <option value="Saree Draping">Saree Draping</option>
                  <option value="Combos">Combos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={editingService.price || 0}
                  onChange={(e) =>
                    setEditingService({ ...editingService, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={editingService.duration || '2 Hours'}
                onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={editingService.imageUrl || ''}
                onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={editingService.description || ''}
                onChange={(e) =>
                  setEditingService({ ...editingService, description: e.target.value })
                }
                className="w-full p-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Included Items (Comma separated)
              </label>
              <input
                type="text"
                value={(editingService.includedServices || []).join(', ')}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    includedServices: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="is-popular-check"
                checked={editingService.isPopular || false}
                onChange={(e) =>
                  setEditingService({ ...editingService, isPopular: e.target.checked })
                }
                className="rounded text-[#8e512d]"
              />
              <label htmlFor="is-popular-check" className="text-xs text-stone-700 font-medium cursor-pointer">
                Mark as Featured / Popular Look
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingService.name) return;
                  await saveService(editingService as any);
                  setServiceModalOpen(false);
                }}
                className="px-6 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PACKAGE ================= */}
      {packageModalOpen && editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              {editingPackage.id ? 'Edit Package' : 'Add New Package'}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Package Name
              </label>
              <input
                type="text"
                value={editingPackage.name || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Regular Price (₹)
                </label>
                <input
                  type="number"
                  value={editingPackage.price || 0}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Offer / Discount Price (₹)
                </label>
                <input
                  type="number"
                  value={editingPackage.discountPrice || 0}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, discountPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={(editingPackage.images && editingPackage.images[0]) || ''}
                onChange={(e) =>
                  setEditingPackage({ ...editingPackage, images: [e.target.value] })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={editingPackage.duration || '3 Hours'}
                onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Inclusions (Comma separated)
              </label>
              <input
                type="text"
                value={(editingPackage.includedItems || []).join(', ')}
                onChange={(e) =>
                  setEditingPackage({
                    ...editingPackage,
                    includedItems: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPackageModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingPackage.name) return;
                  await savePackage(editingPackage as any);
                  setPackageModalOpen(false);
                }}
                className="px-6 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PORTFOLIO ================= */}
      {portfolioModalOpen && editingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif font-bold text-stone-900">Add Portfolio Item</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Title / Look Name
              </label>
              <input
                type="text"
                value={editingPortfolio.title || ''}
                onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={editingPortfolio.category || 'Bridal'}
                  onChange={(e) =>
                    setEditingPortfolio({ ...editingPortfolio, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                >
                  <option value="Bridal">Bridal</option>
                  <option value="Bengali Bridal">Bengali Bridal</option>
                  <option value="Reception">Reception</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Party Makeup">Party Makeup</option>
                  <option value="HD Makeup">HD Makeup</option>
                  <option value="Natural Makeup">Natural Makeup</option>
                  <option value="Hair Styling">Hair Styling</option>
                  <option value="Saree Draping">Saree Draping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Media Type
                </label>
                <select
                  value={editingPortfolio.type || 'image'}
                  onChange={(e) =>
                    setEditingPortfolio({ ...editingPortfolio, type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                >
                  <option value="image">Image (Photo)</option>
                  <option value="video">Video (Reel / MP4)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Media URL
              </label>
              <input
                type="url"
                value={editingPortfolio.mediaUrl || ''}
                onChange={(e) =>
                  setEditingPortfolio({ ...editingPortfolio, mediaUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingPortfolio.title) return;
                  await savePortfolioItem(editingPortfolio as any);
                  setPortfolioModalOpen(false);
                }}
                className="px-6 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Save to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT COUPON ================= */}
      {couponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-900">Add Promo Coupon</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={editingCoupon.code || ''}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs uppercase font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Type
                </label>
                <select
                  value={editingCoupon.discountType || 'percentage'}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountType: e.target.value as 'percentage' | 'fixed',
                    })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingCoupon.discountValue || 10}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      discountValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Minimum Booking Amount (₹)
              </label>
              <input
                type="number"
                value={editingCoupon.minBookingAmount || 0}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, minBookingAmount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={editingCoupon.endDate || ''}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, endDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCouponModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingCoupon.code) return;
                  await saveCoupon(editingCoupon as any);
                  setCouponModalOpen(false);
                }}
                className="px-6 py-2 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
