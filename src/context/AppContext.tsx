import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/src/firebase/config.ts';
import {
  ActivePage,
  AppNotification,
  BannerItem,
  Booking,
  BusinessSettings,
  CouponItem,
  OfferItem,
  PackageItem,
  PaymentRecord,
  PortfolioItem,
  ReviewItem,
  ServiceItem,
  UserProfile,
} from '@/src/types/index.ts';
import {
  defaultBusinessSettings,
  defaultCoupons,
  defaultOffers,
  defaultPackages,
  defaultPortfolio,
  defaultReviews,
  defaultServices,
} from '@/src/data/defaultData.ts';

interface AppContextType {
  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Auth & Roles
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  loginAsRipanAdmin: () => void;
  loginWithAdminEmail: (email: string) => Promise<boolean>;
  loginAsDemoCustomer: () => void;

  // Business Settings & Banner
  settings: BusinessSettings;
  updateBusinessSettings: (newSettings: Partial<BusinessSettings>) => Promise<void>;
  addBanner: (banner: Omit<BannerItem, 'id'>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  setActiveBanner: (id: string) => Promise<void>;

  // Data Collections
  services: ServiceItem[];
  packages: PackageItem[];
  portfolio: PortfolioItem[];
  reviews: ReviewItem[];
  coupons: CouponItem[];
  offers: OfferItem[];
  bookings: Booking[];
  myBookings: Booking[];
  notifications: AppNotification[];

  // Wishlist
  wishlist: string[];
  toggleWishlist: (serviceId: string) => void;

  // Modals & Flow
  bookingModalOpen: boolean;
  selectedBookingTarget: { item: ServiceItem | PackageItem; type: 'service' | 'package' } | null;
  openBookingModal: (item: ServiceItem | PackageItem, type: 'service' | 'package') => void;
  closeBookingModal: () => void;

  packageDetailModal: PackageItem | null;
  openPackageDetail: (pkg: PackageItem) => void;
  closePackageDetail: () => void;

  // Booking Actions
  createBooking: (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
    paymentRecord?: Omit<PaymentRecord, 'id' | 'timestamp'>
  ) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: Booking['bookingStatus'], paymentStatus?: Booking['paymentStatus']) => Promise<void>;
  isSlotAvailable: (date: string, timeSlot: string, excludeBookingId?: string) => boolean;

  // Admin CRUD operations
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveService: (service: Partial<ServiceItem>) => Promise<void>;

  addPackage: (pkg: Omit<PackageItem, 'id'>) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<PackageItem>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  savePackage: (pkg: Partial<PackageItem>) => Promise<void>;

  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  savePortfolioItem: (item: Partial<PortfolioItem>) => Promise<void>;

  submitReview: (review: Omit<ReviewItem, 'id' | 'isApproved' | 'createdAt'>) => Promise<void>;
  addReview: (review: Omit<ReviewItem, 'id' | 'isApproved' | 'createdAt'>) => Promise<void>;
  moderateReview: (id: string, approve: boolean) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  addCoupon: (coupon: Omit<CouponItem, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  saveCoupon: (coupon: Partial<CouponItem>) => Promise<void>;

  adminStats: {
    todayBookings: number;
    upcomingAppointments: number;
    totalBookings: number;
    totalCustomers: number;
    todayRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    pendingReviews: number;
  };
  updateSettings: (newSettings: Partial<BusinessSettings>) => Promise<void>;
  bookingModalTarget: { item: ServiceItem | PackageItem; type: 'service' | 'package' } | null;
  packageDetailTarget: PackageItem | null;

  // Utility
  applyCoupon: (code: string, amount: number) => { valid: boolean; discount: number; message: string };
  generateWhatsAppLink: (customMessage?: string) => string;
  generateSmsLink: (customMessage?: string) => string;
  seedInitialDataToFirestore: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Business Settings state (with persistent fallback)
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const cached = localStorage.getItem('ankita_business_settings_v4');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.phone === '08617312937' || parsed.phone === '+91 86173 12937') {
          return {
            ...defaultBusinessSettings,
            ...parsed,
            artistPhoto: parsed.artistPhoto || defaultBusinessSettings.artistPhoto,
          };
        }
      } catch {
        // use default
      }
    }
    return defaultBusinessSettings;
  });

  // Services, packages, portfolio, reviews, coupons, offers, bookings
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const cached = localStorage.getItem('ankita_services_v4');
    return cached ? JSON.parse(cached) : defaultServices;
  });

  const [packages, setPackages] = useState<PackageItem[]>(() => {
    const cached = localStorage.getItem('ankita_packages_v4');
    return cached ? JSON.parse(cached) : defaultPackages;
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const cached = localStorage.getItem('ankita_portfolio');
    return cached ? JSON.parse(cached) : defaultPortfolio;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const cached = localStorage.getItem('ankita_reviews');
    return cached ? JSON.parse(cached) : defaultReviews;
  });

  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    const cached = localStorage.getItem('ankita_coupons');
    return cached ? JSON.parse(cached) : defaultCoupons;
  });

  const [offers] = useState<OfferItem[]>(defaultOffers);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const cached = localStorage.getItem('ankita_bookings');
    return cached ? JSON.parse(cached) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      recipientId: 'all',
      title: 'Welcome to Ankita Makeup Studio',
      message: 'Book your luxury bridal or party slot early to secure prime auspicious wedding dates!',
      type: 'offer',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const cached = localStorage.getItem('ankita_wishlist');
    return cached ? JSON.parse(cached) : ['srv-bengali-bridal', 'srv-hd-airbrush'];
  });

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedBookingTarget, setSelectedBookingTarget] = useState<{
    item: ServiceItem | PackageItem;
    type: 'service' | 'package';
  } | null>(null);
  const [packageDetailModal, setPackageDetailModal] = useState<PackageItem | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ankita_business_settings_v4', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ankita_services_v4', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ankita_packages_v4', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('ankita_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('ankita_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('ankita_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('ankita_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('ankita_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Determine admin status:
        // 1. Check if email is owner email (from runtime metadata or settings)
        // 2. Or check firestore /admins/{uid}
        const userEmailLower = (user.email || '').toLowerCase().trim();
        const isMasterEmail =
          userEmailLower === 'ripan321321@gmail.com' ||
          (settings.email && userEmailLower === settings.email.toLowerCase().trim()) ||
          (settings.adminEmail && userEmailLower === settings.adminEmail.toLowerCase().trim()) ||
          (settings.authorizedAdminEmails &&
            settings.authorizedAdminEmails.some(
              (e) => e.toLowerCase().trim() === userEmailLower
            )) ||
          userEmailLower === 'ankita.makeupstudio@gmail.com';

        if (isMasterEmail) {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              setIsAdmin(true);
            }
          } catch {
            // Keep default
          }
        }

        setUserProfile({
          id: user.uid,
          name:
            userEmailLower === 'ripan321321@gmail.com'
              ? 'Ripan (Super Admin)'
              : user.displayName || 'Valued Client',
          email: user.email || '',
          phone: user.phoneNumber || '',
          wishlist: wishlist,
        });
      } else {
        // Check if demo/session admin mode is flagged
        const demoAdmin = sessionStorage.getItem('ankita_demo_admin');
        const adminEmail = sessionStorage.getItem('ankita_admin_email');
        if (demoAdmin === 'true') {
          setIsAdmin(true);
          setUserProfile({
            id: 'admin-ripan',
            name:
              adminEmail === 'ripan321321@gmail.com' || !adminEmail
                ? 'Ripan (Super Admin)'
                : 'Ankita (Artist & Admin)',
            email: adminEmail || 'ripan321321@gmail.com',
            phone: settings.phone,
          });
        } else {
          setIsAdmin(false);
        }
      }
    });

    return () => unsubscribe();
  }, [settings.email, settings.adminEmail, settings.authorizedAdminEmails, settings.phone, wishlist]);

  // Realtime or initial fetch for Business Settings from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'businessSettings', 'main-settings'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as BusinessSettings;
          setSettings(data);
        }
      },
      (error) => {
        // Fallback to offline / default data smoothly
        console.warn('Using local business settings:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Services from Firestore if available
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ServiceItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ServiceItem, 'id'>) });
          });
          setServices(items);
        }
      },
      () => {
        // Fallback to local defaultServices
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Packages from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'packages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: PackageItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<PackageItem, 'id'>) });
          });
          setPackages(items);
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // Fetch Portfolio from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'portfolio'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: PortfolioItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<PortfolioItem, 'id'>) });
          });
          setPortfolio(items);
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // Fetch Reviews from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'reviews'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ReviewItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ReviewItem, 'id'>) });
          });
          setReviews(items);
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // Fetch Bookings from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Booking[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Booking, 'id'>) });
          });
          // sort descending by date
          items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setBookings(items);
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // Sign In with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
      // If popup is blocked in iframe, allow guest / demo customer login
      loginAsDemoCustomer();
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    sessionStorage.removeItem('ankita_demo_admin');
    sessionStorage.removeItem('ankita_demo_customer');
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  }, []);

  // Demo and direct Admin switchers
  const loginAsDemoAdmin = useCallback(() => {
    sessionStorage.setItem('ankita_demo_admin', 'true');
    sessionStorage.setItem('ankita_admin_email', settings.email || 'ripan321321@gmail.com');
    setIsAdmin(true);
    setUserProfile({
      id: 'admin-ankita',
      name: 'Ankita (Artist & Admin)',
      email: settings.email || 'ripan321321@gmail.com',
      phone: settings.phone,
    });
    setActivePage('admin');
  }, [settings]);

  const loginAsRipanAdmin = useCallback(() => {
    sessionStorage.setItem('ankita_demo_admin', 'true');
    sessionStorage.setItem('ankita_admin_email', 'ripan321321@gmail.com');
    setIsAdmin(true);
    setUserProfile({
      id: 'admin-ripan-master',
      name: 'Ripan (Super Admin)',
      email: 'ripan321321@gmail.com',
      phone: settings.phone,
    });
    setActivePage('admin');
  }, [settings.phone]);

  const loginWithAdminEmail = useCallback(
    async (inputEmail: string): Promise<boolean> => {
      const cleanInput = inputEmail.trim().toLowerCase();
      const authorizedList = [
        'ripan321321@gmail.com',
        (settings.email || '').trim().toLowerCase(),
        (settings.adminEmail || '').trim().toLowerCase(),
        ...(settings.authorizedAdminEmails || []).map((e) => e.trim().toLowerCase()),
        'ankita.makeupstudio@gmail.com',
      ].filter(Boolean);

      if (authorizedList.includes(cleanInput)) {
        sessionStorage.setItem('ankita_demo_admin', 'true');
        sessionStorage.setItem('ankita_admin_email', cleanInput);
        setIsAdmin(true);
        setUserProfile({
          id: `admin-${cleanInput.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name:
            cleanInput === 'ripan321321@gmail.com'
              ? 'Ripan (Super Admin)'
              : 'Studio Admin',
          email: cleanInput,
          phone: settings.phone,
        });
        setActivePage('admin');
        return true;
      }
      return false;
    },
    [settings]
  );

  const loginAsDemoCustomer = useCallback(() => {
    sessionStorage.removeItem('ankita_demo_admin');
    setIsAdmin(false);
    setUserProfile({
      id: 'cust-demo-1',
      name: 'Pooja Banerjee',
      email: 'pooja.banerjee@example.com',
      phone: '+91 98311 99887',
      savedAddresses: ['Flat 302, Lake Gardens, Kolkata'],
      wishlist: ['srv-bengali-bridal'],
    });
  }, []);

  // Wishlist toggle
  const toggleWishlist = useCallback((serviceId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(serviceId);
      const next = exists ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      return next;
    });
  }, []);

  // Check double-booking slot availability
  const isSlotAvailable = useCallback(
    (date: string, timeSlot: string, excludeBookingId?: string): boolean => {
      return !bookings.some(
        (b) =>
          b.date === date &&
          b.timeSlot === timeSlot &&
          b.bookingStatus !== 'Cancelled' &&
          b.id !== excludeBookingId
      );
    },
    [bookings]
  );

  // Booking Modal handlers
  const openBookingModal = useCallback(
    (item: ServiceItem | PackageItem, type: 'service' | 'package') => {
      setSelectedBookingTarget({ item, type });
      setBookingModalOpen(true);
    },
    []
  );

  const closeBookingModal = useCallback(() => {
    setBookingModalOpen(false);
    setSelectedBookingTarget(null);
  }, []);

  // Package detail modal
  const openPackageDetail = useCallback((pkg: PackageItem) => {
    setPackageDetailModal(pkg);
  }, []);

  const closePackageDetail = useCallback(() => {
    setPackageDetailModal(null);
  }, []);

  // Create Booking
  const createBooking = useCallback(
    async (
      bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
      paymentRecord?: Omit<PaymentRecord, 'id' | 'timestamp'>
    ): Promise<Booking> => {
      const newBookingId = `BK-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();

      const newBooking: Booking = {
        ...bookingData,
        id: newBookingId,
        createdAt: now,
        updatedAt: now,
      };

      // Save locally first for instantaneous UX
      setBookings((prev) => [newBooking, ...prev]);

      // Admin & Client Notifications with Sound and Vibration
      const adminNotif: AppNotification = {
        id: `notif-admin-${Date.now()}`,
        recipientId: 'admin',
        title: `🚨 NEW BOOKING: ${newBooking.customerName}`,
        message: `Client ${newBooking.customerName} (${newBooking.customerPhone}) booked ${newBooking.serviceName} for ${newBooking.date} at ${newBooking.timeSlot}. Advance: ₹${newBooking.paidAmount.toLocaleString('en-IN')}`,
        type: 'booking',
        read: false,
        createdAt: now,
      };

      const clientNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientId: newBooking.customerId,
        title: `Booking Confirmed: ${newBooking.serviceName}`,
        message: `Your appointment for ${newBooking.date} at ${newBooking.timeSlot} is recorded! Booking ID: ${newBookingId}`,
        type: 'booking',
        read: false,
        createdAt: now,
      };

      // Play alert chime and vibration for admin/customer confirmation
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.4);
        }
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      } catch {
        // audio context not allowed without interaction or not supported
      }

      setNotifications((prev) => [adminNotif, clientNotif, ...prev]);

      // Save to Firestore
      try {
        await setDoc(doc(db, 'bookings', newBookingId), newBooking);
        if (paymentRecord) {
          const paymentId = `PAY-${Date.now().toString().slice(-6)}`;
          await setDoc(doc(db, 'payments', paymentId), {
            ...paymentRecord,
            id: paymentId,
            bookingId: newBookingId,
            timestamp: now,
          });
        }
      } catch (err) {
        console.warn('Saved booking to local state (Firestore sync pending):', err);
      }

      return newBooking;
    },
    []
  );

  // Update Booking Status
  const updateBookingStatus = useCallback(
    async (
      bookingId: string,
      status: Booking['bookingStatus'],
      paymentStatus?: Booking['paymentStatus']
    ) => {
      const now = new Date().toISOString();
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                bookingStatus: status,
                paymentStatus: paymentStatus || b.paymentStatus,
                updatedAt: now,
              }
            : b
        )
      );

      try {
        const updatePayload: Partial<Booking> = {
          bookingStatus: status,
          updatedAt: now,
        };
        if (paymentStatus) {
          updatePayload.paymentStatus = paymentStatus;
        }
        await updateDoc(doc(db, 'bookings', bookingId), updatePayload);
      } catch (err) {
        console.warn('Booking status updated locally:', err);
      }
    },
    []
  );

  // Update Business Settings
  const updateBusinessSettings = useCallback(
    async (newSettings: Partial<BusinessSettings>) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      localStorage.setItem('ankita_business_settings', JSON.stringify(merged));

      try {
        await setDoc(doc(db, 'businessSettings', 'main-settings'), merged, { merge: true });
      } catch (err) {
        console.warn('Updated settings locally:', err);
      }
    },
    [settings]
  );

  // Banner Operations
  const addBanner = useCallback(
    async (banner: Omit<BannerItem, 'id'>) => {
      const newBanner: BannerItem = {
        ...banner,
        id: `banner-${Date.now()}`,
      };
      const currentList = settings.bannerList || [];
      const updatedList = [newBanner, ...currentList];
      await updateBusinessSettings({ bannerList: updatedList });
    },
    [settings.bannerList, updateBusinessSettings]
  );

  const deleteBanner = useCallback(
    async (id: string) => {
      const currentList = settings.bannerList || [];
      const updatedList = currentList.filter((b) => b.id !== id);
      await updateBusinessSettings({ bannerList: updatedList });
    },
    [settings.bannerList, updateBusinessSettings]
  );

  const setActiveBanner = useCallback(
    async (id: string) => {
      const currentList = settings.bannerList || [];
      const target = currentList.find((b) => b.id === id);
      const updatedList = currentList.map((b) => ({
        ...b,
        active: b.id === id,
      }));
      await updateBusinessSettings({
        bannerList: updatedList,
        bannerUrl: target ? target.imageUrl : settings.bannerUrl,
        artistPhoto: target ? target.imageUrl : settings.artistPhoto,
      });
    },
    [settings.bannerList, settings.bannerUrl, settings.artistPhoto, updateBusinessSettings]
  );

  // Admin Service Operations
  const addService = useCallback(async (service: Omit<ServiceItem, 'id'>) => {
    const id = `srv-${Date.now()}`;
    const newService: ServiceItem = { ...service, id };
    setServices((prev) => [newService, ...prev]);
    try {
      await setDoc(doc(db, 'services', id), newService);
    } catch (e) {
      console.warn('Service added locally:', e);
    }
  }, []);

  const updateService = useCallback(async (id: string, update: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...update } : s)));
    try {
      await updateDoc(doc(db, 'services', id), update);
    } catch (e) {
      console.warn('Service updated locally:', e);
    }
  }, []);

  const deleteService = useCallback(async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn('Service deleted locally:', e);
    }
  }, []);

  // Admin Package Operations
  const addPackage = useCallback(async (pkg: Omit<PackageItem, 'id'>) => {
    const id = `pkg-${Date.now()}`;
    const newPkg: PackageItem = { ...pkg, id };
    setPackages((prev) => [newPkg, ...prev]);
    try {
      await setDoc(doc(db, 'packages', id), newPkg);
    } catch (e) {
      console.warn('Package added locally:', e);
    }
  }, []);

  const updatePackage = useCallback(async (id: string, update: Partial<PackageItem>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...update } : p)));
    try {
      await updateDoc(doc(db, 'packages', id), update);
    } catch (e) {
      console.warn('Package updated locally:', e);
    }
  }, []);

  const deletePackage = useCallback(async (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'packages', id));
    } catch (e) {
      console.warn('Package deleted locally:', e);
    }
  }, []);

  // Admin Portfolio Operations
  const addPortfolioItem = useCallback(async (item: Omit<PortfolioItem, 'id'>) => {
    const id = `port-${Date.now()}`;
    const newItem: PortfolioItem = { ...item, id };
    setPortfolio((prev) => [newItem, ...prev]);
    try {
      await setDoc(doc(db, 'portfolio', id), newItem);
    } catch (e) {
      console.warn('Portfolio added locally:', e);
    }
  }, []);

  const deletePortfolioItem = useCallback(async (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (e) {
      console.warn('Portfolio deleted locally:', e);
    }
  }, []);

  // Review Operations
  const submitReview = useCallback(
    async (review: Omit<ReviewItem, 'id' | 'isApproved' | 'createdAt'>) => {
      const id = `rev-${Date.now()}`;
      const newReview: ReviewItem = {
        ...review,
        id,
        isApproved: false, // Requires admin moderation
        createdAt: new Date().toISOString().split('T')[0],
      };
      setReviews((prev) => [newReview, ...prev]);
      try {
        await setDoc(doc(db, 'reviews', id), newReview);
      } catch (e) {
        console.warn('Review queued locally:', e);
      }
    },
    []
  );

  const moderateReview = useCallback(async (id: string, approve: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: approve } : r)));
    try {
      await updateDoc(doc(db, 'reviews', id), { isApproved: approve });
    } catch (e) {
      console.warn('Review moderated locally:', e);
    }
  }, []);

  const deleteReview = useCallback(async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (e) {
      console.warn('Review removed locally:', e);
    }
  }, []);

  // Coupon Operations
  const addCoupon = useCallback(async (coupon: Omit<CouponItem, 'id'>) => {
    const id = `cpn-${Date.now()}`;
    const newCoupon: CouponItem = { ...coupon, id };
    setCoupons((prev) => [newCoupon, ...prev]);
    try {
      await setDoc(doc(db, 'coupons', id), newCoupon);
    } catch (e) {
      console.warn('Coupon added locally:', e);
    }
  }, []);

  const deleteCoupon = useCallback(async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {
      console.warn('Coupon deleted locally:', e);
    }
  }, []);

  // Coupon application logic
  const applyCoupon = useCallback(
    (code: string, amount: number) => {
      const cleanCode = code.trim().toUpperCase();
      const match = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

      if (!match) {
        return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
      }

      if (match.minBookingAmount && amount < match.minBookingAmount) {
        return {
          valid: false,
          discount: 0,
          message: `Coupon applies only to bookings of ₹${match.minBookingAmount.toLocaleString('en-IN')} or more.`,
        };
      }

      let discount = 0;
      if (match.discountType === 'percentage') {
        discount = (amount * match.discountValue) / 100;
        if (match.maxDiscount && discount > match.maxDiscount) {
          discount = match.maxDiscount;
        }
      } else {
        discount = match.discountValue;
      }

      return {
        valid: true,
        discount: Math.min(discount, amount),
        message: `Coupon ${cleanCode} applied! You saved ₹${discount.toLocaleString('en-IN')}`,
      };
    },
    [coupons]
  );

  // Dynamic WhatsApp Link Generator
  const generateWhatsAppLink = useCallback(
    (customMessage?: string): string => {
      let cleanNumber = (settings.whatsapp || settings.phone || '08617312937').replace(/[^0-9]/g, '');
      if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
        cleanNumber = '91' + cleanNumber.substring(1);
      } else if (cleanNumber.length === 10) {
        cleanNumber = '91' + cleanNumber;
      }
      const defaultMsg = `Hello Ankita! I am interested in booking your makeup services (Bridal / HD / Haldi / Party). Could you please share slot details?`;
      const text = encodeURIComponent(customMessage || defaultMsg);
      return `https://wa.me/${cleanNumber}?text=${text}`;
    },
    [settings]
  );

  // Dynamic SMS Link Generator for Admin Phone Notification
  const generateSmsLink = useCallback(
    (customMessage?: string): string => {
      const cleanNumber = (settings.phone || '08617312937').replace(/[^0-9]/g, '');
      const defaultMsg = `Hello Ankita! New makeup booking inquiry.`;
      const text = encodeURIComponent(customMessage || defaultMsg);
      return `sms:${cleanNumber}?body=${text}`;
    },
    [settings]
  );

  // Seed Initial Data to Firestore (Admin one-click button)
  const seedInitialDataToFirestore = useCallback(async () => {
    try {
      // 1. Settings
      await setDoc(doc(db, 'businessSettings', 'main-settings'), defaultBusinessSettings);

      // 2. Services
      for (const s of defaultServices) {
        await setDoc(doc(db, 'services', s.id), s);
      }

      // 3. Packages
      for (const p of defaultPackages) {
        await setDoc(doc(db, 'packages', p.id), p);
      }

      // 4. Portfolio
      for (const port of defaultPortfolio) {
        await setDoc(doc(db, 'portfolio', port.id), port);
      }

      // 5. Reviews
      for (const r of defaultReviews) {
        await setDoc(doc(db, 'reviews', r.id), r);
      }

      // 6. Coupons
      for (const c of defaultCoupons) {
        await setDoc(doc(db, 'coupons', c.id), c);
      }

      console.log('Seeded initial data to Firestore successfully.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seed');
    }
  }, []);

  // Filter customer's own bookings
  const myBookings = bookings.filter((b) => {
    if (isAdmin) return true;
    if (currentUser?.uid && b.customerId === currentUser.uid) return true;
    if (userProfile?.email && b.customerEmail === userProfile.email) return true;
    // or if created in current session
    return true;
  });

  const saveService = useCallback(
    async (service: Partial<ServiceItem>) => {
      if (service.id) {
        await updateService(service.id, service);
      } else {
        await addService(service as Omit<ServiceItem, 'id'>);
      }
    },
    [updateService, addService]
  );

  const savePackage = useCallback(
    async (pkg: Partial<PackageItem>) => {
      if (pkg.id) {
        await updatePackage(pkg.id, pkg);
      } else {
        await addPackage(pkg as Omit<PackageItem, 'id'>);
      }
    },
    [updatePackage, addPackage]
  );

  const savePortfolioItem = useCallback(
    async (item: Partial<PortfolioItem>) => {
      if (item.id) {
        setPortfolio((prev) => prev.map((p) => (p.id === item.id ? { ...p, ...item } : p)));
        try {
          await updateDoc(doc(db, 'portfolio', item.id), item);
        } catch (e) {
          console.warn('Portfolio updated locally:', e);
        }
      } else {
        await addPortfolioItem(item as Omit<PortfolioItem, 'id'>);
      }
    },
    [addPortfolioItem]
  );

  const saveCoupon = useCallback(
    async (coupon: Partial<CouponItem>) => {
      if (coupon.id) {
        setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, ...coupon } : c)));
        try {
          await updateDoc(doc(db, 'coupons', coupon.id), coupon);
        } catch (e) {
          console.warn('Coupon updated locally:', e);
        }
      } else {
        await addCoupon(coupon as Omit<CouponItem, 'id'>);
      }
    },
    [addCoupon]
  );

  const approveReview = useCallback(
    async (id: string) => {
      await moderateReview(id, true);
    },
    [moderateReview]
  );

  const adminStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter((b) => b.date === todayStr);
    const upcomingAppointments = bookings.filter(
      (b) => b.date >= todayStr && b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Completed'
    );
    const uniqueCustomers = new Set(
      bookings.map((b) => b.customerPhone || b.customerEmail).filter(Boolean)
    ).size;
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const monthlyRevenue = bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const pendingPayments = bookings
      .filter((b) => b.bookingStatus !== 'Cancelled' && b.paymentStatus !== 'Completed')
      .reduce((sum, b) => sum + (b.remainingAmount || 0), 0);
    const pendingReviews = reviews.filter((r) => !r.isApproved).length;

    return {
      todayBookings: todayBookings.length,
      upcomingAppointments: upcomingAppointments.length,
      totalBookings: bookings.length,
      totalCustomers: uniqueCustomers,
      todayRevenue,
      monthlyRevenue,
      pendingPayments,
      pendingReviews,
    };
  }, [bookings, reviews]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        currentUser,
        userProfile,
        isAdmin,
        isAuthLoading,
        signInWithGoogle,
        signOut,
        loginAsDemoAdmin,
        loginAsRipanAdmin,
        loginWithAdminEmail,
        loginAsDemoCustomer,
        settings,
        updateBusinessSettings,
        addBanner,
        deleteBanner,
        setActiveBanner,
        services,
        packages,
        portfolio,
        reviews,
        coupons,
        offers,
        bookings,
        myBookings,
        notifications,
        wishlist,
        toggleWishlist,
        bookingModalOpen,
        selectedBookingTarget,
        openBookingModal,
        closeBookingModal,
        packageDetailModal,
        openPackageDetail,
        closePackageDetail,
        createBooking,
        updateBookingStatus,
        isSlotAvailable,
        addService,
        updateService,
        deleteService,
        addPackage,
        updatePackage,
        deletePackage,
        addPortfolioItem,
        deletePortfolioItem,
        submitReview,
        moderateReview,
        deleteReview,
        addCoupon,
        deleteCoupon,
        applyCoupon,
        generateWhatsAppLink,
        generateSmsLink,
        seedInitialDataToFirestore,
        adminStats,
        updateSettings: updateBusinessSettings,
        saveService,
        savePackage,
        savePortfolioItem,
        saveCoupon,
        approveReview,
        addReview: submitReview,
        bookingModalTarget: selectedBookingTarget,
        packageDetailTarget: packageDetailModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
