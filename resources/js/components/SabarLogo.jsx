import React from 'react';

/**
 * Component Logo SABAR (Sistem Analisis Bullying & Asisten Rehat)
 * Menggunakan vektor SVG presisi tinggi yang diadaptasi dari identitas brand SABAR.
 * 
 * Props:
 * - variant: 'icon' | 'full' | 'horizontal' (default: 'icon')
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - theme: 'navy-gold' | 'slate-emerald' | 'gradient' (default: 'navy-gold')
 * - showSubtitle: boolean
 * - showBadge: boolean
 * - badgeText: string
 * - className: string
 */
export default function SabarLogo({
  variant = 'icon',
  size = 'md',
  theme = 'navy-gold',
  showSubtitle = true,
  showBadge = true,
  badgeText = 'Pro',
  className = '',
}) {
  // Ukuran container icon
  const sizeClasses = {
    sm: 'w-7 h-7 p-1 rounded-lg',
    md: 'w-9 h-9 p-1.5 rounded-xl',
    lg: 'w-11 h-11 p-2 rounded-xl',
    xl: 'w-14 h-14 p-2.5 rounded-2xl',
    hero: 'w-20 h-20 p-3.5 rounded-3xl',
  };

  const svgSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
    hero: 'w-12 h-12',
  };

  // Konfigurasi Tema Warna
  // 1. 'navy-gold': Tema Asli Poster (Navy `#0B1D33` + Champagne Gold `#F4EAD2`)
  // 2. 'slate-emerald': Tema Dashboard (Slate `#0F172A` + Emerald `#34D399`)
  // 3. 'gradient': Gradient mewah gabungan Emerald & Gold
  let bgClass = 'bg-[#0B1D33] border border-[#F4EAD2]/20 shadow-sm';
  let strokeColor = '#F4EAD2';
  let titleColor = 'text-[#F4EAD2]'; // Emas khas brand SABAR
  let subtitleColor = 'text-[#F4EAD2]/65';
  let badgeClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';

  if (theme === 'slate-emerald') {
    bgClass = 'bg-slate-900 border border-emerald-500/20 shadow-sm';
    strokeColor = '#34D399'; // Emerald-400
    titleColor = 'text-emerald-400';
    subtitleColor = 'text-slate-400';
    badgeClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  } else if (theme === 'gradient') {
    bgClass = 'bg-gradient-to-br from-[#0B1D33] via-[#0F294A] to-[#0A1628] border border-amber-400/30 shadow-md';
    strokeColor = 'url(#sabarGoldGrad)';
    titleColor = 'text-white';
    subtitleColor = 'text-slate-300';
    badgeClass = 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-bold';
  }

  // Symbol Perisai SABAR (Menggunakan Image Cropped dari Poster Asli agar 100% otentik)
  const LogoSymbol = (
    <div className={`${sizeClasses[size] || sizeClasses.md} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 shrink-0 bg-[#0B1D33] border border-[#F4EAD2]/25 shadow-sm ${className}`}>
      <img 
        src="/sabar-logo-cropped.png" 
        className="w-full h-full object-cover rounded-md" 
        alt="Sabar Logo" 
      />
    </div>
  );

  if (variant === 'icon') {
    return LogoSymbol;
  }

  // Variant Horizontal / Full (Dengan Nama Brand SABAR dan Subtitle)
  return (
    <div className="flex items-center gap-3">
      {LogoSymbol}
      <div className="text-left leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight ${titleColor} font-['Plus_Jakarta_Sans'] ${size === 'lg' ? 'text-lg' : 'text-base'}`}>
            SABAR
          </span>
          {showBadge && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>
        {showSubtitle && (
          <p className={`text-[11px] ${subtitleColor} truncate max-w-[170px]`} title="Sistem Analisis Bullying & Asisten Rehat">
            Sistem Analisis Bullying & Rehat
          </p>
        )}
      </div>
    </div>
  );
}
