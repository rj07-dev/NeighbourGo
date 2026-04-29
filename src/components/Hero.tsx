import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, HeartPulse, Globe2, ShieldCheck, Play } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Hero({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <section className="relative pt-32 pb-40 overflow-hidden bg-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold border border-slate-800 mb-10 tracking-[0.2em] uppercase shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              Gemini 2.0 Augmented Neighborhood
            </div>
            
            <h1 className="text-7xl md:text-9xl font-display font-black tracking-tight text-slate-900 mb-10 leading-[0.9]">
              Connected by <span className="text-brand-500">Care</span>.<br />Driven by <span className="italic">AI</span>.
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 mb-16 leading-relaxed font-medium">
              Revolutionizing how neighborhoods organize. We use Gemini 2.0 to categorize needs, provide multilingual translation, and match volunteers instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => onNavigate('volunteers')}
                className="group bg-brand-500 text-white px-10 py-6 rounded-[28px] font-bold text-xl hover:bg-brand-600 transition-all flex items-center gap-3 shadow-[0_20px_50px_rgba(20,184,166,0.3)] hover:-translate-y-1"
              >
                Start Helping
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('requests')}
                className="group bg-white text-slate-900 border-2 border-slate-200 px-10 py-6 rounded-[28px] font-bold text-xl hover:border-brand-500 transition-all shadow-sm flex items-center gap-3 hover:-translate-y-1"
              >
                I need support
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                   <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </button>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto"
            >
              {[
                { icon: HeartPulse, label: "Real-time Support", color: "text-rose-500 bg-rose-50" },
                { icon: Globe2, label: "Multilingual AI", color: "text-brand-600 bg-brand-50" },
                { icon: ShieldCheck, label: "Secure Moderation", color: "text-emerald-600 bg-emerald-50" },
                { icon: Sparkles, label: "Smart Matching", color: "text-amber-500 bg-amber-50" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
                  <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110", stat.color)}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
