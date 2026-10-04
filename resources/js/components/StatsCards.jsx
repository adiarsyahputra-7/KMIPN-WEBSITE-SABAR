import React from 'react';
import { 
  MessageSquare, 
  Smile, 
  Frown, 
  ShieldAlert, 
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function StatsCards({ stats, isDarkMode }) {
  const getCardTheme = (colorName) => {
    if (!isDarkMode) {
      switch (colorName) {
        case 'blue':
          return {
            iconBg: 'bg-sky-50 text-sky-700 border-sky-200/80',
            badge: 'bg-sky-50 text-sky-800 border-sky-200/60',
            borderHover: 'hover:border-sky-300',
            glow: 'from-sky-500/5',
          };
        case 'emerald':
          return {
            iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
            badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
            borderHover: 'hover:border-emerald-300',
            glow: 'from-emerald-500/5',
          };
        case 'amber':
          return {
            iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
            badge: 'bg-amber-50 text-amber-800 border-amber-200/60',
            borderHover: 'hover:border-amber-300',
            glow: 'from-amber-500/5',
          };
        case 'rose':
          return {
            iconBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
            badge: 'bg-rose-50 text-rose-800 border-rose-200/60',
            borderHover: 'hover:border-rose-300',
            glow: 'from-rose-500/5',
          };
        default:
          return {};
      }
    } else {
      switch (colorName) {
        case 'blue':
          return {
            iconBg: 'bg-sky-950/60 text-sky-400 border-sky-800/50',
            badge: 'bg-sky-950/40 text-sky-300 border-sky-800/40',
            borderHover: 'hover:border-sky-500/40',
            glow: 'from-sky-500/10',
          };
        case 'emerald':
          return {
            iconBg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
            badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
            borderHover: 'hover:border-emerald-500/40',
            glow: 'from-emerald-500/10',
          };
        case 'amber':
          return {
            iconBg: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
            badge: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
            borderHover: 'hover:border-amber-500/40',
            glow: 'from-amber-500/10',
          };
        case 'rose':
          return {
            iconBg: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
            badge: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
            borderHover: 'hover:border-rose-500/40',
            glow: 'from-rose-500/10',
          };
        default:
          return {};
      }
    }
  };

  const cards = [
    {
      title: "Total Komentar Masuk",
      value: stats.total,
      subtext: "Aktivitas Hari Ini",
      trend: "+14.2%",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Sentimen Positif",
      value: `${stats.positivePercent}%`,
      subtext: `${stats.positiveCount} komentar mendukung`,
      trend: "Mendukung",
      icon: Smile,
      color: "emerald",
    },
    {
      title: "Negatif & Sarkasme",
      value: `${stats.negativePercent}%`,
      subtext: `${stats.negativeCount} terindikasi sindiran`,
      trend: "Perlu ditinjau",
      icon: Frown,
      color: "amber",
    },
    {
      title: "Dicegat Otomatis",
      value: stats.toxicCount,
      subtext: `${stats.toxicPercent}% tertahan perisai`,
      trend: "Proteksi aktif",
      icon: ShieldAlert,
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-300">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const theme = getCardTheme(card.color);
        return (
          <div
            key={idx}
            className={`group relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-xl ${theme.borderHover} ${
              isDarkMode 
                ? 'bg-[#0B1E2E]/90 border-white/10 shadow-md shadow-black/20' 
                : 'bg-white border-slate-200/80 shadow-xs shadow-slate-900/5'
            }`}
          >
            {/* Subtle Gradient Accent Aura in Corner */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${theme.glow} to-transparent rounded-full blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`} />

            <div className="space-y-3 relative z-10">
              {/* Header: Title & Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${theme.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Metric & Trend */}
              <div className="flex items-baseline justify-between gap-2 pt-1">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
                  isDarkMode ? 'text-white' : 'text-[#0D2738]'
                }`}>
                  {card.value}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${theme.badge}`}>
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className={`text-[11px] border-t pt-3 mt-4 flex items-center justify-between font-medium relative z-10 ${
              isDarkMode ? 'text-slate-400 border-white/5' : 'text-slate-500 border-slate-100'
            }`}>
              <span className="truncate">{card.subtext}</span>
              <span className={`text-[10px] shrink-0 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Realtime
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
