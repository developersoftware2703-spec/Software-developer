import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTZS } from '../utils/formatters';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'deposit' | 'withdraw';
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, defaultMode = 'deposit' }) => {
  const { currentUser, depositFunds, withdrawFunds } = useApp();
  const [mode, setMode] = useState<'deposit' | 'withdraw'>(defaultMode);
  const [amount, setAmount] = useState<string>('20000');
  const [method, setMethod] = useState<string>('M-Pesa');
  const [phone, setPhone] = useState<string>(currentUser.phone || '+255 712 345 678');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 20000, 50000, 100000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Tafadhali weka kiasi halali cha fedha.');
      return;
    }

    if (!pin || pin.length < 4) {
      setError('Tafadhali weka PIN yako ya usalama ya tarakimu 4.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (mode === 'deposit') {
        const res = depositFunds(numericAmount, method, phone, pin);
        if (res.success) {
          setSuccessMsg(res.message);
          setPin('');
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1800);
        } else {
          setError(res.message);
        }
      } else {
        const res = withdrawFunds(numericAmount, method, phone, pin);
        if (res.success) {
          setSuccessMsg(res.message);
          setPin('');
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1800);
        } else {
          setError(res.message);
        }
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              {mode === 'deposit' ? <ArrowDownLeft className="w-5 h-5 text-emerald-300" /> : <ArrowUpRight className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {mode === 'deposit' ? 'Weka Fedha Pochi ya Shule' : 'Toa Fedha Kwenye Pochi'}
              </h3>
              <p className="text-xs text-emerald-100">
                Salio la Sasa: <span className="font-bold text-white">{formatTZS(currentUser.balance)}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('deposit'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'deposit' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            Weka Fedha (Deposit)
          </button>
          <button
            type="button"
            onClick={() => { setMode('withdraw'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              mode === 'withdraw' 
                ? 'bg-white text-emerald-800 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
            Toa Fedha (Withdraw)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Kiasi cha Fedha (TZS)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="2000"
                step="1000"
                className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                placeholder="20000"
                required
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                TZS
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                    amount === amt.toString()
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Njia ya Malipo (Payment Method)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'M-Pesa', icon: Smartphone, color: 'text-red-600' },
                { name: 'Tigo Pesa', icon: Smartphone, color: 'text-blue-600' },
                { name: 'Airtel Money', icon: Smartphone, color: 'text-rose-600' },
                { name: 'School Bursar Voucher', icon: Building2, color: 'text-emerald-700' },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setMethod(m.name)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    method === m.name
                      ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 text-emerald-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <m.icon className={`w-4 h-4 shrink-0 ${m.color}`} />
                  <span className="text-xs font-semibold truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account / Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              {method === 'School Bursar Voucher' ? 'Namba ya Hati ya Bursar / Vocha' : 'Namba ya Simu ya Mwanafunzi'}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder={method === 'School Bursar Voucher' ? 'Mfano: VOUCHER-AZN-2024' : '+255 7XX XXX XXX'}
              required
            />
          </div>

          {/* PIN Protection */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Thibitisha kwa PIN ya Usalama (4-digits)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                PIN ya sasa: {currentUser.securityPin}
              </span>
            </div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2 tracking-widest text-center text-lg font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="••••"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Taarifa zote zinalindwa kwa usimbaji fiche (Encrypted Financial Protocol).
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all ${
              mode === 'deposit'
                ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
                : 'bg-amber-600 hover:bg-amber-700 active:scale-[0.99]'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'deposit' ? (
              <>
                <ArrowDownLeft className="w-4 h-4" />
                Weka TZS {parseInt(amount || '0', 10).toLocaleString()} Sasa
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Omba Kutoa TZS {parseInt(amount || '0', 10).toLocaleString()}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
