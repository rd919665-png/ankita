import React, { useState, useEffect } from 'react';
import { Download, Share, X, Sparkles, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/src/hooks/usePWAInstall.ts';

export const MobileInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(true);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Only check after mount to prevent hydration mismatch
    const lastDismissed = localStorage.getItem('ankita_pwa_banner_dismissed');
    if (lastDismissed) {
      const parsedTime = parseInt(lastDismissed, 10);
      // Re-show after 3 days
      if (Date.now() - parsedTime < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    }
    setDismissed(false);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('ankita_pwa_banner_dismissed', Date.now().toString());
  };

  // If already installed or dismissed, do not show
  if (isInstalled || dismissed) {
    return null;
  }

  // Only show on mobile screens (sm or below) when installable or on iOS
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <div
        id="mobile-native-app-banner"
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1c1613] text-white px-3.5 py-2.5 shadow-xl border-b border-amber-500/30 flex items-center justify-between animate-in slide-in-from-top-4 duration-300"
      >
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a34b] to-[#8e512d] p-0.5 shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#1c1613] flex items-center justify-center text-amber-300 font-serif font-bold text-sm">
              A
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white tracking-wide truncate">
                Ankita Makeup Studio
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-semibold uppercase tracking-wider">
                App
              </span>
            </div>
            <p className="text-[10.5px] text-stone-300 truncate">
              {isIOS ? 'Install on iPhone home screen' : '1-tap install for faster bookings'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {isInstallable ? (
            <button
              id="mobile-banner-install-btn"
              onClick={install}
              className="px-3 py-1.5 bg-gradient-to-r from-[#d4a34b] to-[#8e512d] hover:from-[#b8832a] hover:to-[#743e1f] text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-200" />
              <span>Install</span>
            </button>
          ) : isIOS ? (
            <button
              id="mobile-banner-ios-guide-btn"
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#d4a34b] to-[#8e512d] hover:from-[#b8832a] hover:to-[#743e1f] text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Share className="w-3.5 h-3.5 text-amber-200" />
              <span>Install</span>
            </button>
          ) : null}

          <button
            onClick={handleDismiss}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#8e512d] flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900 leading-tight">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-[11px] text-stone-500">Run as native full-screen app</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Follow these simple steps in Safari to add Ankita Makeup Studio to your phone home screen:
            </p>

            <ol className="space-y-3 text-xs text-stone-700 bg-[#faf8f5] p-3.5 rounded-xl border border-stone-200 mb-5 font-medium">
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  1
                </span>
                <span>
                  Tap the <strong>Share</strong> icon in Safari toolbar (bottom of screen).
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  2
                </span>
                <span>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>.
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                  3
                </span>
                <span>
                  Tap <strong>"Add"</strong> at the top right to complete.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#8e512d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#743e1f] transition active:scale-98 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
