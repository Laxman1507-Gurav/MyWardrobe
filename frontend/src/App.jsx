import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Shirt,
  Sparkles,
  Calendar,
  Home,
  Plus,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  FolderHeart,
  User,
  LogOut,
  ArrowRight,
  ChevronRight,
  History,
  BookOpen,
  Compass,
  Award,
  ShieldCheck,
  Tag
} from 'lucide-react';
import api from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClosetPage from './pages/ClosetPage';
import OutfitStudioPage from './pages/OutfitStudioPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LaundryCarePage from './pages/LaundryCarePage';
import ProfilePage from './pages/ProfilePage';
import WelcomeScreen from './components/WelcomeScreen';

// Top Navigation Bar
function TopNav({ showNavBar }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E6E4DF]">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-2xl tracking-tighter text-[#1C1C1C]">MyWardrobe</span>
          </Link>
          {showNavBar && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium animate-fade-in">
              <Link to="/" className="text-[#1C1C1C] hover:text-black">Home</Link>
              <Link to="/closet" className="text-[#757471] hover:text-black transition-colors">Digital Closet</Link>
              <Link to="/studio" className="text-[#757471] hover:text-black transition-colors">Outfit Studio</Link>
              <Link to="/ai-outfits" className="text-[#757471] hover:text-black transition-colors">AI Stylist</Link>
              <Link to="/calendar" className="text-[#757471] hover:text-black transition-colors">Calendar</Link>
              <Link to="/analytics" className="text-[#757471] hover:text-black transition-colors">Analytics</Link>
              <Link to="/laundry" className="text-[#757471] hover:text-black transition-colors">Laundry</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 text-xs font-semibold text-[#1C1C1C] hover:text-[#4E7A5A] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-[10px] font-bold">
                  {(user?.fullName || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user?.fullName || 'Alex'}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-[#757471] hover:text-[#C45151] rounded-full hover:bg-[#EFEFEA] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// Mobile Bottom Navigation Bar (Matching Reference Visual)
function MobileBottomNav({ onOpenActionModal }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E6E4DF] px-6 py-2">
      <div className="flex items-center justify-between relative max-w-md mx-auto">
        <Link
          to="/closet"
          className={`flex flex-col items-center py-1 ${isActive('/closet') ? 'text-[#1C1C1C]' : 'text-[#757471]'}`}
        >
          <Shirt className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Closet</span>
        </Link>

        <Link
          to="/ai-outfits"
          className={`flex flex-col items-center py-1 ${isActive('/ai-outfits') ? 'text-[#1C1C1C]' : 'text-[#757471]'}`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">AI Outfits</span>
        </Link>

        {/* Center Floating Action Button (+) */}
        <div className="relative -top-5">
          <button
            onClick={onOpenActionModal}
            className="w-13 h-13 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            aria-label="Add or Plan"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <Link
          to="/calendar"
          className={`flex flex-col items-center py-1 ${isActive('/calendar') ? 'text-[#1C1C1C]' : 'text-[#757471]'}`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Calendar</span>
        </Link>

        <Link
          to="/"
          className={`flex flex-col items-center py-1 ${isActive('/') ? 'text-[#1C1C1C]' : 'text-[#757471]'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>
      </div>
    </div>
  );
}

// Quick Action Modal
function QuickActionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DF]">
          <h3 className="font-semibold text-lg text-[#1C1C1C]">Create & Manage</h3>
          <button onClick={onClose} className="text-[#757471] hover:text-black">✕</button>
        </div>

        <div className="space-y-2">
          <Link
            to="/closet?action=upload"
            onClick={onClose}
            className="flex items-center p-3 rounded-xl hover:bg-[#F7F7F5] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center mr-3 text-[#1C1C1C] group-hover:bg-[#1C1C1C] group-hover:text-white transition-colors">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C]">Add Clothing Item</p>
              <p className="text-xs text-[#757471]">Upload photo and clothing details</p>
            </div>
          </Link>

          <Link
            to="/studio"
            onClick={onClose}
            className="flex items-center p-3 rounded-xl hover:bg-[#F7F7F5] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center mr-3 text-[#1C1C1C] group-hover:bg-[#1C1C1C] group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C]">Create New Outfit</p>
              <p className="text-xs text-[#757471]">Combine tops, bottoms, and accessories</p>
            </div>
          </Link>

          <Link
            to="/calendar"
            onClick={onClose}
            className="flex items-center p-3 rounded-xl hover:bg-[#F7F7F5] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center mr-3 text-[#1C1C1C] group-hover:bg-[#1C1C1C] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C]">Plan an Outfit</p>
              <p className="text-xs text-[#757471]">Schedule look on your outfit calendar</p>
            </div>
          </Link>

          <Link
            to="/laundry"
            onClick={onClose}
            className="flex items-center p-3 rounded-xl hover:bg-[#F7F7F5] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center mr-3 text-[#1C1C1C] group-hover:bg-[#1C1C1C] group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C]">Laundry Tracker</p>
              <p className="text-xs text-[#757471]">Manage clothing care and wash history</p>
            </div>
          </Link>

          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center p-3 rounded-xl hover:bg-[#F7F7F5] transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center mr-3 text-[#1C1C1C] group-hover:bg-[#1C1C1C] group-hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-sm text-[#1C1C1C]">Profile & Preferences</p>
              <p className="text-xs text-[#757471]">Edit style preferences and account details</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Dressing scene profiles
const DRESSING_SCENES = [
  {
    id: 'smart-casual',
    title: 'Smart Casual Scene',
    tag: 'Versatile Tailoring',
    formula: 'Unstructured blazer + fine-gauge merino knit + relaxed chinos + clean leather sneakers.',
    insight: 'Balance sharp geometry with soft textures. Swap a rigid dress shirt for a merino polo to bridge daytime meetings and evening reservations.',
    palette: ['Navy', 'Off-White', 'Camel', 'Olive']
  },
  {
    id: 'evening-cocktail',
    title: 'Evening & Dinner Scene',
    tag: 'Low-Light Elegance',
    formula: 'Monochromatic dark tones + textural contrast (merino/silk blend) + Chelsea boots + minimal watch.',
    insight: 'Under evening lights, silhouette and fabric texture matter more than loud color. Keep prints subtle to emphasize clean drape.',
    palette: ['Charcoal', 'Burgundy', 'Deep Black', 'Midnight Navy']
  },
  {
    id: 'business-minimalist',
    title: 'Modern Business Scene',
    tag: 'Executive Ease',
    formula: 'Tailored wool trousers + crisp Japanese poplin shirt + unlined overshirt or cardigan + derby shoes.',
    insight: 'Replace outdated heavy shoulder pads with relaxed natural shoulders. A cohesive color palette signals quiet authority.',
    palette: ['Grey', 'White', 'Navy', 'Stone']
  },
  {
    id: 'weekend-japandi',
    title: 'Weekend & Travel Scene',
    tag: 'Japandi Neutral Flow',
    formula: 'Boxy organic cotton tee + pleated linen trousers or selvedge denim + suede slip-ons.',
    insight: 'Prioritize breathability and natural draping. The beauty lies in the subtle slub and organic imperfections of raw natural weaves.',
    palette: ['Sand', 'Sage', 'Clay', 'Warm Taupe']
  }
];

// Sartorial knowledge & fashion theory
const STYLE_KNOWLEDGE = [
  {
    title: 'The 60-30-10 Color Chemistry',
    category: 'Color Theory',
    body: 'Anchor 60% of your look in a foundational neutral (Charcoal, Stone, or Off-White), 30% in a complementary harmony (Sage or Navy), and 10% in an accent (Terracotta or Champagne).'
  },
  {
    title: 'The Rule of Thirds & Proportion',
    category: 'Silhouettes',
    body: 'Avoid splitting your body 50/50. Pair higher-waisted bottoms with a tucked top (1/3 torso, 2/3 legs) or a long overcoat over cropped pants to naturally elongate your posture.'
  },
  {
    title: 'Cost-Per-Wear (CPW) Economics',
    category: 'Capsule Science',
    body: 'Real luxury is frequency of wear. A $180 raw denim piece worn 60 times is $3.00/wear, far outperforming cheap fast-fashion pieces destined for early landfill.'
  },
  {
    title: 'Natural Fiber Care & Longevity',
    category: 'Fabric Care',
    body: 'Air out natural wool, cashmere, and linen rather than dry-cleaning frequently. Natural lanolin is self-cleaning, and gentle steaming restores dimensional fiber memory.'
  }
];

// Dashboard Page
function HomeDashboard({ health }) {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ items: 0, outfits: 0, favorites: 0, laundry: 0 });
  const [todayOutfit, setTodayOutfit] = useState(null);
  const [wearHistory, setWearHistory] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch clothing items for stats
      api.get('/clothing')
        .then(res => {
          const items = res.data;
          setStats(prev => ({
            ...prev,
            items: items.length,
            favorites: items.filter(i => i.isFavourite).length,
            laundry: items.filter(i => i.availabilityStatus === 'IN_LAUNDRY').length
          }));
        })
        .catch(() => { });

      // Fetch outfits count
      api.get('/outfits')
        .then(res => {
          setStats(prev => ({ ...prev, outfits: res.data.length }));
        })
        .catch(() => { });

      // Fetch today's scheduled outfit
      api.get('/calendar/today')
        .then(res => {
          if (res.data && res.data.outfitName) setTodayOutfit(res.data);
        })
        .catch(() => { });

      // Fetch wear history from analytics overview
      api.get('/analytics/overview')
        .then(res => {
          if (res.data && res.data.costPerWearItems) {
            const worn = res.data.costPerWearItems.filter(i => i.wearCount > 0);
            setWearHistory(worn.slice(0, 4));
          }
        })
        .catch(() => { });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16 pb-28 md:pb-16 animate-fade-in">
        {/* Editorial Hero Section */}
        <section className="bg-gradient-to-b from-[#1C1C1C] via-[#242422] to-[#1C1C1C] text-white rounded-3xl p-6 sm:p-12 md:p-16 border border-[#333333] shadow-card relative overflow-hidden">
          {/* Subtle ambient lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C99A4A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4E7A5A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-wider text-[#C99A4A] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Wardrobe Ecosystem & AI Stylist</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Curate, organize, and elevate your personal wardrobe.
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#E6E4DF]/80 leading-relaxed max-w-2xl">
              MyWardrobe is an all-in-one digital wardrobe management platform. Digitize every garment you own, style bespoke outfits with harmonic color chemistry, plan your calendar, and track clothing longevity effortlessly.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#1C1C1C] rounded-xl font-bold text-sm hover:bg-[#F7F7F5] transition-all shadow-lg active:scale-[0.98]"
              >
                Let's enter your wardrobe <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-semibold text-sm transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

        {/* Info About Wardrobe Website: Core Capabilities */}
        <section className="space-y-6">
          <div className="border-b border-[#E6E4DF] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Platform Suite</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-1.5 tracking-tight">
                Everything you need for your personal style
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#757471] max-w-md">
              A comprehensive architecture built to eliminate morning decision fatigue and give you full control over your closet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <Shirt className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">Digital Closet Catalog</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                Photograph, upload, and catalog every garment in your wardrobe. Filter items by categories, seasonal suitability, color palettes, and fabric types with instant search.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">Interactive Outfit Studio</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                A virtual canvas for building looks. Layer tops, bottoms, outerwear, footwear, and accessories to compose ready-to-wear ensembles without creating a mess in your bedroom.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <Sparkles className="w-6 h-6 stroke-[1.5] text-[#C99A4A]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">AI Stylist & Harmony Engine</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                Intelligent styling algorithms scoring looks by occasion, climate, and harmonic color chemistry (60-30-10 theory). Receive bespoke recommendations tailored to your day.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">7-Column Outfit Calendar</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                Plan and schedule outfits days or weeks in advance. Organize looks for executive meetings, dinner dates, casual weekends, and travel itineraries seamlessly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <TrendingUp className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">Cost-Per-Wear Analytics</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                Track rotation frequency, analyze your most valuable essentials, and discover true cost-per-wear economics to build a more conscious, high-utility capsule wardrobe.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="fashion-card p-6 sm:p-7 space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#1C1C1C]">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1C1C]">Laundry & Fabric Care</h3>
              <p className="text-xs text-[#757471] leading-relaxed">
                Monitor garment availability, washing cycles, dry cleaning schedules, and natural fiber care guidelines so your favorite pieces remain pristine for years.
              </p>
            </div>
          </div>
        </section>

        {/* How MyWardrobe Works */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E4DF] shadow-subtle space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="fashion-badge bg-[#F8F4EC] text-[#C49E5A]">Simple Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] tracking-tight">
              How MyWardrobe Works
            </h2>
            <p className="text-xs sm:text-sm text-[#757471]">
              Three intuitive steps to transform your relationship with your wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF]/70 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#C99A4A]">01 · DIGITIZE</span>
              <h4 className="text-base font-bold text-[#1C1C1C]">Catalog Your Pieces</h4>
              <p className="text-xs text-[#757471] leading-relaxed">
                Snap photos of your clothes and upload them with tags for category, primary color, seasonal versatility, and fabric.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF]/70 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#C99A4A]">02 · STYLE & PLAN</span>
              <h4 className="text-base font-bold text-[#1C1C1C]">Assemble Looks</h4>
              <p className="text-xs text-[#757471] leading-relaxed">
                Combine tops, bottoms, and layers on the virtual canvas, or let the AI stylist suggest outfits tailored to your day's agenda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F7] border border-[#E6E4DF]/70 space-y-2.5">
              <span className="text-xs font-mono font-bold text-[#C99A4A]">03 · DRESS SMART</span>
              <h4 className="text-base font-bold text-[#1C1C1C]">Wear With Confidence</h4>
              <p className="text-xs text-[#757471] leading-relaxed">
                Wake up knowing exactly what to wear, log your wear count, and maximize the real value of every piece in your closet.
              </p>
            </div>
          </div>
        </section>

        {/* Dressing Scene & Sartorial Knowledge Masterclass */}
        <section className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E4DF] pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1C1C1C]">Dressing Scenes & Sartorial Knowledge</h3>
                <p className="text-xs text-[#757471]">Curated styling formulas, occasion decoders, and Japanese-Scandinavian principles</p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#757471] uppercase tracking-wider bg-[#F1EFEA] px-2.5 py-1 rounded-full">
              Style Architecture
            </span>
          </div>

          {/* Scene Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DRESSING_SCENES.map(scene => (
              <div key={scene.id} className="bg-white rounded-card border border-[#E6E4DF] p-6 shadow-subtle hover:border-[#1C1C1C] transition-all space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="fashion-badge bg-[#F8F4EC] text-[#C49E5A] text-[10px] font-bold">
                    {scene.tag}
                  </span>
                  <span className="text-[11px] font-mono text-[#757471]">Scene Guide</span>
                </div>
                <h4 className="font-extrabold text-base text-[#1C1C1C]">{scene.title}</h4>
                <div className="text-xs text-[#1C1C1C] bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E6E4DF]/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#757471] block">Winning Formula</span>
                  <p className="font-medium leading-relaxed">{scene.formula}</p>
                </div>
                <p className="text-xs text-[#757471] leading-relaxed">
                  {scene.insight}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-[#757471] uppercase font-bold mr-1">Harmonic Palette:</span>
                  {scene.palette.map(c => (
                    <span key={c} className="text-[10px] px-2.5 py-0.5 bg-[#F1EFEA] rounded-full text-[#1C1C1C] font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Knowledge & Theory Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {STYLE_KNOWLEDGE.map(k => (
              <div key={k.title} className="bg-[#FAF9F7] rounded-2xl border border-[#E6E4DF] p-5 space-y-2.5 hover:bg-white hover:border-[#1C1C1C] transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#757471] block">
                  {k.category}
                </span>
                <h5 className="font-bold text-sm text-[#1C1C1C]">{k.title}</h5>
                <p className="text-[11px] text-[#757471] leading-relaxed">
                  {k.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E4DF] shadow-card text-center space-y-4">
          <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Start Now</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C1C1C] tracking-tight">
            Ready to experience your curated digital closet?
          </h2>
          <p className="text-xs sm:text-sm text-[#757471] max-w-md mx-auto">
            Sign in to access your wardrobe or create a free account to begin digitizing your collection.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="fashion-button-primary text-sm px-7 py-3 w-full sm:w-auto text-center"
            >
              Let's enter your wardrobe <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </Link>
            <Link
              to="/register"
              className="fashion-button-secondary text-sm px-7 py-3 w-full sm:w-auto text-center"
            >
              Register An Account
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated User Dashboard
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-10 pb-28 md:pb-12">
      {/* Editorial Welcome Header */}
      <section className="space-y-2">
        <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">
          Welcome back, {user?.fullName || 'Alex'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1C1C]">
          Your wardrobe is ready for everyday's plans.
        </h1>
        <p className="text-[#757471] text-sm sm:text-base max-w-2xl">
          Everything you own, organized in a high-fashion digital space. Effortless outfit styling, calendar scheduling, and intelligent recommendations.
        </p>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/closet" className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle hover:border-[#1C1C1C] transition-colors block">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-xs uppercase tracking-wider font-semibold">Clothing Items</span>
            <Shirt className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-[#1C1C1C]">{stats.items}</p>
          <span className="text-[11px] text-[#757471]">Across 16 categories</span>
        </Link>

        <Link to="/studio" className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle hover:border-[#1C1C1C] transition-colors block">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-xs uppercase tracking-wider font-semibold">Saved Outfits</span>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-[#1C1C1C]">{stats.outfits}</p>
          <span className="text-[11px] text-[#757471]">Ready to wear</span>
        </Link>

        <Link to="/closet?favorites=true" className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle hover:border-[#1C1C1C] transition-colors block">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-xs uppercase tracking-wider font-semibold">Favorites</span>
            <FolderHeart className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-[#1C1C1C]">{stats.favorites}</p>
          <span className="text-[11px] text-[#757471]">Top essentials</span>
        </Link>

        <Link to="/closet?laundry=true" className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle hover:border-[#1C1C1C] transition-colors block">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-xs uppercase tracking-wider font-semibold">In Laundry</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-[#1C1C1C]">{stats.laundry}</p>
          <span className="text-[11px] text-[#757471]">Needs washing</span>
        </Link>
      </section>

      {/* Today's Outfit Highlight Card */}
      <section className="bg-white rounded-card border border-[#E6E4DF] p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="fashion-badge bg-[#F8F4EC] text-[#C49E5A]">Today's Outfit</div>
          {todayOutfit ? (
            <>
              <h2 className="text-2xl font-bold text-[#1C1C1C]">{todayOutfit.outfitName}</h2>
              <p className="text-sm text-[#757471]">
                {todayOutfit.occasion && <span className="font-medium capitalize">{todayOutfit.occasion.replace('_', ' ')}</span>}
                {todayOutfit.notes && <> · {todayOutfit.notes}</>}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/calendar" className="fashion-button-primary">
                  View Calendar <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/studio" className="fashion-button-secondary">
                  <Layers className="w-4 h-4 mr-2" /> Edit Outfit
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#1C1C1C]">No outfit planned for today</h2>
              <p className="text-sm text-[#757471]">
                Select items from your closet or let the AI recommendation engine suggest a look tailored to today's schedule and season.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/studio" className="fashion-button-primary">
                  Plan Today's Outfit <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/ai-outfits" className="fashion-button-secondary">
                  <Sparkles className="w-4 h-4 mr-2" /> Suggest with AI
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="w-full md:w-72 h-48 bg-[#F1EFEA] rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-[#E6E4DF]/60">
          {todayOutfit ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-[#4E7A5A] stroke-[1.5]" />
              <p className="text-xs text-[#4E7A5A] mt-3 font-semibold">Outfit planned!</p>
              <span className="text-[10px] text-[#9E9C98] mt-1">{todayOutfit.outfitName}</span>
            </>
          ) : (
            <>
              <Shirt className="w-10 h-10 text-[#9E9C98] stroke-[1.5]" />
              <p className="text-xs text-[#757471] mt-3 font-medium">Your closet canvas is ready</p>
              <span className="text-[10px] text-[#9E9C98]">Add clothing items to compose outfits</span>
            </>
          )}
        </div>
      </section>

      {/* Curated Action Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#1C1C1C]">Explore Modules</h3>
          <span className="text-xs text-[#757471]">Full-Stack Suite</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link to="/closet" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <Shirt className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Digital Closet <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Upload photographs, organize by categories, filter by season, colors, and fabric.
            </p>
          </Link>

          <Link to="/studio" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Outfit Studio <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Virtual styling canvas. Combine tops, bottoms, outerwear, footwear, and accessories.
            </p>
          </Link>

          <Link to="/ai-outfits" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              AI Recommendation <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Java rule-based recommendation engine scoring looks by occasion, season, and palette.
            </p>
          </Link>

          <Link to="/calendar" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Outfit Calendar <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              7-column month planner. Schedule looks for work, dinner, events, and everyday.
            </p>
          </Link>

          <Link to="/analytics" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Wardrobe Analytics <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Recharts visualizations, cost-per-wear formulas, color palette breakdown.
            </p>
          </Link>

          <Link to="/laundry" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Clothing Care & Laundry <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Track item availability, laundry states, dry cleaning, and fabric care instructions.
            </p>
          </Link>

          <Link to="/profile" className="fashion-card p-6 group">
            <div className="w-10 h-10 rounded-full bg-[#F1EFEA] flex items-center justify-center text-[#1C1C1C] mb-4 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1C1C1C] flex items-center justify-between">
              Profile & Preferences <ChevronRight className="w-4 h-4 text-[#757471] group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-[#757471] mt-2">
              Set your style preferences, favourite colours, and occasions to personalise AI recommendations.
            </p>
          </Link>
        </div>
      </section>

      {/* Used Clothes & Wear History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1C1C1C]">Used Clothes & Wear History</h3>
              <p className="text-xs text-[#757471]">Rotation frequency and cost-per-wear value of your worn pieces</p>
            </div>
          </div>
          <Link to="/analytics" className="text-xs font-semibold text-[#757471] hover:text-[#1C1C1C] flex items-center">
            View Analytics <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {wearHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wearHistory.map(item => (
              <div key={item.id} className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle hover:border-[#1C1C1C] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="fashion-badge bg-[#F1EFEA] text-[#1C1C1C] text-[10px]">
                    {item.categoryName || 'Garment'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#4E7A5A] bg-[#EAF2EC] px-2.5 py-0.5 rounded-full">
                    {item.wearCount} {item.wearCount === 1 ? 'Wear' : 'Wears'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1C1C] truncate">{item.name}</h4>
                  <p className="text-xs text-[#757471] mt-1 flex items-center justify-between">
                    <span>Cost-per-wear:</span>
                    <span className="font-bold text-[#1C1C1C]">${(item.costPerWear || 0).toFixed(2)}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E6E4DF]/60 flex items-center justify-between text-[11px] text-[#757471]">
                  <span>Utilization:</span>
                  <span className="font-semibold text-[#1C1C1C]">{item.valueRating?.replace('_', ' ') || 'Active Rotation'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card border border-[#E6E4DF] p-6 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F7] border border-[#E6E4DF] flex items-center justify-center text-[#9E9C98]">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1C1C]">Start Logging Your Wear History</h4>
                <p className="text-xs text-[#757471] mt-0.5">
                  Plan looks in the Calendar or build outfits in the Studio. Worn pieces will automatically populate here with cost-per-wear insights.
                </p>
              </div>
            </div>
            <Link to="/calendar" className="fashion-button-primary text-xs px-4 py-2 flex items-center whitespace-nowrap">
              Plan in Calendar <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Dressing Scene & Sartorial Knowledge Masterclass */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E4DF] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1C1C1C]">Dressing Scenes & Sartorial Knowledge</h3>
              <p className="text-xs text-[#757471]">Curated styling formulas, occasion decoders, and Japanese-Scandinavian principles</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#757471] uppercase tracking-wider bg-[#F1EFEA] px-2.5 py-1 rounded-full">
            Style Architecture
          </span>
        </div>

        {/* Scene Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DRESSING_SCENES.map(scene => (
            <div key={scene.id} className="bg-white rounded-card border border-[#E6E4DF] p-6 shadow-subtle hover:border-[#1C1C1C] transition-all space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="fashion-badge bg-[#F8F4EC] text-[#C49E5A] text-[10px] font-bold">
                  {scene.tag}
                </span>
                <span className="text-[11px] font-mono text-[#757471]">Scene Guide</span>
              </div>
              <h4 className="font-extrabold text-base text-[#1C1C1C]">{scene.title}</h4>
              <div className="text-xs text-[#1C1C1C] bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E6E4DF]/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#757471] block">Winning Formula</span>
                <p className="font-medium leading-relaxed">{scene.formula}</p>
              </div>
              <p className="text-xs text-[#757471] leading-relaxed">
                {scene.insight}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-[#757471] uppercase font-bold mr-1">Harmonic Palette:</span>
                {scene.palette.map(c => (
                  <span key={c} className="text-[10px] px-2.5 py-0.5 bg-[#F1EFEA] rounded-full text-[#1C1C1C] font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge & Theory Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {STYLE_KNOWLEDGE.map(k => (
            <div key={k.title} className="bg-[#FAF9F7] rounded-2xl border border-[#E6E4DF] p-5 space-y-2.5 hover:bg-white hover:border-[#1C1C1C] transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#757471] block">
                {k.category}
              </span>
              <h5 className="font-bold text-sm text-[#1C1C1C]">{k.title}</h5>
              <p className="text-[11px] text-[#757471] leading-relaxed">
                {k.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#757471]">Verifying credentials...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Helper to detect if user has an existing login/register auth session
const hasAuthToken = () => {
  try {
    return !!localStorage.getItem('mywardrobe_token');
  } catch {
    return false;
  }
};

// Main App Layout container with responsive auth detection
function AppLayout() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [health, setHealth] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Welcome screen rule:
  // When user logs in/registers, the welcome page should NEVER be seen when they refresh the website!
  // Only first-time unauthenticated guests see it on initial landing.
  const [showWelcome, setShowWelcome] = useState(() => {
    if (hasAuthToken()) return false;
    try {
      return !sessionStorage.getItem('mywardrobe_welcomed');
    } catch {
      return false;
    }
  });

  // When user logs in or registers, unhide the nav bar everywhere!
  // Hidden only for unauthenticated guests on the home page and on auth pages.
  const showNavBar = isAuthenticated && !isAuthPage;

  useEffect(() => {
    api.get('/health')
      .then(res => setHealth(res.data))
      .catch(err => {
        console.warn('Backend not yet reachable on /api/health:', err.message);
      });
  }, []);

  // When user is authenticated or logs in/registers, dismiss welcome screen immediately
  useEffect(() => {
    if (isAuthenticated || hasAuthToken()) {
      setShowWelcome(false);
      try {
        sessionStorage.setItem('mywardrobe_welcomed', 'true');
      } catch {}
      return;
    }

    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        try {
          sessionStorage.setItem('mywardrobe_welcomed', 'true');
        } catch {}
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showWelcome]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col font-sans w-full overflow-x-hidden">
      {/* Simple Welcome Loading Screen (Disabled on refresh for logged-in/registered users) */}
      <WelcomeScreen isVisible={showWelcome} />

      <TopNav showNavBar={showNavBar} />

      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<HomeDashboard health={health} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/closet"
            element={
              <ProtectedRoute>
                <ClosetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <OutfitStudioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-outfits"
            element={
              <ProtectedRoute>
                <AIRecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laundry"
            element={
              <ProtectedRoute>
                <LaundryCarePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showNavBar && (
        <>
          <MobileBottomNav onOpenActionModal={() => setIsActionModalOpen(true)} />
          <QuickActionModal
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
