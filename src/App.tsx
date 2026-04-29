import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import RequestsPage from './components/RequestsPage';
import VolunteersPage from './components/VolunteersPage';
import ResourcesPage from './components/ResourcesPage';
import SupportAnalytics from './components/SupportAnalytics';
import ChatAdvisor from './components/ChatAdvisor';
import AdminPage from './components/AdminPage';
import Dashboard from './components/Dashboard';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import StoriesPage from './components/StoriesPage';
import PrivacyPage from './components/PrivacyPage';
import NeighborhoodMap from './components/NeighborhoodMap';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Globe, Users, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);

  const login = (isAdmin = false) => {
    setUser({
      name: isAdmin ? 'Admin User' : 'Jane Doe',
      isAdmin
    });
    toast.success(`Logged in as ${isAdmin ? 'Administrator' : 'Jane Doe'}`);
  };

  const logout = () => {
    setUser(null);
    setActiveTab('home');
    toast.success('Logged out');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-24 pb-24">
            <Hero onNavigate={setActiveTab} />
            <DashboardSection onNavigate={setActiveTab} />
            <FeatureShowcase />
            <JoinCommunitySection onNavigate={setActiveTab} />
          </div>
        );
      case 'requests':
        return <RequestsPage />;
      case 'volunteers':
        return <VolunteersPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'impact':
        return <SupportAnalytics />;
      case 'ai-support':
        return <div className="max-w-4xl mx-auto py-12 px-4 h-[80vh] flex flex-col">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">NeighbourGo AI Assistant</h1>
          <ChatAdvisor />
        </div>;
      case 'dashboard':
        return <Dashboard />;
      case 'admin':
        return <AdminPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'stories':
        return <StoriesPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'map':
        return <NeighborhoodMap />;
      default:
        return <Hero onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900">
      <Toaster position="top-right" />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user} 
        onLogin={login} 
        onLogout={logout} 
      />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setActiveTab} />
    </div>
  );
}

function DashboardSection({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 rounded-[64px] p-12 md:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/10 blur-[120px] -rotate-12 translate-x-1/2"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <Globe className="w-4 h-4" />
              Community Status
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-8 leading-[1.1]">The Pulse of Your Neighborhood.</h2>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-lg">
              Get a live overview of neighborhood needs, event alerts, and volunteer availability. Our AI processes thousands of data points to keep our community safe and connected.
            </p>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="group bg-white text-slate-900 px-10 py-5 rounded-[24px] font-bold text-lg hover:bg-brand-50 transition-all flex items-center gap-3"
            >
              Enter Dashboard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: 'Active Tasks', val: '84', color: 'bg-emerald-500' },
               { label: 'Verified Helpers', val: '210', color: 'bg-brand-500' },
               { label: 'Needs Met', val: '1.2k', color: 'bg-rose-500' },
               { label: 'Urgent Ops', val: '03', color: 'bg-orange-500' }
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] text-center">
                 <p className="text-3xl font-display font-bold mb-1">{stat.val}</p>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                 <div className={`w-8 h-1 ${stat.color} mx-auto mt-4 rounded-full`}></div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  const features = [
    {
      title: "AI Analysis",
      desc: "Our AI automatically categorizes and tags requests, identifying urgency and potential safety issues.",
      icon: MessageSquare,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Smart Matching",
      desc: "Connects volunteers with specific skills to the most relevant community needs instantly.",
      icon: Users,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Trust & Safety",
      desc: "Verified profiles and AI-moderated content ensure a respectful, helpful community environment.",
      icon: Shield,
      color: "bg-rose-50 text-rose-600"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Built for Resilience.</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Leveraging advanced technology to solve local challenges at scale.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <div key={i} className="group">
            <div className={`w-20 h-20 ${f.color} rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500`}>
              <f.icon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function JoinCommunitySection({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-brand-500 rounded-[56px] p-12 md:p-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)] scale-150 animate-pulse"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-8">Ready to strengthen your neighborhood?</h2>
          <p className="text-xl text-white/90 mb-12 font-medium">Join thousands of residents already making a difference every day.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onNavigate('requests')}
              className="w-full sm:w-auto bg-white text-brand-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              Get Support
            </button>
            <button 
              onClick={() => onNavigate('volunteers')}
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <footer className="bg-white border-t border-slate-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-100">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-black text-slate-900 tracking-tight">NeighbourGo</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              A modern community platform connecting people through care, powered by responsible AI.
            </p>
            <div className="flex gap-4">
              <SocialIcon color="text-brand-500" />
              <SocialIcon color="text-slate-400" />
              <SocialIcon color="text-slate-400" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Platform</h4>
            <ul className="space-y-4">
              {['requests', 'volunteers', 'resources', 'impact'].map(tab => (
                <li key={tab}>
                  <button 
                    onClick={() => onNavigate(tab)}
                    className="text-slate-500 hover:text-brand-500 transition-colors text-sm font-medium capitalize"
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', tab: 'about' },
                { label: 'Success Stories', tab: 'stories' },
                { label: 'Privacy Policy', tab: 'privacy' },
                { label: 'Contact', tab: 'contact' }
              ].map(link => (
                <li key={link.label}>
                  <button 
                    onClick={() => onNavigate(link.tab)}
                    className="text-slate-500 hover:text-brand-500 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
             <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">Administrative</h4>
             <button 
               onClick={() => onNavigate('admin')}
               className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all text-xs font-bold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100"
             >
               <Shield className="w-4 h-4" />
               Staff & Moderator Portal
             </button>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-medium">© 2024 NeighbourGo. Built for the community.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-300 hover:text-slate-900 text-xs font-bold transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-300 hover:text-slate-900 text-xs font-bold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ color }: { color: string }) {
  return (
    <div className={cn("w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-brand-50 transition-all", color)}>
      <div className="w-5 h-5 bg-current opacity-20 rounded-sm"></div>
    </div>
  )
}

export default App;
