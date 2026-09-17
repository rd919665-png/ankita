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
  Shield,
  X,
} from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';
import { ActivePage } from '@/src/types/index.ts';

export const Footer: React.FC = () => {
  const { settings, setActivePage, generateWhatsAppLink } = useApp();
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);
  const [legalModalContent, setLegalModalContent] = useState<string | null>(null);

  const openLegal = (title: string, content: string) => {
    setLegalModalTitle(title);
    setLegalModalContent(content);
  };

  return (
    <footer id="main-footer" className="bg-[#1f1915] text-[#d8c8bc] border-t border-stone-800 pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center font-serif text-xl font-bold">
                A
              </div>
              <span className="text-xl font-serif text-[#fbf6f0] font-bold">
                {settings.businessName || 'Ankita Makeup Artist'}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              {settings.description ||
                'Luxury bridal makeup studio catering to discerning brides across Kolkata and destination weddings. Expert in authentic Bengali Chandan art and HD airbrushing.'}
            </p>
            <p className="text-[11px] uppercase tracking-widest text-amber-400 font-medium">
              Lead Artist: {settings.artistName || 'Ankita'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbf6f0]">
              Discover Artistry
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home Page', page: 'home' as ActivePage },
                { label: 'Makeup Services', page: 'services' as ActivePage },
                { label: 'Bridal Packages', page: 'packages' as ActivePage },
                { label: 'Real Brides Portfolio', page: 'portfolio' as ActivePage },
                { label: 'Customer Appointments', page: 'my-bookings' as ActivePage },
                { label: 'Visit Studio / Contact', page: 'contact' as ActivePage },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setActivePage(link.page)}
                    className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Studio Hours & Contacts */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbf6f0]">
              Studio Hours & Contact
            </h3>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {settings.openingTime} - {settings.closingTime}
                  <br />
                  <span className="text-stone-400">{settings.workingDays || 'Monday - Sunday'}</span>
                </span>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city} - {settings.pincode}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:underline">
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-emerald-400"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Social & Advance Note */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbf6f0]">
              Follow Studio Journey
            </h3>
            <p className="text-xs text-stone-400">
              Stay inspired with daily reels, behind-the-scenes transformations, and seasonal bridal offers.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-pink-400 rounded-xl transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-blue-400 rounded-xl transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-red-400 rounded-xl transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2 text-[11px] text-amber-300/80 bg-amber-950/30 p-3 rounded-xl border border-amber-800/40">
              <span>★ {settings.advancePercentage || 25}% advance deposit required to confirm appointment slots.</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.businessName || 'Ankita Makeup Artist'}. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() =>
                openLegal(
                  'Cancellation & Refund Policy',
                  settings.cancellationPolicy ||
                    'Cancellations made 15+ days prior to event receive a 50% refund. Rescheduling is complimentary subject to calendar availability.'
                )
              }
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Cancellation Policy
            </button>
            <span>•</span>
            <button
              onClick={() =>
                openLegal(
                  'Terms & Conditions',
                  settings.termsConditions ||
                    'All packages and appointments require advance reservation. Travel and accommodation for outside Kolkata bookings must be arranged by the client.'
                )
              }
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() =>
                openLegal(
                  'Privacy Policy',
                  settings.privacyPolicy ||
                    'Customer contact and booking information is kept confidential and utilized exclusively for appointment scheduling and service coordination.'
                )
              }
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Legal Policy Modal */}
      {legalModalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setLegalModalTitle(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif font-bold text-stone-900">{legalModalTitle}</h3>
            <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
              {legalModalContent}
            </p>
            <div className="pt-2 text-right">
              <button
                onClick={() => setLegalModalTitle(null)}
                className="px-5 py-2 bg-[#8e512d] text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
