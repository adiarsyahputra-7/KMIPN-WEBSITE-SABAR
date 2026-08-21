import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Bell, 
  Coffee, 
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';

// Modern Instagram SVG Icon
const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Navbar({ onOpenRehat, onOpenConnect, connectedAccount, stressLevel }) {
  const isHighStress = stressLevel >= 65;

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  SABAR
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-500/10 text-teal-300 rounded-full border border-teal-500/30">
                  MaaS v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Sistem Analisis Bullying & Asisten Rehat Digital
              </p>
            </div>
          </div>

          {/* Center / Action Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Connected Account Trigger */}
            <button
              onClick={onOpenConnect}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 transition-all text-xs text-slate-300 hover:text-white group"
              title="Kelola Integrasi Akun Media Sosial"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white">
                <InstagramIcon />
              </div>
              <span className="font-medium hidden md:inline">
                {connectedAccount ? connectedAccount.handle : "Hubungkan Akun"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Asisten Rehat Button */}
            <button
              onClick={onOpenRehat}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                isHighStress
                  ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/30'
                  : 'bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Asisten Rehat</span>
              {isHighStress && <span className="px-1.5 py-0.2 bg-white text-rose-600 text-[10px] font-extrabold rounded-full">!</span>}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Social Media Admin"
                className="w-8 h-8 rounded-full ring-2 ring-slate-700 object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200">Kalyca Kyla</p>
                <p className="text-[10px] text-slate-400">Social Media Admin</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
