import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Resource } from '../types';
import { motion } from 'motion/react';
import { MapPin, Phone, ExternalLink, Library, Utensils, HeartPulse, Scale, GraduationCap, Building2, Search, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await apiService.getResources();
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'food-bank': return Utensils;
      case 'shelter': return Building2;
      case 'legal': return Scale;
      case 'health': return HeartPulse;
      case 'education': return GraduationCap;
      default: return Library;
    }
  };

  const categories = [
    { id: 'all', label: 'All Resources', icon: Library },
    { id: 'food-bank', label: 'Food Banks', icon: Utensils },
    { id: 'shelter', label: 'Housing', icon: Building2 },
    { id: 'legal', label: 'Legal Aid', icon: Scale },
    { id: 'health', label: 'Healthcare', icon: HeartPulse },
  ];

  const filtered = filter === 'all' ? resources : resources.filter(r => r.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2 font-display">Local Asset Directory</h1>
        <p className="text-slate-500 text-lg">Validated organizations and services contributing to our community's resilience.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border",
              filter === cat.id 
                ? "bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-100" 
                : "bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:bg-slate-50"
            )}
          >
            <cat.icon className="w-5 h-5" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-[32px] h-64"></div>
          ))
        ) : (
          filtered.map((resource) => {
            const IconComp = getIcon(resource.type);
            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 flex items-center justify-center mb-6 transition-colors">
                  <IconComp className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{resource.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{resource.description}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin className="w-5 h-5 text-brand-400 shrink-0" />
                    <span>{resource.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-5 h-5 text-brand-400 shrink-0" />
                    <span className="font-mono">{resource.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button 
                    onClick={() => toast.success(`Redirecting to ${resource.title} website...`)}
                    className="flex items-center justify-center gap-2 bg-brand-50 text-brand-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </button>
                   <button 
                    onClick={() => toast.success(`Calling ${resource.phone}...`)}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-16 bg-brand-50 p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center md:text-left">
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Did we miss something?</h2>
           <p className="text-brand-800 font-medium mb-6">Our community support network is only as strong as its information. If you know of a local service that should be listed, let us know.</p>
           <div className="flex flex-wrap gap-4 justify-center md:justify-start font-display">
             <button className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center gap-2">
                Suggest Resource
             </button>
             <button className="bg-white/50 backdrop-blur text-brand-700 px-8 py-4 rounded-2xl font-bold hover:bg-white transition-all flex items-center gap-2">
                <Info className="w-5 h-5" />
                Submission Policy
             </button>
           </div>
        </div>
        <div className="relative group perspective-1000">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-brand-200/50 rotate-2 group-hover:rotate-0 transition-transform duration-500 border border-brand-100 flex flex-col items-center max-w-[280px]">
             <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-brand-600" />
             </div>
             <p className="text-center text-slate-900 font-bold mb-2">Partner with us</p>
             <p className="text-center text-slate-500 text-sm">Coordinate your services with NeighbourGo AI.</p>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center">
             <HeartPulse className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
