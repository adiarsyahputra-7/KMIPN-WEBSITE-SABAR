import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import StatsCards from './StatsCards';
import StressGauge from './StressGauge';
import LiveCommentAnalyzer from './LiveCommentAnalyzer';
import CommentTable from './CommentTable';
import AsistenRehatModal from './AsistenRehatModal';
import SocialAccountModal from './SocialAccountModal';
import { initialComments } from '../data/mockData';
import { ShieldCheck, Sparkles, Heart, Activity } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRehatModalOpen, setIsRehatModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({
    handle: "@official_sabar_brand",
    name: "SABAR Official Brand",
    followers: "128.4K",
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/comments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data.length > 0 ? data : initialComments); // fallback to mock if empty for demo
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setComments(initialComments); // fallback
      }
    };
    fetchComments();
  }, []);

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
    const rawStress = ((toxicCount * avgSeverity) / total) * 10;
    const stressLevel = Math.min(100, Math.max(0, rawStress * 1.5));

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

  const handleAddComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleToggleHide = async (id) => {
    // Optimistic UI update
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

    // Actual API Call
    try {
      const token = localStorage.getItem('auth_token');
      // If it's a mock comment (id contains 'mock' or 'batch'), we can just return since it won't exist in DB
      if (typeof id === 'string' && (id.includes('mock') || id.includes('batch'))) return;
      
      await fetch(`/api/comments/${id}/toggle-hide`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error("Failed to toggle hide on server:", error);
      // Ideally revert the optimistic update here if needed
    }
  };

  const handleResetMock = () => {
    setComments(initialComments);
  };

  const handleSyncLiveFeed = () => {
    const liveBatch = [
      {
        id: `batch-${Date.now()}-1`,
        author: "@netizen_kreatif",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        platform: "Instagram",
        postTitle: "Posting Terbaru",
        text: "Keren banget terobosan barunya, sangat membantu kesehatan mental!",
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
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      
      {/* 1. Authentic Modern SaaS Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRehat={() => setIsRehatModalOpen(true)}
        onOpenConnect={() => setIsSocialModalOpen(true)}
        connectedAccount={connectedAccount}
        stressLevel={stats.stressLevel}
        user={user}
        onLogout={onLogout}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onOpenRehat={() => setIsRehatModalOpen(true)}
          onOpenConnect={() => setIsSocialModalOpen(true)}
          connectedAccount={connectedAccount}
          stressLevel={stats.stressLevel}
        />

        {/* Page Content Body */}
        <main className="p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {user?.plan || "Agency Pro Tier"}
                </span>
                <span className="text-xs text-slate-400">
                  Target Akun: <strong className="text-slate-800">{connectedAccount.handle}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans'] mt-1">
                Selamat Datang, {user?.name || "Kalyca Kyla"}
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
                Ganti Akun Target
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

          {/* 4 Summary Stats Cards */}
          <StatsCards stats={stats} />

          {/* 2-Column: Stress Gauge & Live Context-Aware Tester */}
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

          {/* Live Comment Moderation Table */}
          <CommentTable
            comments={comments}
            onToggleHide={handleToggleHide}
            onResetMock={handleResetMock}
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
      />

    </div>
  );
}
