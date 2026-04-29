import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Target, ShieldCheck, Sparkles, Globe, Zap, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AboutPage() {
  const team = [
    { name: "Alex Rivera", role: "Founder & Product", bio: "Former city planner passionate about urban resilience.", initials: "AR" },
    { name: "Sarah Chen", role: "Engineering Lead", bio: "AI specialist dedicated to ethical community tech.", initials: "SC" },
    { name: "Marco Rossi", role: "Community Outreach", bio: "10+ years in non-profit management and advocacy.", initials: "MR" }
  ];

  const values = [
    { title: "Dignity", desc: "No one should feel ashamed to ask for help. We prioritize respect in every interaction.", icon: Heart },
    { title: "Trust", desc: "We use advanced verification and AI safety layers to keep our neighborhoods safe.", icon: ShieldCheck },
    { title: "Efficiency", desc: "Using Gemini 2.0 to eliminate administrative bottlenecks and connect people instantly.", icon: Zap }
  ];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-[100px] opacity-60"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-[80px] opacity-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-8">
               <Target className="w-3.5 h-3.5 text-brand-400" />
               Our Mission
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-black text-slate-900 mb-8 tracking-tight">
              Rebuilding the <span className="text-brand-500">Social Fabric</span>.
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-500 leading-relaxed font-medium">
              NeighbourGo is more than an app; it's a movement to bring neighbors together. 
              In an increasingly digital world, we're using technology to facilitate real-world human connection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-slate-900 rounded-[64px] overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative z-10 p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">What is NeighbourGo?</h2>
              <div className="space-y-6">
                 <p className="text-slate-300 text-lg leading-relaxed">
                   Founded in 2024, NeighbourGo was born from the realization that while we are more connected than ever, the people living ten feet away from us are often strangers.
                 </p>
                 <p className="text-slate-300 text-lg leading-relaxed">
                   Our goal is to solve the "last mile" of community support. Whether it's picking up groceries for a senior, translating a medical visit, or simply lending a shovel, we make it safe and efficient to give and receive help.
                 </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {values.map((v, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] flex items-start gap-6 hover:bg-white/10 transition-colors">
                   <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shrink-0">
                     <v.icon className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Meet the Visionaries.</h2>
          <p className="text-slate-500 text-lg">A small team with a massive ambition to change neighborhoods forever.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-3xl font-black text-slate-300 mb-8 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                {member.initials}
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-brand-600 font-bold text-sm mb-6 uppercase tracking-widest">{member.role}</p>
              <p className="text-slate-500 leading-relaxed font-medium">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-brand-50 rounded-[48px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-brand-100">
            <div className="md:w-1/2">
               <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-8">
                  <Sparkles className="w-8 h-8" />
               </div>
               <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Powered by Gemini.</h2>
               <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                 We leverage the latest in Large Language Models to automate the "boring stuff." Gemini 2.0 handles request moderation, categorization, multilingual translation, and smart volunteer matching, allowing our human members to focus entirely on kindness.
               </p>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-brand-100 uppercase tracking-wider shadow-sm">
                    <Globe className="w-3.5 h-3.5" />
                    Multilingual
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border border-brand-100 uppercase tracking-wider shadow-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    AI Moderated
                  </div>
               </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-32 bg-brand-100/50 rounded-3xl border border-brand-200/50 animate-pulse"></div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
