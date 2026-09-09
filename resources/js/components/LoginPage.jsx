import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  X,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import api from '../api';

// ─── PALET WARNA SABAR (TEMA CERAH, ADEM & ELEGAN) ────────────────────────
const COLORS = {
  vBlue: '#16587B',
  rockBlue: '#2A6E94',
  rockLight: '#84B3CE',
  merino: '#F5EEDD',
  bg: '#FAF7F2',
  bgCard: '#FFFFFF',
  bgSubtle: '#F6F2EA',
  border: 'rgba(22, 88, 123, 0.14)',
  dark: '#0D2738',
  muted: '#4F7085',
};

// ─── Google Icon (SVG Ringan) ──────────────────────────────────────────────
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// ─── Input Field Wrapper ───────────────────────────────────────────────────
function InputField({ label, icon, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1">
      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4F7085]">
        {label}
      </label>
      <div
        className="flex items-center rounded-xl border transition-all duration-200 bg-white"
        style={{
          borderColor: focused ? COLORS.vBlue : 'rgba(22, 88, 123, 0.18)',
          boxShadow: focused ? '0 0 0 3px rgba(22, 88, 123, 0.10)' : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span className="pl-3 shrink-0 text-[#84B3CE]">{icon}</span>
        {children}
      </div>
    </div>
  );
}

// ─── Main Fullscreen Component ─────────────────────────────────────────────
export default function LoginPage({ onLogin, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('kalyca@sabar.com');
  const [password, setPassword] = useState('password');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const processLoginResponse = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('isLoggedIn', 'true');
    window.dispatchEvent(new Event('auth-change'));
    if (onLogin) onLogin(userData);
  };

  const handleQuickDemoLogin = async (role) => {
    setError('');
    setSuccessMsg('');
    const demoEmail = role === 'creator' ? 'adiar@sabar.com' : 'kalyca@sabar.com';
    const demoPassword = 'password';
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: demoEmail,
        password: demoPassword,
      });
      const token = res.data?.token || res.data?.access_token || res.data?.authorisation?.token;
      const userData = res.data?.user || res.data?.data?.user || res.data;
      if (token && userData) {
        processLoginResponse(userData, token);
      } else {
        throw new Error(res.data?.message || 'Gagal memproses sesi login.');
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Demo login gagal. Pastikan seeder database sudah dijalankan.';
      setError(serverMsg);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Nama lengkap wajib diisi');
        if (password !== passwordConfirmation) {
          throw new Error('Konfirmasi kata sandi tidak cocok');
        }
        const res = await api.post('/auth/register', {
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
        });
        if (res.data?.user && res.data?.token) {
          processLoginResponse(res.data.user, res.data.token);
        } else {
          setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
          setIsSignUp(false);
        }
      } else {
        const res = await api.post('/auth/login', {
          email: email.trim(),
          password,
        });
        const token = res.data?.token || res.data?.access_token || res.data?.authorisation?.token;
        const userData = res.data?.user || res.data?.data?.user || res.data;
        if (token && userData) {
          processLoginResponse(userData, token);
        } else {
          throw new Error(res.data?.message || 'Gagal memproses sesi login.');
        }
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Terjadi kesalahan saat memproses data.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div
      className="fixed inset-0 z-[9999] w-full h-screen overflow-y-auto lg:overflow-hidden flex flex-col font-sans selection:bg-[#16587B] selection:text-white"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Background Grid Pattern Halus & Ringan */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] select-none"
        style={{
          backgroundImage: `linear-gradient(${COLORS.vBlue} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.vBlue} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Soft Glow Orbs */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[350px] pointer-events-none opacity-40 select-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(132,179,206,0.3) 0%, rgba(245,238,221,0.5) 45%, transparent 70%)',
        }}
      />

      {/* Tombol Close di Pojok Kanan Atas */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Tutup Halaman Login"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-2.5 rounded-full bg-slate-100/90 hover:bg-slate-200 text-[#16587B] border border-[#16587B]/15 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Main Fullscreen Split Layout */}
      <div className="relative z-10 w-full h-full flex-1 flex flex-col lg:flex-row items-stretch">

        {/* ══ SISI KIRI (FOKUS BERKARYA BESAR & KE TENGAH - TANPA LOGO SABAR) ══ */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-6 py-10 sm:px-10 lg:px-14 relative my-auto">
          <div className="max-w-lg mx-auto flex flex-col items-center">
            {/* Typography Utama Besar di Tengah */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.18]"
              style={{ color: COLORS.vBlue }}
            >
              Fokus Berkarya,{' '}
              <span className="block mt-1 sm:mt-2 text-[#2A6E94]">
                Kami yang Jaga Ruangmu.
              </span>
            </h1>

            {/* Sub-judul Penjelas */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#4F7085] leading-relaxed max-w-md mx-auto font-normal">
              Moderasi konten berbasis AI yang memahami konteks bahasa Indonesia — lindungi komunitas kreatormu secara otomatis.
            </p>

            {/* Garis Aksen Halus */}
            <div className="mt-7 flex items-center gap-3">
              <div className="h-[2px] w-12 rounded-full bg-[#16587B]/20" />
              <div className="w-2 h-2 rounded-full bg-[#16587B]/40" />
              <div className="h-[2px] w-12 rounded-full bg-[#16587B]/20" />
            </div>
          </div>
        </div>

        {/* ══ SISI KANAN (KOTAK SELAMAT DATANG LEBAR SETENGAH & PAS SATU LAYAR) ══ */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center px-6 sm:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 border-t lg:border-t-0 lg:border-l border-[#16587B]/10 relative shadow-xl lg:shadow-none min-h-screen lg:min-h-0 lg:h-full overflow-y-auto lg:overflow-y-auto">
          <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col justify-center my-auto">
            
            {/* Header Form */}
            <div className="mb-4 text-left">
              <h2
                className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans']"
                style={{ color: COLORS.dark }}
              >
                {isSignUp ? (
                  <>Daftar <span style={{ color: COLORS.vBlue }}>Akun Baru</span></>
                ) : (
                  <>Selamat <span style={{ color: COLORS.vBlue }}>Datang Kembali</span></>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[#4F7085] mt-1">
                {isSignUp
                  ? 'Mulai lindungi ruang kreatif Anda dengan moderasi AI cerdas.'
                  : 'Masuk untuk memantau moderasi dan kesehatan konten Anda.'}
              </p>
            </div>

            {/* Akses Demo Cepat (Hanya saat Login) */}
            {!isSignUp && (
              <div
                className="mb-3.5 rounded-xl p-2.5 sm:p-3 border transition-all"
                style={{
                  background: COLORS.bgSubtle,
                  borderColor: 'rgba(22, 88, 123, 0.12)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#16587B]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    Akses Demo Cepat
                  </span>
                  <span className="text-[10px] text-[#4F7085] font-medium">Siap demonstrasi</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border text-center"
                    style={{
                      background: email === 'kalyca@sabar.com' ? COLORS.vBlue : '#FFFFFF',
                      color: email === 'kalyca@sabar.com' ? '#FFFFFF' : COLORS.vBlue,
                      borderColor: email === 'kalyca@sabar.com' ? COLORS.vBlue : 'rgba(22,88,123,0.2)',
                    }}
                  >
                    Admin Agensi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('creator')}
                    className="py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border text-center"
                    style={{
                      background: email === 'adiar@sabar.com' ? COLORS.vBlue : '#FFFFFF',
                      color: email === 'adiar@sabar.com' ? '#FFFFFF' : COLORS.vBlue,
                      borderColor: email === 'adiar@sabar.com' ? COLORS.vBlue : 'rgba(22,88,123,0.2)',
                    }}
                  >
                    Kreator Konten
                  </button>
                </div>
              </div>
            )}

            {/* Tombol Lanjutkan dengan Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl border text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer mb-3.5 bg-white"
              style={{ borderColor: 'rgba(22,88,123,0.2)' }}
            >
              <GoogleIcon />
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Garis Pembatas "ATAU EMAIL" */}
            <div className="relative flex items-center justify-center mb-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#16587B]/15" />
              </div>
              <span className="relative px-3 bg-white text-[10px] font-extrabold uppercase tracking-widest text-[#4F7085]">
                Atau Email
              </span>
            </div>

            {/* Notifikasi Error & Sukses */}
            {error && (
              <div className="mb-3 flex items-start gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-3 flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Formulir Input */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {isSignUp && (
                <InputField label="Nama Lengkap" icon={<User className="w-4 h-4" />}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </InputField>
              )}

              <InputField label="Email" icon={<Mail className="w-4 h-4" />}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                />
              </InputField>

              <InputField label="Kata Sandi" icon={<Lock className="w-4 h-4" />}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-[#84B3CE] hover:text-[#16587B] cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </InputField>

              {isSignUp && (
                <InputField label="Konfirmasi Sandi" icon={<Lock className="w-4 h-4" />}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </InputField>
              )}

              {/* Ingat Saya & Lupa Password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#16587B] accent-[#16587B] cursor-pointer"
                  />
                  <span className="text-xs text-[#4F7085]">Ingat saya</span>
                </label>
                {!isSignUp && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Silakan hubungi administrator: admin@sabar.com untuk reset password.');
                    }}
                    className="text-xs font-semibold text-[#16587B] hover:underline"
                  >
                    Lupa Password?
                  </a>
                )}
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 mt-1"
                style={{
                  background: COLORS.vBlue,
                  color: COLORS.merino,
                }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Buat Akun Sekarang' : 'Masuk ke Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Masuk / Daftar */}
            <div className="mt-3.5 text-center text-xs text-[#4F7085]">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold cursor-pointer hover:underline text-[#16587B]"
              >
                {isSignUp ? 'Masuk di sini' : 'Daftar gratis'}
              </button>
            </div>

            {/* Footer Copyright Ringkas */}
            <div className="mt-3 pt-2 border-t border-[#16587B]/10 text-center text-[10px] text-[#4F7085]/60">
              © 2026 SABAR — Sistem Moderasi Berbasis AI Bahasa Indonesia
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
