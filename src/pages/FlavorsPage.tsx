import React, { useState, useMemo } from 'react';
import { PageRoute, FlavorCategory } from '../types';
import { FLAVORS } from '../data/mockData';
import { Flame, Snowflake, Sparkles } from 'lucide-react';

interface FlavorsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FlavorsPage: React.FC<FlavorsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fruity', 'Mint', 'Dessert', 'Premium', 'Classic', 'Signature'];

  const filteredFlavors = useMemo(() => {
    if (selectedCategory === 'All') return FLAVORS;
    return FLAVORS.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div id="flavors-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          ARTISANAL MOLASSES & ESSENCES
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Flavor Discovery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Hand-picked organic fruit nectars, arctic mint crystals, and velvet tobacco blends.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] shadow-lg'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flavors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFlavors.map((flavor) => (
          <div
            key={flavor.id}
            className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group"
          >
            <div className="relative h-56 overflow-hidden bg-neutral-900">
              <img
                src={flavor.image}
                alt={flavor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#0a0a0c]/80 backdrop-blur-md text-[#d4af37] text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30">
                {flavor.category}
              </div>
              {flavor.isExclusive && (
                <div className="absolute top-3 right-3 bg-[#d4af37] text-[#0a0a0c] text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
                  Secret Reserve
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-90" />
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold font-serif-luxury text-white group-hover:text-[#f7e7ce] transition">
                    {flavor.name}
                  </h3>
                  <div className="text-sm font-bold text-[#d4af37]">
                    Rs. {flavor.price.toLocaleString()}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                  {flavor.description}
                </p>

                {/* Intensity & Cooling Meters */}
                <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Flavor Intensity
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-1.5 rounded-full ${
                            level <= flavor.intensity ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                      Cooling Frost Level
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-1.5 rounded-full ${
                            level <= flavor.coolingLevel ? 'bg-cyan-400' : 'bg-neutral-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-neutral-400">
                  Recommended Hookah Stem:{' '}
                  <span className="text-[#f7e7ce] font-semibold">{flavor.recommendedHookah}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('hookahs')}
                className="w-full py-2.5 rounded-xl border border-neutral-700 hover:border-[#d4af37] text-xs font-semibold text-white transition hover:bg-[#d4af37]/10"
              >
                Pair With Signature Hookah
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
