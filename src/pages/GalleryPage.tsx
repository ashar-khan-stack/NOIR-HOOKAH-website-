import React, { useState, useMemo } from 'react';
import { PageRoute, GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/mockData';
import { Lightbox } from '../components/common/Lightbox';
import { Maximize2 } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const categories = ['All', 'Hookahs', 'Lounge', 'VIP', 'Flavors', 'Drinks', 'Atmosphere'];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div id="gallery-page" className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          CINEMATIC VISUAL ARCHIVE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-white">
          The Noir Gallery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          A glimpse into our hand-blown hookahs, VIP private chambers, and night atmosphere.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0c] shadow-lg'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedItemIndex(index)}
            className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#121216] cursor-pointer aspect-4/3 glass-panel-hover"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-white font-serif-luxury">{item.title}</h3>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#f7e7ce] font-semibold">
                <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>View Fullscreen</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItemIndex !== null && (
        <Lightbox
          item={filteredItems[selectedItemIndex]}
          onClose={() => setSelectedItemIndex(null)}
          onPrev={() =>
            setSelectedItemIndex((prev) =>
              prev !== null ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : null
            )
          }
          onNext={() =>
            setSelectedItemIndex((prev) =>
              prev !== null ? (prev === filteredItems.length - 1 ? 0 : prev + 1) : null
            )
          }
        />
      )}
    </div>
  );
};
