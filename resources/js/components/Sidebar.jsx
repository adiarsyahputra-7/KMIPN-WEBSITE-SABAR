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
  UserCheck
} from 'lucide-react';
import SabarLogo from './SabarLogo';

export default function Sidebar({ activeTab, setActiveTab, onOpenRehat, onOpenConnect, connectedAccount, stressLevel, user, onLogout }) {
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

  return (
    <aside className="w-64 bg-gradient-to-b from-[#16587B] via-[#0E3D54] to-[#0A293B] border-r border-[#16587B]/20 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center border-b border-[#16587B]/20">
        <SabarLogo 
          variant="full" 
          theme="navy-gold" 
          size="md" 
          showSubtitle={true}
          showBadge={true}
          badgeText="Pro"
        />
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-[#84B3CE]/60 uppercase">
              {section.group}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-[#F5EEDD] font-bold shadow-xs'
                      : 'text-[#84B3CE]/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5EEDD]' : 'text-[#84B3CE]/60'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      item.badgeAlert
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/30 animate-pulse'
                        : 'bg-white/10 text-[#84B3CE] border border-white/5'
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
      <div className="p-3 mx-3 mb-3 rounded-xl bg-[#082230]/60 border border-[#16587B]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[11px] font-medium text-[#F5EEDD]/95 truncate max-w-[130px]">
              {connectedAccount?.handle || "@sabar_brand"}
            </span>
          </div>
          <button 
            onClick={onOpenConnect}
            className="text-[10px] font-bold text-[#84B3CE] hover:text-[#F5EEDD]"
          >
            Ubah
          </button>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#16587B]/20 flex items-center justify-between bg-[#071E2B]">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
            alt={user?.name || "Kalyca Kyla"}
            className="w-8 h-8 rounded-full object-cover border border-[#16587B]/30"
          />
          <div className="text-left">
            <p className="text-xs font-semibold text-white">{user?.name || "Kalyca Kyla"}</p>
            <p className="text-[10px] text-[#84B3CE]/70">{user?.role || "Social Media Lead"}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          title="Keluar (Logout)"
          className="p-1.5 text-[#84B3CE]/60 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
}
