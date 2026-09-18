import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  FileText, 
  Download, 
  Share2, 
  Sparkles, 
  GraduationCap, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Clock,
  Video
} from 'lucide-react';
import { AcademyModule, AcademyResource, QuizQuestion, QuizResult } from '../types';
import { INITIAL_ACADEMY_MODULES, INITIAL_RESOURCES } from '../data/challengesAndEducationData';
import { SocialShareModal, ShareContentData } from './SocialShareModal';

export const AcademyView: React.FC = () => {
  const { 
    currentUser, 
    quizResults, 
    saveQuizResult 
  } = useApp();

  const academyModules: AcademyModule[] = INITIAL_ACADEMY_MODULES;
  const academyResources: AcademyResource[] = INITIAL_RESOURCES;

  // Internal Navigation
  const [activeTab, setActiveTab] = useState<'modules' | 'resources' | 'certificates'>('modules');
  
  // Selected Module & Lesson State
  const [selectedModule, setSelectedModule] = useState<AcademyModule | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isTakingQuiz, setIsTakingQuiz] = useState<boolean>(false);
  
  // Quiz runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);

  // Resource viewer modals
  const [selectedArticle, setSelectedArticle] = useState<AcademyResource | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<AcademyResource | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Share modal state
  const [shareData, setShareData] = useState<ShareContentData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Resource filters
  const [resourceFilter, setResourceFilter] = useState<'all' | 'article' | 'video' | 'guide'>('all');

  const filteredResources = academyResources.filter((r: AcademyResource) => {
    if (resourceFilter === 'all') return true;
    return r.type === resourceFilter;
  });

  // Start reading module
  const handleOpenModule = (mod: AcademyModule) => {
    setSelectedModule(mod);
    setActiveLessonIndex(0);
    setIsTakingQuiz(false);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  // Start quiz
  const handleStartQuiz = () => {
    setIsTakingQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Submit quiz
  const handleSubmitQuiz = (mod: AcademyModule) => {
    let correctCount = 0;
    mod.quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const total = mod.quiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passingRequired = mod.quiz.passingScorePercentage || 75;
    const passed = percentage >= passingRequired;

    const result = {
      score: correctCount,
      percentage,
      passed
    };

    setQuizScore(result);
    setQuizSubmitted(true);

    // Save to AppContext state and localStorage
    const certId = `SV-CERT-${mod.id.toUpperCase()}-${currentUser.studentRegNo.replace(/[^A-Z0-9]/gi, '')}`;
    const quizResultObj: QuizResult = {
      id: `qres-${Date.now()}`,
      moduleId: mod.id,
      score: correctCount,
      totalQuestions: total,
      percentage,
      passed,
      completedAt: new Date().toISOString().split('T')[0],
      completionDate: new Date().toLocaleDateString('sw-TZ'),
      certificateId: certId
    };
    saveQuizResult(quizResultObj);
  };

  const handleShareCertificate = (modTitle: string, certId: string) => {
    setShareData({
      title: 'Cheti cha Umahiri wa Kifedha',
      categoryName: modTitle,
      subtitle: `Kimetunukiwa ${currentUser.fullName} (${currentUser.schoolName})`,
      badgeText: 'Cheti Kilichothibitishwa',
      metricLabel: 'Ufaulu wa Mtihani',
      metricValue: '100% Ufaulu',
      highlightText: 'StudentVentures Financial Academy',
      type: 'certificate',
      verificationCode: certId
    });
    setIsShareModalOpen(true);
  };

  const handleSimulateDownload = (title: string) => {
    setDownloadNotice(`Mwongozo wa "${title}" unapakuliwa kwenye kifaa chako...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-700/30">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Chuo cha Elimu ya Fedha & Ujasiriamali cha Wanafunzi (StudentVentures Academy)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Jifunze Uwekezaji, Pima Uelewa Wako, na Pata Vyeti vya Kidijitali
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Moduli shirikishi zenye masomo mafupi, mifano halisi ya shule za Tanzania, mitihani ya kujipima (Quizzes), na maktaba ya vitabu na video za kukuza stadi zako za kibiashara.
          </p>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>{downloadNotice}</span>
          </div>
          <span className="text-[11px] text-emerald-700">Imekamilika ✓</span>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'modules', label: 'Moduli za Masomo', icon: BookOpen, count: academyModules.length },
          { id: 'resources', label: 'Maktaba ya Rasilimali & Video', icon: FileText, count: academyResources.length },
          { id: 'certificates', label: 'Vyeti Vyangu vya Kidijitali', icon: Award, count: quizResults.filter(q => q.passed).length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedModule(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-emerald-950' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MODULES LIST OR ACTIVE LESSON READER */}
      {activeTab === 'modules' && (
        <>
          {!selectedModule ? (
            /* Modules Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academyModules.map((mod) => {
                const result = quizResults.find(q => q.moduleId === mod.id && q.passed);

                return (
                  <div
                    key={mod.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-200">
                          {mod.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {mod.durationMinutes} Dakika
                          </span>
                          <span>•</span>
                          <span className="capitalize">{mod.level}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {mod.description}
                      </p>

                      {/* Lessons pill count */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>{mod.lessons.length} Masomo ya Vitendo</span>
                        <span>•</span>
                        <span>Mtihani wa Maswali {mod.quiz.questions.length}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      {result ? (
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Umehitimu! (Cheti Kipo)</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Hujafanya mtihani</span>
                      )}

                      <button
                        onClick={() => handleOpenModule(mod)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <span>{result ? 'Soma Tena / Cheti' : 'Anza Kujifunza'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Active Module Workspace (Lesson & Quiz) */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
              
              {/* Workspace Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Rudi Kwenye Moduli Zote</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTakingQuiz(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      !isTakingQuiz ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Masomo ({selectedModule.lessons.length})
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isTakingQuiz ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Mtihani & Cheti</span>
                  </button>
                </div>
              </div>

              {/* View: Lesson Reading or Quiz */}
              {!isTakingQuiz ? (
                <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
                  {/* Lesson Selector Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                    {selectedModule.lessons.map((lesson, idx) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                          activeLessonIndex === idx
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Somo {idx + 1}: {lesson.title.split(':')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Active Lesson Content */}
                  {selectedModule.lessons[activeLessonIndex] && (
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                          Somo {activeLessonIndex + 1} kati ya {selectedModule.lessons.length}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900">
                          {selectedModule.lessons[activeLessonIndex].title}
                        </h2>
                      </div>

                      <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        {selectedModule.lessons[activeLessonIndex].content}
                      </div>

                      {/* Key Takeaways Card */}
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Mambo Muhimu ya Kuzingatia (Key Takeaways):
                        </h4>
                        <ul className="space-y-1.5">
                          {selectedModule.lessons[activeLessonIndex].keyTakeaways.map((point, idx) => (
                            <li key={idx} className="text-xs text-emerald-900 flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                          disabled={activeLessonIndex === 0}
                          onClick={() => setActiveLessonIndex(activeLessonIndex - 1)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40"
                        >
                          Somo Lililopita
                        </button>

                        {activeLessonIndex < selectedModule.lessons.length - 1 ? (
                          <button
                            onClick={() => setActiveLessonIndex(activeLessonIndex + 1)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                          >
                            <span>Somo Linalofuata</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleStartQuiz}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Award className="w-4 h-4" />
                            <span>Kamilisha & Anza Mtihani wa Cheti</span>
                          </button>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                /* Interactive Quiz View */
                <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{selectedModule.quiz.title || `Mtihani wa Moduli: ${selectedModule.title}`}</h2>
                      <p className="text-xs text-slate-500">
                        Kiwango cha Ufaulu: {selectedModule.quiz.passingScorePercentage || 75}% ili kupata Cheti Rasmi
                      </p>
                    </div>
                    {quizSubmitted && (
                      <button
                        onClick={handleStartQuiz}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Fanya Tena</span>
                      </button>
                    )}
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6">
                    {selectedModule.quiz.questions.map((q, qIdx) => {
                      const userAns = selectedAnswers[qIdx];
                      const isCorrect = userAns === q.correctOptionIndex;

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : 'bg-rose-50/70 border-rose-300'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="text-sm font-black text-slate-900">
                              Swali {qIdx + 1}: {q.question}
                            </h3>
                            {quizSubmitted && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                              }`}>
                                {isCorrect ? 'Sahihi ✓' : 'Sio Sahihi ✕'}
                              </span>
                            )}
                          </div>

                          {/* Options */}
                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                                  userAns === optIdx
                                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${qIdx}`}
                                  checked={userAns === optIdx}
                                  disabled={quizSubmitted}
                                  onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>

                          {/* Explanation after submission */}
                          {quizSubmitted && (
                            <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-700">
                              <span className="font-bold text-slate-900">Ufafanuzi: </span>
                              <span>{q.explanation}</span>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Results Bar */}
                  {!quizSubmitted ? (
                    <button
                      onClick={() => handleSubmitQuiz(selectedModule)}
                      disabled={Object.keys(selectedAnswers).length < selectedModule.quiz.questions.length}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kamilisha & Angalia Matokeo ya Mtihani</span>
                    </button>
                  ) : (
                    quizScore && (
                      <div className={`p-6 rounded-3xl border space-y-4 ${
                        quizScore.passed
                          ? 'bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-emerald-500'
                          : 'bg-slate-900 text-white border-slate-700'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                              Matokeo Yako ya Mtihani:
                            </span>
                            <h3 className="text-2xl font-black mt-0.5">
                              {quizScore.passed ? 'Hongera Sana! Umehitimu!' : 'Jaribu Tena Kujifunza!'}
                            </h3>
                            <p className="text-xs text-slate-300 mt-1">
                              Umepata alama <strong>{quizScore.score}</strong> kati ya <strong>{selectedModule.quiz.questions.length}</strong> ({quizScore.percentage}%).
                            </p>
                          </div>

                          {quizScore.passed ? (
                            <button
                              onClick={() => handleShareCertificate(selectedModule.title, `CERT-${selectedModule.id.toUpperCase()}-${currentUser.studentRegNo.replace(/[^A-Z0-9]/gi, '')}`)}
                              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shrink-0 shadow-md transition-transform hover:scale-105"
                            >
                              <Award className="w-4 h-4" />
                              <span>Pakua & Shiriki Cheti Chako</span>
                            </button>
                          ) : (
                            <button
                              onClick={handleStartQuiz}
                              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shrink-0"
                            >
                              Rudia Mtihani
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )}
        </>
      )}

      {/* TAB 2: RESOURCE LIBRARY (Articles, Videos, Guides) */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 pr-2">Aina ya Rasilimali:</span>
            {[
              { id: 'all', label: 'Zote' },
              { id: 'article', label: 'Makala ya Kusoma' },
              { id: 'video', label: 'Video za Mafunzo' },
              { id: 'guide', label: 'Miongozo ya Kupakua (PDF)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setResourceFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  resourceFilter === f.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res: AcademyResource) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={res.imageUrl || res.thumbnailUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'}
                    alt={res.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                      {res.type === 'video' ? '🎥 Video' : res.type === 'guide' ? '📑 Mwongozo' : '📰 Makala'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                      {res.readOrWatchTime}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block mb-1">{res.category}</span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{res.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{res.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">StudentVentures Academy</span>
                    
                    {res.type === 'article' && (
                      <button
                        onClick={() => setSelectedArticle(res)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1"
                      >
                        <span>Soma Makala</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {res.type === 'video' && (
                      <button
                        onClick={() => setSelectedVideo(res)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Tazama Video</span>
                      </button>
                    )}

                    {res.type === 'guide' && (
                      <button
                        onClick={() => handleSimulateDownload(res.title)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Pakua Toolkit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: DIGITAL CERTIFICATES VAULT */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Vyeti Vyangu vya Kidijitali Vilivyothibitishwa (Digital Certificates)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vyeti hivi hutolewa baada ya mwanafunzi kufaulu mitihani ya moduli kwa alama 80%+ na vina namba rasmi ya uthibitisho inayoweza kuthibitishwa shuleni au na wafadhili.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizResults.filter(q => q.passed).map((res: QuizResult) => {
              const mod = academyModules.find((m: AcademyModule) => m.id === res.moduleId);
              const certId = res.certificateId || `SV-CERT-${res.moduleId.toUpperCase()}-${currentUser.studentRegNo.replace(/[^A-Z0-9]/gi, '')}`;
              const pct = res.percentage ?? Math.round((res.score / res.totalQuestions) * 100);
              const dateDisplay = res.completionDate || res.completedAt;

              return (
                <div
                  key={res.id || `${res.moduleId}-${res.completedAt}`}
                  className="rounded-3xl p-6 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white shadow-xl relative overflow-hidden border border-amber-400/40 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-amber-400" />
                      <span className="text-xs font-black tracking-wider text-amber-300 uppercase">
                        StudentVentures Academy Certificate
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] border border-amber-400/30">
                      RASMI ✓
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-emerald-200 block uppercase">Hati hii inathibitisha kuwa:</span>
                    <h3 className="text-xl font-black text-white mt-0.5">{currentUser.fullName}</h3>
                    <p className="text-xs text-emerald-300/80">{currentUser.schoolName} • Reg: {currentUser.studentRegNo}</p>
                  </div>

                  <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 text-xs">
                    <span className="text-[10px] text-emerald-200 block font-medium">Amefaulu na kuhitimu moduli ya:</span>
                    <h4 className="text-sm font-black text-white">{mod?.title || 'Mafunzo ya Ujasiriamali'}</h4>
                    <span className="text-[11px] text-amber-300 font-bold block mt-1">Ufaulu: {pct}% | Tarehe: {dateDisplay}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Uthibitisho: {certId}</span>
                    </div>
                    <button
                      onClick={() => handleShareCertificate(mod?.title || 'Ujasiriamali', certId)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Shiriki Mtandaoni</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {quizResults.filter(q => q.passed).length === 0 && (
              <div className="col-span-2 p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs space-y-2">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <p className="font-bold text-slate-700 text-sm">Bado Hujapata Cheti chochote.</p>
                <p>Kamilisha masomo ya moduli na fanya mtihani upate alama 80%+ ili kupata cheti chako rasmi!</p>
                <button
                  onClick={() => setActiveTab('modules')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs mt-2"
                >
                  Anza Moduli za Masomo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE READER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700">{selectedArticle.category}</span>
                <h3 className="text-base font-black text-slate-900">{selectedArticle.title}</h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedArticle.bodyContent || selectedArticle.content || selectedArticle.description}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Funga Makala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIDEO PLAYER SIMULATOR */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-950 text-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">{selectedVideo.category}</span>
                <h3 className="text-base font-black">{selectedVideo.title}</h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              <img
                src={selectedVideo.imageUrl || selectedVideo.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/40">
                <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
                <span className="text-xs font-bold text-white mt-3">Video ya Mafunzo ya Vitendo</span>
                <span className="text-[11px] text-emerald-300 font-mono mt-0.5">Muda: {selectedVideo.readOrWatchTime}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">StudentVentures Video Masterclass</span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs"
              >
                Funga Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Share Modal instance */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />

    </div>
  );
};
