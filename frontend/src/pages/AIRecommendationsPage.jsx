import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Check, 
  Calendar, 
  ArrowRight, 
  SlidersHorizontal, 
  Layers, 
  RefreshCw,
  FolderHeart,
  ChevronRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const OCCASIONS = ['All Occasions', 'Casual', 'Smart Casual', 'Work', 'Formal', 'Date Night', 'Weekend', 'Party'];
const SEASONS = ['ALL_SEASON', 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
const COLOURS = ['All Colors', 'Black', 'White', 'Beige', 'Navy', 'Grey', 'Green', 'Olive', 'Brown', 'Burgundy'];

export default function AIRecommendationsPage() {
  const navigate = useNavigate();

  const [occasion, setOccasion] = useState('All Occasions');
  const [season, setSeason] = useState('ALL_SEASON');
  const [preferredColour, setPreferredColour] = useState('All Colors');

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingIndex, setSavingIndex] = useState(null);
  const [savedMap, setSavedMap] = useState({});
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        occasion: occasion === 'All Occasions' ? null : occasion,
        season: season === 'ALL_SEASON' ? null : season,
        preferredColour: preferredColour === 'All Colors' ? null : preferredColour
      };
      const res = await api.post('/recommendations/generate', payload);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
      setError(err.response?.data?.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Save recommended look to user's outfits
  const handleSaveLook = async (rec, idx) => {
    setSavingIndex(idx);
    try {
      const payload = {
        name: rec.name,
        occasion: rec.occasion,
        season: rec.season,
        style: rec.style,
        notes: rec.stylistNotes,
        isFavourite: true,
        items: rec.items.map((it, order) => ({
          clothingItemId: it.clothingItemId,
          outfitSlot: it.outfitSlot,
          displayOrder: order + 1
        }))
      };

      const res = await api.post('/outfits', payload);
      setSavedMap(prev => ({ ...prev, [idx]: res.data.id }));
    } catch (err) {
      console.error('Failed to save outfit:', err);
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="border-b border-[#E6E4DF] pb-6">
        <div className="flex items-center space-x-2">
          <span className="fashion-badge bg-[#F8F4EC] text-[#C49E5A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> AI Stylist Engine
          </span>
          <span className="text-xs font-mono text-[#757471]">Rule-Based Color & Season Match</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">
          Curated Outfit Recommendations
        </h1>
        <p className="text-sm text-[#757471] mt-1 max-w-2xl">
          Intelligent style heuristics evaluate your wardrobe by complementary palette harmonies, season appropriateness, and availability.
        </p>
      </div>

      {/* Filter / Preference Bar */}
      <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#1C1C1C] flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#757471]" /> Personalize Stylist Criteria
          </h3>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="fashion-button-primary text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing Wardrobe...' : 'Refresh Suggestions'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757471] mb-1.5">
              Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="fashion-input text-xs py-2"
            >
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757471] mb-1.5">
              Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="fashion-input text-xs py-2"
            >
              {SEASONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#757471] mb-1.5">
              Focus Color Palette
            </label>
            <select
              value={preferredColour}
              onChange={(e) => setPreferredColour(e.target.value)}
              className="fashion-input text-xs py-2"
            >
              {COLOURS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#FBEBEB] text-[#C45151] text-xs">
          {error}
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="bg-white rounded-card border border-[#E6E4DF] p-16 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-[#F8F4EC] text-[#C49E5A] flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1C1C1C]">Styling Combinations</h3>
          <p className="text-xs text-[#757471] max-w-sm mx-auto">
            Computing harmonic palettes, season compatibility scores, and filtering out items currently in laundry...
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-card border border-[#E6E4DF] p-16 text-center space-y-4 shadow-subtle">
          <Shirt className="w-12 h-12 text-[#9E9C98] mx-auto" />
          <h3 className="font-bold text-lg text-[#1C1C1C]">Not Enough Items For Recommendations</h3>
          <p className="text-xs text-[#757471] max-w-md mx-auto">
            Our recommendation engine needs at least a few tops and bottoms available in your digital closet to compose looks.
          </p>
          <div className="pt-2">
            <Link to="/closet?action=upload" className="fashion-button-primary text-xs">
              Upload Clothes to Closet
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((rec, idx) => {
            const isSaved = !!savedMap[idx];
            const isSaving = savingIndex === idx;

            return (
              <div 
                key={idx} 
                className="fashion-card p-6 flex flex-col justify-between group hover:border-[#1C1C1C] transition-all bg-white"
              >
                <div className="space-y-4">
                  {/* Top Bar: Score & Occasion */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="fashion-badge bg-[#1C1C1C] text-white text-[10px]">
                        {rec.occasion}
                      </span>
                      <span className="text-[10px] font-mono text-[#757471]">
                        {rec.season}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#F8F4EC] text-[#C49E5A] rounded-full text-xs font-bold border border-[#C49E5A]/30">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>{rec.compatibilityScore}% Compatibility</span>
                    </div>
                  </div>

                  {/* Title & Stylist Note */}
                  <div>
                    <h3 className="font-extrabold text-lg text-[#1C1C1C] group-hover:text-black">
                      {rec.name}
                    </h3>
                    <p className="text-xs text-[#757471] mt-1.5 leading-relaxed bg-[#FAF9F7] p-3 rounded-xl border border-[#E6E4DF]">
                      <span className="font-semibold text-[#1C1C1C]">Stylist Note:</span> {rec.stylistNotes}
                    </p>
                  </div>

                  {/* Visual Items Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {rec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-[#FAF9F7] rounded-xl p-2 border border-[#E6E4DF] text-center">
                        <div className="w-full h-24 rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center border border-[#E6E4DF]">
                          {item.clothingItemImage ? (
                            <img 
                              src={item.clothingItemImage} 
                              alt={item.clothingItemName} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                          ) : (
                            <Shirt className="w-6 h-6 text-[#9E9C98]" />
                          )}
                        </div>
                        <span className="text-[9px] font-bold uppercase text-[#757471] block truncate">
                          {item.outfitSlot}
                        </span>
                        <p className="text-[11px] font-medium text-[#1C1C1C] truncate" title={item.clothingItemName}>
                          {item.clothingItemName}
                        </p>
                        <span className="text-[10px] text-[#757471] block truncate">
                          {item.primaryColour}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Palette Harmony Tags */}
                  {rec.paletteHarmonies && rec.paletteHarmonies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rec.paletteHarmonies.map((harm, hIdx) => (
                        <span key={hIdx} className="text-[10px] font-medium bg-[#EAF2EC] text-[#4E7A5A] px-2 py-0.5 rounded-full">
                          ✓ {harm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-6 border-t border-[#E6E4DF] mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSaveLook(rec, idx)}
                      disabled={isSaved || isSaving}
                      className={`fashion-button text-xs px-4 py-2 flex items-center gap-1.5 ${
                        isSaved 
                          ? 'bg-[#EAF2EC] text-[#4E7A5A] border border-[#4E7A5A]/30 cursor-default' 
                          : 'fashion-button-primary'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Saved to Outfits
                        </>
                      ) : (
                        <>
                          <FolderHeart className="w-3.5 h-3.5" />
                          {isSaving ? 'Saving...' : 'Save to Outfits'}
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    to={isSaved ? `/calendar?scheduleOutfitId=${savedMap[idx]}` : `/studio`}
                    className="text-xs font-semibold text-[#1C1C1C] hover:underline flex items-center"
                  >
                    {isSaved ? 'Schedule on Calendar' : 'Customize in Studio'}
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

