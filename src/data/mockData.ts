import { 
  StudentUser, 
  InvestmentProject, 
  UserInvestment, 
  Transaction, 
  FinancialReportItem, 
  SecurityAuditLog 
} from '../types';

export const INITIAL_STUDENTS: StudentUser[] = [
  {
    id: 'std-1',
    fullName: 'Baraka Juma Mwamba',
    studentRegNo: 'AZA/2024/0412',
    schoolName: 'Sekondari ya Wavulana Azania - Dar es Salaam',
    educationLevel: 'Sekondari',
    courseOrClass: 'Kidato cha 5 (PCB)',
    email: 'baraka.mwamba@student.tz',
    phone: '+255 712 345 678',
    guardianPhone: '+255 713 111 222',
    guardianConsent: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    balance: 85000,
    totalInvested: 120000,
    totalProfitEarned: 24500,
    status: 'active',
    role: 'student',
    securityPin: '1234',
    isVerifiedStudent: true,
    dateJoined: '2024-02-10',
  },
  {
    id: 'std-2',
    fullName: 'Neema Emmanuel Lyimo',
    studentRegNo: 'JNG/2024/0284',
    schoolName: 'Sekondari ya Wasichana Jangwani - Dar es Salaam',
    educationLevel: 'Sekondari',
    courseOrClass: 'Kidato cha 3 (Sayansi)',
    email: 'neema.lyimo@student.tz',
    phone: '+255 754 987 654',
    guardianPhone: '+255 755 333 444',
    guardianConsent: true,
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    balance: 140000,
    totalInvested: 250000,
    totalProfitEarned: 52000,
    status: 'active',
    role: 'student',
    securityPin: '4321',
    isVerifiedStudent: true,
    dateJoined: '2023-11-05',
  },
  {
    id: 'std-3',
    fullName: 'Kelvin Richard Massawe',
    studentRegNo: 'TAM/2024/0981',
    schoolName: 'Sekondari ya Tambaza - Dar es Salaam',
    educationLevel: 'Sekondari',
    courseOrClass: 'Kidato cha 6 (EGM)',
    email: 'kelvin.massawe@student.tz',
    phone: '+255 788 123 456',
    guardianPhone: '+255 789 555 666',
    guardianConsent: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    balance: 35000,
    totalInvested: 80000,
    totalProfitEarned: 16000,
    status: 'active',
    role: 'student',
    securityPin: '2024',
    isVerifiedStudent: true,
    dateJoined: '2024-03-15',
  },
  {
    id: 'std-4',
    fullName: 'Zawadi Josephat Mrema',
    studentRegNo: 'KLK/2024/0115',
    schoolName: 'Sekondari ya Wasichana Kilakala - Morogoro',
    educationLevel: 'Sekondari',
    courseOrClass: 'Kidato cha 2 (Form II)',
    email: 'zawadi.mrema@student.tz',
    phone: '+255 765 432 109',
    guardianPhone: '+255 767 888 999',
    guardianConsent: true,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    balance: 10000,
    totalInvested: 0,
    totalProfitEarned: 0,
    status: 'pending_approval',
    role: 'student',
    securityPin: '1122',
    isVerifiedStudent: false,
    dateJoined: '2024-04-01',
  },
  {
    id: 'std-admin',
    fullName: 'Mwl. Josephat Msemwa (Mratibu Mkuu wa Miradi)',
    studentRegNo: 'STAFF/ADM/001',
    schoolName: 'Bodi ya Uratibu wa Miradi ya Sekondari (Student Ventures)',
    educationLevel: 'Sekondari',
    courseOrClass: 'Mratibu Mkuu wa Miradi & Bursar wa Shule',
    email: 'admin.ventures@elimu.go.tz',
    phone: '+255 713 000 111',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    balance: 2450000,
    totalInvested: 0,
    totalProfitEarned: 0,
    status: 'active',
    role: 'admin',
    securityPin: '9999',
    isVerifiedStudent: true,
    dateJoined: '2023-01-01',
  }
];

export const INITIAL_PROJECTS: InvestmentProject[] = [
  {
    id: 'proj-1',
    title: 'Mradi wa Kuku wa Mayai & Nyama (Poultry Farm)',
    category: 'Kilimo & Mifugo',
    schoolName: 'Sekondari ya Wavulana Azania',
    description: 'Mradi unaosimamiwa na wanafunzi wa Klabu ya Kilimo Azania. Ufugaji wa kuku 600 wa mayai na kuku 400 wa kienyeji. Mayai yanauzwa moja kwa moja kwenye canteen ya shule na maduka ya walimu na jamii ya jirani.',
    teamLead: 'Hassan Said (Kidato cha 5)',
    teamMembersCount: 8,
    targetAmount: 3500000,
    collectedAmount: 2850000,
    minInvestment: 5000,
    maxInvestmentPerStudent: 200000,
    roiPercentage: 22, // 22% faida baada ya mzunguko
    cycleDays: 60,
    startDate: '2024-08-01',
    endDate: '2024-10-01',
    status: 'funding',
    riskLevel: 'Chini',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80'
    ],
    updates: [
      {
        id: 'upd-1',
        date: '2024-08-15',
        title: 'Banda la Kuku Limekamilika & Vifaa Vimenunuliwa',
        description: 'Tumenunua vyombo vya maji na chakula kutoka kwa fedha za wawekezaji wa awali. Kuku wa mwanzo wamewasili kwa afya njema.',
        author: 'Hassan Said (Kiongozi wa Mradi)'
      },
      {
        id: 'upd-2',
        date: '2024-09-02',
        title: 'Mkataba wa Ugavi na Canteen ya Shule',
        description: 'Tumefunga makubaliano ya kuuza trela 15 za mayai kila wiki kwa bei maalum ya jumla inayotuhakikishia faida ya 22%.',
        author: 'Mwl. Kilimo Mshauri'
      }
    ],
    financialSummary: {
      totalRevenue: 1420000,
      totalExpenses: 780000,
      netProfit: 640000
    }
  },
  {
    id: 'proj-2',
    title: 'Baking & Canteen Snacks Hub - UDSM',
    category: 'Huduma za Chakula & Canteen',
    schoolName: 'Chuo Kikuu cha Dar es Salaam (UDSM)',
    description: 'Mradi wa kutengeneza vitafunwa bora vya asubuhi (keki, sambusa, chapati za ngano, juisi za matunda fresh) kwa ajili ya wanafunzi na wahadhiri kwenye Hosteli za Mabibo na CoICT.',
    teamLead: 'Neema Emmanuel (Mwaka wa 2)',
    teamMembersCount: 6,
    targetAmount: 2000000,
    collectedAmount: 2000000, // fully funded
    minInvestment: 10000,
    maxInvestmentPerStudent: 150000,
    roiPercentage: 25,
    cycleDays: 45,
    startDate: '2024-07-15',
    endDate: '2024-08-30',
    status: 'in_progress',
    riskLevel: 'Chini',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    updates: [
      {
        id: 'upd-3',
        date: '2024-08-10',
        title: 'Mauzo Yamevuka Lengo kwa 18%',
        description: 'Uhitaji wa juisi na vitafunwa ulikuwa mkubwa wakati wa mitihani ya majaribio ya katikati ya muhula.',
        author: 'Neema Emmanuel'
      }
    ],
    financialSummary: {
      totalRevenue: 2890000,
      totalExpenses: 1850000,
      netProfit: 1040000
    }
  },
  {
    id: 'proj-3',
    title: 'Campus Fast-Print & Stationery Co-op',
    category: 'Teknolojia & Uchapaji',
    schoolName: 'Sekondari ya Tambaza',
    description: 'Kituo cha kisasa cha uchapaji wa mitihani ya majaribio, vitini, bind na vifaa vya shule kwa gharama nafuu kwa wanafunzi na walimu. Mashine 2 za kisasa za laser printing na photocopy.',
    teamLead: 'Kelvin Massawe',
    teamMembersCount: 5,
    targetAmount: 4200000,
    collectedAmount: 3100000,
    minInvestment: 5000,
    maxInvestmentPerStudent: 250000,
    roiPercentage: 20,
    cycleDays: 90,
    startDate: '2024-08-10',
    endDate: '2024-11-10',
    status: 'funding',
    riskLevel: 'Chini',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    updates: [
      {
        id: 'upd-4',
        date: '2024-08-25',
        title: 'Printa Mpya Imefungwa Shuleni',
        description: 'Mashine ya Heavy-Duty Duplicator imewasili na wanafunzi 2 wamefundishwa usimamizi na kurekodi miamala.',
        author: 'Kelvin Massawe'
      }
    ],
    financialSummary: {
      totalRevenue: 980000,
      totalExpenses: 420000,
      netProfit: 560000
    }
  },
  {
    id: 'proj-4',
    title: 'Greenhouse Hydroponic Vegetables - Shule ya Sekondari Kibasila',
    category: 'Kilimo & Mifugo',
    schoolName: 'Sekondari ya Kibasila',
    description: 'Uzalishaji wa nyanya, hoho na tango kwa kutumia teknolojia ya kisasa ya Greenhouse inayookoa maji kwa 80%. Mazao yanauzwa kwa walimu, wazazi na soko la Temeke.',
    teamLead: 'Salma Ally (Kidato cha 4)',
    teamMembersCount: 7,
    targetAmount: 2800000,
    collectedAmount: 2800000,
    minInvestment: 10000,
    maxInvestmentPerStudent: 180000,
    roiPercentage: 28,
    cycleDays: 75,
    startDate: '2024-06-01',
    endDate: '2024-08-15',
    status: 'distributing_profits',
    riskLevel: 'Wastani',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'
    ],
    updates: [
      {
        id: 'upd-5',
        date: '2024-08-16',
        title: 'Mavuno Yamekamilika - Gawio la Faida Linaanza',
        description: 'Faida ya 28% imethibitishwa na uongozi baada ya ukaguzi wa fedha. Wawekezaji wote wanaanza kupokea gawio kwenye pochi zao.',
        author: 'Salma Ally'
      }
    ],
    financialSummary: {
      totalRevenue: 4120000,
      totalExpenses: 2150000,
      netProfit: 1970000
    }
  },
  {
    id: 'proj-5',
    title: 'Solar Study Hub & PowerBank Rental',
    category: 'Nishati Safi & Mazingira',
    schoolName: 'Taasisi ya Teknolojia DIT',
    description: 'Ufungaji wa vituo vidogo vya umeme wa jua (solar kiosks) katika maeneo ya bustani za shule kuruhusu wanafunzi kuchaji simu na kompyuta mpakato na kukodisha powerbank wakati wa kukatika kwa umeme.',
    teamLead: 'Davis Robert',
    teamMembersCount: 4,
    targetAmount: 1800000,
    collectedAmount: 950000,
    minInvestment: 5000,
    maxInvestmentPerStudent: 100000,
    roiPercentage: 18,
    cycleDays: 60,
    startDate: '2024-09-01',
    endDate: '2024-11-01',
    status: 'funding',
    riskLevel: 'Chini',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    updates: [
      {
        id: 'upd-6',
        date: '2024-09-05',
        title: 'Sola Paneli 4 Za Awali Zimenunuliwa',
        description: 'Vifaa vimewasili na wanafunzi wa uhandisi wa umeme wameanza ufungaji kwenye bustani ya maktaba.',
        author: 'Davis Robert'
      }
    ],
    financialSummary: {
      totalRevenue: 340000,
      totalExpenses: 210000,
      netProfit: 130000
    }
  }
];

export const INITIAL_INVESTMENTS: UserInvestment[] = [
  {
    id: 'inv-1',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    projectId: 'proj-1',
    projectTitle: 'Mradi wa Kuku wa Mayai & Nyama (Poultry Farm)',
    projectCategory: 'Kilimo & Mifugo',
    amount: 50000,
    expectedProfit: 11000, // 22%
    profitEarned: 0,
    investedAt: '2024-08-05',
    maturityDate: '2024-10-04',
    status: 'active',
    cycleDays: 60,
    transactionRef: 'TXN-INV-9921'
  },
  {
    id: 'inv-2',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    projectId: 'proj-4',
    projectTitle: 'Greenhouse Hydroponic Vegetables - Shule ya Sekondari Kibasila',
    projectCategory: 'Kilimo & Mifugo',
    amount: 70000,
    expectedProfit: 19600, // 28%
    profitEarned: 19600,
    investedAt: '2024-06-02',
    maturityDate: '2024-08-16',
    status: 'matured',
    cycleDays: 75,
    transactionRef: 'TXN-INV-4412'
  },
  {
    id: 'inv-3',
    studentId: 'std-2',
    studentName: 'Neema Emmanuel Lyimo',
    projectId: 'proj-2',
    projectTitle: 'Baking & Canteen Snacks Hub - UDSM',
    projectCategory: 'Huduma za Chakula & Canteen',
    amount: 150000,
    expectedProfit: 37500, // 25%
    profitEarned: 0,
    investedAt: '2024-07-16',
    maturityDate: '2024-08-30',
    status: 'active',
    cycleDays: 45,
    transactionRef: 'TXN-INV-7718'
  },
  {
    id: 'inv-4',
    studentId: 'std-3',
    studentName: 'Kelvin Richard Massawe',
    projectId: 'proj-3',
    projectTitle: 'Campus Fast-Print & Stationery Co-op',
    projectCategory: 'Teknolojia & Uchapaji',
    amount: 80000,
    expectedProfit: 16000, // 20%
    profitEarned: 0,
    investedAt: '2024-08-12',
    maturityDate: '2024-11-10',
    status: 'active',
    cycleDays: 90,
    transactionRef: 'TXN-INV-8122'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-101',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    type: 'deposit',
    amount: 100000,
    status: 'completed',
    method: 'M-Pesa',
    phoneOrAccount: '+255 712 *** *78',
    referenceCode: 'QD89KL2291',
    securityHash: 'sha256:4a8f9c10...b92e',
    timestamp: '2024-08-04 09:30',
    description: 'Kuweka fedha mfukoni (Wallet Deposit) kupitia M-Pesa'
  },
  {
    id: 'txn-102',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    type: 'invest',
    amount: 50000,
    status: 'completed',
    method: 'Wallet',
    phoneOrAccount: 'Pochi ya Mwanafunzi',
    referenceCode: 'TXN-INV-9921',
    securityHash: 'sha256:91fc82d1...33a1',
    timestamp: '2024-08-05 11:15',
    description: 'Uwekezaji katika: Mradi wa Kuku wa Mayai & Nyama'
  },
  {
    id: 'txn-103',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    type: 'profit_payout',
    amount: 19600,
    status: 'completed',
    method: 'Wallet',
    phoneOrAccount: 'Pochi ya Mwanafunzi',
    referenceCode: 'TXN-DIV-4412',
    securityHash: 'sha256:77b102ce...e411',
    timestamp: '2024-08-17 14:00',
    description: 'Gawio la Faida (28%) kutoka Mradi wa Greenhouse Kibasila'
  },
  {
    id: 'txn-104',
    studentId: 'std-2',
    studentName: 'Neema Emmanuel Lyimo',
    type: 'deposit',
    amount: 200000,
    status: 'completed',
    method: 'Tigo Pesa',
    phoneOrAccount: '+255 754 *** *54',
    referenceCode: 'TG55019284',
    securityHash: 'sha256:aa23ff41...9802',
    timestamp: '2024-07-15 16:45',
    description: 'Kuweka fedha mtandaoni kupitia Tigo Pesa'
  },
  {
    id: 'txn-105',
    studentId: 'std-3',
    studentName: 'Kelvin Richard Massawe',
    type: 'withdrawal',
    amount: 25000,
    status: 'pending', // Pending Admin Approval!
    method: 'Airtel Money',
    phoneOrAccount: '+255 788 *** *56',
    referenceCode: 'WDR-9021-REQ',
    securityHash: 'sha256:6e5d22ba...f120',
    timestamp: '2024-09-18 08:20',
    description: 'Ombi la kutoa fedha kwenda Airtel Money (Inasubiri Idhini ya Admin)'
  },
  {
    id: 'txn-106',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    type: 'deposit',
    amount: 35000,
    status: 'pending', // Pending Admin Approval!
    method: 'School Bursar Voucher',
    phoneOrAccount: 'VOUCHER-AZN-882',
    referenceCode: 'DEP-8821-BUR',
    securityHash: 'sha256:11bb890c...77da',
    timestamp: '2024-09-18 10:15',
    description: 'Hati ya fedha taslimu kutoka kwa Mhasibu wa Shule (Bursar)'
  }
];

export const INITIAL_REPORTS: FinancialReportItem[] = [
  {
    id: 'rep-1',
    type: 'income',
    category: 'Mauzo ya Mayai',
    title: 'Mauzo ya Trela 40 za Mayai kwa Shule',
    amount: 480000,
    date: '2024-08-20',
    projectId: 'proj-1',
    projectName: 'Mradi wa Kuku wa Mayai & Nyama',
    recordedBy: 'Mweka Hazina wa Wanafunzi',
    receiptNumber: 'REC-AZN-2024-01'
  },
  {
    id: 'rep-2',
    type: 'expense',
    category: 'Chakula cha Mifugo',
    title: 'Mifuko 6 ya Chakula cha Kuku (Layers Mash)',
    amount: 320000,
    date: '2024-08-22',
    projectId: 'proj-1',
    projectName: 'Mradi wa Kuku wa Mayai & Nyama',
    recordedBy: 'Kiongozi wa Mradi',
    receiptNumber: 'EXP-FEED-9901'
  },
  {
    id: 'rep-3',
    type: 'income',
    category: 'Mauzo ya Vitafunwa',
    title: 'Mapato ya Wiki ya Vitafunwa na Juisi Canteen',
    amount: 720000,
    date: '2024-08-25',
    projectId: 'proj-2',
    projectName: 'Baking & Canteen Snacks Hub - UDSM',
    recordedBy: 'Neema Emmanuel',
    receiptNumber: 'REC-UDSM-8821'
  },
  {
    id: 'rep-4',
    type: 'expense',
    category: 'Malighafi & Vifungashio',
    title: 'Unga wa Ngano, Sukari, Mafuta & Vifungashio vya Karatasi',
    amount: 410000,
    date: '2024-08-26',
    projectId: 'proj-2',
    projectName: 'Baking & Canteen Snacks Hub - UDSM',
    recordedBy: 'Neema Emmanuel',
    receiptNumber: 'EXP-RAW-3321'
  },
  {
    id: 'rep-5',
    type: 'income',
    category: 'Huduma za Uchapaji',
    title: 'Uchapaji wa Mitihani ya Majaribio (Mock Exams)',
    amount: 540000,
    date: '2024-08-28',
    projectId: 'proj-3',
    projectName: 'Campus Fast-Print & Stationery Co-op',
    recordedBy: 'Kelvin Massawe',
    receiptNumber: 'REC-PRNT-4402'
  },
  {
    id: 'rep-6',
    type: 'expense',
    category: 'Vifaa vya Printa',
    title: 'Cartridge za Rangi & Rimu 15 za Karatasi A4',
    amount: 225000,
    date: '2024-08-29',
    projectId: 'proj-3',
    projectName: 'Campus Fast-Print & Stationery Co-op',
    recordedBy: 'Kelvin Massawe',
    receiptNumber: 'EXP-INK-1109'
  },
  {
    id: 'rep-7',
    type: 'income',
    category: 'Mavuno ya Nyanya & Hoho',
    title: 'Uuzaji wa Vikapu 25 vya Nyanya Soko la Temeke',
    amount: 980000,
    date: '2024-08-14',
    projectId: 'proj-4',
    projectName: 'Greenhouse Hydroponic Vegetables Kibasila',
    recordedBy: 'Salma Ally',
    receiptNumber: 'REC-VEG-9902'
  },
  {
    id: 'rep-8',
    type: 'expense',
    category: 'Mbolea Asilia & Dawa za Mazao',
    title: 'Mbolea ya Maji na Kinga ya Wadudu Asilia',
    amount: 140000,
    date: '2024-08-10',
    projectId: 'proj-4',
    projectName: 'Greenhouse Hydroponic Vegetables Kibasila',
    recordedBy: 'Salma Ally',
    receiptNumber: 'EXP-FERT-5511'
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    action: 'USER_LOGIN_PIN_VERIFIED',
    actorName: 'Baraka Juma Mwamba (Student)',
    actorRole: 'student',
    timestamp: '2024-09-18 07:15:22',
    ipMasked: '197.250.***.14',
    status: 'SUCCESS',
    details: 'Mwanafunzi aliingia kwa mafanikio kupitia uthibitishaji wa PIN ya tarakimu 4.'
  },
  {
    id: 'log-2',
    action: 'INVESTMENT_LOCKED',
    actorName: 'Baraka Juma Mwamba',
    actorRole: 'student',
    timestamp: '2024-08-05 11:15:02',
    ipMasked: '197.250.***.14',
    status: 'SUCCESS',
    details: 'Uwekezaji wa TZS 50,000 ulithibitishwa na kufungwa kwenye mkataba wa mradi TXN-INV-9921.'
  },
  {
    id: 'log-3',
    action: 'ADMIN_DIVIDEND_PAYOUT',
    actorName: 'Mwl. Josephat Msemwa',
    actorRole: 'admin',
    timestamp: '2024-08-17 14:00:00',
    ipMasked: '41.59.***.89',
    status: 'SUCCESS',
    details: 'Usambazaji wa gawio la faida la 28% kwa wanafunzi wawekezaji 22 ulikamilishwa.'
  },
  {
    id: 'log-4',
    action: 'SECURITY_PIN_ATTEMPT',
    actorName: 'Kelvin Richard Massawe',
    actorRole: 'student',
    timestamp: '2024-09-18 08:19:40',
    ipMasked: '197.250.***.62',
    status: 'SUCCESS',
    details: 'PIN sahihi iliwekwa kwa ombi la kutoa fedha.'
  }
];
