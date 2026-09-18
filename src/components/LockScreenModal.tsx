import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldAlert, KeyRound, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LockScreenModal: React.FC = () => {
  const { 
    isScreenLocked, 
    currentUser, 
    unlockScreen, 
    failedPinAttempts, 
    isPinLocked, 
    pinLockoutSecondsRemaining,
    systemSecurity
  } = useApp();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isScreenLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setErrorMessage('Tafadhali ingiza PIN yako ya usalama.');
      return;
    }

    const result = unlockScreen(pin);
    if (!result.success) {
      setErrorMessage(result.message);
      setPin('');
    } else {
      setErrorMessage('');
      setPin('');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (isPinLocked) return;
    if (pin.length < 6) {
      setPin(prev => prev + val);
      setErrorMessage('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div 
      id="screen-lock-overlay" 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-300"
    >
      <div 
        id="screen-lock-card" 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        {/* Top security glow indicator */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500" />

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Skrini Imefungwa kwa Usalama
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Taarifa zako za kifedha na salio zimefichwa kwa muda kulinda faragha yako.
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-slate-800/80 border border-slate-700 rounded-xl mb-6">
          <img 
            src={currentUser.avatarUrl} 
            alt={currentUser.fullName} 
            className="w-11 h-11 rounded-full object-cover border border-emerald-500/50"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.schoolName} • {currentUser.studentRegNo}</p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
            {currentUser.role === 'admin' ? 'Utawala' : 'Mwanafunzi'}
          </span>
        </div>

        {/* Lockout Notice */}
        {isPinLocked ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-rose-200">Kipindi Kimefungwa kwa Muda</p>
              <p>Majaribio yasiyo sahihi yamezidi. Subiri sekunde <strong>{pinLockoutSecondsRemaining}</strong> kabla ya kujaribu tena.</p>
            </div>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 text-left flex items-center justify-between">
              <span>Ingiza PIN ya Usalama ({currentUser.securityPin.length} tarakimu):</span>
              <span className="text-[10px] text-slate-500">Mfano: {currentUser.securityPin}</span>
            </label>
            <div className="relative">
              <input
                id="lock-screen-pin-input"
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                disabled={isPinLocked}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3 px-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-600 disabled:opacity-50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick On-Screen Keypad for Touch / Mobile */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
              <button
                key={btn}
                type="button"
                disabled={isPinLocked}
                onClick={() => {
                  if (btn === 'C') setPin('');
                  else if (btn === '⌫') handleBackspace();
                  else handleKeypadPress(btn);
                }}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-sm font-semibold font-mono text-slate-200 border border-slate-700/60 transition disabled:opacity-40"
              >
                {btn}
              </button>
            ))}
          </div>

          <button
            id="btn-submit-unlock-screen"
            type="submit"
            disabled={isPinLocked || !pin}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>Fungua Skrini ya Mfumo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kulinda salio lako: Skrini hujifunga ukikaa kimya kwa dakika {systemSecurity.autoLockMinutes}.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
