import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  Zap
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("kalyca.admin@sabar.id");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: isSignUp ? "Pengguna Baru" : "Kalyca Kyla",
        email: email,
        role: "Social Media Lead",
        plan: "Agency Pro Tier",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      });
      setLoading(false);
    }, 350);
  };

  const handleQuickDemoLogin = (role) => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: role === 'creator' ? "Adiar Zidan" : "Kalyca Kyla",
        email: role === 'creator' ? "adiar.creator@sabar.id" : "kalyca.admin@sabar.id",
        role: role === 'creator' ? "Content Creator" : "Social Media Lead",
        plan: role === 'creator' ? "Creator Pro Tier" : "Agency Pro Tier",
        avatar: role === 'creator' 
          ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      });
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">
      
      {/* Left Pane: Fullscreen Fluid Wave Graphic Banner */}
      <div className="w-full md:w-[50%] lg:w-[52%] bg-gradient-to-br from-teal-600 via-cyan-700 to-indigo-950 p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden text-white min-h-[380px] md:min-h-screen shrink-0">
        
        {/* Floating Decorative Glows & Spheres */}
        <div className="absolute top-16 right-16 w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-300 to-teal-200 opacity-70 blur-xs shadow-2xl pointer-events-none" />
        <div className="absolute bottom-24 left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 opacity-60 blur-xs shadow-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-400 opacity-40 pointer-events-none" />

        {/* Organic Wave SVGs Layer */}
        <svg className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none" viewBox="0 0 500 500" preserveAspectRatio="none">
          <path d="M0,100 C160,220 340,10 500,120 L500,0 L0,0 Z" fill="#06B6D4" />
          <path d="M0,260 C180,400 320,130 500,300 L500,500 L0,500 Z" fill="#047857" />
          <path d="M0,410 C210,310 290,460 500,360 L500,500 L0,500 Z" fill="#1E1B4B" />
        </svg>

        {/* Top Brand Identity */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white font-bold" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
              SABAR
            </span>
            <span className="ml-2.5 text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/25">
              MaaS v1.0
            </span>
          </div>
        </div>

        {/* Center Presentation Title */}
        <div className="relative z-10 my-auto space-y-4 py-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-teal-200 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proteksi Mental & Moderasi AI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight leading-tight">
            Sistem Analisis Bullying & Asisten Rehat
          </h1>
          <p className="text-sm text-teal-100/90 leading-relaxed max-w-md font-light">
            Mencegat narasi negatif secara real-time demi ruang kerja digital yang lebih humanis, sehat, dan berkelanjutan.
          </p>
        </div>
      </div>

      {/* Right Pane: Fullscreen Clean Form */}
      <div className="w-full md:w-[50%] lg:w-[48%] p-8 sm:p-14 lg:p-20 flex flex-col justify-between bg-white min-h-screen overflow-y-auto">
        
        <div className="max-w-md w-full mx-auto my-auto space-y-7">
          
          {/* Greeting Header */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Halo Rekan Kreator & Agensi !
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
              {isSignUp ? "Daftar Akun Baru" : (
                <>
                  <span className="text-teal-600">Masuk</span> ke Akun Anda
                </>
              )}
            </h2>
          </div>

          {/* Quick Demo Access Bar for KMIPN Judges */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 pl-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700">Akses Demo:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('agency')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-xs font-bold text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-all shadow-2xs"
              >
                Admin Agensi
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('creator')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-xs font-bold text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs"
              >
                Kreator
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@agensi.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 border-b-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400 bg-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-900 border-b-2 border-slate-200 focus:border-teal-500 focus:outline-none transition-all placeholder:text-slate-400 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500 text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Ingat Saya</span>
              </label>
              <a href="#forgot" className="text-xs font-semibold text-teal-600 hover:underline">
                Lupa Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-bold transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>{isSignUp ? "DAFTAR SEKARANG" : "MASUK KE DASHBOARD"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {isSignUp ? "Sudah memiliki akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-teal-600 hover:underline"
              >
                {isSignUp ? "Login disini" : "Daftar Akun Baru"}
              </button>
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          <p>© 2026 SABAR — Sistem Moderation-as-a-Service Berbasis Context-Aware NLP.</p>
        </div>

      </div>

    </div>
  );
}
