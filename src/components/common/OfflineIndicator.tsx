import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-stone-900/90 text-amber-200 border border-amber-500/30 px-3.5 py-2 text-xs font-medium shadow-xl backdrop-blur-xs animate-in slide-in-from-bottom-2">
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>Offline Mode — Cached data and offline catalog available</span>
    </div>
  );
};
