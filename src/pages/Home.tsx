import React, { useState } from 'react';
import { PageRoute, Hookah } from '../types';
import { SIGNATURE_HOOKAHS, FLAVORS, heroHookahImg, loungeInteriorImg, appMockupImg } from '../data/mockData';
import { APP_CONFIG } from '../config/appConfig';
import { cartService } from '../services/cartService';
import { analytics } from '../services/analyticsService';
import { SEOHead } from '../components/common/SEOHead';
import {
  Calendar,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Flame,
  Wine,
  Users,
  Music,
  ShieldAlert,
  Smartphone,
  Star,
  CheckCircle,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
  onSelectHookahDetail: (hookah: Hookah) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCart, onSelectHookahDetail }) => {
  const [activeFlavorFilter, setActiveFlavorFilter] = useState('All');

  const handleExploreClick = () => {
    analytics.trackPageView('home_explore_menu');
    onNavigate('menu');
  };

  const handleReserveClick = () => {
    analytics.trackPageView('home_reserve_table');
    onNavigate('reservations');
  };

  return (
    <div id="home-page" className="space-y-24 pb-16">
      <SEOHead
        title="NOIR HOOKAH — Elevate the Night | Ultra Luxury Hookah Lounge"
        description="Experience Pakistan's premier 24K Gold Hookah & Artisanal Sheesha lounge. Hand-blown bohemian crystal hookahs, rare tobacco blends, and VIP suites."
      />

      {/* 1. CINEMATIC HERO SECTION */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Ambient Dark Background & Smoke Effect */}
        <div className="absolute inset-0 bg-[#0a0a0c] z-0" />
        <div className="absolute inset-0 gold-radial-glow opacity-60 z-0 pointer-events-none" />

        {/* Floating Atmospheric Smoke Clouds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl animate-smoke pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-3xl animate-smoke pointer-events-none" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#121216]/80 text-[#f7e7ce] text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Karachi’s Premier Sheesha Destination</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold font-serif-luxury tracking-tight text-white leading-[1.1]">
              NOIR HOOKAH
              <span className="block text-gold-gradient font-cinzel text-2xl sm:text-4xl mt-2 tracking-[0.2em]">
                Elevate the Night.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              An elevated hookah experience crafted for unforgettable nights. Indulge in artisanal hand-blown glass hookahs, rare tobacco blends, and dark VIP lounge luxury.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-explore-menu-btn"
                onClick={handleExploreClick}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-2xl hover:brightness-110 active:scale-95 transition duration-200"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Menu</span>
              </button>

              <button
                id="hero-reserve-table-btn"
                onClick={handleReserveClick}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#121216] border border-[#d4af37]/40 text-[#f7e7ce] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-xl hover:bg-[#d4af37]/10 hover:border-[#d4af37] active:scale-95 transition duration-200"
              >
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>Reserve a Table</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-lg font-bold font-cinzel text-white">25+</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">Rare Flavors</div>
              </div>
              <div>
                <div className="text-lg font-bold font-cinzel text-white">4.9★</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">VIP Rating</div>
              </div>
              <div>
                <div className="text-lg font-bold font-cinzel text-white">Private</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">VIP Suites</div>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Realistic 3D Hookah Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#121216] group">
              <img
                src={heroHookahImg}
                alt="NOIR Luxury 3D Hookah Render"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel text-left">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  Featured Masterpiece
                </span>
                <div className="text-base font-bold text-white font-serif-luxury mt-0.5">
                  Obsidian Crystal Edition
                </div>
                <div className="text-xs text-[#f7e7ce] mt-1 font-semibold">
                  Rs. 3,500 <span className="text-neutral-400 text-[11px] font-normal">/ Session</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-500 animate-bounce">
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll Down</span>
          <ChevronDown className="w-4 h-4 text-[#d4af37]" />
        </div>
      </section>

      {/* 2. SIGNATURE HOOKAHS SHOWCASE */}
      <section id="signature-hookahs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
            EXQUISITE COLLECTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
            Signature Hookahs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 italic">
            “Crafted for an elevated experience.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_HOOKAHS.map((hookah) => (
            <div
              key={hookah.id}
              className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/50 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group transition duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={hookah.image}
                  alt={hookah.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                {hookah.isPopular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
                    VIP Choice
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold font-serif-luxury text-white group-hover:text-[#f7e7ce] transition">
                      {hookah.name}
                    </h3>
                    <div className="text-base font-bold text-[#d4af37]">
                      Rs. {hookah.price.toLocaleString()}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {hookah.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-300 space-y-1">
                    <div>
                      <span className="text-neutral-500">Pairing:</span>{' '}
                      <span className="text-[#f7e7ce] font-medium">{hookah.recommendedFlavor}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Draw Strength:</span>{' '}
                      <span className="text-neutral-200 font-medium">{hookah.strength}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => onSelectHookahDetail(hookah)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-700 hover:border-[#d4af37] text-xs font-semibold text-white transition hover:bg-[#d4af37]/10"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      cartService.addHookahToCart(
                        hookah,
                        hookah.recommendedFlavor,
                        hookah.strength,
                        hookah.baseOptions[0] || 'Ice Chilled Base'
                      );
                      onOpenCart();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPERIENCE SECTION: MORE THAN HOOKAH */}
      <section id="experience-section" className="bg-[#0e0e12] py-20 border-y border-[#d4af37]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              HOSPITALITY PILLARS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
              More Than Hookah.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              An immersive multi-sensory journey designed for Karachi’s elite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame className="w-6 h-6 text-[#d4af37]" />,
                title: 'Premium Hookahs',
                desc: 'Imported German glass and aerospace titanium stems for silky smooth draw and dense cloud production.',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#d4af37]" />,
                title: 'Curated Flavors',
                desc: 'Exclusive hand-mixed tobacco molasses infused with natural fruit nectars and Damascus rose oils.',
              },
              {
                icon: <Wine className="w-6 h-6 text-[#d4af37]" />,
                title: 'Luxury Atmosphere',
                desc: 'Atmospheric mood lighting, custom leather plush booths, and soundscapes curated by resident DJs.',
              },
              {
                icon: <Users className="w-6 h-6 text-[#d4af37]" />,
                title: 'Private VIP Seating',
                desc: 'Sound-isolated private suites with dedicated hookah sommelier service and bespoke seating.',
              },
              {
                icon: <Wine className="w-6 h-6 text-[#d4af37]" />,
                title: 'Signature Drinks',
                desc: 'Zero-proof mixology drinks, smoked old fashioneds, and artisanal white needle teas.',
              },
              {
                icon: <Music className="w-6 h-6 text-[#d4af37]" />,
                title: 'Live Entertainment',
                desc: 'Deep house acoustics, live saxophone sessions, and weekend ambient soundscapes.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 space-y-3 transition duration-300"
              >
                <div className="p-3 rounded-xl bg-[#181820] w-fit border border-neutral-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white font-serif-luxury">{feature.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE NOIR VIP EXPERIENCE LOUNGE */}
      <section id="vip-lounge-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#121216]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#f7e7ce] text-[10px] font-semibold uppercase tracking-widest border border-[#d4af37]/30">
                <Star className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>EXCLUSIVITY AT ITS PEAK</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white leading-tight">
                The Noir Experience
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Step into a world of shadowed luxury. Black marble tables, gold leaf accents, and ambient smoke clouds frame a night designed specifically for discerning guests.
              </p>

              <ul className="space-y-3 text-xs text-neutral-300">
                {[
                  'Private VIP Rooms with custom climate controls',
                  'Personalized Hookah Sommelier & Table Service',
                  'Exclusive Off-Menu Tobacco Reserve blends',
                  'Direct In-App Table Ordering & Priority Reservations',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  id="explore-vip-btn"
                  onClick={() => onNavigate('experience')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg hover:brightness-110 transition"
                >
                  <span>Explore VIP Lounge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-80 lg:h-full relative min-h-[380px]">
              <img
                src={loungeInteriorImg}
                alt="NOIR VIP Lounge Suite"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121216] via-transparent to-transparent hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. GET THE APP BANNER */}
      <section id="home-app-download-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#121218] via-[#181822] to-[#0e0e14] border border-[#d4af37]/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
              UNIFIED DIGITAL ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
              NOIR, Wherever You Go.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              Reserve tables, explore the menu, manage your VIP profile and stay connected with NOIR HOOKAH directly from your smartphone.
            </p>

            <div className="pt-3 flex flex-wrap gap-4">
              <a
                href={APP_CONFIG.mobileApp.androidAppUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => analytics.trackAppDownloadClick('android')}
                className="px-6 py-3 rounded-xl bg-neutral-900 border border-[#d4af37]/40 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#d4af37] transition shadow-lg"
              >
                <Smartphone className="w-4 h-4 text-[#d4af37]" />
                <div>
                  <div className="text-[9px] uppercase text-neutral-400">Download on</div>
                  <div className="text-xs font-bold">Google Play</div>
                </div>
              </a>

              <a
                href={APP_CONFIG.mobileApp.iosAppUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => analytics.trackAppDownloadClick('ios')}
                className="px-6 py-3 rounded-xl bg-neutral-900 border border-[#d4af37]/40 text-white font-semibold text-xs flex items-center gap-2 hover:border-[#d4af37] transition shadow-lg"
              >
                <Smartphone className="w-4 h-4 text-[#d4af37]" />
                <div>
                  <div className="text-[9px] uppercase text-neutral-400">Download on</div>
                  <div className="text-xs font-bold">App Store</div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <img
              src={appMockupImg}
              alt="NOIR HOOKAH Smartphone App Mockup"
              className="w-full max-w-sm rounded-2xl border border-[#d4af37]/30 shadow-2xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
