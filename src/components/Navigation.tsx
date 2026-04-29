import React from 'react';
import { Heart, MessageSquareShare as MessageSquareSparkles, BarChart3, Users, LayoutDashboard, Library, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: { name: string; isAdmin: boolean } | null;
  onLogin: (isAdmin?: boolean) => void;
  onLogout: () => void;
}

export default function Navigation({ activeTab, onTabChange, user, onLogin, onLogout }: NavigationProps) {
  const navItems = [
    { id: 'requests', label: 'Needs', icon: Heart },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'resources', label: 'Resources', icon: Library },
    { id: 'dashboard', label: 'Pulse', icon: LayoutDashboard },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'ai-support', label: 'AI Help', icon: MessageSquareSparkles },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-100 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-black text-slate-900 tracking-tight">NeighbourGo</span>
          </button>

          {/* Nav Links */}
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
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.isAdmin ? 'Moderator' : 'Neighbor'}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onLogin(false)}
                  className="hidden sm:block text-slate-600 hover:text-slate-900 font-bold text-sm px-4"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onLogin(true)}
                  className="hidden sm:block text-slate-400 hover:text-slate-600 font-bold text-[10px] px-2 uppercase tracking-widest border border-slate-100 rounded-lg py-1"
                >
                  Mod Login
                </button>
              </div>
            )}
            <button 
              onClick={() => onTabChange('requests')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Post Request
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
