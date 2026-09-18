import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentProject } from '../types';
import { formatTZS } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  X, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  Wallet,
  Coins
} from 'lucide-react';

interface InvestModalProps {
  project: InvestmentProject | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenWallet: () => void;
}

export const InvestModal: React.FC<InvestModalProps> = ({ project, isOpen, onClose, onOpenWallet }) => {
  const { currentUser, investInProject } = useApp();
  const [amount, setAmount] = useState<string>('20000');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen || !project) return null;

  const numericAmount = parseInt(amount, 10) || 0;
  const calculatedProfit = Math.round((numericAmount * project.roiPercentage) / 100);
  const totalExpectedReturn = numericAmount + calculatedProfit;

  const quickPicks = [project.minInvestment, 20000, 50000, 100000].filter(
    (amt) => amt >= project.minInvestment && amt <= project.maxInvestmentPerStudent
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (numericAmount < project.minInvestment) {
      setError(`Kiwango cha chini ni TZS ${project.minInvestment.toLocaleString()}`);
      return;
    }

    if (numericAmount > project.maxInvestmentPerStudent) {
      setError(`Kiwango cha juu cha mwanafunzi ni TZS ${project.maxInvestmentPerStudent.toLocaleString()}`);
      return;
    }

    if (numericAmount > currentUser.balance) {
      setError('Salio lako la pochi halitoshi. Tafadhali weka fedha kwanza.');
      return;
    }

    if (!pin || pin.length < 4) {
      setError('Tafadhali weka PIN ya usalama ya tarakimu 4.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = investInProject(project.id, numericAmount, pin);
      if (res.success) {
        setSuccessMsg(res.message);
        setPin('');
        
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // fallback gracefully
        }

        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 2200);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Project Image Banner */}
        <div className="relative h-36 sm:h-44 w-full bg-slate-900">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white/90 hover:text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-500 text-white uppercase tracking-wider mb-1">
              {project.category}
            </span>
            <h3 className="font-bold text-base sm:text-lg leading-tight line-clamp-1 text-white">
              {project.title}
            </h3>
            <p className="text-xs text-slate-300">
              {project.schoolName}
            </p>
          </div>
        </div>

        {/* Investment Performance Pill */}
        <div className="grid grid-cols-3 p-3 bg-slate-50 border-b border-slate-200 text-center">
          <div className="border-r border-slate-200 px-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Faida (ROI)</span>
            <span className="text-emerald-600 font-extrabold text-sm sm:text-base flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +{project.roiPercentage}%
            </span>
          </div>
          <div className="border-r border-slate-200 px-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Mzunguko</span>
            <span className="text-slate-800 font-bold text-sm sm:text-base flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Siku {project.cycleDays}
            </span>
          </div>
          <div className="px-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Kiwango cha Hatari</span>
            <span className={`text-xs sm:text-sm font-bold px-1.5 py-0.5 rounded-md inline-block ${
              project.riskLevel === 'Chini' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {project.riskLevel}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current balance reminder */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
              <Wallet className="w-4 h-4 text-emerald-700" />
              Salio Lako la Pochi:
              <span className="font-bold text-emerald-800">{formatTZS(currentUser.balance)}</span>
            </div>
            {currentUser.balance < project.minInvestment && (
              <button
                type="button"
                onClick={() => { onClose(); onOpenWallet(); }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                + Weka Fedha
              </button>
            )}
          </div>

          {/* Investment Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Kiasi Unachotaka Kuwekeza (TZS)
              </label>
              <span className="text-[11px] text-slate-500">
                Kiwango: {formatTZS(project.minInvestment)} - {formatTZS(project.maxInvestmentPerStudent)}
              </span>
            </div>
            
            <div className="relative">
              <input
                type="number"
                min={project.minInvestment}
                max={project.maxInvestmentPerStudent}
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder={project.minInvestment.toString()}
                required
              />
              <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                TZS
              </span>
            </div>

            {/* Quick picker buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  type="button"
                  onClick={() => setAmount(pick.toString())}
                  className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors ${
                    amount === pick.toString()
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pick.toLocaleString()} TZS
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Profit Calculation Breakdown Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-inner">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Coins className="w-4 h-4" />
              Hesabu ya Faida (Return Calculator)
            </div>
            <div className="space-y-1.5 text-xs text-slate-200">
              <div className="flex justify-between">
                <span>Mtaji Uliowekezwa:</span>
                <span className="font-semibold text-white">{formatTZS(numericAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gawio la Faida ({project.roiPercentage}%):</span>
                <span className="font-bold text-emerald-400">+{formatTZS(calculatedProfit)}</span>
              </div>
              <div className="border-t border-emerald-800/80 my-1 pt-1.5 flex justify-between font-bold text-sm text-white">
                <span>Jumla Utakayolipwa Mwishoni:</span>
                <span className="text-emerald-300 font-extrabold text-base">{formatTZS(totalExpectedReturn)}</span>
              </div>
            </div>
            <p className="text-[10px] text-emerald-200/80 mt-2 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" />
              Muda wa kukomaa: Siku {project.cycleDays} kuanzia siku ya kuweka mkataba.
            </p>
          </div>

          {/* 4-digit PIN confirmation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Weka PIN Yako Kuthibitisha Uwekezaji
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                PIN: {currentUser.securityPin}
              </span>
            </div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2 text-center text-lg font-bold tracking-widest rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              placeholder="••••"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Mkataba wako wa uwekezaji utahifadhiwa kwa usalama kwenye rekodi ya shule.
            </p>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading || currentUser.balance < numericAmount}
            className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all ${
              currentUser.balance < numericAmount 
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
            } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Wekeza TZS {numericAmount.toLocaleString()} Sasa
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
