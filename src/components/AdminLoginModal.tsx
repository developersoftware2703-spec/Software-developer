import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, KeyRound, UserCheck, X, AlertTriangle, Lock, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { adminLogin, allStudents } = useApp();
  const [staffId, setStaffId] = useState('STAFF/INV/001');
  const [pin, setPin] = useState('9999');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = adminLogin(staffId, pin);
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const adminAccount = allStudents.find(s => s.role === 'admin');

  return (
    <div 
      id="admin-login-backdrop" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div 
        id="admin-login-modal" 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Eneo Lililolindwa
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Uthibitisho wa Msimamizi (Admin Portal)
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Kituo hiki kimetengwa rasmi kwa ajili ya Walimu Wasimamizi, Afisa Fedha (Bursar) na Wakuu wa Miradi. Mwanafunzi wa kawaida haruhusiwi kuingia hapa bila kibali.
        </p>

        {/* Default credentials tip */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300/90 mb-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-200">Akaunti ya Mfano ya Kiutawala:</p>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              Staff ID: <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-white">STAFF/INV/001</code> | 
              PIN: <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-white">9999</code>
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 text-left">
              Namba ya Utambulisho wa Mwalimu / Msimamizi (Staff ID):
            </label>
            <div className="relative">
              <input
                type="text"
                id="admin-staff-id-input"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Mfano: STAFF/INV/001"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
              <UserCheck className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 text-left">
              PIN Maalum ya Utawala (Admin Security PIN):
            </label>
            <div className="relative">
              <input
                type="password"
                id="admin-pin-input"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 tracking-widest focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition"
            >
              Ghairi (Rudi Nyuma)
            </button>
            <button
              id="btn-admin-login-submit"
              type="submit"
              disabled={isSubmitting || !staffId || !pin}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 active:scale-98 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Inathibitisha...</span>
              ) : (
                <>
                  <span>Ingia Kituo cha Utawala</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500">
            Miamala na mabadiliko yote ya kiutawala hurekodiwa kwenye daftari la kiusalama la mfumo (Audit Logs).
          </p>
        </div>
      </div>
    </div>
  );
};
