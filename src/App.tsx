import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ProjectsView } from './components/ProjectsView';
import { MyInvestmentsView } from './components/MyInvestmentsView';
import { FinancialReportsView } from './components/FinancialReportsView';
import { SecurityView } from './components/SecurityView';
import { AdminPortal } from './components/AdminPortal';
import { ChallengesView } from './components/ChallengesView';
import { SocialGroupsView } from './components/SocialGroupsView';
import { AcademyView } from './components/AcademyView';
import { WalletModal } from './components/WalletModal';
import { InvestModal } from './components/InvestModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AuthModal } from './components/AuthModal';
import { LockScreenModal } from './components/LockScreenModal';
import { AuthGateway } from './components/AuthGateway';
import { InvestmentProject } from './types';
import { GraduationCap, ShieldCheck, AlertTriangle, Clock, School, Megaphone } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    portalMode, 
    isLoggedIn,
    isScreenLocked,
    systemSecurity 
  } = useApp();

  // Modal states
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletDefaultMode, setWalletDefaultMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<InvestmentProject | null>(null);

  const handleOpenWallet = (mode: 'deposit' | 'withdraw' = 'deposit') => {
    setWalletDefaultMode(mode);
    setWalletModalOpen(true);
  };

  const handleSelectProject = (project: InvestmentProject) => {
    setActiveProject(project);
    setDetailModalOpen(true);
  };

  const handleInvestProject = (project: InvestmentProject) => {
    setActiveProject(project);
    setInvestModalOpen(true);
  };

  // If user is not logged in, show the comprehensive Auth Gateway
  if (!isLoggedIn) {
    return <AuthGateway />;
  }

  return (
    <>
      {/* 1. If Portal Mode is ADMIN, render the dedicated Standalone Admin Portal */}
      {portalMode === 'admin' ? (
        <AdminPortal />
      ) : (
        /* 2. Otherwise render the Student Portal */
        <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-8">
          
          {/* Emergency System Freeze Banner in Student Portal */}
          {systemSecurity.isSystemFrozen && (
            <div className="bg-rose-600 text-white px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
              <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
              <span>
                <strong>TAHADHARI YA KIUSALAMA:</strong> Mfumo wa fedha umesimamishwa kwa muda na msimamizi ({systemSecurity.freezeReason}). Miamala imesitishwa kwa sasa.
              </span>
            </div>
          )}

          {/* Official Broadcast Announcement Banner */}
          {systemSecurity.announcementNotice && (
            <div className="bg-indigo-700 text-white px-4 py-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-md border-b border-indigo-800">
              <Megaphone className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
              <span>
                <strong>TANGAZO LA SHULE:</strong> {systemSecurity.announcementNotice}
              </span>
            </div>
          )}

          {/* Pending Approval Notification Banner */}
          {currentUser.status === 'pending_approval' && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-3 shadow-md border-b border-amber-600">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-black/10 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-slate-950 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black">
                      Akaunti Yako ya Mwanafunzi Inasubiri Uidhinishaji wa Mwalimu Mkuu / Admin
                    </p>
                    <p className="text-[11px] text-slate-900/90">
                      Habari <strong>{currentUser.fullName}</strong> ({currentUser.courseOrClass}, {currentUser.schoolName}). Usajili wako umepokelewa na unakaguliwa. Miamala ya fedha itawezeshwa mara baada ya uidhinishaji kukamilika.
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-mono font-bold bg-black/20 text-slate-950 px-2.5 py-1 rounded-full">
                  Hali: Inasubiri Ukaguzi
                </span>
              </div>
            </div>
          )}

          {/* Navigation - Note: Admin button is NOT shown to students */}
          <Navigation
            onOpenWallet={handleOpenWallet}
            onOpenAuth={() => setAuthModalOpen(true)}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
            {activeTab === 'dashboard' && (
              <Dashboard
                onOpenWallet={handleOpenWallet}
                onSelectProject={handleSelectProject}
                onInvestProject={handleInvestProject}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsView
                onSelectProject={handleSelectProject}
                onInvestProject={handleInvestProject}
              />
            )}

            {activeTab === 'challenges' && (
              <ChallengesView />
            )}

            {activeTab === 'social' && (
              <SocialGroupsView />
            )}

            {activeTab === 'academy' && (
              <AcademyView />
            )}

            {activeTab === 'investments' && (
              <MyInvestmentsView
                onNavigateProjects={() => setActiveTab('projects')}
              />
            )}

            {activeTab === 'reports' && (
              <FinancialReportsView />
            )}

            {activeTab === 'security' && (
              <SecurityView />
            )}
          </main>

          {/* Modals */}
          <WalletModal
            isOpen={walletModalOpen}
            onClose={() => setWalletModalOpen(false)}
            defaultMode={walletDefaultMode}
          />

          <InvestModal
            project={activeProject}
            isOpen={investModalOpen}
            onClose={() => setInvestModalOpen(false)}
            onOpenWallet={() => handleOpenWallet('deposit')}
          />

          <ProjectDetailModal
            project={activeProject}
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            onInvest={handleInvestProject}
          />

          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />

          {/* Footer - Strictly free of admin entry paths */}
          <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  SV
                </div>
                <span className="font-bold text-slate-800 font-['Outfit',sans-serif]">
                  StudentVentures &copy; {new Date().getFullYear()}
                </span>
                <span>•</span>
                <span>Mfumo Salama wa Uwekezaji wa Wanafunzi wa Sekondari</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Taarifa Zote za Kifedha Zinalindwa & Ukaguzi wa Mwalimu
                </span>
                <span>•</span>
                <span className="text-slate-400 font-medium">
                  Kidato cha 1 hadi cha 6
                </span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Global Security Modals */}
      {/* 1. Screen Lock Overlay Modal */}
      {isScreenLocked && <LockScreenModal />}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
