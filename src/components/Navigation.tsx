import React, { useState } from 'react';
import { Heart, MessageSquareShare as MessageSquareSparkles, BarChart3, Users, LayoutDashboard, Library, MapPin, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { name: string; isAdmin: boolean } | null;
  onLogin: (isAdmin?: boolean) => void;
  onLogout: () => void;
}

export default function Navigation({ activeTab, onTabChange, user, onLogin, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'requests', label: 'Needs', icon: Heart },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'dashboard', label: 'Pulse', icon: LayoutDashboard },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'ai-support', label: 'AI Help', icon: MessageSquareSparkles },
  ];

  const handleTabChange = (id: string) => {
    onTabChange(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-100 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight">NeighbourGo</span>
          </button>

          {/* Nav Links - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === item.id 
                    ? "bg-brand-50 text-brand-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.isAdmin ? 'Moderator' : 'Neighbor'}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-slate-100 text-slate-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={() => onLogin(false)}
                  className="hidden xs:block text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm px-2 sm:px-4"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onLogin(true)}
                  className="hidden xs:block text-slate-400 hover:text-slate-600 font-bold text-[10px] px-2 uppercase tracking-widest border border-slate-100 rounded-lg py-1"
                >
                  Mod Login
                </button>
              </div>
            )}
            <button 
              onClick={() => onTabChange('requests')}
              className="bg-slate-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 whitespace-nowrap"
            >
              Post Request
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-bold transition-all",
                    activeTab === item.id 
                      ? "bg-brand-50 text-brand-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              
              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mt-4">
                  <button 
                    onClick={() => { onLogin(false); setIsMenuOpen(false); }}
                    className="flex justify-center items-center py-4 rounded-2xl text-slate-600 font-bold border border-slate-100"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => { onLogin(true); setIsMenuOpen(false); }}
                    className="flex justify-center items-center py-4 rounded-2xl text-slate-400 font-bold border border-slate-100 text-xs"
                  >
                    Moderator
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
