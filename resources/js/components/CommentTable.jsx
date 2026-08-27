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

export default function CommentTable({ comments, onToggleHide, onDeleteComment, onResetMock }) {
  const [filter, setFilter] = useState("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter(c => {
    // Filter status
    if (filter === "HIDDEN" && !c.is_hidden) return false;
    if (filter === "ALLOWED" && c.is_hidden) return false;
    if (filter === "POSITIF" && c.sentiment !== "POSITIF") return false;
    if (filter === "NEGATIF" && c.sentiment !== "NEGATIF") return false;

    // Filter platform
    if (platformFilter !== "ALL") {
      const commentPlatform = (c.platform || 'instagram').toLowerCase();
      if (commentPlatform !== platformFilter.toLowerCase()) return false;
    }

    // Search query
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

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Log Moderasi Komentar Masuk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar penapisan otomatis komentar Instagram & YouTube sebelum dikonsumsi publik
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Platform Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Platform</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komentar..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 w-40 sm:w-52 transition-all"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onResetMock}
            title="Muat ulang data"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
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
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Pengguna & Platform</th>
              <th className="py-3 px-4">Konten Komentar</th>
              <th className="py-3 px-4">Sentimen & Skor</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-600">Tidak ada komentar ditemukan</p>
                    <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter platform di atas.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredComments.map((cmt) => {
                const isYoutube = (cmt.platform || 'instagram').toLowerCase() === 'youtube';
                const formattedTime = cmt.timestamp 
                  ? (typeof cmt.timestamp === 'string' && cmt.timestamp.includes('T')
                      ? new Date(cmt.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                      : cmt.timestamp)
                  : 'Baru saja';

                return (
                  <tr 
                    key={cmt.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      cmt.is_hidden ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    {/* User & Platform */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={cmt.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                            alt={cmt.author}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border border-white ${
                            isYoutube ? 'bg-red-50' : 'bg-rose-50'
                          }`}>
                            {isYoutube ? <YoutubeSmallIcon /> : <InstagramSmallIcon />}
                          </div>
                        </div>

                        <div>
                          <p className="font-bold text-slate-900">{cmt.author}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isYoutube 
                                ? 'bg-red-50 text-red-700 border border-red-100' 
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}>
                              {isYoutube ? 'YouTube' : 'Instagram'}
                            </span>
                            <span className="text-[10px] text-slate-400">· {formattedTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Comment Text */}
                    <td className="py-3.5 px-4 max-w-sm sm:max-w-md">
                      <div className="space-y-1">
                        <p className={`text-slate-800 leading-relaxed ${cmt.is_hidden ? 'line-through text-slate-400' : ''}`}>
                          {cmt.text}
                        </p>
                        {(cmt.post_title || cmt.postTitle) && (
                          <p className="text-[10px] text-slate-400 truncate font-medium">
                            📁 {cmt.post_title || cmt.postTitle}
                          </p>
                        )}
                        {cmt.reason && (
                          <div className="pt-0.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${
                              cmt.is_hidden
                                ? 'bg-rose-50/80 text-rose-700 border-rose-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200/60'
                            }`}>
                              <span className="font-bold text-slate-500">🤖 Analisis SABAR:</span>
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
                              ? 'bg-emerald-100 text-emerald-800'
                              : cmt.sentiment === 'NEGATIF'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {cmt.sentiment}
                          </span>
                          {cmt.is_sarcasm && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                              Sarkas
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Toksisitas: <strong>{Math.round((cmt.toxicity_score || 0) * 100)}%</strong> (Sev: {cmt.severity || 1}/10)
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {cmt.is_hidden ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                          <EyeOff className="w-3 h-3" />
                          Tertahan (Hidden)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
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
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            cmt.is_hidden
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200'
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
                          className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-all"
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
