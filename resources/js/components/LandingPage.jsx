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
import { AnimatedGroup } from './ui/AnimatedGroup';
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

// ─── KONSTANTA WARNA SABAR ─────────────────────────────────────────────────
const COLORS = {
  vBlue: '#16587B',
  rockBlue: '#84B3CE',
  merino: '#F5EEDD',
  bg: '#060E1A',       // Dark Navy Ultra
  bgCard: '#0D1E30',   // Dark Navy Card
  bgBorder: 'rgba(132,179,206,0.15)',
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
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

// ─── MENU NAVIGASI ─────────────────────────────────────────────────────────
const menuItems = [
  { name: 'Fitur', href: '#fitur' },
  { name: 'Cara Kerja', href: '#cara-kerja' },
  { name: 'Demo AI', href: '#demo' },
  { name: 'Tentang', href: '#tentang' },
];



// ─── KOMPONEN HERO HEADER (Navbar) ─────────────────────────────────────────
const HeroHeader = ({ onLoginClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={cn(
          'mx-auto mt-3 px-4 transition-all duration-500',
          scrolled
            ? 'max-w-4xl rounded-2xl border border-[rgba(132,179,206,0.2)] bg-[rgba(6,14,26,0.85)] backdrop-blur-xl shadow-xl shadow-black/30 px-6'
            : 'max-w-7xl'
        )}
      >
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-[#16587B] flex items-center justify-center shadow-lg shadow-[#16587B]/40 group-hover:shadow-[#16587B]/70 transition-shadow">
              <Shield className="w-4 h-4 text-[#F5EEDD]" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#84B3CE] border-2 border-[#060E1A]" />
            </div>
            <span className="text-lg font-bold tracking-wider text-[#F5EEDD]">SABAR</span>
          </a>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm text-[#84B3CE] hover:text-[#F5EEDD] transition-colors duration-200"
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
              className={cn(scrolled ? 'hidden' : 'flex')}
            >
              Masuk
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onLoginClick}
              className="shadow-md"
            >
              {scrolled ? 'Mulai Sekarang' : 'Daftar Gratis'}
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Hamburger Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-[#84B3CE] hover:text-[#F5EEDD]"
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
            className="lg:hidden border-t border-[rgba(132,179,206,0.15)] py-4 space-y-4"
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-[#84B3CE] hover:text-[#F5EEDD] transition-colors py-1"
              >
                {item.name}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={onLoginClick} className="flex-1">
                Masuk
              </Button>
              <Button variant="default" size="sm" onClick={onLoginClick} className="flex-1">
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
  { value: '3', label: 'Platform Terintegrasi' },
  { value: '<2s', label: 'Waktu Analisis' },
  { value: '24/7', label: 'Perlindungan Aktif' },
];

// ─── FITUR UTAMA ───────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'Deteksi AI Cerdas',
    desc: 'Gemini 3.6 Flash mendeteksi komentar toksik, sarkasme halus, dan cyberbullying secara real-time dengan akurasi tinggi.',
    color: '#16587B',
  },
  {
    icon: Shield,
    title: 'Moderasi Otomatis',
    desc: 'Komentar berbahaya otomatis disembunyikan di Instagram, ditahan di YouTube, dan dicegat di TikTok tanpa intervensi manual.',
    color: '#16587B',
  },
  {
    icon: Heart,
    title: 'Asisten Rehat',
    desc: 'Pengukur stres mental berbasis AI yang memantau kondisi psikologis kreator dan memberikan rekomendasi rehat tepat waktu.',
    color: '#16587B',
  },
  {
    icon: Eye,
    title: 'Dashboard Terpadu',
    desc: 'Pantau semua komentar dari 3 platform dalam satu layar dengan visualisasi sentimen, skor toksisitas, dan log moderasi.',
    color: '#16587B',
  },
  {
    icon: Zap,
    title: 'Notifikasi Instan',
    desc: 'Dapatkan peringatan segera ketika ada komentar toksik muncul di postingan Anda, bahkan saat Anda sedang offline.',
    color: '#16587B',
  },
  {
    icon: TrendingUp,
    title: 'Analitik Mendalam',
    desc: 'Laporan tren sentimen mingguan dan bulanan untuk memahami pola komentar audiens Anda secara lebih strategis.',
    color: '#16587B',
  },
];

// ─── PLATFORM BADGES ───────────────────────────────────────────────────────
const platforms = [
  { name: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
  { name: 'YouTube', icon: YoutubeIcon, color: '#FF0000' },
  { name: 'TikTok', icon: TikTokIcon, color: '#F5EEDD' },
];

// ─── TESTIMONIAL ───────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Rizky Pratama',
    handle: '@rizkycreates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    text: 'SABAR benar-benar mengubah cara saya mengelola komentar. Dulu stres setiap hari baca hate comment, sekarang AI yang tangani!',
    stars: 5,
  },
  {
    name: 'Aulia Fitri',
    handle: '@aulialifestyle',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    text: 'Fitur Asisten Rehat mengingatkan saya untuk istirahat ketika skor stres tinggi. Sangat membantu menjaga kesehatan mental!',
    stars: 5,
  },
  {
    name: 'Dimas Satria',
    handle: '@dimasgaming',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80',
    text: 'Sebagai gamer yang sering di-toxic, SABAR adalah solusi terbaik. Otomatis hide komentar haters sebelum mereka sempat merusak mood.',
    stars: 5,
  },
];

// ─── MAIN LANDING PAGE ─────────────────────────────────────────────────────
export default function LandingPage({ onLoginClick }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: COLORS.bg, color: COLORS.merino }}
    >
      {/* ── Navbar ── */}
      <HeroHeader onLoginClick={onLoginClick} />

      {/* ── HERO SECTION ── */}
      <main className="relative overflow-hidden">
        {/* ── Ambient Glow & Glowing Shield Background ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top Spotlight Beam */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] opacity-35"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${COLORS.rockBlue}40 0%, ${COLORS.vBlue}25 45%, transparent 80%)`,
              filter: 'blur(50px)',
            }}
          />

          {/* Glowing Ambient Light Orbs */}
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${COLORS.merino}30 0%, ${COLORS.vBlue}50 40%, transparent 70%)`,
              filter: 'blur(90px)',
              animationDuration: '6s',
            }}
          />
          <div
            className="absolute top-40 -left-40 w-[550px] h-[550px] rounded-full opacity-15"
            style={{
              background: `radial-gradient(ellipse at center, ${COLORS.rockBlue} 0%, transparent 70%)`,
              filter: 'blur(70px)',
            }}
          />
          <div
            className="absolute top-60 -right-40 w-[550px] h-[550px] rounded-full opacity-15"
            style={{
              background: `radial-gradient(ellipse at center, ${COLORS.vBlue} 0%, transparent 70%)`,
              filter: 'blur(70px)',
            }}
          />

          {/* Central SABAR Shield Silhouette Aura (Perisai Proteksi Transparan) */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[340px] h-[380px] sm:w-[460px] sm:h-[500px] lg:w-[540px] lg:h-[580px] opacity-15 flex items-center justify-center">
            <svg
              viewBox="0 0 100 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_35px_rgba(132,179,206,0.5)]"
            >
              <defs>
                <linearGradient id="shieldHeroGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F4EAD2" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#84B3CE" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#16587B" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="shieldHeroBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4EAD2" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#84B3CE" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M50 5 C62 5, 84 10, 88 18 C92 35, 92 60, 50 102 C8 60, 8 35, 12 18 C16 10, 38 5, 50 5 Z"
                fill="url(#shieldHeroGlow)"
                stroke="url(#shieldHeroBorder)"
                strokeWidth="1.5"
              />
              <path
                d="M 50,14 C 40,24 30,35 24,52 C 20,64 24,78 34,86 C 42,92 50,96 50,96 C 50,96 42,88 38,76 C 35,66 38,54 44,44 Z"
                fill="#F4EAD2"
                fillOpacity="0.25"
              />
            </svg>
          </div>

          {/* Cyber Grid Mesh Pattern dengan Gradient Fade */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(${COLORS.rockBlue} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.rockBlue} 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 40%, transparent 100%)',
            }}
          />
        </div>


        {/* ── Hero Content ── */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col items-center gap-6"
              >
                {/* Badge Pill */}
                <motion.div variants={fadeUp}>
                  <a
                    href="#demo"
                    className="group inline-flex items-center gap-3 rounded-full border px-4 py-1.5 text-sm transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: COLORS.bgBorder,
                      backgroundColor: 'rgba(22,88,123,0.15)',
                      color: COLORS.rockBlue,
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#84B3CE]" />
                      Powered by Gemini 3.6 Flash AI · KMIPN 2026
                    </span>
                    <span className="h-3.5 w-px bg-[#84B3CE]/30" />
                    <div
                      className="flex items-center justify-center w-5 h-5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(22,88,123,0.4)' }}
                    >
                      <div className="flex gap-0 -translate-x-1/2 group-hover:translate-x-0 transition-transform duration-300 w-10">
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                        <ArrowRight className="w-3 h-3 flex-shrink-0" />
                      </div>
                    </div>
                  </a>
                </motion.div>

                {/* Heading Utama */}
                <motion.h1
                  variants={fadeUp}
                  className="max-w-5xl text-balance font-bold leading-tight"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: COLORS.merino,
                  }}
                >
                  Lindungi Kreator dari{' '}
                  <span
                    className="relative inline-block"
                    style={{ color: COLORS.rockBlue }}
                  >
                    Cyberbullying
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${COLORS.vBlue}, transparent)`,
                      }}
                    />
                  </span>{' '}
                  dengan Kecerdasan Buatan
                </motion.h1>

                {/* Sub-heading */}
                <motion.p
                  variants={fadeUp}
                  className="max-w-2xl text-lg leading-relaxed"
                  style={{ color: `${COLORS.rockBlue}CC` }}
                >
                  SABAR adalah sistem moderasi berbasis AI yang secara otomatis mendeteksi,
                  menganalisis, dan menangani komentar negatif di Instagram, YouTube, dan
                  TikTok — menjaga kesehatan mental kreator konten Indonesia.
                </motion.p>

                {/* Platform Badges */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap justify-center">
                  {platforms.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border"
                      style={{
                        borderColor: COLORS.bgBorder,
                        backgroundColor: 'rgba(13,30,48,0.8)',
                        color: COLORS.merino,
                      }}
                    >
                      <p.icon size={14} style={{ color: p.color }} />
                      {p.name}
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-center">
                  <div
                    className="rounded-[14px] p-0.5"
                    style={{ background: `linear-gradient(135deg, ${COLORS.vBlue}, ${COLORS.rockBlue})` }}
                  >
                    <button
                      onClick={onLoginClick}
                      className="flex items-center gap-2 rounded-[12px] px-6 py-3 text-base font-semibold transition-all duration-300 hover:gap-3"
                      style={{ backgroundColor: COLORS.vBlue, color: COLORS.merino }}
                    >
                      Mulai Sekarang — Gratis
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <a
                    href="#demo"
                    className="flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium transition-all duration-300 hover:bg-white/5"
                    style={{ color: COLORS.rockBlue }}
                  >
                    <Play className="w-4 h-4" />
                    Lihat Demo
                  </a>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-4 pt-8 w-full max-w-3xl"
                  style={{ borderTop: `1px solid ${COLORS.bgBorder}` }}
                >
                  {stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <div
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: COLORS.rockBlue }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs mt-1" style={{ color: `${COLORS.merino}80` }}>
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
        <section id="fitur" className="relative py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-4"
                  style={{ color: COLORS.rockBlue, backgroundColor: 'rgba(22,88,123,0.15)', border: `1px solid ${COLORS.bgBorder}` }}
                >
                  Fitur Unggulan
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ color: COLORS.merino }}
              >
                Teknologi AI Terdepan untuk Kreator
              </motion.h2>
              <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-lg" style={{ color: `${COLORS.rockBlue}CC` }}>
                Dari deteksi otomatis hingga laporan analitik mendalam, SABAR hadir sebagai
                pelindung digital yang tidak pernah tidur.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl p-6 border transition-all duration-300"
                  style={{
                    backgroundColor: COLORS.bgCard,
                    borderColor: COLORS.bgBorder,
                  }}
                >
                  {/* Hover Glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at top left, rgba(22,88,123,0.15) 0%, transparent 60%)`,
                    }}
                  />
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: 'rgba(22,88,123,0.25)', border: `1px solid rgba(22,88,123,0.4)` }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: COLORS.rockBlue }} />
                  </div>
                  <h3 className="relative text-lg font-semibold mb-2" style={{ color: COLORS.merino }}>
                    {f.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed" style={{ color: `${COLORS.rockBlue}99` }}>
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CARA KERJA / HOW IT WORKS ── */}
        <section id="cara-kerja" className="relative py-24 md:py-32">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(ellipse at center, ${COLORS.vBlue} 0%, transparent 70%)`,
            }}
          />
          <div className="mx-auto max-w-7xl px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-6"
                  style={{ color: COLORS.rockBlue, backgroundColor: 'rgba(22,88,123,0.15)', border: `1px solid ${COLORS.bgBorder}` }}
                >
                  Cara Kerja
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug" style={{ color: COLORS.merino }}>
                  AI Moderasi yang Bekerja Secara{' '}
                  <span style={{ color: COLORS.rockBlue }}>Otonom & Cerdas</span>
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Hubungkan Akun',
                      desc: 'Sambungkan akun Instagram, YouTube, atau TikTok Anda ke sistem SABAR hanya dalam beberapa klik.',
                    },
                    {
                      step: '02',
                      title: 'AI Menganalisis Real-Time',
                      desc: 'Setiap komentar masuk diproses oleh Gemini 3.6 Flash dan dinilai tingkat sentimen, toksisitas, dan sarkasmenya secara instan.',
                    },
                    {
                      step: '03',
                      title: 'Moderasi Otomatis',
                      desc: 'Komentar toksik langsung disembunyikan di platform asal. Anda cukup memantau laporan di Dashboard SABAR.',
                    },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'rgba(22,88,123,0.25)', color: COLORS.rockBlue, border: `1px solid rgba(22,88,123,0.4)` }}
                      >
                        {s.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: COLORS.merino }}>{s.title}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: `${COLORS.rockBlue}99` }}>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Visual Platform Integration */}
              <motion.div variants={fadeUp} className="relative">
                <div
                  className="rounded-2xl border p-8 relative overflow-hidden"
                  style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.bgBorder }}
                >
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                    style={{ background: `radial-gradient(circle, ${COLORS.vBlue}, transparent)`, filter: 'blur(40px)' }}
                  />
                  <div className="relative text-center mb-8">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                      style={{ backgroundColor: 'rgba(22,88,123,0.3)', border: `1px solid rgba(22,88,123,0.5)` }}
                    >
                      <Shield className="w-8 h-8" style={{ color: COLORS.rockBlue }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: COLORS.merino }}>SABAR AI Core</h3>
                    <p className="text-xs mt-1" style={{ color: `${COLORS.rockBlue}80` }}>Gemini 3.6 Flash · Real-time</p>
                  </div>

                  {/* Animated Connection Lines */}
                  <div className="grid grid-cols-3 gap-4">
                    {platforms.map((p) => (
                      <div key={p.name} className="text-center">
                        <div
                          className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                          style={{ backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30` }}
                        >
                          <p.icon size={22} style={{ color: p.color }} />
                        </div>
                        <p className="text-xs" style={{ color: `${COLORS.merino}80` }}>{p.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Live Stats */}
                  <div
                    className="mt-6 rounded-xl p-4 space-y-3"
                    style={{ backgroundColor: 'rgba(6,14,26,0.6)', border: `1px solid ${COLORS.bgBorder}` }}
                  >
                    {[
                      { label: 'Komentar Dianalisis', value: '2,847', trend: '+12 menit ini' },
                      { label: 'Toksik Dicegah', value: '183', trend: '6.4% dari total' },
                      { label: 'Skor Mental Anda', value: '87/100', trend: '↑ Kondisi Baik' },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: `${COLORS.rockBlue}99` }}>{stat.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold" style={{ color: COLORS.merino }}>{stat.value}</span>
                          <span className="text-xs ml-2" style={{ color: `${COLORS.rockBlue}70` }}>{stat.trend}</span>
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
        <section id="tentang" className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp}>
                <span
                  className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-4"
                  style={{ color: COLORS.rockBlue, backgroundColor: 'rgba(22,88,123,0.15)', border: `1px solid ${COLORS.bgBorder}` }}
                >
                  Testimoni
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.merino }}>
                Kreator yang Telah Terlindungi
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
                  className="rounded-2xl border p-6"
                  style={{ backgroundColor: COLORS.bgCard, borderColor: COLORS.bgBorder }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#F5EEDD' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: `${COLORS.merino}CC` }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: COLORS.merino }}>{t.name}</p>
                      <p className="text-xs" style={{ color: `${COLORS.rockBlue}80` }}>{t.handle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="relative rounded-3xl border p-12 md:p-16 text-center overflow-hidden"
              style={{ borderColor: COLORS.bgBorder, backgroundColor: COLORS.bgCard }}
            >
              {/* Background Glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${COLORS.vBlue}, transparent)`, filter: 'blur(60px)' }}
              />
              <motion.div variants={fadeUp} className="relative">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ backgroundColor: 'rgba(22,88,123,0.3)', border: `1px solid rgba(22,88,123,0.5)` }}
                >
                  <Shield className="w-8 h-8" style={{ color: COLORS.rockBlue }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.merino }}>
                  Siap Memulai Perjalanan Kreator yang Lebih Sehat?
                </h2>
                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: `${COLORS.rockBlue}CC` }}>
                  Bergabunglah dengan ribuan kreator yang sudah terlindungi. Gratis untuk memulai.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div
                    className="rounded-[14px] p-0.5"
                    style={{ background: `linear-gradient(135deg, ${COLORS.vBlue}, ${COLORS.rockBlue})` }}
                  >
                    <button
                      onClick={onLoginClick}
                      className="flex items-center gap-2 rounded-[12px] px-8 py-3.5 text-base font-semibold"
                      style={{ backgroundColor: COLORS.vBlue, color: COLORS.merino }}
                    >
                      Mulai Sekarang — Gratis
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="border-t py-10"
          style={{ borderColor: COLORS.bgBorder }}
        >
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.vBlue }}
              >
                <Shield className="w-3.5 h-3.5" style={{ color: COLORS.merino }} />
              </div>
              <span className="font-bold tracking-wider text-sm" style={{ color: COLORS.merino }}>SABAR</span>
              <span className="text-xs ml-2" style={{ color: `${COLORS.rockBlue}60` }}>
                Sistem Analisis Bullying & Asisten Rehat Digital
              </span>
            </div>
            <p className="text-xs" style={{ color: `${COLORS.rockBlue}60` }}>
              © 2026 SABAR · KMIPN · Dibuat dengan ❤ untuk Kreator Indonesia
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
