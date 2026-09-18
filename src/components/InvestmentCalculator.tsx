import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentProject } from '../types';
import { formatTZS } from '../utils/formatters';
import { 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Coins 
} from 'lucide-react';

interface InvestmentCalculatorProps {
  onInvestProject: (project: InvestmentProject) => void;
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ onInvestProject }) => {
  const { projects, currentUser } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [calcAmount, setCalcAmount] = useState<number>(50000);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!selectedProject) return null;

  const expectedProfit = Math.round((calcAmount * selectedProject.roiPercentage) / 100);
  const totalPayout = calcAmount + expectedProfit;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 rounded-2xl p-4 sm:p-6 text-white shadow-xl border border-emerald-800/30">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
              Kikokotoo cha Faida (Student ROI Calculator)
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-300">
              Angalia kiwango cha faida utakayopata kutokana na kiwango cha fedha utakachowekeza
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Project Selector & Slider */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
              Chagua Mradi wa Shule:
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const proj = projects.find(p => p.id === e.target.value);
                if (proj && calcAmount < proj.minInvestment) {
                  setCalcAmount(proj.minInvestment);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-emerald-500/30 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.title} (+{p.roiPercentage}% ROI - Siku {p.cycleDays})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-200">
                Kiwango cha Kuwekeza:
              </label>
              <span className="text-base font-extrabold text-emerald-400">
                {formatTZS(calcAmount)}
              </span>
            </div>
            <input
              type="range"
              min={selectedProject.minInvestment}
              max={selectedProject.maxInvestmentPerStudent}
              step={5000}
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value))}
              className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Chini: {formatTZS(selectedProject.minInvestment)}</span>
              <span>Juu: {formatTZS(selectedProject.maxInvestmentPerStudent)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[10000, 20000, 50000, 100000, 150000].map((amt) => {
              if (amt < selectedProject.minInvestment || amt > selectedProject.maxInvestmentPerStudent) return null;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCalcAmount(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    calcAmount === amt
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {amt.toLocaleString()} TZS
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Calculation Output Card */}
        <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-3">
          <div className="text-center pb-2 border-b border-white/10">
            <span className="text-xs text-emerald-200 uppercase tracking-wider block">
              Gawio la Faida Yako (+{selectedProject.roiPercentage}%)
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-0.5">
              +{formatTZS(expectedProfit)}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Mtaji Wako:</span>
              <span className="font-semibold text-white">{formatTZS(calcAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Muda wa Mzunguko:</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Siku {selectedProject.cycleDays}
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
              <span>Jumla Utakayovuna:</span>
              <span className="text-emerald-300 font-extrabold">{formatTZS(totalPayout)}</span>
            </div>
          </div>

          <button
            onClick={() => onInvestProject(selectedProject)}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Coins className="w-4 h-4" />
            Wekeza Kiasi Hiki Sasa
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
