import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';

interface WhatsAppButtonProps {
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ customMessage }) => {
  const { settings, generateWhatsAppLink, userProfile, myBookings } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  // Check if there's a recent booking to offer a 1-tap pre-filled message
  const recentBooking = myBookings[0];

  const defaultText = recentBooking
    ? `Hello Ankita!\nName: ${recentBooking.customerName || userProfile?.name || 'Client'}\nService: ${recentBooking.serviceName}\nBooking Date: ${recentBooking.date}\nTime Slot: ${recentBooking.timeSlot}\nBooking ID: ${recentBooking.id}\n\nI would like to discuss my appointment details.`
    : customMessage ||
      `Hello Ankita! I am looking for bridal/party makeup services. Could you please let me know your available slots and package details?`;

  const waUrl = generateWhatsAppLink(defaultText);

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-20 md:bottom-8 right-5 z-40 flex flex-col items-end">
      {/* Interactive Quick Help Tooltip */}
      {showTooltip && (
        <div
          id="whatsapp-chat-preview"
          className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs text-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-semibold text-stone-900">Chat with {settings.artistName || 'Ankita'}</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-stone-400 hover:text-stone-700"
              aria-label="Close message preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-stone-600 mb-3 leading-relaxed">
            Need urgent slot confirmation, customized bridal package, or travel quote? Tap below to open WhatsApp instantly with pre-filled details.
          </p>
          <a
            id="whatsapp-direct-link"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-colors text-center"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>Open WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1fa851] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        title="Chat on WhatsApp"
        aria-label="Chat with Ankita on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      </button>
    </div>
  );
};
