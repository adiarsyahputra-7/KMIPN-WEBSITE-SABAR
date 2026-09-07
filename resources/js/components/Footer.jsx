import React from 'react';
import {
  CheckCircle2,
  Zap,
  Shield,
  Heart,
  ArrowRight,
} from 'lucide-react';

// ─── CUSTOM SOCIAL ICONS ───────────────────────────────────────────────────
const InstagramIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.23 8.23 0 004.81 1.54V6.88a4.85 4.85 0 01-1.04-.19z" />
  </svg>
);

export default function Footer({ onLoginClick }) {
  return (
    <footer className="relative border-t bg-[#103A52] text-[#F5EEDD] pt-16 pb-10 overflow-hidden" style={{ borderColor: 'rgba(22, 88, 123, 0.25)' }}>
      {/* Subtle Ambient Light Glow */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #84B3CE 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Top Brand & Tagline Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#84B3CE]/30 flex items-center justify-center shadow-md bg-[#1a4065]">
            <img 
              src="/sabar-logo-cropped.png" 
              alt="Logo SABAR" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-wider text-[#F5EEDD] font-['Plus_Jakarta_Sans']">
              SABAR
            </span>
            <span className="text-xs text-[#84B3CE] ml-2.5 font-medium hidden sm:inline">
              · Sistem Analisis Bullying &amp; Asisten Rehat
            </span>
          </div>
        </div>

        {/* Main Content Grid: 3 Kolom Navigasi Kiri + Kolom Newsletter & Helpline Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#84B3CE]/20">
          
          {/* Kolom Kiri: 3 Sub-Kolom Link & Badges (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Kolom 1: Tentang Kami */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[#F5EEDD] uppercase tracking-wider">
                Tentang Kami
              </h4>
              <ul className="space-y-2.5 text-xs text-[#CFE2ED]">
                <li><a href="#tentang" className="hover:text-white transition-colors">Tim Pengembang</a></li>
                <li><a href="#tentang" className="hover:text-white transition-colors">Latar Belakang SABAR</a></li>
                <li><a href="#tentang" className="hover:text-white transition-colors">KMIPN 2026 Official</a></li>
                <li><a href="#tentang" className="hover:text-white transition-colors">Etika &amp; Privasi AI</a></li>
              </ul>
            </div>

            {/* Kolom 2: Fitur & Solusi */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[#F5EEDD] uppercase tracking-wider">
                Fitur &amp; Solusi
              </h4>
              <ul className="space-y-2.5 text-xs text-[#CFE2ED]">
                <li><a href="#fitur" className="hover:text-white transition-colors">Deteksi Cyberbullying</a></li>
                <li><a href="#fitur" className="hover:text-white transition-colors">Asisten Rehat Mental</a></li>
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Moderasi Instagram</a></li>
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Moderasi YouTube &amp; TikTok</a></li>
              </ul>
            </div>

            {/* Kolom 3: Hubungi Kami */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[#F5EEDD] uppercase tracking-wider">
                Hubungi Kami
              </h4>
              <div className="space-y-2.5 text-xs text-[#CFE2ED]">
                <p className="hover:text-white transition-colors cursor-pointer font-medium">Kontak Tim SABAR</p>
                <p className="text-[11px] leading-relaxed text-[#84B3CE]">
                  Gedung TI, Kampus Politeknik Negeri,<br />Jawa Timur, Indonesia
                </p>
                {/* Social Media Icons */}
                <div className="flex items-center gap-2 pt-2">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="w-8 h-8 rounded-lg bg-[#0B2738] border border-[#84B3CE]/20 flex items-center justify-center hover:bg-[#16587B] hover:border-[#84B3CE] transition-all">
                    <InstagramIcon size={15} color="#F5EEDD" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" className="w-8 h-8 rounded-lg bg-[#0B2738] border border-[#84B3CE]/20 flex items-center justify-center hover:bg-[#16587B] hover:border-[#84B3CE] transition-all">
                    <YoutubeIcon size={15} color="#F5EEDD" />
                  </a>
                  <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok" className="w-8 h-8 rounded-lg bg-[#0B2738] border border-[#84B3CE]/20 flex items-center justify-center hover:bg-[#16587B] hover:border-[#84B3CE] transition-all">
                    <TikTokIcon size={15} color="#F5EEDD" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Badges Bar (Sesuai 3 logo verifikasi di HelpGuide.org) */}
            <div className="sm:col-span-3 pt-6 flex flex-wrap items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-[#0B2738] border border-[#84B3CE]/25 text-[11px] font-bold text-[#F5EEDD] flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>KMIPN 2026 Verified</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0B2738] border border-[#84B3CE]/25 text-[11px] font-bold text-[#F5EEDD] flex items-center gap-2 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Gemini 3.6 Flash Engine</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0B2738] border border-[#84B3CE]/25 text-[11px] font-bold text-[#F5EEDD] flex items-center gap-2 shadow-2xs">
                <Shield className="w-4 h-4 text-[#84B3CE]" />
                <span>MaaS v1.0 Security</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Newsletter & Mental Health Helplines (lg:col-span-5) */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#84B3CE]/20 lg:pl-10 space-y-7">
            
            {/* Section 1: Join Our Newsletter */}
            <div className="space-y-3">
              <h4 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[#F5EEDD]">
                Berlangganan Tips &amp; Edukasi
              </h4>
              <p className="text-xs text-[#CFE2ED] leading-relaxed">
                Dapatkan tips kesehatan mental digital, panduan moderasi anti-bullying terbaru, dan pembaruan sistem langsung ke email Anda.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Terima kasih telah berlangganan newsletter SABAR!'); }} className="flex gap-2 pt-1">
                <input
                  type="email"
                  required
                  placeholder="Alamat Email Anda"
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-[#0B2738] border border-[#84B3CE]/30 text-white placeholder:text-[#84B3CE]/60 focus:outline-none focus:border-[#F5EEDD] transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#16587B] hover:bg-[#1D6C96] text-xs font-extrabold text-[#F5EEDD] border border-[#84B3CE]/40 transition-all cursor-pointer whitespace-nowrap shadow-sm hover:scale-105"
                >
                  Daftar
                </button>
              </form>
            </div>

            {/* Section 2: Mental Health Helplines / Asisten Rehat */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0B2738] border border-[#84B3CE]/25 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[#F5EEDD]">
                  Layanan Rehat &amp; Bantuan Mental
                </h4>
              </div>
              <p className="text-xs text-[#CFE2ED] leading-relaxed">
                Merasa tertekan, cemas, atau lelah akibat komentar negatif di media sosial? Akses panduan rehat dan asisten relaksasi kami.
              </p>
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F5EEDD] hover:bg-white text-xs font-extrabold text-[#16587B] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              >
                <span>Dapatkan Bantuan Rehat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Kredit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#84B3CE]">
          <p>© 2026 SABAR · Sistem Moderation-as-a-Service Berbasis Context-Aware NLP.</p>
          <p>Dibuat dengan dedikasi untuk Kreator &amp; Ekosistem Digital Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
