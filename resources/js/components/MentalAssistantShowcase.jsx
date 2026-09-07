import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Smile,
  Coffee,
  ShieldCheck,
  Quote,
} from 'lucide-react';

const AFFIRMATIONS = [
  'Karya Anda berharga dan telah menginspirasi banyak orang. Jangan biarkan komentar negatif menghapus kebaikan yang Anda bagikan.',
  'Fokuslah pada 95% audiens yang mendukung dan mencintai karya Anda, bukan pada segelintir komentar yang berniat menjatuhkan.',
  'Istirahat bukanlah tanda menyerah. Mengambil jeda sejenak adalah bagian penting dari proses kreativitas yang sehat.',
  'Anda berhak memiliki ruang berkarya yang damai dan menenangkan. AI SABAR siap menjaga ruang tersebut untuk Anda.',
];

export default function MentalAssistantShowcase({ onLoginClick }) {
  // ── State Box Breathing ──
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Tarik Napas'); // 'Tarik Napas' | 'Tahan' | 'Hembuskan'
  const [countdown, setCountdown] = useState(4);
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Timer loop untuk Box Breathing 4-4-4
  useEffect(() => {
    let timer;
    if (breathingActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Ganti fase saat countdown habis (4 detik per fase)
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Tarik Napas') return 'Tahan Napas';
              if (currentPhase === 'Tahan Napas') return 'Hembuskan';
              return 'Tarik Napas';
            });
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathPhase('Tarik Napas');
      setCountdown(4);
    }

    return () => clearInterval(timer);
  }, [breathingActive]);

  const handleNextAffirmation = () => {
    setAffirmationIdx((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  return (
    <section id="asisten-rehat" className="relative py-20 md:py-28 bg-[#F4EFE6]/60 border-y border-[#16587B]/10">
      <div className="mx-auto max-w-7xl px-6 relative">
        {/* ── Section Heading ── */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3 border border-[#16587B]/15 bg-white shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#16587B]">
              Asisten Rehat &amp; Pemulihan Mental
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-['Plus_Jakarta_Sans'] text-[#16587B]">
            Lindungi Kesehatan Mental dari Kelelahan Digital
          </h2>

          <p className="text-base text-[#4F7085] font-medium leading-relaxed">
            SABAR tidak hanya memfilter ujaran kebencian secara teknis, tetapi juga secara aktif mendampingi
            kondisi psikologis kreator melalui indeks beban mental dan panduan relaksasi mandiri.
          </p>
        </div>

        {/* ── 2 Kolom Showcase: Indeks Kesehatan Mental & Latihan Box Breathing ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Kolom Kiri: Indeks Beban Mental & Afirmasi Kreator (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-3xl border border-[#16587B]/15 bg-white p-7 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#16587B]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base font-['Plus_Jakarta_Sans'] text-[#16587B]">
                      Indeks Rehat Mental Hari Ini
                    </h3>
                    <p className="text-xs font-medium text-slate-400">Analisis Beban Interaksi Medsos</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Kondisi Tenang
                </span>
              </div>

              {/* Score Indicator */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/10 mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Skor Ketenangan
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#16587B] font-['Plus_Jakarta_Sans']">
                      88
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-[#16587B] rounded-full w-[88%]" />
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-emerald-700">✓ 92% Interaksi Positif &amp; Apresiasi</span>
                  <span className="text-slate-400">8% Toksik Diredam AI</span>
                </div>
              </div>

              {/* Rekomendasi Rehat AI */}
              <div className="p-4 rounded-2xl bg-white border border-[#16587B]/10 shadow-2xs space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#16587B]">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>Rekomendasi Asisten Rehat:</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "Interaksi hari ini sangat sehat. Anda aman untuk terus berkarya. Namun jangan lupa mengambil jeda 10 menit setiap 2 jam untuk menjaga energi kreativitas."
                </p>
              </div>

              {/* Daily Creator Affirmation */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/10 relative">
                <Quote className="w-4 h-4 text-[#16587B] opacity-50 mb-1" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed italic mb-3">
                  "{AFFIRMATIONS[affirmationIdx]}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Afirmasi Kreator #{affirmationIdx + 1}
                  </span>
                  <button
                    onClick={handleNextAffirmation}
                    className="text-xs font-bold text-[#16587B] hover:underline cursor-pointer"
                  >
                    Ganti Afirmasi →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Interactive Box Breathing Exercise (lg:col-span-6) */}
          <div className="lg:col-span-6 rounded-3xl border border-[#16587B]/15 bg-white p-7 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header Box Breathing */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#16587B]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#16587B]/10 text-[#16587B] flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-5 h-5 text-[#16587B]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base font-['Plus_Jakarta_Sans'] text-[#16587B]">
                      Latihan Pernapasan (Box Breathing)
                    </h3>
                    <p className="text-xs font-medium text-slate-400">Redakan Ketegangan &amp; Stres Medsos</p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#16587B] border border-[#16587B]/15">
                  Metode 4-4-4
                </span>
              </div>

              {/* Interactive Breathing Visualizer */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Outer Pulsing Ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 border-[#16587B]/20 transition-transform duration-1000 ${
                      breathingActive && breathPhase === 'Tarik Napas'
                        ? 'scale-110 bg-[#16587B]/5'
                        : breathingActive && breathPhase === 'Hembuskan'
                        ? 'scale-90 bg-transparent'
                        : 'scale-100 bg-[#FAF7F2]'
                    }`}
                  />

                  {/* Inner Breathing Core */}
                  <div
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-center shadow-md transition-all duration-1000 ${
                      breathingActive
                        ? breathPhase === 'Tarik Napas'
                          ? 'bg-[#16587B] text-[#F5EEDD] scale-105'
                          : breathPhase === 'Tahan Napas'
                          ? 'bg-[#2A6E94] text-[#F5EEDD]'
                          : 'bg-[#84B3CE] text-white scale-95'
                        : 'bg-[#16587B] text-[#F5EEDD]'
                    }`}
                  >
                    <span className="text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
                      {breathingActive ? countdown : '4s'}
                    </span>
                    <span className="text-[11px] font-bold mt-0.5 px-2">
                      {breathingActive ? breathPhase : 'Siap Mulai'}
                    </span>
                  </div>
                </div>

                {/* Instruction Subtext */}
                <p className="text-xs text-slate-500 font-medium text-center mt-4 max-w-xs">
                  {breathingActive
                    ? breathPhase === 'Tarik Napas'
                      ? 'Tarik napas perlahan melalui hidung...'
                      : breathPhase === 'Tahan Napas'
                      ? 'Tahan napas sejenak, rasakan ketenangan tubuh...'
                      : 'Hembuskan napas perlahan melalui mulut...'
                    : 'Klik tombol di bawah untuk memulai panduan pernapasan 1 menit guna menurunkan denyut jantung dan kecemasan.'}
                </p>
              </div>
            </div>

            {/* Breathing Controls */}
            <div className="pt-4 border-t border-[#16587B]/10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setBreathingActive(!breathingActive)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer bg-[#16587B] text-[#F5EEDD] hover:bg-[#0e3f59]"
              >
                {breathingActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda Latihan</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Mulai Box Breathing</span>
                  </>
                )}
              </button>

              {breathingActive && (
                <button
                  type="button"
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathPhase('Tarik Napas');
                    setCountdown(4);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors p-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
