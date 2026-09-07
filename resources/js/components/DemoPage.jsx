import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Cpu,
  Quote,
  Flame,
  ChevronLeft,
  ArrowRight,
  Zap,
  Brain,
  Lock,
} from 'lucide-react';
import axios from 'axios';

// ─── KONSTANTA WARNA RESMI SABAR ──────────────────────────────────────────
const COLORS = {
  vBlue: '#16587B',         // Venice Blue
  rockBlue: '#2A6E94',      // Rock Blue Dark
  rockBlueLight: '#84B3CE', // Rock Blue Light
  merino: '#F5EEDD',        // Merino Warm Cream
  bg: '#FAF7F2',            // Warm background
  bgCard: '#FFFFFF',        // Crisp card
  border: 'rgba(22, 88, 123, 0.14)',
  textHeading: '#16587B',
  textDark: '#0D2738',
  textMuted: '#4F7085',
};

// ─── CONTOH PRESET KOMENTAR (KASUS NYATA MEDSOS INDONESIA) ─────────────────
const PRESET_COMMENTS = [
  {
    id: 'positif',
    label: 'Pujian Edukatif',
    badge: 'Positif',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'Kontennya daging banget kak! Penjelasannya runtut dan gampang dipahami, terima kasih banyak ya!',
  },
  {
    id: 'sarkasme',
    label: 'Sarkasme Halus',
    badge: 'Sarkasme',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'Hebat banget ya bang karyanya, saking hebatnya sampe bingung faedahnya di mana wkwk.',
  },
  {
    id: 'slang',
    label: 'Slang / Gaul',
    badge: 'Uji False-Positive',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    text: 'Mabok UTBK nih wkwk gila soal penalaran matematika bikin pengen nangis di pojokan.',
  },
  {
    id: 'toxic',
    label: 'Cyberbullying',
    badge: 'Toksik Akut',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    text: 'Muka pas-pasan aja sok caper di kamera, mending hapus akun lu dasar sampah gak guna!',
  },
  {
    id: 'obfuscated',
    label: 'Kata Tersamar',
    badge: 'Leet-Speak',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    text: 'Dasar b3g0 t0l0l lu gak punya otak bikin malu keluarga aja!',
  },
];

export default function DemoPage({ onLoginClick, onBackClick }) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activePreset, setActivePreset] = useState(null);

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setInputText(preset.text);
    setError(null);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
    setActivePreset(null);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    const textToAnalyze = inputText.trim();
    if (!textToAnalyze) {
      setError('Silakan ketik komentar atau pilih salah satu contoh preset.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/public/analyze-demo', {
        text: textToAnalyze,
      });

      setResult(response.data);
    } catch (err) {
      console.error('Demo analyze error:', err);
      if (err.response?.status === 429) {
        setError('Batas kuota uji coba demo tercapai. Silakan tunggu 1 menit sebelum mencoba lagi.');
      } else {
        setError(err.response?.data?.message || 'Gagal menganalisis komentar. Periksa koneksi jaringan Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getToxicityLevel = (score) => {
    if (score <= 30) {
      return {
        label: 'Aman (Rendah)',
        color: 'text-emerald-700',
        barColor: 'from-emerald-400 to-teal-500',
      };
    }
    if (score <= 70) {
      return {
        label: 'Waspada (Sedang)',
        color: 'text-amber-700',
        barColor: 'from-amber-400 to-orange-500',
      };
    }
    return {
      label: 'Toksik / Berbahaya (Tinggi)',
      color: 'text-rose-700',
      barColor: 'from-rose-500 to-red-600',
    };
  };

  return (
    <div
      className="min-h-screen font-sans text-slate-800 relative overflow-x-hidden"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* ── Fixed Navbar / Top Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
        <nav className="mx-auto mt-3 max-w-5xl rounded-full border border-[#16587B]/20 bg-white/95 backdrop-blur-xl shadow-lg shadow-[#16587B]/10 px-6 py-2.5 flex items-center justify-between">
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-sm font-bold text-[#16587B] hover:text-[#0e3f59] transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-xs sm:text-sm font-bold text-[#16587B] hover:text-[#0e3f59] px-3 py-1.5 rounded-full hover:bg-[#F5EEDD]/80 transition-colors cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#16587B] text-[#F5EEDD] hover:bg-[#0e3f59] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-md shadow-[#16587B]/20 transition-all cursor-pointer"
            >
              <span>Daftar Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Ambient Soft Glow Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(132,179,206,0.3) 0%, rgba(245,238,221,0.5) 50%, transparent 80%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute top-1/3 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(132,179,206,0.4) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute bottom-10 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(22,88,123,0.25) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* ── Main Content Container ── */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-20">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border bg-white shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.vBlue }}>
                Live Simulator Interaktif · Tanpa Login
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-['Plus_Jakarta_Sans']"
              style={{ color: COLORS.textHeading }}
            >
              Uji Coba Langsung Deteksi Gemini AI
            </h1>

            <p className="text-sm sm:text-base leading-relaxed font-medium" style={{ color: COLORS.textMuted }}>
              Ketik komentar apa saja atau pilih contoh preset di bawah untuk membuktikan kehebatan model{' '}
              <span className="font-bold text-[#16587B]">Gemini 3.6 Flash</span> SABAR dalam menganalisis sentimen,
              mendeteksi sarkasme, dan menentukan aksi penapisan secara langsung.
            </p>
          </motion.div>
        </div>

        {/* ── Interactive Playground Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Kolom Kiri: Textarea & Preset Selector (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl border bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-[#16587B]/5 relative"
            style={{ borderColor: COLORS.border }}
          >
            {/* Top Toolbar / Engine Specs */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#16587B]/10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs"
                  style={{ backgroundColor: `${COLORS.rockBlueLight}25`, border: `1px solid ${COLORS.vBlue}20` }}
                >
                  <Cpu className="w-4 h-4" style={{ color: COLORS.vBlue }} />
                </div>
                <div>
                  <div className="text-xs font-extrabold font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                    Gemini 3.6 Flash Engine
                  </div>
                  <div className="text-[11px] font-medium" style={{ color: COLORS.textMuted }}>
                    NLP Bahasa Indonesia · Realtime API
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pilih Contoh Komentar:
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Klik untuk uji cepat</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_COMMENTS.map((preset) => {
                  const isSelected = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#16587B] text-[#F5EEDD] border-[#16587B] shadow-sm scale-102'
                          : 'bg-[#FAF7F2] text-slate-700 border-[#16587B]/15 hover:bg-[#F2EDE4] hover:border-[#16587B]/30'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${
                          isSelected ? 'bg-white/20 text-white border-transparent' : preset.badgeColor
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea Input */}
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="relative">
                <textarea
                  rows={5}
                  maxLength={400}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Ketik komentar medsos di sini... (contoh: 'Keren banget kak karyanya!' atau coba kalimat sindiran sarkas)"
                  className="w-full rounded-2xl p-4 text-sm sm:text-base border transition-all duration-200 outline-none resize-none font-sans text-slate-800 bg-[#FAF7F2]/60 focus:bg-white focus:ring-4 focus:ring-[#16587B]/10 focus:border-[#16587B]"
                  style={{
                    borderColor: error ? '#E11D48' : 'rgba(22, 88, 123, 0.2)',
                  }}
                />

                <div className="absolute bottom-3 right-3 text-[11px] font-semibold text-slate-400 select-none">
                  {inputText.length} / 400
                </div>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading || (!inputText && !result)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#16587B] disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Input</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    backgroundColor: COLORS.vBlue,
                    color: COLORS.merino,
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Gemini Sedang Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                      <span>Analisis Komentar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Kolom Kanan: Result Card (lg:col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div
              className="rounded-3xl border bg-white/95 backdrop-blur-xl p-6 sm:p-7 shadow-xl shadow-[#16587B]/5 relative min-h-[440px] flex flex-col justify-between"
              style={{ borderColor: COLORS.border }}
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Top Verdict Banner */}
                    <div
                      className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                        result.action === 'ALLOW'
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/80 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                          result.action === 'ALLOW' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {result.action === 'ALLOW' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Shield className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-wider uppercase opacity-75">
                            Rekomendasi Aksi
                          </span>
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                              result.action === 'ALLOW'
                                ? 'bg-emerald-200/60 text-emerald-800'
                                : 'bg-rose-200/60 text-rose-800'
                            }`}
                          >
                            {result.action === 'ALLOW' ? 'Aman' : 'Tindakan Diambil'}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold font-['Plus_Jakarta_Sans'] mt-0.5">
                          {result.action === 'ALLOW'
                            ? 'ALLOW — Diizinkan Tampil'
                            : 'HIDE — Otomatis Diredam'}
                        </h4>
                        <p className="text-xs font-medium mt-1 opacity-80 leading-relaxed">
                          {result.action === 'ALLOW'
                            ? 'Komentar bernada sehat dan aman dikonsumsi publik tanpa mengganggu mental kreator.'
                            : 'Komentar terdeteksi berbahaya dan disembunyikan otomatis dari kolom komentar media sosial.'}
                        </p>
                      </div>
                    </div>

                    {/* Toxicity Gauge Bar */}
                    {(() => {
                      const toxInfo = getToxicityLevel(result.toxicity_score);
                      return (
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/10 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-slate-700">
                              <Flame className="w-4 h-4 text-amber-500" />
                              <span>Skor Toksisitas</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-extrabold">
                              <span className={toxInfo.color}>{result.toxicity_score}%</span>
                              <span className="text-[11px] font-semibold text-slate-400">
                                ({toxInfo.label})
                              </span>
                            </div>
                          </div>

                          <div className="h-2.5 w-full bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(4, result.toxicity_score))}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${toxInfo.barColor}`}
                            />
                          </div>
                        </div>
                      );
                    })()}

                    {/* 4-Grid Diagnostic Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Sentimen
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              result.sentiment === 'POSITIF'
                                ? 'bg-emerald-500'
                                : result.sentiment === 'NEGATIF'
                                ? 'bg-rose-500'
                                : 'bg-sky-500'
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                            {result.sentiment}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Gaya Sarkasme
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                            {result.is_sarcasm ? 'Terdeteksi' : 'Tidak Ada'}
                          </span>
                          {result.is_sarcasm && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                              Sindiran
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Tingkat Keparahan
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`h-2 flex-1 rounded-sm ${
                                lvl <= (result.severity || 1)
                                  ? result.severity > 3
                                    ? 'bg-rose-500'
                                    : 'bg-amber-400'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] font-bold ml-1 text-slate-600">
                            {result.severity || 1}/5
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Waktu Respon
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{result.latency_ms ? `${result.latency_ms} ms` : '<1.5s'}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Rationale Quote */}
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10 flex items-start gap-2.5">
                      <Quote className="w-4 h-4 text-[#16587B] flex-shrink-0 mt-0.5 rotate-180 opacity-60" />
                      <div>
                        <span className="text-[11px] font-bold text-[#16587B] block mb-0.5">
                          Alasan Pertimbangan Gemini:
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          "{result.reason || 'Dianalisis secara objektif menggunakan context-aware NLP Gemini.'}"
                        </p>
                      </div>
                    </div>

                    {/* Platform Moderation Simulation */}
                    <div className="pt-2 border-t border-[#16587B]/10 flex items-center justify-between text-[11px] font-medium text-slate-400">
                      <span>Simulasi Aksi Medsos:</span>
                      <span className="font-bold text-slate-600">
                        {result.action === 'ALLOW' ? 'Semua Platform Live' : 'Otomatis Disembunyikan'}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-14 px-4 h-full"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
                      style={{ backgroundColor: `${COLORS.rockBlueLight}20`, border: `1px solid ${COLORS.vBlue}15` }}
                    >
                      <Sparkles className="w-8 h-8" style={{ color: COLORS.vBlue }} />
                    </div>

                    <h4 className="text-base font-extrabold mb-1.5 font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                      Hasil Analisis Real-Time
                    </h4>

                    <p className="text-xs leading-relaxed max-w-xs font-medium" style={{ color: COLORS.textMuted }}>
                      Ketik kalimat Anda sendiri atau klik salah satu tombol preset di sebelah kiri, lalu tekan{' '}
                      <span className="font-bold text-[#16587B]">"Analisis Komentar"</span> untuk melihat audit kecerdasan buatan SABAR.
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 font-semibold bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#16587B]/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Didukung Google Gemini 3.6 Flash</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── 3 Pilar Keunggulan Deteksi SABAR ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: 'Deteksi Slang & Leet-speak',
              desc: 'Memahami bahasa pergaulan, singkatan, dan kata kasar yang disamarkan menggunakan angka atau karakter tersembunyi (seperti b3g0, t0l0l).',
            },
            {
              icon: Shield,
              title: 'Deteksi Sarkasme Kontekstual',
              desc: 'Mengenali sindiran halus bernada merendahkan yang terbungkus kata-kata sopan, yang umumnya lolos dari filter kata kunci biasa.',
            },
            {
              icon: Zap,
              title: 'Kecepatan Inferensi Real-Time',
              desc: 'Didukung arsitektur Gemini 3.6 Flash dengan latensi rata-rata <1.5 detik, memungkinkan moderasi instan begitu komentar masuk.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white border border-[#16587B]/10 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-2xs"
                style={{ backgroundColor: `${COLORS.rockBlueLight}25`, color: COLORS.vBlue }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: COLORS.textMuted }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA Box ── */}
        <div className="rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-r from-[#103A52] to-[#16587B] text-[#F5EEDD] shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Lindungi Akun Medsos Anda Hari Ini
            </h3>
            <p className="text-xs sm:text-sm text-[#84B3CE] font-medium leading-relaxed">
              Hubungkan akun Instagram, YouTube, atau TikTok Anda sekarang dan biarkan AI SABAR menjaga ketenangan ruang karya Anda secara otomatis.
            </p>
            <div className="pt-2">
              <button
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold bg-[#F5EEDD] text-[#16587B] hover:bg-white shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
              >
                <span>Mulai Sekarang — Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
