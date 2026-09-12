import React from 'react';
import { PageRoute } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { loungeInteriorImg, royalHookahImg } from '../data/mockData';
import { Sparkles, Shield, Award, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          OUR HERITAGE & PHILOSOPHY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Crafted for the Night
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          The story behind Karachi’s most exclusive luxury Sheesha sanctuary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
            Redefining Hospitality Through Atmospheric Elegance
          </h2>
          <p>
            Founded with a singular vision: to liberate the hookah experience from noisy cafes and elevate it into a haute-couture night sanctuary.
          </p>
          <p>
            At NOIR HOOKAH, every detail is engineered with uncompromising luxury. From our custom-designed double-wall vacuum-insulated bohemian crystal stems to our proprietary organic fruit molasses infused with rare essential oils.
          </p>
          <div className="p-4 rounded-xl border border-[#d4af37]/30 bg-[#121216] italic text-[#f7e7ce]">
            “We don’t just serve hookahs. We curate atmospheric luxury for those who demand the finest moments of the night.”
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-neutral-800 relative shadow-2xl">
          <img
            src={loungeInteriorImg}
            alt="NOIR Lounge Story"
            className="w-full h-96 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};
