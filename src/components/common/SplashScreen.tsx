import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  appName: string;
  artistName: string;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ appName, artistName, onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1600);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#181514] text-white transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-6 max-w-md">
        {/* Elegant Animated Logo Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border border-amber-400/40 flex items-center justify-center bg-gradient-to-tr from-amber-950/40 via-stone-900 to-amber-900/30 shadow-2xl">
            <span className="text-3xl font-serif text-amber-200 tracking-wider">A</span>
          </div>
          <div className="absolute -top-1 -right-1 text-amber-300 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-serif text-amber-100 tracking-wide font-normal uppercase mb-2">
          {appName || 'Ankita Makeup Artist'}
        </h1>

        <p className="text-xs uppercase tracking-[0.25em] text-amber-300/80 mb-8 font-light">
          Luxury Bridal & Editorial Studio • by {artistName || 'Ankita'}
        </p>

        {/* Minimal luxury loading indicator */}
        <div className="w-36 h-0.5 bg-stone-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-200 animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
};
