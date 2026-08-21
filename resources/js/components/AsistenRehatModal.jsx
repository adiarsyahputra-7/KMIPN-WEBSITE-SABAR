import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  PhoneCall, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function AsistenRehatModal({ isOpen, onClose, stressLevel }) {
  const [breathState, setBreathState] = useState("Tarik Napas"); // "Tarik Napas", "Tahan", "Hembuskan"
  const [timerRunning, setTimerRunning] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes

  useEffect(() => {
    let interval = null;
    if (timerRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, countdown]);

  // Breathing animation cycle
  useEffect(() => {
    if (!timerRunning) return;
    const cycleInterval = setInterval(() => {
      setBreathState(prev => {
        if (prev === "Tarik Napas") return "Tahan Napas";
        if (prev === "Tahan Napas") return "Hembuskan Perlahan";
        return "Tarik Napas";
      });
    }, 4000);
    return () => clearInterval(cycleInterval);
  }, [timerRunning]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#0E1626] border border-teal-500/30 shadow-2xl overflow-hidden relative">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Asisten Rehat Digital SABAR
              </h3>
              <p className="text-[11px] text-teal-300">
                Sistem Proteksi Kesejahteraan Psikologis Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Stress Warning Alert */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border border-teal-500/20 text-center space-y-1">
            <p className="text-xs font-semibold text-teal-300">
              Indikator Beban Kerja Terdeteksi: <span className="text-white font-bold">{Math.round(stressLevel)}%</span>
            </p>
            <p className="text-xs text-slate-400">
              Kesehatan mental Anda adalah prioritas. Luangkan waktu sejenak untuk menenangkan sistem saraf sebelum kembali memoderasi.
            </p>
          </div>

          {/* Interactive Guided Breathing */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="relative flex items-center justify-center">
              {/* Pulsing breathing bubble */}
              <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center text-center transition-all duration-1000 ${
                  timerRunning 
                    ? breathState === "Tarik Napas" 
                      ? 'scale-125 bg-teal-500/20 border-2 border-teal-400 shadow-xl shadow-teal-500/30'
                      : breathState === "Tahan Napas"
                      ? 'scale-125 bg-cyan-500/20 border-2 border-cyan-400'
                      : 'scale-95 bg-slate-800 border-2 border-slate-600'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <Wind className="w-6 h-6 text-teal-300 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-white tracking-wide">
                    {timerRunning ? breathState : "Mulai Sesi"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer Counter */}
            <div className="text-center">
              <span className="text-xl font-extrabold text-white font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] text-slate-500">
                Sesi Relaksasi 2 Menit
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-4 py-1.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-all flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {timerRunning ? "Jeda" : "Mulai Napas Terpandu"}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setCountdown(120);
                  setBreathState("Tarik Napas");
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Autonomous Shield Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-slate-200">Perisai AI Otonom Aktif</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Selama Anda rehat, AI SABAR akan tetap mencegat komentar toksik secara otomatis di latar belakang.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Kemitraan Tele-Psychology B2B
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Tutup & Lanjutkan Kerja
          </button>
        </div>

      </div>
    </div>
  );
}
