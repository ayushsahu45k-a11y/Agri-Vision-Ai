import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/Layout';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { Analyzer } from './views/Analyzer';
import { Social } from './views/Social';
import { Profile } from './views/Profile';
import { About } from './views/About';
import { AdminDashboard } from './views/AdminDashboard';
import { User, View, AnalysisResult, ChatMessage, Theme, Language } from './types';
import { chatWithAssistant } from './services/geminiService';
import { MessageSquareText, Send, Bot, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// MOCK DATABASE INITIALIZATION
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'rajesh@farm.in', cropType: 'Wheat', fieldSize: 12, soilType: 'Loamy', photoUrl: 'https://i.pravatar.cc/150?u=1', lastActive: Date.now() - 1000000 },
  { id: 'u2', name: 'Sarah Jenkins', email: 'sarah@farm.us', cropType: 'Corn', fieldSize: 45, soilType: 'Silt', photoUrl: 'https://i.pravatar.cc/150?u=2', lastActive: Date.now() - 3600000 },
  { id: 'u3', name: 'Kenji Tanaka', email: 'kenji@farm.jp', cropType: 'Rice', fieldSize: 5, soilType: 'Clay', photoUrl: 'https://i.pravatar.cc/150?u=3', lastActive: Date.now() - 20000 }
];

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [theme, setTheme] = useState<Theme>('emerald');
  const [language, setLanguage] = useState<Language>('en');
  
  // "Database" state for Admin View
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Initialize Chat greeting when language changes or app starts
  useEffect(() => {
    const greeting = language === 'hi' 
      ? 'नमस्ते! मैं एग्रीबॉट हूं। आज मैं आपकी खेती में कैसे मदद कर सकता हूँ?'
      : 'Hello! I am AgriBot. How can I assist you with your farming today?';
    
    setChatMessages([{ id: 'init', role: 'model', text: greeting, timestamp: Date.now() }]);
  }, [language]);

  // Apply Theme CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'emerald') {
      root.style.setProperty('--color-agri-dark', '#022c22');
      root.style.setProperty('--color-agri-main', '#10b981');
      root.style.setProperty('--color-agri-accent', '#34d399');
    } else if (theme === 'sunset') {
      root.style.setProperty('--color-agri-dark', '#431407'); // orange-950
      root.style.setProperty('--color-agri-main', '#f97316'); // orange-500
      root.style.setProperty('--color-agri-accent', '#fb923c'); // orange-400
    } else if (theme === 'ocean') {
      root.style.setProperty('--color-agri-dark', '#172554'); // blue-950
      root.style.setProperty('--color-agri-main', '#3b82f6'); // blue-500
      root.style.setProperty('--color-agri-accent', '#60a5fa'); // blue-400
    }
  }, [theme]);

  // Authentication Logic
  const handleLogin = (userData: User, adminLogin = false) => {
    if (adminLogin) {
      setUser(userData);
      setIsAdmin(true);
      setCurrentView(View.ADMIN_DASHBOARD);
    } else {
      // Check if user exists in "DB"
      const existingUser = allUsers.find(u => u.email === userData.email);
      let activeUser = userData;
      
      if (existingUser) {
        // Update activity
        activeUser = { ...existingUser, lastActive: Date.now() };
        setAllUsers(prev => prev.map(u => u.email === userData.email ? activeUser : u));
      } else {
        // Register new user
        activeUser = { ...userData, id: Date.now().toString(), lastActive: Date.now() };
        setAllUsers(prev => [...prev, activeUser]);
      }
      
      setUser(activeUser);
      setIsAdmin(false);
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
       setAllUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentView(View.LOGIN);
    setHistory([]);
    setIsChatOpen(false);
  };

  // Chat Logic
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setChatLoading(true);

    const responseText = await chatWithAssistant(
      chatMessages.map(m => ({ role: m.role, text: m.text })),
      newUserMsg.text,
      language
    );

    const newBotMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "I apologize, I'm momentarily unavailable.",
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, newBotMsg]);
    setChatLoading(false);
  };

  // View Rendering
  const renderView = () => {
    if (!user) return <Auth onLogin={handleLogin} language={language} />;

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard user={user} history={history} onChangeView={setCurrentView} language={language} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard allUsers={allUsers} language={language} onDeleteUser={handleDeleteUser} />;
      case View.ANALYZE:
        return <Analyzer onAnalysisComplete={(res) => setHistory([res, ...history])} language={language} />;
      case View.HISTORY:
        return (
          <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
             <h2 className="text-3xl font-bold text-white mb-6">Analysis History</h2>
             {history.length === 0 ? (
               <div className="text-center text-gray-500 py-10">No analysis history found. Start by scanning a crop!</div>
             ) : (
               <div className="grid gap-4">
                 {history.map(item => (
                   <div key={item.id} className="glass-panel p-4 rounded-xl flex gap-4 items-center">
                     <img src={item.imageUrl} className="w-20 h-20 rounded-lg object-cover" alt="crop" />
                     <div className="flex-1">
                       <h3 className="font-bold text-white">{item.cropDetected}</h3>
                       <p className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                       <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${item.condition === 'Healthy' ? 'bg-agri-main/20 text-agri-accent' : 'bg-red-500/20 text-red-400'}`}>
                         {item.condition}
                       </span>
                     </div>
                     <div className="text-right">
                       <div className="text-xl font-bold text-white">{item.healthScore}%</div>
                       <div className="text-xs text-gray-500">Health</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        );
      case View.SOCIAL:
        return <Social language={language} />;
      case View.ABOUT:
        return <About language={language} />;
      case View.PROFILE:
        return (
          <Profile 
            user={user} 
            theme={theme}
            language={language}
            onThemeChange={setTheme}
            onLanguageChange={setLanguage}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        );
      case View.CHAT: // Handled by floating button
        setCurrentView(View.DASHBOARD);
        setIsChatOpen(true);
        return <Dashboard user={user} history={history} onChangeView={setCurrentView} language={language} />;
      default:
        return <Dashboard user={user} history={history} onChangeView={setCurrentView} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-agri-main/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000 ${
          theme === 'emerald' ? 'bg-emerald-900/20' : theme === 'sunset' ? 'bg-orange-900/20' : 'bg-blue-900/20'
        }`} />
        <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 transition-colors duration-1000 ${
          theme === 'emerald' ? 'bg-teal-900/10' : theme === 'sunset' ? 'bg-red-900/10' : 'bg-indigo-900/10'
        }`} />
      </div>

      {user && (
        <Navbar 
          currentView={currentView} 
          setView={setCurrentView} 
          user={user} 
          onLogout={handleLogout} 
          language={language}
          isAdmin={isAdmin}
        />
      )}

      <main className="flex-grow relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {renderView()}
      </main>

      <Footer />

      {/* Floating Chat Bot - Global Availability (Available for all except Admin if desired, or everyone) */}
      {user && !isAdmin && (
        <>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg shadow-agri-main/30 transition-all duration-300 hover:scale-110 ${
              isChatOpen ? 'bg-red-500 text-white rotate-90' : 'bg-agri-main text-white'
            }`}
          >
            {isChatOpen ? <X size={24} /> : <MessageSquareText size={24} />}
          </button>

          {isChatOpen && (
            <div className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[400px] h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl animate-slide-up border border-agri-main/20">
              <div className="p-4 border-b border-white/10 bg-agri-dark/50 rounded-t-2xl flex items-center gap-3">
                <div className="p-2 bg-agri-main rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">AgriBot AI</h3>
                  <p className="text-xs text-agri-accent flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-agri-accent animate-pulse" /> Online
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-agri-main text-white rounded-tr-none' 
                        : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
                    }`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={language === 'hi' ? "फसल के बारे में पूछें..." : "Ask about crops..."}
                    className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-agri-main"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2 bg-agri-main rounded-lg text-white hover:bg-agri-main/80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
