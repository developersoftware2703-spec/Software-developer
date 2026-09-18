import React from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentProject } from '../types';
import { formatTZS, formatDate } from '../utils/formatters';
import { InvestmentCalculator } from './InvestmentCalculator';
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  Briefcase, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  GraduationCap,
  Award,
  Trophy,
  Share2,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
  onOpenWallet: (mode?: 'deposit' | 'withdraw') => void;
  onSelectProject: (project: InvestmentProject) => void;
  onInvestProject: (project: InvestmentProject) => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenWallet,
  onSelectProject,
  onInvestProject,
  onNavigateTab
}) => {
  const { currentUser, projects, investments, transactions } = useApp();

  // Active investments for this student
  const myActiveInvestments = investments.filter(i => i.studentId === currentUser.id && i.status === 'active');
  const myMaturedInvestments = investments.filter(i => i.studentId === currentUser.id && i.status === 'matured');
  const myRecentTransactions = transactions.filter(t => t.studentId === currentUser.id).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Student Profile & Greeting Hero */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-24 -bottom-16 w-56 h-56 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-emerald-400/60 shadow-md"
              />
              {currentUser.isVerifiedStudent && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-emerald-900" title="Mwanafunzi Aliyethibitishwa">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Habari, {currentUser.fullName.split(' ')[0]}!
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {currentUser.role === 'admin' ? 'Msimamizi (Admin)' : 'Mwanafunzi Mwekezaji'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{currentUser.schoolName}</span>
                <span className="text-emerald-400/60">•</span>
                <span className="font-mono text-xs">{currentUser.studentRegNo}</span>
              </p>
            </div>
          </div>

          {/* Quick wallet actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenWallet('deposit')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Weka Fedha
            </button>
            <button
              onClick={() => onOpenWallet('withdraw')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              Toa Fedha
            </button>
          </div>
        </div>

        {/* Notice of active matured profits if any */}
        {myMaturedInvestments.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-100 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                Hongera! Una uwekezaji <strong>{myMaturedInvestments.length}</strong> uliokomaa tayari kwa kuchukua faida!
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('investments')}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-lg text-xs shrink-0 transition-colors"
            >
              Chukua Faida Sasa
            </button>
          </div>
        )}
      </div>

      {/* Primary Financial Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Wallet Balance */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Salio la Pochi (Wallet)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatTZS(currentUser.balance)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Imehifadhiwa kwa usalama</span>
          </div>
        </div>

        {/* Card 2: Total Invested */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fedha Zilizowekezwa
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatTZS(currentUser.totalInvested)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
            <span>Miradi {myActiveInvestments.length} inayoendelea</span>
          </div>
        </div>

        {/* Card 3: Total Profit Earned */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Faida Uliyopata (ROI)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            +{formatTZS(currentUser.totalProfitEarned)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-700 font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Gawio la miradi ya shule</span>
          </div>
        </div>

        {/* Card 4: Active School Ventures */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Miradi ya Shule
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {projects.length} Miradi
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
            <span>Inasimamiwa na wanafunzi</span>
          </div>
        </div>

      </div>

      {/* Interactive Profit Calculator */}
      <InvestmentCalculator onInvestProject={onInvestProject} />

      {/* NEW: Student Entrepreneurship Ecosystem Hub (Challenges, Social Sharing, Academy) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Entrepreneurship Challenges & Pitch */}
        <div 
          onClick={() => onNavigateTab('challenges')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                Zawadi TZS 10M
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
              Mashindano ya Mawazo ya Miradi
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Wasilisha wazo lako la mradi (Pitch), pata ushauri wa walimu kwa Rubric ya 100%, na shinda mtaji wa kuanzia.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Wasilisha au Piga Kura</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Social Media & Discussion Groups */}
        <div 
          onClick={() => onNavigateTab('social')}
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-white border border-teal-200/80 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-black uppercase">
                Faragha & WhatsApp
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
              Shiriki Kadi & Magrupu ya Shule
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Shiriki mafanikio yako WhatsApp na X kwa kadi za kidijitali zenye ulinzi wa faragha, na jiunge na mijadala ya wanafunzi.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-teal-100 flex items-center justify-between text-xs font-bold text-teal-800">
            <span>Fungua Social Hub</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Academy & Digital Certificates */}
        <div 
          onClick={() => onNavigateTab('academy')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-xs group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                Vyeti Rasmi
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
              Chuo cha Elimu ya Fedha & Vyeti
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Moduli 4 za mafunzo ya vitendo, mitihani ya kujipima (Quizzes), na vyeti vya kidijitali vilivyothibitishwa.
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>Anza Kujifunza</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Featured Student Entrepreneurship Projects Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              Miradi ya Ujasiriamali Inayopokea Wawekezaji
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Wanafunzi Pekee
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Wekeza kiasi kidogo na upate gawio halisi la faida wakati wa mavuno au mauzo
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
          >
            Ona Yote ({projects.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {projects.slice(0, 3).map((project) => {
            const progress = Math.min(100, Math.round((project.collectedAmount / project.targetAmount) * 100));

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Project Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-sm uppercase">
                      +{project.roiPercentage}% ROI
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Siku {project.cycleDays}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3" />
                      {project.schoolName}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">
                      {project.description}
                    </p>
                  </div>

                  {/* Funding Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{formatTZS(project.collectedAmount)}</span>
                      <span className="text-slate-500 font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Kima cha chini: {formatTZS(project.minInvestment)}</span>
                      <span>Lengo: {formatTZS(project.targetAmount)}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
                    >
                      Maelezo Zaidi
                    </button>
                    <button
                      onClick={() => onInvestProject(project)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Wekeza
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two columns: Recent Transactions + Security / Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Recent Transactions (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              Kumbukumbu za Miamala ya Hivi Karibuni
            </h3>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              Tazama Ripoti Kamili
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myRecentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Bado haujafanya muamala wowote.</p>
            ) : (
              myRecentTransactions.map((txn) => (
                <div key={txn.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      txn.type === 'deposit' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : txn.type === 'invest' 
                        ? 'bg-blue-50 text-blue-700'
                        : txn.type === 'profit_payout'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {txn.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> :
                       txn.type === 'invest' ? <TrendingUp className="w-4 h-4" /> :
                       txn.type === 'profit_payout' ? <Sparkles className="w-4 h-4" /> :
                       <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">
                        {txn.description}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{txn.timestamp}</span>
                        <span>•</span>
                        <span>Ref: {txn.referenceCode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`font-black text-xs sm:text-sm ${
                      txn.type === 'deposit' || txn.type === 'profit_payout'
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    }`}>
                      {txn.type === 'deposit' || txn.type === 'profit_payout' ? '+' : '-'}
                      {formatTZS(txn.amount)}
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase ${
                      txn.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : txn.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {txn.status === 'completed' ? 'Imekamilika' : txn.status === 'pending' ? 'Inasubiri Idhini' : 'Imekataliwa'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Security & Student Trust Card */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-5 border border-emerald-800/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-white">
              Usalama wa Taarifa za Kifedha
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Kila muamala wa uwekezaji au kutoa fedha unathibitishwa kwa PIN ya tarakimu 4 na kuhifadhiwa kwa usimbaji fiche (256-bit Hash).
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PIN ya siri kwa kila muamala</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Uhakiki wa kitambulisho cha mwanafunzi</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ukaguzi wa hesabu na Mwalimu Msimamizi</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('security')}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/15 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Kagua Kumbukumbu za Usalama (Audit Log)
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
