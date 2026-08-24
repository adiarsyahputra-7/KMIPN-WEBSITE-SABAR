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

export default function LiveCommentAnalyzer({ onAddComment }) {
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

  // ─── APPLY KE FEED: simpan ke database lalu tampilkan ─────────────────────
  const handleApplyToFeed = async () => {
    if (!inputText.trim() || !analysisResult) return;

    setSaving(true);
    try {
      const { data } = await api.post('/comments', {
        author: '@user_uji_demo',
        text: inputText,
        sentiment: analysisResult.sentiment,
        toxicity_score: analysisResult.toxicity_score,
        severity: analysisResult.severity,
        is_sarcasm: analysisResult.is_sarcasm,
        action: analysisResult.action,
        reason: analysisResult.reason,
        is_hidden: analysisResult.is_hidden,
      });

      // Gunakan data dari server (berisi ID database yang nyata)
      onAddComment(data.comment || data);
    } catch (err) {
      console.error('Failed to save comment:', err);
      // Fallback: tambahkan ke tampilan tanpa menyimpan ke DB
      onAddComment({
        id: `local-${Date.now()}`,
        author: '@user_uji_demo',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        platform: 'Demo',
        post_title: 'Simulasi Uji Moderasi',
        text: inputText,
        ...analysisResult,
        timestamp: 'Baru saja',
      });
    } finally {
      setInputText('');
      setAnalysisResult(null);
      setSaving(false);
    }
  };

  const sentimentColor = {
    POSITIF: 'bg-emerald-100 text-emerald-800',
    NEGATIF: 'bg-rose-100 text-rose-800',
    NETRAL: 'bg-slate-200 text-slate-700',
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4 h-full">

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Uji Coba Deteksi NLP Kontekstual
          </h3>
          <p className="text-[11px] text-slate-500">
            Analisis sentimen, sarkasme, dan skor toksisitas secara seketika
          </p>
        </div>
        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3 text-teal-600 animate-pulse" />
          Google Gemini 3.6 Flash (AI Aktif)
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
              if (analysisResult) setAnalysisResult(null);
            }}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
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
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none"
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            * Menganalisis kata slang, leet speak (angka/simbol), dan pola sarkasme secara kontekstual.
          </p>
          <button
            type="submit"
            disabled={!inputText.trim() || analyzing}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
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
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Hasil Analisis Gemini AI:</span>
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
              <p className="font-bold text-slate-800 mt-0.5">{analysisResult.is_sarcasm ? 'Terdeteksi ✓' : 'Tidak'}</p>
            </div>
          </div>

          {/* AI Reason Card */}
          {analysisResult.reason && (
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-start gap-2">
              <span className="text-xs">🤖</span>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-slate-700">Penjelasan AI: </span>
                <span className="text-slate-600">{analysisResult.reason}</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleApplyToFeed}
              disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {saving
                ? <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                : <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
              }
              {saving ? 'Menyimpan ke Database...' : 'Masukkan ke Log Komentar Live'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

