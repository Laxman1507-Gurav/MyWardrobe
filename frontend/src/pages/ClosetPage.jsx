import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Shirt,
  Plus,
  Search,
  Heart,
  Filter,
  SlidersHorizontal,
  Trash2,
  Edit3,
  X,
  UploadCloud,
  Check,
  Tag,
  Calendar,
  DollarSign,
  Layers,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

export default function ClosetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Open upload modal if query param has action=upload
  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setIsAddModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    api.get('/clothing/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch items based on active filters
  const fetchItems = () => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.categoryId = selectedCategory;
    if (availabilityFilter) params.availability = availabilityFilter;
    if (onlyFavorites) params.isFavourite = true;
    if (seasonFilter) params.season = seasonFilter;
    if (searchQuery.trim()) params.query = searchQuery.trim();
    if (sortBy) params.sortBy = sortBy;

    api.get('/clothing', { params })
      .then(res => {
        setItems(res.data);
        setError('');
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load wardrobe items');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, availabilityFilter, onlyFavorites, seasonFilter, sortBy]);

  // Handle Search submit / debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  // Toggle favorite
  const handleToggleFavorite = async (e, itemId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/clothing/${itemId}/favorite`);
      setItems(items.map(it => it.id === itemId ? res.data : it));
      if (selectedItemDetail?.id === itemId) setSelectedItemDetail(res.data);
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (e, item) => {
    e.stopPropagation();
    const nextStatus = item.availabilityStatus === 'AVAILABLE' ? 'IN_LAUNDRY' : 'AVAILABLE';
    try {
      const res = await api.post(`/clothing/${item.id}/availability?status=${nextStatus}`);
      setItems(items.map(it => it.id === item.id ? res.data : it));
      if (selectedItemDetail?.id === item.id) setSelectedItemDetail(res.data);
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this piece from your closet?')) return;
    try {
      await api.delete(`/clothing/${itemId}`);
      setItems(items.filter(it => it.id !== itemId));
      setSelectedItemDetail(null);
    } catch (err) {
      alert('Failed to delete item: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Collection</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1C1C1C] mt-1">My Closet</h1>
          <p className="text-xs sm:text-sm text-[#757471]">
            Everything you own, beautifully organized. {items.length} items in wardrobe.
          </p>
        </div>

        <button
          onClick={() => { setEditingItem(null); setIsAddModalOpen(true); }}
          className="fashion-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Clothing Item
        </button>
      </div>

      {/* Category Pills Navigation (Matching Reference UI Aesthetic) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`fashion-badge text-xs px-4 py-2 flex-shrink-0 cursor-pointer ${selectedCategory === null
              ? 'bg-[#1C1C1C] text-white'
              : 'bg-white text-[#757471] border border-[#E6E4DF] hover:text-[#1C1C1C]'
            }`}
        >
          ALL
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`fashion-badge text-xs px-4 py-2 flex-shrink-0 cursor-pointer ${selectedCategory === cat.id
                ? 'bg-[#1C1C1C] text-white'
                : 'bg-white text-[#757471] border border-[#E6E4DF] hover:text-[#1C1C1C]'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6E4DF] shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          {!searchQuery && (
            <Search className="w-4 h-4 text-[#9E9C98] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`fashion-input ${!searchQuery ? 'pl-12' : 'pl-4'} py-2.5 text-xs sm:text-sm transition-all`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9C98] hover:text-[#1C1C1C] text-xs font-bold"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Availability filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E4DF] bg-white text-xs font-medium text-[#1C1C1C] focus:outline-none"
          >
            <option value="">All States</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_LAUNDRY">In Laundry</option>
          </select>

          {/* Season filter */}
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E4DF] bg-white text-xs font-medium text-[#1C1C1C] focus:outline-none"
          >
            <option value="">All Seasons</option>
            <option value="ALL_SEASON">All Season</option>
            <option value="SPRING">Spring</option>
            <option value="SUMMER">Summer</option>
            <option value="AUTUMN">Autumn</option>
            <option value="WINTER">Winter</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E4DF] bg-white text-xs font-medium text-[#1C1C1C] focus:outline-none"
          >
            <option value="createdAt">Recently Added</option>
            <option value="name">Name (A-Z)</option>
            <option value="purchasePrice">Price (High-Low)</option>
            <option value="purchaseDate">Purchase Date</option>
          </select>

          {/* Favorite filter toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-2.5 rounded-xl border transition-colors ${onlyFavorites
                ? 'bg-[#C45151] text-white border-[#C45151]'
                : 'bg-white text-[#757471] border-[#E6E4DF] hover:text-[#C45151]'
              }`}
            title="Filter by Favorites"
          >
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Clothing Cards Grid (Matching Reference UI: 2-column mobile, 3-4 column desktop) */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1C1C1C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#757471]">Loading your digital wardrobe...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-card border border-[#E6E4DF] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F1EFEA] flex items-center justify-center mx-auto text-[#1C1C1C]">
            <Shirt className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-lg text-[#1C1C1C]">Your closet is waiting for its first outfit</h3>
          <p className="text-xs text-[#757471]">
            Upload photographs of your actual clothing pieces to start styling outfits and planning your weekly looks.
          </p>
          <button
            onClick={() => { setEditingItem(null); setIsAddModalOpen(true); }}
            className="fashion-button-primary mt-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemDetail(item)}
              className="fashion-card overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with subtle warm tone */}
              <div className="relative aspect-square bg-[#F1EFEA] overflow-hidden flex items-center justify-center">
                <img
                  src={item.imagePath}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => handleToggleFavorite(e, item.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1C1C] hover:bg-white transition-all shadow-sm"
                  aria-label="Toggle Favorite"
                >
                  <Heart className={`w-4 h-4 ${item.isFavourite ? 'fill-[#C45151] text-[#C45151]' : 'text-[#757471]'}`} />
                </button>

                {/* Availability State Pill */}
                <span
                  className={`absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${item.availabilityStatus === 'AVAILABLE'
                      ? 'bg-[#EAF2EC] text-[#4E7A5A]'
                      : 'bg-[#FBEBEB] text-[#C45151]'
                    }`}
                >
                  {item.availabilityStatus === 'AVAILABLE' ? 'Clean' : 'Laundry'}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#757471] font-semibold">
                      {item.categoryName}
                    </span>
                    <h3 className="font-semibold text-sm text-[#1C1C1C] line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                  {item.purchasePrice > 0 && (
                    <span className="text-xs font-semibold text-[#1C1C1C] ml-2">
                      ${Number(item.purchasePrice).toFixed(0)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E6E4DF]/60 text-[11px] text-[#757471]">
                  <span>{item.primaryColour} • {item.season}</span>
                  <button
                    onClick={(e) => handleToggleAvailability(e, item)}
                    className="hover:text-[#1C1C1C] transition-colors"
                    title="Toggle Laundry status"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Clothing Item Modal */}
      {isAddModalOpen && (
        <ClothingFormModal
          isOpen={isAddModalOpen}
          initialData={editingItem}
          categories={categories}
          onClose={() => { setIsAddModalOpen(false); setEditingItem(null); }}
          onSuccess={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
            fetchItems();
          }}
        />
      )}

      {/* Item Detail Drawer / Modal */}
      {selectedItemDetail && (
        <ItemDetailModal
          item={selectedItemDetail}
          onClose={() => setSelectedItemDetail(null)}
          onEdit={() => {
            setEditingItem(selectedItemDetail);
            setSelectedItemDetail(null);
            setIsAddModalOpen(true);
          }}
          onDelete={() => handleDeleteItem(selectedItemDetail.id)}
          onToggleFavorite={(e) => handleToggleFavorite(e, selectedItemDetail.id)}
          onToggleAvailability={(e) => handleToggleAvailability(e, selectedItemDetail)}
        />
      )}
    </div>
  );
}

// Clothing Upload and Edit Form Modal
function ClothingFormModal({ isOpen, initialData, categories, onClose, onSuccess }) {
  const [name, setName] = useState(initialData?.name || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || (categories[0]?.id || 1));
  const [primaryColour, setPrimaryColour] = useState(initialData?.primaryColour || 'Black');
  const [secondaryColour, setSecondaryColour] = useState(initialData?.secondaryColour || '');
  const [pattern, setPattern] = useState(initialData?.pattern || 'Solid');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [fabric, setFabric] = useState(initialData?.fabric || 'Cotton');
  const [season, setSeason] = useState(initialData?.season || 'ALL_SEASON');
  const [style, setStyle] = useState(initialData?.style || 'CASUAL');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || '');
  const [washingInstructions, setWashingInstructions] = useState(initialData?.washingInstructions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [occasions, setOccasions] = useState(initialData?.occasions || ['Casual']);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imagePath || '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const occasionOptions = ['Everyday', 'Casual', 'Work', 'Dinner', 'Evening', 'Formal', 'Sporty', 'Weekend', 'Party'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setFormError('File size must be under 15MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormError('');
    }
  };

  const toggleOccasion = (occ) => {
    if (occasions.includes(occ)) {
      setOccasions(occasions.filter(o => o !== occ));
    } else {
      setOccasions([...occasions, occ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!initialData && !imageFile) {
      setFormError('Please select or photograph an image of this piece.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    const dataObj = {
      name,
      categoryId: Number(categoryId),
      primaryColour,
      secondaryColour,
      pattern,
      brand,
      fabric,
      season,
      style,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
      purchaseDate: purchaseDate || null,
      washingInstructions,
      notes,
      occasions
    };

    formData.append('data', new Blob([JSON.stringify(dataObj)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (initialData) {
        await api.put(`/clothing/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/clothing', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save clothing piece');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E4DF]">
          <div>
            <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">
              {initialData ? 'Update Look' : 'Digitize Wardrobe'}
            </span>
            <h3 className="font-extrabold text-xl text-[#1C1C1C] mt-1">
              {initialData ? 'Edit Clothing Item' : 'Add Clothing Item'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-[#757471] hover:text-black rounded-full hover:bg-[#F7F7F5]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-[#FBEBEB] text-[#C45151] rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1C1C1C]">Clothing Photography</label>
            <div className="border-2 border-dashed border-[#E6E4DF] rounded-2xl p-4 text-center hover:border-[#1C1C1C] transition-colors relative bg-[#FAF9F7]">
              {imagePreview ? (
                <div className="relative aspect-video max-h-56 mx-auto rounded-xl overflow-hidden bg-[#F1EFEA]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/75 hover:bg-black text-white text-xs rounded-full cursor-pointer transition-colors shadow">
                    Change Photo
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-[#757471] stroke-[1.5] mb-2" />
                  <p className="font-semibold text-sm text-[#1C1C1C]">Click to upload or drag image</p>
                  <p className="text-xs text-[#757471] mt-1">Supports high-res JPEG, PNG, WEBP up to 15MB</p>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Item Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vintage Oversized Denim Jacket"
                className="fashion-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="fashion-input"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Primary Colour *</label>
              <input
                type="text"
                required
                value={primaryColour}
                onChange={(e) => setPrimaryColour(e.target.value)}
                placeholder="e.g. Navy Blue, Beige, Black"
                className="fashion-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Brand / Designer</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Zara, Uniqlo, Levi's"
                className="fashion-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Fabric / Material</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% Cotton, Linen, Wool"
                className="fashion-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="fashion-input"
              >
                <option value="ALL_SEASON">All Season</option>
                <option value="SPRING">Spring</option>
                <option value="SUMMER">Summer</option>
                <option value="AUTUMN">Autumn</option>
                <option value="WINTER">Winter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Style Aesthetic</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="fashion-input"
              >
                <option value="CASUAL">Casual</option>
                <option value="SMART_CASUAL">Smart Casual</option>
                <option value="FORMAL">Formal</option>
                <option value="STREETWEAR">Streetwear</option>
                <option value="ETHNIC">Ethnic</option>
                <option value="SPORTY">Sporty</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Purchase Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
                className="fashion-input"
              />
            </div>
          </div>

          {/* Occasions Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1C1C1C]">Applicable Occasions</label>
            <div className="flex flex-wrap gap-2">
              {occasionOptions.map((occ) => {
                const isSelected = occasions.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`fashion-badge text-xs px-3 py-1.5 cursor-pointer ${isSelected
                        ? 'bg-[#1C1C1C] text-white'
                        : 'bg-[#F1EFEA] text-[#757471] hover:text-[#1C1C1C]'
                      }`}
                  >
                    {isSelected && <Check className="w-3 h-3 mr-1 inline" />}
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Care Instructions & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Washing / Care Instructions</label>
              <input
                type="text"
                value={washingInstructions}
                onChange={(e) => setWashingInstructions(e.target.value)}
                placeholder="e.g. Machine wash cold, hang dry"
                className="fashion-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1C1C1C]">Styling Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Pairs best with chelsea boots"
                className="fashion-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E6E4DF]">
            <button
              type="button"
              onClick={onClose}
              className="fashion-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="fashion-button-primary"
            >
              {submitting ? 'Saving Piece...' : initialData ? 'Update Piece' : 'Save to Closet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Item Detail Modal
function ItemDetailModal({ item, onClose, onEdit, onDelete, onToggleFavorite, onToggleAvailability }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-8">
        {/* Left: Image Canvas */}
        <div className="md:w-1/2 bg-[#F1EFEA] relative flex items-center justify-center min-h-[320px]">
          <img
            src={item.imagePath}
            alt={item.name}
            className="w-full h-full object-cover max-h-[500px]"
          />
          <button
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow"
          >
            <Heart className={`w-5 h-5 ${item.isFavourite ? 'fill-[#C45151] text-[#C45151]' : 'text-[#757471]'}`} />
          </button>
        </div>

        {/* Right: Details & Operations */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">
                {item.categoryName}
              </span>
              <button onClick={onClose} className="p-1 text-[#757471] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#1C1C1C]">{item.name}</h2>
              {item.brand && <p className="text-xs text-[#757471] font-medium">{item.brand}</p>}
            </div>

            {/* Availability Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F7] border border-[#E6E4DF]">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.availabilityStatus === 'AVAILABLE' ? 'bg-[#4E7A5A]' : 'bg-[#C45151]'}`}></span>
                <span className="text-xs font-semibold text-[#1C1C1C]">
                  {item.availabilityStatus === 'AVAILABLE' ? 'Available in Closet' : 'Currently in Laundry'}
                </span>
              </div>
              <button
                onClick={onToggleAvailability}
                className="text-xs font-medium text-[#1C1C1C] hover:underline"
              >
                Mark {item.availabilityStatus === 'AVAILABLE' ? 'as Laundry' : 'as Clean'}
              </button>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-[#FAF9F7] rounded-lg">
                <span className="text-[#757471] block">Primary Colour</span>
                <span className="font-semibold text-[#1C1C1C]">{item.primaryColour}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F7] rounded-lg">
                <span className="text-[#757471] block">Season</span>
                <span className="font-semibold text-[#1C1C1C]">{item.season}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F7] rounded-lg">
                <span className="text-[#757471] block">Fabric</span>
                <span className="font-semibold text-[#1C1C1C]">{item.fabric || 'Standard'}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F7] rounded-lg">
                <span className="text-[#757471] block">Purchase Price</span>
                <span className="font-semibold text-[#1C1C1C]">${Number(item.purchasePrice || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Occasions */}
            {item.occasions && item.occasions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#757471] uppercase tracking-wider">Occasions</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.occasions.map(occ => (
                    <span key={occ} className="px-2.5 py-1 bg-[#F1EFEA] rounded-full text-[10px] font-medium text-[#1C1C1C]">
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Washing & Notes */}
            {item.washingInstructions && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#757471] uppercase tracking-wider">Care Instructions</span>
                <p className="text-xs text-[#1C1C1C] bg-[#FAF9F7] p-2.5 rounded-lg border border-[#E6E4DF]">
                  {item.washingInstructions}
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E6E4DF]">
            <button
              onClick={onDelete}
              className="fashion-button text-[#C45151] hover:bg-[#FBEBEB] p-2.5 rounded-xl text-xs flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Delete
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="fashion-button-secondary text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
