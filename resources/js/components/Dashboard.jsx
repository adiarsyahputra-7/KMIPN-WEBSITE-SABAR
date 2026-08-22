import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatsCards from './StatsCards';
import StressGauge from './StressGauge';
import LiveCommentAnalyzer from './LiveCommentAnalyzer';
import CommentTable from './CommentTable';
import AsistenRehatModal from './AsistenRehatModal';
import SocialAccountModal from './SocialAccountModal';
import api from '../api';
import { Heart } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [comments, setComments] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRehatModalOpen, setIsRehatModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);

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
    // Tambah ke state lokal secara optimis
    setComments(prev => [newComment, ...prev]);
    // Refresh stats dari server
    api.get('/dashboard/stats')
      .then(res => setApiStats(res.data))
      .catch(console.error);
  }, []);

  // ─── HANDLER: Toggle sembunyikan/tampilkan komentar ───────────────────────
  const handleToggleHide = useCallback(async (id) => {
    // Optimistic UI update — langsung update tampilan sebelum tunggu server
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newHidden = !c.is_hidden;
          return { ...c, is_hidden: newHidden, action: newHidden ? 'HIDE' : 'ALLOW' };
        }
        return c;
      })
    );

    // Kirim ke API — hanya untuk ID integer (bukan ID mock lokal)
    if (typeof id === 'number' || (typeof id === 'string' && !id.includes('mock') && !id.includes('batch') && !id.includes('cmt-'))) {
      try {
        await api.patch(`/comments/${id}/toggle-hide`);
        // Refresh stats setelah aksi moderasi
        const { data } = await api.get('/dashboard/stats');
        setApiStats(data);
      } catch (err) {
        console.error('Failed to toggle hide on server:', err);
        // Rollback optimistic update jika gagal
        loadDashboardData();
      }
    }
  }, [loadDashboardData]);

  // ─── HANDLER: Sinkronisasi Komentar Instagram (Live API / Simulasi) ────────
  const handleSyncLiveFeed = useCallback(async () => {
    try {
      if (connectedAccount?.id) {
        // Panggil endpoint sinkronisasi backend yang menghubungi Instagram Graph API
        await api.post(`/social-accounts/${connectedAccount.id}/sync`);
      }
      // Muat ulang komentar dan statistik terbaru dari database
      await loadDashboardData();
    } catch (err) {
      console.error('Sync live feed failed:', err);
      // Fallback: muat ulang data dashboard
      await loadDashboardData();
    }
  }, [connectedAccount, loadDashboardData]);

  // ─── LOADING STATE ─────────────────────────────────────────────────────────
  const defaultAccount = {
    handle: user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '_')}` : '@akun_sosial',
    platform: 'instagram',
    followers_count: 0,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRehat={() => setIsRehatModalOpen(true)}
        onOpenConnect={() => setIsSocialModalOpen(true)}
        connectedAccount={connectedAccount || defaultAccount}
        stressLevel={stats.stressLevel}
        user={user}
        onLogout={onLogout}
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
        />

        {/* Page Content */}
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {user?.plan || 'Creator Pro Tier'}
                </span>
                <span className="text-xs text-slate-400">
                  Akun Terpantau:{' '}
                  <strong className="text-slate-800">
                    {connectedAccount?.handle || 'Belum ada akun terhubung'}
                  </strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                Selamat Datang, {user?.name || 'Pengguna SABAR'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem aktif menyaring ujaran kebencian & sarkasme secara real-time guna melindungi kenyamanan mental pengelola akun.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSocialModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-all"
              >
                {connectedAccount ? 'Ganti Akun Target' : '+ Hubungkan Akun'}
              </button>
              <button
                onClick={() => setIsRehatModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5" />
                Asisten Rehat
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* 2-Column: Stress Gauge + Live Analyzer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <StressGauge
                stressLevel={stats.stressLevel}
                avgSeverity={stats.avgSeverity}
                toxicCount={stats.toxicCount}
                totalComments={stats.total}
                onTriggerRehat={() => setIsRehatModalOpen(true)}
              />
            </div>
            <div className="lg:col-span-7">
              <LiveCommentAnalyzer onAddComment={handleAddComment} />
            </div>
          </div>

          {/* Comment Table */}
          <CommentTable
            comments={comments}
            onToggleHide={handleToggleHide}
            loading={loadingComments}
          />

        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
          <p>© 2026 SABAR — Sistem Moderation-as-a-Service Berbasis Context-Aware NLP. Lomba KMIPN 2026.</p>
        </footer>
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
