import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  HeartHandshake, 
  BarChart3, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  UserCheck,
  X
} from 'lucide-react';
import SabarLogo from './SabarLogo';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenRehat, 
  onOpenConnect, 
  connectedAccount, 
  stressLevel, 
  user, 
  onLogout,
  isDarkMode = false,
  isMobileOpen = false,
  onCloseMobile
}) {
  const isHighStress = stressLevel >= 65;

  const navigation = [
    {
      group: "MODERASI & MONITORING",
      items: [
        { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
        { id: "comments", label: "Log Komentar Live", icon: MessageSquareText, badge: "Live" },
        { id: "analytics", label: "Analisis Sentimen & AI", icon: BarChart3 },
      ]
    },
    {
      group: "KESEHATAN MENTAL KERJA",
      items: [
        { 
          id: "rehat", 
          label: "Asisten Rehat", 
          icon: HeartHandshake,  
          action: onOpenRehat,
          badge: isHighStress ? "Perlu Rehat" : null,
          badgeAlert: isHighStress
        },
        { id: "limits", label: "Ambang Batas Stres", icon: Sliders },
      ]
    },
    {
      group: "PENGATURAN & KONEKSI",
      items: [
        { id: "accounts", label: "Akun Media Sosial", icon: UserCheck, action: onOpenConnect },
        { id: "security", label: "Aturan Filter & Kata", icon: ShieldCheck },
      ]
    }
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActiveTab(item.id);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full select-none ${
      isDarkMode 
        ? 'bg-[#081724] text-slate-100 border-r border-[#16587B]/25' 
        : 'bg-[#FAF7F2] text-[#0D2738] border-r border-[#16587B]/15'
    }`}>
      {/* Brand Header */}
      <div className={`h-16 px-5 flex items-center justify-between border-b ${
        isDarkMode ? 'border-[#16587B]/25 bg-[#0B1E2E]' : 'border-[#16587B]/12 bg-white/70'
      }`}>
        <SabarLogo 
          variant="full" 
          theme={isDarkMode ? 'navy-gold' : 'navy-gold'} 
          size="md" 
          showSubtitle={true}
          showBadge={true}
          badgeText="Pro"
        />

        {/* Close Button on Mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className={`p-1.5 rounded-xl lg:hidden transition-colors ${
              isDarkMode 
                ? 'text-[#84B3CE] hover:text-white hover:bg-white/10' 
                : 'text-[#4F7085] hover:text-[#0D2738] hover:bg-[#16587B]/10'
            }`}
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className={`px-3 text-[10px] font-bold tracking-wider uppercase ${
              isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#16587B]/70'
            }`}>
              {section.group}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#16587B] text-[#F5EEDD] shadow-md shadow-[#16587B]/20 font-bold'
                      : isDarkMode
                        ? 'text-[#84B3CE]/80 hover:bg-white/5 hover:text-white'
                        : 'text-[#4F7085] hover:bg-[#16587B]/8 hover:text-[#16587B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive 
                        ? 'text-[#F5EEDD]' 
                        : isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#16587B]/70'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badgeAlert
                        ? 'bg-rose-500/20 text-rose-600 border border-rose-500/30 animate-pulse'
                        : isActive
                          ? 'bg-white/20 text-[#F5EEDD]'
                          : isDarkMode
                            ? 'bg-white/10 text-[#84B3CE] border border-white/5'
                            : 'bg-[#16587B]/10 text-[#16587B] border border-[#16587B]/15'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Connected Account Mini Pill */}
      <div className={`p-3 mx-3 mb-3 rounded-2xl border transition-all ${
        isDarkMode 
          ? 'bg-[#0B1E2E]/80 border-[#16587B]/25' 
          : 'bg-white border-[#16587B]/15 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <div className="truncate">
              <span className={`text-[11px] font-bold truncate block ${
                isDarkMode ? 'text-[#F5EEDD]' : 'text-[#0D2738]'
              }`}>
                {connectedAccount?.handle || "@sabar_brand"}
              </span>
              <span className={`text-[9px] block ${
                isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#4F7085]'
              }`}>
                {connectedAccount?.platform ? connectedAccount.platform.toUpperCase() : 'INSTAGRAM'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => {
              if (onOpenConnect) onOpenConnect();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
              isDarkMode
                ? 'text-[#84B3CE] hover:text-[#F5EEDD] border-[#16587B]/30 hover:bg-white/5'
                : 'text-[#16587B] hover:text-[#0D2738] border-[#16587B]/20 bg-[#FAF7F2] hover:bg-[#F5EEDD]'
            }`}
          >
            Ubah
          </button>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className={`p-3.5 border-t flex items-center justify-between ${
        isDarkMode 
          ? 'border-[#16587B]/25 bg-[#061420]' 
          : 'border-[#16587B]/15 bg-white/60'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
            alt={user?.name || "Creator SABAR"}
            className={`w-8 h-8 rounded-full object-cover border shrink-0 ${
              isDarkMode ? 'border-[#16587B]/30' : 'border-[#16587B]/20'
            }`}
          />
          <div className="text-left truncate">
            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>
              {user?.name || "Kalyca Kyla"}
            </p>
            <p className={`text-[10px] truncate ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>
              {user?.role || "Creator"}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          title="Keluar (Logout)"
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            isDarkMode 
              ? 'text-[#84B3CE]/70 hover:text-rose-400 hover:bg-rose-500/10' 
              : 'text-[#4F7085] hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="w-64 shrink-0 sticky top-0 h-screen hidden lg:block z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-[#0D2738]/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
