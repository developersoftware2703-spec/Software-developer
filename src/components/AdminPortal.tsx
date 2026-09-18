import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectCategory, InvestmentProject, PitchIdea } from '../types';
import { formatTZS, formatDate } from '../utils/formatters';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  TrendingUp, 
  AlertCircle, 
  Search, 
  DollarSign, 
  FileText,
  UserCheck,
  UserX,
  Lock,
  LogOut,
  AlertTriangle,
  Flame,
  KeyRound,
  Eye,
  Sliders,
  Award,
  Clock,
  Check,
  Download,
  Terminal,
  Activity,
  CheckCircle,
  Edit,
  Trash2,
  PhoneCall,
  UserPlus
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser, 
    allStudents, 
    transactions, 
    projects, 
    investments,
    financialReports,
    auditLogs,
    competitions,
    pitchIdeas,
    adminActiveTab,
    setAdminActiveTab,
    adminLogout,
    adminApproveTransaction, 
    adminRejectTransaction,
    adminCreateProject,
    adminUpdateProject,
    adminDeleteProject,
    adminDistributeProfit,
    adminAddFinancialReport,
    adminDeleteFinancialReport,
    adminToggleStudentStatus,
    adminVerifyStudent,
    adminApproveStudent,
    adminRejectStudent,
    adminUpdateStudent,
    updatePitchStatus,
    addMentorFeedback,
    systemSecurity,
    updateSystemSecurity,
    verifyTransactionIntegrity,
    lockScreen
  } = useApp();

  // Student Approvals & Filters
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'pending_approval' | 'active' | 'suspended'>('all');
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [rejectingStudent, setRejectingStudent] = useState<{ id: string; name: string; reason: string } | null>(null);

  // Project Editing State
  const [editingProject, setEditingProject] = useState<InvestmentProject | null>(null);

  // Admin Notification Toast
  const [adminToast, setAdminToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 4000);
  };

  // Transaction filter & rejection modal
  const [txnFilter, setTxnFilter] = useState<'pending' | 'all'>('pending');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [selectedTxnToReject, setSelectedTxnToReject] = useState<string | null>(null);

  // New Project Form State
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProj, setNewProj] = useState({
    title: '',
    category: 'Kilimo & Mifugo' as ProjectCategory,
    schoolName: 'Sekondari ya Benjamin Mkapa',
    description: '',
    teamLead: 'Amina Kassim',
    teamMembersCount: 5,
    targetAmount: 2500000,
    minInvestment: 5000,
    maxInvestmentPerStudent: 100000,
    roiPercentage: 18,
    cycleDays: 60,
    imageUrl: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=800&q=80',
    riskLevel: 'Chini' as 'Chini' | 'Wastani' | 'Juu',
  });

  // Financial Report Form
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    projectId: projects[0]?.id || '',
    title: '',
    type: 'income' as 'income' | 'expense',
    amount: 50000,
    category: 'Mauzo ya Mazao',
    description: '',
    recordedBy: currentUser.fullName
  });

  // Pitch Evaluation State
  const [selectedPitch, setSelectedPitch] = useState<PitchIdea | null>(null);
  const [mentorComment, setMentorComment] = useState('');
  const [mentorScore, setMentorScore] = useState(85);

  // Audit Logs Filter & Search
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'FAILED'>('ALL');

  // Transaction Hash Verification State
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    calculatedHash?: string;
  } | null>(null);

  // Profit Distribution Notice
  const [distributeMsg, setDistributeMsg] = useState<string | null>(null);

  // System Freeze Confirmation Modal
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeReasonInput, setFreezeReasonInput] = useState(systemSecurity.freezeReason);

  // Stats
  const pendingTxns = transactions.filter(t => t.status === 'pending');
  const totalStudentBalance = allStudents.reduce((acc, s) => acc + s.balance, 0);
  const totalInvestedInProjects = investments.reduce((acc, i) => acc + i.amount, 0);
  const totalProfitsPaid = investments.filter(i => i.status === 'matured' || i.status === 'active').reduce((acc, i) => acc + (i.profitEarned || 0), 0);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    adminCreateProject({
      ...newProj,
      galleryImages: [newProj.imageUrl],
      status: 'funding',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + newProj.cycleDays * 86400000).toISOString().substring(0, 10),
    });
    setShowNewProjectModal(false);
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    adminAddFinancialReport({
      ...newReport,
      date: new Date().toISOString().substring(0, 10),
    });
    setShowReportModal(false);
  };

  const handleDistribute = (projId: string) => {
    const res = adminDistributeProfit(projId);
    setDistributeMsg(`Faida imegawanywa kwa wanafunzi ${res.count}. Jumla ya fedha zilizoongezwa kwenye pochi ni ${formatTZS(res.totalDistributed)}.`);
    setTimeout(() => setDistributeMsg(null), 5000);
  };

  const handleVerifyHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    const res = verifyTransactionIntegrity(verifyCode.trim());
    setVerifyResult({
      tested: true,
      valid: res.valid,
      message: res.message,
      calculatedHash: res.calculatedHash
    });
  };

  const handleToggleFreeze = () => {
    updateSystemSecurity({
      isSystemFrozen: !systemSecurity.isSystemFrozen,
      freezeReason: freezeReasonInput
    });
    setShowFreezeModal(false);
  };

  const pendingStudentApprovals = allStudents.filter(s => s.status === 'pending_approval');
  const activeStudentsCount = allStudents.filter(s => s.status === 'active').length;
  const suspendedStudentsCount = allStudents.filter(s => s.status === 'suspended').length;

  const filteredStudents = allStudents.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.studentRegNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.schoolName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.courseOrClass.toLowerCase().includes(studentSearch.toLowerCase());
    if (studentFilter === 'all') return matchesSearch;
    return matchesSearch && s.status === studentFilter;
  });

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSeverity = auditSeverity === 'ALL' || log.status === auditSeverity;
    const matchesSearch = log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                          log.details.toLowerCase().includes(auditSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div id="admin-portal-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Toast Notification */}
      {adminToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold animate-in fade-in slide-in-from-top-3 ${
          adminToast.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500 text-emerald-200' 
            : 'bg-rose-950 border-rose-500 text-rose-200'
        }`}>
          {adminToast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{adminToast.message}</span>
        </div>
      )}

      {/* Top Administrative Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Kituo Kikuu cha Utawala (Admin Command Center)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  LIVE PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Usimamizi wa Mfumo, Idhini ya Wanafunzi, Miradi ya Shule & Usalama
              </p>
            </div>
          </div>

          {/* Quick System Controls & Admin Profile */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* System Status Pill */}
            <div 
              onClick={() => setShowFreezeModal(true)}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border ${
                systemSecurity.isSystemFrozen 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 animate-pulse' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
              title="Bonyeza kubadilisha hali ya usalama wa mfumo mzima"
            >
              <div className={`w-2 h-2 rounded-full ${systemSecurity.isSystemFrozen ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span>{systemSecurity.isSystemFrozen ? 'MFUMO UMESIMAMISHWA (FROZEN)' : 'MFUMO UKO SHWARI (LIVE ACTIVE)'}</span>
            </div>

            {/* Quick Lock Screen */}
            <button
              onClick={lockScreen}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
              title="Funga skrini mara moja"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Admin Profile Info */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-lg">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.fullName} 
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {currentUser.fullName}
              </span>
            </div>

            {/* Logout to Student Portal */}
            <button
              id="btn-exit-admin-portal"
              onClick={adminLogout}
              className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Toka Utawala</span>
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Freeze Banner if active */}
      {systemSecurity.isSystemFrozen && (
        <div className="bg-rose-950 border-b border-rose-800 px-4 py-2.5 text-center text-xs text-rose-200 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
          <span>
            <strong>TAHADHARI YA USALAMA:</strong> Mfumo umezuiwa kwa muda: "{systemSecurity.freezeReason}". Wanafunzi hawawezi kuweka fedha, kutoa au kuwekeza hadi utakapofungua.
          </span>
          <button 
            onClick={() => setShowFreezeModal(true)}
            className="underline font-bold text-rose-300 hover:text-white ml-2"
          >
            Fungua Mfumo Sasa
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[57px] z-30 px-4 sm:px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2 min-w-max">
          {[
            { id: 'overview', label: 'Muhtasari & Takwimu', icon: Activity },
            { id: 'transactions', label: `Idhini ya Miamala (${pendingTxns.length})`, icon: CreditCard, alert: pendingTxns.length > 0 },
            { 
              id: 'students', 
              label: `Uidhinishaji & Wanafunzi (${allStudents.length})`, 
              icon: Users, 
              alert: pendingStudentApprovals.length > 0,
              badge: pendingStudentApprovals.length > 0 ? pendingStudentApprovals.length : null
            },
            { id: 'projects', label: `Miradi ya Shule (${projects.length})`, icon: Briefcase },
            { id: 'competitions', label: `Mawazo ya Biashara (${pitchIdeas.length})`, icon: Award },
            { id: 'financial-reports', label: 'Taarifa za Bursar', icon: FileText },
            { id: 'security-audit', label: 'Ukaguzi & Ledger', icon: ShieldCheck },
            { id: 'system-settings', label: 'Mipangilio ya Usalama', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setAdminActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                    {tab.badge}
                  </span>
                )}
                {tab.alert && !tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {distributeMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 rounded-2xl text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{distributeMsg}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {adminActiveTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Jumla ya Salio la Wanafunzi</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-mono">
                  {formatTZS(totalStudentBalance)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Fedha zote zilizo kwenye pochi za wanafunzi</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Miamala Inayosubiri Idhini</span>
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">
                  {pendingTxns.length}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {pendingTxns.length > 0 ? 'Inahitaji hatua ya haraka ya mwalimu/bursar' : 'Hakuna miamala inayosubiri'}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Mitaji Katika Miradi</span>
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-mono">
                  {formatTZS(totalInvestedInProjects)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Miradi {projects.length} ya shule inayoendelea</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Wanafunzi Waliosajiliwa</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-mono">
                  {allStudents.length}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {allStudents.filter(s => s.status === 'active').length} wako active, {allStudents.filter(s => s.status === 'suspended').length} wamesimamishwa
                </p>
              </div>
            </div>

            {/* Operational Status & Action Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Action Pending Quickbox */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Miamala ya Hivi Karibuni Inayosubiri Idhini</span>
                  </h3>
                  <button 
                    onClick={() => setAdminActiveTab('transactions')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Ona Yote ({pendingTxns.length}) →
                  </button>
                </div>

                {pendingTxns.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
                    <p>Miamala yote imethibitishwa. Hakuna ombi jipya linalosubiri.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {pendingTxns.slice(0, 4).map(txn => (
                      <div key={txn.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-white">{txn.studentName}</p>
                          <p className="text-[11px] text-slate-400">{txn.description}</p>
                          <span className="text-[10px] font-mono text-slate-500">{txn.referenceCode} • {txn.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold font-mono text-amber-300">
                            {formatTZS(txn.amount)}
                          </span>
                          <button
                            onClick={() => adminApproveTransaction(txn.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Idhinisha
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Health / Security Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Hali ya Ulinzi wa Mfumo</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Hali ya Uendeshaji:</span>
                      <span className={systemSecurity.isSystemFrozen ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {systemSecurity.isSystemFrozen ? 'IMEZUIWA (FROZEN)' : 'HAI NA INAFANYA KAZI'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Kufunga Skrini Kiotomatiki:</span>
                      <span className="text-slate-200 font-mono">Dakika {systemSecurity.autoLockMinutes}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Majaribio ya PIN Kabla ya Kufunga:</span>
                      <span className="text-slate-200 font-mono">Mara {systemSecurity.maxPinAttempts}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Ukaguzi wa Cryptographic Ledger:</span>
                      <span className="text-emerald-400 font-semibold">100% Imethibitishwa</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setShowFreezeModal(true)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                      systemSecurity.isSystemFrozen
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{systemSecurity.isSystemFrozen ? 'Fungua Mfumo (Unfreeze)' : 'Simamisha Mfumo kwa Dharura'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TRANSACTIONS TAB */}
        {adminActiveTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTxnFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    txnFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Zinazosubiri Idhini ({pendingTxns.length})
                </button>
                <button
                  onClick={() => setTxnFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    txnFilter === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Miamala Yote ({transactions.length})
                </button>
              </div>

              <span className="text-xs text-slate-400">
                Idhinisha kutoa fedha au hati za malipo ya Bursar za wanafunzi
              </span>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Mwanafunzi</th>
                      <th className="p-3.5">Aina / Maelezo</th>
                      <th className="p-3.5">Njia & Akaunti</th>
                      <th className="p-3.5">Kiasi</th>
                      <th className="p-3.5">Msimbo (Reference)</th>
                      <th className="p-3.5">Hali</th>
                      <th className="p-3.5 text-right">Hatua</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(txnFilter === 'pending' ? pendingTxns : transactions).map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3.5 font-medium text-white whitespace-nowrap">
                          {txn.studentName}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <p className="font-semibold capitalize text-slate-200">{txn.type}</p>
                          <p className="text-[11px] text-slate-400">{txn.description}</p>
                        </td>
                        <td className="p-3.5 text-slate-300 whitespace-nowrap">
                          <span className="font-medium text-slate-200">{txn.method}</span>
                          <p className="text-[10px] text-slate-400 font-mono">{txn.phoneOrAccount}</p>
                        </td>
                        <td className="p-3.5 font-mono font-bold whitespace-nowrap">
                          <span className={txn.type === 'deposit' ? 'text-emerald-400' : 'text-amber-400'}>
                            {formatTZS(txn.amount)}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                          {txn.referenceCode}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            txn.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : txn.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {txn.status === 'completed' ? 'Imekamilika' : txn.status === 'pending' ? 'Inasubiri' : 'Imekataliwa'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          {txn.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => adminApproveTransaction(txn.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
                              >
                                Idhinisha
                              </button>
                              <button
                                onClick={() => setSelectedTxnToReject(txn.id)}
                                className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg font-semibold transition border border-rose-500/40"
                              >
                                Kataa
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. STUDENTS TAB */}
        {adminActiveTab === 'students' && (
          <div className="space-y-4">
            {/* Pending Approvals Notice Banner */}
            {pendingStudentApprovals.length > 0 && (
              <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      Kuna maombi {pendingStudentApprovals.length} ya wanafunzi wa sekondari yanayosubiri idhini yako!
                    </p>
                    <p className="text-amber-300/80">
                      Wanafunzi hawa wamejisajili kuanzia Kidato cha 1 hadi cha 6. Idhinisha ili wapewe ruzuku na waweze kutumia mfumo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStudentFilter('pending_approval')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Kagua Maombi Yanayosubiri ({pendingStudentApprovals.length})</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tafuta mwanafunzi kwa jina, shule, kidato (Form 1-6), au namba ya usajili..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'pending_approval', 'active', 'suspended'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setStudentFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition flex items-center gap-1.5 ${
                      studentFilter === f
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>
                      {f === 'all' 
                        ? `Wote (${allStudents.length})` 
                        : f === 'pending_approval' 
                        ? `Inasubiri Idhini (${pendingStudentApprovals.length})` 
                        : f === 'active' 
                        ? `Hai (${activeStudentsCount})` 
                        : `Wamesimamishwa (${suspendedStudentsCount})`}
                    </span>
                    {f === 'pending_approval' && pendingStudentApprovals.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Mwanafunzi</th>
                      <th className="p-3.5">Namba ya Usajili</th>
                      <th className="p-3.5">Shule & Kidato (Vigezo)</th>
                      <th className="p-3.5">Mzazi / Mlezi</th>
                      <th className="p-3.5">Salio la Pochi</th>
                      <th className="p-3.5">Hali ya Akaunti</th>
                      <th className="p-3.5 text-right">Hatua za Kiutawala & Idhini</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Hakuna mwanafunzi anayelingana na vigezo vya utafutaji.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img 
                              src={student.avatarUrl} 
                              alt={student.fullName} 
                              className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-white">{student.fullName}</p>
                              <p className="text-[10px] text-slate-400">{student.email}</p>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">
                            {student.studentRegNo}
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <p className="font-medium text-white">{student.schoolName}</p>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {student.courseOrClass} ({student.educationLevel})
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-300">
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <PhoneCall className="w-3 h-3 text-slate-400" />
                              <span className="font-mono text-[11px]">{student.guardianPhone || 'Haijawekwa'}</span>
                            </div>
                            <span className={`text-[10px] ${student.guardianConsent ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {student.guardianConsent ? '✓ Ridhaa ya Mzazi Ipo' : '⚠ Inasubiri Ridhaa'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono whitespace-nowrap">
                            <p className="font-bold text-emerald-400">{formatTZS(student.balance)}</p>
                            <p className="text-[10px] text-slate-400">Wekezo: {formatTZS(student.totalInvested)}</p>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                                student.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : student.status === 'pending_approval'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {student.status === 'active' 
                                  ? 'Active (Imeidhinishwa)' 
                                  : student.status === 'pending_approval' 
                                  ? 'Inasubiri Idhini' 
                                  : 'Imesimamishwa'}
                              </span>
                              {student.isVerifiedStudent && (
                                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Verified Student</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approval Buttons if pending */}
                              {student.status === 'pending_approval' && (
                                <>
                                  <button
                                    onClick={() => {
                                      adminApproveStudent(student.id);
                                      showToast(`Mwanafunzi ${student.fullName} ameidhinishwa na amepewa ruzuku ya kianzio!`);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-900/30"
                                    title="Idhinisha Mwanafunzi huyu"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Idhinisha</span>
                                  </button>
                                  <button
                                    onClick={() => setRejectingStudent({ id: student.id, name: student.fullName, reason: '' })}
                                    className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-xs font-semibold transition border border-rose-500/30 flex items-center gap-1"
                                    title="Kataa Maombi"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Kataa</span>
                                  </button>
                                </>
                              )}

                              {/* Edit Student Info */}
                              <button
                                onClick={() => setEditingStudent({ ...student })}
                                className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 rounded-lg text-xs transition"
                                title="Hariri Taarifa za Mwanafunzi"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Verify badge button */}
                              {!student.isVerifiedStudent && student.status === 'active' && (
                                <button
                                  onClick={() => adminVerifyStudent(student.id)}
                                  className="px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-lg text-[11px] font-semibold transition border border-cyan-500/40"
                                  title="Weka Alama ya Uhakiki"
                                >
                                  Thibitisha
                                </button>
                              )}

                              {/* Suspend / Reactivate */}
                              {student.status !== 'pending_approval' && (
                                <button
                                  onClick={() => adminToggleStudentStatus(student.id)}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                                    student.status === 'active'
                                      ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30'
                                      : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30'
                                  }`}
                                >
                                  {student.status === 'active' ? 'Simamisha' : 'Rejesha'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PROJECTS TAB */}
        {adminActiveTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Usimamizi wa Miradi ya Uzalishaji Shuleni</h3>
                <p className="text-xs text-slate-400">Anzisha miradi mipya, fuatilia ukusanyaji wa mitaji, na gawa faida kwa wanafunzi wawekezaji</p>
              </div>
              <button
                id="btn-admin-add-project"
                onClick={() => setShowNewProjectModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Anzisha Mradi Mpya</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(proj => {
                const percent = Math.min(100, Math.round((proj.collectedAmount / proj.targetAmount) * 100));
                const projectInvestments = investments.filter(i => i.projectId === proj.id && i.status === 'active');

                return (
                  <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                    <div className="h-40 relative">
                      <img 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/90 text-amber-400 border border-slate-700">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{proj.description}</p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Mtaji Uliokusanywa:</span>
                          <span className="font-mono text-white font-bold">{formatTZS(proj.collectedAmount)} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Lengo: {formatTZS(proj.targetAmount)}</span>
                          <span className="text-emerald-400 font-semibold">Faida: {proj.roiPercentage}%</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">
                          {projectInvestments.length} wawekezaji
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDistribute(proj.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-semibold transition flex items-center gap-1 shadow-md shadow-emerald-900/30"
                            title="Gawa Faida kwa Wawekezaji"
                          >
                            <Flame className="w-3 h-3" />
                            <span>Gawa Faida ({proj.roiPercentage}%)</span>
                          </button>
                          <button
                            onClick={() => setEditingProject({ ...proj })}
                            className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 rounded-xl text-xs transition"
                            title="Hariri Taarifa za Mradi"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Una uhakika unataka kufuta mradi wa "${proj.title}"?`)) {
                                adminDeleteProject(proj.id);
                                showToast(`Mradi wa "${proj.title}" umefutwa kikamilifu.`);
                              }
                            }}
                            className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs transition"
                            title="Futa Mradi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. COMPETITIONS TAB */}
        {adminActiveTab === 'competitions' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white">Tathmini ya Mawazo ya Ujasiriamali ya Wanafunzi</h3>
              <p className="text-xs text-slate-400">Weka alama, toa mwongozo wa mtaalamu (mentor feedback), na idhinisha mawazo yaweze kupata ufadhili</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pitch list */}
              <div className="lg:col-span-2 space-y-3">
                {pitchIdeas.map(pitch => (
                  <div 
                    key={pitch.id}
                    onClick={() => {
                      setSelectedPitch(pitch);
                      setMentorComment('');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedPitch?.id === pitch.id 
                        ? 'bg-slate-800 border-amber-500/80 shadow-lg' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {pitch.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            pitch.status === 'winner' ? 'bg-amber-500/20 text-amber-400' :
                            pitch.status === 'finalist' ? 'bg-emerald-500/20 text-emerald-400' :
                            pitch.status === 'mentored' ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {pitch.status === 'winner' ? 'Mshindi (Winner)' :
                             pitch.status === 'finalist' ? 'Fainali (Finalist)' :
                             pitch.status === 'mentored' ? 'Amepewa Ushauri' : 'Inakaguliwa'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{pitch.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pitch.problemStatement}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          {formatTZS(pitch.seedFundingRequired)}
                        </span>
                        <p className="text-[10px] text-slate-500">Kura {pitch.upvotesCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Evaluation Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                {selectedPitch ? (
                  <>
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Jopo la Tathmini</span>
                      <h4 className="text-sm font-bold text-white mt-1">{selectedPitch.title}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{selectedPitch.solutionDescription}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Alama ya Mshauri / Mwalimu (Score 0-100): {mentorScore}%
                        </label>
                        <input
                          type="range"
                          min={40}
                          max={100}
                          value={mentorScore}
                          onChange={(e) => setMentorScore(Number(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Ushauri wa Mtaalamu (Mentor Feedback):
                        </label>
                        <textarea
                          rows={3}
                          value={mentorComment}
                          onChange={(e) => setMentorComment(e.target.value)}
                          placeholder="Andika ushauri wa kitaalamu kwa wanafunzi hawa kuboresha mradi wao..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            if (!mentorComment.trim()) return;
                            addMentorFeedback(selectedPitch.id, {
                              mentorName: currentUser.fullName,
                              mentorRole: 'Mwalimu Mkuu wa Miradi',
                              comments: mentorComment,
                              recommendation: mentorScore >= 80 ? 'Inapendekezwa kupewa ufadhili wa shule' : 'Inahitaji marekebisho madogo ya mpango biashara',
                              scores: {
                                innovation: Math.round(mentorScore * 0.25),
                                feasibility: Math.round(mentorScore * 0.25),
                                socialImpact: Math.round(mentorScore * 0.25),
                                financialViability: Math.round(mentorScore * 0.25),
                                total: mentorScore
                              },
                              date: new Date().toISOString().substring(0, 10)
                            });
                            updatePitchStatus(selectedPitch.id, mentorScore >= 80 ? 'finalist' : 'mentored');
                            setMentorComment('');
                          }}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition"
                        >
                          Wasilisha & Pandisha Daraja
                        </button>
                        <button
                          onClick={() => updatePitchStatus(selectedPitch.id, 'under_review')}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl text-xs transition border border-slate-700"
                        >
                          Weka Kiporo
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    <Award className="w-8 h-8 text-amber-500/30 mx-auto mb-2" />
                    <p>Chagua wazo la mradi kushoto kutathmini na kuandika maoni.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. FINANCIAL REPORTS TAB */}
        {adminActiveTab === 'financial-reports' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Daftari Rasmi la Mapato na Matumizi (Bursar Ledger)</h3>
                <p className="text-xs text-slate-400">Rekodi za wazi za fedha zinazotumiwa na kuingia kwenye miradi ya shule</p>
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ongeza Rekodi ya Kifedha</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Tarehe</th>
                      <th className="p-3.5">Aina</th>
                      <th className="p-3.5">Kichwa / Mradi</th>
                      <th className="p-3.5">Kategoria</th>
                      <th className="p-3.5">Kiasi</th>
                      <th className="p-3.5">Mthibitishaji</th>
                      <th className="p-3.5 text-right">Hatua</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {financialReports.map(rep => (
                      <tr key={rep.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3.5 text-slate-400 font-mono whitespace-nowrap">{rep.date}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            rep.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' :
                            rep.type === 'expense' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-indigo-500/20 text-indigo-400'
                          }`}>
                            {rep.type === 'income' ? 'Mapato' : rep.type === 'expense' ? 'Matumizi' : 'Gawio'}
                          </span>
                        </td>
                        <td className="p-3.5 text-white font-medium">{rep.title}</td>
                        <td className="p-3.5 text-slate-300">{rep.category}</td>
                        <td className="p-3.5 font-mono font-bold whitespace-nowrap">
                          <span className={rep.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                            {rep.type === 'expense' ? '-' : '+'}{formatTZS(rep.amount)}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">{rep.recordedBy}</td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (confirm(`Una uhakika unataka kufuta rekodi hii ya "${rep.title}"?`)) {
                                adminDeleteFinancialReport(rep.id);
                                showToast(`Rekodi ya "${rep.title}" imefutwa kikamilifu.`);
                              }
                            }}
                            className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition"
                            title="Futa Rekodi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. SECURITY AUDIT & LEDGER VERIFICATION TAB */}
        {adminActiveTab === 'security-audit' && (
          <div className="space-y-6">
            {/* Hash & Reference Integrity Checker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Uhakiki wa Msimbo wa Muamala (Cryptographic Ledger Verification)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Thibitisha kama stakabadhi au msimbo wa muamala wa mwanafunzi ni halisi na haujabadilishwa.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyHash} className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Bandika Reference Code (mfano: MP-..., INV-...) au SHA Hash..."
                  className="flex-1 min-w-[260px] bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Kagua Muamala</span>
                </button>
              </form>

              {verifyResult && (
                <div className={`mt-4 p-4 rounded-xl border text-xs ${
                  verifyResult.valid 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {verifyResult.valid ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" /> : <XCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />}
                    <div>
                      <p className="font-bold">{verifyResult.valid ? 'Muamala Umethibitishwa: HALISI' : 'Uhakiki Umefeli'}</p>
                      <p className="mt-1">{verifyResult.message}</p>
                      {verifyResult.calculatedHash && (
                        <p className="font-mono text-[10px] mt-2 opacity-80 break-all">
                          Signature: {verifyResult.calculatedHash}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Audit Logs Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Daftari la Ukaguzi wa Kiulinzi (Security Audit Trail)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Rekodi zote za kuingia, kubadilisha taarifa, miamala na hitilafu za PIN</p>
                </div>

                <div className="flex items-center gap-2">
                  {(['ALL', 'SUCCESS', 'WARNING', 'FAILED'] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setAuditSeverity(sev)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                        auditSeverity === sev
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-800 font-mono text-xs max-h-96 overflow-y-auto pr-1">
                {filteredAuditLogs.map(log => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        log.status === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.status}
                      </span>
                      <div>
                        <p className="text-slate-200 font-sans font-medium">{log.action}: {log.details}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Actor: {log.actorName} ({log.actorRole}) • IP: {log.ipMasked}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. SYSTEM SETTINGS TAB */}
        {adminActiveTab === 'system-settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Mipangilio ya Usalama na Uendeshaji wa Mfumo</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dhibiti vigezo vya kiusalama vinavyotumika kwa wanafunzi wote na walimu kwenye mfumo huu hai.
              </p>
            </div>

            {/* Emergency Freeze Setting */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Kusimamisha Mfumo wa Fedha kwa Dharura (Emergency Financial Freeze)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Huzuia mara moja miamala yote ya kuweka fedha, kutoa na kuwekeza iwapo kuna ukaguzi au hitilafu.
                  </p>
                </div>
                <button
                  onClick={() => setShowFreezeModal(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    systemSecurity.isSystemFrozen
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {systemSecurity.isSystemFrozen ? 'IMESIMAMISHWA' : 'HAI (NORMAL)'}
                </button>
              </div>
            </div>

            {/* Auto Lock Timer */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">
                Muda wa Kufunga Skrini Kiotomatiki Mwanafunzi Akikaa Kimya:
              </label>
              <select
                value={systemSecurity.autoLockMinutes}
                onChange={(e) => updateSystemSecurity({ autoLockMinutes: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value={1}>Dakika 1 (Usalama Mkali Zaidi)</option>
                <option value={3}>Dakika 3 (Kiwango cha Kawaida cha Shule)</option>
                <option value={5}>Dakika 5 (Inapendekezwa)</option>
                <option value={10}>Dakika 10</option>
                <option value={0}>Zima Kujifunga (Haipendekezwi)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Mwanafunzi asipogusa simu au kompyuta kwa muda huu, skrini inajifunga mara moja na kuficha salio.
              </p>
            </div>

            {/* Max PIN Attempts */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">
                Majaribio ya Juu Zaidi ya PIN Kabla ya Kufunga Akaunti (Anti-Brute Force):
              </label>
              <select
                value={systemSecurity.maxPinAttempts}
                onChange={(e) => updateSystemSecurity({ maxPinAttempts: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:ring-2 focus:ring-amber-500"
              >
                <option value={3}>Majaribio 3 (Inapendekezwa kisheria)</option>
                <option value={5}>Majaribio 5</option>
                <option value={10}>Majaribio 10</option>
              </select>
            </div>

            {/* Balance Masking Toggle */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Kuficha Salio kwa Chaguomsingi (Balance Masking):</h4>
                <p className="text-[10px] text-slate-500">Weka alama za ••••••• badala ya namba hadharani ili wanafunzi wengine wasichungulie salio.</p>
              </div>
              <button
                onClick={() => updateSystemSecurity({ balanceMasked: !systemSecurity.balanceMasked })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  systemSecurity.balanceMasked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {systemSecurity.balanceMasked ? 'Imewashwa (Masked)' : 'Imezimwa (Visible)'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Reject Transaction Modal */}
      {selectedTxnToReject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>Sababu ya Kukataa Muamala Huu</span>
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Mfano: Stakabadhi haionekani vizuri, au jina la akaunti halilingani na mwanafunzi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTxnToReject(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Ghairi
              </button>
              <button
                onClick={() => {
                  adminRejectTransaction(selectedTxnToReject, rejectReason || 'Muamala haukukidhi vigezo vya shule');
                  setSelectedTxnToReject(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition"
              >
                Kataa Muamala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Freeze Confirmation Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {systemSecurity.isSystemFrozen ? 'Kufungua Mfumo wa Kifedha' : 'Kusimamisha Mfumo kwa Dharura'}
                </h3>
                <p className="text-[11px] text-slate-400">Hatua hii inaathiri wanafunzi wote wanaotumia mfumo.</p>
              </div>
            </div>

            {!systemSecurity.isSystemFrozen && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sababu ya Kusimamisha:</label>
                <input
                  type="text"
                  value={freezeReasonInput}
                  onChange={(e) => setFreezeReasonInput(e.target.value)}
                  placeholder="Mfano: Ukaguzi wa mwisho wa robo mwaka wa fedha..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setShowFreezeModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Ghairi
              </button>
              <button
                onClick={handleToggleFreeze}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  systemSecurity.isSystemFrozen
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {systemSecurity.isSystemFrozen ? 'Fungua Mfumo Sasa' : 'Nathibitisha: Simamisha Mfumo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 my-8">
            <h3 className="text-base font-bold text-white">Anzisha Mradi Mpya wa Uwekezaji wa Wanafunzi</h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Jina la Mradi:</label>
                <input
                  type="text"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  placeholder="Mfano: Kilimo cha Kisasa cha Mbogamboga Shuleni"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kategoria:</label>
                  <select
                    value={newProj.category}
                    onChange={(e) => setNewProj({ ...newProj, category: e.target.value as ProjectCategory })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Kilimo & Mifugo">Kilimo & Mifugo</option>
                    <option value="Teknolojia & TEHAMA">Teknolojia & TEHAMA</option>
                    <option value="Biashara Ndogondogo">Biashara Ndogondogo</option>
                    <option value="Ubunifu & Ushonaji">Ubunifu & Ushonaji</option>
                    <option value="Sanaa & Burudani">Sanaa & Burudani</option>
                    <option value="Nishati Safi & Mazingira">Nishati Safi & Mazingira</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Shule:</label>
                  <input
                    type="text"
                    value={newProj.schoolName}
                    onChange={(e) => setNewProj({ ...newProj, schoolName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Lengo la Mtaji (TZS):</label>
                  <input
                    type="number"
                    value={newProj.targetAmount}
                    onChange={(e) => setNewProj({ ...newProj, targetAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kiwango cha Chini (TZS):</label>
                  <input
                    type="number"
                    value={newProj.minInvestment}
                    onChange={(e) => setNewProj({ ...newProj, minInvestment: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Makadirio ya Faida (% ROI):</label>
                  <input
                    type="number"
                    value={newProj.roiPercentage}
                    onChange={(e) => setNewProj({ ...newProj, roiPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mzunguko (Siku):</label>
                  <input
                    type="number"
                    value={newProj.cycleDays}
                    onChange={(e) => setNewProj({ ...newProj, cycleDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Maelezo ya Mradi:</label>
                <textarea
                  rows={2}
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  placeholder="Eleza jinsi mradi utakavyofanya kazi na kuzalisha faida..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
                >
                  Sajili Mradi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-sm font-bold text-white">Weka Rekodi ya Mapato / Matumizi ya Bursar</h3>
            <form onSubmit={handleAddReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Aina ya Rekodi:</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="income">Mapato (Income)</option>
                  <option value="expense">Matumizi (Expense)</option>
                  <option value="dividend">Gawio la Faida (Dividend)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Kichwa cha Taarifa:</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="Mfano: Ununuzi wa Mbolea na Mbegu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Kiasi (TZS):</label>
                <input
                  type="number"
                  value={newReport.amount}
                  onChange={(e) => setNewReport({ ...newReport, amount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
                >
                  Hifadhi Rekodi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hariri Taarifa za Mwanafunzi</h3>
                  <p className="text-[11px] text-slate-400">Sasisha vigezo vya shule, kidato cha sekondari, au mawasiliano</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateStudent(editingStudent.id, {
                  fullName: editingStudent.fullName,
                  studentRegNo: editingStudent.studentRegNo,
                  schoolName: editingStudent.schoolName,
                  courseOrClass: editingStudent.courseOrClass,
                  educationLevel: editingStudent.educationLevel,
                  phone: editingStudent.phone,
                  guardianPhone: editingStudent.guardianPhone,
                  balance: Number(editingStudent.balance),
                  status: editingStudent.status
                });
                showToast(`Taarifa za mwanafunzi ${editingStudent.fullName} zimesasishwa.`);
                setEditingStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Jina Kamili:</label>
                  <input
                    type="text"
                    value={editingStudent.fullName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Namba ya Usajili:</label>
                  <input
                    type="text"
                    value={editingStudent.studentRegNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentRegNo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Jina la Shule:</label>
                  <input
                    type="text"
                    value={editingStudent.schoolName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, schoolName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Kidato (Secondary Form):</label>
                  <select
                    value={editingStudent.courseOrClass}
                    onChange={(e) => setEditingStudent({ ...editingStudent, courseOrClass: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Kidato cha 1 (Form I)">Kidato cha 1 (Form I)</option>
                    <option value="Kidato cha 2 (Form II)">Kidato cha 2 (Form II)</option>
                    <option value="Kidato cha 3 (Form III)">Kidato cha 3 (Form III)</option>
                    <option value="Kidato cha 4 (Form IV)">Kidato cha 4 (Form IV)</option>
                    <option value="Kidato cha 5 (Form V)">Kidato cha 5 (Form V)</option>
                    <option value="Kidato cha 6 (Form VI)">Kidato cha 6 (Form VI)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Simu ya Mwanafunzi:</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Simu ya Mzazi / Mlezi:</label>
                  <input
                    type="text"
                    value={editingStudent.guardianPhone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Salio la Pochi (TZS):</label>
                  <input
                    type="number"
                    value={editingStudent.balance}
                    onChange={(e) => setEditingStudent({ ...editingStudent, balance: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Hali ya Akaunti:</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="active">Hai (Active - Imeidhinishwa)</option>
                    <option value="pending_approval">Inasubiri Idhini (Pending)</option>
                    <option value="suspended">Imesimamishwa (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
                >
                  Hifadhi Mabadiliko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Student Modal */}
      {rejectingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/60 rounded-2xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Kataa Maombi ya Mwanafunzi</h3>
                <p className="text-[11px] text-slate-400">{rejectingStudent.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mwanafunzi huyu hataweza kuingia au kufanya miamala kwenye mfumo hadi atakaporekebisha taarifa zake na kukidhi vigezo vya mwanafunzi wa sekondari.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sababu ya Kukataa:
              </label>
              <textarea
                rows={3}
                value={rejectingStudent.reason}
                onChange={(e) => setRejectingStudent({ ...rejectingStudent, reason: e.target.value })}
                placeholder="Mfano: Taarifa za shule hazijathibitishwa, au namba ya simu ya mzazi haipatikani..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingStudent(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={() => {
                  adminRejectStudent(
                    rejectingStudent.id, 
                    rejectingStudent.reason || 'Hakidhi vigezo vya usajili wa mwanafunzi wa sekondari.'
                  );
                  showToast(`Maombi ya mwanafunzi ${rejectingStudent.name} yamekataliwa.`, 'error');
                  setRejectingStudent(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-900/30"
              >
                Thibitisha Kukataa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hariri Taarifa za Mradi</h3>
                  <p className="text-[11px] text-slate-400">Sasisha malengo ya mtaji, faida, au maelezo ya mradi</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateProject(editingProject.id, {
                  title: editingProject.title,
                  category: editingProject.category,
                  schoolName: editingProject.schoolName,
                  targetAmount: Number(editingProject.targetAmount),
                  minInvestment: Number(editingProject.minInvestment),
                  roiPercentage: Number(editingProject.roiPercentage),
                  cycleDays: Number(editingProject.cycleDays),
                  description: editingProject.description,
                  imageUrl: editingProject.imageUrl
                });
                showToast(`Taarifa za mradi wa "${editingProject.title}" zimesasishwa.`);
                setEditingProject(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-300 mb-1">Jina la Mradi:</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kategoria:</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Kilimo & Mifugo">Kilimo & Mifugo</option>
                    <option value="Teknolojia & TEHAMA">Teknolojia & TEHAMA</option>
                    <option value="Biashara Ndogondogo">Biashara Ndogondogo</option>
                    <option value="Ubunifu & Ushonaji">Ubunifu & Ushonaji</option>
                    <option value="Sanaa & Burudani">Sanaa & Burudani</option>
                    <option value="Nishati Safi & Mazingira">Nishati Safi & Mazingira</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Shule:</label>
                  <input
                    type="text"
                    value={editingProject.schoolName}
                    onChange={(e) => setEditingProject({ ...editingProject, schoolName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Lengo la Mtaji (TZS):</label>
                  <input
                    type="number"
                    value={editingProject.targetAmount}
                    onChange={(e) => setEditingProject({ ...editingProject, targetAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kiwango cha Chini (TZS):</label>
                  <input
                    type="number"
                    value={editingProject.minInvestment}
                    onChange={(e) => setEditingProject({ ...editingProject, minInvestment: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Makadirio ya Faida (% ROI):</label>
                  <input
                    type="number"
                    value={editingProject.roiPercentage}
                    onChange={(e) => setEditingProject({ ...editingProject, roiPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mzunguko (Siku):</label>
                  <input
                    type="number"
                    value={editingProject.cycleDays}
                    onChange={(e) => setEditingProject({ ...editingProject, cycleDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Maelezo ya Mradi:</label>
                <textarea
                  rows={2}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition"
                >
                  Hifadhi Mabadiliko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
