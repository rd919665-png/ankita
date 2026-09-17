import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Star,
  Printer,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { Booking } from '@/src/types/index.ts';

export const MyBookingsPage: React.FC = () => {
  const {
    myBookings,
    setActivePage,
    generateWhatsAppLink,
    updateBookingStatus,
    addReview,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return ['Confirmed', 'Pending', 'Paid', 'Rescheduled'].includes(b.bookingStatus);
    if (activeTab === 'completed') return b.bookingStatus === 'Completed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

  const handlePrintReceipt = (booking: Booking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${booking.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #2e2621; }
            .header { border-bottom: 2px solid #8e512d; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #8e512d; }
            .sub { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
            .label { font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; }
            .val { font-size: 14px; font-weight: 600; margin-top: 4px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
            .total-row { font-size: 16px; font-weight: bold; color: #8e512d; }
            .footer { margin-top: 50px; font-size: 12px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${settings.businessName || 'Ankita Makeup Artist'}</div>
            <div class="sub">Official Booking Invoice & Receipt</div>
          </div>
          <div class="grid">
            <div>
              <div class="label">Customer Name</div>
              <div class="val">${booking.customerName}</div>
              <div class="val" style="font-size: 12px; color: #666;">${booking.customerPhone}</div>
            </div>
            <div>
              <div class="label">Booking ID</div>
              <div class="val">${booking.id}</div>
              <div class="val" style="font-size: 12px; color: #666;">Date: ${booking.date} (${booking.timeSlot})</div>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item / Service</th>
                <th>Venue / Type</th>
                <th>Paid Amount</th>
                <th>Remaining Due</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${booking.serviceName}</strong></td>
                <td>${booking.venue || 'Studio'}</td>
                <td>₹${booking.paidAmount.toLocaleString('en-IN')}</td>
                <td>₹${booking.remainingAmount.toLocaleString('en-IN')}</td>
                <td>₹${booking.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 20px; text-align: right;">
            <p class="total-row">Total Paid: ₹${booking.paidAmount.toLocaleString('en-IN')}</p>
            <p style="font-size: 12px; color: #666;">Remaining Due on Event Date: ₹${booking.remainingAmount.toLocaleString('en-IN')}</p>
          </div>
          <div class="footer">
            Thank you for choosing ${settings.businessName || 'Ankita Makeup Studio'}. For assistance, WhatsApp +91 ${settings.whatsappNumber || '9830012345'}.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleSubmitReview = async () => {
    if (!reviewModalBooking) return;
    try {
      await addReview({
        customerId: reviewModalBooking.customerId,
        customerName: reviewModalBooking.customerName,
        serviceId: reviewModalBooking.serviceId,
        serviceName: reviewModalBooking.serviceName,
        rating,
        comment,
        isApproved: false, // goes to admin moderation
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewModalBooking(null);
        setComment('');
        setRating(5);
      }, 1800);
    } catch (err) {
      console.error(err);
      alert('Could not submit review.');
    }
  };

  return (
    <div id="my-bookings-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8e512d]">
            Customer Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2e2621]">My Appointments</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track status, download invoices, request schedule adjustments, or write reviews.
          </p>
        </div>

        <button
          onClick={() => setActivePage('services')}
          className="px-5 py-2.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Book Another Service</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-booking-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#8e512d] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#f2e7df]'
            }`}
          >
            {tab === 'all' ? `All (${myBookings.length})` : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-lg font-serif font-bold text-stone-800">No appointments found</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You don't have any {activeTab !== 'all' ? activeTab : ''} bookings currently.
          </p>
          <button
            onClick={() => setActivePage('services')}
            className="mt-6 px-6 py-2.5 bg-[#8e512d] text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-[#743e1f] cursor-pointer"
          >
            Explore Services & Book
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => {
            const isConfirmed = ['Confirmed', 'Paid'].includes(booking.bookingStatus);
            const isCompleted = booking.bookingStatus === 'Completed';

            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8ded7] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        {booking.id}
                      </span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-500 capitalize">{booking.eventType}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2e2621]">
                      {booking.serviceName}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-blue-100 text-blue-900'
                          : isConfirmed
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <Calendar className="w-4 h-4 text-[#8e512d] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px] font-bold">Event Date</span>
                      <span className="font-semibold text-stone-800">{booking.date}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-[#8e512d] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px] font-bold">Time Slot</span>
                      <span className="font-semibold text-stone-800">{booking.timeSlot}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-4 h-4 text-[#8e512d] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px] font-bold">Venue</span>
                      <span className="font-semibold text-stone-800 line-clamp-1">{booking.venue || 'Studio'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-stone-400 block uppercase text-[10px] font-bold">Payment Summary</span>
                    <span className="font-semibold text-[#8e512d]">
                      Paid: ₹{booking.paidAmount.toLocaleString('en-IN')}
                    </span>
                    {booking.remainingAmount > 0 && (
                      <span className="block text-stone-500 text-[11px]">
                        Due: ₹{booking.remainingAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Special Instructions note */}
                {booking.specialInstructions && (
                  <div className="bg-[#faf8f5] p-3 rounded-xl border border-stone-200 text-xs text-stone-600">
                    <strong className="text-stone-800">Special Notes:</strong> {booking.specialInstructions}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePrintReceipt(booking)}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>

                    <a
                      href={generateWhatsAppLink(
                        `Hello Ankita! I have a question regarding my appointment (Booking ID: ${booking.id}) scheduled for ${booking.date} at ${booking.timeSlot}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-700 text-white" />
                      <span>WhatsApp Artist</span>
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Rate & Review button */}
                    <button
                      onClick={() => setReviewModalBooking(booking)}
                      className="px-4 py-2 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                      <span>Leave a Review</span>
                    </button>

                    {booking.bookingStatus !== 'Cancelled' && (
                      <button
                        onClick={() => {
                          if (confirm(`Do you wish to cancel booking ${booking.id}? Advance amounts are subject to the studio cancellation policy.`)) {
                            updateBookingStatus(booking.id, 'Cancelled');
                          }
                        }}
                        className="px-3 py-2 text-stone-400 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave a Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div
            id="leave-review-modal"
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95"
          >
            <button
              onClick={() => setReviewModalBooking(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e512d]">
                Feedback & Experience
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
                Rate Your Makeup Artistry
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Service: {reviewModalBooking.serviceName}
              </p>
            </div>

            {reviewSuccess ? (
              <div className="text-center py-6 text-emerald-700 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <p className="font-serif font-bold text-lg">Thank You For Your Review!</p>
                <p className="text-xs text-stone-500">Your review will be published to our testimonials.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Select Star Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-stone-300 hover:text-amber-500 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Share Your Experience
                  </label>
                  <textarea
                    id="review-comment-input"
                    rows={4}
                    placeholder="How was the look, makeup longevity, Chandan art, and Ankita's hospitality?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/30 focus:outline-none"
                  />
                </div>

                <button
                  id="submit-review-btn"
                  onClick={handleSubmitReview}
                  disabled={!comment.trim()}
                  className="w-full py-3.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
