import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'hero' | 'card' }> = ({
  variant = 'card',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-full font-semibold transition shadow-lg ${
          variant === 'nav'
            ? 'px-3 py-1.5 bg-[#d4af37] text-[#0a0a0c] text-xs hover:brightness-110'
            : 'px-5 py-2.5 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] text-xs uppercase tracking-widest hover:brightness-110'
        }`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/40 bg-[#121216] text-[#f7e7ce] text-xs font-semibold hover:border-[#d4af37] transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#121216] border border-[#d4af37]/40 p-6 shadow-2xl text-neutral-200">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                <h3 className="text-base font-bold text-white font-cinzel">Install on iPhone</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-neutral-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
                1. Tap the <strong className="text-[#d4af37]">Share</strong> icon at the bottom of Safari browser toolbar.<br />
                2. Scroll down and tap <strong className="text-[#d4af37]">Add to Home Screen</strong>.<br />
                3. Enjoy instant offline access to NOIR HOOKAH.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#d4af37] py-2.5 text-xs font-bold text-[#0a0a0c] uppercase tracking-wider"
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
