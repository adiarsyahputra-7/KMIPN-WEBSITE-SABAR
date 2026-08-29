import React from 'react';
import {
  X,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Trash2,
  ExternalLink,
  Link2,
  Clock,
  AlertTriangle,
  Plus
} from 'lucide-react';
import api from '../api';

// ─── PLATFORM ICONS ────────────────────────────────────────────────────────────
const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 00-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 002.11-2.107c.502-1.89.502-5.837.502-5.837s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
  </svg>
);

const PLATFORM_ICONS = {
  instagram: <InstagramIcon className="w-4 h-4 text-rose-500" />,
  youtube: <YoutubeIcon className="w-4 h-4 text-red-600" />,
  tiktok: <TikTokIcon className="w-4 h-4 text-cyan-400" />,
};

const PLATFORM_COLORS = {
  instagram: 'from-purple-500 via-rose-500 to-orange-400',
  youtube: 'from-red-500 to-red-700',
  tiktok: 'from-slate-900 via-slate-800 to-slate-900',
};

// ─── HELPER: Format tanggal expiry token ───────────────────────────────────────
const formatExpiryDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Token kedaluwarsa', urgent: true };
  if (diffDays <= 7) return { text: `Token berakhir dalam ${diffDays} hari`, urgent: true };
  if (diffDays <= 14) return { text: `Token berakhir dalam ${diffDays} hari`, urgent: false };
  return { text: `Token aktif (${diffDays} hari tersisa)`, urgent: false };
};

export default function SocialAccountModal({
  isOpen,
  onClose,
  currentAccount,
  onSelectAccount,
  onSyncLiveFeed,
  onAccountsChanged,
  user,
}) {
  const [accounts, setAccounts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [refreshingTokenId, setRefreshingTokenId] = React.useState(null);
  const [error, setError] = React.useState('');

  // State untuk TikTok Handle Connect
  const [tiktokHandleInput, setTiktokHandleInput] = React.useState('');
  const [tiktokConnecting, setTiktokConnecting] = React.useState(false);

  // ─── LOAD AKUN DARI DATABASE ───────────────────────────────────────────────
  const fetchAccounts = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/social-accounts');
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch social accounts:', err);
      setError('Gagal memuat daftar akun. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) fetchAccounts();
  }, [isOpen, fetchAccounts]);

  // ─── HANDLER: Buka Alur OAuth Instagram ───────────────────────────────────
  const handleConnectInstagram = () => {
    const userId = user?.id;
    const oauthUrl = userId
      ? `/auth/instagram?user_id=${userId}`
      : '/auth/instagram';

    onClose();
    window.location.href = oauthUrl;
  };

  // ─── HANDLER: Buka Alur OAuth YouTube ─────────────────────────────────────
  const handleConnectYouTube = () => {
    const userId = user?.id;
    const oauthUrl = userId
      ? `/auth/youtube?user_id=${userId}`
      : '/auth/youtube';

    onClose();
    window.location.href = oauthUrl;
  };

  // ─── HANDLER: Hubungkan Akun TikTok via Handle ────────────────────────────
  const handleConnectTikTok = async () => {
    if (!tiktokHandleInput.trim()) return;
    setTiktokConnecting(true);
    setError('');

    try {
      const handle = tiktokHandleInput.trim().startsWith('@')
        ? tiktokHandleInput.trim()
        : '@' + tiktokHandleInput.trim();

      const { data } = await api.post('/social-accounts', {
        platform: 'tiktok',
        handle: handle,
      });

      setTiktokHandleInput('');
      await fetchAccounts();
      if (data.account) {
        onSelectAccount(data.account);
      }
      if (onAccountsChanged) onAccountsChanged();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan akun TikTok. Periksa koneksi Anda.');
    } finally {
      setTiktokConnecting(false);
    }
  };

  // ─── HANDLER: Refresh Token ────────────────────────────────────────────────
  const handleRefreshToken = async (accountId, e) => {
    e.stopPropagation();
    setRefreshingTokenId(accountId);
    setError('');
    try {
      await api.post(`/social-accounts/${accountId}/refresh-token`);
      await fetchAccounts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui token. Silakan hubungkan ulang akun.';
      setError(msg);
    } finally {
      setRefreshingTokenId(null);
    }
  };

  // ─── HANDLER: Hapus Akun ────────────────────────────────────────────────────
  const handleDeleteAccount = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin melepaskan koneksi akun ini?\nData komentar yang terhubung akan ikut dihapus.')) return;

    try {
      await api.delete(`/social-accounts/${id}`);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      if (currentAccount?.id === id) onSelectAccount(null);
      if (onAccountsChanged) onAccountsChanged();
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Gagal menghapus akun. Coba lagi.');
    }
  };

  // ─── HANDLER: Sinkronisasi Komentar ──────────────────────────────────────
  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSyncLiveFeed();
    } finally {
      setSyncing(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden animate-scaleUp">

        {/* ── Header Modal ─────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Integrasi Akun Media Sosial
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan platform Instagram, YouTube & TikTok ke sistem SABAR
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* ── KONEKSI INSTAGRAM ──────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-rose-500 to-orange-400" />
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-rose-50 border border-rose-100 shrink-0">
                  <InstagramIcon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instagram Profesional</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Koneksikan akun Instagram Bisnis/Kreator untuk memantau & memoderasi komentar postingan.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConnectInstagram}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-orange-500 hover:from-purple-700 hover:via-rose-600 hover:to-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 group"
              >
                <InstagramIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Hubungkan Instagram (Meta OAuth)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>

          {/* ── KONEKSI YOUTUBE ────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-all">
            <div className="h-1 bg-gradient-to-r from-red-500 to-red-700" />
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 shrink-0">
                  <YoutubeIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">YouTube Channel</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Koneksikan channel YouTube Anda untuk memantau & menahan komentar video secara otomatis.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConnectYouTube}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 group"
              >
                <YoutubeIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Hubungkan YouTube (Google OAuth)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>

          {/* ── KONEKSI TIKTOK ────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900 text-white overflow-hidden shadow-md">
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400" />
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 shrink-0">
                  <TikTokIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">TikTok Creator Account</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Koneksikan akun TikTok Anda via Username (@handle). Foto profil, followers, & komentar video ditarik otomatis.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tiktokHandleInput}
                  onChange={(e) => setTiktokHandleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConnectTikTok()}
                  placeholder="@username_tiktok_anda"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-all"
                />
                <button
                  onClick={handleConnectTikTok}
                  disabled={tiktokConnecting || !tiktokHandleInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {tiktokConnecting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Hubungkan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Garis Pemisah ─────────────────────────────────────────────── */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400">Akun Terhubung ({accounts.length})</span>
            </div>
          </div>

          {/* ── Error Banner ──────────────────────────────────────────────── */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Daftar Akun ────────────────────────────────────────────────── */}
          <div className="space-y-2">
            {loading ? (
              <div className="py-8 flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Memuat daftar akun terhubung...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="py-8 text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Link2 className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs font-semibold text-slate-600">Belum Ada Akun Terhubung</p>
                <p className="text-[11px] text-slate-400">Klik salah satu opsi di atas untuk menghubungkan akun Instagram, YouTube, atau TikTok.</p>
              </div>
            ) : (
              accounts.map((acc) => {
                const isSelected = currentAccount?.id === acc.id || currentAccount?.handle === acc.handle;
                const expiry = formatExpiryDate(acc.token_expires_at);
                const isRefreshing = refreshingTokenId === acc.id;
                const isYoutube = acc.platform === 'youtube';
                const isTiktok  = acc.platform === 'tiktok';

                return (
                  <div
                    key={acc.id}
                    onClick={() => onSelectAccount(acc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar / Platform Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 overflow-hidden shrink-0 ${
                          isSelected ? 'border-emerald-300' : 'border-slate-200'
                        }`}>
                          {acc.avatar_url ? (
                            <img src={acc.avatar_url} alt={acc.handle} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${PLATFORM_COLORS[acc.platform] || 'from-slate-400 to-slate-600'} flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">
                                {acc.handle?.[1]?.toUpperCase() || (isYoutube ? 'Y' : isTiktok ? 'T' : 'I')}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900">{acc.handle}</p>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              isYoutube ? 'bg-red-50 text-red-700 border border-red-100' :
                              isTiktok  ? 'bg-slate-900 text-cyan-400 border border-slate-700' :
                              'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}>
                              {PLATFORM_ICONS[acc.platform]}
                              {acc.platform}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {(acc.followers_count || 0).toLocaleString('id-ID')} {isYoutube ? 'Subscriber' : 'Pengikut'}
                          </p>
                          {/* Token Expiry Badge */}
                          {expiry && (
                            <div className={`flex items-center gap-1 mt-0.5 text-[10px] font-medium ${
                              expiry.urgent ? 'text-amber-600' : 'text-slate-400'
                            }`}>
                              <Clock className="w-2.5 h-2.5" />
                              {expiry.text}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Refresh Token — hanya untuk Instagram (Meta Long-Lived Token) */}
                        {acc.token_expires_at && acc.platform === 'instagram' && (
                          <button
                            onClick={(e) => handleRefreshToken(acc.id, e)}
                            disabled={isRefreshing}
                            title="Perbarui Token API"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteAccount(acc.id, e)}
                          title="Lepaskan koneksi"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Tombol Sinkronisasi Komentar ───────────────────────────────── */}
          {accounts.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Menarik komentar...' : 'Tarik Komentar Terbaru (Instagram, YouTube & TikTok)'}
              </button>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Meta OAuth 2.0 · Google OAuth 2.0 · TikTok Engine API
          </span>
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800 font-medium">
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
