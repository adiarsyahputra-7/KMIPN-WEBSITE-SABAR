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

      {/* Sidebar (Desktop Sticky + Mobile Slide-Over) */}
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
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          onOpenRehat={() => setIsRehatModalOpen(true)}
          onOpenConnect={() => setIsSocialModalOpen(true)}
          connectedAccount={connectedAccount || defaultAccount}
          stressLevel={stats.stressLevel}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto pb-28 lg:pb-8">

          {/* Welcome Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-7 rounded-3xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#0B1E2E] border-[#16587B]/25 shadow-md' 
              : 'bg-white border-[#16587B]/15 shadow-xs'
          }`}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                  isDarkMode 
                    ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30' 
                    : 'text-[#16587B] bg-[#16587B]/10 border-[#16587B]/20'
                }`}>
                  {user?.plan || 'Creator Pro Tier'}
                </span>
                <span className={`text-xs font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>
                  Akun Terpantau:{' '}
                  <strong className={`font-bold ${isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'}`}>
                    {connectedAccount?.handle || 'Belum ada akun terhubung'}
                  </strong>
                </span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-2 font-['Plus_Jakarta_Sans'] ${
                isDarkMode ? 'text-[#F5EEDD]' : 'text-[#16587B]'
              }`}>
                Selamat Datang, {user?.name || 'Kreator SABAR'}
              </h2>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDarkMode ? 'text-[#84B3CE]/80' : 'text-[#4F7085]'}`}>
                Sistem aktif menyaring ujaran kebencian & sarkasme secara real-time guna melindungi kenyamanan mental pengelola akun.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
              <button
                onClick={() => setIsSocialModalOpen(true)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#16587B]/25 hover:bg-[#16587B]/40 text-[#F5EEDD] border-[#16587B]/30' 
                    : 'bg-[#FAF7F2] hover:bg-[#F5EEDD] text-[#16587B] border-[#16587B]/20'
                }`}
              >
                {connectedAccount ? 'Ganti Akun Target' : '+ Hubungkan Akun'}
              </button>
              <button
                onClick={() => setIsRehatModalOpen(true)}
                className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Asisten Rehat</span>
              </button>
            </div>
          </div>

          {/* Real-time Web Push Notification Bar */}
          <PushNotificationWidget isDarkMode={isDarkMode} />

          {/* Stats Cards */}
          <StatsCards stats={stats} isDarkMode={isDarkMode} />

          {/* 2-Column: Stress Gauge + Live Analyzer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
          <CommentTable
            comments={comments}
            onToggleHide={handleToggleHide}
            onDeleteComment={handleDeleteComment}
            onResetMock={loadDashboardData}
            loading={loadingComments}
            isDarkMode={isDarkMode}
          />

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
