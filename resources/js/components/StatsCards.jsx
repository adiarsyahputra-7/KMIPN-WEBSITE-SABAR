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
      if (colorName === 'blue') return 'bg-[#16587B]/10 text-[#16587B] border-[#16587B]/20';
      if (colorName === 'emerald') return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      if (colorName === 'amber') return 'bg-amber-50 text-amber-700 border-amber-200/80';
      if (colorName === 'rose') return 'bg-rose-50 text-rose-700 border-rose-200/80';
    } else {
      if (colorName === 'blue') return 'bg-[#16587B]/30 text-[#84B3CE] border-[#16587B]/40';
      if (colorName === 'emerald') return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
      if (colorName === 'amber') return 'bg-amber-950/40 text-amber-400 border-amber-800/40';
      if (colorName === 'rose') return 'bg-rose-950/40 text-rose-400 border-rose-800/40';
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
            className={`p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 space-y-3 hover:-translate-y-0.5 ${
              isDarkMode 
                ? 'bg-[#0B1E2E] border-[#16587B]/25 shadow-md hover:shadow-[#16587B]/15 hover:border-[#16587B]/40' 
                : 'bg-white border-[#16587B]/15 shadow-xs hover:shadow-md hover:shadow-[#16587B]/8 hover:border-[#16587B]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${isDarkMode ? 'text-[#84B3CE]/80' : 'text-[#4F7085]'}`}>
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${getIconBg(card.color)} shadow-2xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
                isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'
              }`}>
                {card.value}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isDarkMode 
                  ? 'bg-[#16587B]/25 text-[#84B3CE] border-[#16587B]/30' 
                  : 'bg-[#FAF7F2] text-[#16587B] border-[#16587B]/15'
              }`}>
                {card.trend}
              </span>
            </div>

            <div className={`text-[11px] border-t pt-2 flex items-center justify-between font-medium ${
              isDarkMode ? 'text-[#84B3CE]/60 border-[#16587B]/20' : 'text-[#4F7085] border-[#16587B]/10'
            }`}>
              <span>{card.subtext}</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-[#84B3CE]/45' : 'text-[#84B3CE]'}`}>Sinkronisasi Realtime</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
