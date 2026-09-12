import React, { useState, useEffect } from 'react';
import { emailMarketingService } from '../../services/emailMarketingService';
import { analytics } from '../../services/analyticsService';
import { X, Mail, Sparkles, Check } from 'lucide-react';

const SHOWN_STORAGE_KEY = 'noir_newsletter_popup_dismissed';

export const NewsletterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ msg: string; success: boolean } | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(SHOWN_STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 7000); // Intelligently prompt after 7 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(SHOWN_STORAGE_KEY, 'true');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await emailMarketingService.subscribe(email);
    setStatus({ msg: res.message, success: res.success });
    if (res.success) {
      analytics.trackNewsletterSubscribe(email);
      setTimeout(() => {
        handleClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full bg-[#121216] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-[#d4af37]/50 bg-[#0a0a0c] flex items-center justify-center text-[#d4af37] mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
            INNER CIRCLE PRIVILEGES
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
            Unlock 10% Off Your First VIP Night
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Subscribe to NOIR Hookah newsletters to receive secret promo codes, limited flavor drop alerts, and priority table reservations.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="Enter your VIP email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
            >
              Claim VIP Privileges
            </button>
          </form>

          {status && (
            <div
              className={`p-3 rounded-lg text-xs mt-3 flex items-center justify-center gap-2 ${
                status.success
                  ? 'bg-[#d4af37]/15 text-[#f7e7ce] border border-[#d4af37]/30'
                  : 'bg-rose-950/50 text-rose-300 border border-rose-800'
              }`}
            >
              {status.success && <Check className="w-4 h-4 shrink-0 text-[#d4af37]" />}
              <span>{status.msg}</span>
            </div>
          )}

          <div className="text-[10px] text-neutral-500 pt-1">
            Use code <strong className="text-[#d4af37]">NOIRVIP10</strong> at checkout for instant discount.
          </div>
        </div>
      </div>
    </div>
  );
};
