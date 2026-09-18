import { 
  EntrepreneurshipCompetition, 
  PitchIdea, 
  DiscussionGroup, 
  AcademyModule, 
  AcademyResource,
  UserPrivacySettings
} from '../types';

export const DEFAULT_PRIVACY_SETTINGS: UserPrivacySettings = {
  hideExactAmounts: false,
  isAnonymous: false,
  hideSchoolName: false,
  portfolioVisibility: 'public'
};

export const INITIAL_COMPETITIONS: EntrepreneurshipCompetition[] = [
  {
    id: 'comp-1',
    title: 'Shindano la Kitaifa la Ujasiriamali wa Wanafunzi 2026',
    organizer: 'Bodi ya StudentVentures & Wizara ya Elimu',
    badge: 'Shindano Kuu la Mwaka',
    description: 'Shindano linalowaleta pamoja wanafunzi wenye mawazo bunifu ya kibiashara yanayotatua changamoto za kijamii na shuleni. Washindi watapokea mtaji wa kuanzia (Seed Capital), vyeti vya heshima, na ushauri wa kitaalamu wa miezi 6.',
    deadline: '2026-05-30',
    totalPrizePool: 10000000,
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    status: 'open',
    prizes: [
      {
        position: 'Mshindi wa 1 (Tuzo ya Dhahabu)',
        prize: 'TZS 5,000,000',
        description: 'Mtaji wa moja kwa moja + Miezi 6 ya ushauri na kuelekezwa na wakurugenzi wa makampuni + Kombe la Kitaifa'
      },
      {
        position: 'Mshindi wa 2 (Tuzo ya Fedha)',
        prize: 'TZS 3,000,000',
        description: 'Mtaji wa kukuza mradi + Mafunzo ya uongozi na masoko + Cheti cha Ubunifu wa Kitaifa'
      },
      {
        position: 'Mshindi wa 3 (Tuzo ya Shaba)',
        prize: 'TZS 2,000,000',
        description: 'Mtaji wa ununuzi wa vifaa vya uzalishaji + Mwongozo wa uendelevu wa mradi'
      }
    ],
    evaluationRubric: [
      {
        criterion: 'Ubunifu na Uhalisi wa Wazo (Innovation & Originality)',
        percentage: 25,
        description: 'Kiwango ambacho wazo linatatua tatizo kwa namna mpya au yenye ufanisi zaidi kuliko njia zilizopo.'
      },
      {
        criterion: 'Utekelezaji na Uwezekano wa Mradi (Feasibility & Execution)',
        percentage: 25,
        description: 'Uhalisia wa bajeti, uwezo wa timu kutekeleza shuleni, na matumizi ya rasilimali zilizopo.'
      },
      {
        criterion: 'Athari kwa Jamii na Mazingira (Social & Environmental Impact)',
        percentage: 25,
        description: 'Jinsi mradi unavyosaidia wanafunzi, shule, au kutunza mazingira na kutoa ajira ndogondogo.'
      },
      {
        criterion: 'Uendelevu wa Kifedha na Mpango wa Mauzo (Financial Viability)',
        percentage: 25,
        description: 'Uwazi wa mfumo wa mapato, uwezo wa kurudisha faida, na njia ya kuendelea kujiendesha bila kutegemea misaada.'
      }
    ]
  },
  {
    id: 'comp-2',
    title: 'Changamoto ya Vijana katika Kilimo-Biashara & Mazingira',
    organizer: 'Mtandao wa Vijana Wakulima & Azania Agri-Hub',
    badge: 'Kilimo Endelevu',
    description: 'Mashindano ya kukuza miradi ya ufugaji wa kisasa, kilimo cha mbogamboga kwa teknolojia nafuu, na uzalishaji wa chakula salama mashuleni.',
    deadline: '2026-06-15',
    totalPrizePool: 5000000,
    bannerUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a47?auto=format&fit=crop&w=1000&q=80',
    status: 'open',
    prizes: [
      {
        position: 'Mshindi wa 1',
        prize: 'TZS 2,500,000',
        description: 'Kifurushi cha mbegu bora, mifumo ya umwagiliaji na mtaji wa kuanzia'
      },
      {
        position: 'Mshindi wa 2',
        prize: 'TZS 1,500,000',
        description: 'Vifaa vya ufugaji wa kuku na mafunzo ya afya ya mifugo'
      },
      {
        position: 'Mshindi wa 3',
        prize: 'TZS 1,000,000',
        description: 'Msaada wa kitaalamu na ufungaji wa kisasa'
      }
    ],
    evaluationRubric: [
      {
        criterion: 'Uzalishaji na Mavuno',
        percentage: 30,
        description: 'Kiasi na ubora wa mazao yanayotarajiwa kupatikana.'
      },
      {
        criterion: 'Uhifadhi wa Mazingira',
        percentage: 30,
        description: 'Matumizi ya mbolea za asili na utunzaji wa vyanzo vya maji.'
      },
      {
        criterion: 'Upatikanaji wa Soko Shuleni',
        percentage: 40,
        description: 'Uwezo wa kuuza kwa canteen na jumuiya ya shule.'
      }
    ]
  }
];

export const INITIAL_PITCH_IDEAS: PitchIdea[] = [
  {
    id: 'pitch-1',
    competitionId: 'comp-1',
    title: 'Eco-Briquettes: Mkaa Mbadala Kutokana na Mabaki ya Mazao',
    category: 'Nishati Safi & Mazingira',
    studentId: 'std-2',
    studentName: 'Neema Emmanuel Lyimo',
    schoolName: 'Chuo Kikuu cha Dar es Salaam (UDSM)',
    problemStatement: 'Matumizi makubwa ya mkaa wa miti yanasababisha ukataji mkubwa wa misitu na gharama kubwa za nishati kwa jikoni za shule na canteens za wanafunzi.',
    solutionDescription: 'Tunakusanya mabaki ya maganda ya mpunga, pumba za mahindi na majani makavu na kuyashindilia kutengeneza mkaa usio na moshi unaowaka kwa muda mrefu zaidi ya mkaa wa kawaida kwa nusu ya bei.',
    targetMarket: 'Majiko ya vyuo, canteens za sekondari, na wauza vyakula mitaani jirani na maeneo ya shule.',
    seedFundingRequired: 2000000,
    teamMembers: ['Neema Emmanuel', 'Salim Bakari', 'Grace Temu'],
    pitchDeckUrl: 'https://docs.google.com/presentation/d/demo-pitch-deck',
    videoDemoUrl: 'https://youtu.be/demo-pitch-student',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-03-01',
    status: 'finalist',
    upvotesCount: 48,
    upvotedBy: ['std-1', 'std-3'],
    mentorFeedback: {
      mentorName: 'Dkt. Faustine Kavishe',
      mentorRole: 'Mtaalamu Mshauri wa Nishati Jadidifu & Mhadhiri Mshiriki',
      date: '2026-03-05',
      scores: {
        innovation: 24,
        feasibility: 23,
        socialImpact: 25,
        financialViability: 23,
        total: 95
      },
      comments: 'Wazo zuri sana na lina athari ya moja kwa moja kwenye mazingira. Nimevutiwa na jinsi mlivyofanya majaribio ya kwanza kwenye jiko la canteen ya UDSM. Hakikisheni mnahifadhi malighafi mahali pakavu ili kuepuka unyevu wakati wa mvua.',
      recommendation: 'Inapendekezwa kwa hatua ya fainali ya kitaifa. Ina uwezekano mkubwa wa kushinda tuzo kuu.'
    },
    communityComments: [
      {
        id: 'comm-1',
        studentId: 'std-1',
        studentName: 'Baraka Juma Mwamba',
        studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        schoolName: 'Sekondari ya Azania',
        comment: 'Hongera sana Neema! Huu mkaa ungetusaidia sana hata kwenye jiko la shule yetu Azania. Ningependa kuwekeza pindi mradi utakapoingia sokoni!',
        timestamp: '2026-03-06 10:14'
      },
      {
        id: 'comm-2',
        studentId: 'std-3',
        studentName: 'Kelvin Richard Massawe',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        schoolName: 'Sekondari ya Tambaza',
        comment: 'Kazi nzuri! Swali langu: Je mashine mnayotumia kushindilia inatumia umeme au ya mkono (manual)?',
        timestamp: '2026-03-07 14:22'
      }
    ]
  },
  {
    id: 'pitch-2',
    competitionId: 'comp-1',
    title: 'Smart Aquaponics: Mbogamboga na Samaki Shuleni',
    category: 'Kilimo & Mifugo',
    studentId: 'std-3',
    studentName: 'Kelvin Richard Massawe',
    schoolName: 'Sekondari ya Tambaza - Dar es Salaam',
    problemStatement: 'Eneo finyu la shule za mijini linazuia wanafunzi kujifunza kilimo cha vitendo, huku mboga safi zikiwa na gharama kubwa sokoni.',
    solutionDescription: 'Ufungaji wa mfumo wa aquaponics unaounganisha ufugaji wa samaki aina ya sato (tilapia) kwenye tanki dogo na maji yake kutumika kurutubisha mboga za spinachi na nyanya bila udongo.',
    targetMarket: 'Wanafunzi wa bweni, walimu wa shule, na jamii ya maeneo ya karibu.',
    seedFundingRequired: 1500000,
    teamMembers: ['Kelvin Massawe', 'Brian Shayo'],
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-03-08',
    status: 'mentored',
    upvotesCount: 34,
    upvotedBy: ['std-1'],
    mentorFeedback: {
      mentorName: 'Mwl. Josephat Msemwa',
      mentorRole: 'Mratibu Mkuu wa Miradi ya Wanafunzi (StudentVentures)',
      date: '2026-03-12',
      scores: {
        innovation: 23,
        feasibility: 21,
        socialImpact: 22,
        financialViability: 20,
        total: 86
      },
      comments: 'Ubunifu mzuri wa kuutumia mji. Ni muhimu kuweka mpango wa umeme wa dharura (solar pump) ili pampu isizime umeme unapokatika.',
      recommendation: 'Mradi unafaa sana kuunganishwa na mfumo wa uwekezaji wa wanafunzi kwa ajili ya awamu ya kwanza ya ufadhili.'
    },
    communityComments: [
      {
        id: 'comm-3',
        studentId: 'std-2',
        studentName: 'Neema Emmanuel Lyimo',
        studentAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        schoolName: 'UDSM',
        comment: 'Ubunifu mzuri sana Kelvin! Samaki wanahitaji uangalizi wa pH ya maji, mna vifaa vya kupimia maji?',
        timestamp: '2026-03-13 09:30'
      }
    ]
  },
  {
    id: 'pitch-3',
    competitionId: 'comp-1',
    title: 'ShulePrint Hub: Huduma ya Chapisho na Vifaa vya Masomo',
    category: 'Teknolojia & Uchapaji',
    studentId: 'std-1',
    studentName: 'Baraka Juma Mwamba',
    schoolName: 'Sekondari ya Wavulana Azania',
    problemStatement: 'Wanafunzi hutumia muda mwingi na nauli kwenda mitaani kutafuta huduma za ku-print notisi, kufanya photocopy ya mitihani ya zamani na kubana majarida (binding).',
    solutionDescription: 'Kituo cha uchapaji kinachoendeshwa na wanafunzi ndani ya maktaba ya shule chenye printa 2 za kisasa, mashine ya photocopy na wino wa bei nafuu kwa kutumia nishati ya sola.',
    targetMarket: 'Wanafunzi 1,200 wa Azania na walimu 65 wa shule.',
    seedFundingRequired: 1800000,
    teamMembers: ['Baraka Mwamba', 'Hassan Said', 'Ally Rajabu'],
    imageUrl: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80',
    submittedAt: '2026-03-14',
    status: 'under_review',
    upvotesCount: 29,
    upvotedBy: ['std-2'],
    communityComments: [
      {
        id: 'comm-4',
        studentId: 'std-3',
        studentName: 'Kelvin Richard Massawe',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        schoolName: 'Tambaza',
        comment: 'Hii itasaidia mno. Wanafunzi huwa wanapoteza muda mwingi nje ya shule kufuata stationery. Wazo zuri sana!',
        timestamp: '2026-03-15 11:05'
      }
    ]
  }
];

export const INITIAL_DISCUSSION_GROUPS: DiscussionGroup[] = [
  {
    id: 'grp-1',
    name: 'Klabu ya Kilimo-Biashara & Mifugo',
    description: 'Jukwaa la kubadilishana uzoefu kuhusu miradi ya ufugaji kuku, mbogamboga, mbinu za kupunguza vifo vya vifaranga na masoko ya shuleni.',
    category: 'Kilimo & Mifugo',
    iconName: 'Sprout',
    memberCount: 142,
    members: ['std-1', 'std-2', 'std-3'],
    createdBy: 'Mwl. Josephat Msemwa',
    createdAt: '2025-11-10',
    posts: [
      {
        id: 'post-1',
        authorId: 'std-1',
        authorName: 'Baraka Juma Mwamba',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        authorSchool: 'Sekondari ya Azania',
        title: 'Vidokezo vya kupunguza gharama ya chakula cha kuku kwa kutumia mabaki ya canteen',
        content: 'Habari wajasiriamali wenzangu! Katika mradi wetu wa kuku Azania, tumeweza kuokoa 28% ya gharama za chakula kwa kukausha na kusaga mabaki ya mboga na ugali kutoka canteen kisha kuchanganya na chokaa na pumba. Kuku wanataga vizuri sana!',
        timestamp: 'Masaa 3 yaliyopita',
        likesCount: 19,
        likedBy: ['std-2', 'std-3'],
        tags: ['Ufugaji', 'GharamaNafuu', 'AzaniaPoultry'],
        replies: [
          {
            id: 'rep-1',
            authorId: 'std-2',
            authorName: 'Neema Emmanuel',
            authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
            content: 'Njia nzuri sana Baraka! Hakikisheni tu chakula hakina chumvi nyingi au mafuta ya kukaangia kwani yanaweza kuathiri afya ya kuku.',
            timestamp: 'Masaa 2 yaliyopita'
          },
          {
            id: 'rep-2',
            authorId: 'std-3',
            authorName: 'Kelvin Massawe',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            content: 'Asante sana kwa ushauri huu, tutalifanyia kazi pia kwenye mradi wetu hapa Tambaza.',
            timestamp: 'Dakika 45 zilizopita'
          }
        ]
      },
      {
        id: 'post-2',
        authorId: 'std-2',
        authorName: 'Neema Emmanuel Lyimo',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        authorSchool: 'UDSM',
        title: 'Msimu wa mvua na udhibiti wa unyevu mabandani',
        content: 'Kwa wale wanaoendesha miradi ya kuku sasa, msimu wa mvua unakuja. Hakikisheni maranda ya sakafuni hayalowani na weka dawa za kuzuia mafua ya kuku (Coryza) mapema ili kuepuka hasara.',
        timestamp: 'Jana saa 4 usiku',
        likesCount: 14,
        likedBy: ['std-1'],
        tags: ['UshauriWaMifugo', 'AfyaYaKuku'],
        replies: []
      }
    ]
  },
  {
    id: 'grp-2',
    name: 'Young FinTech & Wawekezaji Chipukizi',
    description: 'Majadiliano kuhusu jinsi ya kugawa mtaji (diversification), kuelewa faida ya mzunguko wa uwekezaji, na kuepuka miradi ya ulaghai.',
    category: 'Fedha & Uwekezaji',
    iconName: 'TrendingUp',
    memberCount: 218,
    members: ['std-1', 'std-2', 'std-3'],
    createdBy: 'Baraka Juma Mwamba',
    createdAt: '2025-12-01',
    posts: [
      {
        id: 'post-3',
        authorId: 'std-3',
        authorName: 'Kelvin Richard Massawe',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        authorSchool: 'Tambaza',
        title: 'Kanuni ya 50/30/20 kwa wanafunzi wenye fedha za matumizi (Pocket Money)',
        content: 'Je unajua hata kama unapokea TZS 10,000 kwa wiki unaweza kuwekeza? Tenga TZS 5,000 kwa mahitaji ya lazima (nauli & vitafunwa), TZS 3,000 kwa burudani au dharura, na TZS 2,000 wekeza kwenye mradi wa shule unaotoa faida ya 18-25%. Baada ya mwaka mmoja utashangaa unamiliki kiasi gani!',
        timestamp: 'Siku 2 zilizopita',
        likesCount: 32,
        likedBy: ['std-1', 'std-2'],
        tags: ['AkibaZaWanafunzi', 'MbinuZaKifedha', 'StudentBudget'],
        replies: [
          {
            id: 'rep-3',
            authorId: 'std-1',
            authorName: 'Baraka Juma',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            content: 'Ukweli mtupu Kelvin. Mimi nimeanza na TZS 10,000 tu kwenye mradi wa mayai na sasa nimeongeza hadi TZS 120,000 kwa faida nilizozirejesha (reinvesting)!',
            timestamp: 'Jana saa 10 mchana'
          }
        ]
      }
    ]
  },
  {
    id: 'grp-3',
    name: 'Wajasiriamali wa Huduma za Canteen & Vitafunwa',
    description: 'Mbinu za kupika vitafunwa bora, bei rafiki kwa wanafunzi, na usafi wa hali ya juu unaozingatia kanuni za afya.',
    category: 'Huduma za Chakula & Canteen',
    iconName: 'Coffee',
    memberCount: 95,
    members: ['std-2'],
    createdBy: 'Neema Emmanuel Lyimo',
    createdAt: '2026-01-15',
    posts: [
      {
        id: 'post-4',
        authorId: 'std-2',
        authorName: 'Neema Emmanuel Lyimo',
        authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
        authorSchool: 'UDSM',
        title: 'Kutengeneza Juice za Matunda Halisi (Fresh Juice) badala ya soda',
        content: 'Wanafunzi wengi siku hizi wanapendelea afya. Ukiweka glasi ya juice ya embe au pasheni kwa TZS 1,000, faida yake ni hadi 45% kwa sababu matunda yanapatikana sokoni kwa bei ya jumla.',
        timestamp: 'Siku 3 zilizopita',
        likesCount: 22,
        likedBy: ['std-3'],
        tags: ['ChakulaBora', 'AfyaShuleni'],
        replies: []
      }
    ]
  }
];

export const INITIAL_ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'mod-1',
    title: 'Misingi ya Akiba, Uwekezaji na Faida Mjumuisho',
    description: 'Jifunze nguvu ya kuanza kuwekeza ukiwa mwanafunzi, jinsi faida mjumuisho inavyofanya kazi, na tofauti kati ya kuweka fedha chini ya mto na kuwekeza kwenye miradi.',
    durationMinutes: 25,
    level: 'Mwanzoni',
    icon: 'PiggyBank',
    lessons: [
      {
        id: 'les-1',
        title: 'Tofauti ya Kuweka Akiba (Saving) na Kuwekeza (Investing)',
        content: [
          'Kuweka akiba ni kutenga fedha kwa ajili ya mahitaji ya dharura au ya muda mfupi. Fedha hizo kwa kawaida hazizai au huzaa kiwango kidogo sana kisichofidia mfumuko wa bei (inflation).',
          'Uwekezaji unamaanisha kuweka fedha zako zifanye kazi katika mradi wa uzalishaji au biashara inayozalisha faida halisi. Kadri mradi unavyofanikiwa, ndivyo thamani ya fedha zako inavyoongezeka kupitia gawio la faida (dividends/ROI).',
          'Ukiwa mwanafunzi, unahitaji akiba ndogo ya dharura lakini sehemu kubwa ya ziada inapaswa kuwekezwa ili kujenga nidhamu ya kifedha kabla ya kuhitimu.'
        ],
        keyTakeaways: [
          'Akiba inalinda fedha, lakini uwekezaji unakuza fedha.',
          'Mfumo wa StudentVentures unawawezesha wanafunzi kuwekeza kuanzia kiasi kidogo kama TZS 5,000.',
          'Usiwekeze fedha zote za ada au ada ya mtihani; wekeza kiasi unachoweza kukiacha kikue kwa mzunguko mzima wa mradi.'
        ],
        practicalTask: 'Kadiria kiasi cha fedha unachotumia kwa wiki. Bainisha matumizi yasiyo ya lazima (k.m. vocha za ziada au vitafunwa vya anasa) na panga kuweka nusu yake kwenye uwekezaji.'
      },
      {
        id: 'les-2',
        title: 'Siri ya Faida Mjumuisho (Compound Interest) kwa Vijana',
        content: [
          'Albert Einstein aliwahi kuita faida mjumuisho kuwa ni "maajabu ya nane ya dunia". Ni faida inayopatikana pale faida uliyopata inaporejeshwa tena kwenye uwekezaji ili kuzalisha faida nyingine.',
          'Mfano halisi: Ukiwekeza TZS 50,000 kwa faida ya 20% kwa mzunguko wa siku 90, unapata faida ya TZS 10,000 (Jumla TZS 60,000). Usipotoa hiyo faida na badala yake ukaiwekeza tena, mzunguko unaofuata faida itapigwa kwenye TZS 60,000 na kuwa TZS 12,000!',
          'Kwa miaka 3 ya sekondari au chuo, fedha ndogo inaweza kugeuka kuwa mtaji mkubwa wa kuanzia maisha baada ya masomo.'
        ],
        keyTakeaways: [
          'Kuanza mapema ndiyo silaha kuu ya faida mjumuisho.',
          'Mwanafunzi anayeanza kuwekeza akiwa kidato cha tano atakuwa mbele sana kifedha ikilinganishwa na anayeanza baada ya kuhitimu chuo.',
          'Kujizuia kutumia faida mara moja (delayed gratification) ni tabia ya wawekezaji waliofanikiwa.'
        ],
        practicalTask: 'Tumia kikokotoo cha uwekezaji cha mfumo huu kuona thamani ya kuwekeza TZS 30,000 kwa mizunguko minne mfululizo.'
      }
    ],
    quiz: {
      id: 'quiz-mod-1',
      questions: [
        {
          id: 'q1',
          question: 'Kuna tofauti gani kubwa kati ya kuweka akiba na kuwekeza?',
          options: [
            'Hakuna tofauti yoyote, yote ni kuhifadhi fedha benki.',
            'Kuweka akiba kunalinda fedha bila kuzalisha thamani mpya, wakati uwekezaji unaweka mtaji kufanya kazi ili kupata faida ya ziada.',
            'Kuweka akiba ni kwa watu matajiri pekee na uwekezaji ni kwa wanafunzi.',
            'Uwekezaji hauna faida yoyote mashuleni.'
          ],
          correctOptionIndex: 1,
          explanation: 'Sahihi! Kuweka akiba kunalenga kulinda thamani au dharura, ilhali uwekezaji unakusudia kuongeza thamani ya mtaji kupitia shughuli za uzalishaji.'
        },
        {
          id: 'q2',
          question: 'Faida Mjumuisho (Compound Interest) inamaanisha nini hasa?',
          options: [
            'Kupata mkopo mkubwa kutoka shuleni.',
            'Kutoa fedha zote za mradi mara tu baada ya siku moja.',
            'Kurejesha faida uliyopata ili iungane na mtaji na kuzalisha faida kubwa zaidi katika mzunguko unaofuata.',
            'Kugawana hasara na wanafunzi wengine.'
          ],
          correctOptionIndex: 2,
          explanation: 'Sahihi kabisa! Faida mjumuisho inatokea unaporejesha faida (reinvestment) ili nayo izae faida zaidi.'
        },
        {
          id: 'q3',
          question: 'Mwanafunzi anapaswa kuanza kuwekeza kwa kiasi gani kwenye StudentVentures?',
          options: [
            'Lazima awe na angalau TZS 1,000,000 ndipo akubaliwe.',
            'Kiasi chochote kidogo kuanzia kima cha chini cha mradi (k.m. TZS 5,000 au TZS 10,000) kinachotosha kuanza safari.',
            'Lazima aombe mkopo wa benki kwanza.',
            'Fedha yote ya ada ya muhula.'
          ],
          correctOptionIndex: 1,
          explanation: 'Bora kabisa! Kuanza kidogo na kuwa na nidhamu ya kuendelea ndiyo msingi wa mafanikio ya uwekezaji shuleni.'
        }
      ]
    }
  },
  {
    id: 'mod-2',
    title: 'Kuanzisha na Kujaribu Wazo la Biashara Shuleni (Lean Canvas & MVP)',
    description: 'Jinsi ya kubaini matatizo halisi yanayowakabili wanafunzi, kubuni suluhisho, na kujaribu mradi mdogo wa majaribio (MVP) bila kupoteza fedha nyingi.',
    durationMinutes: 30,
    level: 'Wastani',
    icon: 'Lightbulb',
    lessons: [
      {
        id: 'les-3',
        title: 'Kutambua Fursa na Matatizo ya Wanafunzi Mashuleni',
        content: [
          'Biashara zote zilizofanikiwa huanza kwa kutatua "maumivu" (pain points) ya watu. Shuleni kuna fursa nyingi: foleni ndefu kwenye canteen, uhaba wa notisi na mitihani ya zamani, ukosefu wa matunda safi, au nishati ya kutunza joto la chakula.',
          'Mjasiriamali makini hasemi "nina wazo zuri", bali anasema "kuna wanafunzi 300 wanaosumbuka na shida hii kila siku, na wako tayari kulipa TZS 500 kuitatua".',
          'Ongea na wanafunzi wenzako na walimu kabla ya kuanza uzalishaji ili kuthibitisha kama wako tayari kununua suluhisho lako.'
        ],
        keyTakeaways: [
          'Tatizo zuri la kibiashara ni lile linalotokea mara kwa mara na lenye wateja wanaotaka suluhisho mara moja.',
          'Usiunde bidhaa halafu uanze kutafuta wateja; tafuta wateja wenye shida kwanza halafu uunde suluhisho.',
          'Mazungumzo ya dakika 15 na walaji 10 yanaokoa miezi ya hasara.'
        ],
        practicalTask: 'Orodhesha changamoto tatu unazoziona kila wiki shuleni kwako. Chagua moja unayoweza kuitatua kwa kutumia ujuzi wako au wa kikundi chako.'
      },
      {
        id: 'les-4',
        title: 'Kutengeneza Bidhaa ya Majaribio (Minimum Viable Product - MVP)',
        content: [
          'MVP ni toleo rahisi zaidi la bidhaa yako linalokuruhusu kujaribu sokoni kwa gharama ndogo sana kabla ya kutumia mtaji mkubwa.',
          'Mfano: Ikiwa unataka kuanzisha mradi wa kutengeneza juice za matunda shuleni, usinunue mashine kubwa ya TZS 500,000 siku ya kwanza. Anza na blender ya nyumbani, tengeneza glasi 20 za kwanza, wape wanafunzi na upate maoni yao kuhusu ladha na bei.',
          'Kama watanunua na kusifia, hapo sasa unaweza kuwasilisha wazo kwenye shindano la StudentVentures ili kupata mtaji mkubwa wa ununuzi wa mashine za kisasa.'
        ],
        keyTakeaways: [
          'Lengo la MVP ni kujifunza kwa haraka na kwa gharama nafuu (Fail fast, learn faster).',
          'Maoni ya wateja (feedback) yana thamani kubwa kuliko hisia zako binafsi.',
          'Miradi inayoomba uwekezaji ikiwa tayari ina MVP inapata uaminifu mkubwa kutoka kwa wanafunzi wawekezaji.'
        ],
        practicalTask: 'Andaa mpango wa siku 7 wa kutengeneza toleo la kwanza la wazo lako la biashara kwa bajeti isiyozidi TZS 20,000.'
      }
    ],
    quiz: {
      id: 'quiz-mod-2',
      questions: [
        {
          id: 'q4',
          question: 'Minimum Viable Product (MVP) ina faida gani kubwa kwa mjasiriamali mwanafunzi?',
          options: [
            'Inamwezesha kufanya majaribio ya haraka kwa gharama ndogo na kuthibitisha soko kabla ya kutumia mtaji mkubwa.',
            'Inamfanya aache masomo na kuanza biashara moja kwa moja.',
            'Inamlazimu kununua magari ya kusambazia bidhaa mara moja.',
            'Inamzuia kuongea na wateja wake shuleni.'
          ],
          correctOptionIndex: 0,
          explanation: 'Sahihi! MVP inasaidia kuthibitisha kama wateja wako tayari kulipia suluhisho lako bila kuhatarisha fedha nyingi za mtaji.'
        },
        {
          id: 'q5',
          question: 'Hatua ya kwanza sahihi kabla ya kuwekeza fedha kwenye mradi mpya ni ipi?',
          options: [
            'Kukodisha jengo kubwa la kifahari nje ya shule.',
            'Kuthibitisha tatizo halisi la wateja na kuona kama wako tayari kulipia suluhisho.',
            'Kutumia fedha zote kwenye matangazo ya televisheni.',
            'Kuanza uzalishaji bila kufanya utafiti wowote.'
          ],
          correctOptionIndex: 1,
          explanation: 'Kabisa! Kuelewa uhitaji halisi wa soko ndiyo msingi wa mradi wowote wenye faida.'
        }
      ]
    }
  },
  {
    id: 'mod-3',
    title: 'Usimamizi wa Fedha, Faida na Mtiririko wa Fedha (Cashflow)',
    description: 'Jinsi ya kupanga bei sahihi, kutofautisha mapato ya jumla (Revenue) na faida halisi (Net Profit), na kutunza vitabu vya hesabu shuleni.',
    durationMinutes: 30,
    level: 'Wastani',
    icon: 'Calculator',
    lessons: [
      {
        id: 'les-5',
        title: 'Kutofautisha Mapato Ghafi na Faida Halisi',
        content: [
          'Kosa kubwa linalofanywa na wajasiriamali chipukizi ni kuchanganya fedha zilizoingia kwenye droo (Revenue) na faida halisi inayomilikiwa (Profit).',
          'Mfumo wa hesabu: Mapato Jumla - Gharama za Uzalishaji (Cost of Goods) - Gharama za Uendeshaji = FAIDA HALISI.',
          'Ikiwa uliuza mayai ya TZS 100,000 lakini ulitumia TZS 70,000 kununua chakula cha kuku na madawa, fedha yako halisi ya faida ni TZS 30,000 pekee. TZS 70,000 lazima zirudi kwenye mradi kununua chakula tena!'
        ],
        keyTakeaways: [
          'Usiwahi kutumia mtaji wa kuzungusha kwa matumizi binafsi.',
          'Andika kila senti inayoingia na kutoka kwenye ripoti ya fedha ya StudentVentures.',
          'Gawio la wawekezaji linatolewa kutoka kwenye Faida Halisi baada ya kuondoa gharama zote halisi.'
        ],
        practicalTask: 'Andika mapato na matumizi ya shughuli yoyote ndogo uliyofanya juma lililopita na piga hesabu ya faida halisi.'
      }
    ],
    quiz: {
      id: 'quiz-mod-3',
      questions: [
        {
          id: 'q6',
          question: 'Ikiwa mradi wako umeuza bidhaa za TZS 150,000 lakini gharama za malighafi na usafiri zilikuwa TZS 100,000, faida halisi ni kiasi gani?',
          options: [
            'TZS 150,000',
            'TZS 250,000',
            'TZS 50,000',
            'TZS 0'
          ],
          correctOptionIndex: 2,
          explanation: 'Sahihi! Faida halisi = Mapato (150,000) - Gharama (100,000) = TZS 50,000.'
        }
      ]
    }
  },
  {
    id: 'mod-4',
    title: 'Mbinu za Kuwasilisha Wazo na Kuvutia Mitaji (Pitching & Funding)',
    description: 'Sanaa ya kuwasilisha wazo la biashara kwa majaji na wawekezaji ndani ya dakika 3-5, kuandaa Pitch Deck yenye mvuto, na kujibu maswali magumu.',
    durationMinutes: 20,
    level: 'Juu',
    icon: 'Award',
    lessons: [
      {
        id: 'les-6',
        title: 'Nguzo 5 za Pitch Deck Yenye Kushinda Mashindano',
        content: [
          '1. Tatizo (Problem): Eleza tatizo wazi kwa namba na mifano halisi ya shuleni.',
          '2. Suluhisho (Solution): Bidhaa au huduma yako inavyofanya kazi na kwanini ni bora kuliko nyingine.',
          '3. Ukubwa wa Soko (Market Opportunity): Wanafunzi na walimu wangapi watanunua.',
          '4. Mfano wa Kibiashara (Business Model): Bei yako na jinsi unavyopata faida kwa kila kitengo.',
          '5. Timu & Ombi la Mtaji (Team & Ask): Nani anayeendesha mradi na unahitaji kiasi gani na kitatumika vipi.'
        ],
        keyTakeaways: [
          'Usiweke maneno mengi kwenye slide; tumia picha, michoro na tarakimu.',
          'Fanya mazoezi ya kuwasilisha bila kusoma karatasi ili kuonyesha uelewa na kujiamini.',
          'Kuwa mkweli kuhusu hatari na changamoto; majaji wanathamini uaminifu kuliko ahadi zisizo na uhalisia.'
        ],
        practicalTask: 'Rekodi video ya dakika 2 kwenye simu yako ukijieleza kuhusu mradi unaoutamani na ushiriki na mshauri wako.'
      }
    ],
    quiz: {
      id: 'quiz-mod-4',
      questions: [
        {
          id: 'q7',
          question: 'Kitu gani muhimu zaidi ambacho wawekezaji na majaji wa StudentVentures wanataka kuona kwenye Pitch Deck?',
          options: [
            'Rangi nyingi za kuvutia na michoro mirefu bila maelezo ya kibiashara.',
            'Ufafanuzi wazi wa tatizo, suluhisho halisi, mpango wa fedha, na jinsi mtaji utakavyotumika kurejesha faida.',
            'Historia ya shule kuanzia ilipoanzishwa miaka 50 iliyopita.',
            'Malalamiko kuhusu ugumu wa masomo ya darasani.'
          ],
          correctOptionIndex: 1,
          explanation: 'Bora kabisa! Wawekezaji wanataka uhakika wa jinsi suluhisho lako litakavyofanya kazi na kurudisha faida kulingana na mpango wa fedha.'
        }
      ]
    }
  }
];

export const INITIAL_RESOURCES: AcademyResource[] = [
  {
    id: 'res-1',
    type: 'article',
    title: 'Mbinu 5 za Kuokoa na Kuwekeza TZS 1,000 Kila Siku Ukiwa Mwanafunzi',
    category: 'Akiba & Uwekezaji',
    readOrWatchTime: 'Dakika 6 za kusoma',
    author: 'Mwl. Josephat Msemwa',
    description: 'Mwongozo wa vitendo unaomwezesha mwanafunzi yeyote kuanza kuwekeza bila kuathiri mahitaji yake ya msingi ya masomo.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
    bodyContent: `Kuanza kuwekeza ukiwa mwanafunzi kunaweza kuonekana kama jambo gumu, lakini siri haipo kwenye kuwa na fedha nyingi bali kwenye nidhamu ya kuanza na ulichonacho.

1. Bainisha Matumizi ya Lazima Dhidi ya Matamanio:
Kila fedha unayopewa au kuipata, itenge: Nauli na chakula ni mahitaji ya lazima. Juisi ya chupa ya tatu au vocha ya ziada ya kutazama video zisizo na faida ni matamanio.

2. Tumia Mfumo wa StudentVentures:
Mfumo huu umerahisisha uwekezaji kwa kuweka kiwango cha chini cha TZS 5,000. Hii inamaanisha ukiweka TZS 1,000 pembeni kuanzia Jumatatu hadi Ijumaa, mwisho wa juma unamiliki hisa au mtaji kwenye mradi wa shule.

3. Chagua Miradi Yenye Mzunguko Mfupi:
Kama mwanafunzi, anza na miradi ya siku 60 hadi 90 (k.m. kuku wa nyama au canteen) ili uone matunda ya kwanza haraka na kujenga motisha.

4. Usitoe Faida ya Kwanza (Reinvesting):
Faida ya kwanza inapoingia kwenye akaunti yako, irejeshe mara moja. Hii ndiyo nguvu ya faida mjumuisho.

5. Shirikiana na Wenzako:
Uwekezaji wa kikundi (syndicate) una nguvu kubwa. Wanafunzi watano mkiweka TZS 10,000 kila mmoja, mna TZS 50,000 za kuwekeza pamoja na kugawana faida!`
  },
  {
    id: 'res-2',
    type: 'article',
    title: 'Mwongozo wa Lean Canvas: Panga Wazo Lako la Biashara Katika Ukurasa Mmoja',
    category: 'Ujasiriamali & Ubunifu',
    readOrWatchTime: 'Dakika 8 za kusoma',
    author: 'Dkt. Faustine Kavishe',
    description: 'Badala ya kuandika kitabu kirefu cha kurasa 40, jifunze jinsi ya kupanga nguzo zote 9 za biashara katika ukurasa mmoja tu kabla ya kuomba mtaji.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    bodyContent: `Lean Canvas ni chombo maarufu duniani kinachotumiwa na waanzilishi wa biashara kupanga na kutathmini mawazo yao ya kibiashara.

Sanduku 9 za Lean Canvas:
1. Tatizo (Problem): Matatizo makuu 3 ya wateja wako.
2. Wateja (Customer Segments): Nani hasa mlengwa wako mkuu shuleni.
3. Pendekezo la Thamani la Kipekee (Unique Value Proposition): Kwanini wanunue kwako na sio kwingine.
4. Suluhisho (Solution): Sifa 3 kuu za bidhaa au huduma yako.
5. Njia za Kufikia Wateja (Channels): Jinsi utakavyowafikia (canteen, madarasani, WhatsApp status).
6. Mifumo ya Mapato (Revenue Streams): Utatozaje bei na faida itatoka wapi.
7. Muundo wa Gharama (Cost Structure): Gharama zote za kutengeneza na kuendesha.
8. Vipimo Muhimu (Key Metrics): Namba zitakazokuonyesha kama mradi unakua.
9. Faida Isiyo Haki (Unfair Advantage): Kitu ambacho washindani hawawezi kukinunua au kukiiga kwa urahisi.`
  },
  {
    id: 'res-3',
    type: 'video',
    title: 'Video: Jinsi Tulivyoanza Mradi wa Kuku Kutoka TZS 50,000 Hadi TZS 1,500,000',
    category: 'Uzoefu wa Wanafunzi',
    readOrWatchTime: 'Dakika 14:30',
    author: 'Klabu ya Kilimo Azania',
    description: 'Ushuhuda halisi wa wanafunzi wa Azania wakieleza changamoto za mwanzo, vifo vya vifaranga, na jinsi walivyoshinda hadi kupata faida ya kuwagawia wawekezaji wao.',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'res-4',
    type: 'video',
    title: 'Video: Sanaa ya Kueleza Wazo Lako (Pitching) Ndani ya Dakika 3',
    category: 'Mawasiliano & Mitaji',
    readOrWatchTime: 'Dakika 11:15',
    author: 'StudentVentures Masterclass',
    description: 'Jifunze lugha ya mwili, mpangilio wa sauti na jinsi ya kuwasilisha mahesabu ya fedha kwa njia nyepesi inayowavutia majaji na wanafunzi wawekezaji.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'res-5',
    type: 'toolkit',
    title: 'Kiolezo cha Mpango wa Biashara wa Mwanafunzi (Business Plan Template)',
    category: 'Miongozo & Violezo',
    readOrWatchTime: 'PDF / Word (.docx)',
    author: 'Bodi ya StudentVentures',
    description: 'Kiolezo rasmi kilichoandaliwa kwa Kiswahili kinachokuongoza hatua kwa hatua kujaza taarifa za mradi wako kabla ya kuwasilisha kwenye shindano.',
    fileFormat: 'PDF & DOCX (MB 1.4)',
    downloadCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'res-6',
    type: 'toolkit',
    title: 'Jedwali la Excel la Mapato na Matumizi ya Mradi Shuleni',
    category: 'Miongozo & Violezo',
    readOrWatchTime: 'Excel (.xlsx)',
    author: 'Kitengo cha Uhasibu cha Wanafunzi',
    description: 'Jedwali lililowekwa fomula tayari za kupiga hesabu ya faida halisi, gharama za kila siku, na asilimia ya gawio kwa kila mwekezaji.',
    fileFormat: 'XLSX (KB 680)',
    downloadCount: 685,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  }
];
