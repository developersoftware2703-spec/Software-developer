import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserInvestment } from '../types';
import { formatTZS, formatDate } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  PiggyBank, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Coins,
  AlertCircle
} from 'lucide-react';

interface MyInvestmentsViewProps {
  onNavigateProjects: () => void;
}

export const MyInvestmentsView: React.FC<MyInvestmentsViewProps> = ({ onNavigateProjects }) => {
  const { currentUser, investments, claimProfit } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<UserInvestment | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string>('');

  const myInvestments = investments.filter(i => i.studentId === currentUser.id);
  const activeInvestments = myInvestments.filter(i => i.status === 'active');
  const maturedInvestments = myInvestments.filter(i => i.status === 'matured');
  const withdrawnInvestments = myInvestments.filter(i => i.status === 'withdrawn');

  const handleClaim = (inv: UserInvestment) => {
    setClaimingId(inv.id);
    setClaimSuccessMsg('');

    setTimeout(() => {
      const res = claimProfit(inv.id);
      if (res.success) {
        setClaimSuccessMsg(res.message);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
        } catch {
          // ignore
        }
      }
      setClaimingId(null);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview Top Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md mb-2 inline-block">
              Portfolio ya Mwanafunzi
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Uwekezaji Wangu & Gawio la Faida
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Fuatilia ukuaji wa mtaji wako, muda wa kukomaa wa mikataba, na chukua faida yako moja kwa moja.
            </p>
          </div>

          <button
            onClick={onNavigateProjects}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all shrink-0"
          >
            <PiggyBank className="w-4 h-4" />
            Wekeza Katika Mradi Mwingine
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div>
            <span className="text-[11px] text-slate-300 block">Jumla ya Mtaji Uliowekezwa</span>
            <span className="text-base sm:text-xl font-extrabold text-white mt-0.5 block">
              {formatTZS(currentUser.totalInvested)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">Faida Iliyopokelewa</span>
            <span className="text-base sm:text-xl font-extrabold text-emerald-400 mt-0.5 block">
              +{formatTZS(currentUser.totalProfitEarned)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-amber-300 block">Mikataba Iliyopo</span>
            <span className="text-base sm:text-xl font-extrabold text-amber-300 mt-0.5 block">
              {myInvestments.length} Miradi
            </span>
          </div>
        </div>
      </div>

      {claimSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Hongera sana!</strong>
            <span>{claimSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Matured Investments (Needs Payout Claim) */}
      {maturedInvestments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
            <h2 className="font-black text-base sm:text-lg">
              Miradi Iliyokomaa - Chukua Mtaji na Faida Yako!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maturedInvestments.map((inv) => {
              const totalPayout = inv.amount + inv.expectedProfit;
              return (
                <div
                  key={inv.id}
                  className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                        Tayari kwa Gawio
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {inv.projectTitle}
                      </h3>
                      <p className="text-xs text-slate-500">Mkataba: {inv.transactionRef}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Ilikomaa: {formatDate(inv.maturityDate)}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mtaji Uliowekezwa:</span>
                      <span className="font-bold text-slate-900">{formatTZS(inv.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Faida Iliyopatikana:</span>
                      <span className="font-extrabold text-emerald-600">+{formatTZS(inv.expectedProfit)}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-1 flex justify-between font-black text-sm text-amber-950">
                      <span>Jumla Utakayopokea:</span>
                      <span className="text-emerald-700">{formatTZS(totalPayout)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(inv)}
                    disabled={claimingId === inv.id}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  >
                    {claimingId === inv.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Coins className="w-4 h-4 text-emerald-200" />
                        Chukua TZS {totalPayout.toLocaleString()} Kwenye Pochi Yangu
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Investments */}
      <div className="space-y-3">
        <h2 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-700" />
          Mikataba Hai Inayoendelea ({activeInvestments.length})
        </h2>

        {activeInvestments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <PiggyBank className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Huna mradi hai wa uwekezaji unaoendelea kwa sasa.</p>
            <p className="text-xs text-slate-400 mt-1">Anza kuwekeza kiasi kidogo shuleni kupata faida ya mzunguko.</p>
            <button
              onClick={onNavigateProjects}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              Tazama Miradi ya Shule
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInvestments.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 uppercase">
                      {inv.projectCategory}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Mkataba: {inv.transactionRef}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1.5 line-clamp-1">
                    {inv.projectTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tarehe ya Kuanza: {formatDate(inv.investedAt)}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kiwango Ulichoweka:</span>
                    <span className="font-bold text-slate-900">{formatTZS(inv.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Faida Inayotarajiwa:</span>
                    <span className="font-extrabold text-emerald-600">+{formatTZS(inv.expectedProfit)}</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-1.5 flex justify-between font-bold text-xs text-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Tarehe ya Kukomaa:
                    </span>
                    <span className="text-slate-900">{formatDate(inv.maturityDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mradi unaendelea vizuri
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(inv)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Cheti cha Mkataba
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History of Withdrawn / Past Investments */}
      {withdrawnInvestments.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-black text-base sm:text-lg text-slate-900">
            Historia ya Uwekezaji Uliokamilika & Faida Iliyovunwa
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {withdrawnInvestments.map((inv) => (
              <div key={inv.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{inv.projectTitle}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Mtaji: {formatTZS(inv.amount)} • Faida: +{formatTZS(inv.expectedProfit)} • Imelipwa
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 block">
                    +{formatTZS(inv.amount + inv.expectedProfit)}
                  </span>
                  <span className="text-[10px] text-slate-400">Pochi ya Mwanafunzi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Investment Certificate & Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center relative">
              <ShieldCheck className="w-10 h-10 text-emerald-300 mx-auto mb-1" />
              <h3 className="font-black text-lg text-white">Cheti cha Uwekezaji wa Mwanafunzi</h3>
              <p className="text-xs text-emerald-200">Student Investment Security Certificate</p>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Jina la Mwanafunzi:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Mradi:</span>
                <span className="font-bold text-slate-900 text-right">{selectedReceipt.projectTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Kiasi cha Mtaji:</span>
                <span className="font-bold text-slate-900">{formatTZS(selectedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Faida Inayotarajiwa:</span>
                <span className="font-extrabold text-emerald-600">+{formatTZS(selectedReceipt.expectedProfit)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Tarehe ya Kukomaa:</span>
                <span className="font-bold text-slate-900">{formatDate(selectedReceipt.maturityDate)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2 font-mono">
                <span className="text-slate-400">Kumbukumbu ya Muamala:</span>
                <span className="font-bold text-slate-800">{selectedReceipt.transactionRef}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-[10px] text-slate-500 break-all border border-slate-200">
                Security Hash: sha256:4f8a91b...392d (Imelindwa na Mfumo wa Shule)
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
              >
                Funga Cheti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
