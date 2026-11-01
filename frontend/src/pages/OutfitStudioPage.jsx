import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Shirt, 
  Sparkles, 
  Calendar, 
  Heart, 
  Eye, 
  ArrowRight,
  Info,
  Edit2
} from 'lucide-react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const SLOTS = [
  { id: 'TOP', label: 'Top', categoryCodes: ['TSHIRTS', 'SHIRTS', 'TOPS', 'ETHNIC'], placeholder: 'Select a shirt, t-shirt, or top' },
  { id: 'BOTTOM', label: 'Bottom', categoryCodes: ['JEANS', 'TROUSERS', 'SHORTS', 'SKIRTS'], placeholder: 'Select jeans, trousers, or shorts' },
  { id: 'OUTERWEAR', label: 'Outerwear (Optional)', categoryCodes: ['JACKETS', 'HOODIES', 'FORMAL'], placeholder: 'Select jacket, coat, or blazer' },
  { id: 'FOOTWEAR', label: 'Footwear', categoryCodes: ['SHOES'], placeholder: 'Select sneakers, loafers, or boots' },
  { id: 'ACCESSORY', label: 'Accessory (Optional)', categoryCodes: ['BAGS', 'WATCHES', 'ACCESSORIES'], placeholder: 'Select bag, watch, or hat' }
];

const OCCASIONS = ['Casual', 'Smart Casual', 'Work', 'Formal', 'Date Night', 'Weekend', 'Party', 'Travel'];
const SEASONS = ['ALL_SEASON', 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];

export default function OutfitStudioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'saved'
  
  // Closet items
  const [closetItems, setClosetItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Saved outfits
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loadingOutfits, setLoadingOutfits] = useState(false);

  // Studio form state
  const [outfitName, setOutfitName] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('Casual');
  const [selectedSeason, setSelectedSeason] = useState('ALL_SEASON');
  const [notes, setNotes] = useState('');
  const [selectedSlots, setSelectedSlots] = useState({
    TOP: null,
    BOTTOM: null,
    OUTERWEAR: null,
    FOOTWEAR: null,
    ACCESSORY: null
  });

  // Item picker modal
  const [activePickerSlot, setActivePickerSlot] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');

  // Notifications / Feedback
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load wardrobe items
  useEffect(() => {
    api.get('/clothing')
      .then(res => setClosetItems(res.data))
      .catch(err => console.error('Failed to load items:', err))
      .finally(() => setLoadingItems(false));
  }, []);

  // Load saved outfits
  const fetchSavedOutfits = () => {
    setLoadingOutfits(true);
    api.get('/outfits')
      .then(res => setSavedOutfits(res.data))
      .catch(err => console.error('Failed to load outfits:', err))
      .finally(() => setLoadingOutfits(false));
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedOutfits();
    }
  }, [activeTab]);

  // Handle slot item select
  const handleSelectItem = (item) => {
    if (!activePickerSlot) return;
    setSelectedSlots(prev => ({
      ...prev,
      [activePickerSlot.id]: item
    }));
    setActivePickerSlot(null);
    setPickerSearch('');
  };

  const handleRemoveSlotItem = (slotId) => {
    setSelectedSlots(prev => ({
      ...prev,
      [slotId]: null
    }));
  };

  // Clear Studio Canvas
  const handleClearCanvas = () => {
    setSelectedSlots({
      TOP: null,
      BOTTOM: null,
      OUTERWEAR: null,
      FOOTWEAR: null,
      ACCESSORY: null
    });
    setOutfitName('');
    setNotes('');
  };

  // Save Outfit
  const handleSaveOutfit = async (e) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      setStatusMsg({ type: 'error', text: 'Please give your outfit a name.' });
      return;
    }

    // Must have at least Top and Bottom, or at least 2 items
    const selectedList = Object.entries(selectedSlots).filter(([_, item]) => item !== null);
    if (selectedList.length === 0) {
      setStatusMsg({ type: 'error', text: 'Please select at least one clothing piece for your outfit.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const payload = {
      name: outfitName.trim(),
      occasion: selectedOccasion,
      season: selectedSeason,
      style: selectedOccasion,
      notes: notes.trim(),
      isFavourite: false,
      items: selectedList.map(([slot, item], idx) => ({
        clothingItemId: item.id,
        outfitSlot: slot,
        displayOrder: idx + 1
      }))
    };

    try {
      await api.post('/outfits', payload);
      setStatusMsg({ type: 'success', text: `Outfit "${outfitName}" saved to your collection!` });
      handleClearCanvas();
      fetchSavedOutfits();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      setStatusMsg({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to save outfit. Please check selections.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle favorite on saved outfit
  const handleToggleFavorite = async (outfitId) => {
    try {
      const res = await api.post(`/outfits/${outfitId}/favorite`);
      setSavedOutfits(savedOutfits.map(o => o.id === outfitId ? res.data : o));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Delete saved outfit
  const handleDeleteOutfit = async (outfitId) => {
    if (!window.confirm('Are you sure you want to delete this outfit?')) return;
    try {
      await api.delete(`/outfits/${outfitId}`);
      setSavedOutfits(savedOutfits.filter(o => o.id !== outfitId));
    } catch (err) {
      console.error('Error deleting outfit:', err);
    }
  };

  // Filter items in picker modal
  const filteredPickerItems = closetItems.filter(item => {
    if (!activePickerSlot) return false;
    const matchesCategory = activePickerSlot.categoryCodes.includes(item.categoryCode);
    const matchesSearch = pickerSearch.trim() === '' || 
      item.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      (item.primaryColour && item.primaryColour.toLowerCase().includes(pickerSearch.toLowerCase())) ||
      (item.brand && item.brand.toLowerCase().includes(pickerSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DF] pb-6">
        <div>
          <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Styling Suite</span>
          <h1 className="text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">Outfit Studio</h1>
          <p className="text-sm text-[#757471] mt-1">
            Build and preview custom looks by pairing tops, bottoms, outerwear, footwear, and accessories.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center space-x-2 bg-[#EFEFEA] p-1 rounded-full self-start">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'studio' 
                ? 'bg-white text-[#1C1C1C] shadow-sm' 
                : 'text-[#757471] hover:text-[#1C1C1C]'
            }`}
          >
            Studio Canvas
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'saved' 
                ? 'bg-white text-[#1C1C1C] shadow-sm' 
                : 'text-[#757471] hover:text-[#1C1C1C]'
            }`}
          >
            Saved Outfits ({savedOutfits.length})
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-sm flex items-center justify-between ${
          statusMsg.type === 'success' ? 'bg-[#EAF2EC] text-[#4E7A5A]' : 'bg-[#FBEBEB] text-[#C45151]'
        }`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs font-bold">✕</button>
        </div>
      )}

      {/* STUDIO TAB */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Interactive Canvas Slots */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1C1C1C] flex items-center gap-2">
                <Layers className="w-5 h-5" /> Outfit Slots
              </h2>
              <button 
                onClick={handleClearCanvas}
                className="text-xs text-[#757471] hover:text-[#C45151] transition-colors"
              >
                Clear All Slots
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SLOTS.map((slot) => {
                const item = selectedSlots[slot.id];
                return (
                  <div 
                    key={slot.id}
                    className="fashion-card p-4 rounded-2xl flex flex-col justify-between relative group hover:border-[#1C1C1C] transition-all bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold tracking-wider uppercase text-[#757471]">
                        {slot.label}
                      </span>
                      {item && (
                        <button
                          onClick={() => handleRemoveSlotItem(slot.id)}
                          className="text-[#9E9C98] hover:text-[#C45151] p-1 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {item ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-20 bg-[#F1EFEA] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#E6E4DF]">
                          {item.imagePath ? (
                            <img 
                              src={item.imagePath} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Shirt className="w-8 h-8 text-[#9E9C98]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-[#1C1C1C] truncate">{item.name}</p>
                          <p className="text-xs text-[#757471]">{item.primaryColour} • {item.brand || 'Unbranded'}</p>
                          <button
                            type="button"
                            onClick={() => setActivePickerSlot(slot)}
                            className="mt-2 text-xs font-semibold text-[#1C1C1C] hover:underline flex items-center"
                          >
                            Change <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePickerSlot(slot)}
                        className="w-full h-24 border-2 border-dashed border-[#E6E4DF] hover:border-[#1C1C1C] rounded-xl flex flex-col items-center justify-center p-3 text-center transition-colors group-hover:bg-[#FAF9F7]"
                      >
                        <Plus className="w-5 h-5 text-[#757471] group-hover:text-[#1C1C1C] group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-xs font-semibold text-[#1C1C1C]">Choose {slot.label.split(' ')[0]}</span>
                        <span className="text-[10px] text-[#9E9C98] truncate max-w-full">{slot.placeholder}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Collage Live Preview Strip */}
            <div className="bg-[#F1EFEA]/80 border border-[#E6E4DF] rounded-2xl p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#757471] block mb-3">
                Live Look Preview
              </span>
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {Object.entries(selectedSlots)
                  .filter(([_, item]) => item !== null)
                  .map(([slot, item]) => (
                    <div key={slot} className="w-24 flex-shrink-0 bg-white rounded-xl p-2 shadow-subtle text-center">
                      <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-[#FAF9F7] mb-2 flex items-center justify-center">
                        <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-[#757471] block">{slot}</span>
                      <p className="text-xs font-medium text-[#1C1C1C] truncate">{item.name}</p>
                    </div>
                  ))}
                {Object.values(selectedSlots).every(v => v === null) && (
                  <p className="text-xs text-[#757471] py-4">
                    Your collage is empty. Click "+ Choose" above to pick clothing items.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Outfit Details & Save Form */}
          <div className="lg:col-span-5 bg-white rounded-card border border-[#E6E4DF] p-6 shadow-subtle space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1C1C1C]">Outfit Details</h2>
              <p className="text-xs text-[#757471]">Tag occasion, season, and notes to schedule later.</p>
            </div>

            <form onSubmit={handleSaveOutfit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Outfit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Linen Summer Fit"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="fashion-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Occasion
                </label>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedOccasion === occ
                          ? 'bg-[#1C1C1C] text-white shadow-sm'
                          : 'bg-[#F1EFEA] text-[#1C1C1C] hover:bg-[#E6E4DF]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="fashion-input text-sm"
                >
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Stylist Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Accessories, jacket pairing, or event notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="fashion-input text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="fashion-button-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving Outfit...' : 'Save Look to Wardrobe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAVED OUTFITS TAB */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {loadingOutfits ? (
            <div className="p-12 text-center text-xs text-[#757471]">Loading saved outfits...</div>
          ) : savedOutfits.length === 0 ? (
            <div className="bg-white rounded-card border border-[#E6E4DF] p-12 text-center space-y-4">
              <Layers className="w-12 h-12 text-[#9E9C98] mx-auto" />
              <h3 className="font-bold text-lg text-[#1C1C1C]">No Saved Outfits Yet</h3>
              <p className="text-xs text-[#757471] max-w-md mx-auto">
                Head over to the Studio Canvas or let the AI Stylist suggest combinations from your closet.
              </p>
              <button
                onClick={() => setActiveTab('studio')}
                className="fashion-button-primary text-xs"
              >
                Open Studio Canvas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOutfits.map((outfit) => (
                <div key={outfit.id} className="fashion-card overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="fashion-badge bg-[#F1EFEA] text-[#1C1C1C] text-[10px]">
                            {outfit.occasion}
                          </span>
                          <span className="text-[10px] text-[#757471] font-mono">
                            {outfit.season}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#1C1C1C] mt-2">{outfit.name}</h3>
                      </div>

                      <button
                        onClick={() => handleToggleFavorite(outfit.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          outfit.isFavourite ? 'text-[#C45151]' : 'text-[#9E9C98] hover:text-[#C45151]'
                        }`}
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    {/* Outfit Pieces Grid Preview */}
                    <div className="grid grid-cols-3 gap-2 bg-[#FAF9F7] p-2 rounded-xl">
                      {outfit.items?.map((it) => (
                        <div key={it.id} className="text-center">
                          <div className="w-full h-18 bg-white rounded-lg overflow-hidden border border-[#E6E4DF] flex items-center justify-center">
                            {it.clothingItemImage ? (
                              <img src={it.clothingItemImage} alt={it.clothingItemName} className="w-full h-full object-cover" />
                            ) : (
                              <Shirt className="w-5 h-5 text-[#9E9C98]" />
                            )}
                          </div>
                          <span className="text-[9px] font-bold uppercase text-[#757471] block mt-1 truncate">
                            {it.outfitSlot}
                          </span>
                        </div>
                      ))}
                    </div>

                    {outfit.notes && (
                      <p className="text-xs text-[#757471] italic">"{outfit.notes}"</p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3 bg-[#FAF9F7] border-t border-[#E6E4DF] flex items-center justify-between text-xs font-semibold">
                    <Link
                      to={`/calendar?scheduleOutfitId=${outfit.id}`}
                      className="text-[#1C1C1C] hover:underline flex items-center"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1" /> Schedule Look
                    </Link>

                    <button
                      onClick={() => handleDeleteOutfit(outfit.id)}
                      className="text-[#9E9C98] hover:text-[#C45151] transition-colors p-1"
                      title="Delete outfit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CLOTHING ITEM PICKER MODAL */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#E6E4DF] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#1C1C1C]">
                  Select {activePickerSlot.label}
                </h3>
                <p className="text-xs text-[#757471]">
                  Pick from items in your closet matching this slot.
                </p>
              </div>
              <button
                onClick={() => { setActivePickerSlot(null); setPickerSearch(''); }}
                className="text-[#757471] hover:text-black p-1"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 bg-[#FAF9F7] border-b border-[#E6E4DF]">
              <div className="relative">
                {!pickerSearch && (
                  <Search className="w-4 h-4 text-[#9E9C98] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150" />
                )}
                <input
                  type="text"
                  placeholder="Search by name, color, brand..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className={`fashion-input text-xs py-2 bg-white ${!pickerSearch ? 'pl-12' : 'pl-4'} transition-all`}
                />
                {pickerSearch && (
                  <button
                    type="button"
                    onClick={() => setPickerSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9C98] hover:text-[#1C1C1C] text-xs font-bold"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Items Grid */}
            <div className="p-5 overflow-y-auto flex-1">
              {filteredPickerItems.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Shirt className="w-10 h-10 text-[#9E9C98] mx-auto" />
                  <p className="text-sm font-semibold text-[#1C1C1C]">No matching items found</p>
                  <p className="text-xs text-[#757471]">
                    Add items in this category from the Digital Closet to pair them here.
                  </p>
                  <Link
                    to="/closet?action=upload"
                    className="fashion-button-primary text-xs"
                  >
                    Upload Item to Closet
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredPickerItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="border border-[#E6E4DF] hover:border-[#1C1C1C] rounded-xl p-3 cursor-pointer group hover:shadow-subtle transition-all bg-white"
                    >
                      <div className="w-full h-32 bg-[#F1EFEA] rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                        {item.imagePath ? (
                          <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <Shirt className="w-8 h-8 text-[#9E9C98]" />
                        )}
                      </div>
                      <p className="font-semibold text-xs text-[#1C1C1C] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#757471]">{item.primaryColour} • {item.brand || 'Unbranded'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#FAF9F7] border-t border-[#E6E4DF] flex justify-end">
              <button
                type="button"
                onClick={() => { setActivePickerSlot(null); setPickerSearch(''); }}
                className="fashion-button-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

