import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';

const InstagramSmallIcon = () => (
  <svg className="w-3 h-3 fill-current text-rose-500 shrink-0" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeSmallIcon = () => (
  <svg className="w-3 h-3 fill-current text-red-600 shrink-0" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 00-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 002.11-2.107c.502-1.89.502-5.837.502-5.837s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokSmallIcon = () => (
  <svg className="w-3 h-3 fill-current text-cyan-400 shrink-0" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.75a4.85 4.85 0 01-1.02-.06z"/>
  </svg>
);

export default function CommentTable({ comments, onToggleHide, onDeleteComment, onResetMock, isDarkMode }) {
  const [filter, setFilter] = useState("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter(c => {
    if (filter === "HIDDEN" && !c.is_hidden) return false;
    if (filter === "ALLOWED" && c.is_hidden) return false;
    if (filter === "POSITIF" && c.sentiment !== "POSITIF") return false;
    if (filter === "NEGATIF" && c.sentiment !== "NEGATIF") return false;

    if (platformFilter !== "ALL") {
      const commentPlatform = (c.platform || 'instagram').toLowerCase();
      if (commentPlatform !== platformFilter.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (c.text && c.text.toLowerCase().includes(q)) ||
        (c.author && c.author.toLowerCase().includes(q)) ||
        (c.post_title && c.post_title.toLowerCase().includes(q)) ||
        (c.postTitle && c.postTitle.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // ── Warna dinamis sesuai tema ──────────────────────────────────────────────
  const dm = isDarkMode;

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
      dm ? 'bg-[#0B1522] border-[#16587B]/20 shadow-md' : 'bg-white border-slate-200/80 shadow-sm'
    }`}>
      
      {/* Header & Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        dm ? 'border-[#16587B]/15' : 'border-slate-100'
      }`}>
        <div>
          <h3 className={`text-sm font-bold font-['Plus_Jakarta_Sans'] ${dm ? 'text-[#F5EEDD]' : 'text-slate-900'}`}>
            Log Moderasi Komentar Masuk
          </h3>
          <p className={`text-xs mt-0.5 ${dm ? 'text-[#84B3CE]/60' : 'text-slate-500'}`}>
            Daftar penapisan otomatis komentar Instagram, YouTube & TikTok sebelum dikonsumsi publik
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Filter Dropdown */}
          <div className={`flex items-center gap-1.5 border rounded-xl px-2.5 py-1 ${
            dm ? 'bg-[#0A2233]/60 border-[#16587B]/25' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <SlidersHorizontal className={`w-3.5 h-3.5 ${dm ? 'text-[#84B3CE]/60' : 'text-slate-400'}`} />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className={`bg-transparent text-xs font-semibold outline-none cursor-pointer ${
                dm ? 'text-[#84B3CE]' : 'text-slate-700'
              }`}
            >
              <option value="ALL">Semua Platform</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${dm ? 'text-[#84B3CE]/50' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komentar..."
              className={`pl-8 pr-3 py-1.5 rounded-xl text-xs w-40 sm:w-52 transition-all focus:outline-none focus:ring-1 focus:ring-[#16587B] ${
                dm
                  ? 'bg-[#0A2233]/60 border border-[#16587B]/25 text-white placeholder-[#84B3CE]/40 focus:bg-[#071725]'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400'
              }`}
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onResetMock}
            title="Muat ulang data"
            className={`p-2 rounded-xl border transition-all ${
              dm
                ? 'bg-[#0A2233]/60 border-[#16587B]/25 text-[#84B3CE]/70 hover:text-[#F5EEDD] hover:bg-[#16587B]/20'
                : 'bg-slate-50 border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { key: "ALL", label: `Semua (${comments.length})` },
          { key: "HIDDEN", label: `Tertahan/Hidden (${comments.filter(c => c.is_hidden).length})` },
          { key: "POSITIF", label: `Positif (${comments.filter(c => c.sentiment === 'POSITIF').length})` },
          { key: "NEGATIF", label: `Negatif & Sarkas (${comments.filter(c => c.sentiment === 'NEGATIF').length})` },
          { key: "ALLOWED", label: `Tayang/Allowed (${comments.filter(c => !c.is_hidden).length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              filter === tab.key
                ? dm ? 'bg-[#16587B] text-[#F5EEDD] shadow-sm' : 'bg-slate-900 text-white shadow-sm'
                : dm ? 'bg-[#0A2233]/40 text-[#84B3CE]/70 hover:bg-[#16587B]/20 hover:text-[#F5EEDD] border border-[#16587B]/20' 
                     : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`overflow-x-auto border rounded-2xl ${dm ? 'border-[#16587B]/15' : 'border-slate-100'}`}>
        <table className="w-full text-left text-xs">
          <thead className={`border-b font-semibold uppercase tracking-wider ${
            dm ? 'bg-[#0A2233]/60 border-[#16587B]/15 text-[#84B3CE]/70' : 'bg-slate-50/80 border-slate-200/80 text-slate-500'
          }`}>
            <tr>
              <th className="py-3 px-4">Pengguna & Platform</th>
              <th className="py-3 px-4">Konten Komentar</th>
              <th className="py-3 px-4">Sentimen & Skor</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${dm ? 'divide-[#16587B]/10' : 'divide-slate-100'}`}>
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="space-y-1">
                    <p className={`font-semibold ${dm ? 'text-[#84B3CE]/70' : 'text-slate-600'}`}>Tidak ada komentar ditemukan</p>
                    <p className={`text-[11px] ${dm ? 'text-[#84B3CE]/40' : 'text-slate-400'}`}>Coba ubah kata kunci pencarian atau filter platform di atas.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredComments.map((cmt) => {
                const platform = (cmt.platform || 'instagram').toLowerCase();
                const isYoutube = platform === 'youtube';
                const isTiktok  = platform === 'tiktok';

                const formattedTime = cmt.timestamp 
                  ? (typeof cmt.timestamp === 'string' && cmt.timestamp.includes('T')
                      ? new Date(cmt.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : cmt.timestamp)
                  : 'Baru saja';

                return (
                  <tr 
                    key={cmt.id} 
                    className={`transition-colors ${
                      cmt.is_hidden
                        ? dm ? 'bg-rose-950/10' : 'bg-rose-50/30'
                        : dm ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* User & Platform */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={
                              cmt.avatar ||
                              `https://unavatar.io/instagram/${(cmt.author || '').replace('@', '')}`
                            }
                            alt={cmt.author}
                            onError={(e) => {
                              const cleanName = (cmt.author || 'User').replace('@', '');
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=84B3CE&color=ffffff&bold=true`;
                            }}
                            className={`w-8 h-8 rounded-full object-cover border ${dm ? 'border-[#16587B]/30' : 'border-slate-200'}`}
                          />
                          <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border ${
                            dm ? 'border-[#0B1522]' : 'border-white'
                          } ${
                            isYoutube ? 'bg-red-50' : isTiktok ? 'bg-slate-900' : 'bg-rose-50'
                          }`}>
                            {isYoutube ? <YoutubeSmallIcon /> : isTiktok ? <TikTokSmallIcon /> : <InstagramSmallIcon />}
                          </div>
                        </div>

                        <div>
                          <p className={`font-bold ${dm ? 'text-[#F5EEDD]' : 'text-slate-900'}`}>{cmt.author}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isYoutube ? 'bg-red-50 text-red-700 border border-red-100' :
                              isTiktok  ? 'bg-slate-900 text-cyan-400 border border-slate-700' :
                              dm ? 'bg-purple-950/30 text-purple-300 border border-purple-900/30' : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}>
                              {isYoutube ? 'YouTube' : isTiktok ? 'TikTok' : 'Instagram'}
                            </span>
                            <span className={`text-[10px] ${dm ? 'text-[#84B3CE]/50' : 'text-slate-400'}`}>· {formattedTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Comment Text */}
                    <td className="py-3.5 px-4 max-w-sm sm:max-w-md">
                      <div className="space-y-1">
                        <p className={`leading-relaxed ${
                          cmt.is_hidden 
                            ? dm ? 'line-through text-[#84B3CE]/40' : 'line-through text-slate-400'
                            : dm ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {cmt.text}
                        </p>
                        {(cmt.post_title || cmt.postTitle) && (
                          <p className={`text-[10px] truncate font-medium ${dm ? 'text-[#84B3CE]/50' : 'text-slate-400'}`}>
                            📁 {cmt.post_title || cmt.postTitle}
                          </p>
                        )}
                        {cmt.reason && (
                          <div className="pt-0.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${
                              cmt.is_hidden
                                ? dm ? 'bg-rose-950/25 text-rose-300 border-rose-900/30' : 'bg-rose-50/80 text-rose-700 border-rose-100'
                                : dm ? 'bg-[#0A2233]/60 text-[#84B3CE]/70 border-[#16587B]/20' : 'bg-slate-50 text-slate-600 border-slate-200/60'
                            }`}>
                              <span className={`font-bold ${dm ? 'text-[#84B3CE]/60' : 'text-slate-500'}`}>🤖 Analisis SABAR:</span>
                              <span>{cmt.reason}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Sentiment & Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            cmt.sentiment === 'POSITIF'
                              ? dm ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                              : cmt.sentiment === 'NEGATIF'
                              ? dm ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-100 text-rose-800'
                              : dm ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {cmt.sentiment}
                          </span>
                          {cmt.is_sarcasm && (
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                              dm ? 'bg-amber-950/30 text-amber-400' : 'bg-amber-100 text-amber-800'
                            }`}>
                              Sarkas
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] ${dm ? 'text-[#84B3CE]/55' : 'text-slate-500'}`}>
                          Toksisitas: <strong className={dm ? 'text-[#F5EEDD]' : ''}>{Math.round((cmt.toxicity_score || 0) * 100)}%</strong> (Sev: {cmt.severity || 1}/10)
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {cmt.is_hidden ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          dm ? 'bg-rose-950/30 text-rose-400' : 'bg-rose-100 text-rose-700'
                        }`}>
                          <EyeOff className="w-3 h-3" />
                          Tertahan (Hidden)
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          dm ? 'bg-emerald-950/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <Eye className="w-3 h-3" />
                          Tayang (Allowed)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleHide(cmt.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                            cmt.is_hidden
                              ? dm ? 'bg-[#16587B]/20 text-[#F5EEDD] border-[#16587B]/30 hover:bg-[#16587B]/40'
                                   : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                              : dm ? 'bg-transparent text-[#84B3CE] border-[#16587B]/20 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30'
                                   : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border-slate-200'
                          }`}
                        >
                          {cmt.is_hidden ? "Tampilkan" : "Sembunyikan"}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus komentar dari ${cmt.author} di sistem SABAR?`)) {
                              onDeleteComment && onDeleteComment(cmt.id);
                            }
                          }}
                          title="Hapus komentar dari sistem SABAR"
                          className={`p-1.5 rounded-xl border transition-all ${
                            dm
                              ? 'bg-transparent text-[#84B3CE]/50 border-[#16587B]/20 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

