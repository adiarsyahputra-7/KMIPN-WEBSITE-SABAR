import React from 'react';
import { 
  MessageSquare, 
  Smile, 
  Frown, 
  ShieldAlert, 
  ArrowLeftRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function HeroOverview({
  user,
  connectedAccount,
  stats,
  isDarkMode,
  onOpenConnect
}) {
  // Theme color palette per metric card
  const getCardTheme = (colorName) => {
    if (!isDarkMode) {
      switch (colorName) {
        case 'blue':
          return {
            iconBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
            badge: 'bg-sky-50 text-sky-700 border-sky-200/70',
            borderHover: 'hover:border-sky-300',
            glow: 'from-sky-500/10',
          };
        case 'emerald':
          return {
            iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
            borderHover: 'hover:border-emerald-300',
            glow: 'from-emerald-500/10',
          };
        case 'amber':
          return {
            iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
            badge: 'bg-amber-50 text-amber-700 border-amber-200/70',
            borderHover: 'hover:border-amber-300',
            glow: 'from-amber-500/10',
          };
        case 'rose':
          return {
            iconBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
            badge: 'bg-rose-50 text-rose-700 border-rose-200/70',
            borderHover: 'hover:border-rose-300',
            glow: 'from-rose-500/10',
          };
        default:
          return {};
      }
    } else {
      switch (colorName) {
        case 'blue':
          return {
            iconBg: 'bg-sky-950/70 text-sky-400 border-sky-800/60',
            badge: 'bg-sky-950/50 text-sky-300 border-sky-800/40',
            borderHover: 'hover:border-sky-500/50',
            glow: 'from-sky-500/15',
          };
        case 'emerald':
          return {
            iconBg: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
            badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40',
            borderHover: 'hover:border-emerald-500/50',
            glow: 'from-emerald-500/15',
          };
        case 'amber':
          return {
            iconBg: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
            badge: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
            borderHover: 'hover:border-amber-500/50',
            glow: 'from-amber-500/15',
          };
        case 'rose':
          return {
            iconBg: 'bg-rose-950/70 text-rose-400 border-rose-800/60',
            badge: 'bg-rose-950/50 text-rose-300 border-rose-800/40',
            borderHover: 'hover:border-rose-500/50',
            glow: 'from-rose-500/15',
          };
        default:
          return {};
      }
    }
  };

  const total = stats?.total ?? 27;
  const positivePercent = stats?.positivePercent ?? 26;
  const positiveCount = stats?.positiveCount ?? 7;
  const negativePercent = stats?.negativePercent ?? 59;
  const negativeCount = stats?.negativeCount ?? 16;
  const toxicCount = stats?.toxicCount ?? 16;
  const toxicPercent = stats?.toxicPercent ?? 59;

  const cardItems = [
    {
      title: "Total Komentar Masuk",
      value: total,
      subtext: "Aktivitas Hari Ini",
      trend: "+14.2%",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Sentimen Positif",
      value: `${positivePercent}%`,
      subtext: `${positiveCount} komentar mendukung`,
      trend: "Mendukung",
      icon: Smile,
      color: "emerald",
    },
    {
      title: "Negatif & Sarkasme",
      value: `${negativePercent}%`,
      subtext: `${negativeCount} terindikasi sindiran`,
      trend: "Perlu ditinjau",
      icon: Frown,
      color: "amber",
    },
    {
      title: "Dicegat Otomatis",
      value: toxicCount,
      subtext: `${toxicPercent}% tertahan perisai`,
      trend: "Proteksi aktif",
      icon: ShieldAlert,
      color: "rose",
    },
  ];

  return (
    <div
      id="dashboard-section"
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-b from-[#0B1E2E] via-[#0D253A] to-[#0A1B29] border-white/10 shadow-xl shadow-black/30'
          : 'bg-gradient-to-b from-white via-white to-sky-50/40 border-slate-200/80 shadow-xs'
      }`}
    >
      {/* Ambient Decorative Lighting */}
      <div 
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDarkMode ? 'bg-sky-500/10' : 'bg-sky-500/8'
        }`} 
      />
      <div 
        className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDarkMode ? 'bg-emerald-500/5' : 'bg-teal-500/5'
        }`} 
      />

      {/* Subtle Top Glass Border Shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 dark:via-sky-400/40 to-transparent pointer-events-none" />

      {/* ── UPPER SECTION: GREETING & ACCOUNT CONTROL ── */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-9 pb-6 sm:pb-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            {/* Status Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-slate-300' 
                  : 'bg-slate-100/90 border-slate-200/80 text-slate-700'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.9)] shrink-0" />
                <span>
                  Akun Terpantau:{' '}
                  <strong className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>
                    {connectedAccount?.handle || '@folernatyn'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Big Bold Headline */}
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
              isDarkMode ? 'text-white' : 'text-[#0D2738]'
            }`}>
              Halo, {user?.name || 'Adiar Creator'}
            </h1>

            {/* Subtitle */}
            <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Sistem aktif menyaring ujaran kebencian & sarkasme secara real-time guna melindungi kenyamanan mental pengelola akun.
            </p>
          </div>

          {/* Action Button: Ganti Akun Target */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 pt-1 lg:pt-0">
            <button
              onClick={onOpenConnect}
              className={`group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/25 shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-[#16587B] border-slate-200/90 hover:border-sky-300 shadow-xs'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#16587B] dark:text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>{connectedAccount ? 'Ganti Akun Target' : '+ Hubungkan Akun'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── LOWER SECTION: INTEGRATED 4 STAT METRICS TRAY ── */}
      <div className={`relative z-10 border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black/20 border-white/10 p-5 sm:p-7' 
          : 'bg-slate-50/50 border-slate-200/70 p-5 sm:p-7'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
          {cardItems.map((card, idx) => {
            const Icon = card.icon;
            const theme = getCardTheme(card.color);
            return (
              <div
                key={idx}
                className={`group relative p-5 sm:p-5.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 hover:shadow-lg ${theme.borderHover} ${
                  isDarkMode 
                    ? 'bg-[#081724]/90 border-white/10 shadow-md shadow-black/20 hover:bg-[#0b1f30]' 
                    : 'bg-white border-slate-200/80 shadow-xs shadow-slate-900/5 hover:shadow-slate-900/10'
                }`}
              >
                {/* Subtle Gradient Accent Aura in Corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${theme.glow} to-transparent rounded-full blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`} />

                <div className="space-y-3 relative z-10">
                  {/* Header: Title & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
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
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Realtime
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
