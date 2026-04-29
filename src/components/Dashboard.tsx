import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { SupportRequest, CommunityNotice } from '../types';
import { motion } from 'motion/react';
import { Activity, Bell, Heart, Users, ArrowUpRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [notices, setNotices] = useState<CommunityNotice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqs, nots] = await Promise.all([
          apiService.getRequests(),
          apiService.getNotices()
        ]);
        setRequests(reqs);
        setNotices(nots);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Requests', value: requests.length, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Volunteers Active', value: 124, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Resolved Today', value: 8, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Activity className="w-8 h-8 text-brand-500 animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-2">Community Snapshot</h1>
        <p className="text-slate-500 text-base md:text-lg">Real-time pulse of your neighborhood coordination.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group"
          >
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-slate-900">Recent Needs</h2>
            <button className="text-brand-600 font-bold text-sm hover:underline">See all requests</button>
          </div>
          <div className="space-y-4">
            {requests.slice(0, 4).map((req) => (
              <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-12 rounded-full",
                    req.urgency === 'critical' ? 'bg-red-500' : 'bg-brand-400'
                  )}></div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-2">{req.title}</h3>
                    <p className="text-sm text-slate-500 truncate max-w-[300px]">{req.userName} • {req.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 uppercase">{format(new Date(req.createdAt), 'h:mm a')}</p>
                    <p className="text-[10px] text-slate-300">{format(new Date(req.createdAt), 'MMM d')}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-brand-500" />
              Notices
            </h2>
          </div>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  notice.type === 'alert' ? 'bg-red-500' : 
                  notice.type === 'event' ? 'bg-emerald-500' : 'bg-brand-500'
                )}></div>
                <div className="flex items-start gap-3 mb-2">
                  {notice.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-red-500 mt-1" /> : <Info className="w-4 h-4 text-brand-500 mt-1" />}
                  <h3 className="font-bold text-slate-900">{notice.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {notice.content}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {format(new Date(notice.date), 'MMMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
