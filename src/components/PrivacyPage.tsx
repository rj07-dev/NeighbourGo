import React from 'react';
import { Shield, Lock, Eye, FileText, Server, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data We Collect",
      icon: FileText,
      content: "We collect only what is necessary to connect you with your neighbors: name, general location, and request details. We do not sell your personal information to third parties."
    },
    {
      title: "AI Processing",
      icon: Server,
      content: "Your requests are processed by Gemini 2.0 to improve safety and clarity. This data is used only for moderation and optimization within the NeighbourGo ecosystem."
    },
    {
      title: "Profile Privacy",
      icon: UserCheck,
      content: "You have full control over what neighbors see. Only verified volunteers can see specific request details, and your exact address is never shared publicly."
    },
    {
      title: "Data Security",
      icon: Lock,
      content: "We use industry-standard encryption and security protocols to ensure your data is protected from unauthorized access at all times."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-brand-50 rounded-[32px] flex items-center justify-center text-brand-600 mx-auto mb-8">
           <Shield className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500 font-medium tracking-wide border-b border-slate-100 pb-8 inline-block px-12">Last Updated: April 29, 2026</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-16 shadow-sm space-y-12 mb-16">
        <section>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">
             <Eye className="w-6 h-6 text-brand-500" />
             Introduction
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            At NeighbourGo, your privacy is our priority. We believe that a safe community is built on transparency and trust. This policy describes how we handle your data when you use our platform.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-5 h-5 text-brand-600" />
                  <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
               </div>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">
                 {section.content}
               </p>
            </div>
          ))}
        </div>

        <section className="pt-8 border-t border-slate-100">
           <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Your Rights</h2>
           <ul className="space-y-4 text-slate-600 font-medium list-disc pl-6">
             <li>Right to access your personal data at any time.</li>
             <li>Right to request deletion of your account and associated history.</li>
             <li>Right to opt-out of specific AI-driven features.</li>
             <li>Right to export your data in a portable format.</li>
           </ul>
        </section>

        <section>
           <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Contact Us</h2>
           <p className="text-slate-600 leading-relaxed font-medium">
             If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <b>privacy@neighbourgo.org</b>.
           </p>
        </section>
      </div>

      <div className="text-center">
         <p className="text-slate-400 text-sm">© 2026 NeighbourGo. All rights reserved.</p>
      </div>
    </div>
  );
}
