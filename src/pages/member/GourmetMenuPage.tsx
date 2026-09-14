import React, { useEffect, useState, useMemo } from 'react';
import { MemberLayout } from '../../layouts/MemberLayout';
import { useCart } from '../../context/CartContext';
import { firestoreService } from '../../services/firestoreService';
import { MenuItem, MenuCategory } from '../../types';
import {
  Utensils,
  Search,
  X,
  ShoppingBag,
  Sparkles,
  Flame,
  Leaf,
  Star,
  Plus,
  Minus,
} from 'lucide-react';

const MENU_CATEGORIES: ('All' | MenuCategory)[] = [
  'All',
  'Signature Hookahs',
  'Craft Beverages',
  'Artisanal Tea',
  'Gourmet Bites',
  'VIP Packages',
];

export const GourmetMenuPage: React.FC = () => {
  const { addMenuItem } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedToast, setAddedToast] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      setLoading(true);
      try {
        await firestoreService.initializeCatalog();
        const list = await firestoreService.getMenuItems();
        if (isMounted) {
          setMenuItems(list);
        }
      } catch (err) {
        console.warn('[NOIR Menu] Error loading menu:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addMenuItem(item, 1);
    setAddedToast(`Added 1x ${item.name} to Cart`);
    setTimeout(() => setAddedToast(''), 2000);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <MemberLayout title="Gourmet Dining & Elixirs" subtitle="Artisanal Cocktails, Caviar & Teas">
      <div className="space-y-8 animate-fadeIn">
        {/* Toast Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#121216] border border-[#d4af37] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-semibold">{addedToast}</span>
          </div>
        )}

        {/* Search & Categories Nav */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#121216]/90 p-4 rounded-2xl border border-neutral-800 shadow-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gourmet bites, mocktails, organic teas, or VIP sets..."
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {MENU_CATEGORIES.map((cat) => (
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

        {/* Menu Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-neutral-500 animate-pulse flex flex-col items-center gap-3">
            <Utensils className="w-8 h-8 text-[#d4af37] animate-spin" />
            <span>Curating dining selections...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#121216]/60 rounded-3xl border border-neutral-800 p-8">
            <Utensils className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-sm text-neutral-300">No gourmet dishes matched your criteria.</p>
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
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#121216] border border-neutral-800 hover:border-[#d4af37]/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/40 text-[#f7e7ce] text-[10px] uppercase font-bold tracking-wider">
                        {item.category}
                      </span>
                      {item.vegan && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[9px] font-bold uppercase flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" />
                          Vegan
                        </span>
                      )}
                      {item.spicy && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-700 text-rose-300 text-[9px] font-bold uppercase flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" />
                          Spiced
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-mono font-bold text-[#d4af37]">
                      Rs. {item.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-luxury font-bold text-lg text-white group-hover:text-[#f7e7ce] transition">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <div className="flex items-center gap-1 text-[#d4af37] text-xs font-mono">
                          <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {item.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Lounge Cart • Rs. {item.price.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
};
