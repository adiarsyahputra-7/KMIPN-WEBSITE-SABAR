import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '../api';
import SabarLogo from './SabarLogo';

export default function LoginPage({ onLogin, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('kalyca@sabar.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ─── HELPER: Proses respons login dan set state user ──────────────────────
  const processLoginResponse = (data) => {
    localStorage.setItem('auth_token', data.token);
    onLogin({
      name: data.user.name,
      email: data.user.email,
      role: data.user.role || 'creator',
      plan: data.user.plan || 'Creator Pro Tier',
      avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    });
  };

  // ─── SUBMIT FORM (Login / Register) ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const endpoint = isSignUp ? '/auth/register' : '/auth/login';
    const payload = isSignUp
      ? { name, email, password, role: 'creator' }
      : { email, password };

    try {
      const { data } = await api.post(endpoint, payload);
      if (isSignUp) {
        setSuccessMsg('Akun berhasil dibuat! Mengarahkan ke dashboard...');
        setTimeout(() => processLoginResponse(data), 800);
      } else {
        processLoginResponse(data);
      }
    } catch (err) {
      const msg = err.response?.data?.message
        || (isSignUp ? 'Pendaftaran gagal. Periksa kembali data Anda.' : 'Email atau password tidak valid.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── QUICK DEMO LOGIN (Untuk Demo KMIPN) ──────────────────────────────────
  const handleQuickDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    // Email sesuai UserSeeder.php
    const demoEmail = role === 'creator' ? 'adiar@sabar.com' : 'kalyca@sabar.com';

    try {
      const { data } = await api.post('/auth/login', {
        email: demoEmail,
        password: 'password',
      });
      processLoginResponse(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login gagal. Pastikan seeder sudah dijalankan.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans overflow-hidden">

      {/* ── Left Pane: Brand Presentation Banner ────────────────────────────── */}
      <div 
        className="w-full md:w-[50%] lg:w-[52%] bg-[#0B1D33] relative min-h-[500px] md:min-h-screen shrink-0 flex flex-col justify-between p-8 sm:p-14 lg:p-20 overflow-hidden"
      >
        {/* Decorative background glow & subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(22, 87, 123, 0.35) 0%, rgba(11, 29, 51, 0.95) 70%)'
        }} />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#16587B]/20 blur-3xl pointer-events-none" />

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SabarLogo variant="icon" size="sm" theme="navy-gold" />
            <span className="text-xl font-extrabold tracking-wider font-['Plus_Jakarta_Sans'] text-[#F4EAD2]">
              SABAR
            </span>
          </div>
        </div>

        {/* Center Hero Presentation Text */}
        <div className="relative z-10 my-auto space-y-6 py-10 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight leading-[1.15] text-[#F4EAD2]">
            Sistem Analisis Bullying &amp; Asisten Rehat
          </h1>

          <p className="text-sm sm:text-base text-[#84B3CE] leading-relaxed font-light">
            Mencegat narasi negatif secara real-time demi ruang kerja digital yang lebih humanis, sehat, dan berkelanjutan.
          </p>
        </div>
      </div>

      {/* ── Right Pane: Form ─────────────────────────────────────────────────── */}
      <div className="w-full md:w-[50%] lg:w-[48%] p-8 sm:p-14 lg:p-20 flex flex-col justify-between bg-white min-h-screen overflow-y-auto">

        <div className="max-w-md w-full mx-auto my-auto space-y-7">

          {/* Greeting Header */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Halo Rekan Kreator & Agensi !
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
              {isSignUp ? 'Daftar Akun Baru' : (
                <>
                  <span className="text-[#16587B]">Masuk</span> ke Akun Anda
                </>
              )}
            </h2>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 pl-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-700">Akses Demo:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="demo-admin-btn"
                onClick={() => handleQuickDemoLogin('agency')}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#84B3CE]/10 text-xs font-bold text-slate-700 hover:text-[#16587B] border border-slate-200 hover:border-[#84B3CE] transition-all shadow-2xs disabled:opacity-50"
              >
                Admin Agensi
              </button>
              <button
                type="button"
                id="demo-creator-btn"
                onClick={() => handleQuickDemoLogin('creator')}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#16587B]/10 text-xs font-bold text-slate-700 hover:text-[#16587B] border border-slate-200 hover:border-[#16587B] transition-all shadow-2xs disabled:opacity-50"
              >
                Kreator
              </button>
            </div>
          </div>

          {/* Error/Success Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full px-3 py-2.5 text-xs text-slate-900 border-b-2 border-slate-200 focus:border-[#16587B] focus:outline-none transition-all placeholder:text-slate-400 bg-transparent"
                />
              </div>
            )}

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
                  id="login-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="nama@agensi.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs text-slate-900 border-b-2 border-slate-200 focus:border-[#16587B] focus:outline-none transition-all placeholder:text-slate-400 bg-transparent"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="login-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-900 border-b-2 border-slate-200 focus:border-[#16587B] focus:outline-none transition-all placeholder:text-slate-400 bg-transparent"
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
            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-500 text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#16587B] focus:ring-[#16587B]"
                  />
                  <span>Ingat Saya</span>
                </label>
                <a href="#forgot" className="text-xs font-semibold text-[#16587B] hover:underline">
                  Lupa Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#84B3CE] to-[#16587B] hover:from-[#73a2bd] hover:to-[#0f4663] text-[#F5EEDD] text-xs font-bold transition-all shadow-lg shadow-[#16587B]/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-[#F5EEDD] border-t-transparent rounded-full" />
              ) : (
                <>
                  <span>{isSignUp ? 'DAFTAR SEKARANG' : 'MASUK KE DASHBOARD'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {isSignUp ? 'Sudah memiliki akun?' : 'Belum punya akun?'}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
                className="font-bold text-[#16587B] hover:underline"
              >
                {isSignUp ? 'Login disini' : 'Daftar Akun Baru'}
              </button>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          <p>© 2026 SABAR — Sistem Moderation-as-a-Service Berbasis Context-Aware NLP.</p>
        </div>

      </div>
    </div>
  );
}
