import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiService } from '../services/api';
import { Loader2, TrendingUp, Info } from 'lucide-react';

const COLORS = ['#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#2ed3c2', '#5eead4'];

export default function SupportAnalytics() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const stats = await apiService.getAnalytics();
      setData(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-display font-extrabold text-slate-900 mb-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-brand-500" />
            Community Support Analytics
          </h2>
          <p className="text-slate-500 text-lg">
            Analyzing demand trends helps neighborhoods pre-allocate resources and volunteers where they are needed most. This data is extracted and categorized by Gemini 2.0.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Data
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-8">Requests by Category</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-600 text-white p-8 rounded-3xl shadow-xl shadow-brand-100">
              <h3 className="text-xl font-bold mb-4">AI Insight</h3>
              <p className="text-brand-50 leading-relaxed mb-6 italic">
                "We notice a significant uptick in {data.sort((a,b) => b.count - a.count)[0]?.name.toLowerCase()} support requests in the North Hill area. Consider organizing a local group for this category."
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-200 uppercase tracking-widest">
                <Info className="w-4 h-4" />
                Gemini Prediction
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Key Drivers</h3>
              <div className="space-y-4">
                {data.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 rounded-full" 
                          style={{ width: `${(item.count / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
