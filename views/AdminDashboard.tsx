import React, { useState } from 'react';
import { User, Language } from '../types';
import { Users, Activity, Clock, Search, Shield, Trash2, Download, Radio } from 'lucide-react';
import { t } from '../utils/translations';
import { Button } from '../components/Layout';

interface AdminDashboardProps {
  allUsers: User[];
  language: Language;
  onDeleteUser: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, language, onDeleteUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter out the admin user from the display list
  const farmers = allUsers.filter(u => u.email !== 'admin@agrivision.ai');
  
  // Active count
  const activeNow = farmers.filter(u => u.lastActive && (Date.now() - u.lastActive) < 300000).length;

  // Filtered list based on search
  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.cropType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Crop,Acres,Soil\n"
      + farmers.map(f => `${f.name},${f.email},${f.cropType},${f.fieldSize},${f.soilType}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agrivision_farmers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBroadcast = () => {
    alert("Broadcast message feature simulated: Alert sent to all active farmers!");
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-agri-main rounded-xl">
            <Shield className="text-white h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">{t.adminPanel[language]}</h2>
            <p className="text-gray-400">Analysis-with-Ayush Admin Console</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" onClick={handleExport} className="text-sm px-4">
              <Download size={16} className="mr-2" />
              {t.exportData[language]}
           </Button>
           <Button variant="outline" onClick={handleBroadcast} className="text-sm px-4">
              <Radio size={16} className="mr-2" />
              {t.broadcast[language]}
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-agri-main flex items-center justify-between">
           <div>
              <p className="text-gray-400 mb-1">{t.totalFarmers[language]}</p>
              <h3 className="text-4xl font-bold text-white">{farmers.length}</h3>
           </div>
           <div className="p-4 bg-agri-main/20 rounded-full text-agri-main">
              <Users size={32} />
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500 flex items-center justify-between">
           <div>
              <p className="text-gray-400 mb-1">{t.activeToday[language]}</p>
              <h3 className="text-4xl font-bold text-white">{activeNow}</h3>
           </div>
           <div className="p-4 bg-blue-500/20 rounded-full text-blue-400">
              <Activity size={32} />
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500 flex items-center justify-between">
           <div>
              <p className="text-gray-400 mb-1">{t.recentActivity[language]}</p>
              <h3 className="text-4xl font-bold text-white">24h</h3>
           </div>
           <div className="p-4 bg-purple-500/20 rounded-full text-purple-400">
              <Clock size={32} />
           </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="glass-panel rounded-2xl overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Users size={20} />
             {t.farmerList[language]}
           </h3>
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search name, crop, email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-agri-main transition-colors"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">{t.fullName[language]}</th>
                    <th className="px-6 py-4">{t.mainCrop[language]}</th>
                    <th className="px-6 py-4">{t.acres[language]}</th>
                    <th className="px-6 py-4">Location/Soil</th>
                    <th className="px-6 py-4">{t.status[language]}</th>
                    <th className="px-6 py-4 text-right">{t.actions[language]}</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                 {filteredFarmers.map((farmer) => {
                    const isOnline = farmer.lastActive && (Date.now() - farmer.lastActive < 300000);
                    return (
                      <tr key={farmer.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-agri-dark border border-agri-main/50 flex items-center justify-center overflow-hidden">
                                   {farmer.photoUrl ? (
                                     <img src={farmer.photoUrl} alt="" className="w-full h-full object-cover" />
                                   ) : (
                                     <span className="font-bold text-agri-main">{farmer.name.charAt(0)}</span>
                                   )}
                                </div>
                                <div>
                                   <div className="font-medium text-white">{farmer.name}</div>
                                   <div className="text-xs text-gray-500">{farmer.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{farmer.cropType}</td>
                          <td className="px-6 py-4 text-gray-300">{farmer.fieldSize}</td>
                          <td className="px-6 py-4 text-gray-300">{farmer.soilType}</td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                             }`}>
                                {isOnline ? (
                                   <><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5" /> {t.online[language]}</>
                                ) : (
                                   <><span className="w-2 h-2 bg-gray-500 rounded-full mr-1.5" /> {t.offline[language]}</>
                                )}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                                onClick={() => farmer.id && onDeleteUser(farmer.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                title={t.delete[language]}
                             >
                                <Trash2 size={18} />
                             </button>
                          </td>
                      </tr>
                    );
                 })}
                 {filteredFarmers.length === 0 && (
                   <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                         {farmers.length === 0 
                           ? "Waiting for farmers to connect..." 
                           : "No farmers found matching your search."}
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};