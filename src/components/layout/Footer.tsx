import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { APP_CONFIG } from '../../config/appConfig';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { emailMarketingService } from '../../services/emailMarketingService';
import { analytics } from '../../services/analyticsService';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<{
    msg: string;
    isError: boolean;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await emailMarketingService.subscribe(email);
    setSubscribeStatus({ msg: res.message, isError: !res.success });
    if (res.success) {
      analytics.trackNewsletterSubscribe(email);
      setEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-[#070709] border-t border-[#d4af37]/20 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 bg-[#121216] flex items-center justify-center text-[#d4af37] font-cinzel font-bold text-lg">
                N
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-white">
                  NOIR
                </span>
                <span className="block text-[10px] tracking-[0.3em] uppercase text-[#d4af37] font-semibold">
                  HOOKAH
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm italic">
              “{APP_CONFIG.brand.subTagline}”
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={APP_CONFIG.brand.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition"
                aria-label="NOIR Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.brand.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition"
                aria-label="NOIR Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.brand.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37]/50 transition"
                aria-label="NOIR Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {/* Premium Get the NOIR App CTA */}
            <div className="pt-5 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Take NOIR With You
              </div>
              <button
                id="footer-get-app-btn"
                onClick={() => onNavigate('app-download')}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[#d4af37]/40 bg-gradient-to-r from-[#121216] via-[#1a1a22] to-[#121216] text-[#f7e7ce] hover:border-[#d4af37] hover:bg-[#d4af37]/15 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] text-xs font-bold uppercase tracking-widest transition-all duration-300 group cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform duration-200" />
                <span>GET THE NOIR APP</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {['home', 'menu', 'hookahs', 'flavors', 'experience', 'gallery', 'reservations', 'about', 'contact'].map((page) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate(page as PageRoute)}
                    className="capitalize hover:text-[#f7e7ce] transition duration-200"
                  >
                    {page.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Lounge Location
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{APP_CONFIG.brand.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{APP_CONFIG.brand.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{APP_CONFIG.brand.email}</span>
              </li>
              <li className="flex items-start gap-2 pt-1 border-t border-neutral-900">
                <Clock className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-medium text-neutral-300">Mon–Thu: {APP_CONFIG.brand.openingHours.weekdays}</div>
                  <div className="text-[11px] font-medium text-neutral-300">Fri–Sun: {APP_CONFIG.brand.openingHours.weekends}</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & App Download */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              VIP Newsletter
            </h4>
            <p className="text-xs text-neutral-400">
              Subscribe to receive private invitations to limited-edition flavor drops and VIP events.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121216] border border-neutral-800 rounded-l-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] px-3 py-2 rounded-r-lg font-semibold hover:brightness-110 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribeStatus && (
                <div
                  className={`text-[11px] p-2 rounded ${
                    subscribeStatus.isError ? 'text-rose-400 bg-rose-950/40' : 'text-[#f7e7ce] bg-[#d4af37]/10'
                  }`}
                >
                  {subscribeStatus.msg}
                </div>
              )}
            </form>

            <div className="pt-2 border-t border-neutral-900">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Mobile App
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={APP_CONFIG.mobileApp.androidAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => analytics.trackAppDownloadClick('android')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-800 bg-[#121216] hover:border-[#d4af37]/40 transition text-[11px] text-white"
                >
                  <span>Google Play</span>
                </a>
                <a
                  href={APP_CONFIG.mobileApp.iosAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => analytics.trackAppDownloadClick('ios')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-800 bg-[#121216] hover:border-[#d4af37]/40 transition text-[11px] text-white"
                >
                  <span>App Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} {APP_CONFIG.brand.name}. All Rights Reserved. Crafted for the night.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-neutral-300 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-neutral-300 transition"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#d4af37] transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
