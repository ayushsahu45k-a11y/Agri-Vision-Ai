import React, { useState } from 'react';
import { User, Theme, Language } from '../types';
import { Button } from '../components/Layout';
import { User as UserIcon, LogOut, Palette, Languages, Sprout, Edit2, Check, X, Upload } from 'lucide-react';
import { t } from '../utils/translations';

interface ProfileProps {
  user: User;
  theme: Theme;
  language: Language;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  theme, 
  language, 
  onThemeChange, 
  onLanguageChange, 
  onLogout,
  onUpdateUser
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(user.photoUrl);

  const ThemeOption = ({ value, color, label }: { value: Theme, color: string, label: string }) => (
    <button
      onClick={() => onThemeChange(value)}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
        theme === value ? 'border-agri-main bg-white/10' : 'border-gray-700 hover:bg-white/5'
      }`}
    >
      <div className={`w-12 h-12 rounded-full ${color} shadow-lg mb-1`} />
      <span className="text-sm font-medium text-gray-300">{label}</span>
      {theme === value && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-agri-main rounded-full animate-pulse" />
      )}
    </button>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPhotoPreview(url);
      setFormData({...formData, photoUrl: url});
    }
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setNewPhotoPreview(user.photoUrl);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <UserIcon className="text-agri-main" size={32} />
        {t.myProfile[language]}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Card */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              {newPhotoPreview ? (
                <img 
                  src={newPhotoPreview} 
                  alt="Profile" 
                  className={`w-32 h-32 rounded-full border-4 border-agri-main object-cover ${isEditing ? 'opacity-70' : ''}`} 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-agri-dark border-4 border-agri-main flex items-center justify-center">
                  <span className="text-4xl font-bold text-agri-main">{formData.name.charAt(0)}</span>
                </div>
              )}
              
              {isEditing && (
                 <label className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-full hover:bg-black/30 transition-colors">
                    <Upload className="text-white opacity-80" />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                 </label>
              )}

              <div className="absolute bottom-0 right-0 bg-agri-main p-2 rounded-full text-white">
                <Sprout size={16} />
              </div>
            </div>
            
            {!isEditing ? (
              <>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{user.email}</p>
              </>
            ) : (
              <div className="w-full mb-4 space-y-2">
                 <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-gray-600 rounded p-2 text-center text-white focus:border-agri-main outline-none"
                    placeholder="Name"
                 />
                 <div className="text-gray-500 text-xs">{user.email}</div>
              </div>
            )}
            
            <div className="w-full space-y-3 text-left bg-black/20 p-4 rounded-xl">
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-xs">{t.mainCrop[language]}</span>
                {isEditing ? (
                   <input 
                      type="text"
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-gray-600 rounded px-2 py-1 text-white focus:border-agri-main outline-none"
                      placeholder="e.g. Wheat"
                   />
                ) : (
                   <span className="text-white font-medium">{user.cropType}</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-xs">{t.acres[language]}</span>
                 {isEditing ? (
                   <input 
                      type="number"
                      name="fieldSize"
                      value={formData.fieldSize}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-gray-600 rounded px-2 py-1 text-white focus:border-agri-main outline-none"
                      placeholder="Size in Acres"
                   />
                ) : (
                   <span className="text-white font-medium">{user.fieldSize} Ac.</span>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 text-xs">{t.soilType[language]}</span>
                 {isEditing ? (
                   <input 
                      type="text"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleInputChange}
                      className="bg-black/40 border border-gray-600 rounded px-2 py-1 text-white focus:border-agri-main outline-none"
                      placeholder="e.g. Loamy, Red Soil"
                   />
                ) : (
                   <span className="text-white font-medium">{user.soilType}</span>
                )}
              </div>
            </div>

            <div className="mt-6 w-full space-y-2">
              {!isEditing ? (
                <Button 
                   onClick={() => setIsEditing(true)}
                   className="w-full bg-agri-main/10 border border-agri-main text-agri-main hover:bg-agri-main hover:text-white"
                >
                  <Edit2 size={16} className="mr-2" />
                  {t.editProfile[language]}
                </Button>
              ) : (
                <div className="flex gap-2">
                   <Button onClick={handleSave} className="flex-1 bg-agri-main text-white py-2">
                      <Check size={16} />
                   </Button>
                   <Button onClick={handleCancel} className="flex-1 bg-red-500/20 text-red-500 border border-red-500/50 py-2">
                      <X size={16} />
                   </Button>
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              >
                <LogOut size={18} />
                {t.signOut[language]}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Theme Settings */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Palette size={20} className="text-agri-main" />
              {t.appTheme[language]}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <ThemeOption 
                value="emerald" 
                color="bg-gradient-to-br from-emerald-500 to-teal-700" 
                label="Emerald (Default)" 
              />
              <ThemeOption 
                value="sunset" 
                color="bg-gradient-to-br from-orange-500 to-red-700" 
                label="Sunset" 
              />
              <ThemeOption 
                value="ocean" 
                color="bg-gradient-to-br from-blue-500 to-indigo-700" 
                label="Ocean" 
              />
            </div>
          </div>

          {/* Language Settings */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Languages size={20} className="text-agri-main" />
              {t.appLanguage[language]}
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => onLanguageChange('en')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 font-bold ${
                  language === 'en' 
                    ? 'border-agri-main bg-agri-main/20 text-white' 
                    : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 font-bold ${
                  language === 'hi' 
                    ? 'border-agri-main bg-agri-main/20 text-white' 
                    : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-500'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};