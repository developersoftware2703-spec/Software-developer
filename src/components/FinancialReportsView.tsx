import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinancialReportItem } from '../types';
import { formatTZS, formatDate } from '../utils/formatters';
import { 
  FileText, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Printer, 
  Download, 
  Building2, 
  Filter, 
  PieChart, 
  Coins, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const FinancialReportsView: React.FC = () => {
  const { financialReports, projects } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculations
  const filteredReports = financialReports.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesProject = selectedProjectId === 'all' || item.projectId === selectedProjectId;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.projectName && item.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesProject && matchesSearch;
  });

  const totalIncome = financialReports
    .filter(i => i.type === 'income' && (selectedProjectId === 'all' || i.projectId === selectedProjectId))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = financialReports
    .filter(i => i.type === 'expense' && (selectedProjectId === 'all' || i.projectId === selectedProjectId))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Tarehe', 'Aina', 'Kitengo', 'Maelezo', 'Mradi', 'Namba ya Risiti', 'Kiasi (TZS)', 'Mhasibu'];
    const rows = filteredReports.map(r => [
      r.date,
      r.type === 'income' ? 'Mapato' : 'Matumizi',
      `"${r.category}"`,
      `"${r.title}"`,
      `"${r.projectName || 'Mkuu'}"`,
      r.receiptNumber || '-',
      r.amount,
      `"${r.recordedBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ripoti_ya_Mapato_na_Matumizi_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:p-0 print:space-y-3">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2 inline-block print:hidden">
            Usimamizi wa Fedha & Uwazi
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Ripoti ya Mapato na Matumizi (Financial Statement)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Taarifa rasmi ya uwazi wa hesabu za miradi ya ujasiriamali ya wanafunzi mashuleni. Kila senti inakaguliwa na kurekodiwa kwa risiti halisi.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Pakua CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Chapisha Ripoti (Print)
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Income */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Jumla ya Mapato (Income)
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            +{formatTZS(totalIncome)}
          </div>
          <span className="text-[11px] text-emerald-600 block mt-1">
            Kutoka mauzo ya bidhaa & huduma
          </span>
        </div>

        {/* Total Expenses */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Jumla ya Matumizi (Expenses)
            </span>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700">
            -{formatTZS(totalExpense)}
          </div>
          <span className="text-[11px] text-amber-600 block mt-1">
            Gharama za uzalishaji & uendeshaji
          </span>
        </div>

        {/* Net Profit */}
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Faida Halisi (Net Profit)
            </span>
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-teal-800">
            {netProfit >= 0 ? '+' : ''}{formatTZS(netProfit)}
          </div>
          <span className="text-[11px] text-teal-600 block mt-1">
            Inayogawiwa kwa wawekezaji
          </span>
        </div>

        {/* Profitability Margin */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ufanisi wa Faida (Margin)
            </span>
            <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {profitMargin}%
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Uwiano mzuri wa kibiashara
          </span>
        </div>

      </div>

      {/* Visual Comparison Breakdown Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-emerald-700 flex items-center gap-1">
            Mapato: {formatTZS(totalIncome)} ({Math.round((totalIncome / (totalIncome + totalExpense || 1)) * 100)}%)
          </span>
          <span className="text-amber-700 flex items-center gap-1">
            Matumizi: {formatTZS(totalExpense)} ({Math.round((totalExpense / (totalIncome + totalExpense || 1)) * 100)}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-600 h-full"
            style={{ width: `${(totalIncome / (totalIncome + totalExpense || 1)) * 100}%` }}
          />
          <div
            className="bg-amber-500 h-full"
            style={{ width: `${(totalExpense / (totalIncome + totalExpense || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls & Search (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        
        {/* Type tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yote ({financialReports.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'income' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mapato Pekee
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'expense' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matumizi Pekee
          </button>
        </div>

        {/* Project Selector & Search */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Miradi Yote ya Shule</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tafuta taarifa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Itemized Financial Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tarehe</th>
                <th className="py-3 px-3">Aina</th>
                <th className="py-3 px-4">Maelezo ya Muamala</th>
                <th className="py-3 px-3">Mradi wa Shule</th>
                <th className="py-3 px-3">Namba ya Risiti</th>
                <th className="py-3 px-4 text-right">Kiasi (TZS)</th>
                <th className="py-3 px-4">Mrekodi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Hakuna kumbukumbu za fedha zilizopatikana.
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        item.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.type === 'income' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {item.type === 'income' ? 'Mapato' : 'Matumizi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate">
                      {item.projectName || 'Usimamizi Mkuu'}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {item.receiptNumber || 'N/A'}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold whitespace-nowrap text-sm ${
                      item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}{formatTZS(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {item.recordedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
