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
      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' 
      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    NEGATIF: isDarkMode 
      ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40' 
      : 'bg-rose-50 text-rose-800 border border-rose-200/80',
    NETRAL: isDarkMode 
      ? 'bg-[#16587B]/20 text-[#84B3CE] border border-[#16587B]/30' 
      : 'bg-[#FAF7F2] text-[#4F7085] border border-[#16587B]/15',
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 h-full ${
      isDarkMode 
        ? 'bg-[#0B1E2E] border-[#16587B]/25 shadow-md' 
        : 'bg-white border-[#16587B]/15 shadow-xs'
    }`}>

      {/* Header */}
      <div className={`flex items-center justify-between pb-3 border-b ${
        isDarkMode ? 'border-[#16587B]/20' : 'border-[#16587B]/10'
      }`}>
        <div>
          <h3 className={`text-sm font-extrabold font-['Plus_Jakarta_Sans'] ${
            isDarkMode ? 'text-[#F5EEDD]' : 'text-[#16587B]'
          }`}>
            Uji Coba Deteksi NLP Kontekstual
          </h3>
          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>
            Analisis sentimen, sarkasme, dan skor toksisitas secara seketika
          </p>
        </div>
        <span className={`text-[10px] font-bold border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs ${
          isDarkMode 
            ? 'text-[#F5EEDD] bg-[#16587B]/30 border-[#16587B]/40' 
            : 'text-[#16587B] bg-[#16587B]/10 border-[#16587B]/20'
        }`}>
          <Sparkles className="w-3 h-3 text-[#16587B] dark:text-[#84B3CE] animate-pulse" />
          Google Gemini (AI Aktif)
        </span>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[11px] font-bold ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>Sampel Teks:</span>
        {samplePresetComments.map((preset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInputText(preset.text);
              if (analysisResult) setAnalysisResult(null);
            }}
            className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all border cursor-pointer ${
              isDarkMode 
                ? 'bg-[#081724] border-[#16587B]/30 text-[#84B3CE] hover:bg-[#16587B]/30 hover:text-[#F5EEDD]' 
                : 'bg-[#FAF7F2] border-[#16587B]/15 text-[#16587B] hover:bg-[#F5EEDD] hover:border-[#16587B]/30'
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
          className={`w-full px-4 py-3 rounded-2xl text-xs transition-all resize-none focus:outline-none focus:ring-2 focus:ring-[#16587B]/20 ${
            isDarkMode 
              ? 'bg-[#081724] border border-[#16587B]/30 text-white placeholder-[#84B3CE]/40 focus:border-[#16587B]' 
              : 'bg-[#FAF7F2]/60 border border-[#16587B]/20 text-[#0D2738] placeholder-[#4F7085]/60 focus:bg-white focus:border-[#16587B]'
          }`}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <p className={`text-[11px] ${isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'}`}>
            * Menganalisis kata slang, leet speak (angka/simbol), dan pola sarkasme secara kontekstual.
          </p>
          <button
            type="submit"
            disabled={!inputText.trim() || analyzing}
            className={`px-5 py-2 rounded-full text-xs font-bold disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
              isDarkMode 
                ? 'bg-[#16587B] text-[#F5EEDD] hover:bg-[#16587B]/80 border border-[#16587B]/40' 
                : 'bg-[#16587B] text-[#F5EEDD] hover:bg-[#104460] shadow-[#16587B]/20'
            }`}
          >
            {analyzing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#84B3CE]" />
              : <Send className="w-3.5 h-3.5" />
            }
            {analyzing ? 'Menganalisis...' : 'Analisis Teks'}
          </button>
        </div>
      </form>

      {/* Result Box */}
      {analysisResult && (
        <div className={`p-4 rounded-2xl border space-y-3 animate-fadeIn ${
          isDarkMode ? 'bg-[#081724] border-[#16587B]/25' : 'bg-[#FAF7F2] border-[#16587B]/15'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'}`}>Hasil Analisis Gemini AI:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${sentimentColor[analysisResult.sentiment] || 'bg-slate-200 text-slate-700'}`}>
                {analysisResult.sentiment}{analysisResult.is_sarcasm ? ' · Sarkasme' : ''}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs ${
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
            <div className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0B1E2E] border-[#16587B]/20' : 'bg-white border-[#16587B]/15'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>Toxicity Score</p>
              <p className={`font-extrabold text-sm mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>{(analysisResult.toxicity_score * 100).toFixed(0)}%</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0B1E2E] border-[#16587B]/20' : 'bg-white border-[#16587B]/15'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>Severity Scale</p>
              <p className="font-extrabold text-sm text-amber-600 mt-0.5">{analysisResult.severity} / 10</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0B1E2E] border-[#16587B]/20' : 'bg-white border-[#16587B]/15'
            }`}>
              <p className={`text-[10px] font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>Pola Sarkasme</p>
              <p className={`font-extrabold text-sm mt-0.5 ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>{analysisResult.is_sarcasm ? 'Terdeteksi ✓' : 'Tidak'}</p>
            </div>
          </div>

          {/* AI Reason Card */}
          {analysisResult.reason && (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isDarkMode ? 'bg-[#0B1E2E] border-[#16587B]/25' : 'bg-white border-[#16587B]/15'
            }`}>
              <span className="text-base shrink-0">🤖</span>
              <div className="text-[11px] leading-relaxed">
                <span className={`font-bold ${isDarkMode ? 'text-[#F5EEDD]' : 'text-[#16587B]'}`}>Penjelasan AI: </span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-[#4F7085]'}>{analysisResult.reason}</span>
              </div>
            </div>
          )}

          <div className={`pt-2 border-t flex justify-end ${isDarkMode ? 'border-[#16587B]/20' : 'border-[#16587B]/12'}`}>
            <button
              onClick={handleApplyToFeed}
              disabled={saving}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-60 border cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#16587B]/25 hover:bg-[#16587B]/40 border-[#16587B]/30 text-[#F5EEDD]' 
                  : 'bg-white hover:bg-[#F5EEDD] border-[#16587B]/25 text-[#16587B]'
              }`}
            >
              {saving
                ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#16587B]" />
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

