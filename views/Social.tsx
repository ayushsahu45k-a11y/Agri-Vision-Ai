import React, { useState } from 'react';
import { SocialUser, Language } from '../types';
import { MapPin, UserPlus, Check, MessageCircle, Search, Users } from 'lucide-react';
import { t } from '../utils/translations';

const MOCK_USERS: SocialUser[] = [
  { id: '1', name: 'Rajesh Kumar', location: 'Punjab, India', cropSpecialty: 'Wheat', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Jenkins', location: 'Ohio, USA', cropSpecialty: 'Corn', isFriend: true, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Kenji Tanaka', location: 'Hokkaido, Japan', cropSpecialty: 'Rice', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Maria Garcia', location: 'Andalusia, Spain', cropSpecialty: 'Olives', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Ahmed Hassan', location: 'Nile Delta, Egypt', cropSpecialty: 'Cotton', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', name: 'Liu Wei', location: 'Henan, China', cropSpecialty: 'Soybean', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', name: 'Anita Desai', location: 'Maharashtra, India', cropSpecialty: 'Sugarcane', isFriend: false, avatarUrl: 'https://i.pravatar.cc/150?u=7' },
];

interface SocialProps {
  language: Language;
}

export const Social: React.FC<SocialProps> = ({ language }) => {
  const [users, setUsers] = useState<SocialUser[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFriend = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isFriend: !u.isFriend } : u));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cropSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
          <Users size={32} className="text-agri-main" />
          {t.networkTitle[language]}
        </h2>
        <p className="text-gray-400 mt-2">{t.networkDesc[language]}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-500" size={20} />
        </div>
        <input
          type="search"
          placeholder={t.searchPlaceholder[language]}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-glass-panel border border-gray-700 rounded-xl py-4 pl-10 pr-4 text-white focus:border-agri-main focus:ring-1 focus:ring-agri-main transition-all outline-none backdrop-blur-md bg-white/5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="glass-panel p-6 rounded-2xl group hover:border-agri-main/50 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-agri-dark object-cover group-hover:scale-105 transition-transform" />
                <div>
                  <h3 className="font-bold text-white text-lg">{user.name}</h3>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <MapPin size={12} className="mr-1" />
                    {user.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 mb-6">
              <div className="inline-block px-3 py-1 rounded-full bg-agri-dark/50 text-agri-accent text-xs font-semibold border border-agri-main/20">
                {user.cropSpecialty} {t.expert[language]}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toggleFriend(user.id)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                  ${user.isFriend 
                    ? 'bg-agri-main/20 text-agri-accent border border-agri-main/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {user.isFriend ? <><Check size={16} /> {t.connected[language]}</> : <><UserPlus size={16} /> {t.connect[language]}</>}
              </button>
              {user.isFriend && (
                <button className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                  <MessageCircle size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No farmers found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};