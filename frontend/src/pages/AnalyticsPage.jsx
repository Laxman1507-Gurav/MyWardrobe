import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Shirt, 
  Layers, 
  Clock, 
  Sparkles, 
  Search, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import api from '../services/api';

const PIE_COLORS = [
  '#1C1C1C', '#C49E5A', '#4E7A5A', '#757471', '#9E9C98', 
  '#C45151', '#2C3E50', '#8E44AD', '#16A085', '#E67E22'
];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTable, setSearchTable] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  useEffect(() => {
    api.get('/analytics/overview')
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Failed to load analytics overview:', err);
        setError('Failed to load analytics data.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 text-center text-xs text-[#757471]">
        Calculating wardrobe valuation and cost-per-wear metrics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 text-center text-xs text-[#C45151]">
        {error || 'Unable to load analytics data.'}
      </div>
    );
  }

  // Filter CPW Table items
  const filteredCpwItems = (data.costPerWearItems || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTable.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchTable.toLowerCase());
    const matchesRating = ratingFilter === 'ALL' || item.valueRating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="border-b border-[#E6E4DF] pb-6">
        <span className="fashion-badge bg-[#EFEFEA] text-[#1C1C1C]">Intelligence & Insights</span>
        <h1 className="text-3xl font-extrabold text-[#1C1C1C] mt-2 tracking-tight">Wardrobe Analytics</h1>
        <p className="text-sm text-[#757471] mt-1 max-w-2xl">
          Visual breakdowns of your clothing collection, real Cost-Per-Wear (CPW) economics, and color composition.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-[10px] uppercase tracking-wider font-bold">Total Wardrobe Value</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-2 text-[#1C1C1C]">
            ${Number(data.totalWardrobeValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-[#757471]">Cumulative asset value</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-[10px] uppercase tracking-wider font-bold">Total Clothing Pieces</span>
            <Shirt className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-2 text-[#1C1C1C]">{data.totalClothingItems}</p>
          <span className="text-[10px] text-[#757471]">In digital inventory</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-[10px] uppercase tracking-wider font-bold">Saved Outfits</span>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-2 text-[#1C1C1C]">{data.totalOutfits}</p>
          <span className="text-[10px] text-[#757471]">Styled ensembles</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-[10px] uppercase tracking-wider font-bold">Average CPW</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-2 text-[#1C1C1C]">
            ${data.averageCostPerWear.toFixed(2)}
          </p>
          <span className="text-[10px] text-[#757471]">Per wear across items</span>
        </div>

        <div className="bg-white rounded-card p-5 border border-[#E6E4DF] shadow-subtle col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#757471]">
            <span className="text-[10px] uppercase tracking-wider font-bold">In Laundry / Care</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-2 text-[#1C1C1C]">{data.itemsInLaundry}</p>
          <span className="text-[10px] text-[#757471]">Needs washing</span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Distribution Donut */}
        <div className="bg-white rounded-card p-6 border border-[#E6E4DF] shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1C1C1C] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#757471]" /> Category Distribution
            </h3>
            <span className="text-[11px] text-[#757471]">Proportion by piece</span>
          </div>

          <div className="h-64 w-full">
            {data.categoryBreakdown?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#757471]">
                No category data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="count"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px', 
                      border: '1px solid #E6E4DF',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Color Palette Distribution Bar Chart */}
        <div className="bg-white rounded-card p-6 border border-[#E6E4DF] shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1C1C1C] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#757471]" /> Color Palette Breakdown
            </h3>
            <span className="text-[11px] text-[#757471]">Top primary colors</span>
          </div>

          <div className="h-64 w-full">
            {data.colorBreakdown?.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#757471]">
                No color data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.colorBreakdown.slice(0, 8)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E4DF" />
                  <XAxis dataKey="colour" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E6E4DF',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#1C1C1C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Cost-Per-Wear (CPW) Analysis Table */}
      <div className="bg-white rounded-card border border-[#E6E4DF] shadow-subtle overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-[#1C1C1C]">Cost-Per-Wear (CPW) Analysis</h3>
            <p className="text-xs text-[#757471]">
              Formula: Purchase Price ÷ Times Worn. The lower the CPW, the higher the utilization value of your piece.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              {!searchTable && (
                <Search className="w-4 h-4 text-[#9E9C98] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150" />
              )}
              <input
                type="text"
                placeholder="Search items or categories..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className={`fashion-input text-xs ${!searchTable ? 'pl-12' : 'pl-4'} py-2 w-48 sm:w-60 bg-[#FAF9F7] transition-all`}
              />
              {searchTable && (
                <button
                  type="button"
                  onClick={() => setSearchTable('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9C98] hover:text-[#1C1C1C] text-xs font-bold"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="fashion-input text-xs py-2 w-36 bg-[#FAF9F7]"
            >
              <option value="ALL">All Ratings</option>
              <option value="EXCELLENT_VALUE">Excellent Value</option>
              <option value="GOOD_VALUE">Good Value</option>
              <option value="UNDERUTILIZED">Underutilized</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F7] text-[#757471] uppercase tracking-wider font-bold border-y border-[#E6E4DF]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Wears</th>
                <th className="py-3 px-4 text-right">Cost Per Wear</th>
                <th className="py-3 px-4 text-center">Efficiency Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DF]">
              {filteredCpwItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#757471]">
                    No items found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredCpwItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#1C1C1C] flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F1EFEA] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#E6E4DF]">
                        {item.imagePath ? (
                          <img src={item.imagePath} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Shirt className="w-5 h-5 text-[#9E9C98]" />
                        )}
                      </div>
                      <span className="truncate max-w-[160px] sm:max-w-xs">{item.name}</span>
                    </td>
                    <td className="py-3 px-4 text-[#757471]">{item.categoryName}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-[#1C1C1C]">
                      ${Number(item.purchasePrice || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#1C1C1C]">
                      {item.wearCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#1C1C1C]">
                      ${item.costPerWear.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.valueRating === 'EXCELLENT_VALUE'
                            ? 'bg-[#EAF2EC] text-[#4E7A5A]'
                            : item.valueRating === 'GOOD_VALUE'
                            ? 'bg-[#F8F4EC] text-[#C49E5A]'
                            : 'bg-[#FBEBEB] text-[#C45151]'
                        }`}
                      >
                        {item.valueRating === 'EXCELLENT_VALUE'
                          ? '★ Excellent Value'
                          : item.valueRating === 'GOOD_VALUE'
                          ? 'Good Value'
                          : 'Underutilized'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

