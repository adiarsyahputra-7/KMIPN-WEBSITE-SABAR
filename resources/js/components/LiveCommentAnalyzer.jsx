import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  EyeOff,
  Eye
} from 'lucide-react';
import { samplePresetComments } from '../data/mockData';

export default function LiveCommentAnalyzer({ onAddComment }) {
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Local Context-Aware NLP Engine Simulation (will hook up to backend API in Phase 4)
  const analyzeTextLocal = (text) => {
    const lower = text.toLowerCase();

    // Sarcasm triggers
    const sarcasmPatterns = ["keren tapi", "bagus banget sampai", "kayak siput", "hebat banget ya", "sampai rusak"];
    const isSarcasm = sarcasmPatterns.some(p => lower.includes(p));

    // Harsh/Toxic triggers
    const toxicPatterns = ["sampah", "bego", "jijik", "caper", "mati", "mundur aja", "gak guna", "gak pantes", "anjing", "bangsat", "tolol"];
    const hasToxic = toxicPatterns.some(p => lower.includes(p));

    // Positive triggers
    const positivePatterns = ["bagus", "terima kasih", "suka banget", "menginspirasi", "keren parah", "sukses terus", "ramah", "rapi", "mantap"];
    const hasPositive = positivePatterns.some(p => lower.includes(p));

    let sentiment = "NETRAL";
    let toxicity_score = 0.05;
    let severity = 1;
    let action = "ALLOW";

    if (hasToxic || isSarcasm) {
      sentiment = "NEGATIF";
      toxicity_score = isSarcasm ? 0.82 : 0.92;
      severity = isSarcasm ? 8 : 9;
      action = "HIDE";
    } else if (hasPositive) {
      sentiment = "POSITIF";
      toxicity_score = 0.02;
      severity = 1;
      action = "ALLOW";
    } else {
      sentiment = "NETRAL";
      toxicity_score = 0.12;
      severity = 1;
      action = "ALLOW";
    }

    return {
      sentiment,
      toxicity_score,
      severity,
      is_sarcasm: isSarcasm,
      action,
      is_hidden: action === "HIDE",
    };
  };

  const handleAnalyze = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      const result = analyzeTextLocal(inputText);
      setAnalysisResult(result);
      setAnalyzing(false);
    }, 350);
  };

  const handleApplyToFeed = () => {
    if (!inputText.trim() || !analysisResult) return;

    const newComment = {
      id: `cmt-${Date.now()}`,
      author: "@user_live_demo",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      platform: "Instagram",
      postTitle: "Simulasi Uji Moderasi Live",
      text: inputText,
      ...analysisResult,
      timestamp: "Baru saja",
    };

    onAddComment(newComment);
    setInputText("");
    setAnalysisResult(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111A2E] border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Live Context-Aware NLP Tester
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Uji Deteksi Sarkasme & Makian Lokal
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center mr-1">Contoh Cepat:</span>
        {samplePresetComments.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              setInputText(preset.text);
              setAnalysisResult(null);
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-left"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleAnalyze} className="space-y-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (analysisResult) setAnalysisResult(null);
            }}
            rows={2}
            placeholder="Ketik komentar dalam bahasa Indonesia (baku, slang, sarkasme, atau kritik wajar)..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            *Mendeteksi ambiguitas, singkatan slang, dan sindiran bermakna ganda.
          </p>
          <button
            type="submit"
            disabled={!inputText.trim() || analyzing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
          >
            {analyzing ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Analisis Teks AI
          </button>
        </div>
      </form>

      {/* Analysis Result Box */}
      {analysisResult && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Hasil Analisis NLP:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                analysisResult.sentiment === 'POSITIF'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : analysisResult.sentiment === 'NEGATIF'
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
              }`}>
                {analysisResult.sentiment} {analysisResult.is_sarcasm && "• Sarkasme"}
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                analysisResult.action === 'HIDE'
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {analysisResult.action === 'HIDE' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {analysisResult.action === 'HIDE' ? 'AUTO-HIDE' : 'ALLOWED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] text-slate-400">Toxicity Score</p>
              <p className="text-sm font-bold text-white">{(analysisResult.toxicity_score * 100).toFixed(0)}%</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] text-slate-400">Severity Index</p>
              <p className="text-sm font-bold text-amber-400">{analysisResult.severity} / 10</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] text-slate-400">Sarkasme Lokal</p>
              <p className="text-sm font-bold text-teal-400">{analysisResult.is_sarcasm ? "Terdeteksi ✓" : "Tidak"}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
              <p className="text-[10px] text-slate-400">Rekomendasi Aksi</p>
              <p className={`text-sm font-bold ${analysisResult.action === 'HIDE' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysisResult.action}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleApplyToFeed}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-teal-400" />
              Terapkan & Masukkan ke Feed Moderasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
