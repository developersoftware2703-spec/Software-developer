import React from 'react';
import { ShieldCheck, X, FileText, CheckCircle2, AlertCircle, School, Lock, Scale } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-5 my-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                Sera ya Faragha na Vigezo vya Mfumo
              </h2>
              <p className="text-xs text-slate-400">
                Ulinzi wa Taarifa za Wanafunzi wa Sekondari na Kanuni za Kifedha Shuleni
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-5 pr-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <School className="w-4 h-4 text-emerald-400" />
              <span>1. Vigezo vya Ushiriki (Wanafunzi wa Sekondari Kidato cha 1 - 6)</span>
            </h3>
            <p className="text-slate-300">
              Mfumo wa StudentVentures umeundwa kisheria na kitaaluma kwa ajili ya wanafunzi wa shule za sekondari waliosajiliwa nchini kuanzia <strong>Kidato cha Kwanza (Form I) hadi Kidato cha Sita (Form VI)</strong>. Kila mwanafunzi anapaswa kuwa na namba halali ya usajili wa shule (School Registration/Admission Number).
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>2. Ulinzi wa Taarifa Binafsi (Data Protection Act)</span>
            </h3>
            <p className="text-slate-300">
              Kulingana na Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania (2022), taarifa zote za mwanafunzi (jina kamili, shule, simu ya mzazi, salio la pochi, na miamala) zinalindwa kwa usimbaji fiche (hash encryption) na hazitauzwa au kushirikishwa kwa watu baki bila idhini ya wazazi na uongozi wa shule.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>3. Idhini ya Mzazi / Mlezi na Mwalimu Mkuu</span>
            </h3>
            <p className="text-slate-300">
              Kila akaunti mpya ya mwanafunzi inahitaji idhini ya mzazi au mlezi halali, pamoja na ukaguzi na uidhinishaji kutoka kwa Msimamizi/Mwalimu Mkuu wa Shule kabla ya kuruhusiwa kufanya uwekezaji au miamala yoyote.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>4. Malengo ya Kielimu & Marufuku ya Kamari (No Gambling)</span>
            </h3>
            <p className="text-slate-300">
              StudentVentures ni jukwaa la elimu ya vitendo ya ujasiriamali, miradi ya uzalishaji ya shule (kilimo, teknolojia, biashara ndogo), na nidhamu ya kifedha. <strong>Hili si jukwaa la kamari au ubashiri</strong>. Fedha zote zilizowekezwa zinaelekezwa moja kwa moja kwenye miradi inayoonekana shuleni inayosimamiwa na walimu.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>5. Uwajibikaji wa Kifedha na Ukaguzi wa Mhasibu (Bursar)</span>
            </h3>
            <p className="text-slate-300">
              Gawio la faida (ROI) linakokotolewa kulingana na uzalishaji halisi wa mradi wa shule baada ya mzunguko kukamilika. Taarifa zote za fedha hukaguliwa na mhasibu wa shule (Bursar) na kuthibitishwa kwenye leja isiyobadilika ya mfumo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500">
            Imesasishwa: 2026 &bull; StudentVentures Tanzania
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
          >
            Nimeelewa Masharti
          </button>
        </div>
      </div>
    </div>
  );
};
