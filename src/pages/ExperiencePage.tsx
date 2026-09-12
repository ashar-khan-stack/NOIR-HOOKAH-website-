import React from 'react';
import { PageRoute } from '../types';
import { loungeInteriorImg, royalHookahImg } from '../data/mockData';
import {
  Flame,
  Wine,
  Users,
  Music,
  Sparkles,
  Calendar,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface ExperiencePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ onNavigate }) => {
  return (
    <div id="experience-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          THE ART OF HOSPITALITY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          More Than Hookah
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          A nocturnal sanctuary built around bespoke service, acoustic intimacy, and private luxury.
        </p>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: 'Hand-Blown German Glass',
            subtitle: 'Acoustic & Airflow Engineering',
            desc: 'Each hookah vessel in our lounge is crafted from heavy bohemian lead-free crystal designed specifically to optimize smoke density and temperature retention.',
            img: royalHookahImg,
          },
          {
            title: 'Private VIP Suites',
            subtitle: 'Sound-Isolated Enclaves',
            desc: 'Custom leather banquettes, climate control, and dedicated sommelier call buttons for undisturbed executive conversations or intimate group celebrations.',
            img: loungeInteriorImg,
          },
          {
            title: 'Zero-Proof Mixology',
            subtitle: 'Hickory Smoked & Botanical Elixirs',
            desc: 'Our mixology bar prepares non-alcoholic zero-proof bourbon mocktails, sparkling gold-dust elixirs, and fresh pomegranate saffron mists.',
            img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#121216] border border-neutral-800 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between"
          >
            <div className="relative h-60 overflow-hidden bg-neutral-900">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-90" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                {item.subtitle}
              </span>
              <h3 className="text-xl font-bold font-serif-luxury text-white">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* VIP Seating Tiers */}
      <div className="bg-[#0e0e12] border border-[#d4af37]/30 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
            TABLE SEATING OPTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-luxury text-white">
            Choose Your Atmosphere
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              tier: 'Standard Seating',
              capacity: '2–4 Guests',
              features: ['Main Lounge Atmosphere', 'Full Menu Access', 'Ambient DJ Music'],
            },
            {
              tier: 'Premium Booths',
              capacity: '4–6 Guests',
              features: ['Elevated Plush Seating', 'Priority Service', 'Direct View of Live Music'],
            },
            {
              tier: 'VIP Lounge Table',
              capacity: '6–8 Guests',
              features: ['Curated Tobacco Reserve', 'Dedicated Table Host', 'Complimentary Teas'],
            },
            {
              tier: 'Private Enclosed Room',
              capacity: '8–14 Guests',
              features: ['Sound-Proof Enclosure', 'Private Sommelier', 'Custom Mood Controls'],
            },
          ].map((option, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#121216] border border-neutral-800 hover:border-[#d4af37] space-y-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                  {option.capacity}
                </span>
                <h3 className="text-lg font-bold text-white font-serif-luxury mt-1">
                  {option.tier}
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-neutral-300">
                  {option.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate('reservations')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider hover:brightness-110"
              >
                Reserve Table
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
