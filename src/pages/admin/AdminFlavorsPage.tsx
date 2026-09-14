import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { storageService } from '../../firebase/storageService';
import { Flavor, FlavorCategory } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  Sparkles,
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

const CATEGORIES: FlavorCategory[] = ['Signature', 'Fruity', 'Mint', 'Dessert', 'Premium', 'Classic'];

export const AdminFlavorsPage: React.FC = () => {
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | FlavorCategory>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FlavorCategory>('Signature');
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState(4);
  const [coolingLevel, setCoolingLevel] = useState(3);
  const [recommendedHookah, setRecommendedHookah] = useState('Noir Sovereign');
  const [price, setPrice] = useState(3500);
  const [image, setImage] = useState('');
  const [isExclusive, setIsExclusive] = useState(false);
  const [available, setAvailable] = useState(true);
  const [pairingNotes, setPairingNotes] = useState('');
  const [sommelierRecommendations, setSommelierRecommendations] = useState('');
  const [blendSpecifications, setBlendSpecifications] = useState('');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFlavors = async () => {
    try {
      const list = await firestoreService.getFlavors();
      setFlavors(list);
    } catch (err) {
      console.error('[NOIR Admin] Flavor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlavors();
  }, []);

  const openCreateModal = () => {
    setEditingFlavor(null);
    setName('');
    setCategory('Signature');
    setDescription('');
    setIntensity(4);
    setCoolingLevel(3);
    setRecommendedHookah('Noir Royal Sovereign');
    setPrice(3500);
    setImage('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80');
    setIsExclusive(true);
    setAvailable(true);
    setPairingNotes('Complements rich spiced tea and espresso.');
    setSommelierRecommendations('Best smoked with double-ice chamber base.');
    setBlendSpecifications('Dark leaf French Virginia cut infused with blackcurrant essence.');
    setModalOpen(true);
  };

  const openEditModal = (flavor: Flavor) => {
    setEditingFlavor(flavor);
    setName(flavor.name);
    setCategory(flavor.category);
    setDescription(flavor.description);
    setIntensity(flavor.intensity);
    setCoolingLevel(flavor.coolingLevel);
    setRecommendedHookah(flavor.recommendedHookah);
    setPrice(flavor.price);
    setImage(flavor.image);
    setIsExclusive(Boolean(flavor.isExclusive));
    setAvailable(flavor.available !== false);
    setPairingNotes(flavor.pairingNotes || '');
    setSommelierRecommendations(flavor.sommelierRecommendations || '');
    setBlendSpecifications(flavor.blendSpecifications || '');
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
        'flavors',
        file.name,
        file,
        (progress) => setUploadProgress(progress)
      );
      setImage(url);
      setFeedback({ type: 'success', text: 'Flavor image uploaded to Firebase Storage.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Flavor image upload error:', err);
      setFeedback({ type: 'error', text: 'Upload failed. Check Storage rules.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFlavor) {
        await firestoreService.updateFlavor(editingFlavor.id, {
          name,
          category,
          description,
          intensity: Number(intensity),
          coolingLevel: Number(coolingLevel),
          recommendedHookah,
          price: Number(price),
          image,
          isExclusive,
          available,
          pairingNotes,
          sommelierRecommendations,
          blendSpecifications,
        });
        setFeedback({ type: 'success', text: 'Flavor updated successfully.' });
      } else {
        await firestoreService.createFlavor({
          name,
          category,
          description,
          intensity: Number(intensity),
          coolingLevel: Number(coolingLevel),
          recommendedHookah,
          price: Number(price),
          image,
          isExclusive,
          available,
          pairingNotes,
          sommelierRecommendations,
          blendSpecifications,
        });
        setFeedback({ type: 'success', text: 'New tobacco blend registered.' });
      }

      setModalOpen(false);
      await fetchFlavors();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Flavor save failed:', err);
      setFeedback({ type: 'error', text: 'Operation failed: ' + (err?.message || 'Check Firestore rules.') });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await firestoreService.deleteFlavor(id);
      setDeleteConfirmId(null);
      await fetchFlavors();
      setFeedback({ type: 'success', text: 'Flavor deleted from catalog.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Flavor delete error:', err);
      setFeedback({ type: 'error', text: 'Failed to delete flavor.' });
    }
  };

  const filtered = flavors.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout
      title="Tobacco & Flavors Master"
      subtitle="Manage artisanal molasses, nicotine strengths, cooling gauges, and blend recipes"
      action={
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Blend</span>
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
              placeholder="Search flavors by name..."
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
              <option value="All">All Categories ({flavors.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LuxuryLoading message="Retrieving Tobacco Registry..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Tobacco Blends Found</h3>
            <p className="text-xs text-neutral-400">No flavors match the query.</p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Flavor Blend</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Intensity / Cooling</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((flavor) => (
                    <tr key={flavor.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="font-serif-luxury font-bold text-sm text-white">
                              {flavor.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-xs">
                              {flavor.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#121216] border border-neutral-700 text-neutral-300">
                          {flavor.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-mono">
                          <span className="text-rose-400">Intensity: {flavor.intensity}/5</span>
                          <span className="text-neutral-500 mx-1">•</span>
                          <span className="text-cyan-400">Cooling: {flavor.coolingLevel}/5</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                        Rs. {flavor.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            flavor.available !== false
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {flavor.available !== false ? 'In Stock' : 'Archived'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(flavor)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                          title="Edit Flavor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(flavor.id)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950 text-rose-400 hover:text-rose-200 transition"
                          title="Delete Flavor"
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

        {/* Delete Confirmation */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-rose-900/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif-luxury font-bold text-white text-base">
                  Confirm Deletion
                </h4>
              </div>
              <p className="text-xs text-neutral-400">
                Are you sure you want to permanently delete this tobacco blend from the catalog?
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
                  Delete Blend
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
                  {editingFlavor ? 'Edit Flavor Blend' : 'Add New Tobacco Blend'}
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
                  <label className="text-neutral-300 block mb-1 font-semibold">Flavor Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Damascus Rose & White Amber"
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
                      {CATEGORIES.map((c) => (
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
                      min={500}
                      step={100}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Intensity (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Cooling Level (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={coolingLevel}
                      onChange={(e) => setCoolingLevel(Number(e.target.value))}
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
                    placeholder="Flavor profile notes and aroma..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Sommelier & Blend specs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Sommelier Advice</label>
                    <input
                      type="text"
                      value={sommelierRecommendations}
                      onChange={(e) => setSommelierRecommendations(e.target.value)}
                      placeholder="Best temperature and bowl type"
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Blend Recipe</label>
                    <input
                      type="text"
                      value={blendSpecifications}
                      onChange={(e) => setBlendSpecifications(e.target.value)}
                      placeholder="e.g. French Virginia, Dark leaf"
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                  <label className="text-neutral-300 block font-semibold">Flavor Media</label>
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
                      checked={isExclusive}
                      onChange={(e) => setIsExclusive(e.target.checked)}
                      className="rounded border-neutral-800 text-[#d4af37]"
                    />
                    <span className="text-neutral-300 font-semibold">VIP Exclusive</span>
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
                    {editingFlavor ? 'Update Blend' : 'Create Blend'}
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
