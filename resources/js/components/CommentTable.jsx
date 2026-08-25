import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';

export default function CommentTable({ comments, onToggleHide, onDeleteComment, onResetMock }) {
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter(c => {
    if (filter === "HIDDEN" && !c.is_hidden) return false;
    if (filter === "ALLOWED" && c.is_hidden) return false;
    if (filter === "POSITIF" && c.sentiment !== "POSITIF") return false;
    if (filter === "NEGATIF" && c.sentiment !== "NEGATIF") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.text.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        (c.postTitle && c.postTitle.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Log Moderasi Komentar Masuk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar penapisan otomatis komentar sebelum dibaca oleh pengelola akun
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komentar atau akun..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={onResetMock}
            title="Muat ulang dataset sampel"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
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
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Konten Komentar</th>
              <th className="py-3 px-4">Sentimen & Skor</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Tidak ada komentar yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredComments.map((cmt) => (
                <tr 
                  key={cmt.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    cmt.is_hidden ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* User */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cmt.avatar}
                        alt={cmt.author}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{cmt.author}</p>
                        <p className="text-[10px] text-slate-400">{cmt.platform} • {cmt.timestamp}</p>
                      </div>
                    </div>
                  </td>

                  {/* Comment Text */}
                  <td className="py-3.5 px-4 max-w-sm sm:max-w-md">
                    <div className="space-y-0.5">
                      <p className={`text-slate-800 leading-relaxed ${cmt.is_hidden ? 'line-through text-slate-400' : ''}`}>
                        {cmt.text}
                      </p>
                      {cmt.postTitle && (
                        <p className="text-[10px] text-slate-400 truncate">
                          Post: {cmt.postTitle}
                        </p>
                      )}
                      {cmt.reason && (
                        <div className="pt-1">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all ${
                            cmt.is_hidden
                              ? 'bg-rose-50/70 text-rose-700 border-rose-100/60 shadow-sm shadow-rose-500/5'
                              : 'bg-slate-50/80 text-slate-600 border-slate-200/60'
                          }`}>
                            <span className="font-semibold text-slate-400">🤖 Analisis SABAR:</span>
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cmt.sentiment === 'POSITIF'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cmt.sentiment === 'NEGATIF'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {cmt.sentiment}
                        </span>
                        {cmt.is_sarcasm && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            Sarkas
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Toksisitas: <strong>{(cmt.toxicity_score * 100).toFixed(0)}%</strong> (Sev: {cmt.severity}/10)
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {cmt.is_hidden ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                        <EyeOff className="w-3 h-3" />
                        Tertahan (Hidden)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
