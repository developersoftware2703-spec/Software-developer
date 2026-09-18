import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  Shield, 
  Eye, 
  EyeOff, 
  Award, 
  TrendingUp, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { formatTZS } from '../utils/formatters';

export interface ShareContentData {
  title: string;
  categoryName?: string;
  subtitle?: string;
  badgeText?: string;
  metricLabel?: string;
  metricValue?: string | number;
  highlightText?: string;
  imageUrl?: string;
  verificationCode?: string;
  type: 'investment' | 'pitch' | 'certificate' | 'project';
}

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareContentData | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { currentUser, privacySettings, updatePrivacySettings } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'privacy'>('preview');

  if (!isOpen || !data) return null;

  const displayName = privacySettings.isAnonymous 
    ? 'Mwanafunzi Mwekezaji' 
    : currentUser.fullName;

  const displaySchool = privacySettings.hideSchoolName 
    ? 'Shule ya Sekondari / Chuo Kikuu' 
    : currentUser.schoolName;

  // Format share message for WhatsApp / X
  const appShareUrl = window.location.origin || 'https://studentventures.tz';
  
  let shareSummaryText = '';
  if (data.type === 'investment') {
    const amountOrRoi = privacySettings.hideExactAmounts 
      ? `faida ya uwekezaji shuleni!` 
      : `${typeof data.metricValue === 'number' ? formatTZS(data.metricValue) : data.metricValue}!`;
    shareSummaryText = `🎉 Nimefanikiwa kukuza mtaji wangu kupitia mfumo wa StudentVentures katika mradi wa ${data.title}. ${displayName} kutoka ${displaySchool} anawekeza katika ujasiriamali wa wanafunzi: ${appShareUrl}`;
  } else if (data.type === 'certificate') {
    shareSummaryText = `🎓 Nimehitimu mafunzo ya Ufahamu wa Kifedha na Ujasiriamali (Financial Literacy Certificate) kwenye StudentVentures! Uthibitisho: ${data.verificationCode || 'SV-CERT-2026'}. Jiunge nami: ${appShareUrl}`;
  } else if (data.type === 'pitch') {
    shareSummaryText = `🚀 Nimewasilisha wazo la mradi "${data.title}" kwenye Shindano la Ujasiriamali la Wanafunzi StudentVentures! Piga kura na uone suluhisho letu: ${appShareUrl}`;
  } else {
    shareSummaryText = `✨ Tazama mradi wa wanafunzi "${data.title}" kwenye StudentVentures - Mfumo wa uwekezaji na ujasiriamali mashuleni: ${appShareUrl}`;
  }

  const encodedText = encodeURIComponent(shareSummaryText);
  const encodedUrl = encodeURIComponent(appShareUrl);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Shiriki Kwenye Mitandao ya Kijamii</h3>
              <p className="text-xs text-slate-500">Onyesha mafanikio yako kwa marafiki na jamii</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers: Preview vs Privacy */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 pt-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kadi ya Kushiriki (Card Preview)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            Mipangilio ya Faragha
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'preview' ? (
            <>
              {/* Card visual preview */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-850 via-teal-900 to-slate-950 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
                {/* Background watermarks */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
                <div className="absolute top-4 right-4 opacity-20">
                  <GraduationCap className="w-20 h-20 text-white" />
                </div>

                {/* Card Top Brand */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black text-xs">
                      SV
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase text-emerald-200">
                      StudentVentures TZ
                    </span>
                  </div>
                  {data.badgeText && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
                      {data.badgeText}
                    </span>
                  )}
                </div>

                {/* Card Content Title & Subtitle */}
                <div className="relative z-10 mb-4">
                  <h4 className="text-lg font-black text-white leading-snug">
                    {data.title}
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    {data.subtitle || data.categoryName || 'Mfumo wa Uwekezaji wa Wanafunzi'}
                  </p>
                </div>

                {/* Metric or Highlight Box */}
                {(data.metricValue || data.highlightText) && (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 mb-4 border border-white/10 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-200 block font-medium">
                          {data.metricLabel || 'Mafanikio'}
                        </span>
                        <span className="text-xl font-black text-white">
                          {privacySettings.hideExactAmounts && typeof data.metricValue === 'number'
                            ? '+24% Gawio la Faida'
                            : typeof data.metricValue === 'number'
                            ? formatTZS(data.metricValue)
                            : data.metricValue || data.highlightText}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200">
                        {data.type === 'certificate' ? (
                          <Award className="w-5 h-5" />
                        ) : (
                          <TrendingUp className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Info Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/90 relative z-10">
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <span>{displayName}</span>
                      {privacySettings.isAnonymous && (
                        <span className="text-[10px] bg-slate-700/80 px-1.5 py-0.2 rounded text-slate-300">Fiche</span>
                      )}
                    </p>
                    <p className="text-[11px] text-emerald-300/80">{displaySchool}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 block">
                      {data.verificationCode || 'VERIFIED-STUDENT'}
                    </span>
                    <span className="text-[9px] text-emerald-300/60 block">studentventures.tz</span>
                  </div>
                </div>
              </div>

              {/* Social Platform Share Buttons */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Chagua Mtandao wa Kushiriki:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-transform hover:scale-[1.02] shadow-sm"
                  >
                    <span className="text-sm">💬</span>
                    <span>WhatsApp</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-transform hover:scale-[1.02] shadow-sm"
                  >
                    <span className="text-sm">✖</span>
                    <span>X (Twitter)</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-transform hover:scale-[1.02] shadow-sm"
                  >
                    <span className="text-sm">📘</span>
                    <span>Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-transform hover:scale-[1.02] shadow-sm"
                  >
                    <span className="text-sm">💼</span>
                    <span>LinkedIn</span>
                  </a>
                </div>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopy}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Ujumbe Umenakiliwa!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Nakili Ujumbe & Kiungo (Copy Link)</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Privacy Settings Panel */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold block mb-0.5">Ulinzi na Udhibiti wa Faragha ya Mwanafunzi:</span>
                Unaweza kuchagua kuficha kiasi cha fedha, kutumia jina la fiche, au kuficha jina la shule yako wakati unashiriki mafanikio kwenye mitandao ya kijamii.
              </div>

              <div className="space-y-3">
                {/* Hide Exact Amounts */}
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="pr-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Ficha Kiasi Halisi cha Fedha (Hide Exact Amount)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Onyesha asilimia ya ukuaji au faida (k.m. +24% ROI) badala ya tarakimu za TZS.
                    </span>
                  </div>
                  <button
                    onClick={() => updatePrivacySettings({ hideExactAmounts: !privacySettings.hideExactAmounts })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      privacySettings.hideExactAmounts ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        privacySettings.hideExactAmounts ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Anonymous sharing */}
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="pr-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Kushiriki Bila Kutaja Jina (Anonymous Mode)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Tumia kitambulisho cha jumla cha "Mwanafunzi Mwekezaji" badala ya jina lako halisi.
                    </span>
                  </div>
                  <button
                    onClick={() => updatePrivacySettings({ isAnonymous: !privacySettings.isAnonymous })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      privacySettings.isAnonymous ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        privacySettings.isAnonymous ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Hide School */}
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="pr-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      Ficha Shule au Chuo Chako
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Hutajaza shule yako kwenye chapisho la umma.
                    </span>
                  </div>
                  <button
                    onClick={() => updatePrivacySettings({ hideSchoolName: !privacySettings.hideSchoolName })}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                      privacySettings.hideSchoolName ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        privacySettings.hideSchoolName ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('preview')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                Hifadhi na Rudi Kwenye Kadi
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Uwekezaji Salama wa Wanafunzi</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Funga
          </button>
        </div>

      </div>
    </div>
  );
};
