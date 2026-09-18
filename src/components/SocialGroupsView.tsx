import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Share2, 
  Users, 
  MessageCircle, 
  Shield, 
  Plus, 
  Heart, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Lock, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Filter,
  UserPlus,
  UserMinus,
  Send,
  Hash
} from 'lucide-react';
import { formatTZS } from '../utils/formatters';
import { SocialShareModal, ShareContentData } from './SocialShareModal';
import { DiscussionGroup } from '../types';

export const SocialGroupsView: React.FC = () => {
  const { 
    currentUser, 
    investments, 
    projects, 
    discussionGroups, 
    privacySettings, 
    updatePrivacySettings,
    createDiscussionGroup,
    joinOrLeaveGroup,
    createGroupPost,
    likeGroupPost,
    replyToGroupPost
  } = useApp();

  const [activeTab, setActiveTab] = useState<'share' | 'groups' | 'privacy'>('share');
  const [selectedGroup, setSelectedGroup] = useState<DiscussionGroup | null>(discussionGroups[0] || null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareContentData | null>(null);

  // New Group state
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCat, setNewGroupCat] = useState('Kilimo & Mifugo');

  // New Post state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  // Reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);

  // Quick share handlers
  const handleSharePortfolio = () => {
    setShareData({
      title: 'Uwekezaji Wangu wa Wanafunzi',
      categoryName: 'StudentVentures Portfolio',
      subtitle: `Akaunti ya ${privacySettings.isAnonymous ? 'Mwanafunzi Mwekezaji' : currentUser.fullName}`,
      badgeText: 'Mwekezaji Hai',
      metricLabel: 'Jumla ya Mtaji Uliowekezwa',
      metricValue: currentUser.totalInvested,
      highlightText: `Gawio: ${formatTZS(currentUser.totalProfitEarned)}`,
      type: 'investment',
      verificationCode: `INV-${currentUser.id.toUpperCase()}`
    });
    setIsShareModalOpen(true);
  };

  const handleShareProject = (title: string, category: string, roi: number) => {
    setShareData({
      title: title,
      categoryName: category,
      subtitle: `Mradi wa Wanafunzi Shuleni`,
      badgeText: `${roi}% ROI`,
      metricLabel: 'Faida Inayotarajiwa',
      metricValue: `${roi}% kwa Mzunguko`,
      type: 'project',
      verificationCode: `PROJ-${Date.now().toString().slice(-4)}`
    });
    setIsShareModalOpen(true);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;
    createDiscussionGroup(newGroupName.trim(), newGroupDesc.trim(), newGroupCat);
    setNewGroupName('');
    setNewGroupDesc('');
    setIsNewGroupModalOpen(false);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !postTitle.trim() || !postContent.trim()) return;
    const tagsArray = postTags
      ? postTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
      : ['Wanafunzi', 'Uwekezaji'];
    createGroupPost(selectedGroup.id, postTitle.trim(), postContent.trim(), tagsArray);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setIsNewPostOpen(false);

    // Refresh selected group
    const updated = discussionGroups.find(g => g.id === selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const handleSendReply = (postId: string) => {
    const text = replyTextMap[postId];
    if (!selectedGroup || !text || !text.trim()) return;
    replyToGroupPost(selectedGroup.id, postId, text.trim());
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
    setActiveReplyPostId(null);

    // Refresh selected group
    const updated = discussionGroups.find(g => g.id === selectedGroup.id);
    if (updated) setSelectedGroup(updated);
  };

  const handleShareGroupInvite = (group: DiscussionGroup) => {
    const msg = `📢 Karibu kwenye kundi la majadiliano "${group.name}" ndani ya StudentVentures! Jiunge nasi hapa: ${window.location.origin || 'https://studentventures.tz'}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Currently viewed group
  const activeGroup = discussionGroups.find(g => g.id === selectedGroup?.id) || discussionGroups[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-700/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>Kushiriki Mitandaoni, Faragha & Jamii ya Wanafunzi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Shiriki Mafanikio Yako na Jiunge na Magrupu ya Majadiliano
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Wasiliana na wanafunzi wajasiriamali kutoka shule na vyuo mbalimbali nchini, badilishaneni uzoefu wa uwekezaji, na shiriki mafanikio yako kwenye mitandao ya kijamii kwa ulinzi kamili wa faragha yako.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'share', label: 'Shiriki Mafanikio (Social Studio)', icon: Share2 },
          { id: 'groups', label: 'Magrupu ya Majadiliano ya Shule', icon: Users, count: discussionGroups.length },
          { id: 'privacy', label: 'Mipangilio ya Faragha (Privacy)', icon: Shield },
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

      {/* TAB 1: SOCIAL SHARE STUDIO */}
      {activeTab === 'share' && (
        <div className="space-y-8">
          
          {/* Main Portfolio Share Card Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Kadi Yako ya Mafanikio ya Uwekezaji</h2>
                <p className="text-xs text-slate-500">
                  Tengeneza kadi ya dijitali inayoweza kushirikiwa WhatsApp, X (Twitter), Facebook au LinkedIn.
                </p>
              </div>
              <button
                onClick={handleSharePortfolio}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Shiriki Kadi Yangu Sasa</span>
              </button>
            </div>

            {/* Live Preview Card */}
            <div className="max-w-xl mx-auto rounded-3xl p-6 bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black text-xs">
                    SV
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase text-emerald-200 block leading-none">
                      StudentVentures
                    </span>
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Uwekezaji wa Wanafunzi TZ</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-200">
                  Kadi Rasmi ya Mwekezaji
                </span>
              </div>

              <div className="my-4">
                <h3 className="text-lg font-black text-white">
                  {privacySettings.isAnonymous ? 'Mwanafunzi Mwekezaji' : currentUser.fullName}
                </h3>
                <p className="text-xs text-emerald-300/80">
                  {privacySettings.hideSchoolName ? 'Shule / Chuo Kikuu' : currentUser.schoolName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 my-4">
                <div>
                  <span className="text-[11px] text-emerald-200 block font-medium">Mtaji Uliowekezwa</span>
                  <span className="text-lg font-black text-white">
                    {privacySettings.hideExactAmounts ? '•••••••• (Siri)' : formatTZS(currentUser.totalInvested)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-200 block font-medium">Faida Iliyopatikana</span>
                  <span className="text-lg font-black text-emerald-300">
                    {privacySettings.hideExactAmounts ? '+24.5% Gawio' : formatTZS(currentUser.totalProfitEarned)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-200/80 pt-2 border-t border-white/10">
                <span>Kitambulisho: {currentUser.studentRegNo}</span>
                <span className="font-mono text-emerald-300">studentventures.tz</span>
              </div>
            </div>

            {/* Quick Share Buttons bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSharePortfolio}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 border border-emerald-200 transition-colors"
              >
                <span>💬 Shiriki WhatsApp</span>
              </button>
              <button
                onClick={handleSharePortfolio}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-2 border border-slate-200 transition-colors"
              >
                <span>✖ Shiriki X (Twitter)</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Rekebisha Faragha Kabla ya Kushiriki</span>
              </button>
            </div>
          </div>

          {/* Share Successful Projects Showcase */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900">Shiriki Miradi Iliyofadhiliwa na Kufanikiwa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-500">{p.schoolName}</p>
                      <span className="text-[11px] font-bold text-emerald-700">Faida: +{p.roiPercentage}% ROI</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShareProject(p.title, p.category, p.roiPercentage)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Shiriki</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STUDENT DISCUSSION GROUPS */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Groups List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Magrupu ya Majadiliano</h2>
              <button
                onClick={() => setIsNewGroupModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Unda Kundi</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {discussionGroups.map((group) => {
                const isSelected = selectedGroup?.id === group.id;
                const isMember = group.members.includes(currentUser.id);

                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                        {group.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {group.memberCount} Wanachama
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">{group.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {group.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                      <span className={`font-bold text-[11px] ${isMember ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isMember ? '✓ Mwanachama' : 'Hujajiunga'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareGroupInvite(group);
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                        title="Alika kwa WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Group Feed & Posts */}
          <div className="lg:col-span-2 space-y-6">
            {activeGroup && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
                
                {/* Group Banner Header */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {activeGroup.category}
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">{activeGroup.name}</h2>
                      <p className="text-xs text-slate-600 mt-1">{activeGroup.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => joinOrLeaveGroup(activeGroup.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          activeGroup.members.includes(currentUser.id)
                            ? 'bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {activeGroup.members.includes(currentUser.id) ? 'Ondoka Kwenye Kundi' : '+ Jiunge na Kundi'}
                      </button>

                      <button
                        onClick={() => handleShareGroupInvite(activeGroup)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        title="Alika marafiki"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Create Post Prompt */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  {!isNewPostOpen ? (
                    <div
                      onClick={() => setIsNewPostOpen(true)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between text-xs text-slate-400"
                    >
                      <span>Anzisha mada mpya au uliza swali kuhusu miradi...</span>
                      <button className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px]">
                        Chapisha Mada
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreatePost} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-900">Chapisha Mada Mpya Kwenye Kundi:</h4>
                      <input
                        type="text"
                        required
                        placeholder="Kichwa cha Mada (mfano: Njia bora ya kulisha kuku wakati wa kiangazi)"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <textarea
                        required
                        rows={3}
                        placeholder="Eleza maelezo kamili au uzoefu wako wa mradi..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Tags (mfano: Ufugaji, Faida, Shuleni) zikitenganishwa kwa koma"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsNewPostOpen(false)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                        >
                          Ghairi
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                        >
                          Tuma Chapisho
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Posts Feed */}
                <div className="p-6 space-y-6">
                  {activeGroup.posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      Bado hakuna machapisho kwenye kikundi hiki. Kuwa wa kwanza kuanzisha mada!
                    </div>
                  ) : (
                    activeGroup.posts.map((post) => {
                      const hasLiked = post.likedBy.includes(currentUser.id);

                      return (
                        <div key={post.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                          
                          {/* Post Author */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <h4 className="text-xs font-black text-slate-900">{post.authorName}</h4>
                                <p className="text-[10px] text-slate-500">{post.authorSchool} • {post.timestamp}</p>
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div>
                            <h3 className="text-sm font-black text-slate-900 mb-1">{post.title}</h3>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {post.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => likeGroupPost(activeGroup.id, post.id)}
                                className={`flex items-center gap-1 font-bold ${
                                  hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600' : ''}`} />
                                <span>{post.likesCount}</span>
                              </button>

                              <button
                                onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                                className="flex items-center gap-1 font-bold text-slate-500 hover:text-slate-700"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{post.replies.length} Majibu</span>
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`💡 Mada ya kuvutia kwenye StudentVentures: "${post.title}" - ${post.content.slice(0, 100)}...`)}`;
                                window.open(shareUrl, '_blank');
                              }}
                              className="text-slate-400 hover:text-emerald-700 text-[11px] font-bold flex items-center gap-1"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Shiriki WhatsApp</span>
                            </button>
                          </div>

                          {/* Replies Thread */}
                          {post.replies.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-50 pl-4 border-l-2 border-emerald-100">
                              {post.replies.map((reply) => (
                                <div key={reply.id} className="text-xs bg-slate-50 p-2.5 rounded-xl space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                                    <span>{reply.authorName}</span>
                                    <span className="text-slate-400 font-normal">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-slate-600">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply input box */}
                          {activeReplyPostId === post.id && (
                            <div className="flex gap-2 pt-2">
                              <input
                                type="text"
                                placeholder="Andika jibu lako hapa..."
                                value={replyTextMap[post.id] || ''}
                                onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSendReply(post.id);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500"
                              />
                              <button
                                onClick={() => handleSendReply(post.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                              >
                                Tuma
                              </button>
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: PRIVACY CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Mipangilio ya Faragha ya Taarifa za Wanafunzi
            </h2>
            <p className="text-xs text-slate-500">
              Dhibiti ni taarifa zipi zinazoonekana kwa jamii wakati unashiriki mafanikio kwenye mitandao ya kijamii au kwenye magrupu ya shule.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Toggle 1: Hide Exact Amounts */}
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Ficha Kiasi Halisi cha Fedha (Hide Exact Financial Figures)
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Badala ya kuonyesha tarakimu kamili za fedha zako (k.m. TZS 120,000), kadi na machapisho yataonyesha asilimia ya faida tu (k.m. +24.5% ROI).
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

            {/* Toggle 2: Anonymous Mode */}
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Kushiriki Bila Kutaja Jina (Anonymous Mode)
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Tumia kitambulisho cha fiche cha "Mwanafunzi Mwekezaji" unapoandika maoni au kushiriki takwimu nje ya mfumo.
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

            {/* Toggle 3: Hide School Name */}
            <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Ficha Jina la Shule au Chuo
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Zuia kutajwa kwa jina la shule yako kwenye kadi za mitandao ya kijamii.
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

            {/* Portfolio Visibility Options */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-sm font-bold text-slate-900 block">
                Kiwango cha Kuonekana kwa Portfolio (Portfolio Visibility)
              </span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { id: 'public', label: 'Umma (Wote)' },
                  { id: 'school', label: 'Shule Pekee' },
                  { id: 'private', label: 'Binafsi (Mimi Pekee)' },
                ].map((vis) => (
                  <button
                    key={vis.id}
                    onClick={() => updatePrivacySettings({ portfolioVisibility: vis.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      privacySettings.portfolioVisibility === vis.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {vis.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-black block mb-1">Dokezo la Usalama wa Mtandao:</span>
            StudentVentures inalinda namba za siri (PIN), namba za simu za miamala, na rekodi za benki zisiweze kufikiwa au kushirikiwa hadharani hata kidogo.
          </div>
        </div>
      )}

      {/* MODAL: CREATE DISCUSSION GROUP */}
      {isNewGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Unda Kundi Jipya la Majadiliano</h3>
              <button
                onClick={() => setIsNewGroupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jina la Kikundi: *</label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Klabu ya Wajasiriamali wa Sola & Nishati"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sekta / Kategoria:</label>
                <select
                  value={newGroupCat}
                  onChange={(e) => setNewGroupCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                >
                  <option value="Kilimo & Mifugo">Kilimo & Mifugo</option>
                  <option value="Fedha & Uwekezaji">Fedha & Uwekezaji</option>
                  <option value="Huduma za Chakula & Canteen">Huduma za Chakula & Canteen</option>
                  <option value="Teknolojia & Uchapaji">Teknolojia & Uchapaji</option>
                  <option value="Nishati Safi & Mazingira">Nishati Safi & Mazingira</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Maelezo ya Kikundi: *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Eleza madhumuni ya kikundi hiki na nani anayekaribishwa kujiunga..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewGroupModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Unda Kikundi Sasa
                </button>
              </div>
            </form>
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
