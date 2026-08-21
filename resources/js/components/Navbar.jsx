import React from 'react';
import { 
  Bell, 
  Coffee, 
  Search, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ onOpenRehat, onOpenConnect, connectedAccount, stressLevel, activeTab }) {
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
    <header className="h-16 px-6 lg:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Platform</span>
            <span>/</span>
            <span className="text-slate-700 font-medium">{connectedAccount?.name || "SABAR Official Brand"}</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-3">
        
        {/* Live Filter Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Perisai AI Aktif</span>
        </div>

        {/* Asisten Rehat Action Button */}
        <button
          onClick={onOpenRehat}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isHighStress
              ? 'bg-rose-600 text-white hover:bg-rose-700 animate-bounce'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Asisten Rehat</span>
          {isHighStress && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          )}
        </button>

        {/* Notification Bell */}
        <button 
          title="Notifikasi"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all relative"
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
