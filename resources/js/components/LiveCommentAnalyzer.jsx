import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Eye,
  EyeOff,
  CornerDownRight,
  Loader2,
} from 'lucide-react';
import { samplePresetComments } from '../data/mockData';
import api from '../api';

export default function LiveCommentAnalyzer({ onAddComment, isDarkMode }) {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // ─── ANALISIS TEKS VIA GEMINI AI (FASE 3) ──────────────────────────────────
  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || analyzing) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Panggil endpoint backend yang terhubung langsung dengan GeminiService
      const { data } = await api.post('/nlp/analyze', {
        text: inputText.trim(),
      });

      setAnalysisResult({
        sentiment: data.sentiment,
        toxicity_score: data.toxicity_score,
        severity: data.severity,
        is_sarcasm: data.is_sarcasm,
        action: data.action,
        reason: data.reason,
        is_hidden: data.action === 'HIDE',
      });
    } catch (err) {
      console.error('Failed to analyze with Gemini API:', err);
      // Fallback lokal jika ada gangguan koneksi
      const lower = inputText.toLowerCase();
      const isSarcasm = ['keren tapi', 'bagus banget sampai', 'kayak siput', 'hebat banget ya'].some(p => lower.includes(p));
      const hasToxic = ['sampah', 'bego', 'jijik', 'caper', 'mati', 'anjing', 'bangsat', 'babi', 'tolol', 'idiot', 'bodoh', 'goblok'].some(p => lower.includes(p));
      
      const sentiment = (hasToxic || isSarcasm) ? 'NEGATIF' : 'NETRAL';
      const action = (hasToxic || isSarcasm) ? 'HIDE' : 'ALLOW';
      
      setAnalysisResult({
        sentiment,
        toxicity_score: (hasToxic || isSarcasm) ? 0.92 : 0.12,
        severity: (hasToxic || isSarcasm) ? 8 : 2,
        is_sarcasm: isSarcasm,
        action,
        reason: 'Fallback lokal: Analisis darurat saat jaringan offline.',
        is_hidden: action === 'HIDE',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyToFeed = async () => {
    if (!analysisResult || saving) return;
    setSaving(true);

    try {
      // Tambah komentar baru ke feed/database
      const { data } = await api.post('/comments/simulated', {
        text: inputText.trim(),
        sentiment: analysisResult.sentiment,
        toxicity_score: analysisResult.toxicity_score,
        severity: analysisResult.severity,
        is_sarcasm: analysisResult.is_sarcasm,
        action: analysisResult.action,
        is_hidden: analysisResult.is_hidden,
        reason: analysisResult.reason,
      });

      // Beritahu parent dashboard untuk merender secara live
      onAddComment(data);

      // Reset form
      setInputText('');
      setAnalysisResult(null);
      setSaving(false);
    } catch (err) {
      console.error('Failed to save simulated comment:', err);
      // Fallback lokal
      const mockComment = {
        id: `mock-${Date.now()}`,
        text: inputText.trim(),
        sentiment: analysisResult.sentiment,
        toxicity_score: analysisResult.toxicity_score,
        severity: analysisResult.severity,
        is_sarcasm: analysisResult.is_sarcasm,
        action: analysisResult.action,
        is_hidden: analysisResult.is_hidden,
        reason: analysisResult.reason,
        created_at: new Date().toISOString(),
        username: 'pengguna_simulasi',
        platform: 'instagram',
      };
      onAddComment(mockComment);
      setInputText('');
      setAnalysisResult(null);
      setSaving(false);
    }
  };

  const sentimentColor = {
    POSITIF: isDarkMode 
      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
      : 'bg-emerald-100 text-emerald-800',
    NEGATIF: isDarkMode 
      ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' 
      : 'bg-rose-100 text-rose-800',
    NETRAL: isDarkMode 
      ? 'bg-slate-800 text-slate-300 border border-slate-700' 
      : 'bg-slate-200 text-slate-700',
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 space-y-4 h-full ${
      isDarkMode 
        ? 'bg-[#0B1522] border-[#16587B]/20 shadow-md' 
        : 'bg-white border-slate-200/80 shadow-sm'
    }`}>

      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? 'border-[#16587B]/15' : 'border-slate-100'
      }`}>
        <div>
          <h3 className={`text-sm font-bold font-['Plus_Jakarta_Sans'] ${isDarkMode ? 'text-[#F5EEDD]' : 'text-slate-900'}`}>
            Uji Coba Deteksi NLP Kontekstual
          </h3>
          <p className={`text-[11px] ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-500'}`}>
            Analisis sentimen, sarkasme, dan skor toksisitas secara seketika
          </p>
        </div>
        <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
          isDarkMode 
            ? 'text-teal-300 bg-teal-950/30 border-teal-500/20' 
            : 'text-teal-700 bg-teal-50 border border-teal-200/60'
        }`}>
          <Sparkles className="w-3 h-3 text-teal-600 animate-pulse" />
          Google Gemini (AI Aktif)
        </span>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[11px] font-medium ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-400'}`}>Sampel Teks:</span>
        {samplePresetComments.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              setInputText(preset.text);
              if (analysisResult) setAnalysisResult(null);
            }}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all border ${
              isDarkMode 
                ? 'bg-[#16587B]/15 border-[#16587B]/30 text-[#84B3CE] hover:bg-[#16587B]/30 hover:text-[#F5EEDD]' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleAnalyze} className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (analysisResult) setAnalysisResult(null);
          }}
          rows={2}
          placeholder="Masukkan contoh komentar Bahasa Indonesia (baku, gaul/slang, kata tersamar angka/bintang, sindiran)..."
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs transition-all resize-none focus:outline-none focus:ring-1 focus:ring-[#16587B] ${
            isDarkMode 
              ? 'bg-[#0A2233]/40 border border-[#16587B]/30 text-white placeholder-[#84B3CE]/40 focus:bg-[#071725] focus:border-[#16587B]' 
              : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400'
          }`}
        />
        <div className="flex items-center justify-between">
          <p className={`text-[11px] ${isDarkMode ? 'text-[#84B3CE]/50' : 'text-slate-400'}`}>
            * Menganalisis kata slang, leet speak (angka/simbol), dan pola sarkasme secara kontekstual.
          </p>
          <button
            type="submit"
            disabled={!inputText.trim() || analyzing}
            className={`px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm ${
              isDarkMode 
                ? 'bg-[#16587B] text-[#F5EEDD] hover:bg-[#16587B]/80 border border-[#16587B]/30' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {analyzing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
              : <Send className="w-3.5 h-3.5" />
            }
            {analyzing ? 'Menganalisis...' : 'Analisis Teks'}
          </button>
        </div>
      </form>

      {/* Result Box */}
      {analysisResult && (
        <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${
          isDarkMode ? 'bg-[#0A2233]/30 border-[#16587B]/20' : 'bg-slate-50 border border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F5EEDD]' : 'text-slate-700'}`}>Hasil Analisis Gemini AI:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${sentimentColor[analysisResult.sentiment] || 'bg-slate-200 text-slate-700'}`}>
                {analysisResult.sentiment}{analysisResult.is_sarcasm ? ' · Sarkasme' : ''}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                analysisResult.action === 'HIDE'
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {analysisResult.action === 'HIDE'
                  ? <EyeOff className="w-3 h-3" />
                  : <Eye className="w-3 h-3" />
              }
                {analysisResult.action === 'HIDE' ? 'AUTO-HIDE' : 'ALLOWED'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border ${
              isDarkMode ? 'bg-[#0B1522] border-[#16587B]/15' : 'bg-white border border-slate-200'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-400'}`}>Toxicity Score</p>
              <p className={`font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{(analysisResult.toxicity_score * 100).toFixed(0)}%</p>
            </div>
            <div className={`p-2 rounded-lg border ${
              isDarkMode ? 'bg-[#0B1522] border-[#16587B]/15' : 'bg-white border border-slate-200'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-400'}`}>Severity Scale</p>
              <p className="font-bold text-amber-500 mt-0.5">{analysisResult.severity} / 10</p>
            </div>
            <div className={`p-2 rounded-lg border ${
              isDarkMode ? 'bg-[#0B1522] border-[#16587B]/15' : 'bg-white border border-slate-200'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-400'}`}>Pola Sarkasme</p>
              <p className={`font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{analysisResult.is_sarcasm ? 'Terdeteksi ✓' : 'Tidak'}</p>
            </div>
          </div>

          {/* AI Reason Card */}
          {analysisResult.reason && (
            <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
              isDarkMode ? 'bg-[#0B1522] border-[#16587B]/20' : 'bg-white border border-slate-200/80'
            }`}>
              <span className="text-xs">🤖</span>
              <div className="text-[11px] leading-tight">
                <span className={`font-bold ${isDarkMode ? 'text-[#F5EEDD]' : 'text-slate-700'}`}>Penjelasan AI: </span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{analysisResult.reason}</span>
              </div>
            </div>
          )}

          <div className={`pt-2 border-t flex justify-end ${isDarkMode ? 'border-[#16587B]/15' : 'border-slate-200'}`}>
            <button
              onClick={handleApplyToFeed}
              disabled={saving}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-60 border ${
                isDarkMode 
                  ? 'bg-[#16587B]/20 hover:bg-[#16587B]/40 border-[#16587B]/30 text-[#F5EEDD]' 
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {saving
                ? <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                : <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
              }
              {saving ? 'Menyimpan...' : 'Masukkan ke Log Komentar Live'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

