import React, { useState } from 'react';
import { PageRoute, Hookah } from '../types';
import { SIGNATURE_HOOKAHS, FLAVORS } from '../data/mockData';
import { cartService } from '../services/cartService';
import { Sparkles, Check, Flame, Shield, ChevronRight } from 'lucide-react';

interface HookahsPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
  selectedHookah: Hookah | null;
  onSelectHookah: (hookah: Hookah | null) => void;
}

export const HookahsPage: React.FC<HookahsPageProps> = ({
  onNavigate,
  onOpenCart,
  selectedHookah,
  onSelectHookah,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<string>(FLAVORS[0].name);
  const [selectedStrength, setSelectedStrength] = useState<string>('Balanced');
  const [selectedBase, setSelectedBase] = useState<string>('Ice Chilled Base');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const addOnOptions = [
    { name: 'Fruit Bowl Head (Pineapple/Grapefruit)', price: 500 },
    { name: 'Ice Tip Hose Attachment', price: 300 },
    { name: '24K Gold Leaf Flakes in Base', price: 800 },
    { name: 'Custom LED Ambient Lighting Base', price: 400 },
  ];

  const handleToggleAddOn = (addOnName: string) => {
    if (selectedAddOns.includes(addOnName)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a !== addOnName));
    } else {
      setSelectedAddOns([...selectedAddOns, addOnName]);
    }
  };

  const handleAddToCart = (hookah: Hookah) => {
    cartService.addHookahToCart(
      hookah,
      selectedFlavor,
      selectedStrength,
      selectedBase,
      selectedAddOns,
      1
    );
    onOpenCart();
  };

  return (
    <div id="hookahs-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          PRECISION ENGINEERING & LUXURY CRYSTAL
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          Signature Hookahs
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Hand-blown bohemian crystal, aerospace carbon stems, and whisper-quiet airflow diffusers.
        </p>
      </div>

      {/* Detail Experience Drawer / Modal if selected */}
      {selectedHookah ? (
        <div className="bg-[#121216] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
          <button
            onClick={() => onSelectHookah(null)}
            className="text-xs uppercase tracking-widest text-[#d4af37] flex items-center gap-1 hover:text-[#f7e7ce]"
          >
            ← Back to All Hookahs
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-neutral-800 bg-black relative">
              <img
                src={selectedHookah.image}
                alt={selectedHookah.name}
                className="w-full h-96 sm:h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl text-xs space-y-1">
                <div className="font-bold text-white">{selectedHookah.name} Specification</div>
                <div className="text-neutral-300">{selectedHookah.features.join(' • ')}</div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 text-neutral-200">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  MASTERPIECE DETAIL
                </span>
                <h2 className="text-3xl font-bold font-serif-luxury text-white mt-1">
                  {selectedHookah.name}
                </h2>
                <div className="text-2xl font-bold text-[#d4af37] mt-2">
                  Rs. {selectedHookah.price.toLocaleString()}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                  {selectedHookah.description}
                </p>
              </div>

              {/* Flavor Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">
                  1. Select Primary Flavor Blend:
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {FLAVORS.map((fl) => (
                    <option key={fl.id} value={fl.name}>
                      {fl.name} ({fl.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Option Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">
                  2. Select Base Infusion:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedHookah.baseOptions.map((base) => (
                    <button
                      key={base}
                      onClick={() => setSelectedBase(base)}
                      className={`px-3 py-2 rounded-xl text-xs text-left border transition ${
                        selectedBase === base
                          ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f7e7ce] font-semibold'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {base}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white uppercase tracking-wider">
                  3. Premium Add-ons:
                </label>
                <div className="space-y-2">
                  {addOnOptions.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    return (
                      <div
                        key={addon.name}
                        onClick={() => handleToggleAddOn(addon.name)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition ${
                          isChecked
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white'
                            : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'bg-[#d4af37] border-[#d4af37]' : 'border-neutral-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 text-[#0a0a0c]" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="text-[#d4af37] font-semibold">+Rs. {addon.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(selectedHookah)}
                className="w-full py-4 bg-gradient-to-r from-[#d4af37] via-[#e6c687] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 transition"
              >
                Add Custom Hookah Session to Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Catalog Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_HOOKAHS.map((hookah) => (
            <div
              key={hookah.id}
              className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/50 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group"
            >
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={hookah.image}
                  alt={hookah.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
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

                  <div className="mt-3 text-[11px] text-neutral-300">
                    Recommended Flavor: <span className="text-[#f7e7ce]">{hookah.recommendedFlavor}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => onSelectHookah(hookah)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-700 hover:border-[#d4af37] text-xs font-semibold text-white transition hover:bg-[#d4af37]/10"
                  >
                    Customize & Details
                  </button>
                  <button
                    onClick={() => {
                      cartService.addHookahToCart(
                        hookah,
                        hookah.recommendedFlavor,
                        hookah.strength,
                        hookah.baseOptions[0]
                      );
                      onOpenCart();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] text-xs font-bold uppercase tracking-wider hover:brightness-110"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
