import React, { useState, useMemo } from 'react';
import { PageRoute, MenuItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import { cartService } from '../services/cartService';
import { SEOHead } from '../components/common/SEOHead';
import { Search, Filter, Plus, Check, Sparkles, UtensilsCrossed } from 'lucide-react';

interface MenuPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenCart: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate, onOpenCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const categories = ['All', 'Craft Beverages', 'Artisanal Tea', 'Gourmet Bites', 'VIP Packages'];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (item: MenuItem) => {
    cartService.addMenuItemToCart(item, 1);
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 1500);
  };

  return (
    <div id="menu-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SEOHead
        title="Artisanal Menu & Craft Beverages | NOIR HOOKAH"
        description="Explore NOIR HOOKAH's gourmet pairing menu, artisanal teas, craft mocktails, and VIP package selections."
      />

      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          REAL-TIME GASTRONOMY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          The Noir Menu
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Handcrafted zero-proof beverages, artisanal teas, and gourmet pairing bites.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#121216] border border-neutral-800 p-4 rounded-2xl glass-panel">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search drinks & bites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-neutral-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const isAdded = addedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group"
            >
              <div className="relative h-52 overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => setSelectedItem(item)}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#0a0a0c]/80 backdrop-blur-md text-[#d4af37] text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-[#d4af37]/30">
                  {item.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      onClick={() => setSelectedItem(item)}
                      className="text-lg font-bold font-serif-luxury text-white hover:text-[#f7e7ce] cursor-pointer transition"
                    >
                      {item.name}
                    </h3>
                    <div className="text-sm font-bold text-[#d4af37]">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] uppercase tracking-wider bg-neutral-900 text-[#f7e7ce] px-2 py-0.5 rounded border border-neutral-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] hover:brightness-110'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121216] border border-[#d4af37]/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-64">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37]">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white font-serif-luxury">{selectedItem.name}</h3>
                </div>
                <div className="text-xl font-bold text-[#d4af37]">
                  Rs. {selectedItem.price.toLocaleString()}
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">{selectedItem.description}</p>

              <button
                onClick={() => {
                  handleAddToCart(selectedItem);
                  setSelectedItem(null);
                  onOpenCart();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110"
              >
                Add to Cart — Rs. {selectedItem.price.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
