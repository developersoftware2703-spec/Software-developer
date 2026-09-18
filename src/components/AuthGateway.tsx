import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  School, 
  ArrowRight,
  Info,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  KeyRound,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthGateway: React.FC = () => {
  const { allStudents, loginWithPin, registerStudent, adminLogin } = useApp();

  const [activePortal, setActivePortal] = useState<'student' | 'admin'>('student');
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  // Student Login State
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentSuccess, setStudentSuccess] = useState('');

  // Student Registration State (Secondary School Form 1 - 6)
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regFormLevel, setRegFormLevel] = useState('Kidato cha 3 (Form III)');
  const [regPhone, setRegPhone] = useState('');
  const [regGuardianPhone, setRegGuardianPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regPinConfirm, setRegPinConfirm] = useState('');
  const [regGuardianConsent, setRegGuardianConsent] = useState(true);

  // Admin Login State (Primary Defined Info)
  const [adminStaffId, setAdminStaffId] = useState('STAFF/ADM/001');
  const [adminPin, setAdminPin] = useState('9999');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const secondaryForms = [
    'Kidato cha 1 (Form I)',
    'Kidato cha 2 (Form II)',
    'Kidato cha 3 (Form III)',
    'Kidato cha 4 (Form IV)',
    'Kidato cha 5 (Form V)',
    'Kidato cha 6 (Form VI)'
  ];

  // Secondary students list for quick preview/demo
  const demoSecondaryStudents = allStudents.filter(s => s.role === 'student').slice(0, 4);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    if (!studentRegNo.trim()) {
      setStudentError('Tafadhali weka Namba ya Usajili ya Mwanafunzi.');
      return;
    }
    if (!studentPin.trim()) {
      setStudentError('Tafadhali weka PIN yako ya usalama.');
      return;
    }

    const res = loginWithPin(studentRegNo.trim(), studentPin.trim());
    if (!res.success) {
      setStudentError(res.message);
    } else {
      setStudentSuccess(res.message);
    }
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    if (!regFullName.trim() || !regStudentId.trim() || !regSchoolName.trim() || !regPin.trim()) {
      setStudentError('Tafadhali jaza taarifa zote muhimu zenye alama ya (*).');
      return;
    }

    if (regPin.length < 4) {
      setStudentError('PIN ya usalama lazima iwe na tarakimu 4.');
      return;
    }

    if (regPin !== regPinConfirm) {
      setStudentError('PIN ya kuthibitisha hailingani na PIN ya awali.');
      return;
    }

    if (!regGuardianConsent) {
      setStudentError('Ni sharti mzazi au mlezi akubali idhini ya usajili wa mwanafunzi wa sekondari.');
      return;
    }

    const res = registerStudent({
      fullName: regFullName.trim(),
      studentRegNo: regStudentId.trim().toUpperCase(),
      schoolName: regSchoolName.trim(),
      educationLevel: 'Sekondari',
      courseOrClass: regFormLevel,
      email: regEmail.trim() || `${regStudentId.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.tz`,
      phone: regPhone.trim() || '+255 700 000 000',
      guardianPhone: regGuardianPhone.trim(),
      guardianConsent: regGuardianConsent,
      securityPin: regPin.trim(),
    });

    if (!res.success) {
      setStudentError(res.message);
    } else {
      setStudentSuccess(res.message);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!adminStaffId.trim() || !adminPin.trim()) {
      setAdminError('Tafadhali jaza Kitambulisho cha Mwalimu/Msimamizi na PIN ya Utawala.');
      return;
    }

    const res = adminLogin(adminStaffId.trim(), adminPin.trim());
    if (!res.success) {
      setAdminError(res.message);
    } else {
      setAdminSuccess(res.message);
    }
  };

  const quickFillStudent = (student: typeof allStudents[0]) => {
    setStudentRegNo(student.studentRegNo);
    setStudentPin(student.securityPin);
    setStudentError('');
  };

  const quickFillAdmin = () => {
    setAdminStaffId('STAFF/ADM/001');
    setAdminPin('9999');
    setAdminError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* App Title & Identity Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-4 shadow-lg shadow-emerald-500/5">
            <GraduationCap className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Student Ventures Tanzania
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Mfumo Hai wa Uwekezaji & Ukuzaji wa Miradi ya Shule kwa Wanafunzi wa Sekondari
          </p>
        </div>

        {/* Portal Switcher Tabs (Separating Student Portal & Admin Portal clearly) */}
        <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex max-w-md mx-auto mb-8 shadow-xl">
          <button
            id="tab-student-portal"
            type="button"
            onClick={() => {
              setActivePortal('student');
              setStudentError('');
              setAdminError('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activePortal === 'student'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mwanafunzi wa Sekondari</span>
          </button>

          <button
            id="tab-admin-portal"
            type="button"
            onClick={() => {
              setActivePortal('admin');
              setStudentError('');
              setAdminError('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activePortal === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Mlango wa Utawala (Admin)</span>
          </button>
        </div>

        {/* PORTAL VIEW 1: STUDENT PORTAL (Form 1 to Form 6) */}
        {activePortal === 'student' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {/* Criteria Banner */}
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-300">
              <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-emerald-200 block mb-0.5">
                  Vigezo Rasmi vya Kujiunga:
                </strong>
                Mfumo huu unaruhusu wanafunzi wa shule za sekondari pekee kuanzia 
                <span className="font-bold text-white underline mx-1">Kidato cha Kwanza (Form 1) hadi Kidato cha Sita (Form 6)</span>. 
                Akaunti zote mpya hukaguliwa na kuidhinishwa na Msimamizi/Mwalimu Mkuu wa Miradi.
              </div>
            </div>

            {/* Sub-tabs: Ingia vs Jisajili */}
            <div className="flex border-b border-slate-800 mb-6">
              <button
                id="btn-sub-login"
                type="button"
                onClick={() => {
                  setStudentMode('login');
                  setStudentError('');
                  setStudentSuccess('');
                }}
                className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                  studentMode === 'login'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Ingia Kama Mwanafunzi</span>
              </button>

              <button
                id="btn-sub-register"
                type="button"
                onClick={() => {
                  setStudentMode('register');
                  setStudentError('');
                  setStudentSuccess('');
                }}
                className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                  studentMode === 'register'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Jisajili (Kidato cha 1 - 6)</span>
              </button>
            </div>

            {/* Notifications */}
            {studentError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{studentError}</span>
              </div>
            )}
            {studentSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{studentSuccess}</span>
              </div>
            )}

            {/* FORM A: STUDENT LOGIN */}
            {studentMode === 'login' && (
              <div>
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Namba ya Usajili ya Mwanafunzi (Student Reg No / Admission No)
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        id="input-student-reg-no"
                        type="text"
                        value={studentRegNo}
                        onChange={(e) => setStudentRegNo(e.target.value)}
                        placeholder="Mfano: AZA/2024/0412 au JNG/2024/0284"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Nambari ya Siri ya Usalama (4-Digit PIN)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        id="input-student-pin"
                        type="password"
                        maxLength={6}
                        value={studentPin}
                        onChange={(e) => setStudentPin(e.target.value)}
                        placeholder="Weka tarakimu 4 za PIN"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-submit-student-login"
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Ingia Kama Mwanafunzi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Demo Student Accounts (Form 1 to Form 6 only) */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Akaunti za Mfano za Wanafunzi wa Sekondari (Bofya kuingia haraka):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {demoSecondaryStudents.map(std => (
                      <button
                        key={std.id}
                        type="button"
                        onClick={() => quickFillStudent(std)}
                        className={`text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                          studentRegNo === std.studentRegNo
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-white truncate">{std.fullName}</p>
                          <p className="text-[11px] text-slate-400 truncate">{std.courseOrClass} • {std.schoolName}</p>
                          <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            std.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {std.status === 'active' ? 'Imethibitishwa (PIN: ' + std.securityPin + ')' : 'Inasubiri Idhini (PIN: ' + std.securityPin + ')'}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-mono font-bold text-xs bg-slate-900 px-2 py-1 rounded">
                          {std.studentRegNo.split('/')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FORM B: STUDENT REGISTRATION (Secondary School Form 1 - 6 only) */}
            {studentMode === 'register' && (
              <form onSubmit={handleStudentRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Jina Kamili la Mwanafunzi *
                    </label>
                    <input
                      id="reg-full-name"
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Mfano: Daudi Samwel Msigwa"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Namba ya Usajili / Kiingilio Shuleni *
                    </label>
                    <input
                      id="reg-student-id"
                      type="text"
                      required
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      placeholder="Mfano: AZA/2024/0991 au FORM/2024/001"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Shule ya Sekondari *
                    </label>
                    <input
                      id="reg-school-name"
                      type="text"
                      required
                      value={regSchoolName}
                      onChange={(e) => setRegSchoolName(e.target.value)}
                      placeholder="Mfano: Sekondari ya Tambaza au Msalato Girls"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Kidato (Secondary Form 1 - 6 Pekee) *
                    </label>
                    <select
                      id="reg-form-level"
                      value={regFormLevel}
                      onChange={(e) => setRegFormLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    >
                      {secondaryForms.map(form => (
                        <option key={form} value={form}>{form}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Simu ya Mwanafunzi / Mzazi
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Simu ya Mlezi / Mwalimu Mlezi
                    </label>
                    <input
                      id="reg-guardian-phone"
                      type="tel"
                      value={regGuardianPhone}
                      onChange={(e) => setRegGuardianPhone(e.target.value)}
                      placeholder="+255 7XX XXX XXX"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Barua Pepe (Email)
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="mwanafunzi@shule.tz"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Unda PIN ya Usalama (Tarakimu 4) *
                    </label>
                    <input
                      id="reg-pin"
                      type="password"
                      maxLength={6}
                      required
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value)}
                      placeholder="Mfano: 4567"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Thibitisha PIN ya Usalama *
                    </label>
                    <input
                      id="reg-pin-confirm"
                      type="password"
                      maxLength={6}
                      required
                      value={regPinConfirm}
                      onChange={(e) => setRegPinConfirm(e.target.value)}
                      placeholder="Rudia PIN"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition tracking-widest"
                    />
                  </div>
                </div>

                {/* Guardian Consent Checkbox */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start gap-3">
                  <input
                    id="reg-guardian-consent"
                    type="checkbox"
                    checked={regGuardianConsent}
                    onChange={(e) => setRegGuardianConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500 mt-1 cursor-pointer"
                  />
                  <label htmlFor="reg-guardian-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                    Nathibitisha kuwa mimi ni mwanafunzi halali wa sekondari (Kidato cha 1 hadi cha 6) na nina idhini ya mzazi au mwalimu msimamizi kushiriki katika mafunzo na miradi ya uzalishaji ya shule.
                  </label>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                  <span className="font-bold">Kumbuka:</span> Mara baada ya kuwasilisha, akaunti yako itakuwa na hadhi ya 
                  <span className="font-bold underline ml-1">"Inasubiri Uidhinishaji (Pending Approval)"</span>. Msimamizi/Mwalimu wa Miradi atakagua namba yako ya shule na kuidhinisha akaunti kabla ya kuanza kuwekeza.
                </div>

                <button
                  id="btn-submit-student-register"
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Wasilisha Usajili wa Mwanafunzi</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* PORTAL VIEW 2: ADMIN & STAFF PORTAL (Dedicated Primary Defined Credentials) */}
        {activePortal === 'admin' && (
          <div className="bg-slate-900/90 border border-indigo-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Kituo cha Utawala (Admin Command Center)</h2>
                <p className="text-xs text-slate-400">
                  Mlango uliotengwa maalumu kwa ajili ya Wasimamizi Wakuu wa Miradi ya Shule
                </p>
              </div>
            </div>

            {/* Primary Defined Info Card */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Taarifa za Msingi za Kuingia (Primary Defined Info):</span>
                </span>
                <button
                  type="button"
                  onClick={quickFillAdmin}
                  className="text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition"
                >
                  Jaza Kiotomatiki
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">KITAMBULISHO CHA UTUMISHI (STAFF ID):</span>
                  <span className="text-emerald-400 font-bold text-sm">STAFF/ADM/001</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PIN YA UTAWALA (MASTER PIN):</span>
                  <span className="text-indigo-300 font-bold text-sm">9999</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Wanafunzi hawana uwezo wa kuona njia hii ya utawala kwenye ukurasa wao wa ndani mara wanapoingia.
              </p>
            </div>

            {/* Admin Notifications */}
            {adminError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{adminError}</span>
              </div>
            )}
            {adminSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{adminSuccess}</span>
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Kitambulisho cha Utumishi / Msimamizi (Staff ID)
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="input-admin-staff-id"
                    type="text"
                    required
                    value={adminStaffId}
                    onChange={(e) => setAdminStaffId(e.target.value)}
                    placeholder="Weka Kitambulisho cha Msimamizi"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  PIN ya Utawala (Admin Security PIN)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="input-admin-pin"
                    type="password"
                    maxLength={6}
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Weka PIN ya Utawala"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono tracking-widest"
                  />
                </div>
              </div>

              <button
                id="btn-submit-admin-login"
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-4"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingia Kituo Kikuu cha Utawala (Admin Portal)</span>
              </button>
            </form>
          </div>
        )}

        {/* Security & System Assurance Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Mfumo Umelindwa kwa Usalama wa Hali ya Juu • Secondary Schools Student Ventures &copy; {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  );
};
