import React, { useEffect, useState, useMemo } from 'react';
import { MemberLayout } from '../../layouts/MemberLayout';
import { firestoreService } from '../../services/firestoreService';
import { Flavor, FlavorCategory } from '../../types';
import {
  Sparkles,
  Flame,
  Snowflake,
  Search,
  X,
  Wind,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES: ('All' | FlavorCategory)[] = [
  'All',
  'Fruity',
  'Mint',
  'Dessert',
  'Premium',
  'Classic',
  'Signature',
];

export const FlavorsCatalogPage: React.FC = () => {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectedFlavor, setInspectedFlavor] = useState<Flavor | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFlavors = async () => {
      setLoading(true);
      try {
        await firestoreService.initializeCatalog();
        const list = await firestoreService.getFlavors();
        if (isMounted) {
          setFlavors(list);
        }
      } catch (err) {
        console.warn('[NOIR Flavors] Error loading flavors:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchFlavors();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFlavors = useMemo(() => {
    return flavors.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category === selectedCategory;
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.recommendedHookah?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [flavors, selectedCategory, searchQuery]);

  return (
    <MemberLayout title="Artisanal Tobacco Essences" subtitle="Cured French Molasses & Pure Arctic Crystals">
      <div className="space-y-8 animate-fadeIn">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#121216]/90 p-4 rounded-2xl border border-neutral-800 shadow-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by flavor notes, mint profiles, or pairing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#d4af37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Pill Nav */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-[#0a0a0c] text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flavors Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500 animate-pulse flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#d4af37] animate-spin" />
            <span>Infusing flavor catalog...</span>
          </div>
        ) : filteredFlavors.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#121216]/60 rounded-3xl border border-neutral-800 p-8">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-300">No tobacco blends matched your current search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-[#d4af37] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlavors.map((flavor) => (
              <div
                key={flavor.id}
                onClick={() => setInspectedFlavor(flavor)}
                className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-black">
                    <img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-wider">
                        {flavor.category}
                      </span>
                      {flavor.isExclusive && (
                        <span className="px-2.5 py-1 rounded-full bg-[#8B0000]/80 backdrop-blur-md border border-rose-500/40 text-white text-[10px] uppercase font-bold tracking-wider">
                          Noir Vault
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono font-bold text-[#d4af37]">
                      Rs. {flavor.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif-luxury font-bold text-xl text-white group-hover:text-[#f7e7ce] transition">
                        {flavor.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {flavor.description}
                      </p>
                    </div>

                    {/* Gauges for Intensity and Cooling */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                      {/* Intensity */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>Intensity</span>
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`w-3.5 h-1.5 rounded-full ${
                                lvl <= (flavor.intensity || 3)
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                  : 'bg-neutral-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Cooling */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Arctic Frost</span>
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`w-3.5 h-1.5 rounded-full ${
                                lvl <= (flavor.coolingLevel || 2)
                                  ? 'bg-gradient-to-r from-cyan-400 to-sky-500'
                                  : 'bg-neutral-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold text-center group-hover:border-[#d4af37]/40 transition">
                    Inspect Pairing Notes
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inspection Drawer / Modal */}
        {inspectedFlavor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setInspectedFlavor(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4 items-center">
                <img
                  src={inspectedFlavor.image}
                  alt={inspectedFlavor.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-neutral-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">
                    {inspectedFlavor.category} Blend
                  </span>
                  <h3 className="text-xl font-serif-luxury font-bold text-white">
                    {inspectedFlavor.name}
                  </h3>
                  <div className="text-sm font-mono font-bold text-[#d4af37]">
                    Rs. {inspectedFlavor.price.toLocaleString()} PKR
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {inspectedFlavor.description}
              </p>

              <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-neutral-800 space-y-3">
                <div className="text-[10px] uppercase tracking-wider text-[#d4af37] font-bold">
                  Sommelier Pairing Suggestion
                </div>
                <div className="flex items-center gap-2 text-xs text-white">
                  <Wind className="w-4 h-4 text-[#d4af37]" />
                  <span>Best paired with: <strong>{inspectedFlavor.recommendedHookah}</strong></span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Flavor Intensity</span>
                  <span className="font-mono text-amber-400 font-bold">{inspectedFlavor.intensity} / 5</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Arctic Cooling Level</span>
                  <span className="font-mono text-cyan-400 font-bold">{inspectedFlavor.coolingLevel} / 5</span>
                </div>
              </div>

              <button
                onClick={() => setInspectedFlavor(null)}
                className="w-full py-3 rounded-2xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
              >
                Close Notes
              </button>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
