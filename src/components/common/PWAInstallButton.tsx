import React, { useState } from 'react';
import { Download, Share, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '@/src/hooks/usePWAInstall.ts';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <>
        <button
          onClick={install}
          id="pwa-install-btn"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full tracking-wide transition-all shadow-xs cursor-pointer ${
            variant === 'nav'
              ? 'bg-[#8e512d] text-white hover:bg-[#743e1f]'
              : 'bg-[#1c1613] text-amber-200 border border-amber-400/40 hover:bg-stone-900'
          } ${className}`}
          title="Install Makeup App on your device"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Install App</span>
        </button>
      </>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-install-ios-btn"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full tracking-wide transition-all border border-stone-300 text-stone-700 hover:bg-stone-50 cursor-pointer ${className}`}
          title="Install on iPhone / iPad"
        >
          <Share className="w-3.5 h-3.5 text-[#8e512d]" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#8e512d]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Install Ankita Makeup Studio
                  </h3>
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
                Install as a lightweight app directly on your iPhone or iPad for 1-tap bookings, offline access, and fast scheduling:
              </p>

              <ol className="space-y-2.5 text-xs text-stone-700 bg-[#faf8f5] p-3.5 rounded-xl border border-stone-200 mb-4 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                  <span>Tap the <strong>Share</strong> button at bottom of Safari.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                  <span>Scroll down & tap <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#8e512d] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">3</span>
                  <span>Tap <strong>"Add"</strong> in top right corner.</span>
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#8e512d] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#743e1f] transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
