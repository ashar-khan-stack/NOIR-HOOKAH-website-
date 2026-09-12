import React from 'react';
import { PageRoute } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { appMockupImg } from '../data/mockData';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { analytics } from '../services/analyticsService';
import { Smartphone, Download, Calendar, Bell, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface AppDownloadPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AppDownloadPage: React.FC<AppDownloadPageProps> = () => {
  return (
    <div id="app-download-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          NATIVE & PWA MOBILE APP EXPERIENCE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Get the NOIR App
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          The official mobile application for instant table reservations, live menu ordering, and VIP reward tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Features */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
              Unrivaled Digital Convenience in Your Pocket
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Designed specifically for Android and iOS devices, our application combines sleek luxury aesthetics with lightning-fast offline support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Calendar className="w-5 h-5 text-[#d4af37]" />,
                title: 'Instant Table Reservations',
                desc: 'Book VIP tables, select seating preferences, and receive real-time SMS confirmations.',
              },
              {
                icon: <Bell className="w-5 h-5 text-[#d4af37]" />,
                title: 'Secret Drop Alerts',
                desc: 'Receive push notifications when rare tobacco shipments or guest mixologist nights launch.',
              },
              {
                icon: <Award className="w-5 h-5 text-[#d4af37]" />,
                title: 'VIP Loyalty Rewards',
                desc: 'Earn 10 points for every Rs. 100 spent. Redeem points for complimentary refills and drinks.',
              },
              {
                icon: <Sparkles className="w-5 h-5 text-[#d4af37]" />,
                title: 'Digital Menu & Pre-Order',
                desc: 'Browse high-res hookah specs, flavor notes, and submit table orders directly to the lounge.',
              },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#121216] border border-neutral-800 space-y-2">
                <div className="p-2 rounded-lg bg-neutral-900 w-fit">{f.icon}</div>
                <h3 className="text-sm font-bold text-white font-serif-luxury">{f.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-neutral-800">
            <a
              href={APP_CONFIG.mobileApp.androidAppUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => analytics.trackAppDownloadClick('android')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:brightness-110"
            >
              <Smartphone className="w-4 h-4" />
              <span>Android APK / Play Store</span>
            </a>

            <a
              href={APP_CONFIG.mobileApp.iosAppUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => analytics.trackAppDownloadClick('ios')}
              className="px-6 py-3 rounded-xl bg-[#121216] border border-[#d4af37]/40 text-[#f7e7ce] font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:border-[#d4af37]"
            >
              <Smartphone className="w-4 h-4 text-[#d4af37]" />
              <span>iOS App Store</span>
            </a>

            <PWAInstallButton variant="hero" />
          </div>
        </div>

        {/* Right 3D Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative max-w-sm rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-[#121216]">
            <img
              src={appMockupImg}
              alt="NOIR Mobile App Display"
              className="w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
