import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  FileCheck, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export const SecurityView: React.FC = () => {
  const { currentUser, auditLogs, allStudents } = useApp();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [pinError, setPinError] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (newPin.length !== 4) {
      setPinError('PIN mpya lazima iwe na tarakimu 4 haswa.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('PIN mpya na uthibitisho havifanani.');
      return;
    }

    // Update in allStudents
    currentUser.securityPin = newPin;
    setPinSuccess('PIN yako ya usalama wa kifedha imesasishwa kikamilifu!');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md inline-block">
                Financial Security & Data Protection
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                256-Bit Encrypted
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Mfumo wa Usalama wa Taarifa za Kifedha
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Taarifa zote za miamala, fedha za wanafunzi, na mikataba ya uwekezaji zinalindwa kwa viwango thabiti vya usalama wa kibenki na PIN ya siri.
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center shrink-0">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold block">
              Hali ya Usalama
            </span>
            <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ULINZI UMEWASHWA
            </span>
          </div>
        </div>
      </div>

      {/* Grid: PIN Management + Protection Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Change Security PIN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                PIN ya Usalama wa Miamala (Transaction PIN)
              </h3>
              <p className="text-xs text-slate-500">
                PIN hii inatumika kuidhinisha kila uwekezaji au kutoa fedha
              </p>
            </div>
          </div>

          {/* Current PIN preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">PIN Yako ya Sasa:</span>
              <span className="text-lg font-mono font-bold text-slate-900 tracking-widest">
                {showCurrentPin ? currentUser.securityPin : '••••'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCurrentPin(!showCurrentPin)}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            {pinError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weka PIN Mpya (Tarakimu 4)
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 text-center text-lg font-bold tracking-widest rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Thibitisha PIN Mpya
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 text-center text-lg font-bold tracking-widest rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Hifadhi PIN Mpya
            </button>
          </form>
        </div>

        {/* Card 2: Security Pillars & Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Misingi ya Usalama wa Mfumo wa Wanafunzi
                </h3>
                <p className="text-xs text-slate-500">
                  Uthibitishaji na Ulinzi wa Fedha Mashuleni
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Wanafunzi Pekee (Strict Verification):</strong>
                  Kila mtumiaji lazima awe na namba rasmi ya usajili wa shule (Registration No.) na kuthibitishwa.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Usimbaji Fiche wa Miamala (Cryptographic Hashes):</strong>
                  Kila muamala unazalisha risiti ya kipekee yenye SHA-256 Hash inayozuia udanganyifu.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Idhini ya Utoaji Fedha (Admin Approval):</strong>
                  Kutoa fedha kunathibitishwa na Msimamizi/Mwalimu ili kuhakikisha usalama wa mtoto/mwanafunzi.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Akaunti yako imeunganishwa na Mfumo wa Taasisi ya {currentUser.schoolName}.</span>
          </div>
        </div>

      </div>

      {/* Security Audit Trail (Kumbukumbu za Usalama) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Kumbukumbu za Ukaguzi wa Usalama (Security Audit Trail)
            </h3>
            <p className="text-xs text-slate-500">
              Kila hatua inayochukuliwa kwenye akaunti na miamala inarekodiwa kwa ajili ya uwazi
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {auditLogs.length} Rekodi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Muda</th>
                <th className="py-2.5 px-3">Kitendo</th>
                <th className="py-2.5 px-3">Mtumiaji</th>
                <th className="py-2.5 px-3">Anwani ya IP</th>
                <th className="py-2.5 px-3">Hali</th>
                <th className="py-2.5 px-3">Maelezo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors font-mono">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-sans">
                    {log.actorName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {log.ipMasked}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                      log.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
