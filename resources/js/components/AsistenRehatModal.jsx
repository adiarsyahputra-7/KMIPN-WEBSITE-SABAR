import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coffee, 
  Wind, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw,
  Heart,
  PhoneCall
} from 'lucide-react';

export default function AsistenRehatModal({ isOpen, onClose, stressLevel }) {
  const [breathState, setBreathState] = useState("Tarik Napas");
  const [timerRunning, setTimerRunning] = useState(false);
  const [countdown, setCountdown] = useState(120);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Asisten Rehat Digital
              </h3>
              <p className="text-[11px] text-slate-500">
                Sistem Proteksi Kesejahteraan Psikologis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Notification Alert */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 space-y-1 text-center">
            <p className="text-xs font-bold">
              Indikator Beban Kerja Terkini: {Math.round(stressLevel)}%
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Luangkan waktu sejenak untuk menstabilkan fokus mental sebelum melanjutkan pekerjaan moderasi.
            </p>
          </div>

          {/* Interactive Breathing */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-28 h-28 rounded-full flex items-center justify-center text-center transition-all duration-1000 ${
                  timerRunning 
                    ? breathState === "Tarik Napas" 
                      ? 'scale-110 bg-emerald-100 border-2 border-emerald-400 shadow-lg'
                      : breathState === "Tahan Napas"
                      ? 'scale-110 bg-teal-100 border-2 border-teal-400'
                      : 'scale-90 bg-slate-200 border-2 border-slate-300'
                    : 'bg-white border-2 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <Wind className="w-5 h-5 text-emerald-600 mx-auto animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-800">
                    {timerRunning ? breathState : "Siap Mulai"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <span className="text-xl font-bold text-slate-900 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] text-slate-400">
                Sesi Relaksasi 2 Menit
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {timerRunning ? "Jeda" : "Mulai Pernapasan"}
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setCountdown(120);
                  setBreathState("Tarik Napas");
                }}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Autonomous Shield Notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Perisai Otonom Aktif:</strong> Sistem SABAR terus mencegat ujaran negatif secara otomatis saat Anda beristirahat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Rujukan Tele-Psychology
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
