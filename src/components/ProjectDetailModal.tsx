import React from 'react';
import { InvestmentProject } from '../types';
import { formatTZS, formatDate } from '../utils/formatters';
import { 
  X, 
  TrendingUp, 
  Clock, 
  Users, 
  Building2, 
  CheckCircle2, 
  Coins, 
  FileText, 
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: InvestmentProject | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (project: InvestmentProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose, onInvest }) => {
  if (!isOpen || !project) return null;

  const progressPercent = Math.min(100, Math.round((project.collectedAmount / project.targetAmount) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Hero Header */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900 shrink-0">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-md text-white flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {project.schoolName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Faida Inayotarajiwa</span>
              <span className="text-emerald-700 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                +{project.roiPercentage}%
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Mzunguko wa Mradi</span>
              <span className="text-slate-800 font-bold text-base sm:text-lg flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-slate-500" />
                Siku {project.cycleDays}
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Kima cha Chini</span>
              <span className="text-slate-900 font-bold text-base sm:text-lg">
                {formatTZS(project.minInvestment)}
              </span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-500 block">Timu ya Wanafunzi</span>
              <span className="text-slate-900 font-bold text-base sm:text-lg flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-slate-500" />
                {project.teamMembersCount} Wanafunzi
              </span>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="space-y-1.5 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-emerald-900">
                Fedha Zilizokusanywa: <strong className="font-bold text-emerald-950">{formatTZS(project.collectedAmount)}</strong>
              </span>
              <span className="text-slate-600">
                Lengo: <strong className="text-slate-900">{formatTZS(project.targetAmount)}</strong>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{progressPercent}% Imefadhiliwa na Wanafunzi</span>
              <span>Hali: {project.status === 'funding' ? 'Inapokea Wawekezaji' : project.status === 'in_progress' ? 'Inaendelea na Uzalishaji' : 'Inagawa Faida'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              Kuhusu Mradi Huu wa Wanafunzi
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Student Team Leadership */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Usimamizi wa Wanafunzi (Student Leadership)
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                {project.teamLead.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900">{project.teamLead}</p>
                <p className="text-xs text-slate-500">Kiongozi wa Mradi • Klabu ya Ujasiriamali ya {project.schoolName}</p>
              </div>
            </div>
          </div>

          {/* Financial Statement for this Project */}
          <div className="p-4 rounded-xl bg-slate-900 text-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Ripoti Fupi ya Mapato & Matumizi ya Mradi Huu
              </h4>
              <span className="text-[11px] text-slate-400">Imekaguliwa</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[11px]">Mapato ya Mauzo</span>
                <span className="font-bold text-emerald-300 text-sm">{formatTZS(project.financialSummary.totalRevenue)}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[11px]">Gharama za Mradi</span>
                <span className="font-bold text-amber-300 text-sm">{formatTZS(project.financialSummary.totalExpenses)}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-slate-400 block text-[11px]">Faida Halisi (Net)</span>
                <span className="font-extrabold text-emerald-400 text-sm">+{formatTZS(project.financialSummary.netProfit)}</span>
              </div>
            </div>
          </div>

          {/* Milestone Updates */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              Taarifa za Maendeleo Shuleni (Field Updates)
            </h4>
            <div className="space-y-3">
              {project.updates.map((update) => (
                <div key={update.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">{update.title}</span>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">{formatDate(update.date)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{update.description}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">Imewekwa na: {update.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety notice */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Miradi yote inafuatiliwa kwa karibu na Walimu Washauri na Bodi ya Ujasiriamali ya Shule. Fedha zako zinalindwa kwa mujibu wa taratibu za kifedha za wanafunzi.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-xs text-slate-500 block">Kima cha chini:</span>
            <span className="font-bold text-slate-900 text-sm">{formatTZS(project.minInvestment)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Funga
            </button>
            <button
              onClick={() => {
                onClose();
                onInvest(project);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              Wekeza Kwenye Mradi Huu
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
