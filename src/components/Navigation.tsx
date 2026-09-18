import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTZS } from '../utils/formatters';
import { 
  Home, 
  Briefcase, 
  PiggyBank, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  Wallet, 
  Users, 
  ChevronDown, 
  LogOut, 
  GraduationCap, 
  Lock,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  Trophy,
  Share2,
  BookOpen,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole
} from 'lucide-react';

interface NavigationProps {
  onOpenWallet: (mode?: 'deposit' | 'withdraw') => void;
  onOpenAuth: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenWallet, onOpenAuth }) => {
  const { 
    currentUser, 
    allStudents, 
    switchUser, 
    activeTab, 
    setActiveTab, 
    transactions,
    systemSecurity,
    toggleBalanceMask,
    lockScreen,
    logout
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | null }> = [
    { id: 'dashboard', label: 'Dashibodi', icon: Home },
    { id: 'projects', label: 'Miradi ya Shule', icon: Briefcase },
    { id: 'challenges', label: 'Mashindano & Pitch', icon: Trophy },
    { id: 'social', label: 'Jumuiya & Mitandao', icon: Share2 },
    { id: 'academy', label: 'Elimu & Vyeti', icon: BookOpen },
    { id: 'investments', label: 'Uwekezaji Wangu', icon: PiggyBank },
    { id: 'reports', label: 'Ripoti za Mapato', icon: FileText },
    { id: 'security', label: 'Usalama & PIN', icon: ShieldCheck },
  ];

  return (
    <>
      {/* TOP DESKTOP & MOBILE HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 block leading-none font-['Outfit',sans-serif]">
                    Student<span className="text-emerald-600">Ventures</span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                    Uwekezaji wa Wanafunzi
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User & Wallet Quick Controls */}
            <div className="flex items-center gap-2">
              
              {/* Screen Privacy Lock Button */}
              <button
                id="nav-btn-lock-screen"
                onClick={lockScreen}
                className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition"
                title="Funga skrini mara moja kulinda faragha (Lock Screen)"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Student Wallet Chip with Privacy Toggle */}
              <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden">
                <button
                  onClick={() => onOpenWallet('deposit')}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200/70 transition-colors"
                >
                  <Wallet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold leading-none">Salio</span>
                    <span className="text-xs font-black text-slate-900 leading-none">
                      {systemSecurity.balanceMasked ? '••••••••' : formatTZS(currentUser.balance)}
                    </span>
                  </div>
                </button>
                <button
                  onClick={toggleBalanceMask}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                  title={systemSecurity.balanceMasked ? 'Onyesha Salio' : 'Ficha Salio'}
                >
                  {systemSecurity.balanceMasked ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Student Logout Button */}
              <button
                id="nav-btn-student-logout"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition shadow-2xs"
                title="Toka kwenye akaunti (Logout)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Toka</span>
              </button>

              {/* User Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/50"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[110px]">
                      {currentUser.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium uppercase">
                      🎓 {currentUser.courseOrClass.split(' ')[0] || 'Sekondari'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.schoolName}</p>
                      <p className="text-[10px] font-mono text-emerald-700 mt-0.5">Reg: {currentUser.studentRegNo} • {currentUser.courseOrClass}</p>
                      {currentUser.status === 'pending_approval' && (
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          Inasubiri Uidhinishaji wa Mwalimu Mkuu
                        </span>
                      )}
                    </div>

                    <div className="px-3 py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Akaunti za Wanafunzi wa Sekondari:
                      </span>
                      <div className="space-y-1">
                        {allStudents.filter(s => s.role === 'student').map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              switchUser(s.id);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full p-1.5 rounded-xl flex items-center gap-2 text-left transition-colors ${
                              currentUser.id === s.id
                                ? 'bg-emerald-50 text-emerald-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <img
                              src={s.avatarUrl}
                              alt={s.fullName}
                              className="w-6 h-6 rounded-lg object-cover"
                            />
                            <div className="truncate text-xs">
                              <span className="block truncate">{s.fullName}</span>
                              <span className="text-[10px] text-slate-400 block">
                                {s.courseOrClass} • {s.schoolName.split(' ')[0]}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="px-3 pt-2 border-t border-slate-100 space-y-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuth();
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50 text-left flex items-center gap-2"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Sajili Mwanafunzi Mpya
                      </button>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 text-left flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Toka Kwenye Mfumo (Logout)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger menu toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  logout();
                }}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 bg-rose-50 text-rose-700 border border-rose-200"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Toka Kwenye Mfumo (Logout)</span>
              </button>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  lockScreen();
                }}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Funga Skrini ya Faragha (Lock Screen)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed on Mobile for ease of thumb reach) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg pb-safe">
        <div className="grid grid-cols-5 gap-1 items-center text-center">
          {[
            { id: 'dashboard', label: 'Mwanzo', icon: Home, badge: null },
            { id: 'projects', label: 'Miradi', icon: Briefcase, badge: null },
            { id: 'challenges', label: 'Pitch', icon: Trophy, badge: null },
            { id: 'social', label: 'Jamii', icon: Share2, badge: null },
            { id: 'academy', label: 'Elimu', icon: BookOpen, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive
                    ? 'text-emerald-700 font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 scale-110' : 'text-slate-400'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 px-1.2 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight leading-none truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
