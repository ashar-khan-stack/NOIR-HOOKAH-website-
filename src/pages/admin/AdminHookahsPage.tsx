import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { firestoreService } from '../../services/firestoreService';
import { storageService } from '../../firebase/storageService';
import { Hookah } from '../../types';
import { LuxuryLoading } from '../../components/common/LuxuryLoading';
import {
  Flame,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const AdminHookahsPage: React.FC = () => {
  const [hookahs, setHookahs] = useState<Hookah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHookah, setEditingHookah] = useState<Hookah | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10000);
  const [strength, setStrength] = useState<'Smooth' | 'Balanced' | 'Robust' | 'Intense'>('Balanced');
  const [recommendedFlavor, setRecommendedFlavor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [crystalFinish, setCrystalFinish] = useState('');
  const [alloysStr, setAlloysStr] = useState('');
  const [pairingNotes, setPairingNotes] = useState('');
  const [available, setAvailable] = useState(true);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchHookahs = async () => {
    try {
      const list = await firestoreService.getHookahs();
      setHookahs(list);
    } catch (err) {
      console.error('[NOIR Admin] Hookah fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHookahs();
  }, []);

  const openCreateModal = () => {
    setEditingHookah(null);
    setName('');
    setPrice(12000);
    setStrength('Balanced');
    setRecommendedFlavor('Black Diamond Mint');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80');
    setCrystalFinish('Hand-Cut Obsidian Glass');
    setAlloysStr('Titanium, Aircraft Aluminum');
    setPairingNotes('Pairs with aged single malts and robust cigars.');
    setAvailable(true);
    setModalOpen(true);
  };

  const openEditModal = (hookah: Hookah) => {
    setEditingHookah(hookah);
    setName(hookah.name);
    setPrice(hookah.price);
    setStrength(hookah.strength);
    setRecommendedFlavor(hookah.recommendedFlavor);
    setDescription(hookah.description);
    setImage(hookah.image);
    setCrystalFinish(hookah.crystalFinish || 'Czech Lead Crystal');
    setAlloysStr((hookah.alloys || ['Aerospace Stainless Steel']).join(', '));
    setPairingNotes(hookah.pairingNotes || '');
    setAvailable(hookah.available !== false);
    setModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Image file size cannot exceed 10MB.' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await storageService.uploadCatalogImage(
        'hookahs',
        file.name,
        file,
        (progress) => setUploadProgress(progress)
      );
      setImage(url);
      setFeedback({ type: 'success', text: 'Image uploaded to Firebase Storage.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Image upload failed:', err);
      setFeedback({ type: 'error', text: 'Image upload failed. Storage permissions required.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const alloys = alloysStr.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingHookah) {
        await firestoreService.updateHookah(editingHookah.id, {
          name,
          price: Number(price),
          strength,
          recommendedFlavor,
          description,
          image,
          crystalFinish,
          alloys,
          pairingNotes,
          available,
        });
        setFeedback({ type: 'success', text: 'Hookah updated successfully.' });
      } else {
        await firestoreService.createHookah({
          name,
          price: Number(price),
          strength,
          recommendedFlavor,
          description,
          image,
          crystalFinish,
          alloys,
          pairingNotes,
          available,
          baseOptions: ['Natural Spring Water', 'Ice Chamber', 'Infused Botanical Base'],
          features: ['Laser Purge Valve', 'Magnetic Diffuser', 'Surgical Silicone Hose'],
          rating: 4.9,
          isPopular: true,
        });
        setFeedback({ type: 'success', text: 'New signature hookah created.' });
      }

      setModalOpen(false);
      await fetchHookahs();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Save failed:', err);
      setFeedback({ type: 'error', text: 'Operation failed: ' + (err?.message || 'Check Firestore rules.') });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await firestoreService.deleteHookah(id);
      setDeleteConfirmId(null);
      await fetchHookahs();
      setFeedback({ type: 'success', text: 'Hookah removed from catalog.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      console.error('[NOIR Admin] Delete failed:', err);
      setFeedback({ type: 'error', text: 'Failed to delete item.' });
    }
  };

  const filtered = hookahs.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.strength.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Hookah Catalog Management"
      subtitle="Configure luxury apparatuses, alloys, crystal bases, and lounge pricing"
      action={
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hookah</span>
        </button>
      }
    >
      <div className="space-y-6 animate-fadeIn">
        {/* Feedback Alert */}
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

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-[#121216]/90 border border-neutral-800 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search hookahs by title or strength..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="text-xs text-neutral-400">
            Total Units: <span className="font-mono text-white">{hookahs.length}</span>
          </div>
        </div>

        {/* Catalog Table */}
        {loading ? (
          <LuxuryLoading message="Synchronizing Hookahs Catalog..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-neutral-800 rounded-3xl space-y-3">
            <Flame className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-white text-base">No Hookahs Available</h3>
            <p className="text-xs text-neutral-400">No hookah matched your search criteria.</p>
          </div>
        ) : (
          <div className="bg-[#121216]/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[10px] bg-[#0a0a0c]">
                    <th className="py-3 px-4">Hookah Model</th>
                    <th className="py-3 px-4">Strength</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Recommended Pairing</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filtered.map((hookah) => (
                    <tr key={hookah.id} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={hookah.image}
                            alt={hookah.name}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="font-serif-luxury font-bold text-sm text-white">
                              {hookah.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-xs">
                              {hookah.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-900 text-neutral-300 border border-neutral-800">
                          {hookah.strength}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#d4af37]">
                        Rs. {hookah.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300 text-xs">
                        {hookah.recommendedFlavor}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            hookah.available !== false
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {hookah.available !== false ? 'In Stock' : 'Archived'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(hookah)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
                          title="Edit Hookah"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(hookah.id)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/80 text-rose-400 hover:text-rose-200 transition"
                          title="Delete Hookah"
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121216] border border-rose-900/60 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-serif-luxury font-bold text-white text-base">
                  Confirm Deletion
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to delete this hookah from the active lounge catalog? This operation cannot be undone.
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

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#121216] border border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="font-serif-luxury font-bold text-white text-lg">
                  {editingHookah ? 'Edit Hookah Model' : 'Create Signature Hookah'}
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
                  <label className="text-neutral-300 block mb-1 font-semibold">Model Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Noir Royal Sovereign"
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Price (PKR / Rs.)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Strength Profile</label>
                    <select
                      value={strength}
                      onChange={(e: any) => setStrength(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Smooth">Smooth</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Robust">Robust</option>
                      <option value="Intense">Intense</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Recommended Flavor Pairing</label>
                  <input
                    type="text"
                    value={recommendedFlavor}
                    onChange={(e) => setRecommendedFlavor(e.target.value)}
                    placeholder="e.g. Black Diamond Mint"
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Engineering and smoking experience summary..."
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Crystal Finish</label>
                    <input
                      type="text"
                      value={crystalFinish}
                      onChange={(e) => setCrystalFinish(e.target.value)}
                      placeholder="e.g. Bohemian Smoked Crystal"
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-300 block mb-1 font-semibold">Alloys (comma-separated)</label>
                    <input
                      type="text"
                      value={alloysStr}
                      onChange={(e) => setAlloysStr(e.target.value)}
                      placeholder="e.g. Titanium, Aircraft Aluminum"
                      className="w-full p-2.5 rounded-xl bg-[#0a0a0c] border border-neutral-800 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div className="space-y-2 p-3 rounded-2xl bg-[#0a0a0c] border border-neutral-800">
                  <label className="text-neutral-300 block font-semibold">Catalog Image</label>
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
                          Uploading to Firebase Storage: {uploadProgress}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="available"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded border-neutral-800 text-[#d4af37] focus:ring-0"
                  />
                  <label htmlFor="available" className="text-neutral-300 font-semibold cursor-pointer">
                    Available for Lounge Sessions
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
                    {editingHookah ? 'Update Hookah' : 'Create Hookah'}
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
