import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Search, Filter, MessageSquare, Heart, Navigation as NavIcon, X, Info } from 'lucide-react';
import { apiService } from '../services/api';
import { VolunteerOffer } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

interface MapVolunteer extends VolunteerOffer {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export default function NeighborhoodMap() {
  const [volunteers, setVolunteers] = useState<MapVolunteer[]>([]);
  const [selectedVol, setSelectedVol] = useState<MapVolunteer | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAndPlace = async () => {
      try {
        const data = await apiService.getOffers();
        // Decorate with pseudo-random but stable coordinates based on ID
        const mapped = data.map(v => ({
          ...v,
          x: (parseInt(v.id.slice(-2), 16) % 80) + 10, // Keep away from extreme edges
          y: (parseInt(v.id.slice(0, 2), 16) % 80) + 10
        }));
        setVolunteers(mapped);
      } catch (err) {
        toast.error('Failed to load map data');
      }
    };
    fetchAndPlace();
  }, []);

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.userName.toLowerCase().includes(search.toLowerCase()) || 
                          v.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || v.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-black text-slate-900 mb-2">Neighborhood Radar</h1>
           <p className="text-slate-500 font-medium">Visualizing kindness across your local community.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-none rounded-2xl pl-11 pr-6 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-500 shadow-sm transition-all outline-none min-w-[240px]"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border-none rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Skills</option>
            <option value="delivery">Delivery</option>
            <option value="translation">Translation</option>
            <option value="tutoring">Tutoring</option>
            <option value="eldercare">Eldercare</option>
          </select>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* The Map Interface */}
        <div className="lg:col-span-3 relative bg-slate-100 rounded-[48px] overflow-hidden border-8 border-white shadow-inner">
           {/* Stylized Map Grid/Lines */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           </div>
           
           {/* Center Area Label */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-20">
                 <p className="text-8xl font-display font-black text-slate-900 select-none">MAIN ST.</p>
                 <p className="text-2xl font-bold uppercase tracking-[1rem] text-slate-500 select-none">City Central</p>
              </div>
           </div>

           {/* Volunteer Pins */}
           {filteredVolunteers.map((vol) => (
             <motion.button
               key={vol.id}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               whileHover={{ scale: 1.1, zIndex: 50 }}
               onClick={() => setSelectedVol(vol)}
               style={{ left: `${vol.x}%`, top: `${vol.y}%` }}
               className={cn(
                 "absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all shadow-lg group",
                 selectedVol?.id === vol.id ? "bg-brand-500 text-white ring-4 ring-brand-100 scale-125" : "bg-white text-slate-900 hover:ring-4 hover:ring-slate-200"
               )}
             >
               <MapPin className="w-5 h-5" />
               
               {/* Label on Hover */}
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                    {vol.userName}
                  </div>
               </div>
             </motion.button>
           ))}

           {/* User's "Current Location" Marker */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-brand-500 rounded-full animate-ping absolute inset-0 opacity-40"></div>
              <div className="w-6 h-6 bg-brand-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
           </div>

           {/* Map Controls */}
           <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="bg-white p-3 rounded-2xl shadow-lg text-slate-600 hover:text-slate-900 transition-colors">
                <NavIcon className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-4">
           <AnimatePresence mode="wait">
             {selectedVol ? (
               <motion.div 
                 key={selectedVol.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex-grow"
               >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400">
                       <User className="w-8 h-8" />
                    </div>
                    <button 
                      onClick={() => setSelectedVol(null)}
                      className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                       <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">{selectedVol.userName}</h3>
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-6">Verified Volunteer</p>

                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available for</p>
                        <div className="flex flex-wrap gap-2">
                           {selectedVol.skills.map(s => (
                             <span key={s} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 capitalize">{s}</span>
                           ))}
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</p>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">"{selectedVol.bio}"</p>
                     </div>

                     <div className="pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => toast.success(`Request sent to ${selectedVol.userName}!`)}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                           <MessageSquare className="w-4 h-4" />
                           Send Help Request
                        </button>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="bg-brand-50 p-8 rounded-[40px] border border-brand-100 flex-grow flex flex-col items-center justify-center text-center"
               >
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                     <Info className="w-8 h-8 text-brand-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Person</h3>
                  <p className="text-sm text-brand-800 font-medium">
                    Click on a marker on the map to see who is available nearby and how they can help you.
                  </p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="bg-slate-900 p-6 rounded-[32px] text-white">
              <div className="flex items-center gap-3 mb-4">
                 <Heart className="w-5 h-5 text-brand-400 fill-brand-400" />
                 <h4 className="font-bold text-sm">Nearby Support</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                There are <b>{volunteers.length}</b> volunteers within 4km of your location.
              </p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 w-3/4 rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
