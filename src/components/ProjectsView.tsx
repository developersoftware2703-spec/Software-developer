import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InvestmentProject, ProjectCategory } from '../types';
import { formatTZS } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Building2, 
  Users, 
  Coins, 
  ShieldCheck, 
  ArrowUpRight,
  Sprout,
  Utensils,
  Cpu,
  Palette,
  Sun
} from 'lucide-react';

interface ProjectsViewProps {
  onSelectProject: (project: InvestmentProject) => void;
  onInvestProject: (project: InvestmentProject) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectProject, onInvestProject }) => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Zote');
  const [selectedRisk, setSelectedRisk] = useState<string>('Zote');

  const categories: { name: string; label: string; icon: any }[] = [
    { name: 'Zote', label: 'Miradi Yote', icon: Coins },
    { name: 'Kilimo & Mifugo', label: 'Kilimo & Mifugo', icon: Sprout },
    { name: 'Huduma za Chakula & Canteen', label: 'Canteen & Bakery', icon: Utensils },
    { name: 'Teknolojia & Uchapaji', label: 'Tech & Uchapaji', icon: Cpu },
    { name: 'Nishati Safi & Mazingira', label: 'Nishati Safi', icon: Sun },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Zote' || project.category === selectedCategory;
    const matchesRisk = selectedRisk === 'Zote' || project.riskLevel === selectedRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title & Introduction Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-2 inline-block">
            Mifuko ya Uwekezaji ya Wanafunzi
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Miradi ya Ujasiriamali Mashuleni & Vyoni
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Wekeza akiba yako katika miradi inayoendeshwa na wanafunzi wenzako, ikisimamiwa na walimu wataalamu. Pata gawio la faida halisi punde mavuno na mauzo yanapokamilika.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 text-xs shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block">100% Wanafunzi Pekee</span>
            <span className="text-slate-500 text-[11px]">Miradi inakaguliwa na bodi ya shule</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tafuta mradi kwa jina, shule (mfano: Azania, UDSM, Tambaza), au aina..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Zote">Hatari: Zote</option>
              <option value="Chini">Hatari: Chini</option>
              <option value="Wastani">Hatari: Wastani</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm font-medium">
              Hakuna miradi inayolingana na vigezo ulivyochagua.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Zote'); setSelectedRisk('Zote'); }}
              className="mt-3 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100"
            >
              Futa Vichujio (Reset Filters)
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const progress = Math.min(100, Math.round((project.collectedAmount / project.targetAmount) * 100));

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Visual Header */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-slate-950 shadow-sm">
                      +{project.roiPercentage}% ROI
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      project.riskLevel === 'Chini' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Hatari: {project.riskLevel}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {project.schoolName}
                    </span>
                    <h3 className="font-extrabold text-base text-white leading-tight line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Mzunguko</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Siku {project.cycleDays}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Usimamizi</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        {project.teamMembersCount} Wanafunzi
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-900">{formatTZS(project.collectedAmount)}</span>
                      <span className="text-slate-500">{progress}% ya Lengo</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Kima cha chini: {formatTZS(project.minInvestment)}</span>
                      <span>Lengo: {formatTZS(project.targetAmount)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Angalia Mradi
                    </button>
                    <button
                      onClick={() => onInvestProject(project)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Wekeza
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
