import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Shirt, 
  Layers, 
  Sparkles,
  Clock,
  Eye
} from 'lucide-react';
import api from '../services/api';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const OCCASIONS = ['Everyday', 'Work', 'Formal', 'Casual', 'Date Night', 'Weekend', 'Party', 'Travel'];

export default function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Current view date
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  // Month schedules
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Outfits list for scheduling
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loadingOutfits, setLoadingOutfits] = useState(false);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDaySchedule, setSelectedDaySchedule] = useState(null);

  // Schedule form state
  const [scheduleDate, setScheduleDate] = useState('');
  const [selectedOutfitId, setSelectedOutfitId] = useState('');
  const [scheduleOccasion, setScheduleOccasion] = useState('Everyday');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-open modal if URL has scheduleOutfitId
  useEffect(() => {
    const outfitParam = searchParams.get('scheduleOutfitId');
    if (outfitParam) {
      setSelectedOutfitId(outfitParam);
      // default date to tomorrow or today
      const todayStr = new Date().toISOString().split('T')[0];
      setScheduleDate(todayStr);
      setIsScheduleModalOpen(true);
      searchParams.delete('scheduleOutfitId');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  // Load schedules for current month
  const fetchSchedules = () => {
    setLoading(true);
    api.get(`/calendar/month?year=${year}&month=${month}`)
      .then(res => setSchedules(res.data))
      .catch(err => console.error('Error fetching calendar schedules:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSchedules();
  }, [year, month]);

  // Load saved outfits for modal picker
  useEffect(() => {
    setLoadingOutfits(true);
    api.get('/outfits')
      .then(res => setSavedOutfits(res.data))
      .catch(err => console.error('Error fetching outfits:', err))
      .finally(() => setLoadingOutfits(false));
  }, []);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create lookup map of date string (YYYY-MM-DD) -> schedule
  const scheduleMap = {};
  schedules.forEach(item => {
    scheduleMap[item.scheduledDate] = item;
  });

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Handle click on day
  const handleDayClick = (dayNumber) => {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const existing = scheduleMap[dStr];
    if (existing) {
      setSelectedDaySchedule(existing);
    } else {
      setScheduleDate(dStr);
      if (savedOutfits.length > 0 && !selectedOutfitId) {
        setSelectedOutfitId(savedOutfits[0].id);
      }
      setIsScheduleModalOpen(true);
    }
  };

  // Handle Submit Schedule
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOutfitId || !scheduleDate) return;

    setSubmitting(true);
    try {
      await api.post('/calendar', {
        outfitId: Number(selectedOutfitId),
        scheduledDate: scheduleDate,
        occasion: scheduleOccasion,
        notes: scheduleNotes
      });
      setIsScheduleModalOpen(false);
      setScheduleNotes('');
      fetchSchedules();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule outfit');
    } finally {
      setSubmitting(false);
    }
  };

  // Unschedule Look
  const handleUnschedule = async (scheduleId) => {
    if (!window.confirm('Remove this outfit from your calendar?')) return;
    try {
      await api.delete(`/calendar/${scheduleId}`);
      setSelectedDaySchedule(null);
      fetchSchedules();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DF] pb-6">
        <div>
          <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Wardrobe Schedule</span>
          <h1 className="text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">Outfit Calendar</h1>
          <p className="text-sm text-[#757471] mt-1">
            Map out your daily styles, plan ahead for upcoming events, and track wear frequency.
          </p>
        </div>

        <button
          onClick={() => {
            setScheduleDate(todayStr);
            if (savedOutfits.length > 0 && !selectedOutfitId) {
              setSelectedOutfitId(savedOutfits[0].id);
            }
            setIsScheduleModalOpen(true);
          }}
          className="fashion-button-primary text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Schedule New Look
        </button>
      </div>

      {/* Month Navigation Toolbar */}
      <div className="bg-white rounded-card p-4 border border-[#E6E4DF] shadow-subtle flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-extrabold text-[#1C1C1C] tracking-tight">
            {monthName} <span className="font-light text-[#757471]">{year}</span>
          </h2>
          <button
            onClick={handleGoToday}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF9F7] border border-[#E6E4DF] text-[#1C1C1C] hover:bg-[#EFEFEA] transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-[#F1EFEA] text-[#1C1C1C] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-[#F1EFEA] text-[#1C1C1C] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle overflow-hidden">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-[#E6E4DF] bg-[#FAF9F7] text-center">
          {DAYS_OF_WEEK.map((d, idx) => (
            <div key={idx} className="py-2.5 text-xs font-bold text-[#757471] tracking-wider uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E6E4DF]">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-28 bg-[#FAF9F7]/40 p-2" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const sched = scheduleMap[dStr];
            const isToday = dStr === todayStr;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => handleDayClick(dayNum)}
                className={`min-h-28 p-2 flex flex-col justify-between transition-colors cursor-pointer group hover:bg-[#FAF9F7] relative ${
                  isToday ? 'bg-[#FAF9F7]' : 'bg-white'
                }`}
              >
                {/* Date header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-[#1C1C1C] text-white font-bold'
                        : 'text-[#1C1C1C]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  
                  {!sched && (
                    <Plus className="w-3.5 h-3.5 text-transparent group-hover:text-[#9E9C98] transition-colors" />
                  )}
                </div>

                {/* Scheduled Outfit Card */}
                {sched ? (
                  <div className="mt-1 p-2 rounded-xl bg-[#FAF9F7] border border-[#E6E4DF] space-y-1 hover:border-[#1C1C1C] transition-all">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E7A5A]"></span>
                      <span className="text-[10px] font-bold text-[#1C1C1C] truncate block">
                        {sched.outfitName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-[#757471]">
                      <span className="uppercase font-semibold tracking-wider">{sched.occasion || 'Everyday'}</span>
                      <span className="text-[#9E9C98]">{sched.outfit?.items?.length || 0} pcs</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SCHEDULE OUTFIT MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3">
              <div>
                <h3 className="font-bold text-lg text-[#1C1C1C]">Schedule Look</h3>
                <p className="text-xs text-[#757471]">Pick a date and choose an outfit from your wardrobe.</p>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-[#757471] hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="fashion-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Select Outfit *
                </label>
                {savedOutfits.length === 0 ? (
                  <div className="p-4 bg-[#FAF9F7] rounded-xl border border-[#E6E4DF] text-xs text-[#757471] space-y-2">
                    <p>You haven't created any outfits yet.</p>
                    <Link to="/studio" className="font-bold text-[#1C1C1C] underline">
                      Go to Outfit Studio to create your first look
                    </Link>
                  </div>
                ) : (
                  <select
                    required
                    value={selectedOutfitId}
                    onChange={(e) => setSelectedOutfitId(e.target.value)}
                    className="fashion-input text-xs"
                  >
                    <option value="">-- Choose an Outfit --</option>
                    {savedOutfits.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.occasion} • {o.items?.length || 0} pieces)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Occasion
                </label>
                <select
                  value={scheduleOccasion}
                  onChange={(e) => setScheduleOccasion(e.target.value)}
                  className="fashion-input text-xs"
                >
                  {OCCASIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1C] mb-1.5">
                  Event Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client presentation, dinner at 8pm..."
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  className="fashion-input text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="fashion-button-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || savedOutfits.length === 0}
                  className="fashion-button-primary text-xs px-5 py-2"
                >
                  {submitting ? 'Saving...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAY SCHEDULE DETAIL DRAWER / MODAL */}
      {selectedDaySchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-3">
              <div>
                <span className="fashion-badge bg-[#EAF2EC] text-[#4E7A5A] text-[10px]">
                  Scheduled For {selectedDaySchedule.scheduledDate}
                </span>
                <h3 className="font-extrabold text-lg text-[#1C1C1C] mt-1">
                  {selectedDaySchedule.outfitName}
                </h3>
              </div>
              <button onClick={() => setSelectedDaySchedule(null)} className="text-[#757471] hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-[#757471]">
                <span className="font-bold uppercase tracking-wider text-[#1C1C1C]">Occasion:</span>
                <span>{selectedDaySchedule.occasion || 'Everyday'}</span>
              </div>

              {selectedDaySchedule.notes && (
                <div className="p-3 bg-[#FAF9F7] rounded-xl text-xs text-[#757471] border border-[#E6E4DF] italic">
                  "{selectedDaySchedule.notes}"
                </div>
              )}

              {/* Pieces Preview */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#757471] block mb-2">
                  Outfit Components ({selectedDaySchedule.outfit?.items?.length || 0})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDaySchedule.outfit?.items?.map(it => (
                    <div key={it.id} className="bg-[#FAF9F7] p-2 rounded-xl text-center border border-[#E6E4DF]">
                      <div className="w-full h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center mb-1">
                        {it.clothingItemImage ? (
                          <img src={it.clothingItemImage} alt={it.clothingItemName} className="w-full h-full object-cover" />
                        ) : (
                          <Shirt className="w-5 h-5 text-[#9E9C98]" />
                        )}
                      </div>
                      <span className="text-[9px] font-bold uppercase text-[#757471] block truncate">{it.outfitSlot}</span>
                      <p className="text-[10px] text-[#1C1C1C] truncate">{it.clothingItemName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E6E4DF] flex items-center justify-between">
              <button
                onClick={() => handleUnschedule(selectedDaySchedule.id)}
                className="text-xs text-[#C45151] hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Unschedule
              </button>

              <button
                onClick={() => setSelectedDaySchedule(null)}
                className="fashion-button-primary text-xs px-4 py-2"
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

