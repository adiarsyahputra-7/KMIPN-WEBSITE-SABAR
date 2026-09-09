import React from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, Flame, Info, ArrowRight } from 'lucide-react';

export default function StressGauge({ stressLevel, avgSeverity, toxicCount, totalComments, onTriggerRehat, isDarkMode }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stressLevel / 100) * circumference;

  let statusConfig = {
    title: "Kondisi Kerja Sehat",
    desc: "Beban paparan komentar negatif sangat minim. Tingkat stres dalam batas normal.",
    badge: "Zona Aman",
    badgeClass: isDarkMode 
      ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30" 
      : "bg-emerald-50 text-emerald-800 border-emerald-200",
    strokeColor: "#10B981",
    textColor: isDarkMode ? "text-emerald-400" : "text-emerald-700",
    icon: CheckCircle2,
  };

  if (stressLevel >= 65) {
    statusConfig = {
      title: "Beban Mental Kritis",
      desc: "Volume komentar kasar melampaui batas aman. Asisten merekomendasikan jeda rehat.",
      badge: "Perlu Rehat",
      badgeClass: isDarkMode 
        ? "bg-rose-950/40 text-rose-300 border-rose-500/30" 
        : "bg-rose-50 text-rose-700 border-rose-200",
      strokeColor: "#E11D48",
      textColor: isDarkMode ? "text-rose-400" : "text-rose-700",
      icon: Flame,
    };
  } else if (stressLevel >= 30) {
    statusConfig = {
      title: "Beban Sedang (Waspada)",
      desc: "Terjadi peningkatan komentar bernada sindiran dan sarkasme.",
      badge: "Waspada",
      badgeClass: isDarkMode 
        ? "bg-amber-950/40 text-amber-300 border-amber-500/30" 
        : "bg-amber-50 text-amber-700 border-amber-200",
      strokeColor: "#F59E0B",
      textColor: isDarkMode ? "text-amber-400" : "text-amber-700",
      icon: AlertTriangle,
    };
  }

  const StatusIcon = statusConfig.icon;

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
            Stress-Load Index™
          </h3>
          <p className={`text-[11px] font-medium ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>
            Kalkulator Beban Psikologis Pengelola Akun
          </p>
        </div>
        <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${statusConfig.badgeClass}`}>
          {statusConfig.badge}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
        {/* SVG Circle Meter */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={isDarkMode ? "#0F2E45" : "#FAF7F2"}
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={statusConfig.strokeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute text-center">
            <span className={`text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#0D2738]'
            }`}>
              {Math.round(stressLevel)}%
            </span>
            <p className={`text-[9px] font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'
            }`}>
              Beban Stres
            </p>
          </div>
        </div>

        {/* Narrative & Metrics */}
        <div className="flex-1 space-y-3 text-center sm:text-left w-full">
          <div>
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs ${statusConfig.textColor}`}>
              <StatusIcon className="w-4 h-4" />
              <span>{statusConfig.title}</span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-[#84B3CE]/80' : 'text-[#4F7085]'}`}>
              {statusConfig.desc}
            </p>
          </div>

          {/* Minimal Key-Value Details */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px]">
            <div className={`p-2.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#081724]/60 border-[#16587B]/20' : 'bg-[#FAF7F2] border-[#16587B]/12'
            }`}>
              <p className={isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'}>Rata-rata Severity</p>
              <p className={`font-extrabold mt-0.5 text-sm ${isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'}`}>
                {avgSeverity.toFixed(1)} <span className="text-[10px] font-normal text-[#84B3CE]">/ 10</span>
              </p>
            </div>
            <div className={`p-2.5 rounded-2xl border ${
              isDarkMode ? 'bg-[#081724]/60 border-[#16587B]/20' : 'bg-[#FAF7F2] border-[#16587B]/12'
            }`}>
              <p className={isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'}>Komentar Tertahan</p>
              <p className={`font-extrabold mt-0.5 text-sm ${isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'}`}>
                {toxicCount} <span className="text-[10px] font-normal text-[#84B3CE]">dari {totalComments}</span>
              </p>
            </div>
          </div>

          {stressLevel >= 65 && (
            <button
              onClick={onTriggerRehat}
              className="w-full py-2 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              Buka Sesi Rehat Terpandu
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
