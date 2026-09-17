import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Sparkles, Calendar } from 'lucide-react';
import { useApp } from '@/src/context/AppContext.tsx';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        id="notification-drawer-panel"
        className="relative w-full max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col z-10 border-l border-[#e8ded7] animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e9dfd8] bg-[#f4ebe4]">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-5 h-5 text-[#8e512d]" />
            <h2 className="text-lg font-serif font-semibold text-[#2e2621]">Studio Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-800 rounded-lg"
            aria-label="Close notifications drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Bell className="w-10 h-10 mx-auto mb-3 stroke-1 text-stone-300" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isBooking = notif.type === 'booking';
              const isPayment = notif.type === 'payment';

              return (
                <div
                  key={notif.id}
                  id={`notif-card-${notif.id}`}
                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-start space-x-3 transition-colors hover:border-[#8e512d]/30"
                >
                  <div className="mt-0.5">
                    {isBooking && <Calendar className="w-5 h-5 text-[#8e512d]" />}
                    {isPayment && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {!isBooking && !isPayment && <Sparkles className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900 leading-snug">{notif.title}</p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-stone-400 mt-2 block">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
