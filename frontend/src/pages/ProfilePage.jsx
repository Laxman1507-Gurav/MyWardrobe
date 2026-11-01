import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Palette,
  Tag,
  Star,
  Check,
  Edit2,
  Shirt,
  Layers,
  TrendingUp,
  Clock,
  Save,
  X,
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STYLE_OPTIONS = ['Casual', 'Smart Casual', 'Minimalist', 'Formal', 'Streetwear', 'Sporty', 'Ethnic', 'Eclectic'];
const COLOUR_OPTIONS = ['Black', 'White', 'Grey', 'Beige', 'Navy', 'Olive', 'Brown', 'Burgundy', 'Green', 'Blue', 'Pink', 'Red', 'Yellow'];
const OCCASION_OPTIONS = ['Everyday', 'Work', 'Formal', 'Weekend', 'Dinner', 'Travel', 'Party', 'Gym'];

function MultiSelectPills({ label, options, selected, onToggle }) {
  const selectedSet = new Set((selected || '').split(',').map(s => s.trim()).filter(Boolean));

  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C]">{label}</label>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {options.map(opt => {
          const isSelected = selectedSet.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt, selectedSet)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all min-h-[38px] flex items-center active:scale-95 ${
                isSelected
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-[#F1EFEA] text-[#1C1C1C] hover:bg-[#E6E4DF]'
              }`}
            >
              {isSelected && <span className="mr-1.5 text-xs">✓</span>}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active section tab for mobile screens (<lg)
  const [activeMobileTab, setActiveMobileTab] = useState('preferences'); // 'preferences' | 'account'

  // Edit name
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Preferences form
  const [prefStyles, setPrefStyles] = useState('');
  const [prefColours, setPrefColours] = useState('');
  const [prefOccasions, setPrefOccasions] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/user/profile')
      .then(profileRes => {
        const p = profileRes.data;
        setProfile(p);
        setNameInput(p.fullName || '');
        setPrefStyles(p.preferredStyles || '');
        setPrefColours(p.preferredColours || '');
        setPrefOccasions(p.preferredOccasions || '');
      })
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePref = (value, currentSet, setter) => {
    const newSet = new Set(currentSet);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setter([...newSet].join(', '));
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      const res = await api.put('/user/profile', { fullName: nameInput.trim() });
      setProfile(prev => ({ ...prev, fullName: res.data.fullName }));
      setEditingName(false);
      setStatusMsg({ type: 'success', text: 'Name updated successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to update name.' });
    } finally {
      setSavingName(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await api.put('/user/preferences', {
        preferredStyles: prefStyles,
        preferredColours: prefColours,
        preferredOccasions: prefOccasions
      });
      setStatusMsg({ type: 'success', text: 'Style preferences saved! Your AI recommendations will reflect these choices.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setSavingPrefs(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 text-center text-xs text-[#757471]">
        Loading your wardrobe profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 text-center text-xs text-[#C45151]">
        Failed to load profile. Please refresh the page.
      </div>
    );
  }

  const initials = (profile.fullName || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32 md:pb-12">
      {/* Header */}
      <div className="border-b border-[#E6E4DF] pb-4 sm:pb-6">
        <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Account</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">Profile & Preferences</h1>
        <p className="text-xs sm:text-sm text-[#757471] mt-1">
          Personalize your wardrobe profile and style preferences to enhance AI outfit recommendations.
        </p>

        {/* Mobile Segmented Tab Control (Hidden on desktop) */}
        <div className="lg:hidden flex items-center bg-[#EFEFEA] p-1 rounded-xl mt-4">
          <button
            type="button"
            onClick={() => setActiveMobileTab('preferences')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'preferences'
                ? 'bg-white text-[#1C1C1C] shadow-sm'
                : 'text-[#757471] hover:text-[#1C1C1C]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Style Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('account')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeMobileTab === 'account'
                ? 'bg-white text-[#1C1C1C] shadow-sm'
                : 'text-[#757471] hover:text-[#1C1C1C]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Fit & Account</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      {statusMsg && (
        <div className={`
          fixed bottom-20 left-4 right-4 z-50 sm:static sm:bottom-auto sm:left-auto sm:right-auto sm:z-auto
          p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-lg sm:shadow-none animate-fade-in
          ${statusMsg.type === 'success' ? 'bg-[#EAF2EC] text-[#4E7A5A] border border-[#4E7A5A]/20' : 'bg-[#FBEBEB] text-[#C45151] border border-[#C45151]/20'}
        `}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="font-bold text-xs ml-3 p-1 flex-shrink-0">✕</button>
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

        {/* LEFT COLUMN: Profile & Fit Cards (Visible on desktop OR when mobile tab is 'account') */}
        <div className={`space-y-6 lg:block ${activeMobileTab === 'account' ? 'block' : 'hidden'}`}>
          {/* Avatar & Basic Info Card */}
          <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle p-5 sm:p-6 text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1C1C1C] flex items-center justify-center mx-auto text-white text-xl sm:text-2xl font-black">
              {initials}
            </div>

            {/* Name Edit */}
            {editingName ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="fashion-input text-sm text-center min-h-[44px]"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                  autoFocus
                />
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="px-4 py-2 rounded-full bg-[#1C1C1C] text-white text-xs font-semibold min-h-[38px] active:scale-95"
                  >
                    {savingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNameInput(profile.fullName); }}
                    className="px-4 py-2 rounded-full bg-[#F1EFEA] text-[#757471] text-xs font-semibold min-h-[38px] active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#1C1C1C]">{profile.fullName}</h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[#9E9C98] hover:text-[#1C1C1C] transition-colors p-1"
                    title="Edit name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#757471] mt-1 flex items-center justify-center gap-1.5 break-all">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">{profile.email}</span>
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 bg-[#F1EFEA] text-[#757471] rounded-full uppercase">
                  {profile.role?.replace('ROLE_', '') || 'User'}
                </span>
              </div>
            )}
          </div>

          {/* Personal Fit & Sizing Card */}
          <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#757471]">Personal Fit & Sizing</h3>
              <span className="text-[10px] bg-[#FAF9F7] border border-[#E6E4DF] px-2 py-0.5 rounded text-[#757471] font-mono">Custom</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF]/60 space-y-1">
                <span className="text-[10px] text-[#757471] uppercase font-semibold">Top Size</span>
                <p className="font-bold text-[#1C1C1C]">Medium (M)</p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF]/60 space-y-1">
                <span className="text-[10px] text-[#757471] uppercase font-semibold">Waist</span>
                <p className="font-bold text-[#1C1C1C]">32 Regular</p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF]/60 space-y-1">
                <span className="text-[10px] text-[#757471] uppercase font-semibold">Footwear</span>
                <p className="font-bold text-[#1C1C1C]">US 10 / EU 43</p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF]/60 space-y-1">
                <span className="text-[10px] text-[#757471] uppercase font-semibold">Silhouette</span>
                <p className="font-bold text-[#1C1C1C]">Tailored</p>
              </div>
            </div>
          </div>

          {/* Stylist Membership Card */}
          <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#757471]">Stylist Membership</h3>
            <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF]/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#757471]">Status</span>
                <span className="font-bold text-[#4E7A5A] bg-[#EAF2EC] px-2 py-0.5 rounded-full text-[10px]">Verified Member</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#757471]">AI Engine</span>
                <span className="font-bold text-[#1C1C1C] text-right ml-2">Palette & Harmony</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#757471]">Access</span>
                <span className="font-semibold text-[#1C1C1C]">Full Suite</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Style Preferences Form (Visible on desktop OR when mobile tab is 'preferences') */}
        <div className={`lg:col-span-2 ${activeMobileTab === 'preferences' ? 'block' : 'hidden lg:block'}`}>
          <form onSubmit={handleSavePreferences} className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle p-5 sm:p-6 space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#1C1C1C]">Style Preferences</h3>
              <p className="text-xs text-[#757471] mt-1">
                These selections feed directly into the AI Stylist recommendation engine to personalize your curated looks.
              </p>
            </div>

            {/* Preferred Styles */}
            <MultiSelectPills
              label="Preferred Styles"
              options={STYLE_OPTIONS}
              selected={prefStyles}
              onToggle={(val, currentSet) => handleTogglePref(val, currentSet, setPrefStyles)}
            />

            {/* Preferred Colours */}
            <MultiSelectPills
              label="Favourite Colour Palette"
              options={COLOUR_OPTIONS}
              selected={prefColours}
              onToggle={(val, currentSet) => handleTogglePref(val, currentSet, setPrefColours)}
            />

            {/* Preferred Occasions */}
            <MultiSelectPills
              label="Typical Occasions"
              options={OCCASION_OPTIONS}
              selected={prefOccasions}
              onToggle={(val, currentSet) => handleTogglePref(val, currentSet, setPrefOccasions)}
            />

            {/* Current saved values summary */}
            <div className="bg-[#FAF9F7] rounded-xl border border-[#E6E4DF] p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#757471]">Currently Saved</h4>
              <p className="text-xs text-[#1C1C1C]">
                <span className="font-semibold text-[#757471]">Styles: </span>
                {prefStyles || <span className="text-[#9E9C98] italic">Not set</span>}
              </p>
              <p className="text-xs text-[#1C1C1C]">
                <span className="font-semibold text-[#757471]">Colours: </span>
                {prefColours || <span className="text-[#9E9C98] italic">Not set</span>}
              </p>
              <p className="text-xs text-[#1C1C1C]">
                <span className="font-semibold text-[#757471]">Occasions: </span>
                {prefOccasions || <span className="text-[#9E9C98] italic">Not set</span>}
              </p>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={savingPrefs}
                className="fashion-button-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                {savingPrefs ? 'Saving Preferences...' : 'Save Style Preferences'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
