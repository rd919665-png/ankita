export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Payment Pending'
  | 'Paid'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled';

export type PaymentStatus =
  | 'Unpaid'
  | 'Advance Paid'
  | 'Partially Paid'
  | 'Fully Paid'
  | 'Refunded';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  savedAddresses?: string[];
  wishlist?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Bridal' | 'Reception' | 'Engagement' | 'Party' | 'Haldi & Mehendi' | 'Hair Styling' | 'Saree Draping' | 'Combos';
  price: number;
  duration: string;
  description: string;
  imageUrl: string;
  includedServices: string[];
  productsUsed?: string;
  extraCharges?: string;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  duration: string;
  description: string;
  images: string[];
  includedItems: string[];
  terms: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Bridal' | 'Bengali Bridal' | 'Reception' | 'Engagement' | 'Party Makeup' | 'HD Makeup' | 'Natural Makeup' | 'Hair Styling' | 'Saree Draping';
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  bookingType: 'service' | 'package';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 01:00 PM"
  eventType: string;
  venue: string;
  specialInstructions?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  transactionRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  type: 'Advance' | 'Full' | 'Remaining';
  method: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  transactionReference: string;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  timestamp: string;
}

export interface ReviewItem {
  id: string;
  bookingId?: string;
  customerId?: string;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategory?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  ctaText?: string;
  link?: string;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'offer' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  artistName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsLink: string;
  upiId: string;
  upiName: string;
  qrCodeUrl: string;
  instagram: string;
  facebook: string;
  youtube: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  openingTime: string;
  closingTime: string;
  workingDays: string;
  advancePercentage: number;
  cancellationPolicy: string;
  termsConditions: string;
  privacyPolicy: string;
}

export type ActivePage =
  | 'home'
  | 'services'
  | 'packages'
  | 'portfolio'
  | 'my-bookings'
  | 'profile'
  | 'contact'
  | 'admin';
