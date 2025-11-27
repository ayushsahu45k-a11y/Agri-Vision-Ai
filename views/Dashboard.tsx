import React from 'react';
import { User, AnalysisResult, View, Language } from '../types';
import { Button } from '../components/Layout';
import { Wind, Droplets, Sun, TrendingUp, AlertTriangle, CheckCircle, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { t } from '../utils/translations';

interface DashboardProps {
  user: User;
  history: AnalysisResult[];
  onChangeView: (view: View) => void;
  language: Language;
}

const mockChartData = [
  { name: 'Mon', health: 65, moisture: 40 },
  { name: 'Tue', health: 70, moisture: 45 },
  { name: 'Wed', health: 68, moisture: 35 },
  { name: 'Thu', health: 75, moisture: 50 },
  { name: 'Fri', health: 85, moisture: 60 },
  { name: 'Sat', health: 82, moisture: 55 },
  { name: 'Sun', health: 90, moisture: 65 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, history, onChangeView, language }) => {
  const recentIssues = history.filter(h => h.condition !== 'Healthy').length;
  const avgHealth = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.healthScore, 0) / history.length) 
    : 100;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {t.welcome[language]} <span className="text-agri-accent">{user.name}</span>
          </h2>
          <p className="text-gray-400">{t.farmStatus[language]}</p>
        </div>
        <Button onClick={() => onChangeView(View.ANALYZE)}>
          {t.newAnalysis[language]}
        </Button>
      </div>

      {/* Weather Cards (Mock Data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Real-time looking rain prediction */}
        <div className="glass-panel p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-blue-500 bg-blue-900/20">
          <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 animate-pulse">
            <CloudRain size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t.rainChance[language]}</p>
            <p className="text-2xl font-bold text-white">75% <span className="text-xs font-normal text-gray-400">(4 PM)</span></p>
            <p className="text-xs text-blue-300 mt-1">{t.highChance[language]}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-yellow-400">
          <div className="p-3 bg-yellow-400/20 rounded-full text-yellow-400">
            <Sun size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t.temp[language]}</p>
            <p className="text-2xl font-bold text-white">28°C</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-teal-400">
          <div className="p-3 bg-teal-400/20 rounded-full text-teal-400">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t.humidity[language]}</p>
            <p className="text-2xl font-bold text-white">65%</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center space-x-4 border-l-4 border-gray-400">
          <div className="p-3 bg-gray-400/20 rounded-full text-gray-300">
            <Wind size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t.wind[language]}</p>
            <p className="text-2xl font-bold text-white">12 km/h</p>
          </div>
        </div>
      </div>

      {/* Health & Moisture Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-agri-accent" />
              {t.trends[language]}
            </h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-agri-main"></span> {t.cropHealth[language]}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> {t.soilMoisture[language]}</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-agri-main)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-agri-main)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-agri-dark)', border: '1px solid var(--color-agri-main)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="health" stroke="var(--color-agri-main)" fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMoisture)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">{t.farmStatus[language]}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-agri-main" size={20} />
                  <span className="text-gray-300">{t.overallHealth[language]}</span>
                </div>
                <span className="font-bold text-white">{avgHealth}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-500" size={20} />
                  <span className="text-gray-300">{t.issuesDetected[language]}</span>
                </div>
                <span className="font-bold text-white">{recentIssues}</span>
              </div>
            </div>
            <div className="mt-6">
               <p className="text-sm text-gray-400 mb-2">{t.soilType[language]}</p>
               <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-agri-main h-2.5 rounded-full" style={{ width: '85%' }}></div>
               </div>
               <p className="text-xs text-right mt-1 text-agri-accent">Excellent Condition</p>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-agri-dark/80 to-transparent border border-agri-main/30">
             <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Sun size={18} className="text-yellow-400" /> {t.proTip[language]}
             </h3>
             <p className="text-sm text-gray-300 italic">
               "{language === 'hi' 
                 ? `आपकी मिट्टी के प्रकार (${user.soilType}) के आधार पर, आगामी सूखे से पहले जड़ विकास को प्रोत्साहित करने के लिए इस सप्ताह गहरी सिंचाई करें।`
                 : `Based on your soil type (${user.soilType}), consider deep watering this week to encourage root growth before the upcoming dry spell.`}"
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};