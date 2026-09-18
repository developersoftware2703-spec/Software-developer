export type UserRole = 'student' | 'admin';
export type PortalMode = 'student' | 'admin';

export interface SystemSecuritySettings {
  isSystemFrozen: boolean;
  freezeReason?: string;
  autoLockMinutes: number; // 0 = disabled, 2, 5, 10
  balanceMasked: boolean;
  requirePinForSensitiveActions: boolean;
  maxPinAttempts: number;
}

export interface StudentUser {
  id: string;
  fullName: string;
  studentRegNo: string;
  schoolName: string;
  educationLevel: 'Sekondari' | 'Chuo Kikuu' | 'Chuo cha Kati & Ufundi';
  courseOrClass: string; // E.g. 'Kidato cha 1 (Form I)' to 'Kidato cha 6 (Form VI)'
  email: string;
  phone: string;
  guardianPhone?: string;
  guardianConsent?: boolean;
  avatarUrl: string;
  balance: number;
  totalInvested: number;
  totalProfitEarned: number;
  status: 'active' | 'pending_approval' | 'pending_verification' | 'suspended';
  role: UserRole;
  securityPin: string;
  isVerifiedStudent: boolean;
  dateJoined: string;
}

export type ProjectCategory = 
  | 'Kilimo & Mifugo'
  | 'Huduma za Chakula & Canteen'
  | 'Teknolojia & Uchapaji'
  | 'Sanaa & Mavazi ya Shule'
  | 'Nishati Safi & Mazingira';

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
}

export interface InvestmentProject {
  id: string;
  title: string;
  category: ProjectCategory;
  schoolName: string;
  description: string;
  teamLead: string;
  teamMembersCount: number;
  targetAmount: number;
  collectedAmount: number;
  minInvestment: number;
  maxInvestmentPerStudent: number;
  roiPercentage: number; // e.g. 20 means 20% profit return
  cycleDays: number;
  startDate: string;
  endDate: string;
  status: 'funding' | 'in_progress' | 'completed' | 'distributing_profits';
  riskLevel: 'Chini' | 'Wastani' | 'Juu';
  imageUrl: string;
  galleryImages: string[];
  updates: ProjectUpdate[];
  financialSummary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
  };
}

export interface UserInvestment {
  id: string;
  studentId: string;
  studentName: string;
  projectId: string;
  projectTitle: string;
  projectCategory: ProjectCategory;
  amount: number;
  expectedProfit: number;
  profitEarned: number;
  investedAt: string;
  maturityDate: string;
  status: 'active' | 'matured' | 'withdrawn';
  cycleDays: number;
  transactionRef: string;
}

export type TransactionType = 'deposit' | 'invest' | 'profit_payout' | 'withdrawal' | 'project_refund';
export type TransactionStatus = 'completed' | 'pending' | 'rejected';

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  method: 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Halopesa' | 'School Bursar Voucher' | 'Wallet';
  phoneOrAccount: string;
  referenceCode: string;
  securityHash: string;
  timestamp: string;
  description: string;
  adminNotes?: string;
}

export interface FinancialReportItem {
  id: string;
  type: 'income' | 'expense';
  category: string;
  title: string;
  amount: number;
  date: string;
  projectId?: string;
  projectName?: string;
  recordedBy: string;
  receiptNumber?: string;
  notes?: string;
}

export interface SecurityAuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  ipMasked: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface UserPrivacySettings {
  hideExactAmounts: boolean;
  isAnonymous: boolean;
  hideSchoolName: boolean;
  portfolioVisibility: 'public' | 'school' | 'private';
}

export interface MentorFeedback {
  mentorName: string;
  mentorRole: string;
  date: string;
  scores: {
    innovation: number; // out of 25
    feasibility: number; // out of 25
    socialImpact: number; // out of 25
    financialViability: number; // out of 25
    total: number; // out of 100
  };
  comments: string;
  recommendation: string;
}

export interface CommunityComment {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  schoolName: string;
  comment: string;
  timestamp: string;
}

export interface PitchIdea {
  id: string;
  competitionId: string;
  title: string;
  category: ProjectCategory;
  studentId: string;
  studentName: string;
  schoolName: string;
  problemStatement: string;
  solutionDescription: string;
  targetMarket: string;
  seedFundingRequired: number;
  teamMembers: string[];
  pitchDeckUrl?: string;
  videoDemoUrl?: string;
  imageUrl: string;
  submittedAt: string;
  status: 'under_review' | 'mentored' | 'finalist' | 'winner';
  upvotesCount: number;
  upvotedBy: string[];
  mentorFeedback?: MentorFeedback;
  communityComments: CommunityComment[];
}

export interface CompetitionPrize {
  position: string;
  prize: string;
  description: string;
}

export interface EvaluationCriterion {
  criterion: string;
  percentage: number;
  description: string;
}

export interface EntrepreneurshipCompetition {
  id: string;
  title: string;
  organizer: string;
  badge: string;
  description: string;
  deadline: string;
  totalPrizePool: number;
  prizes: CompetitionPrize[];
  evaluationRubric: EvaluationCriterion[];
  status: 'open' | 'evaluating' | 'completed';
  winnerPitchId?: string;
  bannerUrl: string;
}

export interface GroupPostReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorSchool: string;
  title: string;
  content: string;
  timestamp: string;
  likesCount: number;
  likedBy: string[];
  tags: string[];
  replies: GroupPostReply[];
}

export interface DiscussionGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  memberCount: number;
  members: string[];
  createdBy: string;
  createdAt: string;
  posts: GroupPost[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  content: string[];
  keyTakeaways: string[];
  practicalTask: string;
}

export interface AcademyModule {
  id: string;
  title: string;
  category?: string;
  description: string;
  durationMinutes: number;
  level: 'Mwanzoni' | 'Wastani' | 'Juu';
  icon: string;
  lessons: AcademyLesson[];
  quiz: {
    id: string;
    title?: string;
    passingScorePercentage?: number;
    questions: QuizQuestion[];
  };
}

export interface AcademyResource {
  id: string;
  type: 'article' | 'video' | 'toolkit' | 'guide';
  title: string;
  category: string;
  readOrWatchTime: string;
  author: string;
  description: string;
  contentUrl?: string;
  fileFormat?: string;
  downloadCount?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  bodyContent?: string;
  content?: string;
}

export interface QuizResult {
  id?: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  percentage?: number;
  passed: boolean;
  completedAt: string;
  completionDate?: string;
  certificateId?: string;
}

