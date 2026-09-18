import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  School,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { allStudents, currentUser, switchUser, loginWithPin, registerStudent } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginRegNo, setLoginRegNo] = useState<string>('AZA/2024/0412');
  const [loginPin, setLoginPin] = useState<string>('1234');
  
  // Register form state
  const [regData, setRegData] = useState({
    fullName: '',
    studentRegNo: '',
    schoolName: 'Sekondari ya Benjamin Mkapa',
    educationLevel: 'Sekondari' as 'Sekondari' | 'Chuo Kikuu' | 'Chuo cha Kati & Ufundi',
    courseOrClass: 'Kidato cha 5 (HGL)',
    email: '',
    phone: '+255 7',
    securityPin: '2024'
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    setTimeout(() => {
      const res = loginWithPin(loginRegNo, loginPin);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regData.fullName || !regData.studentRegNo || !regData.schoolName) {
      setError('Tafadhali jaza taarifa zote muhimu za mwanafunzi.');
      return;
    }

    if (regData.securityPin.length !== 4) {
      setError('PIN ya usalama lazima iwe na tarakimu 4 haswa.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerStudent(regData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {mode === 'login' ? 'Kuingia Kama Mwanafunzi' : 'Sajili Akaunti ya Mwanafunzi'}
              </h3>
              <p className="text-xs text-emerald-200">
                Student Investment & Entrepreneurship System
              </p>
            </div>
          </div>
        </div>

        {/* Quick Demo Switcher Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Badilisha Mtumiaji Haraka (Demo Switcher):
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {allStudents.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  switchUser(s.id);
                  onClose();
                }}
                className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                  currentUser.id === s.id
                    ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-600 font-bold text-emerald-950'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <img
                  src={s.avatarUrl}
                  alt={s.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <div className="truncate">
                  <div className="text-xs font-bold truncate">{s.fullName.split(' ')[0]} {s.fullName.split(' ')[1]}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {s.role === 'admin' ? '🛡️ Admin' : `🎓 ${s.educationLevel}`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Ingia kwenye Akaunti (Login)
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Jisajili Mpya (Register)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Namba ya Usajili ya Mwanafunzi (Student Reg No)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginRegNo}
                    onChange={(e) => setLoginRegNo(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="Mfano: AZA/2024/0412 au UDSM/2023/1189"
                    required
                  />
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  PIN ya Usalama (4-digits)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-base font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="••••"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Thibitisha na Ingia Kwenye Mfumo
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jina Kamili la Mwanafunzi
                </label>
                <input
                  type="text"
                  value={regData.fullName}
                  onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Mfano: Amina Kassim Bakari"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Namba ya Usajili (Reg No)
                  </label>
                  <input
                    type="text"
                    value={regData.studentRegNo}
                    onChange={(e) => setRegData({ ...regData, studentRegNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="BMK/2024/055"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngazi ya Elimu
                  </label>
                  <select
                    value={regData.educationLevel}
                    onChange={(e) => setRegData({ ...regData, educationLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Sekondari">Sekondari (O & A Level)</option>
                    <option value="Chuo Kikuu">Chuo Kikuu (University)</option>
                    <option value="Chuo cha Kati & Ufundi">VETA / Chuo cha Ufundi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jina la Shule / Chuo
                </label>
                <input
                  type="text"
                  value={regData.schoolName}
                  onChange={(e) => setRegData({ ...regData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="Shule ya Sekondari Azania / UDSM"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kidato / Kozi
                  </label>
                  <input
                    type="text"
                    value={regData.courseOrClass}
                    onChange={(e) => setRegData({ ...regData, courseOrClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="Kidato cha 5 (PCB)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Namba ya Simu
                  </label>
                  <input
                    type="text"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="+255 7XX XXX XXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tengeneza PIN ya Usalama wa Miamala (4-digits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={regData.securityPin}
                  onChange={(e) => setRegData({ ...regData, securityPin: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 tracking-widest text-center text-lg font-bold rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  placeholder="2024"
                  required
                />
              </div>

              {/* Bonus banner */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Bonasi ya Kuanzia:</strong> Kila mwanafunzi anayesajiliwa anapewa <strong>TZS 10,000</strong> ya bure kuanzia uwekezaji shuleni!
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Kamilisha Usajili & Pokea TZS 10,000
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mfumo rasmi uliothibitishwa kwa wanafunzi pekee</span>
          </div>

        </div>

      </div>
    </div>
  );
};
