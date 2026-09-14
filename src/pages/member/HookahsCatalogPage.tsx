import React, { useEffect, useState, useMemo } from 'react';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useCart } from '../../context/CartContext';
import { firestoreService } from '../../services/firestoreService';
import { Hookah, Flavor } from '../../types';
import {
  Search,
  Wind,
  Sparkles,
  Flame,
  Check,
  X,
  ShoppingBag,
  Plus,
  Minus,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';

const ADD_ON_OPTIONS = [
  { name: 'Fruit Bowl Head (Pineapple/Grapefruit)', price: 500 },
  { name: 'Ice Tip Hose Attachment', price: 300 },
  { name: '24K Gold Leaf Flakes in Base', price: 800 },
  { name: 'Custom LED Ambient Lighting Base', price: 400 },
];

export const HookahsCatalogPage: React.FC = () => {
  const { addHookah } = useCart();
  const [hookahs, setHookahs] = useState<Hookah[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [strengthFilter, setStrengthFilter] = useState<string>('All');
  const [selectedHookah, setSelectedHookah] = useState<Hookah | null>(null);

  // Customization drawer state
  const [chosenFlavor, setChosenFlavor] = useState<string>('');
  const [chosenStrength, setChosenStrength] = useState<string>('Balanced');
  const [chosenBase, setChosenBase] = useState<string>('Ice Chilled Base');
  const [chosenAddOns, setChosenAddOns] = useState<string[]>([]);
  const [chosenQuantity, setChosenQuantity] = useState<number>(1);
  const [addFeedback, setAddFeedback] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        await firestoreService.initializeCatalog();
        const [hList, fList] = await Promise.all([
          firestoreService.getHookahs(),
          firestoreService.getFlavors(),
        ]);
        if (isMounted) {
          setHookahs(hList);
          setFlavors(fList);
          if (fList.length > 0) {
            setChosenFlavor(fList[0].name);
          }
        }
      } catch (err) {
        console.warn('[NOIR Hookahs] Failed to load hookahs:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const openCustomizer = (hookah: Hookah) => {
    setSelectedHookah(hookah);
    setChosenFlavor(hookah.recommendedFlavor || (flavors[0]?.name ?? 'Double Apple Reserve'));
    setChosenStrength(hookah.strength || 'Balanced');
    setChosenBase(hookah.baseOptions?.[0] || 'Ice Chilled Base');
    setChosenAddOns([]);
    setChosenQuantity(1);
    setAddFeedback('');
  };

  const handleToggleAddOn = (name: string) => {
    setChosenAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const calculateCustomPrice = (basePrice: number) => {
    const addOnTotal = chosenAddOns.length * 300;
    return (basePrice + addOnTotal) * chosenQuantity;
  };

  const handleConfirmAddToCart = () => {
    if (!selectedHookah) return;
    addHookah(
      selectedHookah,
      chosenFlavor,
      chosenStrength,
      chosenBase,
      chosenAddOns,
      chosenQuantity
    );
    setAddFeedback(`Added ${chosenQuantity}x ${selectedHookah.name} to your cart!`);
    setTimeout(() => {
      setSelectedHookah(null);
      setAddFeedback('');
    }, 1200);
  };

  const filteredHookahs = useMemo(() => {
    return hookahs.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.features?.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStrength =
        strengthFilter === 'All' || h.strength === strengthFilter;
      return matchesSearch && matchesStrength;
    });
  }, [hookahs, searchQuery, strengthFilter]);

  const strengthOptions = ['All', 'Smooth', 'Balanced', 'Robust', 'Intense'];

  return (
    <MemberLayout title="Signature Hookah Masterpieces" subtitle="Aerospace Engineering & Crystal">
      <div className="space-y-8 animate-fadeIn">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#121216]/90 p-4 rounded-2xl border border-neutral-800 shadow-xl">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hookahs by title, stem alloy, or crystal finish..."
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

          {/* Strength Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold px-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#d4af37]" />
              Strength:
            </span>
            {strengthOptions.map((st) => (
              <button
                key={st}
                onClick={() => setStrengthFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  strengthFilter === st
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'bg-[#0a0a0c] text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Hookahs Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500 animate-pulse flex flex-col items-center gap-3">
            <Wind className="w-8 h-8 text-[#d4af37] animate-spin" />
            <span>Loading crystal hookah collection...</span>
          </div>
        ) : filteredHookahs.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#121216]/60 rounded-3xl border border-neutral-800 p-8">
            <Wind className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-300">No signature hookahs matched your search filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStrengthFilter('All');
              }}
              className="text-xs text-[#d4af37] hover:underline font-semibold"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHookahs.map((hookah) => (
              <div
                key={hookah.id}
                className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-black">
                    <img
                      src={hookah.image}
                      alt={hookah.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-wider">
                        {hookah.strength} Draw
                      </span>
                      {hookah.isPopular && (
                        <span className="px-2.5 py-1 rounded-full bg-[#8B0000]/80 backdrop-blur-md border border-rose-500/40 text-white text-[10px] uppercase font-bold tracking-wider">
                          VIP Favorite
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono font-bold text-[#d4af37]">
                      Rs. {hookah.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif-luxury font-bold text-xl text-white group-hover:text-[#f7e7ce] transition">
                      {hookah.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {hookah.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>Pairing: <strong className="text-white">{hookah.recommendedFlavor}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>Bases: <span className="text-neutral-300">{hookah.baseOptions?.slice(0, 2).join(', ')}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openCustomizer(hookah)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Customize & Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customization & Product Details Modal */}
        {selectedHookah && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedHookah(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Details */}
              <div className="flex gap-4 items-start">
                <img
                  src={selectedHookah.image}
                  alt={selectedHookah.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-neutral-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">
                    Custom Session Preparation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
                    {selectedHookah.name}
                  </h3>
                  <div className="text-base font-bold text-[#d4af37] font-mono">
                    Rs. {selectedHookah.price.toLocaleString()} PKR
                  </div>
                </div>
              </div>

              {/* Features Pill List */}
              <div className="flex flex-wrap gap-1.5">
                {selectedHookah.features?.map((f, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>

              {/* Flavor Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Select Tobacco Molasses Flavor
                </label>
                <select
                  value={chosenFlavor}
                  onChange={(e) => setChosenFlavor(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  {flavors.map((fl) => (
                    <option key={fl.id} value={fl.name}>
                      {fl.name} ({fl.category})
                    </option>
                  ))}
                  {flavors.length === 0 && (
                    <option value="Double Apple Reserve">Double Apple Reserve</option>
                  )}
                </select>
              </div>

              {/* Base Infusion Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  Select Base Fluid / Ice Infusion
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedHookah.baseOptions || ['Ice Chilled Base', 'Citrus Infusion']).map((base) => (
                    <button
                      key={base}
                      type="button"
                      onClick={() => setChosenBase(base)}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition ${
                        chosenBase === base
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                          : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {base}
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Add-Ons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                  VIP Session Enhancements
                </label>
                <div className="space-y-2">
                  {ADD_ON_OPTIONS.map((addon) => {
                    const isSelected = chosenAddOns.includes(addon.name);
                    return (
                      <div
                        key={addon.name}
                        onClick={() => handleToggleAddOn(addon.name)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                          isSelected
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-white'
                            : 'bg-[#0a0a0c] border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-neutral-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-mono text-[#d4af37] font-semibold">
                          +Rs. {addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChosenQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-sm font-bold w-6 text-center text-white">
                    {chosenQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChosenQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Feedback Notice */}
              {addFeedback && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs text-center font-semibold">
                  {addFeedback}
                </div>
              )}

              {/* Action Button with Live Price */}
              <button
                type="button"
                onClick={handleConfirmAddToCart}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-between px-6 shadow-xl transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Member Cart</span>
                </span>
                <span className="font-mono font-extrabold text-sm">
                  Rs. {calculateCustomPrice(selectedHookah.price).toLocaleString()}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
