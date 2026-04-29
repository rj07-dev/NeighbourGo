import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Languages, AlertCircle, Tag, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AICardProps {
  category: string;
  urgency: string;
  optimizedText: string;
  tags: string[];
  language: string;
  className?: string;
}

export default function AICard({ category, urgency, optimizedText, tags, language, className }: AICardProps) {
  return (
    <div className={cn("bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden", className)}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-100">AI Optimized Request</span>
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
            urgency === 'critical' ? 'bg-red-500' : 'bg-brand-500'
          )}>
            {urgency}
          </div>
        </div>

        <p className="text-lg font-medium leading-relaxed mb-6 italic">
          "{optimizedText}"
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-500">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-brand-200 font-bold uppercase">
              <Tag className="w-3 h-3" />
              Category
            </div>
            <p className="text-sm font-semibold capitalize">{category}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-brand-200 font-bold uppercase">
              <Languages className="w-3 h-3" />
              Detected Language
            </div>
            <p className="text-sm font-semibold">{language}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-10"></div>
    </div>
  );
}
