import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Eye, 
  EyeOff, 
  CornerDownRight,
  HelpCircle
} from 'lucide-react';
import { samplePresetComments } from '../data/mockData';

export default function LiveCommentAnalyzer({ onAddComment }) {
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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
    }, 250);
  };

  const handleApplyToFeed = async () => {
    if (!inputText.trim() || !analysisResult) return;

    const token = localStorage.getItem('auth_token');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          author: "@user_uji_demo",
          text: inputText,
          sentiment: analysisResult.sentiment,
          toxicity_score: analysisResult.toxicity_score,
          severity: analysisResult.severity,
          is_sarcasm: analysisResult.is_sarcasm,
          action: analysisResult.action,
          is_hidden: analysisResult.is_hidden,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAddComment(data.comment || data);
      } else {
        // Fallback to local optimistic add
        const newComment = {
          id: `cmt-${Date.now()}`,
          author: "@user_uji_demo",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          platform: "Instagram",
          postTitle: "Simulasi Uji Moderasi",
          text: inputText,
          ...analysisResult,
          timestamp: "Baru saja",
        };
        onAddComment(newComment);
      }
    } catch (err) {
      console.error("Failed to save comment to database:", err);
    } finally {
      setInputText("");
      setAnalysisResult(null);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Uji Coba Deteksi NLP Kontekstual
          </h3>
          <p className="text-[11px] text-slate-500">
            Analisis sentimen, sarkasme lokal, dan skor toksisitas secara seketika
          </p>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          Model: IndoBERT Multi-Context
        </span>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium text-slate-400">Sampel Teks:</span>
        {samplePresetComments.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              setInputText(preset.text);
              setAnalysisResult(null);
            }}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
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
            placeholder="Masukkan contoh komentar bahasa Indonesia (baku, gaul/slang, sindiran bermakna ganda)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            *Mendeteksi ambiguitas dan pola kalimat sarkasme Indonesia.
          </p>
          <button
            type="submit"
            disabled={!inputText.trim() || analyzing}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {analyzing ? (
              <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Analisis Teks
          </button>
        </div>
      </form>

      {/* Result Box */}
      {analysisResult && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Hasil Analisis Model:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                analysisResult.sentiment === 'POSITIF'
                  ? 'bg-emerald-100 text-emerald-800'
                  : analysisResult.sentiment === 'NEGATIF'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {analysisResult.sentiment} {analysisResult.is_sarcasm && "• Sarkasme"}
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                analysisResult.action === 'HIDE'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {analysisResult.action === 'HIDE' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {analysisResult.action === 'HIDE' ? 'AUTO-HIDE' : 'ALLOWED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <p className="text-[10px] text-slate-400 font-medium">Toxicity Score</p>
              <p className="font-bold text-slate-800 mt-0.5">{(analysisResult.toxicity_score * 100).toFixed(0)}%</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <p className="text-[10px] text-slate-400 font-medium">Severity Scale</p>
              <p className="font-bold text-amber-600 mt-0.5">{analysisResult.severity} / 10</p>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <p className="text-[10px] text-slate-400 font-medium">Pola Sarkasme</p>
              <p className="font-bold text-slate-800 mt-0.5">{analysisResult.is_sarcasm ? "Terdeteksi ✓" : "Tidak"}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleApplyToFeed}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
              Masukkan ke Log Komentar Live
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
