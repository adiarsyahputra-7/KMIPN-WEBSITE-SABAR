import React from 'react';
import { 
  MessageSquare, 
  Smile, 
  Frown, 
  ShieldAlert, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Komentar Masuk",
      value: stats.total,
      subtext: "Hari ini",
      trend: "+14.2%",
      icon: MessageSquare,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Sentimen Positif",
      value: `${stats.positivePercent}%`,
      subtext: `${stats.positiveCount} komentar`,
      trend: "Mendukung",
      icon: Smile,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Negatif & Sarkasme",
      value: `${stats.negativePercent}%`,
      subtext: `${stats.negativeCount} terindikasi`,
      trend: "Perlu ditinjau",
      icon: Frown,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Dicegat Otomatis",
      value: stats.toxicCount,
      subtext: `${stats.toxicPercent}% tertahan`,
      trend: "Proteksi aktif",
      icon: ShieldAlert,
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                {card.value}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {card.trend}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
              <span>{card.subtext}</span>
              <span className="text-[10px] text-slate-400">Sinkronisasi Realtime</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
