import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  Shield,
  Brain,
  Eye,
  TrendingUp,
  Zap,
  Heart,
  Star,
  Play,
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

// ─── CUSTOM SOCIAL ICONS ───────────────────────────────────────────────────
const InstagramIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.23 8.23 0 004.81 1.54V6.88a4.85 4.85 0 01-1.04-.19z"/>
  </svg>
);

// ─── KONSTANTA WARNA SABAR (TEMA CERAH, ADEM & ELEGAN) ────────────────────
const COLORS = {
  vBlue: '#16587B',         // Venice Blue (Primary Accent & Key Headings)
  rockBlue: '#2A6E94',      // Rock Blue Darker Accent for Contrast
  rockBlueLight: '#84B3CE', // Rock Blue Light Accent
  merino: '#F5EEDD',        // Merino Warm Cream
  bg: '#FAF7F2',            // Background Utama: Cerah & Adem (Soft Warm Cream White)
  bgCard: '#FFFFFF',        // Background Card: Crisp Clean Pure White
  bgCardSubtle: '#F2EDE4',   // Background Card Soft Merino Tint
  bgBorder: 'rgba(22, 88, 123, 0.15)', // Light Venice Blue Border
  textHeading: '#16587B',   // Text Judul Utama
  textDark: '#0D2738',      // Text Body/Content (Rich Ocean Slate)
  textMuted: '#4F7085',     // Text Subtitle/Keterangan Muted
};

// ─── ANIMASI VARIANTS ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.3, duration: 1.2 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

// ─── MENU NAVIGASI ─────────────────────────────────────────────────────────
const menuItems = [
  { name: 'Fitur', href: '#fitur' },
  { name: 'Cara Kerja', href: '#cara-kerja' },
  { name: 'Demo AI', href: '#demo' },
  { name: 'Tentang', href: '#tentang' },
];

// ─── KOMPONEN HERO HEADER (Navbar Cerah & Kontras) ─────────────────────────
const HeroHeader = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
      <nav
        className={cn(
          'mx-auto mt-3 transition-all duration-500 rounded-full border shadow-md',
          scrolled
            ? 'max-w-4xl border-[#16587B]/20 bg-white/95 backdrop-blur-xl shadow-lg shadow-[#16587B]/10 px-6 py-2'
            : 'max-w-6xl border-[#16587B]/15 bg-white/85 backdrop-blur-md px-6 py-2.5'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl bg-[#16587B] flex items-center justify-center shadow-md shadow-[#16587B]/30 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-[#F5EEDD]" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#84B3CE] border-2 border-white" />
            </div>
            <span className="text-lg font-extrabold tracking-wider text-[#16587B] font-['Plus_Jakarta_Sans']">SABAR</span>
          </a>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm font-semibold text-[#16587B]/80 hover:text-[#16587B] transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Tombol CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLoginClick}
              className="text-[#16587B] font-bold hover:bg-[#F5EEDD]/80"
            >
              Masuk
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onLoginClick}
              className="bg-[#16587B] text-[#F5EEDD] hover:bg-[#0e3f59] font-bold shadow-md shadow-[#16587B]/20 rounded-full px-5"
            >
              Daftar Gratis
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Hamburger Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-[#16587B] hover:text-[#0e3f59]"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-t border-[#16587B]/15 mt-3 pt-3 pb-2 space-y-3"
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold text-[#16587B] hover:text-[#0e3f59] py-1 px-2"
              >
                {item.name}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={onLoginClick} className="flex-1 font-bold border-[#16587B]/30 text-[#16587B]">
                Masuk
              </Button>
              <Button variant="default" size="sm" onClick={onLoginClick} className="flex-1 font-bold bg-[#16587B] text-[#F5EEDD]">
                Daftar Gratis
              </Button>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

// ─── STATS ANGKA ───────────────────────────────────────────────────────────
const stats = [
  { value: '99.2%', label: 'Akurasi Deteksi AI' },
  { value: '3 Platform', label: 'Instagram, YouTube & TikTok' },
  { value: '<2 Detik', label: 'Waktu Moderasi Real-time' },
  { value: '24/7', label: 'Perlindungan Mental Aktif' },
];

// ─── FITUR UTAMA ───────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'Deteksi AI Cerdas',
    desc: 'Algoritma cerdas mendeteksi komentar toksik, sarkasme halus, dan cyberbullying secara real-time dengan presisi tinggi.',
  },
  {
    icon: Shield,
    title: 'Moderasi Otomatis',
    desc: 'Komentar berbahaya otomatis disembunyikan di Instagram, ditahan di YouTube, dan dicegat di TikTok tanpa perlu Anda baca.',
  },
  {
    icon: Heart,
    title: 'Asisten Rehat Mental',
    desc: 'Pengukur stres berbasis AI yang memantau kondisi psikologis kreator dan memberikan rekomendasi waktu istirahat yang adem.',
  },
  {
    icon: Eye,
    title: 'Dashboard Terpadu',
    desc: 'Pantau komentar dari 3 platform sekaligus dalam satu tampilan modern dengan visualisasi sentimen dan log moderasi.',
  },
  {
    icon: Zap,
    title: 'Notifikasi Instan',
    desc: 'Peringatan segera ketika serangan komentar negatif terdeteksi di postingan Anda, menjaga fokus karya Anda tetap tenang.',
  },
  {
    icon: TrendingUp,
    title: 'Analitik Sentimen',
    desc: 'Laporan tren sentimen berkala untuk memahami interaksi audiens secara strategis dan menjaga reputasi akun.',
  },
];

// ─── PLATFORM BADGES ───────────────────────────────────────────────────────
const platforms = [
  { name: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
  { name: 'YouTube', icon: YoutubeIcon, color: '#FF0000' },
  { name: 'TikTok', icon: TikTokIcon, color: '#111827' },
];

// ─── TESTIMONIAL ───────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Rizky Pratama',
    handle: '@rizkycreates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    text: 'SABAR benar-benar mengubah cara saya mengelola komentar. Dulu stres setiap hari baca hate comment, sekarang AI yang jaga!',
    stars: 5,
  },
  {
    name: 'Aulia Fitri',
    handle: '@aulia.lifestyle',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    text: 'Fitur Asisten Rehat sangat membantu kesehatan mental saya saat kampanye medsos sedang viral. Benar-benar menenangkan!',
    stars: 5,
  },
  {
    name: 'Daffa Ramadhan',
    handle: '@daffa_tech',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    text: 'Moderasi 3 platform sekaligus dalam 1 tempat sangat efisien. Hasil penapisan 99% akurat memfilter ujaran kebencian.',
    stars: 5,
  },
];

// ─── MAIN LANDING PAGE ─────────────────────────────────────────────────────
export default function LandingPage({ onLoginClick }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden font-sans text-slate-800"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* ── Navbar ── */}
      <HeroHeader onLoginClick={onLoginClick} />

      {/* ── HERO SECTION ── */}
      <main className="relative overflow-hidden">
        {/* Ambient Soft Glowing Background (Adem & Light) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top Spotlight Warm Beam */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-60"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, rgba(132,179,206,0.3) 0%, rgba(245,238,221,0.5) 50%, transparent 80%)`,
              filter: 'blur(60px)',
            }}
          />

          {/* Ambient Soft Orbs */}
          <div
            className="absolute top-32 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, rgba(132,179,206,0.4) 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
          />
          <div
            className="absolute top-48 -right-40 w-[500px] h-[500px] rounded-full opacity-25"
            style={{
              background: `radial-gradient(circle, rgba(22,88,123,0.2) 0%, transparent 70%)`,
              filter: 'blur(80px)',
            }}
          />

          {/* Subtle Transparent SABAR Shield Vector Aura */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[340px] h-[380px] sm:w-[460px] sm:h-[500px] opacity-10 flex items-center justify-center">
            <svg
              viewBox="0 0 100 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-[#16587B]"
            >
              <path
                d="M50 5 C62 5, 84 10, 88 18 C92 35, 92 60, 50 102 C8 60, 8 35, 12 18 C16 10, 38 5, 50 5 Z"
                fill="currentColor"
                stroke="#16587B"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Soft Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${COLORS.vBlue} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.vBlue} 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 100%)',
            }}
          />
        </div>

        {/* ── Hero Content (Geser Maju ke Atas & Bebas Badge Powered By) ── */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col items-center gap-6"
              >
                {/* Heading Utama */}
                <motion.h1
                  variants={fadeUp}
                  className="max-w-4xl text-balance font-extrabold leading-[1.15] tracking-tight font-['Plus_Jakarta_Sans']"
                  style={{
                    fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
                    color: COLORS.textHeading,
                  }}
                >
                  Lindungi Kreator dari{' '}
                  <span
                    className="relative inline-block px-1"
                    style={{ color: COLORS.vBlue }}
                  >
                    Cyberbullying
                    <span
                      className="absolute bottom-1 left-0 right-0 h-2.5 rounded-md -z-10"
                      style={{
                        backgroundColor: `${COLORS.rockBlueLight}40`,
                      }}
                    />
                  </span>{' '}
                  dengan Kecerdasan Buatan
                </motion.h1>

                {/* Sub-heading */}
                <motion.p
                  variants={fadeUp}
                  className="max-w-2xl text-base sm:text-lg leading-relaxed font-medium"
                  style={{ color: COLORS.textMuted }}
                >
                  SABAR adalah sistem moderasi berbasis AI yang secara otomatis mendeteksi,
                  menganalisis, dan menangani komentar negatif di Instagram, YouTube, dan
                  TikTok — menjaga kesehatan mental kreator konten Indonesia.
                </motion.p>

                {/* Platform Badges */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap justify-center pt-2">
                  {platforms.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold border bg-white shadow-2xs transition-transform hover:scale-105"
                      style={{
                        borderColor: COLORS.bgBorder,
                        color: COLORS.textDark,
                      }}
                    >
                      <p.icon size={15} color={p.color} />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center pt-3">
                  <button
                    onClick={onLoginClick}
                    className="flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 shadow-lg shadow-[#16587B]/25 hover:shadow-xl hover:shadow-[#16587B]/35 hover:-translate-y-0.5 cursor-pointer"
                    style={{ backgroundColor: COLORS.vBlue, color: COLORS.merino }}
                  >
                    <span>Mulai Sekarang — Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#demo"
                    className="flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold border transition-all duration-300 bg-white hover:bg-[#F5EEDD]/50 shadow-2xs"
                    style={{ borderColor: `${COLORS.vBlue}40`, color: COLORS.vBlue }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lihat Demo AI</span>
                  </a>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-6 pt-10 w-full max-w-4xl border-t"
                  style={{ borderColor: COLORS.bgBorder }}
                >
                  {stats.map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-2xl bg-white/70 border border-[#16587B]/10 shadow-2xs">
                      <div
                        className="text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']"
                        style={{ color: COLORS.vBlue }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs font-semibold mt-1" style={{ color: COLORS.textMuted }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FITUR SECTION ── */}
        <section id="fitur" className="relative py-20 md:py-28 bg-[#F4EFE6]/60 border-y border-[#16587B]/10">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="text-center mb-14"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-3 border shadow-2xs"
                  style={{ color: COLORS.vBlue, backgroundColor: COLORS.merino, borderColor: COLORS.bgBorder }}
                >
                  Fitur Unggulan
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-4xl font-extrabold mb-3 font-['Plus_Jakarta_Sans']"
                style={{ color: COLORS.vBlue }}
              >
                Teknologi AI Terdepan untuk Pelindung Medsos
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base font-medium" style={{ color: COLORS.textMuted }}>
                Dari penapisan otomatis hingga pemantauan kesehatan mental, SABAR hadir sebagai
                pelindung digital yang ramah dan menenangkan.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl p-7 border bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#16587B]/10"
                  style={{
                    borderColor: COLORS.bgBorder,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-2xs"
                    style={{ backgroundColor: `${COLORS.rockBlueLight}30`, border: `1px solid ${COLORS.vBlue}20` }}
                  >
                    <f.icon className="w-6 h-6" style={{ color: COLORS.vBlue }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.textMuted }}>
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CARA KERJA / HOW IT WORKS ── */}
        <section id="cara-kerja" className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-4 border shadow-2xs"
                  style={{ color: COLORS.vBlue, backgroundColor: COLORS.merino, borderColor: COLORS.bgBorder }}
                >
                  Cara Kerja
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-snug font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                  Sistem Penapisan AI yang Bekerja Cerdas &amp; Adem
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Hubungkan Akun Sosial Media',
                      desc: 'Sambungkan akun Instagram, YouTube, atau TikTok Anda ke sistem SABAR secara aman dalam hitungan detik.',
                    },
                    {
                      step: '02',
                      title: 'AI Menganalisis Secara Real-Time',
                      desc: 'Komentar masuk dianalisis instan untuk menilai skor toksisitas, sentimen, dan tingkat sarkasme.',
                    },
                    {
                      step: '03',
                      title: 'Moderasi Otomatis & Rehat Tenang',
                      desc: 'Ujaran negatif langsung diredam dari publik. Anda cukup menikmati ruang karya yang aman dan nyaman.',
                    },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 p-4 rounded-2xl bg-white border border-[#16587B]/10 shadow-2xs">
                      <div
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold shadow-2xs"
                        style={{ backgroundColor: COLORS.vBlue, color: COLORS.merino }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-base mb-1 font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>{s.title}</h4>
                        <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.textMuted }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Visual Platform Integration */}
              <motion.div variants={fadeUp} className="relative">
                <div
                  className="rounded-3xl border p-8 bg-white shadow-xl shadow-[#16587B]/5 relative overflow-hidden"
                  style={{ borderColor: COLORS.bgBorder }}
                >
                  <div className="relative text-center mb-8">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 shadow-md"
                      style={{ backgroundColor: COLORS.vBlue }}
                    >
                      <Shield className="w-8 h-8 text-[#F5EEDD]" />
                    </div>
                    <h3 className="font-extrabold text-xl font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>SABAR AI Core</h3>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: COLORS.textMuted }}>Sistem Moderasi Medsos Berbasis NLP</p>
                  </div>

                  {/* Platform Connected Badges */}
                  <div className="grid grid-cols-3 gap-4">
                    {platforms.map((p) => (
                      <div key={p.name} className="text-center p-3 rounded-xl bg-[#FAF7F2] border border-[#16587B]/10">
                        <div
                          className="mx-auto w-10 h-10 rounded-lg flex items-center justify-center mb-1.5 shadow-2xs"
                          style={{ backgroundColor: '#FFFFFF' }}
                        >
                          <p.icon size={20} color={p.color} />
                        </div>
                        <p className="text-xs font-bold" style={{ color: COLORS.textDark }}>{p.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Live Stats Preview */}
                  <div
                    className="mt-6 rounded-2xl p-4 space-y-3 bg-[#FAF7F2] border border-[#16587B]/10"
                  >
                    {[
                      { label: 'Komentar Dianalisis', value: '2,847', trend: 'Real-time' },
                      { label: 'Toksik Dicegah', value: '183', trend: 'Otomatis' },
                      { label: 'Indeks Rehat Mental', value: '87/100', trend: 'Sangat Baik' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between text-xs font-medium">
                        <span style={{ color: COLORS.textMuted }}>{stat.label}</span>
                        <div className="text-right">
                          <span className="font-bold text-sm" style={{ color: COLORS.vBlue }}>{stat.value}</span>
                          <span className="text-[11px] ml-2 text-emerald-700 font-bold">({stat.trend})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIAL SECTION ── */}
        <section id="tentang" className="py-20 md:py-28 bg-[#F4EFE6]/60 border-y border-[#16587B]/10">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-14"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 mb-3 border shadow-2xs"
                  style={{ color: COLORS.vBlue, backgroundColor: COLORS.merino, borderColor: COLORS.bgBorder }}
                >
                  Testimoni Kreator
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>
                Kreator yang Telah Terlindungi &amp; Merasa Tenang
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  className="rounded-2xl border p-6 bg-white shadow-sm hover:shadow-lg transition-all"
                  style={{ borderColor: COLORS.bgBorder }}
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 font-medium" style={{ color: COLORS.textDark }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[#16587B]/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#16587B]/20"
                    />
                    <div>
                      <p className="text-sm font-bold font-['Plus_Jakarta_Sans']" style={{ color: COLORS.vBlue }}>{t.name}</p>
                      <p className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>{t.handle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA BANNER SECTION (Warna Venice Blue Mewah) ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden shadow-2xl shadow-[#16587B]/25"
              style={{
                background: `linear-gradient(135deg, ${COLORS.vBlue} 0%, #1A668E 50%, #2A6E94 100%)`,
              }}
            >
              {/* Subtle Ambient Light Circle */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${COLORS.merino}, transparent)`, filter: 'blur(50px)' }}
              />

              <motion.div variants={fadeUp} className="relative z-10">
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-lg bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <Shield className="w-7 h-7 text-[#F5EEDD]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#F5EEDD] font-['Plus_Jakarta_Sans']">
                  Siap Memulai Perjalanan Kreator yang Lebih Sehat &amp; Tenang?
                </h2>
                <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto text-[#F5EEDD]/90 font-medium">
                  Bergabunglah dengan ribuan kreator Indonesia yang sudah terlindungi oleh sistem SABAR.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={onLoginClick}
                    className="flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-extrabold transition-all duration-300 bg-[#F5EEDD] text-[#16587B] hover:bg-white shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <span>Mulai Sekarang — Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="border-t py-8 bg-[#F4EFE6]"
          style={{ borderColor: COLORS.bgBorder }}
        >
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#16587B]"
              >
                <Shield className="w-3.5 h-3.5 text-[#F5EEDD]" />
              </div>
              <span className="font-extrabold tracking-wider text-base text-[#16587B] font-['Plus_Jakarta_Sans']">SABAR</span>
              <span className="text-xs font-semibold text-[#4F7085] ml-2 hidden sm:inline">
                Sistem Analisis Bullying &amp; Asisten Rehat
              </span>
            </div>
            <p className="text-xs font-semibold text-[#4F7085]">
              © 2026 SABAR · KMIPN · Dibuat dengan ❤ untuk Kreator Indonesia
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
