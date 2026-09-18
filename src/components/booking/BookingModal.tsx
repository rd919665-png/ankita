import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  Tag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/src/context/AppContext.tsx';
import { availableTimeSlots } from '@/src/data/defaultData.ts';
import { Booking, PaymentRecord, ServiceItem, PackageItem } from '@/src/types/index.ts';

interface BookingModalProps {
  isOpen: boolean;
  target: { item: ServiceItem | PackageItem; type: 'service' | 'package' } | null;
  onClose: () => void;
}

type BookingStep = 1 | 2 | 3 | 4;

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, target, onClose }) => {
  const {
    settings,
    userProfile,
    isSlotAvailable,
    createBooking,
    applyCoupon,
    generateWhatsAppLink,
    generateSmsLink,
    setActivePage,
  } = useApp();

  const [step, setStep] = useState<BookingStep>(1);

  // Form State
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState<string>(availableTimeSlots[1]);

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [eventType, setEventType] = useState('Wedding / Bridal');
  const [venue, setVenue] = useState('Ankita Makeup Studio (Park Street)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment State
  const [paymentChoice, setPaymentChoice] = useState<'advance' | 'full'>('advance');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ valid: boolean; discount: number; message: string } | null>(null);

  // Completed Booking Details
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);

  // Prepopulate if user profile exists
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setCustomerName(userProfile.name);
      if (userProfile.email) setCustomerEmail(userProfile.email);
      if (userProfile.phone) setCustomerPhone(userProfile.phone);
    }
  }, [userProfile]);

  if (!isOpen || !target) return null;

  const item = target.item;
  const basePrice = 'discountPrice' in item && item.discountPrice ? item.discountPrice : item.price;
  const discountAmount = couponFeedback?.valid ? couponFeedback.discount : 0;
  const totalAmount = Math.max(0, basePrice - discountAmount);

  // Advance percentage calculation from business settings (e.g. 25%)
  const advancePercent = settings.advancePercentage || 25;
  const advanceAmount = Math.round((totalAmount * advancePercent) / 100);
  const amountToPayNow = paymentChoice === 'advance' ? advanceAmount : totalAmount;
  const remainingAmount = totalAmount - amountToPayNow;

  // Coupon apply handler
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode, basePrice);
    setCouponFeedback(result);
  };

  // Step navigation validations
  const handleNextFromStep1 = () => {
    if (!selectedDate) return;
    if (!selectedSlot) return;
    if (!isSlotAvailable(selectedDate, selectedSlot)) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      alert('Please provide your name, phone number, and email address.');
      return;
    }
    setStep(3);
  };

  // Final confirmation and payment execution
  const handleConfirmAndPay = async () => {
    setIsProcessing(true);

    try {
      const paymentStatus = paymentChoice === 'full' ? 'Fully Paid' : 'Advance Paid';
      const bookingStatus = 'Confirmed';
      const transactionRef = `TXN-${Date.now().toString().slice(-8)}`;

      const bookingPayload: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        customerId: userProfile?.id || `guest-${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail,
        serviceId: item.id,
        serviceName: item.name,
        bookingType: target.type,
        date: selectedDate,
        timeSlot: selectedSlot,
        eventType,
        venue,
        specialInstructions,
        totalAmount,
        paidAmount: amountToPayNow,
        remainingAmount,
        bookingStatus,
        paymentStatus,
        paymentMethod,
        transactionRef,
      };

      const paymentRecord: Omit<PaymentRecord, 'id' | 'timestamp'> = {
        bookingId: '',
        customerId: userProfile?.id || `guest-${Date.now()}`,
        amount: amountToPayNow,
        type: paymentChoice === 'full' ? 'Full' : 'Advance',
        method: paymentMethod,
        transactionReference: transactionRef,
        status: 'Success',
      };

      const newBooking = await createBooking(bookingPayload, paymentRecord);
      setCreatedBooking(newBooking);
      setStep(4);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8e512d', '#d4af37', '#f4ebe4', '#2e2621'],
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Could not complete booking. Please try again or reach out on WhatsApp.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyUPI = () => {
    if (settings.upiId) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div
        id="online-booking-modal"
        className="relative w-full max-w-2xl bg-[#faf8f5] rounded-3xl shadow-2xl overflow-hidden z-10 my-8 border border-[#e8ded7] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#2e2621] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                Online Reservation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">{item.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        {step < 4 && (
          <div className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between text-xs">
            <span className={`font-semibold ${step === 1 ? 'text-[#8e512d]' : 'text-stone-400'}`}>
              1. Date & Slot
            </span>
            <span className="text-stone-300">•</span>
            <span className={`font-semibold ${step === 2 ? 'text-[#8e512d]' : 'text-stone-400'}`}>
              2. Details & Venue
            </span>
            <span className="text-stone-300">•</span>
            <span className={`font-semibold ${step === 3 ? 'text-[#8e512d]' : 'text-stone-400'}`}>
              3. Payment & Advance
            </span>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* ================= STEP 1: DATE & TIME SLOT ================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Appointment Date
                </label>
                <div className="relative">
                  <input
                    id="booking-date-picker"
                    type="date"
                    min={tomorrow}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                  />
                  <CalendarIcon className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Select Available Time Slot
                  </label>
                  <span className="text-[11px] text-stone-500">Live Availability</span>
                </div>

                <div className="space-y-2.5">
                  {availableTimeSlots.map((slot) => {
                    const available = isSlotAvailable(selectedDate, slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        id={`slot-btn-${slot.slice(0, 5).replace(':', '-')}`}
                        disabled={!available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          !available
                            ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#f4ebe4] border-[#8e512d] text-[#8e512d] font-bold shadow-xs'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-[#8e512d]/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-[#8e512d]' : 'text-stone-400'}`} />
                          <span>{slot}</span>
                        </div>

                        <div>
                          {available ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Available</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Booked</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Standard Duration</span>
                  <span className="text-sm font-semibold text-stone-800">{item.duration}</span>
                </div>
                <button
                  id="step1-continue-btn"
                  onClick={handleNextFromStep1}
                  className="px-6 py-3 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: DETAILS & VENUE ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Customer Full Name *
                  </label>
                  <input
                    id="booking-input-name"
                    type="text"
                    required
                    placeholder="e.g. Sreya Sengupta"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Contact Phone (WhatsApp) *
                  </label>
                  <input
                    id="booking-input-phone"
                    type="tel"
                    required
                    placeholder="e.g. +91 98300 12345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address (For Booking Confirmation) *
                </label>
                <input
                  id="booking-input-email"
                  type="email"
                  required
                  placeholder="e.g. sreya.wedding@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Event Type
                  </label>
                  <select
                    id="booking-input-event-type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                  >
                    <option value="Bengali Wedding">Bengali Wedding (Biye)</option>
                    <option value="Wedding Reception">Wedding Reception (Boubhat)</option>
                    <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                    <option value="Sangeet / Cocktail">Sangeet / Cocktail</option>
                    <option value="Haldi / Gaye Holud">Haldi / Gaye Holud</option>
                    <option value="Party / Pre-Wedding Shoot">Party / Pre-Wedding Shoot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Venue / Dressing Address
                  </label>
                  <input
                    id="booking-input-venue"
                    type="text"
                    placeholder="Studio or Home/Banquet address"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Special Instructions / Outfit Details (Optional)
                </label>
                <textarea
                  id="booking-input-instructions"
                  rows={2}
                  placeholder="Skin sensitivities, Benarasi saree color, hair length, jewelry specifics..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/40 focus:outline-none"
                />
              </div>

              {/* Step 2 Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="step2-continue-btn"
                  onClick={handleNextFromStep2}
                  className="px-6 py-3 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PAYMENT & ADVANCE ================= */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Coupon input */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                  <Tag className="w-3.5 h-3.5 text-[#8e512d]" />
                  <span>Have a Promo Coupon?</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    id="booking-coupon-input"
                    type="text"
                    placeholder="Try BRIDAL2026 or GLOW500"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs uppercase focus:outline-none"
                  />
                  <button
                    id="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-stone-900 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.valid ? 'text-emerald-700 font-medium' : 'text-red-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Advance vs Full Option Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Payment Option
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Option 1: Advance */}
                  <button
                    type="button"
                    id="pay-choice-advance-btn"
                    onClick={() => setPaymentChoice('advance')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentChoice === 'advance'
                        ? 'bg-[#f4ebe4] border-[#8e512d] ring-1 ring-[#8e512d]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-900">
                        Pay {advancePercent}% Advance
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-bold">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-xl font-serif font-bold text-[#8e512d]">
                      ₹{advanceAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Remaining ₹{(totalAmount - advanceAmount).toLocaleString('en-IN')} on event date
                    </p>
                  </button>

                  {/* Option 2: Full */}
                  <button
                    type="button"
                    id="pay-choice-full-btn"
                    onClick={() => setPaymentChoice('full')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentChoice === 'full'
                        ? 'bg-[#f4ebe4] border-[#8e512d] ring-1 ring-[#8e512d]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-900">Pay Full Amount</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        No Dues
                      </span>
                    </div>
                    <p className="text-xl font-serif font-bold text-[#8e512d]">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1">Zero balance due on wedding day</p>
                  </button>
                </div>
              </div>

              {/* Payment Gateway / Method Selection */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Payment Method
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    id="pay-method-upi"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center space-y-1.5 cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#8e512d] bg-[#f4ebe4] text-[#8e512d]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    id="pay-method-card"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center space-y-1.5 cursor-pointer ${
                      paymentMethod === 'Card'
                        ? 'border-[#8e512d] bg-[#f4ebe4] text-[#8e512d]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card / Debit</span>
                  </button>

                  <button
                    type="button"
                    id="pay-method-netbanking"
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center space-y-1.5 cursor-pointer ${
                      paymentMethod === 'NetBanking'
                        ? 'border-[#8e512d] bg-[#f4ebe4] text-[#8e512d]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Dynamic UPI details view */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-[#faf8f5] p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border border-stone-200 shadow-xs shrink-0 flex items-center justify-center">
                      {settings.qrCodeUrl ? (
                        <img src={settings.qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <QrCode className="w-16 h-16 text-stone-700" />
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-1.5">
                      <p className="text-xs text-stone-500">Scan with GPay, PhonePe, Paytm or BHIM:</p>
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2.5 py-1 rounded border border-stone-200">
                          {settings.upiId || 'ankitamakeup@okaxis'}
                        </span>
                        <button
                          type="button"
                          onClick={copyUPI}
                          className="p-1 text-stone-500 hover:text-[#8e512d]"
                          title="Copy UPI ID"
                        >
                          {copiedUPI ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Recipient: <strong className="text-stone-800">{settings.upiName || 'Ankita Makeup Studio'}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation Summary Table */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Base Price</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({couponCode.toUpperCase()})</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-2 text-sm">
                  <span>Total Booking Amount</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#8e512d] font-bold text-base bg-[#f4ebe4] p-2 rounded-lg">
                  <span>Amount Payable Right Now</span>
                  <span>₹{amountToPayNow.toLocaleString('en-IN')}</span>
                </div>
                {remainingAmount > 0 && (
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>Remaining Balance Due on Event Date</span>
                    <span>₹{remainingAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Step 3 Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="confirm-and-pay-btn"
                  disabled={isProcessing}
                  onClick={handleConfirmAndPay}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Confirming...' : `Pay ₹${amountToPayNow.toLocaleString('en-IN')} & Confirm`}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: CONFIRMATION SUCCESS ================= */}
          {step === 4 && createdBooking && (
            <div id="booking-confirmation-screen" className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-emerald-700">
                  Appointment Confirmed
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">Thank You, {createdBooking.customerName}!</h2>
                <p className="text-xs text-stone-600 mt-1">
                  Your makeup appointment has been secured in our official calendar.
                </p>
              </div>

              {/* Booking Receipt Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 text-left space-y-3 shadow-xs">
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Booking Reference ID</span>
                    <span className="font-mono text-base font-bold text-[#8e512d]">{createdBooking.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-stone-400 font-bold block">Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {createdBooking.bookingStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Service</span>
                    <span className="font-semibold">{createdBooking.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Date & Time</span>
                    <span className="font-semibold">{createdBooking.date}</span>
                    <span className="block text-stone-500 text-[11px]">{createdBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Amount Paid</span>
                    <span className="font-semibold text-emerald-700">₹{createdBooking.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Remaining Due</span>
                    <span className="font-semibold text-stone-700">₹{createdBooking.remainingAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                  <span>Venue: {createdBooking.venue}</span>
                </div>
              </div>

              {/* Admin Notification & Contact Action Bar */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center space-x-2 text-amber-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Admin Notification Dispatched</span>
                </div>
                <p className="text-xs text-stone-600">
                  An alert has been recorded on Ankita's Admin Dashboard. You can also send an instant SMS alert, WhatsApp message, or make a direct audio call to <span className="font-semibold text-stone-900">08617312937</span>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {/* WhatsApp to Admin */}
                  <a
                    id="whatsapp-admin-notify-btn"
                    href={generateWhatsAppLink(
                      `🚨 NEW BOOKING ALERT!\nClient: ${createdBooking.customerName}\nPhone: ${createdBooking.customerPhone}\nService: ${createdBooking.serviceName}\nDate: ${createdBooking.date}\nTime: ${createdBooking.timeSlot}\nBooking ID: ${createdBooking.id}\nPaid Advance: ₹${createdBooking.paidAmount.toLocaleString('en-IN')}\nVenue: ${createdBooking.venue}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>

                  {/* SMS to Admin Phone */}
                  <a
                    id="sms-admin-notify-btn"
                    href={generateSmsLink(
                      `NEW BOOKING ALERT! Client: ${createdBooking.customerName} (${createdBooking.customerPhone}), Service: ${createdBooking.serviceName}, Date: ${createdBooking.date} at ${createdBooking.timeSlot}, Advance Paid: Rs.${createdBooking.paidAmount}. ID: ${createdBooking.id}`
                    )}
                    className="py-2.5 px-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </a>

                  {/* Audio Call Admin */}
                  <a
                    id="call-admin-notify-btn"
                    href="tel:08617312937"
                    className="py-2.5 px-3 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Audio Call</span>
                  </a>
                </div>
              </div>

              {/* Navigation CTA */}
              <div className="space-y-2 pt-1">
                <button
                  id="view-my-bookings-btn"
                  onClick={() => {
                    onClose();
                    setActivePage('my-bookings');
                  }}
                  className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View in My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
