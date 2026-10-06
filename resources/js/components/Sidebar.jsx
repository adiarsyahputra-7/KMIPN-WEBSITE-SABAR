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
  X,
  PanelLeftClose,
  PanelLeftOpen
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
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
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

  const renderContent = (collapsedMode = false) => (
    <div className={`flex flex-col h-full select-none transition-all duration-300 ${
      isDarkMode 
        ? 'bg-[#081724] text-slate-100 border-r border-[#16587B]/25' 
        : 'bg-[#FAF7F2] text-[#0D2738] border-r border-[#16587B]/15'
    }`}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center justify-between border-b transition-all ${
        collapsedMode ? 'px-3 justify-center' : 'px-4'
      } ${
        isDarkMode ? 'border-[#16587B]/25 bg-[#0B1E2E]' : 'border-[#16587B]/12 bg-white/70'
      }`}>
        {!collapsedMode ? (
          <>
            <SabarLogo 
              variant="full" 
              theme={isDarkMode ? 'navy-gold' : 'navy-gold'} 
              size="md" 
              showSubtitle={true}
              showBadge={false}
              badgeText="Pro"
              isDarkMode={isDarkMode}
            />

            {/* Close Button on Mobile Drawer */}
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
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-xl transition-all cursor-pointer hover:scale-105 ${
                isDarkMode 
                  ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                  : 'text-[#16587B] hover:bg-[#16587B]/10'
              }`}
              title="Buka Sidebar Lengkap"
            >
              <PanelLeftOpen className="w-5 h-5 text-sky-500" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className={`flex-1 py-4 overflow-y-auto space-y-5 ${collapsedMode ? 'px-2' : 'px-3'}`}>
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsedMode && (
              <p className={`px-3 text-[10px] font-bold tracking-wider uppercase ${
                isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#16587B]/70'
              }`}>
                {section.group}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={collapsedMode ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    collapsedMode 
                      ? 'justify-center p-2.5 my-1' 
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#16587B] text-[#F5EEDD] shadow-md shadow-[#16587B]/20 font-bold'
                      : isDarkMode
                        ? 'text-[#84B3CE]/80 hover:bg-white/5 hover:text-white'
                        : 'text-[#4F7085] hover:bg-[#16587B]/8 hover:text-[#16587B]'
                  }`}
                >
                  <div className={`flex items-center ${collapsedMode ? 'justify-center' : 'gap-2.5'}`}>
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive 
                        ? 'text-[#F5EEDD]' 
                        : isDarkMode ? 'text-[#84B3CE]/60' : 'text-[#16587B]/70'
                    }`} />
                    {!collapsedMode && <span>{item.label}</span>}
                  </div>

                  {!collapsedMode && item.badge && (
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

                  {collapsedMode && item.badgeAlert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Connected Account Mini Card */}
      {!collapsedMode ? (
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
      ) : (
        <div className="flex justify-center p-2 mb-2">
          <div 
            onClick={onOpenConnect}
            className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
            title={`Akun: ${connectedAccount?.handle || 'Instagram'}`}
          />
        </div>
      )}

      {/* User Footer Profile */}
      <div className={`border-t flex items-center transition-all ${
        collapsedMode ? 'p-2 justify-center flex-col gap-2' : 'p-3.5 justify-between'
      } ${
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
            title={collapsedMode ? (user?.name || "Kalyca Admin") : undefined}
          />
          {!collapsedMode && (
            <div className="text-left truncate">
              <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#0D2738]'}`}>
                {user?.name || "Kalyca Admin"}
              </p>
              <p className={`text-[10px] truncate ${isDarkMode ? 'text-[#84B3CE]/70' : 'text-[#4F7085]'}`}>
                {user?.role || "Creator Pro"}
              </p>
            </div>
          )}
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
      {/* Desktop Sticky Sidebar with Smooth Width Transition */}
      <aside className={`shrink-0 sticky top-0 h-screen hidden lg:block z-30 transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}>
        {renderContent(isCollapsed)}
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
            {renderContent(false)}
          </div>
        </div>
      )}
    </>
  );
}
