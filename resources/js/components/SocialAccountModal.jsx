import React from 'react';
import { 
  X, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  KeyRound, 
  ExternalLink 
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function SocialAccountModal({ isOpen, onClose, currentAccount, onSelectAccount, onSyncLiveFeed }) {
  if (!isOpen) return null;

  const mockAccounts = [
    {
      handle: "@official_sabar_brand",
      name: "SABAR Official Brand",
      followers: "128.4K",
      postsCount: "420",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      status: "Connected",
    },
    {
      handle: "@kalyca_creator",
      name: "Kalyca Kyla (Public Figure)",
      followers: "892.1K",
      postsCount: "1,240",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      status: "Connected",
    },
    {
      handle: "@agensi_kreatif_id",
      name: "Agensi Manajemen Reputasi",
      followers: "45.2K",
      postsCount: "310",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      status: "Connected",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#0E1626] border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-rose-500/30 text-rose-400">
              <InstagramIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Koneksi Integrasi Media Sosial
              </h3>
              <p className="text-[11px] text-slate-400">
                Instagram Graph API & TikTok for Developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Pilih akun media sosial yang sedang dikelola untuk memantau aliran komentar masuk dan mengaktifkan moderasi otomatis:
          </p>

          <div className="space-y-2.5">
            {mockAccounts.map((acc) => {
              const isSelected = currentAccount?.handle === acc.handle;
              return (
                <div
                  key={acc.handle}
                  onClick={() => onSelectAccount(acc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-500/10 border-teal-500/50 shadow-md shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{acc.name}</p>
                        <span className="text-[10px] text-teal-300 font-semibold">{acc.handle}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {acc.followers} Pengikut • {acc.postsCount} Postingan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-teal-400 bg-teal-500/20 px-2.5 py-1 rounded-full border border-teal-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 hover:text-slate-300">
                        Gunakan
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Simulation Sync Button */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Sinkronisasi Komentar Baru (Simulasi Live)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Webhook Ready</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tarik 3 komentar baru secara otomatis dari media sosial untuk menguji proses penapisan seketika.
            </p>
            <button
              onClick={() => {
                onSyncLiveFeed();
                onClose();
              }}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 border border-teal-500/30 hover:border-teal-500/50 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tarik Komentar Terbaru Sekarang
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Meta & TikTok API Certified Protocol
          </span>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
