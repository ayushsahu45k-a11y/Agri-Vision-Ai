import React, { useState } from 'react';
import { User, Language } from '../types';
import { Upload, Sprout, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Layout';
import { t } from '../utils/translations';

interface AuthProps {
  onLogin: (user: User, isAdmin?: boolean) => void;
  language: Language;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, language }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cropType: '',
    fieldSize: '',
    soilType: '',
    password: '',
    adminKey: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (isAdminLogin) {
        if (formData.adminKey === 'admin123') {
           onLogin({
             name: 'Administrator',
             email: 'admin@agrivision.ai',
             cropType: 'N/A',
             fieldSize: 0,
             soilType: 'N/A',
             photoUrl: null
           }, true);
        } else {
           alert("Invalid Admin Key");
           setLoading(false);
           return;
        }
      } else {
        const user: User = {
          name: formData.name || 'Farmer',
          email: formData.email,
          cropType: formData.cropType || 'Wheat',
          fieldSize: Number(formData.fieldSize) || 10,
          soilType: formData.soilType || 'Loamy',
          photoUrl: photoPreview
        };
        onLogin(user, false);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-58197bd47d26?auto=format&fit=crop&q=80&w=2000" 
          alt="Farm Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl shadow-agri-dark/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-agri-main/20 text-agri-main mb-4 ring-2 ring-agri-main/50">
              {isAdminLogin ? <ShieldCheck size={32} /> : <Sprout size={32} />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isAdminLogin ? t.adminPanel[language] : 'AgriVision AI'}
            </h1>
            <p className="text-gray-400">
              {isAdminLogin ? t.enterKey[language] : 'Advanced Crop Intelligence'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdminLogin ? (
              <div className="space-y-2">
                <label className="text-sm text-gray-400">{t.adminKey[language]}</label>
                <input
                  type="password"
                  name="adminKey"
                  required
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agri-main focus:ring-1 focus:ring-agri-main transition-all"
                  placeholder="Enter Key..."
                  value={formData.adminKey}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <>
                {!isRegistering ? (
                  // Login Fields
                  <>
                     <div className="space-y-2">
                      <label className="text-sm text-gray-400">{t.emailAddr[language]}</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agri-main focus:ring-1 focus:ring-agri-main transition-all"
                        placeholder="farmer@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">{t.password[language]}</label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-agri-main focus:ring-1 focus:ring-agri-main transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  // Registration Fields
                  <>
                     <div className="flex justify-center mb-6">
                       <div className="relative group cursor-pointer">
                         <div className={`w-24 h-24 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden bg-black/40 ${photoPreview ? 'border-agri-main' : ''}`}>
                           {photoPreview ? (
                             <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <Upload className="text-gray-500" />
                           )}
                         </div>
                         <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <p className="text-xs text-center mt-2 text-gray-500">{t.uploadPhoto[language]}</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder={t.fullName[language]}
                          className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-agri-main focus:outline-none"
                          onChange={handleInputChange}
                        />
                        <input
                          type="text"
                          name="cropType"
                          required
                          placeholder={t.mainCrop[language]}
                          className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-agri-main focus:outline-none"
                          onChange={handleInputChange}
                        />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          name="fieldSize"
                          required
                          placeholder={t.acres[language]}
                          className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-agri-main focus:outline-none"
                          onChange={handleInputChange}
                        />
                         <select
                          name="soilType"
                          className="bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:border-agri-main focus:outline-none"
                          onChange={handleInputChange}
                        >
                          <option value="">{t.soilType[language]}</option>
                          <option value="Loamy">Loamy</option>
                          <option value="Clay">Clay</option>
                          <option value="Sandy">Sandy</option>
                          <option value="Silt">Silt</option>
                        </select>
                     </div>
                     
                     <input
                        type="email"
                        name="email"
                        required
                        placeholder={t.emailAddr[language]}
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-agri-main focus:outline-none"
                        onChange={handleInputChange}
                      />
                  </>
                )}
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <span className="animate-pulse">{t.processing[language]}</span>
              ) : (
                isAdminLogin 
                  ? t.adminLogin[language]
                  : (isRegistering ? t.startProfile[language] : t.accessDashboard[language])
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            {!isAdminLogin && (
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-agri-accent hover:text-white transition-colors block w-full"
              >
                {isRegistering ? t.alreadyAccount[language] : t.newFarmer[language]}
              </button>
            )}
            
            <div className="pt-4 border-t border-gray-800">
               <button
                  type="button"
                  onClick={() => setIsAdminLogin(!isAdminLogin)}
                  className="text-xs text-gray-500 hover:text-agri-main transition-colors"
               >
                 {isAdminLogin ? t.farmerLogin[language] : t.adminLogin[language]}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};