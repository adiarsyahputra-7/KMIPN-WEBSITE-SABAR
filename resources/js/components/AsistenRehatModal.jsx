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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D2738]/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#16587B]/15 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#16587B]/10 bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#16587B] font-['Plus_Jakarta_Sans']">
                Asisten Rehat Digital
              </h3>
              <p className="text-[11px] text-[#4F7085]">
                Sistem Proteksi Kesejahteraan Psikologis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#4F7085] hover:text-[#0D2738] hover:bg-[#16587B]/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Notification Alert */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-1 text-center">
            <p className="text-xs font-extrabold">
              Indikator Beban Kerja Terkini: {Math.round(stressLevel)}%
            </p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Luangkan waktu sejenak untuk menstabilkan fokus mental sebelum melanjutkan pekerjaan moderasi.
            </p>
          </div>

          {/* Interactive Breathing */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/15 space-y-4">
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-28 h-28 rounded-full flex items-center justify-center text-center transition-all duration-1000 shadow-sm ${
                  timerRunning 
                    ? breathState === "Tarik Napas" 
                      ? 'scale-110 bg-emerald-100 border-2 border-emerald-500 shadow-md'
                      : breathState === "Tahan Napas"
                      ? 'scale-110 bg-teal-100 border-2 border-teal-500'
                      : 'scale-90 bg-slate-200 border-2 border-slate-400'
                    : 'bg-white border-2 border-[#16587B]/20'
                }`}
              >
                <div className="space-y-1">
                  <Wind className="w-5 h-5 text-emerald-600 mx-auto animate-pulse" />
                  <p className="text-[11px] font-bold text-[#0D2738]">
                    {timerRunning ? breathState : "Siap Mulai"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              <span className="text-2xl font-extrabold text-[#0D2738] font-mono tracking-wider">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <p className="text-[10px] font-semibold text-[#4F7085]">
                Sesi Relaksasi 2 Menit
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-5 py-2 rounded-full bg-[#16587B] hover:bg-[#104460] text-[#F5EEDD] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#16587B]/20 cursor-pointer"
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
                className="p-2 rounded-full bg-white border border-[#16587B]/20 text-[#4F7085] hover:text-[#0D2738] hover:bg-[#F5EEDD] transition-all cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Autonomous Shield Notice */}
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/12 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#4F7085] leading-relaxed">
              <strong className="text-[#0D2738]">Perisai Otonom Aktif:</strong> Sistem SABAR terus mencegat ujaran negatif secara otomatis saat Anda beristirahat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#16587B]/10 flex items-center justify-between text-xs">
          <span className="text-[11px] font-medium text-[#4F7085]">
            Rujukan Tele-Psychology
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-[#16587B]/20 text-[#16587B] hover:bg-[#F5EEDD] font-bold text-xs transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
