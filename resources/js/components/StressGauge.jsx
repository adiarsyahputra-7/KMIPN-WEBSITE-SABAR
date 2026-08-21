import React from 'react';
import { HeartPulse, AlertTriangle, CheckCircle, Flame, Info } from 'lucide-react';

export default function StressGauge({ stressLevel, avgSeverity, toxicCount, totalComments, onTriggerRehat }) {
  // SVG circular gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stressLevel / 100) * circumference;

  let statusConfig = {
    title: "Kondisi Mental Prima",
    desc: "Beban paparan komentar toksik sangat rendah. Anda dalam zona aman.",
    badge: "Zona Aman",
    badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    color: "#10B981",
    textColor: "text-emerald-400",
    bgRing: "text-emerald-950/40",
    icon: CheckCircle,
  };

  if (stressLevel >= 65) {
    statusConfig = {
      title: "Beban Mental Kritis!",
      desc: "Paparan intensitas toksik tinggi melampaui ambang batas. Disarankan jeda rehat.",
      badge: "Perlu Rehat Segera",
      badgeClass: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      color: "#F43F5E",
      textColor: "text-rose-400",
      bgRing: "text-rose-950/40",
      icon: Flame,
    };
  } else if (stressLevel >= 30) {
    statusConfig = {
      title: "Beban Sedang (Waspada)",
      desc: "Mulai terjadi peningkatan komentar bernada sindiran dan sarkasme.",
      badge: "Perhatian",
      badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      color: "#F59E0B",
      textColor: "text-amber-400",
      bgRing: "text-amber-950/40",
      icon: AlertTriangle,
    };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 rounded-2xl bg-[#111A2E] border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div 
        className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: statusConfig.color }}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-teal-400">
            <HeartPulse className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Stress-Load Index™ (Indikator Beban Kerja)
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
          {statusConfig.badge}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1E293B"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={statusConfig.color}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Value */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              {Math.round(stressLevel)}%
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Stress Index
            </span>
          </div>
        </div>

        {/* Narrative & Calculation Detail */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h4 className={`text-base font-semibold flex items-center justify-center sm:justify-start gap-1.5 ${statusConfig.textColor}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {statusConfig.desc}
            </p>
          </div>

          {/* Formula breakdown info */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Avg. Severity Keparahan:</span>
              <span className="font-semibold text-slate-200">{avgSeverity.toFixed(1)} / 10</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Komentar Toksik Tertahan:</span>
              <span className="font-semibold text-rose-400">{toxicCount} dari {totalComments}</span>
            </div>
          </div>

          {stressLevel >= 65 && (
            <button
              onClick={onTriggerRehat}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              Aktifkan Sesi Rehat Terpandu
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
