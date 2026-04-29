import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareShare as MessageSquareSparkles, Send, X, Loader2, Sparkles, User, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { chatAssistant } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAdvisorProps {
  inline?: boolean;
}

export default function ChatAdvisor({ inline = false }: ChatAdvisorProps) {
  const [isOpen, setIsOpen] = useState(inline);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm NeighbourGo's AI Support. I can help you find resources, explain how to offer help, or guide you through posting a request. How can I help your community today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get context stats
      const [requests, volunteers] = await Promise.all([
        apiService.getRequests(),
        apiService.getOffers()
      ]);

      const response = await chatAssistant(input, messages, {
        requests: requests.length,
        volunteers: volunteers.length
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a little trouble connecting. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(!inline && "fixed bottom-6 right-6 z-50")}>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={inline ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={inline ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "bg-white rounded-[32px] shadow-2xl border border-brand-100 flex flex-col overflow-hidden",
              inline ? "w-full h-full" : "mb-4 w-96 h-[550px]"
            )}
          >
            <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-brand-500 p-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none mb-0.5">NeighbourGo AI</h3>
                  <div className="flex items-center gap-1 text-[10px] text-brand-300 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified Advisor
                  </div>
                </div>
              </div>
              {!inline && (
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-[24px] p-4 text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-brand-600 text-white rounded-br-none" 
                      : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                  )}>
                    {msg.content}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest px-2",
                    msg.role === 'user' ? "text-right" : "text-left"
                  )}>
                    {msg.role === 'user' ? 'You' : 'NeighbourGo AI'}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-brand-600">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider italic">Thinking...</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-brand-500 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for support advice..."
                  className="w-full text-sm bg-transparent px-4 py-2 outline-none text-slate-700 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-brand-500 text-white p-2.5 rounded-xl hover:bg-brand-600 transition-all disabled:opacity-50 shadow-md shadow-brand-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!inline && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-white"></div>
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquareSparkles className="w-6 h-6 group-hover:animate-pulse" />}
        </button>
      )}
    </div>
  );
}
