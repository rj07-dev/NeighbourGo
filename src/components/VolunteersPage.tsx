import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { explainMatch } from '../services/gemini';
import { VolunteerOffer } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Globe2, Clock, Sparkles, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function VolunteersPage() {
  const [offers, setOffers] = useState<VolunteerOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerFormData, setOfferFormData] = useState({
    userName: '',
    bio: '',
    skills: '',
    languages: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = !search || 
      offer.userName.toLowerCase().includes(search.toLowerCase()) || 
      offer.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    
    const matchesLang = selectedLangs.length === 0 || 
      offer.languages.some(l => selectedLangs.includes(l));
      
    return matchesSearch && matchesLang;
  });

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerFormData.userName || !offerFormData.skills) {
      toast.error('Please provide your name and skills');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createOffer({
        userName: offerFormData.userName,
        bio: offerFormData.bio,
        skills: offerFormData.skills.split(',').map(s => s.trim()),
        languages: offerFormData.languages.split(',').map(l => l.trim()),
        availability: offerFormData.availability
      });
      toast.success('Your volunteer offer is now live!');
      setShowOfferForm(false);
      setOfferFormData({ userName: '', bio: '', skills: '', languages: '', availability: '' });
      fetchOffers();
    } catch (err) {
      toast.error('Failed to post volunteer offer');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getOffers();
      setOffers(data);
    } catch (err) {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchExplain = async (offerId: string) => {
    if (explanations[offerId]) {
      // Toggle off if already showing
      const newExps = { ...explanations };
      delete newExps[offerId];
      setExplanations(newExps);
      return;
    }

    setExplaining(offerId);
    try {
      // For demo purposes, we match against the first active request
      const requests = await apiService.getRequests();
      const volunteer = offers.find(o => o.id === offerId);
      
      if (requests.length > 0 && volunteer) {
        const text = await explainMatch(
          requests[0].title, 
          requests[0].aiOptimizedDescription, 
          volunteer.userName, 
          volunteer.skills
        );
        setExplanations(prev => ({ ...prev, [offerId]: text }));
      } else if (!volunteer) {
        setExplanations(prev => ({ ...prev, [offerId]: "Volunteer not found." }));
      } else {
        setExplanations(prev => ({ ...prev, [offerId]: "I need at least one open request to show you how this volunteer matches!" }));
      }
    } catch (err) {
      toast.error('AI matching explanation failed');
    } finally {
      setExplaining(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-2">Community Champions</h1>
          <p className="text-slate-500 text-sm md:text-lg">Neighbors offering their time, skills, and kindness.</p>
        </div>
        <button 
          onClick={() => setShowOfferForm(!showOfferForm)}
          className="w-full sm:w-auto bg-brand-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-brand-100 flex items-center justify-center gap-2"
        >
          {showOfferForm ? <Users className="rotate-45" /> : <HeartIcon />}
          {showOfferForm ? 'Cancel' : 'I want to Volunteer'}
        </button>
      </div>

      <AnimatePresence>
        {showOfferForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8 md:mb-12"
          >
            <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 border-2 border-brand-100 shadow-xl shadow-brand-100/10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                 <ShieldCheck className="w-7 h-7 md:w-8 h-8 text-brand-500" />
                 Join the Network
              </h2>
              <form onSubmit={handleOfferSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={offerFormData.userName}
                      onChange={e => setOfferFormData({...offerFormData, userName: e.target.value})}
                      placeholder="Jane Doe" 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Your Skills (comma separated)</label>
                    <input 
                      type="text" 
                      required
                      value={offerFormData.skills}
                      onChange={e => setOfferFormData({...offerFormData, skills: e.target.value})}
                      placeholder="delivery, translation, tutoring" 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Availability</label>
                    <input 
                      type="text" 
                      required
                      value={offerFormData.availability}
                      onChange={e => setOfferFormData({...offerFormData, availability: e.target.value})}
                      placeholder="e.g. Weekends only, Evenings" 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Bio</label>
                    <textarea 
                      required
                      rows={4}
                      value={offerFormData.bio}
                      onChange={e => setOfferFormData({...offerFormData, bio: e.target.value})}
                      placeholder="Tell the neighborhood a bit about yourself..." 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Languages (comma separated)</label>
                    <input 
                      type="text" 
                      value={offerFormData.languages}
                      onChange={e => setOfferFormData({...offerFormData, languages: e.target.value})}
                      placeholder="English, Spanish" 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                    Register Now
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
           <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search skills..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 transition-all focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-brand-500" />
              Languages
            </h3>
            <div className="space-y-3">
              {['English', 'Spanish', 'Mandarin', 'French', 'Arabic'].map(lang => (
                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedLangs.includes(lang)}
                    onChange={() => toggleLang(lang)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
                  />
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    selectedLangs.includes(lang) ? "text-brand-600" : "text-slate-600 group-hover:text-slate-900"
                  )}>{lang}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteers Grid */}
        <div className="lg:col-span-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Finding nearby champions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOffers.length > 0 ? filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                     <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-2xl group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      {offer.userName.charAt(0)}
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{offer.userName}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{offer.bio}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {offer.skills.map(skill => (
                      <span key={skill} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold capitalize">{skill}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <Globe2 className="w-4 h-4 text-brand-500" />
                       <span className="text-xs font-medium text-slate-600">{offer.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-brand-500" />
                       <span className="text-xs font-medium text-slate-600">{offer.availability}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => handleMatchExplain(offer.id)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-700 px-4 py-3 rounded-xl text-sm font-bold hover:bg-brand-100 transition-colors"
                    >
                      {explaining === offer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Why a match?
                    </button>
                    <button 
                      onClick={() => toast.success(`Connection request sent to ${offer.userName}!`)}
                      className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                      Connect
                    </button>
                  </div>

                  <AnimatePresence>
                    {explanations[offer.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-brand-50 rounded-2xl border border-brand-100 overflow-hidden"
                      >
                         <p className="text-sm text-brand-800 font-medium italic">
                           "{explanations[offer.id]}"
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )) : (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No volunteers match your current filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
