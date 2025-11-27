import React from 'react';
import { Language } from '../types';
import { Sprout, Target, Users, Zap, Award } from 'lucide-react';
import { t } from '../utils/translations';

interface AboutProps {
  language: Language;
}

export const About: React.FC<AboutProps> = ({ language }) => {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
       
       {/* Hero Section */}
       <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-agri-main/20 text-agri-main mb-6 ring-4 ring-agri-main/30 animate-pulse">
             <Sprout size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-agri-main to-white bg-clip-text text-transparent">
             {t.aboutTitle[language]}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
             {t.aboutDesc[language]}
          </p>
       </div>

       {/* Mission Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-panel p-8 rounded-3xl border-l-4 border-agri-main relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
                <Target size={200} />
             </div>
             <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                   <Target className="text-agri-accent" /> {t.mission[language]}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                   {t.missionText[language]}
                </p>
             </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-l-4 border-blue-500 relative overflow-hidden group">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
                <Users size={200} />
             </div>
             <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                   <Users className="text-blue-400" /> {t.team[language]}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                   {t.teamDesc[language]}
                </p>
             </div>
          </div>
       </div>

       {/* Features/Values */}
       <h2 className="text-3xl font-bold text-white text-center mb-10">Why AgriVision?</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { icon: Zap, title: "AI-Powered Speed", desc: "Instant analysis of crop diseases using Gemini 2.5 Flash technology." },
             { icon: Users, title: "Community First", desc: "Building a global network of farmers supporting farmers." },
             { icon: Award, title: "Precision", desc: "99.9% accuracy in detecting leaf health patterns and soil conditions." }
          ].map((feature, idx) => (
             <div key={idx} className="bg-white/5 p-6 rounded-2xl hover:bg-white/10 transition-colors text-center border border-white/5">
                <div className="inline-block p-4 bg-black/40 rounded-full mb-4 text-agri-main">
                   <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
             </div>
          ))}
       </div>

       {/* Footer Branding */}
       <div className="mt-20 text-center border-t border-white/10 pt-10">
          <p className="text-2xl font-mono text-agri-main opacity-80">Analysis-with-Ayush</p>
       </div>
    </div>
  );
};