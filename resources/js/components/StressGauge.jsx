import React from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, Flame, Info, ArrowRight } from 'lucide-react';

export default function StressGauge({ stressLevel, avgSeverity, toxicCount, totalComments, onTriggerRehat }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stressLevel / 100) * circumference;

  let statusConfig = {
    title: "Kondisi Kerja Sehat",
    desc: "Beban paparan komentar negatif sangat minim. Tingkat stres dalam batas normal.",
    badge: "Zona Aman",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    strokeColor: "#10B981",
    textColor: "text-emerald-700",
    icon: CheckCircle2,
  };

  if (stressLevel >= 65) {
    statusConfig = {
      title: "Beban Mental Kritis",
      desc: "Volume komentar kasar melampaui batas aman. Asisten merekomendasikan jeda rehat.",
      badge: "Perlu Rehat",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      strokeColor: "#E11D48",
      textColor: "text-rose-700",
      icon: Flame,
    };
  } else if (stressLevel >= 30) {
    statusConfig = {
      title: "Beban Sedang (Waspada)",
      desc: "Terjadi peningkatan komentar bernada sindiran dan sarkasme.",
      badge: "Waspada",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      strokeColor: "#F59E0B",
      textColor: "text-amber-700",
      icon: AlertTriangle,
    };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Stress-Load Index™
          </h3>
          <p className="text-[11px] text-slate-500">
            Kalkulator Beban Psikologis Pengelola Akun
          </p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
          {statusConfig.badge}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
        {/* SVG Circle Meter */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#F1F5F9"
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
            <span className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight">
              {Math.round(stressLevel)}%
            </span>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              Beban Stres
            </p>
          </div>
        </div>

        {/* Narrative & Metrics */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          <div>
            <div className={`flex items-center justify-center sm:justify-start gap-1.5 font-semibold text-xs ${statusConfig.textColor}`}>
              <StatusIcon className="w-4 h-4" />
              <span>{statusConfig.title}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {statusConfig.desc}
            </p>
          </div>

          {/* Minimal Key-Value Details */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-400">Rata-rata Severity</p>
              <p className="font-bold text-slate-800 mt-0.5">{avgSeverity.toFixed(1)} / 10</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-slate-400">Komentar Tertahan</p>
              <p className="font-bold text-slate-800 mt-0.5">{toxicCount} dari {totalComments}</p>
            </div>
          </div>

          {stressLevel >= 65 && (
            <button
              onClick={onTriggerRehat}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
