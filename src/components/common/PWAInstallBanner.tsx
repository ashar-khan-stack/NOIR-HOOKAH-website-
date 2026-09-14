import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Sparkles, Smartphone } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install, dismiss } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div
        role="region"
        aria-label="App Installation"
        className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] p-4 rounded-3xl bg-gradient-to-br from-[#16161e] via-[#121216] to-[#0a0a0c] border border-[#d4af37]/40 shadow-2xl backdrop-blur-md animate-fadeIn text-xs"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#aa820a] p-0.5 shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center text-[#d4af37]">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury font-bold text-white text-sm">
                  NOIR HOOKAH App
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] text-[9px] uppercase font-bold tracking-wider">
                  VIP PWA
                </span>
              </div>
              <button
                onClick={dismiss}
                aria-label="Dismiss installation prompt"
                className="p-1 text-neutral-400 hover:text-white transition rounded-lg hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Install the NOIR executive app to your home screen for rapid table dispatch, lounge reservations, and tasting alerts.
            </p>

            <div className="pt-2 flex items-center gap-2">
              {isInstallable && (
                <button
                  onClick={install}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              )}

              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 border border-[#d4af37]/50 hover:bg-neutral-800 text-[#f7e7ce] font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Add to Home Screen</span>
                </button>
              )}

              <button
                onClick={dismiss}
                className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-xs transition"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Safari Guidance Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-[#d4af37]">
                <Sparkles className="w-5 h-5" />
                <h3 id="ios-modal-title" className="font-serif-luxury font-bold text-white text-base">
                  Install on iOS / Safari
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                aria-label="Close dialog"
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <div className="font-semibold text-white">Tap Share Button</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Tap the <strong className="text-white">Share</strong> icon <Share2 className="w-3 h-3 inline text-[#d4af37]" /> at the bottom or top of your Safari browser bar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <div className="font-semibold text-white">Select "Add to Home Screen"</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Scroll down through the share options and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="w-3 h-3 inline text-[#d4af37]" />.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f7e7ce] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <div className="font-semibold text-white">Confirm "Add"</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Tap <strong className="text-white">Add</strong> in the top right corner. The NOIR icon will now launch directly from your home screen in standalone mode.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs shadow-lg transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
