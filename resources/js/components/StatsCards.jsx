import React from 'react';
import { 
  MessageSquare, 
  Smile, 
  Frown, 
  ShieldAlert, 
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Komentar Hari Ini",
      value: stats.total,
      subtext: "+12.4% dari kemarin",
      icon: MessageSquare,
      color: "from-blue-500/10 to-indigo-500/10",
      borderColor: "border-blue-500/20",
      textColor: "text-blue-400",
      badgeColor: "bg-blue-500/10 text-blue-300",
    },
    {
      title: "Sentimen Positif",
      value: `${stats.positivePercent}%`,
      subtext: `${stats.positiveCount} komentar mendukung`,
      icon: Smile,
      color: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/20",
      textColor: "text-emerald-400",
      badgeColor: "bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Negatif & Sarkasme",
      value: `${stats.negativePercent}%`,
      subtext: `${stats.negativeCount} komentar terindikasi`,
      icon: Frown,
      color: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-500/20",
      textColor: "text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-300",
    },
    {
      title: "Toksisitas Otomatis Tertahan",
      value: stats.toxicCount,
      subtext: `${stats.toxicPercent}% dicegat sebelum dibaca`,
      icon: ShieldAlert,
      color: "from-rose-500/10 to-pink-500/10",
      borderColor: "border-rose-500/20",
      textColor: "text-rose-400",
      badgeColor: "bg-rose-500/10 text-rose-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-[#111A2E] border ${card.borderColor} shadow-lg backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:border-slate-600/60`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/60 border border-white/5 ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {card.value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${card.badgeColor}`}>
                Auto-Log
              </span>
              <span className="truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
