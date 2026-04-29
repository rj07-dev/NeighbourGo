import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent to our community team!');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-display font-extrabold text-slate-900 mb-6">Get in Touch.</h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Have questions about how NeighbourGo works? Need help with an integration or want to partner with us? Our team is here to support the community.
            </p>
          </div>

          <div className="space-y-8">
            <ContactInfoItem 
              icon={Mail} 
              title="Email Us" 
              value="hello@neighbourgo.org" 
              desc="We usually respond within 4 hours."
            />
            <ContactInfoItem 
              icon={Phone} 
              title="Call Helpline" 
              value="+1 (555) 000-HELP" 
              desc="Available Mon-Fri, 9am - 6pm."
            />
            <ContactInfoItem 
              icon={MapPin} 
              title="Office" 
              value="42 Community Way, City Center" 
              desc="Visits by appointment only."
            />
          </div>

          <div className="bg-brand-50 p-8 rounded-[32px] border border-brand-100">
             <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-brand-600" />
                <h3 className="text-lg font-bold text-slate-900">Immediate AI Help?</h3>
             </div>
             <p className="text-brand-800 text-sm font-medium mb-6">
                Our AI Support Assistant is available 24/7 to answer basic questions about the platform.
             </p>
             <button className="text-brand-600 font-bold hover:underline flex items-center gap-2">
                Launch AI Assistant
                <Send className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 md:p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Jane Doe" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="jane@example.com" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium appearance-none">
                <option>General Inquiry</option>
                <option>Partnership Request</option>
                <option>Report an Issue</option>
                <option>Media Inquiry</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
              <textarea 
                required
                rows={5}
                placeholder="How can we help you today?" 
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium resize-none"
              ></textarea>
            </div>

            <button 
              disabled={loading}
              className={cn(
                "w-full bg-slate-900 text-white rounded-2xl py-5 font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <Clock className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5 translate-y-[-1px]" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, title, value, desc }: { icon: any, title: string, value: string, desc: string }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-display font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
