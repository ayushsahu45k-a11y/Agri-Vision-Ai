import { TranslationDictionary } from '../types';

export const t: TranslationDictionary = {
  // Navigation
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  analyze: { en: 'Analyze', hi: 'विश्लेषण' },
  history: { en: 'History', hi: 'इतिहास' },
  community: { en: 'Community', hi: 'समुदाय' },
  assistant: { en: 'AI Assistant', hi: 'AI सहायक' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  about: { en: 'About Us', hi: 'हमारे बारे में' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  adminPanel: { en: 'Admin Panel', hi: 'एडमिन पैनल' },

  // Auth
  startProfile: { en: 'Start My Farm Profile', hi: 'मेरा फार्म प्रोफाइल शुरू करें' },
  accessDashboard: { en: 'Access Dashboard', hi: 'डैशबोर्ड एक्सेस करें' },
  alreadyAccount: { en: 'Already have an account? Login', hi: 'पहले से खाता है? लॉग इन करें' },
  newFarmer: { en: 'New Farmer? Create Account', hi: 'नया किसान? खाता बनाएं' },
  uploadPhoto: { en: 'Upload Photo', hi: 'फोटो अपलोड करें' },
  fullName: { en: 'Full Name', hi: 'पूरा नाम' },
  mainCrop: { en: 'Main Crop', hi: 'मुख्य फसल' },
  acres: { en: 'Acres', hi: 'एकड़' },
  soilType: { en: 'Soil Type', hi: 'मिट्टी का प्रकार' },
  emailAddr: { en: 'Email Address', hi: 'ईमेल पता' },
  password: { en: 'Password', hi: 'पासवर्ड' },
  adminLogin: { en: 'Admin Login', hi: 'एडमिन लॉगइन' },
  farmerLogin: { en: 'Farmer Login', hi: 'किसान लॉगइन' },
  adminKey: { en: 'Admin Key', hi: 'एडमिन की (Key)' },
  enterKey: { en: 'Enter Admin Security Key', hi: 'एडमिन सुरक्षा कुंजी दर्ज करें' },

  // Dashboard
  welcome: { en: 'Welcome back,', hi: 'वापसी पर स्वागत है,' },
  farmStatus: { en: "Here's what's happening on your farm today.", hi: 'आज आपके खेत में क्या हो रहा है।' },
  newAnalysis: { en: '+ New Crop Analysis', hi: '+ नई फसल विश्लेषण' },
  temp: { en: 'Temperature', hi: 'तापमान' },
  humidity: { en: 'Humidity', hi: 'नमी' },
  wind: { en: 'Wind Speed', hi: 'हवा की गति' },
  rainChance: { en: 'Rain Chance', hi: 'बारिश की संभावना' },
  highChance: { en: 'High', hi: 'उच्च' },
  lowChance: { en: 'Low', hi: 'कम' },
  soilMoisture: { en: 'Soil Moisture', hi: 'मिट्टी की नमी' },
  cropHealth: { en: 'Crop Health', hi: 'फसल स्वास्थ्य' },
  trends: { en: 'Moisture & Health Trends', hi: 'नमी और स्वास्थ्य रुझान' },
  overallHealth: { en: 'Overall Health', hi: 'कुल स्वास्थ्य' },
  issuesDetected: { en: 'Issues Detected', hi: 'समस्याएं पाई गईं' },
  proTip: { en: 'Pro Tip', hi: 'प्रो टिप' },
  
  // Analyzer
  diagnosticsTitle: { en: 'AI Crop Diagnostics', hi: 'AI फसल निदान' },
  diagnosticsDesc: { en: 'Upload a clear photo of your crop leaf.', hi: 'अपनी फसल की पत्ती की स्पष्ट फोटो अपलोड करें।' },
  startAnalysis: { en: 'Start Analysis', hi: 'विश्लेषण शुरू करें' },
  processing: { en: 'Processing...', hi: 'प्रोसेसिंग...' },
  analyzing: { en: 'ANALYZING BIOMETRICS...', hi: 'बायोमेट्रिक्स का विश्लेषण हो रहा है...' },
  diagnosis: { en: 'Diagnosis', hi: 'निदान' },
  treatmentPlan: { en: 'Treatment Plan', hi: 'उपचार योजना' },
  getTreatment: { en: 'AI-Analysis-with-US', hi: 'AI-Analysis-with-US' },
  generating: { en: 'Generating Plan...', hi: 'योजना बन रही है...' },
  
  // Social
  networkTitle: { en: 'Global Farmer Network', hi: 'वैश्विक किसान नेटवर्क' },
  networkDesc: { en: 'Connect, share insights, and grow together.', hi: 'जुड़ें, साझा करें और साथ बढ़ें।' },
  searchPlaceholder: { en: 'Search farmers by name or crop...', hi: 'नाम या फसल द्वारा किसानों को खोजें...' },
  connect: { en: 'Connect', hi: 'जुड़ें' },
  connected: { en: 'Connected', hi: 'जुड़े हुए' },
  expert: { en: 'Expert', hi: 'विशेषज्ञ' },

  // Profile
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  appTheme: { en: 'App Theme', hi: 'ऐप थीम' },
  appLanguage: { en: 'App Language', hi: 'ऐप भाषा' },
  signOut: { en: 'Sign Out', hi: 'साइन आउट' },
  myProfile: { en: 'My Profile', hi: 'मेरी प्रोफ़ाइल' },
  saveChanges: { en: 'Save Changes', hi: 'परिवर्तन सहेजें' },
  editProfile: { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },

  // Admin
  totalFarmers: { en: 'Total Farmers', hi: 'कुल किसान' },
  activeToday: { en: 'Active Today', hi: 'आज सक्रिय' },
  recentActivity: { en: 'Recent Activity', hi: 'हाल की गतिविधि' },
  farmerList: { en: 'Farmer Database', hi: 'किसान डेटाबेस' },
  status: { en: 'Status', hi: 'स्थिति' },
  online: { en: 'Online', hi: 'ऑनलाइन' },
  offline: { en: 'Offline', hi: 'ऑफ़लाइन' },
  actions: { en: 'Actions', hi: 'कार्रवाई' },
  delete: { en: 'Delete', hi: 'हटाएं' },
  exportData: { en: 'Export Data', hi: 'डेटा निर्यात' },
  broadcast: { en: 'Broadcast', hi: 'प्रसारण' },

  // About - Added to fix potential errors
  aboutTitle: { en: 'Cultivating the Future', hi: 'भविष्य की खेती' },
  aboutDesc: { en: 'AgriVision AI bridges the gap between traditional farming and advanced technology.', hi: 'AgriVision AI पारंपरिक खेती और उन्नत तकनीक के बीच की खाई को पाटता है।' },
  mission: { en: 'Our Mission', hi: 'हमारा मिशन' },
  missionText: { en: 'To empower every farmer with accessible, data-driven insights that maximize yield and minimize waste.', hi: 'हर किसान को सुलभ, डेटा-आधारित अंतर्दृष्टि के साथ सशक्त बनाना जो उपज को अधिकतम और बर्बादी को कम करे।' },
  team: { en: 'Our Team', hi: 'हमारी टीम' },
  teamDesc: { en: 'A passionate group of agronomists, engineers, and designers working for the global food supply.', hi: 'कृषि वैज्ञानिकों, इंजीनियरों और डिजाइनरों का एक जुनूनी समूह जो वैश्विक खाद्य आपूर्ति के लिए काम कर रहा है।' }
};