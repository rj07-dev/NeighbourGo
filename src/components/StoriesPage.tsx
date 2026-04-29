import React from 'react';
import { motion } from 'motion/react';
import { Quote, Heart, Star, Sparkles, MessageCircle, MapPin } from 'lucide-react';

export default function StoriesPage() {
  const stories = [
    {
      title: "Bridging the Language Gap",
      author: "Li Wei",
      location: "East Side",
      text: "I was extremely anxious about my specialist appointment. David Chen answered my request within minutes. He translated everything perfectly, and I felt heard by my doctor for the first time. NeighbourGo truly changes lives.",
      category: "Translation",
      initials: "LW",
      gradient: "from-brand-500 to-emerald-500"
    },
    {
      title: "A Shovel and a Smile",
      author: "Maria Garcia",
      location: "North Hill",
      text: "After the big storm last week, my driveway was buried. I'm 78 and can’t shovel anymore. Two young students saw my request on NeighbourGo and cleared it all before noon. I invited them in for cookies—it was wonderful.",
      category: "Eldercare",
      initials: "MG",
      gradient: "from-rose-500 to-orange-500"
    },
    {
      title: "Emergency Tech Support",
      author: "Arthur P.",
      location: "Riverview",
      text: "My grandson's tablet broke right before his remote school project was due. A local IT guy fixed it remotely through the app's chat instructions. We didn't have to spend a dime, and my grandson got an A!",
      category: "Tutoring",
      initials: "AP",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "The Grocery Run Hero",
      author: "Susan Q.",
      location: "City Central",
      text: "I was down with the flu and had no food in the fridge. Sarah picked up my meds and a week's worth of supplies. The AI's 'Smart Matching' found her just three streets away. I'm forever grateful.",
      category: "Food",
      initials: "SQ",
      gradient: "from-amber-500 to-yellow-500"
    }
  ];

  return (
    <div className="pb-24">
      <section className="pt-20 pb-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-widest mb-8 border border-brand-200 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
                Community Impact
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-8 leading-tight">
                Real Stories of <span className="text-brand-500">Kindness</span>.
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Every request on NeighbourGo is an opportunity for connection. These are just a few of the thousands of lives touched by our community.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract Background Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 md:p-12 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex items-center justify-between mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {story.initials}
                </div>
                <Quote className="w-10 h-10 text-slate-100" />
              </div>

              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">{story.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-lg mb-8 italic flex-grow">
                "{story.text}"
              </p>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-slate-900 font-bold">{story.author}</p>
                  <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">{story.location}</span>
                  </div>
                </div>
                <div className="bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">
                  {story.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
         <div className="bg-slate-900 rounded-[64px] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/10 blur-[120px] -rotate-45"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Have your own story to tell?</h2>
               <p className="text-slate-400 text-lg mb-12">We love hearing how NeighbourGo has touched your life. Share your experience with our team.</p>
               <button className="bg-white text-slate-900 px-10 py-5 rounded-3xl font-bold text-lg hover:bg-brand-50 transition-all flex items-center gap-3 mx-auto">
                 Share Your Story
                 <Heart className="w-6 h-6 text-brand-500" />
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
