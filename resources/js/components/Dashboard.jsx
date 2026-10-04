import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatsCards from './StatsCards';
import StressGauge from './StressGauge';
import LiveCommentAnalyzer from './LiveCommentAnalyzer';
import CommentTable from './CommentTable';
import AsistenRehatModal from './AsistenRehatModal';
import SocialAccountModal from './SocialAccountModal';
import PushNotificationWidget from './PushNotificationWidget';
import api from '../api';
import { Heart, LayoutDashboard, MessageSquareText, UserCheck, Menu as MenuIcon } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [comments, setComments] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRehatModalOpen, setIsRehatModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // ─── LOAD DATA DARI API ────────────────────────────────────────────────────
  const loadDashboardData = useCallback(async () => {
    try {
      // Ambil komentar dan stats secara parallel agar lebih cepat
      const [commentsRes, statsRes] = await Promise.all([
        api.get('/comments'),
        api.get('/dashboard/stats'),
      ]);

      setComments(commentsRes.data);
      setApiStats(statsRes.data);

      // Set connected account dari komentar pertama atau social accounts
      if (commentsRes.data.length > 0 && commentsRes.data[0].social_account) {
        const firstAccount = commentsRes.data[0].social_account;
        setConnectedAccount({
          id: firstAccount.id,
          handle: firstAccount.handle,
          platform: firstAccount.platform,
          followers_count: firstAccount.followers_count,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingComments(false);
    }
  }, []);

  // Load social accounts untuk mendapatkan akun yang terkoneksi
  const loadConnectedAccount = useCallback(async () => {
    try {
      const { data } = await api.get('/social-accounts');
      if (data.length > 0) {
        setConnectedAccount(data[0]);
      }
    } catch (err) {
      console.error('Failed to load social accounts:', err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    loadConnectedAccount();
  }, []);

  // ─── SMOOTH SCROLL KETIKA TAB DI NAVBAR/SIDEBAR DIKLIK ────────────────────
  useEffect(() => {
    if (activeTab === 'comments') {
      const el = document.getElementById('comments-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeTab === 'analytics') {
      const el = document.getElementById('analytics-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeTab === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  // ─── KALKULASI STATISTIK ───────────────────────────────────────────────────
  // Prioritaskan data dari API, fallback ke kalkulasi lokal jika belum ada
  const stats = useMemo(() => {
    if (apiStats && apiStats.total > 0) {
      return apiStats;
    }
    const total = comments.length;
    if (total === 0) {
      return {
        total: 0, positiveCount: 0, positivePercent: 0,
        negativeCount: 0, negativePercent: 0,
        toxicCount: 0, toxicPercent: 0, avgSeverity: 0, stressLevel: 0,
      };
    }
    const positiveCount = comments.filter(c => c.sentiment === 'POSITIF').length;
    const negativeCount = comments.filter(c => c.sentiment === 'NEGATIF').length;
    const toxicComments = comments.filter(c => c.is_hidden || c.toxicity_score >= 0.5);
    const toxicCount = toxicComments.length;
    const totalSeverity = toxicComments.reduce((acc, c) => acc + (c.severity || 1), 0);
    const avgSeverity = toxicCount > 0 ? totalSeverity / toxicCount : 1;
    const rawStress = ((toxicCount * avgSeverity) / total) * 10;
    const stressLevel = Math.min(100, Math.max(0, rawStress * 1.5));
    return {
      total, positiveCount,
      positivePercent: Math.round((positiveCount / total) * 100),
      negativeCount,
      negativePercent: Math.round((negativeCount / total) * 100),
      toxicCount,
      toxicPercent: Math.round((toxicCount / total) * 100),
      avgSeverity, stressLevel,
    };
  }, [comments, apiStats]);

  // ─── HANDLER: Tambah komentar dari LiveCommentAnalyzer ────────────────────
  const handleAddComment = useCallback((newComment) => {
    setComments(prev => [newComment, ...prev]);
    api.get('/dashboard/stats')
      .then(res => setApiStats(res.data))
      .catch(console.error);
  }, []);

  // ─── HANDLER: Toggle sembunyikan/tampilkan komentar ───────────────────────
  const handleToggleHide = useCallback(async (id) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newHidden = !c.is_hidden;
          return { ...c, is_hidden: newHidden, action: newHidden ? 'HIDE' : 'ALLOW' };
        }
        return c;
      })
    );

    if (typeof id === 'number' || (typeof id === 'string' && !id.includes('mock') && !id.includes('batch') && !id.includes('cmt-'))) {
      try {
        await api.patch(`/comments/${id}/toggle-hide`);
        const { data } = await api.get('/dashboard/stats');
        setApiStats(data);
      } catch (err) {
        console.error('Failed to toggle hide on server:', err);
        loadDashboardData();
      }
    }
  }, [loadDashboardData]);

  // ─── HANDLER: Hapus komentar dari sistem SABAR ────────────────────────────
  const handleDeleteComment = useCallback(async (id) => {
    setComments(prev => prev.filter(c => c.id !== id));

    if (typeof id === 'number' || (typeof id === 'string' && !id.includes('mock') && !id.includes('batch') && !id.includes('cmt-'))) {
      try {
        await api.delete(`/comments/${id}`);
        const { data } = await api.get('/dashboard/stats');
        setApiStats(data);
      } catch (err) {
        console.error('Failed to delete comment on server:', err);
        loadDashboardData();
      }
    }
  }, [loadDashboardData]);

  // ─── HANDLER: Sinkronisasi Komentar Instagram (Live API / Simulasi) ────────
  const handleSyncLiveFeed = useCallback(async () => {
    try {
      if (connectedAccount?.id) {
        await api.post(`/social-accounts/${connectedAccount.id}/sync`);
      }
      await loadDashboardData();
    } catch (err) {
      console.error('Sync live feed failed:', err);
      await loadDashboardData();
    }
  }, [connectedAccount, loadDashboardData]);

  // ─── DEFAULT ACCOUNT ───────────────────────────────────────────────────────
  const defaultAccount = {
    handle: user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '_')}` : '@akun_sosial',
    platform: 'instagram',
    followers_count: 0,
  };

  return (
    <div 
      className={`min-h-screen flex font-sans transition-all duration-300 relative ${
        isDarkMode ? 'bg-[#06121E] text-slate-100' : 'bg-[#FAF7F2] text-[#0D2738]'
      }`}
      style={{
        backgroundImage: isDarkMode 
          ? 'none' 
          : 'linear-gradient(rgba(22, 88, 123, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(22, 88, 123, 0.035) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >

      {/* Sidebar (Desktop Sticky Collapsible + Mobile Slide-Over) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRehat={() => setIsRehatModalOpen(true)}
        onOpenConnect={() => setIsSocialModalOpen(true)}
        connectedAccount={connectedAccount || defaultAccount}
        stressLevel={stats.stressLevel}
        user={user}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapsed}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

        {/* Floating Capsule Navbar (Image 3 inspired) */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenRehat={() => setIsRehatModalOpen(true)}
          onOpenConnect={() => setIsSocialModalOpen(true)}
          connectedAccount={connectedAccount || defaultAccount}
          stressLevel={stats.stressLevel}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleDesktopSidebar={toggleSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="px-3 sm:px-6 lg:px-8 space-y-6 max-w-7xl w-full mx-auto pb-28 lg:pb-8">

          {/* Elongated Hero Banner (Image 2 Redesign) */}
          <div 
            id="dashboard-section"
            className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 sm:p-8 lg:p-9 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-[#0B1E2E] via-[#0E283E] to-[#0B1E2E] border-white/10 shadow-lg shadow-black/25' 
                : 'bg-gradient-to-r from-white via-white to-sky-50/60 border-slate-200/80 shadow-xs'
            }`}
          >
            {/* Ambient Background Glow Spot */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
              isDarkMode ? 'bg-sky-500/10' : 'bg-sky-500/5'
            }`} />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                {/* Status Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${
                    isDarkMode 
                      ? 'text-sky-300 bg-sky-950/60 border-sky-800/50' 
                      : 'text-[#16587B] bg-[#16587B]/10 border-[#16587B]/20'
                  }`}>
                    {user?.plan || 'Agency Pro'}
                  </span>

                  <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-slate-300' 
                      : 'bg-slate-100/80 border-slate-200/80 text-slate-700'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)] shrink-0" />
                    <span>
                      Akun Terpantau:{' '}
                      <strong className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>
                        {connectedAccount?.handle || 'Belum ada akun terhubung'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Big Bold Headline ("halo kalychanya lebih besar dengan kotak memanjang gitu") */}
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
                  isDarkMode ? 'text-white' : 'text-[#0D2738]'
                }`}>
                  Halo, {user?.name || 'Kalyca Admin'}
                </h1>

                {/* Anti-slop Subtitle */}
                <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Sistem aktif menyaring ujaran kebencian & sarkasme secara real-time guna melindungi kenyamanan mental pengelola akun.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
                <button
                  onClick={() => setIsSocialModalOpen(true)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 text-white border-white/15' 
                      : 'bg-white hover:bg-slate-50 text-[#16587B] border-slate-200/80 shadow-xs'
                  }`}
                >
                  {connectedAccount ? 'Ganti Akun Target' : '+ Hubungkan Akun'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards (Directly below Hero Banner, Adaptive Responsive Grid) */}
          <StatsCards stats={stats} isDarkMode={isDarkMode} />

          {/* Real-time Web Push Notification Bar */}
          <PushNotificationWidget isDarkMode={isDarkMode} />

          {/* 2-Column: Stress Gauge + Live Analyzer */}
          <div id="analytics-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
            <div className="lg:col-span-5">
              <StressGauge
                stressLevel={stats.stressLevel}
                avgSeverity={stats.avgSeverity}
                toxicCount={stats.toxicCount}
                totalComments={stats.total}
                onTriggerRehat={() => setIsRehatModalOpen(true)}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="lg:col-span-7">
              <LiveCommentAnalyzer onAddComment={handleAddComment} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Comment Table */}
          <div id="comments-section" className="scroll-mt-24">
            <CommentTable
              comments={comments}
              onToggleHide={handleToggleHide}
              onDeleteComment={handleDeleteComment}
              onResetMock={loadDashboardData}
              loading={loadingComments}
              isDarkMode={isDarkMode}
            />
          </div>

        </main>

        {/* Footer */}
        <footer className={`mt-auto py-6 border-t text-center text-xs transition-all duration-300 pb-20 lg:pb-6 ${
          isDarkMode 
            ? 'border-[#16587B]/20 bg-[#081724] text-[#84B3CE]/60' 
            : 'border-[#16587B]/10 bg-white/60 text-[#4F7085]'
        }`}>
          <p>© 2026 SABAR — Sistem Moderation-as-a-Service Berbasis Context-Aware NLP. Lomba KMIPN 2026.</p>
        </footer>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (lg:hidden) ── */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around transition-all shadow-lg ${
        isDarkMode 
          ? 'bg-[#081724]/95 border-[#16587B]/30 text-white shadow-black/40' 
          : 'bg-white/95 border-[#16587B]/15 text-[#0D2738] shadow-[#16587B]/10'
      }`}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? isDarkMode ? 'text-[#F5EEDD] font-bold' : 'text-[#16587B] font-bold'
              : 'text-[#4F7085]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Utama</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'comments'
              ? isDarkMode ? 'text-[#F5EEDD] font-bold' : 'text-[#16587B] font-bold'
              : 'text-[#4F7085]'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span className="text-[10px]">Log Live</span>
          {comments.filter(c => c.is_hidden).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2.5 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setIsRehatModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-emerald-600 font-bold transition-all cursor-pointer"
        >
          <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-[10px]">Rehat</span>
        </button>

        <button
          onClick={() => setIsSocialModalOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? isDarkMode ? 'text-[#F5EEDD] font-bold' : 'text-[#16587B] font-bold'
              : 'text-[#4F7085]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px]">Akun</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#4F7085] hover:text-[#16587B] transition-all cursor-pointer"
        >
          <MenuIcon className="w-4 h-4" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>

      {/* Modals */}
      <AsistenRehatModal
        isOpen={isRehatModalOpen}
        onClose={() => setIsRehatModalOpen(false)}
        stressLevel={stats.stressLevel}
      />

      <SocialAccountModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        currentAccount={connectedAccount}
        onSelectAccount={(acc) => setConnectedAccount(acc)}
        onSyncLiveFeed={handleSyncLiveFeed}
        onAccountsChanged={loadDashboardData}
        user={user}
      />
    </div>
  );
}
