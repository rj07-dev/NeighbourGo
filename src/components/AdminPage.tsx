import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { SupportRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Search, Filter, Eye, MoreVertical, Loader2, Flag } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab ] = useState<'all' | 'flagged' | 'resolved'>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRequests();
      setRequests(data);
    } catch (err) {
      toast.error('Failed to sync administrative data');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiService.updateRequestStatus(id, status);
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: status as any } : r));
      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error('Moderation action failed');
    }
  };

  const filtered = requests.filter(r => {
    if (activeTab === 'flagged') return r.status === 'flagged';
    if (activeTab === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-brand-600" />
            Moderation Control
          </h1>
          <p className="text-slate-500 text-lg">Platform integrity and safety oversight dashboard.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           {(['all', 'flagged', 'resolved'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                 activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
               )}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
         <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Monitored</p>
            <p className="text-4xl font-display font-bold text-slate-900">{requests.length}</p>
         </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center border-l-orange-500 border-l-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Flagged by AI</p>
            <p className="text-4xl font-display font-bold text-orange-600">{requests.filter(r => r.status === 'flagged').length}</p>
         </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center border-l-emerald-500 border-l-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Tasks</p>
            <p className="text-4xl font-display font-bold text-emerald-600">{requests.filter(r => r.status === 'open').length}</p>
         </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Response</p>
            <p className="text-4xl font-display font-bold text-slate-900">4.2h</p>
         </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search audit trail..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 transition-all focus:ring-2 focus:ring-brand-500 outline-none text-sm"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4" />
            Column View
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">User & Request</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">AI Safety</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filtered.map((req) => (
                  <motion.tr 
                    key={req.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                          {req.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{req.title}</p>
                          <p className="text-xs text-slate-500">By {req.userName} • {format(new Date(req.createdAt), 'MMM d, p')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold capitalize">{req.category}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       {req.status === 'flagged' ? (
                         <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           <AlertCircle className="w-3.5 h-3.5" />
                           Low Safety
                         </div>
                       ) : (
                         <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           Clean
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <StatusBadge status={req.status} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateStatus(req.id, 'open')}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Approve / Open"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateStatus(req.id, 'flagged')}
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          title="Flag for Review"
                        >
                           <Flag className="w-5 h-5" />
                        </button>
                         <button 
                          className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
                          title="View Details"
                        >
                           <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    open: 'bg-emerald-50 text-emerald-700',
    flagged: 'bg-rose-50 text-rose-700',
    resolved: 'bg-slate-100 text-slate-700',
  }[status] || 'bg-slate-100 text-slate-700';

  return (
    <span className={cn("px-4 py-1.5 rounded-xl text-xs font-bold capitalize", styles)}>
      {status}
    </span>
  );
}
