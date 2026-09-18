import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Lightbulb, 
  Send, 
  Users, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  HelpCircle, 
  Plus, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { formatTZS } from '../utils/formatters';
import { PitchIdea, ProjectCategory, MentorFeedback } from '../types';
import { SocialShareModal, ShareContentData } from './SocialShareModal';

export const ChallengesView: React.FC = () => {
  const { 
    currentUser, 
    competitions, 
    pitchIdeas, 
    submitPitchIdea, 
    upvotePitchIdea, 
    addCommunityComment, 
    addMentorFeedback 
  } = useApp();

  // Active view tab within challenges
  const [activeTab, setActiveTab] = useState<'competitions' | 'showcase' | 'submit' | 'mentorship'>('competitions');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPitch, setSelectedPitch] = useState<PitchIdea | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareData, setShareData] = useState<ShareContentData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Pitch submission form state
  const [formData, setFormData] = useState({
    competitionId: competitions[0]?.id || 'comp-1',
    title: '',
    category: 'Kilimo & Mifugo' as ProjectCategory,
    problemStatement: '',
    solutionDescription: '',
    targetMarket: '',
    seedFundingRequired: 500000,
    teamMembers: '',
    pitchDeckUrl: '',
    videoDemoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  });
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Mentor feedback modal state
  const [mentorData, setMentorData] = useState({
    mentorName: currentUser.role === 'admin' ? currentUser.fullName : 'Mwl. Josephat Msemwa',
    mentorRole: currentUser.role === 'admin' ? 'Mratibu wa Miradi (Admin)' : 'Mwalimu Mkuu wa Biashara',
    innovation: 23,
    feasibility: 22,
    socialImpact: 24,
    financialViability: 21,
    comments: '',
    recommendation: 'Inapendekezwa kuelekea hatua ya fainali ya kitaifa.'
  });

  const categories = [
    'all',
    'Kilimo & Mifugo',
    'Huduma za Chakula & Canteen',
    'Teknolojia & Uchapaji',
    'Sanaa & Mavazi ya Shule',
    'Nishati Safi & Mazingira'
  ];

  const filteredPitches = pitchIdeas.filter(pitch => {
    if (selectedCategory === 'all') return true;
    return pitch.category === selectedCategory;
  });

  const myPitches = pitchIdeas.filter(p => p.studentId === currentUser.id);

  const handleSubmitPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.problemStatement || !formData.solutionDescription) {
      alert('Tafadhali jaza taarifa zote muhimu za wazo lako la mradi.');
      return;
    }

    const membersArray = formData.teamMembers
      ? formData.teamMembers.split(',').map(m => m.trim()).filter(Boolean)
      : [currentUser.fullName];

    const res = submitPitchIdea({
      competitionId: formData.competitionId,
      title: formData.title,
      category: formData.category,
      problemStatement: formData.problemStatement,
      solutionDescription: formData.solutionDescription,
      targetMarket: formData.targetMarket,
      seedFundingRequired: Number(formData.seedFundingRequired),
      teamMembers: membersArray,
      pitchDeckUrl: formData.pitchDeckUrl,
      videoDemoUrl: formData.videoDemoUrl,
      imageUrl: formData.imageUrl
    });

    if (res.success) {
      setSubmitSuccess(res.message);
      setFormData({
        competitionId: competitions[0]?.id || 'comp-1',
        title: '',
        category: 'Kilimo & Mifugo',
        problemStatement: '',
        solutionDescription: '',
        targetMarket: '',
        seedFundingRequired: 500000,
        teamMembers: '',
        pitchDeckUrl: '',
        videoDemoUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
      });
      setTimeout(() => {
        setSubmitSuccess(null);
        setActiveTab('showcase');
      }, 2000);
    }
  };

  const handleAddComment = (pitchId: string) => {
    if (!commentInput.trim()) return;
    addCommunityComment(pitchId, commentInput);
    setCommentInput('');
    // Refresh selected pitch view
    const updated = pitchIdeas.find(p => p.id === pitchId);
    if (updated) setSelectedPitch(updated);
  };

  const handleOpenShare = (pitch: PitchIdea) => {
    setShareData({
      title: pitch.title,
      categoryName: pitch.category,
      subtitle: `Mradi wa ${pitch.studentName} (${pitch.schoolName})`,
      badgeText: 'Wazo la Ujasiriamali',
      highlightText: `${pitch.upvotesCount} Kura za Wanafunzi`,
      type: 'pitch',
      verificationCode: `PITCH-${pitch.id.substring(pitch.id.length - 4).toUpperCase()}`
    });
    setIsShareModalOpen(true);
  };

  const handleSaveMentorFeedback = () => {
    if (!selectedPitch) return;
    const total = 
      Number(mentorData.innovation) + 
      Number(mentorData.feasibility) + 
      Number(mentorData.socialImpact) + 
      Number(mentorData.financialViability);

    const feedback: MentorFeedback = {
      mentorName: mentorData.mentorName,
      mentorRole: mentorData.mentorRole,
      date: new Date().toISOString().split('T')[0],
      scores: {
        innovation: Number(mentorData.innovation),
        feasibility: Number(mentorData.feasibility),
        socialImpact: Number(mentorData.socialImpact),
        financialViability: Number(mentorData.financialViability),
        total
      },
      comments: mentorData.comments || 'Ubunifu mzuri na wenye tija kwa wanafunzi.',
      recommendation: mentorData.recommendation
    };

    addMentorFeedback(selectedPitch.id, feedback);
    setIsMentorModalOpen(false);
    
    // Refresh local selected pitch
    const updated = pitchIdeas.find(p => p.id === selectedPitch.id);
    if (updated) setSelectedPitch({ ...updated, mentorFeedback: feedback });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/30">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>Mashindano ya Ujasiriamali ya Wanafunzi 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Wasilisha Wazo Lako, Pata Ushauri, na Shinda Mtaji wa Kuanzia
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-3 leading-relaxed">
            Mfumo rasmi unaowawezesha wanafunzi kuleta suluhisho bunifu za kibiashara shuleni, kutathminiwa kwa vigezo vya kitaalamu (Rubric), kupata ushauri kutoka kwa walimu, na kushiriki kwenye maonyesho ya jamii.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveTab('submit')}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Wasilisha Wazo la Mradi (Pitch)</span>
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Tazama Maonyesho ya Miradi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'competitions', label: 'Mashindano & Vigezo (Rubric)', icon: Trophy },
          { id: 'showcase', label: 'Maonyesho ya Miradi ya Jamii', icon: Users, count: pitchIdeas.length },
          { id: 'mentorship', label: 'Ushauri wa Walimu & Wataalamu', icon: Star },
          { id: 'submit', label: 'Wasilisha Wazo Jipya', icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white text-emerald-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: COMPETITIONS & EVALUATION RUBRIC */}
      {activeTab === 'competitions' && (
        <div className="space-y-8">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Competition Card Header */}
              <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-900">
                <img
                  src={comp.bannerUrl}
                  alt={comp.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider inline-block mb-2">
                    {comp.badge}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white">{comp.title}</h2>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1 flex items-center gap-2">
                    <span>Mratibu: {comp.organizer}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Mwisho wa Maombi: {comp.deadline}
                    </span>
                  </p>
                </div>
              </div>

              {/* Competition Content Grid */}
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Description & Prize Pool */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-base font-extrabold text-slate-900">Kuhusu Shindano Hili</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {comp.description}
                    </p>
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-800 font-bold block">Jumla ya Mtaji wa Zawadi (Seed Fund Pool):</span>
                        <span className="text-2xl font-black text-emerald-950">{formatTZS(comp.totalPrizePool)}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('submit')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        Shiriki Sasa
                      </button>
                    </div>
                  </div>

                  {/* Prizes breakdown */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Zawadi za Washindi
                    </h4>
                    <div className="space-y-2.5">
                      {comp.prizes.map((pz, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{pz.position}</span>
                            <span className="text-xs font-black text-emerald-700">{pz.prize}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{pz.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vigezo vya Kutathmini Miradi (Official Evaluation Rubric - 100%) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Vigezo Rasmi vya Tathmini (Evaluation Rubric - 100%)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kila mradi unapimwa na jopo la walimu na wataalamu kulingana na vigezo vinne vifuatavyo:
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Jumla: Alama 100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comp.evaluationRubric.map((rubric, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400">Kipengele 0{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                            {rubric.percentage}%
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mb-1">{rubric.criterion}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{rubric.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Jinsi Washindi Wanavyochaguliwa */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        Jinsi ya Kuchagua Washindi (Selection Mechanism)
                      </span>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                        Alama za mwisho zinajumuisha: <strong>70% Tathmini ya Majaji na Walimu Wataalamu</strong> kulingana na Rubric + <strong>30% Kura na Maoni ya Jamii ya Shule (Showcase Upvotes)</strong>. Mchanganyiko huu unahakikisha wazo lina ubora wa kiufundi na uhitaji wa kweli shuleni.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('showcase')}
                      className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs shrink-0 hover:bg-slate-100 transition-colors"
                    >
                      Piga Kura Miradi ya Wanafunzi
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: COMMUNITY SHOWCASE & UPVOTING */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                Sekta:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Miradi Yote' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('submit')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Wasilisha Wazo Lako</span>
            </button>
          </div>

          {/* Pitches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPitches.map((pitch) => {
              const hasUpvoted = pitch.upvotedBy.includes(currentUser.id);
              const score = pitch.mentorFeedback?.scores.total;

              return (
                <div
                  key={pitch.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Pitch Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={pitch.imageUrl}
                      alt={pitch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[11px]">
                        {pitch.category}
                      </span>
                    </div>
                    {pitch.status === 'finalist' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm">
                          <Trophy className="w-3 h-3" />
                          Fainali
                        </span>
                      </div>
                    )}
                    {pitch.status === 'mentored' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          Kaguzi ya Mwalimu
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-bold text-slate-800">{pitch.studentName}</span>
                        <span>•</span>
                        <span className="truncate">{pitch.schoolName}</span>
                      </div>
                      <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2">
                        {pitch.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {pitch.solutionDescription}
                      </p>
                    </div>

                    {/* Seed Funding & Score */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Mtaji Unaohitajika:</span>
                        <span className="font-extrabold text-emerald-700">
                          {formatTZS(pitch.seedFundingRequired)}
                        </span>
                      </div>

                      {score && (
                        <div className="flex items-center justify-between text-xs bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                          <span className="text-emerald-800 font-bold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            Alama za Majaji:
                          </span>
                          <span className="font-black text-emerald-950">{score} / 100</span>
                        </div>
                      )}

                      {/* Interactive Action buttons */}
                      <div className="flex items-center justify-between pt-1">
                        {/* Upvote button */}
                        <button
                          onClick={() => upvotePitchIdea(pitch.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            hasUpvoted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'text-emerald-700 fill-emerald-600' : ''}`} />
                          <span>{pitch.upvotesCount} Kura</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* Share button */}
                          <button
                            onClick={() => handleOpenShare(pitch)}
                            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Shiriki kwenye mitandao"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          {/* Detail button */}
                          <button
                            onClick={() => {
                              setSelectedPitch(pitch);
                              setIsDetailModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <span>Tazama</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: MENTORSHIP & EXPERT REVIEWS */}
      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  Jopo la Ushauri wa Walimu na Wataalamu (Mentorship Hub)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Kila mwanafunzi anayewasilisha wazo anapokea mrejesho wa kina, alama za vigezo 4 (Rubric), na ushauri wa kuboresha mradi kabla ya kuingia kwenye fainali.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shrink-0 shadow-xs"
              >
                Omba Ushauri kwa Wazo Jipya
              </button>
            </div>
          </div>

          {/* Mentored Pitches Feed */}
          <div className="space-y-4">
            {pitchIdeas.filter(p => p.mentorFeedback).map((pitch) => {
              const fb = pitch.mentorFeedback!;
              return (
                <div key={pitch.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          {pitch.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600 font-semibold">{pitch.studentName} ({pitch.schoolName})</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-1">{pitch.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Jumla ya Alama</span>
                        <span className="text-xl font-black text-emerald-700">{fb.scores.total} / 100</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPitch(pitch);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                      >
                        Fungua Mradi
                      </button>
                    </div>
                  </div>

                  {/* Rubric Score Breakdown Bars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Ubunifu (25%):</span>
                      <span className="text-sm font-black text-slate-800">{fb.scores.innovation} / 25</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(fb.scores.innovation / 25) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Utekelezaji (25%):</span>
                      <span className="text-sm font-black text-slate-800">{fb.scores.feasibility} / 25</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: `${(fb.scores.feasibility / 25) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Athari Jamii (25%):</span>
                      <span className="text-sm font-black text-slate-800">{fb.scores.socialImpact} / 25</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-sky-600 rounded-full" style={{ width: `${(fb.scores.socialImpact / 25) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Uendelevu (25%):</span>
                      <span className="text-sm font-black text-slate-800">{fb.scores.financialViability} / 25</span>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: `${(fb.scores.financialViability / 25) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Mentor Comments Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-950 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        Ushauri Kutoka kwa: {fb.mentorName} ({fb.mentorRole})
                      </span>
                      <span className="text-[10px] text-emerald-700">{fb.date}</span>
                    </div>
                    <p className="text-slate-700 italic">"{fb.comments}"</p>
                    <p className="font-bold text-emerald-900 pt-1">
                      Mapendekezo Rasmi: <span className="font-normal text-slate-800">{fb.recommendation}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: SUBMIT NEW PITCH */}
      {activeTab === 'submit' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <Send className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Wasilisha Wazo Lako la Ujasiriamali</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Jaza taarifa za mradi wako ili uingie kwenye shindano la StudentVentures 2026 na upate ushauri kutoka kwa walimu na wataalamu.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitPitch} className="space-y-5">
            {/* Competition selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Chagua Shindano:
              </label>
              <select
                value={formData.competitionId}
                onChange={(e) => setFormData({ ...formData, competitionId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
              >
                {competitions.map(c => (
                  <option key={c.id} value={c.id}>{c.title} (Zawadi: {formatTZS(c.totalPrizePool)})</option>
                ))}
              </select>
            </div>

            {/* Project Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Jina la Mradi au Wazo: *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Mfano: Eco-Briquettes: Mkaa Mbadala Kutokana na Mabaki ya Mazao"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Category & Seed Fund Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Sekta ya Mradi: *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                >
                  {categories.filter(c => c !== 'all').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Mtaji Unaohitajika (TZS): *
                </label>
                <input
                  type="number"
                  required
                  min={50000}
                  step={10000}
                  value={formData.seedFundingRequired}
                  onChange={(e) => setFormData({ ...formData, seedFundingRequired: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Tatizo Linalotatuliwa (Problem Statement): *
              </label>
              <textarea
                required
                rows={3}
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="Eleza changamoto au shida unayoiona shuleni au mtaani inayowakabili wanafunzi na jamii..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Solution Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Suluhisho la Mradi Wako (Proposed Solution): *
              </label>
              <textarea
                required
                rows={3}
                value={formData.solutionDescription}
                onChange={(e) => setFormData({ ...formData, solutionDescription: e.target.value })}
                placeholder="Eleza jinsi bidhaa au huduma yako itakavyofanya kazi na kwanini ni bora kuliko zilizopo..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Target Market & Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Soko Lengwa (Target Market):
                </label>
                <input
                  type="text"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="K.m. Wanafunzi wa bweni 800, canteens na walimu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Wanachama wa Timu (Tenganisha kwa koma):
                </label>
                <input
                  type="text"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                  placeholder="K.m. Baraka Juma, Neema Emmanuel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Pitch Deck / Video Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Kiungo cha Pitch Deck (Google Slides / PDF link):
                </label>
                <input
                  type="url"
                  value={formData.pitchDeckUrl}
                  onChange={(e) => setFormData({ ...formData, pitchDeckUrl: e.target.value })}
                  placeholder="https://docs.google.com/presentation/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Kiungo cha Video ya Maelezo (YouTube / Drive):
                </label>
                <input
                  type="url"
                  value={formData.videoDemoUrl}
                  onChange={(e) => setFormData({ ...formData, videoDemoUrl: e.target.value })}
                  placeholder="https://youtu.be/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Wasilisha Wazo Lako Kwenye Shindano</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL: PITCH DETAILS & COMMUNITY COMMENTS */}
      {isDetailModalOpen && selectedPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="relative h-48 bg-slate-900">
              <img
                src={selectedPitch.imageUrl}
                alt={selectedPitch.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase inline-block mb-1">
                  {selectedPitch.category}
                </span>
                <h2 className="text-xl font-black text-white">{selectedPitch.title}</h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Iliwasilishwa na: {selectedPitch.studentName} ({selectedPitch.schoolName})
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Problem & Solution */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">
                    Tatizo Linalotatuliwa:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedPitch.problemStatement}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wider block mb-1">
                    Suluhisho la Mradi:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedPitch.solutionDescription}</p>
                </div>
              </div>

              {/* Seed funding, market & team */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Mtaji Unaohitajika</span>
                  <span className="text-sm font-black text-emerald-700">{formatTZS(selectedPitch.seedFundingRequired)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Kura za Jamii</span>
                  <span className="text-sm font-black text-slate-900">{selectedPitch.upvotesCount} Wanafunzi</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block font-bold">Timu ya Wanafunzi</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {selectedPitch.teamMembers.join(', ')}
                  </span>
                </div>
              </div>

              {/* Mentor Feedback Section if available */}
              {selectedPitch.mentorFeedback && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                      Tathmini ya Mtaalamu ({selectedPitch.mentorFeedback.scores.total}/100)
                    </span>
                    <span className="text-[10px] text-amber-800">{selectedPitch.mentorFeedback.mentorName}</span>
                  </div>
                  <p className="text-xs text-slate-700 italic">"{selectedPitch.mentorFeedback.comments}"</p>
                </div>
              )}

              {/* Admin / Teacher action to give mentorship */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-600 font-medium">Je, wewe ni mwalimu au mtaalamu mshauri?</span>
                <button
                  onClick={() => setIsMentorModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Toa Ushauri & Alama (Rubric)
                </button>
              </div>

              {/* Community Comments Section */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Maoni ya Jamii ya Shule ({selectedPitch.communityComments.length})
                </h4>

                {/* Add comment box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Andika maoni yako au swali kuhusu mradi huu..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(selectedPitch.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(selectedPitch.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
                  >
                    Tuma
                  </button>
                </div>

                {/* Comments list */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedPitch.communityComments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Bado hakuna maoni. Kuwa wa kwanza kuacha maoni!</p>
                  ) : (
                    selectedPitch.communityComments.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{c.studentName} ({c.schoolName})</span>
                          <span className="text-slate-400 text-[10px]">{c.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => handleOpenShare(selectedPitch)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Shiriki Mradi Huu</span>
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
              >
                Funga
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: MENTOR EVALUATION & RUBRIC SCORING */}
      {isMentorModalOpen && selectedPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Tathmini ya Mshauri / Mwalimu</h3>
                <p className="text-xs text-slate-500">Mradi: {selectedPitch.title}</p>
              </div>
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Jina la Mshauri:</label>
                  <input
                    type="text"
                    value={mentorData.mentorName}
                    onChange={(e) => setMentorData({ ...mentorData, mentorName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nafasi / Cheo:</label>
                  <input
                    type="text"
                    value={mentorData.mentorRole}
                    onChange={(e) => setMentorData({ ...mentorData, mentorRole: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* 4 Rubric Criteria */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">Alama za Vigezo vya Rubric (Kila moja /25):</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block">Ubunifu (Innovation):</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={mentorData.innovation}
                      onChange={(e) => setMentorData({ ...mentorData, innovation: Number(e.target.value) })}
                      className="w-full px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Utekelezaji (Feasibility):</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={mentorData.feasibility}
                      onChange={(e) => setMentorData({ ...mentorData, feasibility: Number(e.target.value) })}
                      className="w-full px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Athari kwa Jamii (Impact):</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={mentorData.socialImpact}
                      onChange={(e) => setMentorData({ ...mentorData, socialImpact: Number(e.target.value) })}
                      className="w-full px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Uendelevu (Viability):</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={mentorData.financialViability}
                      onChange={(e) => setMentorData({ ...mentorData, financialViability: Number(e.target.value) })}
                      className="w-full px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs font-black text-emerald-800">
                  <span>Jumla ya Alama:</span>
                  <span>
                    {Number(mentorData.innovation) + Number(mentorData.feasibility) + Number(mentorData.socialImpact) + Number(mentorData.financialViability)} / 100
                  </span>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Maoni na Ushauri wa Kiufundi:</label>
                <textarea
                  rows={3}
                  value={mentorData.comments}
                  onChange={(e) => setMentorData({ ...mentorData, comments: e.target.value })}
                  placeholder="Toa ushauri kuhusu changamoto na jinsi ya kuboresha mfumo wa uendeshaji..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              {/* Recommendation */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mapendekezo ya Hatua:</label>
                <select
                  value={mentorData.recommendation}
                  onChange={(e) => setMentorData({ ...mentorData, recommendation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                >
                  <option value="Inapendekezwa kuelekea hatua ya fainali ya kitaifa.">Inapendekezwa kuelekea fainali ya kitaifa</option>
                  <option value="Inahitaji maboresho madogo kabla ya ufadhili.">Inahitaji maboresho madogo</option>
                  <option value="Inafaa kuanza majaribio ya MVP shuleni.">Inafaa kuanza majaribio ya MVP shuleni</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Ghairi
              </button>
              <button
                onClick={handleSaveMentorFeedback}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Hifadhi Tathmini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />

    </div>
  );
};
