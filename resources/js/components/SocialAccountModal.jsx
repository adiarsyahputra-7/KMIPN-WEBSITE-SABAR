import React from 'react';
import { 
  X, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current text-rose-600" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function SocialAccountModal({ isOpen, onClose, currentAccount, onSelectAccount, onSyncLiveFeed }) {
  if (!isOpen) return null;

  const [accounts, setAccounts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newPlatform, setNewPlatform] = React.useState('instagram');
  const [newHandle, setNewHandle] = React.useState('');
  const [newFollowers, setNewFollowers] = React.useState('');
  const [adding, setAdding] = React.useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/social-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error("Failed to fetch social accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newHandle.trim()) return;

    setAdding(true);
    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch('/api/social-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          platform: newPlatform,
          handle: newHandle,
          followers_count: parseInt(newFollowers) || 12500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(prev => [...prev, data.account]);
        onSelectAccount(data.account);
        setNewHandle('');
        setNewFollowers('');
        setShowAddForm(false);
      } else {
        alert("Gagal menambahkan akun sosial.");
      }
    } catch (err) {
      console.error("Failed to add social account:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAccount = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin melepaskan koneksi akun ini?")) return;

    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`/api/social-accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  // Fallback demo accounts if empty
  const displayAccounts = accounts.length > 0 ? accounts : [
    {
      id: 'demo-1',
      handle: "@official_sabar_brand",
      platform: "instagram",
      followers_count: 128400,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: 'demo-2',
      handle: "@adiar_tiktok",
      platform: "tiktok",
      followers_count: 45000,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
              <InstagramIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Integrasi Media Sosial (MySQL DB)
              </h3>
              <p className="text-[11px] text-slate-500">
                Instagram Graph API & TikTok API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Pilih akun media sosial yang sedang dipantau oleh penapisan otomatis:
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              {showAddForm ? "Batal" : "+ Tambah Akun"}
            </button>
          </div>

          {/* Form Add Account */}
          {showAddForm && (
            <form onSubmit={handleAddAccount} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800">Hubungkan Akun Sosial Media Baru</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
                <input
                  type="text"
                  placeholder="@handle_akun"
                  required
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                {adding ? "Menyimpan..." : "Simpan Akun ke Database"}
              </button>
            </form>
          )}

          {/* Accounts List */}
          <div className="space-y-2">
            {loading ? (
              <p className="text-xs text-center py-4 text-slate-400 animate-pulse">Memuat daftar akun sosmed...</p>
            ) : (
              displayAccounts.map((acc) => {
                const isSelected = currentAccount?.handle === acc.handle || currentAccount?.id === acc.id;
                return (
                  <div
                    key={acc.id || acc.handle}
                    onClick={() => onSelectAccount(acc)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200">
                        {acc.platform ? acc.platform[0].toUpperCase() : "I"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{acc.handle}</p>
                        <p className="text-[11px] text-slate-500 uppercase">{acc.platform} • {(acc.followers_count || 12500).toLocaleString()} Pengikut</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                      {acc.id && typeof acc.id === 'number' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAccount(acc.id, e)}
                          title="Hapus Koneksi"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sync Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onSyncLiveFeed();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tarik Komentar Terbaru (Simulasi Webhook)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Meta Verified Webhook Protocol
          </span>
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
