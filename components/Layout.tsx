import React from 'react';
import { Sprout, LayoutDashboard, ScanLine, History, Users, MessageSquareText, LogOut, Menu, X, UserCircle, Info, Shield } from 'lucide-react';
import { View, User, Language } from '../types';
import { t } from '../utils/translations';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  language: Language;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout, language, isAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        currentView === view
          ? 'bg-agri-main text-white shadow-lg shadow-agri-main/30'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => user && setView(isAdmin ? View.ADMIN_DASHBOARD : View.DASHBOARD)}>
            <div className="bg-agri-main p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-agri-main to-agri-accent bg-clip-text text-transparent">
              AgriVision
            </span>
            {isAdmin && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">ADMIN</span>}
          </div>

          {/* Desktop Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-2">
              {isAdmin ? (
                // Admin Navigation
                <>
                  <NavItem view={View.ADMIN_DASHBOARD} icon={Shield} label="Admin" />
                  <NavItem view={View.ABOUT} icon={Info} label={t.about[language]} />
                </>
              ) : (
                // Farmer Navigation
                <>
                  <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label={t.dashboard[language]} />
                  <NavItem view={View.ANALYZE} icon={ScanLine} label={t.analyze[language]} />
                  <NavItem view={View.HISTORY} icon={History} label={t.history[language]} />
                  <NavItem view={View.SOCIAL} icon={Users} label={t.community[language]} />
                  <NavItem view={View.ABOUT} icon={Info} label={t.about[language]} />
                </>
              )}
              
              <div className="ml-4 pl-4 border-l border-gray-700 flex items-center space-x-3">
                <button
                  onClick={() => setView(View.PROFILE)}
                  className={`flex items-center space-x-2 p-1 rounded-full transition-all ${
                    currentView === View.PROFILE ? 'ring-2 ring-agri-main' : 'hover:ring-2 hover:ring-gray-600'
                  }`}
                >
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="h-9 w-9 rounded-full border border-agri-main object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-agri-dark flex items-center justify-center border border-agri-main">
                      <span className="text-xs font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden glass-panel border-t border-white/10 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {isAdmin ? (
                <NavItem view={View.ADMIN_DASHBOARD} icon={Shield} label="Admin Panel" />
             ) : (
               <>
                 <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label={t.dashboard[language]} />
                 <NavItem view={View.ANALYZE} icon={ScanLine} label={t.analyze[language]} />
                 <NavItem view={View.HISTORY} icon={History} label={t.history[language]} />
                 <NavItem view={View.SOCIAL} icon={Users} label={t.community[language]} />
               </>
             )}
              <NavItem view={View.ABOUT} icon={Info} label={t.about[language]} />
              <NavItem view={View.PROFILE} icon={UserCircle} label={t.profile[language]} />
             <button
                onClick={onLogout}
                className="flex w-full items-center space-x-2 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg"
              >
                <LogOut size={20} />
                <span>{t.logout[language]}</span>
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => (
  <footer className="w-full py-6 mt-auto border-t border-white/10 bg-black/50 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-agri-main font-mono text-sm tracking-widest opacity-80 animate-pulse">
        Analysis-with-Ayush
      </p>
      <p className="text-gray-600 text-xs mt-2">
        &copy; {new Date().getFullYear()} AgriVision AI. Empowering Farmers.
      </p>
    </div>
  </footer>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-agri-main to-agri-accent hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-agri-dark/50",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10",
    outline: "border-2 border-agri-main text-agri-main hover:bg-agri-main/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};