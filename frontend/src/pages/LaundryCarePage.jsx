import React, { useState, useEffect } from 'react';
import {
  Clock,
  Shirt,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  WashingMachine,
  Sparkles,
  Search,
  Filter,
  ArrowDown,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';

const STATUS_OPTIONS = [
  { value: '', label: 'All Items' },
  { value: 'IN_LAUNDRY', label: 'Currently In Laundry' },
  { value: 'AVAILABLE', label: 'Available (Clean)' }
];

const statusConfig = {
  AVAILABLE: {
    label: 'Available',
    dot: 'bg-[#4E7A5A]',
    badge: 'bg-[#EAF2EC] text-[#4E7A5A]'
  },
  IN_LAUNDRY: {
    label: 'In Laundry',
    dot: 'bg-[#C49E5A]',
    badge: 'bg-[#F8F4EC] text-[#C49E5A]'
  },
  UNAVAILABLE: {
    label: 'Unavailable',
    dot: 'bg-[#C45151]',
    badge: 'bg-[#FBEBEB] text-[#C45151]'
  }
};

export default function LaundryCarePage() {
  const [allItems, setAllItems] = useState([]);
  const [laundryHistory, setLaundryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'history'
  const [actionLoading, setActionLoading] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);

  // Load clothing items (for the tracker view)
  const fetchItems = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.availability = statusFilter;
    if (search.trim()) params.query = search.trim();

    api.get('/clothing', { params })
      .then(res => setAllItems(res.data))
      .catch(err => console.error('Failed to fetch items:', err))
      .finally(() => setLoading(false));
  };

  // Load laundry history log
  const fetchHistory = () => {
    api.get('/laundry/history')
      .then(res => setLaundryHistory(res.data))
      .catch(err => console.error('Failed to fetch laundry history:', err));
  };

  useEffect(() => {
    fetchItems();
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  // Send item to laundry
  const handleSendToLaundry = async (item) => {
    setActionLoading(prev => ({ ...prev, [item.id]: 'laundry' }));
    try {
      await api.post('/laundry/action', {
        clothingItemId: item.id,
        status: 'SENT_TO_LAUNDRY',
        notes: 'Sent to laundry via Care Tracker'
      });
      setStatusMsg({ type: 'info', text: `"${item.name}" marked as In Laundry.` });
      fetchItems();
      fetchHistory();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [item.id]: null }));
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Mark item as clean
  const handleMarkClean = async (item) => {
    setActionLoading(prev => ({ ...prev, [item.id]: 'clean' }));
    try {
      await api.post(`/laundry/${item.id}/clean`);
      setStatusMsg({ type: 'success', text: `"${item.name}" is clean and back in your closet!` });
      fetchItems();
      fetchHistory();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [item.id]: null }));
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const inLaundryCount = allItems.filter(i => i.availabilityStatus === 'IN_LAUNDRY').length;
  const availableCount = allItems.filter(i => i.availabilityStatus === 'AVAILABLE').length;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DF] pb-6">
        <div>
          <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Care Management</span>
          <h1 className="text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">Laundry & Clothing Care</h1>
          <p className="text-sm text-[#757471] mt-1 max-w-2xl">
            Track the availability state of each piece. Send items to laundry, dry cleaning, and mark them clean when ready.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#EFEFEA] p-1 rounded-full self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'tracker'
              ? 'bg-white text-[#1C1C1C] shadow-sm'
              : 'text-[#757471] hover:text-[#1C1C1C]'
              }`}
          >
            Item Tracker
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === 'history'
              ? 'bg-white text-[#1C1C1C] shadow-sm'
              : 'text-[#757471] hover:text-[#1C1C1C]'
              }`}
          >
            Wash Log
          </button>
        </div>
      </div>

      {/* Status Message Toast */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${statusMsg.type === 'success'
            ? 'bg-[#EAF2EC] text-[#4E7A5A]'
            : statusMsg.type === 'info'
              ? 'bg-[#F8F4EC] text-[#C49E5A]'
              : 'bg-[#FBEBEB] text-[#C45151]'
            }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="font-bold text-xs">✕</button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle text-center">
          <div className="w-8 h-8 rounded-full bg-[#EAF2EC] flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#4E7A5A]" />
          </div>
          <p className="text-2xl font-black text-[#1C1C1C]">{availableCount}</p>
          <span className="text-[11px] font-semibold text-[#4E7A5A] uppercase tracking-wide">Clean & Available</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle text-center">
          <div className="w-8 h-8 rounded-full bg-[#F8F4EC] flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4 text-[#C49E5A]" />
          </div>
          <p className="text-2xl font-black text-[#1C1C1C]">{inLaundryCount}</p>
          <span className="text-[11px] font-semibold text-[#C49E5A] uppercase tracking-wide">In Laundry</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle text-center">
          <div className="w-8 h-8 rounded-full bg-[#EFEFEA] flex items-center justify-center mx-auto mb-2">
            <Shirt className="w-4 h-4 text-[#757471]" />
          </div>
          <p className="text-2xl font-black text-[#1C1C1C]">{allItems.length}</p>
          <span className="text-[11px] font-semibold text-[#757471] uppercase tracking-wide">Total Items</span>
        </div>
      </div>

      {/* ITEM TRACKER TAB */}
      {activeTab === 'tracker' && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="bg-white rounded-card p-4 border border-[#E6E4DF] shadow-subtle flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              {!search && (
                <Search className="w-4 h-4 text-[#9E9C98] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150" />
              )}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`fashion-input text-xs ${!search ? 'pl-12' : 'pl-4'} py-2 bg-[#FAF9F7] transition-all`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9C98] hover:text-[#1C1C1C] text-xs font-bold"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#757471] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="fashion-input text-xs pl-10 py-2 bg-[#FAF9F7] pr-8 w-full sm:w-52"
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchItems}
              className="fashion-button-secondary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#757471]">
              Loading wardrobe items...
            </div>
          ) : allItems.length === 0 ? (
            <div className="bg-white rounded-card border border-[#E6E4DF] p-12 text-center space-y-3 shadow-subtle">
              <Shirt className="w-12 h-12 text-[#9E9C98] mx-auto" />
              <p className="font-semibold text-base text-[#1C1C1C]">No items found</p>
              <p className="text-xs text-[#757471]">Add clothing items to your Digital Closet to begin tracking care status here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allItems.map((item) => {
                const config = statusConfig[item.availabilityStatus] || statusConfig.AVAILABLE;
                const isActing = actionLoading[item.id];

                return (
                  <div
                    key={item.id}
                    className="fashion-card bg-white p-4 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-xl bg-[#F1EFEA] overflow-hidden border border-[#E6E4DF] flex-shrink-0 flex items-center justify-center">
                        {item.imagePath ? (
                          <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shirt className="w-7 h-7 text-[#9E9C98]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`}></span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-[#1C1C1C] truncate">{item.name}</p>
                        <p className="text-xs text-[#757471]">{item.categoryName} • {item.primaryColour}</p>
                        {item.brand && <p className="text-[11px] text-[#9E9C98]">{item.brand}</p>}

                        {item.washingInstructions && (
                          <p className="mt-2 text-[10px] text-[#757471] bg-[#FAF9F7] px-2 py-1 rounded-lg border border-[#E6E4DF] italic truncate">
                            Care: {item.washingInstructions}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-[#E6E4DF]">
                      {item.availabilityStatus === 'AVAILABLE' ? (
                        <button
                          onClick={() => handleSendToLaundry(item)}
                          disabled={isActing === 'laundry'}
                          className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-[#F8F4EC] text-[#C49E5A] hover:bg-[#C49E5A] hover:text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {isActing === 'laundry' ? 'Sending...' : 'Send to Laundry'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkClean(item)}
                          disabled={isActing === 'clean'}
                          className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl bg-[#EAF2EC] text-[#4E7A5A] hover:bg-[#4E7A5A] hover:text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isActing === 'clean' ? 'Marking...' : 'Mark as Clean'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WASH LOG TAB */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-[#E6E4DF] bg-[#FAF9F7]">
            <h3 className="font-bold text-sm text-[#1C1C1C]">Wash & Care History Log</h3>
            <p className="text-xs text-[#757471]">Chronological record of all laundry actions across your wardrobe.</p>
          </div>

          {laundryHistory.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-[#9E9C98] mx-auto" />
              <p className="font-semibold text-sm text-[#1C1C1C]">No wash history yet</p>
              <p className="text-xs text-[#757471]">Every time you send an item to laundry or mark it clean, it will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E6E4DF]">
              {laundryHistory.map((record) => (
                <div key={record.id} className="flex items-center space-x-4 px-5 py-4 hover:bg-[#FAF9F7] transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#F1EFEA] overflow-hidden border border-[#E6E4DF] flex-shrink-0 flex items-center justify-center">
                    {record.clothingItemImage ? (
                      <img src={record.clothingItemImage} alt={record.clothingItemName} className="w-full h-full object-cover" />
                    ) : (
                      <Shirt className="w-5 h-5 text-[#9E9C98]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1C1C1C] truncate">{record.clothingItemName}</p>
                    <p className="text-xs text-[#757471]">{record.categoryName} • {record.primaryColour}</p>
                    {record.notes && (
                      <p className="text-[10px] text-[#9E9C98] truncate italic">{record.notes}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${record.status === 'CLEANED'
                        ? 'bg-[#EAF2EC] text-[#4E7A5A]'
                        : 'bg-[#F8F4EC] text-[#C49E5A]'
                        }`}
                    >
                      {record.status === 'CLEANED' ? '✓ Cleaned' : '⏳ In Laundry'}
                    </span>
                    <p className="text-[10px] text-[#9E9C98] mt-1">
                      {record.recordedAt
                        ? new Date(record.recordedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

