import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertOctagon, 
  RefreshCw 
} from 'lucide-react';

export default function CommentTable({ comments, onToggleHide, onResetMock }) {
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter(c => {
    // Status filter
    if (filter === "HIDDEN" && !c.is_hidden) return false;
    if (filter === "ALLOWED" && c.is_hidden) return false;
    if (filter === "POSITIF" && c.sentiment !== "POSITIF") return false;
    if (filter === "NEGATIF" && c.sentiment !== "NEGATIF") return false;

    // Search filter
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
    <div className="p-6 rounded-2xl bg-[#111A2E] border border-slate-800 shadow-xl space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Log Moderasi Komentar Masuk (Real-Time)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Komentar toksik disaring secara instan sebelum terbaca oleh pengelola akun.
          </p>
        </div>

        {/* Action / Search / Reset */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata / akun..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={onResetMock}
            title="Muat ulang data sampel"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 pb-3">
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
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === tab.key
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="pb-3 px-3">Penulis & Platform</th>
              <th className="pb-3 px-3">Isi Komentar</th>
              <th className="pb-3 px-3">Sentimen & Severity</th>
              <th className="pb-3 px-3">Status Filter</th>
              <th className="pb-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Tidak ada komentar yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filteredComments.map((cmt) => (
                <tr 
                  key={cmt.id} 
                  className={`hover:bg-slate-900/40 transition-colors ${
                    cmt.is_hidden ? 'bg-rose-950/10' : ''
                  }`}
                >
                  {/* Author */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cmt.avatar}
                        alt={cmt.author}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200">{cmt.author}</span>
                          <span className="text-[10px] text-slate-500">({cmt.platform})</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{cmt.timestamp}</p>
                      </div>
                    </div>
                  </td>

                  {/* Text Content */}
                  <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                    <div className="space-y-1">
                      <p className={`text-slate-200 leading-relaxed ${
                        cmt.is_hidden ? 'text-slate-400 italic' : ''
                      }`}>
                        {cmt.text}
                      </p>
                      {cmt.postTitle && (
                        <p className="text-[10px] text-slate-500 truncate">
                          Posting: {cmt.postTitle}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Sentiment & Toxicity */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cmt.sentiment === 'POSITIF'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : cmt.sentiment === 'NEGATIF'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {cmt.sentiment}
                        </span>
                        {cmt.is_sarcasm && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            Sarkasme
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Toksisitas: <span className="font-semibold text-slate-200">{(cmt.toxicity_score * 100).toFixed(0)}%</span> (Skala: {cmt.severity}/10)
                      </p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {cmt.is_hidden ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <EyeOff className="w-3 h-3" />
                        HIDDEN (Otomatis)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Eye className="w-3 h-3" />
                        ALLOWED (Tayang)
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onToggleHide(cmt.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        cmt.is_hidden
                          ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800/80 hover:bg-rose-900/30 text-rose-300 border border-slate-700'
                      }`}
                    >
                      {cmt.is_hidden ? "Pulihkan (Show)" : "Sembunyikan"}
                    </button>
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
