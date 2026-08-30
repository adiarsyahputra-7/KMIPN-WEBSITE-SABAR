import React from 'react';
import { 
  Bell, 
  Coffee, 
  Search, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ onOpenRehat, onOpenConnect, connectedAccount, stressLevel, activeTab, isDarkMode, toggleDarkMode }) {
  const isHighStress = stressLevel >= 65;

  const getPageTitle = () => {
    switch (activeTab) {
      case "comments": return "Log Komentar Live";
      case "analytics": return "Analisis Sentimen & NLP";
      case "limits": return "Konfigurasi Ambang Batas Stres";
      case "security": return "Aturan Filter & Kata Terlarang";
      default: return "Ikhtisar Dashboard Moderasi";
    }
  };

  return (
    <header className={`h-16 px-6 lg:px-8 border-b transition-all duration-300 flex items-center justify-between sticky top-0 z-30 ${
      isDarkMode 
        ? 'bg-[#0B1522] border-[#16587B]/20 text-white' 
        : 'bg-white border-slate-200/80 text-slate-900'
    }`}>
      
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className={`text-sm font-bold font-['Plus_Jakarta_Sans'] ${isDarkMode ? 'text-[#F5EEDD]' : 'text-slate-900'}`}>
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className={isDarkMode ? 'text-[#84B3CE]/60' : 'text-slate-500'}>Platform</span>
            <span className={isDarkMode ? 'text-[#84B3CE]/40' : 'text-slate-400'}>/</span>
            <span className={`font-medium ${isDarkMode ? 'text-[#84B3CE]' : 'text-slate-700'}`}>
              {connectedAccount?.name || "SABAR Official Brand"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-3">
        
        {/* Live Filter Indicator */}
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          isDarkMode 
            ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300' 
            : 'bg-emerald-50 border-emerald-200/70 text-emerald-800'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Perisai AI Aktif</span>
        </div>

        {/* Asisten Rehat Action Button */}
        <button
          onClick={onOpenRehat}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isHighStress
              ? 'bg-rose-600 text-white hover:bg-rose-700 animate-bounce'
              : isDarkMode 
                ? 'bg-[#16587B] text-[#F5EEDD] hover:bg-[#16587B]/80' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Asisten Rehat</span>
          {isHighStress && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          )}
        </button>

        {/* Toggle Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
          className={`p-2 rounded-xl transition-all ${
            isDarkMode 
              ? 'text-[#84B3CE] hover:text-[#F5EEDD] hover:bg-white/10' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button 
          title="Notifikasi"
          className={`p-2 rounded-xl transition-all relative ${
            isDarkMode 
              ? 'text-[#84B3CE] hover:text-white hover:bg-white/10' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          {isHighStress && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
          )}
        </button>

      </div>
    </header>
  );
}
