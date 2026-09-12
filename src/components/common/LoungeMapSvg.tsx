import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ShieldCheck, Car } from 'lucide-react';

export const LoungeMapSvg: React.FC = () => {
  const [activeSpot, setActiveSpot] = useState<string>('main');

  return (
    <div className="bg-[#0e0e12] border border-[#d4af37]/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37]">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif-luxury">
              Interactive Lounge Map & Valet Drop
            </h3>
            <span className="text-[10px] text-neutral-400">
              Gulberg Executive Block • Coordinates: 31.5204° N, 74.3587° E
            </span>
          </div>
        </div>

        <div className="flex gap-1.5 text-[10px]">
          <button
            onClick={() => setActiveSpot('main')}
            className={`px-3 py-1 rounded-lg border transition ${
              activeSpot === 'main'
                ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            VIP Main Gate
          </button>
          <button
            onClick={() => setActiveSpot('valet')}
            className={`px-3 py-1 rounded-lg border transition ${
              activeSpot === 'valet'
                ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            Valet Drop
          </button>
          <button
            onClick={() => setActiveSpot('soundproof')}
            className={`px-3 py-1 rounded-lg border transition ${
              activeSpot === 'soundproof'
                ? 'bg-[#d4af37] text-black font-bold border-[#d4af37]'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            Private Suite
          </button>
        </div>
      </div>

      {/* Styled Dark Mode Map SVG Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-[#070709] border border-neutral-800/80 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full object-cover opacity-90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="goldPulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#d4af37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="800" y2="400">
              <stop offset="0%" stopColor="#1a1a22" />
              <stop offset="100%" stopColor="#121218" />
            </linearGradient>
          </defs>

          {/* Map Grid / Topography lines */}
          <path d="M0 50 H800 M0 100 H800 M0 150 H800 M0 200 H800 M0 250 H800 M0 300 H800 M0 350 H800" stroke="#1c1c24" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M100 0 V400 M200 0 V400 M300 0 V400 M400 0 V400 M500 0 V400 M600 0 V400 M700 0 V400" stroke="#1c1c24" strokeWidth="1" strokeDasharray="4 4" />

          {/* Main Boulevard / Roads */}
          <rect x="0" y="180" width="800" height="40" fill="url(#roadGrad)" stroke="#2a2a35" strokeWidth="2" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="12 12" opacity="0.4" />

          <rect x="360" y="0" width="40" height="400" fill="url(#roadGrad)" stroke="#2a2a35" strokeWidth="2" />
          <line x1="380" y1="0" x2="380" y2="400" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="12 12" opacity="0.4" />

          {/* Neighboring City Blocks */}
          <rect x="80" y="40" width="240" height="110" rx="12" fill="#121218" stroke="#22222e" />
          <text x="200" y="100" fill="#4a4a5a" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Executive Financial District</text>

          <rect x="440" y="40" width="280" height="110" rx="12" fill="#121218" stroke="#22222e" />
          <text x="580" y="100" fill="#4a4a5a" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Luxury Retail Galleria</text>

          <rect x="80" y="250" width="240" height="110" rx="12" fill="#121218" stroke="#22222e" />
          <text x="200" y="310" fill="#4a4a5a" fontSize="11" textAnchor="middle" fontFamily="sans-serif">Boutique Hotel Plaza</text>

          {/* NOIR HOOKAH Building Block */}
          <rect x="440" y="240" width="280" height="120" rx="16" fill="#161620" stroke="#d4af37" strokeWidth="2" />
          <rect x="450" y="250" width="260" height="100" rx="12" fill="#0d0d12" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 2" opacity="0.8" />
          <text x="580" y="295" fill="#f7e7ce" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="serif">NOIR HOOKAH</text>
          <text x="580" y="315" fill="#d4af37" fontSize="10" textAnchor="middle" fontFamily="sans-serif">ULTRA LUXURY LOUNGE</text>

          {/* Radial Glow Pulse around NOIR HOOKAH */}
          <circle cx="580" cy="300" r="90" fill="url(#goldPulseGrad)" />

          {/* Map Pins / Interactive Spots */}
          {/* Main VIP Entrance */}
          <g onClick={() => setActiveSpot('main')} className="cursor-pointer group">
            <circle cx="440" cy="300" r="14" fill="#d4af37" opacity="0.3" className="animate-ping" />
            <circle cx="440" cy="300" r="8" fill="#d4af37" stroke="#000" strokeWidth="2" />
            <text x="440" y="330" fill="#d4af37" fontSize="10" fontWeight="bold" textAnchor="middle">VIP Entrance</text>
          </g>

          {/* Valet Drop Off */}
          <g onClick={() => setActiveSpot('valet')} className="cursor-pointer group">
            <circle cx="380" cy="220" r="12" fill="#3b82f6" opacity="0.3" className="animate-ping" />
            <circle cx="380" cy="220" r="7" fill="#3b82f6" stroke="#000" strokeWidth="2" />
            <text x="380" y="245" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">Valet Drop</text>
          </g>

          {/* Private Soundproof Suite */}
          <g onClick={() => setActiveSpot('soundproof')} className="cursor-pointer group">
            <circle cx="680" cy="270" r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
            <circle cx="680" cy="270" r="7" fill="#10b981" stroke="#000" strokeWidth="2" />
            <text x="680" y="255" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">Private Chamber</text>
          </g>
        </svg>

        {/* Overlay Details Box */}
        <div className="absolute bottom-3 left-3 right-3 bg-[#121218]/90 backdrop-blur-md border border-[#d4af37]/30 p-3 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <div>
              <span className="font-bold text-white block">
                {activeSpot === 'main' && 'Main Gate & VIP Host Stand'}
                {activeSpot === 'valet' && '24/7 Complimentary Valet Drop-off'}
                {activeSpot === 'soundproof' && 'Soundproof Acoustic Executive Suites'}
              </span>
              <span className="text-[10px] text-neutral-400">
                {activeSpot === 'main' && '104 Boulevard Luxury Way, Executive Block, Gulberg III'}
                {activeSpot === 'valet' && 'Drive directly to northern gate for white-glove valet service'}
                {activeSpot === 'soundproof' && 'Private elevator access available for Black VIP Members'}
              </span>
            </div>
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 hover:brightness-110"
          >
            <Navigation className="w-3 h-3" />
            <span>Navigate</span>
          </a>
        </div>
      </div>
    </div>
  );
};
