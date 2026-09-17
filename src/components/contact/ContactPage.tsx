import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Send,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';

export const ContactPage: React.FC = () => {
  const { settings, generateWhatsAppLink } = useApp();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryOccasion, setInquiryOccasion] = useState('Bengali Bridal');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedText = `Hello Ankita!\nInquiry from: ${inquiryName}\nPhone: ${inquiryPhone}\nOccasion: ${inquiryOccasion}\nMessage: ${inquiryMessage}`;
    const url = generateWhatsAppLink(formattedText);
    window.open(url, '_blank');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div id="contact-page-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8e512d]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2e2621]">
          Visit Our Makeup Studio
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Schedule an in-person bridal look consultation, discuss wedding day venue travel requirements, or secure your auspicious date.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Contact Info Cards (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-4">
              Studio Information
            </h2>

            {/* Address */}
            <div className="flex items-start space-x-3.5">
              <MapPin className="w-5 h-5 text-[#8e512d] shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Studio Address</p>
                <p className="text-sm font-semibold text-stone-800 leading-snug">{settings.address}</p>
                <p className="text-xs text-stone-500">
                  {settings.city}, {settings.state} - {settings.pincode}
                </p>
                {settings.googleMapsLink && (
                  <a
                    href={settings.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-[#8e512d] hover:underline pt-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="flex items-start space-x-3.5">
              <Phone className="w-5 h-5 text-[#8e512d] shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Call & Consultation</p>
                <p className="text-sm font-semibold text-stone-800">{settings.phone}</p>
                <a
                  href={`tel:${settings.phone}`}
                  className="text-xs text-[#8e512d] hover:underline block"
                >
                  Direct Voice Call
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start space-x-3.5">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Instant WhatsApp</p>
                <p className="text-sm font-semibold text-stone-800">{settings.whatsappNumber}</p>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-700 hover:underline block"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3.5">
              <Mail className="w-5 h-5 text-[#8e512d] shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Email Inquiries</p>
                <a href={`mailto:${settings.email}`} className="text-sm font-semibold text-stone-800 hover:underline">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start space-x-3.5 pt-2 border-t border-stone-100">
              <Clock className="w-5 h-5 text-[#8e512d] shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Working Hours</p>
                <p className="text-sm font-semibold text-stone-800">
                  {settings.openingTime} – {settings.closingTime}
                </p>
                <p className="text-xs text-stone-500">{settings.workingDays || 'Monday - Sunday'}</p>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-[#faf8f5] p-6 rounded-3xl border border-stone-200 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8e512d]">Follow Ankita's Work</p>
            <div className="flex items-center space-x-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-[#f2e7df] text-stone-700 hover:text-pink-600 rounded-2xl border border-stone-200 transition-colors shadow-xs"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-[#f2e7df] text-stone-700 hover:text-blue-600 rounded-2xl border border-stone-200 transition-colors shadow-xs"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white hover:bg-[#f2e7df] text-stone-700 hover:text-red-600 rounded-2xl border border-stone-200 transition-colors shadow-xs"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Inquiry Form (Right) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-7 sm:p-10 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e512d]">
                Quick Consultation Request
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Fill out the form below to receive a personalized bridal quote and date verification directly on WhatsApp.
              </p>
            </div>

            {sentSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="font-serif font-bold text-emerald-900 text-lg">Thank You For Reaching Out!</p>
                <p className="text-xs text-emerald-700">
                  Opening WhatsApp chat with your requested details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      placeholder="e.g. Payel Chatterjee"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="inquiry-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98300 00000"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Target Occasion
                  </label>
                  <select
                    id="inquiry-occasion"
                    value={inquiryOccasion}
                    onChange={(e) => setInquiryOccasion(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/30 focus:outline-none"
                  >
                    <option value="Bengali Bridal (Biye)">Bengali Bridal (Biye)</option>
                    <option value="Boubhat / Reception">Boubhat / Reception</option>
                    <option value="Engagement Ceremony">Engagement Ceremony</option>
                    <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                    <option value="Party Glam Makeover">Party Glam Makeover</option>
                    <option value="Other / Commercial Editorial">Other / Commercial Editorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Your Questions or Event Date
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={4}
                    required
                    placeholder="Provide tentative dates, venue location, or any specific requirements..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full p-3 bg-[#faf8f5] border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8e512d]/30 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  id="inquiry-submit-btn"
                  className="w-full py-3.5 bg-[#8e512d] hover:bg-[#743e1f] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Ankita via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
