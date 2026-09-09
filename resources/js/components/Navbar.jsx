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
  Moon,
  Menu
} from 'lucide-react';

export default function Navbar({ 
  onOpenRehat, 
  onOpenConnect, 
  connectedAccount, 
  stressLevel, 
  activeTab, 
  isDarkMode, 
  toggleDarkMode,
  onToggleMobileSidebar
}) {
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
    <header className={`h-16 px-4 sm:px-6 lg:px-8 border-b transition-all duration-300 flex items-center justify-between sticky top-0 z-30 ${
      isDarkMode 
        ? 'bg-[#081724]/90 backdrop-blur-md border-[#16587B]/25 text-white' 
        : 'bg-white/90 backdrop-blur-md border-[#16587B]/15 text-[#0D2738]'
    }`}>
      
      {/* Left: Mobile Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className={`p-2 rounded-xl lg:hidden transition-colors cursor-pointer ${
            isDarkMode 
              ? 'text-[#84B3CE] hover:text-white hover:bg-white/10' 
              : 'text-[#16587B] hover:text-[#0D2738] hover:bg-[#16587B]/10'
          }`}
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className={`text-xs sm:text-sm font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight ${
            isDarkMode ? 'text-[#F5EEDD]' : 'text-[#16587B]'
          }`}>
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
            <span className={isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'}>Platform</span>
            <span className={isDarkMode ? 'text-[#84B3CE]/40' : 'text-[#84B3CE]'}>/</span>
            <span className={`font-semibold ${isDarkMode ? 'text-[#84B3CE]' : 'text-[#0D2738]'}`}>
              {connectedAccount?.handle || "SABAR Official"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Live Filter Indicator */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
          isDarkMode 
            ? 'bg-emerald-950/40 border-emerald-500/25 text-emerald-300' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
          <span>Perisai AI Aktif</span>
        </div>

        {/* Asisten Rehat Action Button */}
        <button
          onClick={onOpenRehat}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
            isHighStress
              ? 'bg-rose-600 text-white hover:bg-rose-700 animate-bounce'
              : 'bg-[#16587B] text-[#F5EEDD] hover:bg-[#104460] shadow-[#16587B]/20 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Asisten Rehat</span>
          <span className="sm:hidden">Rehat</span>
          {isHighStress && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          )}
        </button>

        {/* Toggle Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isDarkMode 
              ? 'text-[#84B3CE] hover:text-[#F5EEDD] hover:bg-white/10' 
              : 'text-[#4F7085] hover:text-[#16587B] hover:bg-[#16587B]/10'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button 
          title="Notifikasi"
          className={`p-2 rounded-xl transition-all relative cursor-pointer ${
            isDarkMode 
              ? 'text-[#84B3CE] hover:text-white hover:bg-white/10' 
              : 'text-[#4F7085] hover:text-[#16587B] hover:bg-[#16587B]/10'
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
