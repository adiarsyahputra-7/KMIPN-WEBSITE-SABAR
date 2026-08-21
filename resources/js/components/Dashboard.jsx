import React, { useState, useMemo } from 'react';
import Navbar from './Navbar';
import StatsCards from './StatsCards';
import StressGauge from './StressGauge';
import LiveCommentAnalyzer from './LiveCommentAnalyzer';
import CommentTable from './CommentTable';
import AsistenRehatModal from './AsistenRehatModal';
import SocialAccountModal from './SocialAccountModal';
import { initialComments } from '../data/mockData';
import { Sparkles, Shield, Heart, TrendingUp, Info } from 'lucide-react';

export default function Dashboard() {
  const [comments, setComments] = useState(initialComments);
  const [isRehatModalOpen, setIsRehatModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({
    handle: "@official_sabar_brand",
    name: "SABAR Official Brand",
    followers: "128.4K",
  });

  // Calculate Metrics & Stress Load Index in real-time
  const stats = useMemo(() => {
    const total = comments.length;
    if (total === 0) {
      return {
        total: 0,
        positiveCount: 0,
        positivePercent: 0,
        negativeCount: 0,
        negativePercent: 0,
        toxicCount: 0,
        toxicPercent: 0,
        avgSeverity: 0,
        stressLevel: 0,
      };
    }

    const positiveCount = comments.filter(c => c.sentiment === 'POSITIF').length;
    const negativeCount = comments.filter(c => c.sentiment === 'NEGATIF').length;
    const toxicComments = comments.filter(c => c.is_hidden || c.toxicity_score >= 0.5);
    const toxicCount = toxicComments.length;

    const totalSeverity = toxicComments.reduce((acc, curr) => acc + (curr.severity || 1), 0);
    const avgSeverity = toxicCount > 0 ? totalSeverity / toxicCount : 1;

    // Formula from SABAR Document: (toxic_count * avg_severity) / total_comments * 100
    // Capped at 100%
    const rawStress = ((toxicCount * avgSeverity) / total) * 10;
    const stressLevel = Math.min(100, Math.max(0, rawStress * 1.5)); // Normalized scale for sensitivity

    return {
      total,
      positiveCount,
      positivePercent: Math.round((positiveCount / total) * 100),
      negativeCount,
      negativePercent: Math.round((negativeCount / total) * 100),
      toxicCount,
      toxicPercent: Math.round((toxicCount / total) * 100),
      avgSeverity,
      stressLevel,
    };
  }, [comments]);

  // Handler: Add comment from Live Analyzer
  const handleAddComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    // If high stress triggered automatically, suggest break
    if (newComment.severity >= 8) {
      // Optional subtle prompt
    }
  };

  // Handler: Toggle hide status
  const handleToggleHide = (id) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newHidden = !c.is_hidden;
          return {
            ...c,
            is_hidden: newHidden,
            action: newHidden ? "HIDE" : "ALLOW"
          };
        }
        return c;
      })
    );
  };

  // Handler: Reset mock data
  const handleResetMock = () => {
    setComments(initialComments);
  };

  // Handler: Simulate pulling fresh comments from Instagram
  const handleSyncLiveFeed = () => {
    const liveBatch = [
      {
        id: `batch-${Date.now()}-1`,
        author: "@netizen_kepo",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        platform: "Instagram",
        postTitle: "Posting Terbaru",
        text: "Keren banget terobosan terbarunya, salut sama tim pengembang!",
        sentiment: "POSITIF",
        toxicity_score: 0.02,
        severity: 1,
        is_sarcasm: false,
        action: "ALLOW",
        is_hidden: false,
        timestamp: "Baru saja",
      },
      {
        id: `batch-${Date.now()}-2`,
        author: "@toxic_spammer_9",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        platform: "Instagram",
        postTitle: "Posting Terbaru",
        text: "Mending bubar aja kalian gaada gunanya sama sekali buat masyarakat.",
        sentiment: "NEGATIF",
        toxicity_score: 0.95,
        severity: 9,
        is_sarcasm: false,
        action: "HIDE",
        is_hidden: true,
        timestamp: "Baru saja",
      },
    ];

    setComments(prev => [...liveBatch, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Top Navigation */}
      <Navbar
        onOpenRehat={() => setIsRehatModalOpen(true)}
        onOpenConnect={() => setIsSocialModalOpen(true)}
        connectedAccount={connectedAccount}
        stressLevel={stats.stressLevel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner Welcome & Value Prop */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#111A2E] to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Dashboard Moderasi & Proteksi Mental
              </span>
              <span className="text-xs text-slate-400">
                Akun Terhubung: <strong className="text-white">{connectedAccount.handle}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              Proteksi Reputasi & Kesehatan Jiwa Pekerja Digital
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              SABAR secara otomatis mencegat, menyaring, dan menyembunyikan komentar sarkasme dan ujaran kebencian secara real-time sebelum sempat dibaca oleh pengelola akun.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setIsSocialModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              Ganti Akun Target
            </button>
            <button
              onClick={() => setIsRehatModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              Asisten Rehat
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <StatsCards stats={stats} />

        {/* 2 Column Section: Stress Gauge & Live Comment Tester */}
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

        {/* Moderation Comment Table */}
        <CommentTable
          comments={comments}
          onToggleHide={handleToggleHide}
          onResetMock={handleResetMock}
        />

      </main>

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
      />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <p>© 2026 SABAR — Sistem Moderation-as-a-Service Berbasis Context-Aware NLP. Lomba KMIPN 2026.</p>
      </footer>

    </div>
  );
}
