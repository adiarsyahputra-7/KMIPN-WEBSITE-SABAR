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

export default function StatsCards({ stats, isDarkMode }) {
  const getIconBg = (colorName) => {
    if (!isDarkMode) {
      if (colorName === 'blue') return 'bg-blue-50 text-blue-600 border-blue-100';
      if (colorName === 'emerald') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      if (colorName === 'amber') return 'bg-amber-50 text-amber-600 border-amber-100';
      if (colorName === 'rose') return 'bg-rose-50 text-rose-600 border-rose-100';
    } else {
      if (colorName === 'blue') return 'bg-blue-950/30 text-blue-400 border-blue-900/40';
      if (colorName === 'emerald') return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40';
      if (colorName === 'amber') return 'bg-amber-950/30 text-amber-400 border-amber-900/40';
      if (colorName === 'rose') return 'bg-rose-950/30 text-rose-400 border-rose-900/40';
    }
    return '';
  };

  const cards = [
    {
      title: "Total Komentar Masuk",
      value: stats.total,
      subtext: "Hari ini",
      trend: "+14.2%",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Sentimen Positif",
      value: `${stats.positivePercent}%`,
      subtext: `${stats.positiveCount} komentar`,
      trend: "Mendukung",
      icon: Smile,
      color: "emerald",
    },
    {
      title: "Negatif & Sarkasme",
      value: `${stats.negativePercent}%`,
      subtext: `${stats.negativeCount} terindikasi`,
      trend: "Perlu ditinjau",
      icon: Frown,
      color: "amber",
    },
    {
      title: "Dicegat Otomatis",
      value: stats.toxicCount,
      subtext: `${stats.toxicPercent}% tertahan`,
      trend: "Proteksi aktif",
      icon: ShieldAlert,
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
              isDarkMode 
                ? 'bg-[#0B1522] border-[#16587B]/20 shadow-md' 
                : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-slate-500'}`}>
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${getIconBg(card.color)}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold tracking-tight font-['Plus_Jakarta_Sans'] ${
                isDarkMode ? 'text-[#F5EEDD]' : 'text-slate-900'
              }`}>
                {card.value}
              </span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isDarkMode ? 'bg-[#16587B]/25 text-[#84B3CE]' : 'bg-slate-100 text-slate-600'
              }`}>
                {card.trend}
              </span>
            </div>

            <div className={`text-[11px] border-t pt-2 flex items-center justify-between ${
              isDarkMode ? 'text-[#84B3CE]/50 border-[#16587B]/15' : 'text-slate-400 border-slate-100'
            }`}>
              <span>{card.subtext}</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-[#84B3CE]/40' : 'text-slate-400'}`}>Sinkronisasi Realtime</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
