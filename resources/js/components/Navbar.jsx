import React from 'react';
import { 
  Bell, 
  Coffee, 
  Search, 
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  MessageSquareText,
  BarChart3
} from 'lucide-react';

export default function Navbar({ 
  onOpenRehat, 
  onOpenConnect, 
  connectedAccount, 
  stressLevel, 
  activeTab, 
  setActiveTab,
  isDarkMode, 
  toggleDarkMode,
  onToggleMobileSidebar,
  isSidebarCollapsed,
  onToggleDesktopSidebar
}) {
  const isHighStress = stressLevel >= 65;

  const navItems = [
    { id: 'dashboard', label: 'Ikhtisar', icon: LayoutDashboard },
    { id: 'comments', label: 'Log Komentar', icon: MessageSquareText },
    { id: 'analytics', label: 'Analisis NLP', icon: BarChart3 },
  ];

  return (
    <div className="sticky top-3 sm:top-4 z-30 px-3 sm:px-6 lg:px-8 mb-5 sm:mb-6 pointer-events-none">
      <header className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl sm:rounded-full border transition-all duration-300 shadow-md sm:shadow-lg flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-[#0B1E2E]/90 border-white/10 shadow-black/30 text-white' 
          : 'bg-white/95 border-slate-200/80 shadow-slate-900/5 text-[#0D2738]'
      }`}>
        
        {/* Left: Sidebar Toggle + Brand / Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleMobileSidebar}
            className={`p-2 rounded-xl lg:hidden transition-colors cursor-pointer ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Buka Menu"
            title="Buka Menu Navigasi"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Desktop Sidebar Collapse / Expand Toggle */}
          <button
            onClick={onToggleDesktopSidebar}
            className={`hidden lg:flex items-center justify-center p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label={isSidebarCollapsed ? "Buka Sidebar" : "Sembunyikan Sidebar"}
            title={isSidebarCollapsed ? "Tampilkan Sidebar Lengkap" : "Ciutkan Sidebar (Tampilan Luas)"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4 text-sky-500 transition-transform hover:scale-110" />
            ) : (
              <PanelLeftClose className="w-4 h-4 transition-transform hover:scale-110" />
            )}
          </button>
        </div>

        {/* Center: Clean Nav Shortcuts (Image 3 Inspired Pills) */}
        {setActiveTab && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-[#16587B] text-white shadow-xs font-bold' 
                        : 'bg-white text-[#16587B] shadow-xs font-bold'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                        : 'text-slate-600 hover:text-[#0D2738] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Dark Mode Toggle and Action Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-[#0D2738] hover:bg-slate-100'
            }`}
            aria-label="Toggle Mode Gelap/Terang"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Alert Bell */}
          <button 
            title="Notifikasi Sistem"
            className={`p-2 rounded-full transition-all relative cursor-pointer ${
              isDarkMode 
                ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                : 'text-slate-600 hover:text-[#0D2738] hover:bg-slate-100'
            }`}
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {isHighStress && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-ping" />
            )}
          </button>

          {/* Primary Action Button (Image 3 Inspired Vibrant Blue Pill) */}
          <button
            onClick={onOpenRehat}
            className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
              isHighStress
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/30 animate-bounce'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
            }`}
            title="Buka Asisten Rehat Psikologis"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">Asisten Rehat</span>
          </button>
        </div>

      </header>
    </div>
  );
}
