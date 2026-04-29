import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { analyzeRequest } from '../services/gemini';
import { SupportRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, Clock, Search, Filter, Loader2, Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import AICard from './AICard';
import { toast } from 'react-hot-toast';

export default function RequestsPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    title: '',
    description: '',
    location: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRequests();
      // Filter out flagged requests for regular users if needed, 
      // but for this demo let's keep them and show status
      setRequests(data);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.originalDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || req.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsPosting(true);
    const toastId = toast.loading('Gemini is analyzing and optimizing your request...');
    
    try {
      // Step 1: AI Analysis on the client side
      const aiAnalysis = await analyzeRequest(formData.title, formData.description);
      
      // Step 2: Create request with pre-analyzed data
      const newReq = await apiService.createRequest({
        ...formData,
        aiData: aiAnalysis
      });

      setRequests(prev => [newReq, ...prev]);
      setShowForm(false);
      setFormData({ userName: '', title: '', description: '', location: '' });
      toast.success('Request posted successfully!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to post request', { id: toastId });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Community Support Feed</h1>
          <p className="text-slate-500">Respond to neighbors in need or post your own request.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-brand-100"
        >
          {showForm ? <Plus className="rotate-45" /> : <Plus />}
          {showForm ? 'Cancel' : 'Post Request'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-white rounded-3xl p-8 border-2 border-brand-100 shadow-sm">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-brand-500" />
                What do you need help with?
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      value={formData.userName}
                      onChange={e => setFormData({...formData, userName: e.target.value})}
                      placeholder="Jane Doe" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Location / Neighborhood</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. West End, Riverview" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Brief Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Need help moving a couch" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Description</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Explain your situation... Gemini AI will help polish this for clarity." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                    ></textarea>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button 
                    disabled={isPosting}
                    type="submit"
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isPosting ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    Post with AI Optimization
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search needs..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 transition-all focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </h3>
            <div className="space-y-2">
              {['All', 'Food', 'Transport', 'Tutoring', 'Translation', 'Eldercare', 'Housing', 'Other'].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="w-5 h-5 border-slate-300 text-brand-600 focus:ring-brand-500" 
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Requests Feed */}
        <div className="flex-grow space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Gathering community needs...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No matches found. Try adjusting your filters.</p>
            </div>
          ) : (
            filtered.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {req.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{req.userName}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          {req.location}
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{req.title}</h2>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {req.originalDescription}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 capitalize">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded",
                        req.urgency === 'critical' ? 'text-red-600 bg-red-50' : 
                        req.urgency === 'high' ? 'text-orange-600 bg-orange-50' : 'text-brand-600 bg-brand-50'
                      )}>
                        {req.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <AICard 
                      category={req.category}
                      urgency={req.urgency}
                      optimizedText={req.aiOptimizedDescription}
                      tags={req.tags}
                      language={req.language}
                    />
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => toast.success(`Directing you to help ${req.userName}...`)}
                        className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-500 hover:text-white transition-all"
                      >
                        Offer Support
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
