import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectCategory, InvestmentProject } from '../types';
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
  Sparkles, 
  AlertCircle, 
  Search, 
  Building2, 
  DollarSign, 
  FileText,
  UserCheck,
  UserX
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    allStudents, 
    transactions, 
    projects, 
    investments,
    adminApproveTransaction, 
    adminRejectTransaction,
    adminCreateProject,
    adminDistributeProfit,
    adminAddFinancialReport,
    adminToggleStudentStatus,
    adminVerifyStudent
  } = useApp();

  const [adminTab, setAdminTab] = useState<'transactions' | 'students' | 'projects' | 'finances'>('transactions');
  
  // Transaction filter
  const [txnFilter, setTxnFilter] = useState<'pending' | 'all'>('pending');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [selectedTxnToReject, setSelectedTxnToReject] = useState<string | null>(null);

  // Student Search
  const [studentSearch, setStudentSearch] = useState<string>('');

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
    maxInvestmentPerStudent: 150000,
    roiPercentage: 20,
    cycleDays: 60,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 60 * 86400000).toISOString().substring(0, 10),
    status: 'funding' as const,
    riskLevel: 'Chini' as const,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    galleryImages: []
  });

  // New Financial Report Item Form State
  const [newReport, setNewReport] = useState({
    type: 'income' as 'income' | 'expense',
    category: 'Mauzo ya Bidhaa za Shule',
    title: '',
    amount: 150000,
    date: new Date().toISOString().substring(0, 10),
    projectId: projects[0]?.id || '',
    recordedBy: currentUser.fullName,
    receiptNumber: 'REC-' + Math.floor(1000 + Math.random() * 9000),
    notes: ''
  });
  const [reportSuccess, setReportSuccess] = useState<string>('');

  // Profit distribution notification
  const [distributeMsg, setDistributeMsg] = useState<string>('');

  // Pending transactions
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const displayedTransactions = txnFilter === 'pending' ? pendingTransactions : transactions;

  // Filtered students
  const filteredStudents = allStudents.filter(s => 
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.studentRegNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.schoolName.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.description) return;

    adminCreateProject(newProj);
    setShowNewProjectModal(false);
    setNewProj({
      title: '',
      category: 'Kilimo & Mifugo',
      schoolName: 'Sekondari ya Benjamin Mkapa',
      description: '',
      teamLead: 'Amina Kassim',
      teamMembersCount: 5,
      targetAmount: 2500000,
      minInvestment: 5000,
      maxInvestmentPerStudent: 150000,
      roiPercentage: 20,
      cycleDays: 60,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date(Date.now() + 60 * 86400000).toISOString().substring(0, 10),
      status: 'funding',
      riskLevel: 'Chini',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      galleryImages: []
    });
  };

  const handleDistribute = (projectId: string) => {
    const res = adminDistributeProfit(projectId);
    setDistributeMsg(`Gawio la faida limegawiwa kwa wawekezaji ${res.count} wa mradi huu! Jumla iliyotolewa: ${formatTZS(res.totalDistributed)}.`);
    setTimeout(() => setDistributeMsg(''), 5000);
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === newReport.projectId);
    adminAddFinancialReport({
      ...newReport,
      projectName: proj?.title || 'Usimamizi Mkuu'
    });
    setReportSuccess(`Kumbukumbu ya ${newReport.type === 'income' ? 'Mapato' : 'Matumizi'} imerekodiwa kikamilifu!`);
    setNewReport({
      ...newReport,
      title: '',
      amount: 50000,
      receiptNumber: 'REC-' + Math.floor(1000 + Math.random() * 9000)
    });
    setTimeout(() => setReportSuccess(''), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md inline-block">
              Jopo la Msimamizi (Admin Portal)
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              Mamlaka ya Usimamizi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Usimamizi wa Miamala & Wanafunzi Waliosajiliwa
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Simamia idhini za kutoa/kuweka fedha, thibitisha wanafunzi, gawa faida (dividends), na rekodi taarifa rasmi za fedha.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold block">
              Inayosubiri Idhini
            </span>
            <span className="text-lg font-black text-white block mt-0.5">
              {pendingTransactions.length} Miamala
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Wanafunzi</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {allStudents.filter(s => s.role === 'student').length} Wanafunzi
          </div>
          <span className="text-[11px] text-emerald-700">Akaunti hai za shule</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Idhini Zinazosubiri</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {pendingTransactions.length} Maombi
          </div>
          <span className="text-[11px] text-slate-500">Utoaji na Vocha za Bursar</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Miradi ya Shule</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {projects.length} Miradi
          </div>
          <span className="text-[11px] text-slate-500">Katika sekta 5 za uzalishaji</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Jumla Iliyowekezwa</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {formatTZS(projects.reduce((acc, p) => acc + p.collectedAmount, 0))}
          </div>
          <span className="text-[11px] text-emerald-600">Mtaji wa wanafunzi</span>
        </div>
      </div>

      {distributeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{distributeMsg}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs gap-1">
        <button
          onClick={() => setAdminTab('transactions')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            adminTab === 'transactions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Miamala & Idhini ({pendingTransactions.length})
        </button>

        <button
          onClick={() => setAdminTab('students')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            adminTab === 'students'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Wanafunzi Waliosajiliwa ({allStudents.length})
        </button>

        <button
          onClick={() => setAdminTab('projects')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            adminTab === 'projects'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Miradi & Gawio ({projects.length})
        </button>

        <button
          onClick={() => setAdminTab('finances')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            adminTab === 'finances'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Rekodi Hesabu
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS MANAGEMENT */}
      {adminTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Usimamizi wa Miamala ya Wanafunzi
              </h3>
              <p className="text-xs text-slate-500">
                Idhinisha fedha za vocha za bursar na maombi ya kutoa fedha kwenda simu za mikononi
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setTxnFilter('pending')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  txnFilter === 'pending' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inayosubiri Idhini ({pendingTransactions.length})
              </button>
              <button
                onClick={() => setTxnFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  txnFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Miamala Yote ({transactions.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Muda</th>
                  <th className="py-2.5 px-3">Mwanafunzi</th>
                  <th className="py-2.5 px-3">Aina</th>
                  <th className="py-2.5 px-3">Njia & Akaunti</th>
                  <th className="py-2.5 px-3 text-right">Kiasi</th>
                  <th className="py-2.5 px-3">Hali</th>
                  <th className="py-2.5 px-3 text-center">Hatua (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Hakuna miamala inayolingana na kichujio hiki.
                    </td>
                  </tr>
                ) : (
                  displayedTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                        {txn.timestamp}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{txn.studentName}</span>
                        <span className="text-[10px] font-mono text-slate-400">Ref: {txn.referenceCode}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          txn.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' :
                          txn.type === 'invest' ? 'bg-blue-100 text-blue-800' :
                          txn.type === 'profit_payout' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-medium">{txn.method}</div>
                        <div className="text-[10px] text-slate-400">{txn.phoneOrAccount}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 text-sm whitespace-nowrap">
                        {formatTZS(txn.amount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          txn.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                          txn.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {txn.status === 'completed' ? 'Imekamilika' : txn.status === 'pending' ? 'Inasubiri' : 'Imekataliwa'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {txn.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => adminApproveTransaction(txn.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Idhinisha
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Tafadhali weka sababu ya kukataa muamala huu:');
                                if (reason) adminRejectTransaction(txn.id, reason);
                              }}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Kataa
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Imethibitishwa</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED STUDENTS MANAGEMENT */}
      {adminTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Wanafunzi Waliosajiliwa Kwenye Mfumo
              </h3>
              <p className="text-xs text-slate-500">
                Hakiki namba za usajili wa shule, salio, uwekezaji, na hali ya uanachama
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tafuta mwanafunzi..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Mwanafunzi</th>
                  <th className="py-2.5 px-3">Shule & Kozi</th>
                  <th className="py-2.5 px-3">Reg No</th>
                  <th className="py-2.5 px-3 text-right">Salio la Pochi</th>
                  <th className="py-2.5 px-3 text-right">Uwekezaji</th>
                  <th className="py-2.5 px-3">Uhakiki</th>
                  <th className="py-2.5 px-3 text-center">Hatua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{student.fullName}</span>
                          <span className="text-[10px] text-slate-400">{student.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{student.schoolName}</div>
                      <div className="text-[10px] text-slate-400">{student.courseOrClass} ({student.educationLevel})</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                      {student.studentRegNo}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">
                      {formatTZS(student.balance)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatTZS(student.totalInvested)}
                    </td>
                    <td className="py-3 px-3">
                      {student.isVerifiedStudent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          Imethibitishwa
                        </span>
                      ) : (
                        <button
                          onClick={() => adminVerifyStudent(student.id)}
                          className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md"
                        >
                          Thibitisha Sasa
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => adminToggleStudentStatus(student.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          student.status === 'active'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {student.status === 'active' ? 'Simamisha' : 'Wezesha'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS & PROFIT DISTRIBUTION */}
      {adminTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Miradi ya Shule & Ugawaji wa Faida (Profit Distribution)
              </h3>
              <p className="text-xs text-slate-500">
                Ongeza miradi mipya ya ujasiriamali au gawa gawio kwa wanafunzi wawekezaji mradi unapokomaa
              </p>
            </div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Sajili Mradi Mpya
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => {
              const projectInvestments = investments.filter(i => i.projectId === p.id);
              const activeCount = projectInvestments.filter(i => i.status === 'active').length;

              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 uppercase">
                        {p.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        +{p.roiPercentage}% Faida (ROI)
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-slate-900 mt-1">{p.title}</h4>
                    <p className="text-xs text-slate-500">{p.schoolName} • Kiongozi: {p.teamLead}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mtaji Uliokusanywa:</span>
                      <span className="font-bold text-slate-900">{formatTZS(p.collectedAmount)} / {formatTZS(p.targetAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Wawekezaji Hai:</span>
                      <span className="font-bold text-emerald-700">{activeCount} Wanafunzi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mzunguko:</span>
                      <span className="font-medium text-slate-700">Siku {p.cycleDays}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Hali: <strong className="text-slate-800">{p.status}</strong>
                    </span>
                    <button
                      onClick={() => handleDistribute(p.id)}
                      disabled={activeCount === 0}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs ${
                        activeCount > 0
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Gawa Faida ({activeCount})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: RECORD INCOME AND EXPENSES */}
      {adminTab === 'finances' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs max-w-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Rekodi Mapato au Matumizi ya Mradi Shuleni
            </h3>
            <p className="text-xs text-slate-500">
              Ingiza hesabu za mauzo au manunuzi ya vifaa moja kwa moja kwenye taarifa rasmi ya shule
            </p>
          </div>

          {reportSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{reportSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddReport} className="space-y-3.5">
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setNewReport({ ...newReport, type: 'income' })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                  newReport.type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Mapato (Mauzo ya Bidhaa)
              </button>
              <button
                type="button"
                onClick={() => setNewReport({ ...newReport, type: 'expense' })}
                className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                  newReport.type === 'expense' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Matumizi (Gharama za Uzalishaji)
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mradi Husika:</label>
              <select
                value={newReport.projectId}
                onChange={(e) => setNewReport({ ...newReport, projectId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} - {p.schoolName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maelezo ya Muamala:</label>
              <input
                type="text"
                value={newReport.title}
                onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                placeholder="Mfano: Mauzo ya mayai trela 30 au ununuzi wa mbegu"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kiasi (TZS):</label>
                <input
                  type="number"
                  value={newReport.amount}
                  onChange={(e) => setNewReport({ ...newReport, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Namba ya Risiti:</label>
                <input
                  type="text"
                  value={newReport.receiptNumber}
                  onChange={(e) => setNewReport({ ...newReport, receiptNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Hifadhi Kwenye Ripoti ya Fedha
            </button>
          </form>
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Sajili Mradi Mpya wa Wanafunzi</h3>
              <button onClick={() => setShowNewProjectModal(false)} className="text-white/80 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-4 sm:p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jina la Mradi:</label>
                <input
                  type="text"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  placeholder="Mfano: Kilimo cha Mbogamboga na Vitunguu"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sekta:</label>
                  <select
                    value={newProj.category}
                    onChange={(e) => setNewProj({ ...newProj, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Kilimo & Mifugo">Kilimo & Mifugo</option>
                    <option value="Huduma za Chakula & Canteen">Canteen & Bakery</option>
                    <option value="Teknolojia & Uchapaji">Teknolojia & Uchapaji</option>
                    <option value="Nishati Safi & Mazingira">Nishati Safi & Mazingira</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shule / Chuo:</label>
                  <input
                    type="text"
                    value={newProj.schoolName}
                    onChange={(e) => setNewProj({ ...newProj, schoolName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maelezo ya Mradi:</label>
                <textarea
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 h-16"
                  placeholder="Eleza jinsi mradi utakavyoendeshwa na wanafunzi na kuzalisha faida..."
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lengo (TZS):</label>
                  <input
                    type="number"
                    value={newProj.targetAmount}
                    onChange={(e) => setNewProj({ ...newProj, targetAmount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faida (% ROI):</label>
                  <input
                    type="number"
                    value={newProj.roiPercentage}
                    onChange={(e) => setNewProj({ ...newProj, roiPercentage: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold text-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Siku za Mzunguko:</label>
                  <input
                    type="number"
                    value={newProj.cycleDays}
                    onChange={(e) => setNewProj({ ...newProj, cycleDays: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kima cha Chini (TZS):</label>
                  <input
                    type="number"
                    value={newProj.minInvestment}
                    onChange={(e) => setNewProj({ ...newProj, minInvestment: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kiongozi wa Mradi:</label>
                  <input
                    type="text"
                    value={newProj.teamLead}
                    onChange={(e) => setNewProj({ ...newProj, teamLead: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Sajili Mradi Sasa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
