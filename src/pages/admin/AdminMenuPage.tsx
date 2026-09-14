import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { storageService } from '../../firebase/storageService';
import { MenuItem, MenuCategory } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

const MENU_CATEGORIES: MenuCategory[] = [
  'Signature Hookahs',
  'Craft Beverages',
  'Artisanal Tea',
  'Gourmet Bites',
  'VIP Packages',
];

export const AdminMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | MenuCategory>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('Gourmet Bites');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(2500);
  const [image, setImage] = useState('');
  const [spicy, setSpicy] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [available, setAvailable] = useState(true);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMenu = async () => {
    try {
      const list = await firestoreService.getMenuItems();
      setMenuItems(list);
    } catch (err) {
      console.error('[NOIR Admin] Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('Gourmet Bites');
    setDescription('');
    setPrice(3500);
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
    setSpicy(false);
    setVegan(false);
    setAvailable(true);
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setPrice(item.price);
    setImage(item.image);
    setSpicy(Boolean(item.spicy));
    setVegan(Boolean(item.vegan));
    setAvailable(item.available !== false);
    setModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: 'Please select an image file.' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await storageService.uploadCatalogImage(
        'menu',
        file.name,
        file,
        (progress) => setUploadProgress(progress)
      );
      setImage(url);
      setFeedback({ type: 'success', text: 'Menu image uploaded.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Menu upload error:', err);
      setFeedback({ type: 'error', text: 'Image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await firestoreService.updateMenuItem(editingItem.id, {
          name,
          category,
          description,
          price: Number(price),
          image,
          spicy,
          vegan,
          available,
        });
        setFeedback({ type: 'success', text: 'Menu item updated.' });
      } else {
        await firestoreService.createMenuItem({
          name,
          category,
          description,
          price: Number(price),
          image,
          spicy,
          vegan,
          available,
          rating: 4.8,
        });
        setFeedback({ type: 'success', text: 'New item added to menu.' });
      }

      setModalOpen(false);
      await fetchMenu();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Menu save error:', err);
      setFeedback({ type: 'error', text: 'Operation failed: ' + (err?.message || 'Check Firestore.') });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await firestoreService.deleteMenuItem(id);
      setDeleteConfirmId(null);
      await fetchMenu();
      setFeedback({ type: 'success', text: 'Item deleted from menu.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Delete failed:', err);
      setFeedback({ type: 'error', text: 'Failed to delete item.' });
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout
      title="Gourmet Dining & Elixirs"
      subtitle="Configure culinary bites, craft mocktails, artisanal tea, and lounge pairings"
      action={
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      }
    >
      <div className="space-y-6 animate-fadeIn">
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="p-4 rounded-2xl bg-[#121216]/90 border border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search gourmet menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e: any) => setCategoryFilter(e.target.value)}
              className="bg-[#0a0a0c] border border-neutral-800 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="All">All Categories ({menuItems.length})</option>
              {MENU_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LuxuryLoading message="Retrieving Dining Catalog..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Menu Items Found</h3>
            <p className="text-xs text-neutral-400">No dishes or beverages match the criteria.</p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="font-serif-luxury font-bold text-sm text-white">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#121216] border border-neutral-700 text-neutral-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                        Rs. {item.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 space-x-1">
                        {item.vegan && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Vegan
                          </span>
                        )}
                        {item.spicy && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-950 text-rose-400 border border-rose-800">
                            Spicy
                          </span>
                        )}
                        {!item.vegan && !item.spicy && (
                          <span className="text-neutral-500 text-[10px]">Chef Special</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.available !== false
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {item.available !== false ? 'Active' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950 text-rose-400 hover:text-rose-200 transition"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-rose-900/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif-luxury font-bold text-white text-base">
                  Confirm Item Removal
                </h4>
              </div>
              <p className="text-xs text-neutral-400">
                Are you sure you want to remove this dish or elixir from the gourmet menu?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="font-serif-luxury font-bold text-white text-lg">
                  {editingItem ? 'Edit Gourmet Offering' : 'Add New Culinary Offering'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Offering Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wagyu Truffle Sliders"
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Category</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {MENU_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Price (PKR / Rs.)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={100}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Culinary notes, ingredients, and presentation details..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                  <label className="text-neutral-300 block font-semibold">Offering Photograph</label>
                  <div className="flex items-center gap-3">
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploading}
                        className="text-[11px] text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                      />
                      {uploading && (
                        <div className="mt-1 text-[10px] text-[#d4af37] font-mono">
                          Uploading: {uploadProgress}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => setAvailable(e.target.checked)}
                      className="rounded border-neutral-800 text-[#d4af37]"
                    />
                    <span className="text-neutral-300 font-semibold">Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={spicy}
                      onChange={(e) => setSpicy(e.target.checked)}
                      className="rounded border-neutral-800 text-[#d4af37]"
                    />
                    <span className="text-neutral-300 font-semibold">Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vegan}
                      onChange={(e) => setVegan(e.target.checked)}
                      className="rounded border-neutral-800 text-[#d4af37]"
                    />
                    <span className="text-neutral-300 font-semibold">Vegan</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition"
                  >
                    {editingItem ? 'Update Offering' : 'Add Offering'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
