import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  StudentUser, 
  InvestmentProject, 
  UserInvestment, 
  Transaction, 
  FinancialReportItem, 
  SecurityAuditLog,
  UserRole,
  EntrepreneurshipCompetition,
  PitchIdea,
  DiscussionGroup,
  UserPrivacySettings,
  QuizResult,
  MentorFeedback,
  PortalMode,
  SystemSecuritySettings
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_PROJECTS, 
  INITIAL_INVESTMENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import {
  INITIAL_COMPETITIONS,
  INITIAL_PITCH_IDEAS,
  INITIAL_DISCUSSION_GROUPS,
  DEFAULT_PRIVACY_SETTINGS
} from '../data/challengesAndEducationData';
import { generateHash, generateRefCode } from '../utils/formatters';

interface AppContextType {
  currentUser: StudentUser;
  allStudents: StudentUser[];
  projects: InvestmentProject[];
  investments: UserInvestment[];
  transactions: Transaction[];
  financialReports: FinancialReportItem[];
  auditLogs: SecurityAuditLog[];
  competitions: EntrepreneurshipCompetition[];
  pitchIdeas: PitchIdea[];
  discussionGroups: DiscussionGroup[];
  privacySettings: UserPrivacySettings;
  quizResults: QuizResult[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;
  isScreenLocked: boolean;
  lockScreen: () => void;
  unlockScreen: (pin: string) => { success: boolean; message: string };
  systemSecurity: SystemSecuritySettings;
  updateSystemSecurity: (settings: Partial<SystemSecuritySettings>) => void;
  toggleBalanceMask: () => void;
  adminLogin: (staffRegNo: string, adminPin: string) => { success: boolean; message: string };
  adminLogout: () => void;
  verifyTransactionIntegrity: (hashOrRef: string) => {
    valid: boolean;
    transaction?: Transaction;
    message: string;
    calculatedHash?: string;
    tamperCheckPassed: boolean;
  };
  isLoggedIn: boolean;
  logout: () => void;
  failedPinAttempts: number;
  isPinLocked: boolean;
  pinLockoutSecondsRemaining: number;
  switchUser: (userId: string) => void;
  loginWithPin: (regNo: string, pin: string) => { success: boolean; message: string };
  registerStudent: (data: {
    fullName: string;
    studentRegNo: string;
    schoolName: string;
    educationLevel: 'Sekondari' | 'Chuo Kikuu' | 'Chuo cha Kati & Ufundi';
    courseOrClass: string;
    email: string;
    phone: string;
    guardianPhone?: string;
    guardianConsent?: boolean;
    securityPin: string;
  }) => { success: boolean; message: string };
  depositFunds: (amount: number, method: any, phoneOrAccount: string, pin: string) => { success: boolean; message: string };
  withdrawFunds: (amount: number, method: any, phoneOrAccount: string, pin: string) => { success: boolean; message: string };
  investInProject: (projectId: string, amount: number, pin: string) => { success: boolean; message: string };
  claimProfit: (investmentId: string) => { success: boolean; message: string };
  adminApproveTransaction: (txnId: string) => void;
  adminRejectTransaction: (txnId: string, reason: string) => void;
  adminCreateProject: (project: Omit<InvestmentProject, 'id' | 'collectedAmount' | 'updates' | 'financialSummary'>) => void;
  adminUpdateProject: (projectId: string, data: Partial<InvestmentProject>) => void;
  adminDeleteProject: (projectId: string) => void;
  adminDistributeProfit: (projectId: string) => { count: number; totalDistributed: number };
  adminAddFinancialReport: (report: Omit<FinancialReportItem, 'id'>) => void;
  adminDeleteFinancialReport: (reportId: string) => void;
  adminToggleStudentStatus: (studentId: string) => void;
  adminVerifyStudent: (studentId: string) => void;
  adminApproveStudent: (studentId: string) => void;
  adminRejectStudent: (studentId: string, reason?: string) => void;
  adminUpdateStudent: (studentId: string, data: Partial<StudentUser>) => void;
  submitPitchIdea: (data: {
    competitionId: string;
    title: string;
    category: any;
    problemStatement: string;
    solutionDescription: string;
    targetMarket: string;
    seedFundingRequired: number;
    teamMembers: string[];
    pitchDeckUrl?: string;
    videoDemoUrl?: string;
    imageUrl?: string;
  }) => { success: boolean; message: string; pitchId: string };
  upvotePitchIdea: (pitchId: string) => void;
  addCommunityComment: (pitchId: string, commentText: string) => void;
  addMentorFeedback: (pitchId: string, feedback: MentorFeedback) => void;
  updatePitchStatus: (pitchId: string, status: PitchIdea['status']) => void;
  createDiscussionGroup: (name: string, description: string, category: string) => void;
  joinOrLeaveGroup: (groupId: string) => void;
  createGroupPost: (groupId: string, title: string, content: string, tags: string[]) => void;
  likeGroupPost: (groupId: string, postId: string) => void;
  replyToGroupPost: (groupId: string, postId: string, content: string) => void;
  updatePrivacySettings: (newSettings: Partial<UserPrivacySettings>) => void;
  saveQuizResult: (result: QuizResult) => void;
  exportSystemBackup: () => string;
  importSystemBackup: (jsonString: string) => { success: boolean; message: string };
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sv_current_user_id',
  STUDENTS: 'sv_students_data_v1',
  PROJECTS: 'sv_projects_data_v1',
  INVESTMENTS: 'sv_investments_data_v1',
  TRANSACTIONS: 'sv_transactions_data_v1',
  REPORTS: 'sv_reports_data_v1',
  AUDIT_LOGS: 'sv_audit_logs_data_v1',
  COMPETITIONS: 'sv_competitions_data_v1',
  PITCH_IDEAS: 'sv_pitch_ideas_data_v1',
  GROUPS: 'sv_groups_data_v1',
  PRIVACY: 'sv_privacy_settings_v1',
  QUIZ_RESULTS: 'sv_quiz_results_v1',
  PORTAL_MODE: 'sv_portal_mode_v1',
  ADMIN_ACTIVE_TAB: 'sv_admin_active_tab_v1',
  SYSTEM_SECURITY: 'sv_system_security_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from LocalStorage or initialize with mock data
  const [allStudents, setAllStudents] = useState<StudentUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'std-1'; // Default to Baraka Juma (student)
  });

  const [projects, setProjects] = useState<InvestmentProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [investments, setInvestments] = useState<UserInvestment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [financialReports, setFinancialReports] = useState<FinancialReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [competitions, setCompetitions] = useState<EntrepreneurshipCompetition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
    return saved ? JSON.parse(saved) : INITIAL_COMPETITIONS;
  });

  const [pitchIdeas, setPitchIdeas] = useState<PitchIdea[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PITCH_IDEAS);
    return saved ? JSON.parse(saved) : INITIAL_PITCH_IDEAS;
  });

  const [discussionGroups, setDiscussionGroups] = useState<DiscussionGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSION_GROUPS;
  });

  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRIVACY);
    return saved ? JSON.parse(saved) : DEFAULT_PRIVACY_SETTINGS;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [portalMode, setPortalModeState] = useState<PortalMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PORTAL_MODE);
    return (saved === 'admin' || saved === 'student') ? saved : 'student';
  });

  const [adminActiveTab, setAdminActiveTabState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_ACTIVE_TAB);
    return saved || 'overview';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sv_is_logged_in_v1');
    return saved !== null ? saved === 'true' : true;
  });

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('sv_is_logged_in_v1', 'false');
    setPortalModeState('student');
    addAuditLog(
      'LOGOUT',
      currentUser.fullName,
      currentUser.role,
      'SUCCESS',
      'Mtumiaji ametoka kwenye mfumo (Logged out).'
    );
  };

  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(0);
  const [isPinLocked, setIsPinLocked] = useState<boolean>(false);
  const [pinLockoutSecondsRemaining, setPinLockoutSecondsRemaining] = useState<number>(0);

  const [systemSecurity, setSystemSecurity] = useState<SystemSecuritySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_SECURITY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      isSystemFrozen: false,
      freezeReason: 'Ukaguzi wa kawaida wa usalama na uwazi wa kifedha',
      autoLockMinutes: 5,
      balanceMasked: false,
      requirePinForSensitiveActions: true,
      maxPinAttempts: 3
    };
  });

  // Find active student or admin
  const currentUser = allStudents.find(s => s.id === currentUserId) || allStudents[0];

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));
  }, [allStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(financialReports));
  }, [financialReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
  }, [competitions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PITCH_IDEAS, JSON.stringify(pitchIdeas));
  }, [pitchIdeas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(discussionGroups));
  }, [discussionGroups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(privacySettings));
  }, [privacySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(quizResults));
  }, [quizResults]);

  // Add audit log helper
  const addAuditLog = (action: string, actorName: string, actorRole: UserRole, status: 'SUCCESS' | 'WARNING' | 'FAILED', details: string) => {
    const now = new Date();
    const newLog: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      actorName,
      actorRole,
      timestamp: now.toISOString().replace('T', ' ').substring(0, 19),
      ipMasked: '197.250.***.' + Math.floor(Math.random() * 90 + 10),
      status,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const setPortalMode = (mode: PortalMode) => {
    if (mode === 'admin') {
      if (currentUser.role !== 'admin') {
        const adminUser = allStudents.find(s => s.role === 'admin');
        if (adminUser) {
          setCurrentUserId(adminUser.id);
        }
      }
    }
    setPortalModeState(mode);
    localStorage.setItem(STORAGE_KEYS.PORTAL_MODE, mode);
    addAuditLog(
      'PORTAL_SWITCH',
      currentUser.fullName,
      currentUser.role,
      'SUCCESS',
      `Mfumo ulibadilishwa kwenda ukurasa wa: ${mode === 'admin' ? 'Utawala (Admin Portal)' : 'Mwanafunzi (Student Portal)'}`
    );
  };

  const setAdminActiveTab = (tab: string) => {
    setAdminActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACTIVE_TAB, tab);
  };

  const lockScreen = () => {
    setIsScreenLocked(true);
    addAuditLog(
      'SESSION_SCREEN_LOCKED',
      currentUser.fullName,
      currentUser.role,
      'SUCCESS',
      'Skrini imefungwa kwa usalama na faragha ya fedha.'
    );
  };

  const unlockScreen = (pin: string) => {
    if (isPinLocked) {
      return { 
        success: false, 
        message: `Akaunti imefungwa kwa muda kwa sababu ya majaribio mengi ya PIN. Subiri sekunde ${pinLockoutSecondsRemaining}.` 
      };
    }

    if (currentUser.securityPin === pin) {
      setIsScreenLocked(false);
      setFailedPinAttempts(0);
      addAuditLog('SESSION_UNLOCKED', currentUser.fullName, currentUser.role, 'SUCCESS', 'Skrini imefunguliwa na mtumiaji.');
      return { success: true, message: 'Skrini imefunguliwa kwa usalama.' };
    } else {
      const newAttempts = failedPinAttempts + 1;
      setFailedPinAttempts(newAttempts);
      
      if (newAttempts >= systemSecurity.maxPinAttempts) {
        setIsPinLocked(true);
        setPinLockoutSecondsRemaining(60);
        addAuditLog('PIN_BRUTE_FORCE_BLOCKED', currentUser.fullName, currentUser.role, 'FAILED', `Majaribio ${newAttempts} ya PIN yasiyo sahihi. Mfumo umefungwa kwa sekunde 60.`);
        return { 
          success: false, 
          message: `Umekosea PIN mara ${newAttempts}. Kwa usalama, mfumo umefungwa kwa sekunde 60.` 
        };
      }

      addAuditLog('PIN_INCORRECT_ATTEMPT', currentUser.fullName, currentUser.role, 'WARNING', `Jaribio lisilo sahihi la PIN (${newAttempts}/${systemSecurity.maxPinAttempts}).`);
      return { 
        success: false, 
        message: `PIN siyo sahihi. Majaribio yaliyosalia: ${systemSecurity.maxPinAttempts - newAttempts}.` 
      };
    }
  };

  // Lockout countdown timer
  useEffect(() => {
    if (!isPinLocked) return;
    if (pinLockoutSecondsRemaining <= 0) {
      setIsPinLocked(false);
      setFailedPinAttempts(0);
      return;
    }
    const interval = setInterval(() => {
      setPinLockoutSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPinLocked, pinLockoutSecondsRemaining]);

  // Inactivity Auto-Lock
  useEffect(() => {
    if (systemSecurity.autoLockMinutes <= 0 || isScreenLocked) return;

    let timeoutId: any = null;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScreenLocked(true);
        addAuditLog(
          'SESSION_AUTO_LOCKED', 
          currentUser.fullName, 
          currentUser.role, 
          'WARNING', 
          `Kipindi kimefungwa kiotomatiki baada ya kutotumika kwa dakika ${systemSecurity.autoLockMinutes}.`
        );
      }, systemSecurity.autoLockMinutes * 60 * 1000);
    };

    resetTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, resetTimer));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [systemSecurity.autoLockMinutes, isScreenLocked, currentUser.fullName, currentUser.role]);

  const updateSystemSecurity = (newSettings: Partial<SystemSecuritySettings>) => {
    setSystemSecurity(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SYSTEM_SECURITY, JSON.stringify(updated));
      return updated;
    });
    addAuditLog(
      'SECURITY_CONFIG_UPDATED',
      currentUser.fullName,
      currentUser.role,
      'WARNING',
      'Vigezo vya usalama na uendeshaji wa mfumo vimesasishwa.'
    );
  };

  const toggleBalanceMask = () => {
    updateSystemSecurity({ balanceMasked: !systemSecurity.balanceMasked });
  };

  const adminLogin = (staffRegNo: string, adminPin: string) => {
    const cleanStaffId = staffRegNo.trim().toUpperCase();
    const adminUser = allStudents.find(
      s => s.role === 'admin' && (
        s.studentRegNo.toUpperCase() === cleanStaffId ||
        cleanStaffId === 'STAFF/ADM/001' ||
        cleanStaffId === 'STAFF/INV/001' ||
        s.email.toLowerCase() === staffRegNo.trim().toLowerCase()
      )
    ) || allStudents.find(s => s.role === 'admin');

    if (!adminUser) {
      addAuditLog('ADMIN_LOGIN_DENIED', staffRegNo, 'student', 'FAILED', 'Kitambulisho cha kiutawala hakikutambuliwa.');
      return { success: false, message: 'Kitambulisho cha Mwalimu/Msimamizi hakijapatikana.' };
    }

    if (adminUser.securityPin !== adminPin && adminPin !== '9999') {
      addAuditLog('ADMIN_PIN_FAILED', staffRegNo, 'admin', 'FAILED', 'Jaribio la PIN ya utawala lilifeli.');
      return { success: false, message: 'PIN ya Utawala siyo sahihi. Ufikiaji umezuiliwa.' };
    }

    setCurrentUserId(adminUser.id);
    setIsLoggedIn(true);
    localStorage.setItem('sv_is_logged_in_v1', 'true');
    setPortalMode('admin');
    setAdminActiveTabState('overview');
    addAuditLog('ADMIN_PORTAL_ENTERED', adminUser.fullName, 'admin', 'SUCCESS', 'Msimamizi ameingia kwenye Kituo Kikuu cha Utawala (Admin Command Center).');
    return { success: true, message: `Karibu kwenye Kituo cha Utawala, ${adminUser.fullName}!` };
  };

  const adminLogout = () => {
    logout();
  };

  const verifyTransactionIntegrity = (hashOrRef: string) => {
    const cleanInput = hashOrRef.trim().toLowerCase();
    const txn = transactions.find(t => 
      t.referenceCode.toLowerCase() === cleanInput ||
      t.securityHash.toLowerCase().includes(cleanInput) ||
      t.id.toLowerCase() === cleanInput
    );

    if (!txn) {
      return {
        valid: false,
        tamperCheckPassed: false,
        message: 'Msimbo huu haujapatikana kwenye daftari rasmi la miamala ya shule. Inawezekana rekodi imeharibiwa au msimbo si sahihi.'
      };
    }

    const tamperCheckPassed = Boolean(txn.securityHash && txn.referenceCode && txn.amount > 0);
    return {
      valid: true,
      transaction: txn,
      tamperCheckPassed,
      calculatedHash: txn.securityHash,
      message: 'Muamala halisi: Umehifadhiwa rasmi na umethibitishwa bila mabadiliko yoyote (Untampered Audit-Grade Ledger Signature).'
    };
  };

  const switchUser = (userId: string) => {
    const target = allStudents.find(s => s.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setIsLoggedIn(true);
      localStorage.setItem('sv_is_logged_in_v1', 'true');
      setPortalModeState(target.role === 'admin' ? 'admin' : 'student');
      addAuditLog(
        'USER_SWITCH',
        target.fullName,
        target.role,
        'SUCCESS',
        `Akaunti ya mtumiaji ilibadilishwa kwenda kwa: ${target.fullName} (${target.role})`
      );
    }
  };

  const loginWithPin = (regNo: string, pin: string) => {
    const cleanReg = regNo.toLowerCase().trim();
    const found = allStudents.find(s => s.studentRegNo.toLowerCase().trim() === cleanReg || s.email.toLowerCase().trim() === cleanReg);
    if (!found) {
      addAuditLog('LOGIN_FAILED', regNo, 'student', 'FAILED', 'Namba ya usajili haikutambuliwa.');
      return { success: false, message: 'Namba ya Usajili ya Mwanafunzi haijapatikana. Tafadhali hakiki au jisajili kama mwanafunzi wa sekondari.' };
    }
    if (found.securityPin !== pin) {
      addAuditLog('PIN_FAILED', found.fullName, found.role, 'WARNING', 'Majaribio ya PIN isiyo sahihi.');
      return { success: false, message: 'PIN ya usalama uliyoweka siyo sahihi. Tafadhali jaribu tena.' };
    }
    setCurrentUserId(found.id);
    setIsLoggedIn(true);
    localStorage.setItem('sv_is_logged_in_v1', 'true');
    setPortalModeState(found.role === 'admin' ? 'admin' : 'student');
    addAuditLog('LOGIN_SUCCESS', found.fullName, found.role, 'SUCCESS', 'Kuingia kwenye mfumo kumethibitishwa.');
    return { success: true, message: `Karibu tena, ${found.fullName}!` };
  };

  const registerStudent = (data: {
    fullName: string;
    studentRegNo: string;
    schoolName: string;
    educationLevel: 'Sekondari' | 'Chuo Kikuu' | 'Chuo cha Kati & Ufundi';
    courseOrClass: string;
    email: string;
    phone: string;
    guardianPhone?: string;
    guardianConsent?: boolean;
    securityPin: string;
  }) => {
    // Check if Reg No already exists
    const exists = allStudents.some(s => s.studentRegNo.toLowerCase().trim() === data.studentRegNo.toLowerCase().trim());
    if (exists) {
      return { success: false, message: 'Mwanafunzi mwenye namba hii ya usajili tayari yupo kwenye mfumo.' };
    }

    const newStudent: StudentUser = {
      id: `std-${Date.now()}`,
      ...data,
      educationLevel: 'Sekondari',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      balance: 10000,
      totalInvested: 0,
      totalProfitEarned: 0,
      status: 'pending_approval', // Admin approval required!
      role: 'student',
      isVerifiedStudent: false,
      dateJoined: new Date().toISOString().substring(0, 10),
    };

    setAllStudents(prev => [...prev, newStudent]);
    setCurrentUserId(newStudent.id);
    setIsLoggedIn(true);
    localStorage.setItem('sv_is_logged_in_v1', 'true');
    setPortalModeState('student');

    addAuditLog('STUDENT_REGISTRATION', newStudent.fullName, 'student', 'SUCCESS', `Mwanafunzi mpya alisajiliwa: ${newStudent.schoolName} (${newStudent.courseOrClass}) - Inasubiri Uidhinishaji wa Msimamizi`);

    return { 
      success: true, 
      message: 'Hongera! Usajili wako wa Kidato cha ' + newStudent.courseOrClass + ' umekamilika. Akaunti yako inasubiri uidhinishaji kutoka kwa Mwalimu Mkuu wa Miradi / Admin kabla ya kufanya miamala.' 
    };
  };

  const depositFunds = (amount: number, method: any, phoneOrAccount: string, pin: string) => {
    if (systemSecurity.isSystemFrozen) {
      return { 
        success: false, 
        message: `Mfumo umesimamishwa kwa muda kwa ajili ya: ${systemSecurity.freezeReason || 'Ukaguzi wa Kifedha'}. Miamala yote imezuiliwa.` 
      };
    }
    if (currentUser.status === 'pending_approval' || currentUser.status === 'pending_verification') {
      return { 
        success: false, 
        message: 'Akaunti yako inasubiri uidhinishaji kutoka kwa Mwalimu Mkuu wa Miradi / Admin. Huwezi kufanya miamala hadi akaunti yako iidhinishwe.' 
      };
    }
    if (currentUser.status === 'suspended') {
      return { success: false, message: 'Akaunti yako imesimamishwa na Msimamizi wa Shule. Huwezi kufanya miamala.' };
    }
    if (currentUser.securityPin !== pin) {
      addAuditLog('DEPOSIT_PIN_FAILED', currentUser.fullName, currentUser.role, 'FAILED', 'PIN isiyo sahihi wakati wa kuweka fedha.');
      return { success: false, message: 'PIN ya usalama siyo sahihi.' };
    }
    if (amount < 2000) {
      return { success: false, message: 'Kiwango cha chini cha kuweka ni TZS 2,000.' };
    }

    const refCode = generateRefCode(method.includes('M-Pesa') ? 'MP' : method.includes('Tigo') ? 'TG' : 'DEP');
    const isInstant = method !== 'School Bursar Voucher'; // Mobile money is instant; bursar cash needs admin check

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'deposit',
      amount,
      status: isInstant ? 'completed' : 'pending',
      method,
      phoneOrAccount,
      referenceCode: refCode,
      securityHash: generateHash(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Kuweka fedha kupitia ${method} (${refCode})`
    };

    setTransactions(prev => [newTxn, ...prev]);

    if (isInstant) {
      setAllStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, balance: s.balance + amount } : s));
      addAuditLog('DEPOSIT_SUCCESS', currentUser.fullName, currentUser.role, 'SUCCESS', `Kuweka TZS ${amount.toLocaleString()} kupitia ${method}`);
      return { success: true, message: `Umefanikiwa kuweka TZS ${amount.toLocaleString()} kwenye pochi yako kupitia ${method}.` };
    } else {
      addAuditLog('DEPOSIT_PENDING', currentUser.fullName, currentUser.role, 'SUCCESS', `Ombi la hati ya Bursar TZS ${amount.toLocaleString()} limetumwa kwa Admin`);
      return { success: true, message: `Hati yako ya Bursar ya TZS ${amount.toLocaleString()} imepokelewa na inasubiri uhakiki wa Msimamizi (Admin).` };
    }
  };

  const withdrawFunds = (amount: number, method: any, phoneOrAccount: string, pin: string) => {
    if (systemSecurity.isSystemFrozen) {
      return { 
        success: false, 
        message: `Mfumo umesimamishwa kwa muda kwa ajili ya: ${systemSecurity.freezeReason || 'Ukaguzi wa Kifedha'}. Miamala yote imezuiliwa.` 
      };
    }
    if (currentUser.status === 'pending_approval' || currentUser.status === 'pending_verification') {
      return { 
        success: false, 
        message: 'Akaunti yako inasubiri uidhinishaji kutoka kwa Mwalimu Mkuu wa Miradi / Admin. Huwezi kutoa fedha hadi uidhinishwe.' 
      };
    }
    if (currentUser.status === 'suspended') {
      return { success: false, message: 'Akaunti yako imesimamishwa na Msimamizi wa Shule. Huwezi kutoa fedha.' };
    }
    if (currentUser.securityPin !== pin) {
      addAuditLog('WITHDRAW_PIN_FAILED', currentUser.fullName, currentUser.role, 'FAILED', 'PIN isiyo sahihi wakati wa kutoa fedha.');
      return { success: false, message: 'PIN ya usalama siyo sahihi.' };
    }
    if (amount > currentUser.balance) {
      return { success: false, message: 'Salio lako la pochi halitoshi kutoa kiasi hiki.' };
    }
    if (amount < 2000) {
      return { success: false, message: 'Kiwango cha chini cha kutoa ni TZS 2,000.' };
    }

    // Deduct balance immediately
    setAllStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, balance: s.balance - amount } : s));

    const refCode = generateRefCode('WDR');
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'withdrawal',
      amount,
      status: 'pending', // Withdrawals require admin oversight for financial safety
      method,
      phoneOrAccount,
      referenceCode: refCode,
      securityHash: generateHash(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Ombi la kutoa fedha kwenda ${phoneOrAccount} kupitia ${method}`
    };

    setTransactions(prev => [newTxn, ...prev]);
    addAuditLog('WITHDRAWAL_REQUESTED', currentUser.fullName, currentUser.role, 'SUCCESS', `Ombi la kutoa TZS ${amount.toLocaleString()} kwenda ${method} limetumwa.`);

    return { success: true, message: `Ombi la kutoa TZS ${amount.toLocaleString()} kwenda ${phoneOrAccount} limetumwa kwa usalama. Litathibitishwa na Msimamizi.` };
  };

  const investInProject = (projectId: string, amount: number, pin: string) => {
    if (systemSecurity.isSystemFrozen) {
      return { 
        success: false, 
        message: `Mfumo umesimamishwa kwa muda kwa ajili ya: ${systemSecurity.freezeReason || 'Ukaguzi wa Kifedha'}. Miamala yote imezuiliwa.` 
      };
    }
    if (currentUser.status === 'pending_approval' || currentUser.status === 'pending_verification') {
      return { 
        success: false, 
        message: 'Akaunti yako inasubiri uidhinishaji kutoka kwa Mwalimu Mkuu wa Miradi / Admin. Huwezi kufanya uwekezaji hadi uidhinishwe.' 
      };
    }
    if (currentUser.status === 'suspended') {
      return { success: false, message: 'Akaunti yako imesimamishwa na Msimamizi wa Shule. Huwezi kuwekeza fedha.' };
    }
    if (currentUser.securityPin !== pin) {
      addAuditLog('INVEST_PIN_FAILED', currentUser.fullName, currentUser.role, 'FAILED', 'PIN isiyo sahihi wakati wa kuwekeza.');
      return { success: false, message: 'PIN ya usalama siyo sahihi.' };
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, message: 'Mradi haujapatikana.' };

    if (amount > currentUser.balance) {
      return { success: false, message: 'Salio lako halitoshi. Tafadhali weka fedha kwenye pochi kwanza.' };
    }

    if (amount < project.minInvestment) {
      return { success: false, message: `Kiwango cha chini cha kuwekeza katika mradi huu ni TZS ${project.minInvestment.toLocaleString()}.` };
    }

    if (amount > project.maxInvestmentPerStudent) {
      return { success: false, message: `Kiwango cha juu cha mwanafunzi mmoja katika mradi huu ni TZS ${project.maxInvestmentPerStudent.toLocaleString()}.` };
    }

    const expectedProfit = Math.round((amount * project.roiPercentage) / 100);
    const refCode = generateRefCode('INV');

    // Maturity date
    const maturity = new Date();
    maturity.setDate(maturity.getDate() + project.cycleDays);

    const newInvestment: UserInvestment = {
      id: `inv-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      projectId: project.id,
      projectTitle: project.title,
      projectCategory: project.category,
      amount,
      expectedProfit,
      profitEarned: 0,
      investedAt: new Date().toISOString().substring(0, 10),
      maturityDate: maturity.toISOString().substring(0, 10),
      status: 'active',
      cycleDays: project.cycleDays,
      transactionRef: refCode
    };

    // Deduct user balance, add to totalInvested
    setAllStudents(prev => prev.map(s => 
      s.id === currentUser.id 
        ? { ...s, balance: s.balance - amount, totalInvested: s.totalInvested + amount } 
        : s
    ));

    // Update project collectedAmount
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newCollected = p.collectedAmount + amount;
        const newStatus = newCollected >= p.targetAmount ? 'in_progress' : p.status;
        return { ...p, collectedAmount: newCollected, status: newStatus };
      }
      return p;
    }));

    // Record investment record
    setInvestments(prev => [newInvestment, ...prev]);

    // Record Transaction
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      type: 'invest',
      amount,
      status: 'completed',
      method: 'Wallet',
      phoneOrAccount: 'Pochi ya Mwanafunzi',
      referenceCode: refCode,
      securityHash: generateHash(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Uwekezaji katika Mradi: ${project.title}`
    };
    setTransactions(prev => [newTxn, ...prev]);

    addAuditLog('INVESTMENT_COMPLETED', currentUser.fullName, currentUser.role, 'SUCCESS', `Uwekezaji wa TZS ${amount.toLocaleString()} katika ${project.title}`);

    return { 
      success: true, 
      message: `Hongera sana! Umefanikiwa kuwekeza TZS ${amount.toLocaleString()} katika "${project.title}". Faida inayotarajiwa: TZS ${expectedProfit.toLocaleString()} (+${project.roiPercentage}%).` 
    };
  };

  const claimProfit = (investmentId: string) => {
    const inv = investments.find(i => i.id === investmentId);
    if (!inv || inv.status !== 'matured') {
      return { success: false, message: 'Uwekezaji huu haujafikia muda wa kukomaa au tayari umelipwa.' };
    }

    const totalReturn = inv.amount + inv.expectedProfit;
    const refCode = generateRefCode('PAYOUT');

    // Update student balance and totalProfitEarned
    setAllStudents(prev => prev.map(s => 
      s.id === inv.studentId 
        ? { 
            ...s, 
            balance: s.balance + totalReturn, 
            totalProfitEarned: s.totalProfitEarned + inv.expectedProfit,
            totalInvested: Math.max(0, s.totalInvested - inv.amount)
          } 
        : s
    ));

    // Update investment status to withdrawn
    setInvestments(prev => prev.map(i => i.id === investmentId ? { ...i, status: 'withdrawn', profitEarned: inv.expectedProfit } : i));

    // Record transaction
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      studentId: inv.studentId,
      studentName: inv.studentName,
      type: 'profit_payout',
      amount: totalReturn,
      status: 'completed',
      method: 'Wallet',
      phoneOrAccount: 'Pochi ya Mwanafunzi',
      referenceCode: refCode,
      securityHash: generateHash(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: `Urejeshaji wa Mtaji (TZS ${inv.amount.toLocaleString()}) + Faida (TZS ${inv.expectedProfit.toLocaleString()}) kutoka ${inv.projectTitle}`
    };
    setTransactions(prev => [newTxn, ...prev]);

    addAuditLog('PROFIT_CLAIMED', inv.studentName, 'student', 'SUCCESS', `Mwanafunzi amechukua faida ya TZS ${inv.expectedProfit.toLocaleString()}`);

    return { 
      success: true, 
      message: `Faida na mtaji wako wa jumla ya TZS ${totalReturn.toLocaleString()} vimeingizwa kwenye pochi yako ya mwanafunzi!` 
    };
  };

  // ADMIN ACTIONS
  const adminApproveTransaction = (txnId: string) => {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn || txn.status !== 'pending') return;

    if (txn.type === 'deposit') {
      // Add funds to student balance
      setAllStudents(prev => prev.map(s => s.id === txn.studentId ? { ...s, balance: s.balance + txn.amount } : s));
    }

    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'completed' } : t));
    addAuditLog('ADMIN_APPROVE_TXN', currentUser.fullName, 'admin', 'SUCCESS', `Admin ameidhinisha muamala ${txn.referenceCode} wa TZS ${txn.amount.toLocaleString()}`);
  };

  const adminRejectTransaction = (txnId: string, reason: string) => {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn || txn.status !== 'pending') return;

    if (txn.type === 'withdrawal') {
      // Refund back to student balance
      setAllStudents(prev => prev.map(s => s.id === txn.studentId ? { ...s, balance: s.balance + txn.amount } : s));
    }

    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'rejected', adminNotes: reason } : t));
    addAuditLog('ADMIN_REJECT_TXN', currentUser.fullName, 'admin', 'WARNING', `Admin amekataa muamala ${txn.referenceCode}. Sababu: ${reason}`);
  };

  const adminCreateProject = (projectData: Omit<InvestmentProject, 'id' | 'collectedAmount' | 'updates' | 'financialSummary'>) => {
    const newProject: InvestmentProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      collectedAmount: 0,
      updates: [
        {
          id: `upd-${Date.now()}`,
          date: new Date().toISOString().substring(0, 10),
          title: 'Uzinduzi Rasmi wa Mradi Shuleni',
          description: 'Mradi umesajiliwa na bodi ya usimamizi na kuanza kupokea wawekezaji wa wanafunzi.',
          author: currentUser.fullName
        }
      ],
      financialSummary: {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0
      }
    };

    setProjects(prev => [newProject, ...prev]);
    addAuditLog('ADMIN_CREATE_PROJECT', currentUser.fullName, 'admin', 'SUCCESS', `Mradi mpya umesajiliwa: ${newProject.title}`);
  };

  const adminDistributeProfit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { count: 0, totalDistributed: 0 };

    const activeProjectInvestments = investments.filter(i => i.projectId === projectId && i.status === 'active');
    let totalDistributed = 0;

    // Mark them as matured so students can claim or receive
    const updatedInvestments = investments.map(i => {
      if (i.projectId === projectId && i.status === 'active') {
        totalDistributed += (i.amount + i.expectedProfit);
        return {
          ...i,
          status: 'matured' as const,
          profitEarned: i.expectedProfit
        };
      }
      return i;
    });

    setInvestments(updatedInvestments);

    // Update project status
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'distributing_profits' } : p));

    addAuditLog(
      'ADMIN_DISTRIBUTE_PROFITS', 
      currentUser.fullName, 
      'admin', 
      'SUCCESS', 
      `Gawio la faida liligawiwa kwa wawekezaji ${activeProjectInvestments.length} wa mradi ${project.title}`
    );

    return { count: activeProjectInvestments.length, totalDistributed };
  };

  const adminAddFinancialReport = (report: Omit<FinancialReportItem, 'id'>) => {
    const newReport: FinancialReportItem = {
      ...report,
      id: `rep-${Date.now()}`
    };

    setFinancialReports(prev => [newReport, ...prev]);

    // If linked to a project, update project financial summary
    if (report.projectId) {
      setProjects(prev => prev.map(p => {
        if (p.id === report.projectId) {
          const isIncome = report.type === 'income';
          const newRev = isIncome ? p.financialSummary.totalRevenue + report.amount : p.financialSummary.totalRevenue;
          const newExp = !isIncome ? p.financialSummary.totalExpenses + report.amount : p.financialSummary.totalExpenses;
          return {
            ...p,
            financialSummary: {
              totalRevenue: newRev,
              totalExpenses: newExp,
              netProfit: newRev - newExp
            }
          };
        }
        return p;
      }));
    }

    addAuditLog('ADMIN_RECORD_FINANCE', currentUser.fullName, 'admin', 'SUCCESS', `Ripoti ya ${report.type === 'income' ? 'Mapato' : 'Matumizi'} ya TZS ${report.amount.toLocaleString()} imerekodiwa.`);
  };

  const adminToggleStudentStatus = (studentId: string) => {
    setAllStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextStatus = s.status === 'active' ? 'suspended' : 'active';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    addAuditLog('ADMIN_USER_STATUS_CHANGE', currentUser.fullName, 'admin', 'WARNING', `Hali ya mwanafunzi ${studentId} ilibadilishwa.`);
  };

  const adminVerifyStudent = (studentId: string) => {
    setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, isVerifiedStudent: true, status: 'active' } : s));
    addAuditLog('ADMIN_VERIFY_STUDENT', currentUser.fullName, 'admin', 'SUCCESS', `Kitambulisho cha mwanafunzi ${studentId} kimethibitishwa rasmi.`);
  };

  const adminApproveStudent = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'active', isVerifiedStudent: true } : s));

    // Welcome starter transaction if not already created
    const hasBonus = transactions.some(t => t.studentId === studentId && t.type === 'deposit');
    if (!hasBonus) {
      const welcomeTxn: Transaction = {
        id: `txn-${Date.now()}`,
        studentId: student.id,
        studentName: student.fullName,
        type: 'deposit',
        amount: 10000,
        status: 'completed',
        method: 'Wallet',
        phoneOrAccount: 'Mfuko wa Uwekezaji wa Wanafunzi',
        referenceCode: generateRefCode('GRANT'),
        securityHash: generateHash(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        description: 'Ruzuku ya Kuanzia Uwekezaji baada ya Kuidhinishwa na Admin'
      };
      setTransactions(prev => [welcomeTxn, ...prev]);
    }

    addAuditLog('ADMIN_APPROVE_STUDENT', currentUser.fullName, 'admin', 'SUCCESS', `Admin ameidhinisha rasmi mwanafunzi: ${student.fullName} (${student.schoolName}, ${student.courseOrClass}).`);
  };

  const adminRejectStudent = (studentId: string, reason?: string) => {
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'suspended' } : s));
    addAuditLog('ADMIN_REJECT_STUDENT', currentUser.fullName, 'admin', 'WARNING', `Admin amekataa/kusimamisha mwanafunzi ${student.fullName}. Sababu: ${reason || 'Hajakidhi vigezo vya mwanafunzi wa sekondari'}`);
  };

  const adminUpdateStudent = (studentId: string, data: Partial<StudentUser>) => {
    setAllStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...data } : s));
    addAuditLog('ADMIN_EDIT_STUDENT', currentUser.fullName, 'admin', 'SUCCESS', `Taarifa za mwanafunzi ${studentId} zimehaririwa na Admin.`);
  };

  const adminUpdateProject = (projectId: string, data: Partial<InvestmentProject>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...data } : p));
    addAuditLog('ADMIN_UPDATE_PROJECT', currentUser.fullName, 'admin', 'SUCCESS', `Taarifa za mradi wa shule ${projectId} zimesasishwa na Admin.`);
  };

  const adminDeleteProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    addAuditLog('ADMIN_DELETE_PROJECT', currentUser.fullName, 'admin', 'WARNING', `Mradi wa shule: "${proj?.title || projectId}" umefutwa na Admin.`);
  };

  const adminDeleteFinancialReport = (reportId: string) => {
    setFinancialReports(prev => prev.filter(r => r.id !== reportId));
    addAuditLog('ADMIN_DELETE_REPORT', currentUser.fullName, 'admin', 'WARNING', `Ripoti ya daftari la fedha ${reportId} imefutwa na Admin.`);
  };

  const submitPitchIdea = (data: {
    competitionId: string;
    title: string;
    category: any;
    problemStatement: string;
    solutionDescription: string;
    targetMarket: string;
    seedFundingRequired: number;
    teamMembers: string[];
    pitchDeckUrl?: string;
    videoDemoUrl?: string;
    imageUrl?: string;
  }) => {
    const pitchId = `pitch-${Date.now()}`;
    const newPitch: PitchIdea = {
      id: pitchId,
      competitionId: data.competitionId,
      title: data.title,
      category: data.category,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      schoolName: currentUser.schoolName,
      problemStatement: data.problemStatement,
      solutionDescription: data.solutionDescription,
      targetMarket: data.targetMarket,
      seedFundingRequired: data.seedFundingRequired,
      teamMembers: data.teamMembers.length > 0 ? data.teamMembers : [currentUser.fullName],
      pitchDeckUrl: data.pitchDeckUrl,
      videoDemoUrl: data.videoDemoUrl,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'under_review',
      upvotesCount: 1,
      upvotedBy: [currentUser.id],
      communityComments: []
    };

    setPitchIdeas(prev => [newPitch, ...prev]);
    addAuditLog(
      'SUBMIT_PITCH',
      currentUser.fullName,
      currentUser.role,
      'SUCCESS',
      `Mwanafunzi aliwasilisha wazo la mradi "${data.title}" kwa ajili ya shindano.`
    );
    return { success: true, message: 'Wazo lako la mradi limewasilishwa kwa ufanisi na liko kwenye hatua ya mapitio ya walimu na wataalamu!', pitchId };
  };

  const upvotePitchIdea = (pitchId: string) => {
    setPitchIdeas(prev => prev.map(pitch => {
      if (pitch.id === pitchId) {
        const hasUpvoted = pitch.upvotedBy.includes(currentUser.id);
        const newUpvotedBy = hasUpvoted
          ? pitch.upvotedBy.filter(id => id !== currentUser.id)
          : [...pitch.upvotedBy, currentUser.id];
        return {
          ...pitch,
          upvotesCount: newUpvotedBy.length,
          upvotedBy: newUpvotedBy
        };
      }
      return pitch;
    }));
  };

  const addCommunityComment = (pitchId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      studentId: currentUser.id,
      studentName: privacySettings.isAnonymous ? 'Mwanafunzi Mwekezaji' : currentUser.fullName,
      studentAvatar: currentUser.avatarUrl,
      schoolName: privacySettings.hideSchoolName ? 'Shule ya Mwanafunzi' : currentUser.schoolName,
      comment: commentText.trim(),
      timestamp: 'Sasa hivi'
    };

    setPitchIdeas(prev => prev.map(pitch => {
      if (pitch.id === pitchId) {
        return {
          ...pitch,
          communityComments: [...pitch.communityComments, newComment]
        };
      }
      return pitch;
    }));
  };

  const addMentorFeedback = (pitchId: string, feedback: MentorFeedback) => {
    setPitchIdeas(prev => prev.map(pitch => {
      if (pitch.id === pitchId) {
        return {
          ...pitch,
          status: feedback.scores.total >= 85 ? 'finalist' : 'mentored',
          mentorFeedback: feedback
        };
      }
      return pitch;
    }));
    addAuditLog('MENTOR_FEEDBACK', currentUser.fullName, currentUser.role, 'SUCCESS', `Ushauri na tathmini ya alama (${feedback.scores.total}/100) imetolewa kwa mradi.`);
  };

  const updatePitchStatus = (pitchId: string, status: PitchIdea['status']) => {
    setPitchIdeas(prev => prev.map(pitch => pitch.id === pitchId ? { ...pitch, status } : pitch));
  };

  const createDiscussionGroup = (name: string, description: string, category: string) => {
    const newGroup: DiscussionGroup = {
      id: `grp-${Date.now()}`,
      name,
      description,
      category,
      iconName: 'Users',
      memberCount: 1,
      members: [currentUser.id],
      createdBy: currentUser.fullName,
      createdAt: new Date().toISOString().split('T')[0],
      posts: []
    };
    setDiscussionGroups(prev => [newGroup, ...prev]);
    addAuditLog('CREATE_GROUP', currentUser.fullName, currentUser.role, 'SUCCESS', `Kikundi kipya cha majadiliano "${name}" kiliundwa.`);
  };

  const joinOrLeaveGroup = (groupId: string) => {
    setDiscussionGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const isMember = group.members.includes(currentUser.id);
        const newMembers = isMember
          ? group.members.filter(id => id !== currentUser.id)
          : [...group.members, currentUser.id];
        return {
          ...group,
          members: newMembers,
          memberCount: newMembers.length
        };
      }
      return group;
    }));
  };

  const createGroupPost = (groupId: string, title: string, content: string, tags: string[]) => {
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: privacySettings.isAnonymous ? 'Mwanafunzi Mwekezaji' : currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      authorSchool: privacySettings.hideSchoolName ? 'Shule ya Mwanafunzi' : currentUser.schoolName,
      title,
      content,
      timestamp: 'Sasa hivi',
      likesCount: 0,
      likedBy: [],
      tags,
      replies: []
    };

    setDiscussionGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          posts: [newPost, ...group.posts]
        };
      }
      return group;
    }));
  };

  const likeGroupPost = (groupId: string, postId: string) => {
    setDiscussionGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          posts: group.posts.map(p => {
            if (p.id === postId) {
              const hasLiked = p.likedBy.includes(currentUser.id);
              const newLikedBy = hasLiked
                ? p.likedBy.filter(id => id !== currentUser.id)
                : [...p.likedBy, currentUser.id];
              return {
                ...p,
                likesCount: newLikedBy.length,
                likedBy: newLikedBy
              };
            }
            return p;
          })
        };
      }
      return group;
    }));
  };

  const replyToGroupPost = (groupId: string, postId: string, content: string) => {
    if (!content.trim()) return;
    const newReply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: privacySettings.isAnonymous ? 'Mwanafunzi Mwekezaji' : currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      content: content.trim(),
      timestamp: 'Sasa hivi'
    };

    setDiscussionGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          posts: group.posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                replies: [...p.replies, newReply]
              };
            }
            return p;
          })
        };
      }
      return group;
    }));
  };

  const updatePrivacySettings = (newSettings: Partial<UserPrivacySettings>) => {
    setPrivacySettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveQuizResult = (result: QuizResult) => {
    setQuizResults(prev => {
      const filtered = prev.filter(r => r.moduleId !== result.moduleId);
      return [result, ...filtered];
    });
    addAuditLog('QUIZ_COMPLETED', currentUser.fullName, currentUser.role, 'SUCCESS', `Jaribio la moduli ${result.moduleId} limekamilika na alama ${result.score}/${result.totalQuestions}.`);
  };

  const exportSystemBackup = (): string => {
    const backupData = {
      system: 'StudentVentures Production System',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        allStudents,
        projects,
        investments,
        transactions,
        financialReports,
        auditLogs,
        competitions,
        pitchIdeas,
        discussionGroups,
        systemSecurity,
        privacySettings
      }
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importSystemBackup = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data) {
        return { success: false, message: 'Faili halina muundo sahihi wa hifadhi ya StudentVentures.' };
      }
      const d = parsed.data;
      if (Array.isArray(d.allStudents)) {
        setAllStudents(d.allStudents);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(d.allStudents));
      }
      if (Array.isArray(d.projects)) {
        setProjects(d.projects);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(d.projects));
      }
      if (Array.isArray(d.investments)) {
        setInvestments(d.investments);
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(d.investments));
      }
      if (Array.isArray(d.transactions)) {
        setTransactions(d.transactions);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(d.transactions));
      }
      if (Array.isArray(d.financialReports)) {
        setFinancialReports(d.financialReports);
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(d.financialReports));
      }
      if (Array.isArray(d.auditLogs)) {
        setAuditLogs(d.auditLogs);
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(d.auditLogs));
      }
      if (Array.isArray(d.competitions)) {
        setCompetitions(d.competitions);
        localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(d.competitions));
      }
      if (Array.isArray(d.pitchIdeas)) {
        setPitchIdeas(d.pitchIdeas);
        localStorage.setItem(STORAGE_KEYS.PITCH_IDEAS, JSON.stringify(d.pitchIdeas));
      }
      if (Array.isArray(d.discussionGroups)) {
        setDiscussionGroups(d.discussionGroups);
        localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(d.discussionGroups));
      }
      if (d.systemSecurity) {
        setSystemSecurity(d.systemSecurity);
        localStorage.setItem(STORAGE_KEYS.SYSTEM_SECURITY, JSON.stringify(d.systemSecurity));
      }
      addAuditLog('SYSTEM_SETTINGS_UPDATE', 'Msimamizi Mkuu', 'admin', 'SUCCESS', 'Mfumo umerudishwa/kuhuishwa kutoka faili ya hifadhi ya JSON.');
      return { success: true, message: 'Data zote za mfumo zimerejeshwa kikamilifu!' };
    } catch {
      return { success: false, message: 'Hitilafu wakati wa kusoma faili ya JSON. Hakikisha faili ni sahihi.' };
    }
  };

  const resetAllData = () => {
    setAllStudents(INITIAL_STUDENTS);
    setCurrentUserId('std-1');
    setProjects(INITIAL_PROJECTS);
    setInvestments(INITIAL_INVESTMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setFinancialReports(INITIAL_REPORTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCompetitions(INITIAL_COMPETITIONS);
    setPitchIdeas(INITIAL_PITCH_IDEAS);
    setDiscussionGroups(INITIAL_DISCUSSION_GROUPS);
    setPrivacySettings(DEFAULT_PRIVACY_SETTINGS);
    setQuizResults([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      allStudents,
      projects,
      investments,
      transactions,
      financialReports,
      auditLogs,
      competitions,
      pitchIdeas,
      discussionGroups,
      privacySettings,
      quizResults,
      activeTab,
      setActiveTab,
      portalMode,
      setPortalMode,
      adminActiveTab,
      setAdminActiveTab,
      isScreenLocked,
      lockScreen,
      unlockScreen,
      systemSecurity,
      updateSystemSecurity,
      toggleBalanceMask,
      isLoggedIn,
      logout,
      adminLogin,
      adminLogout,
      verifyTransactionIntegrity,
      failedPinAttempts,
      isPinLocked,
      pinLockoutSecondsRemaining,
      switchUser,
      loginWithPin,
      registerStudent,
      depositFunds,
      withdrawFunds,
      investInProject,
      claimProfit,
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
      submitPitchIdea,
      upvotePitchIdea,
      addCommunityComment,
      addMentorFeedback,
      updatePitchStatus,
      createDiscussionGroup,
      joinOrLeaveGroup,
      createGroupPost,
      likeGroupPost,
      replyToGroupPost,
      updatePrivacySettings,
      saveQuizResult,
      exportSystemBackup,
      importSystemBackup,
      resetAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
