import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ExternalLink,
  Lock,
  EyeOff,
} from 'lucide-react';

// ─── CUSTOM SOCIAL ICONS ───────────────────────────────────────────────────
const InstagramIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.23 8.23 0 004.81 1.54V6.88a4.85 4.85 0 01-1.04-.19z" />
  </svg>
);

const PLATFORM_DATA = {
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    brandColor: '#E1306C',
    badge: 'Meta Graph API Webhook',
    status: 'Live Real-time Sync',
    desc: 'Komentar masuk diterima seketika melalui Meta Webhook. Jika terdeteksi perundungan, sistem langsung mengeksekusi sembunyikan komentar secara otomatis.',
    stats: { moderated: '1.240 Komentar', accuracy: '99.4%', speed: '<1.2 detik' },
    comments: [
      {
        user: '@budi_kreator',
        time: 'Baru saja',
        text: 'Penjelasan editingnya daging banget bang, sangat membantu buat pemula!',
        isToxic: false,
        sentiment: 'POSITIF',
        action: 'ALLOW',
        statusLabel: 'Aman · Live di Feed',
      },
      {
        user: '@hater_akun_palsu',
        time: '1m yang lalu',
        text: 'Muka lu jelek banget sok caper di kamera, mending hapus akun lu dasar sampah!',
        isToxic: true,
        sentiment: 'NEGATIF',
        action: 'HIDE',
        statusLabel: 'Otomatis Diredam dari Publik',
      },
      {
        user: '@lina_lifestyle',
        time: '3m yang lalu',
        text: 'Bagus banget tipsnya kak, ditunggu konten berikutnya ya!',
        isToxic: false,
        sentiment: 'POSITIF',
        action: 'ALLOW',
        statusLabel: 'Aman · Live di Feed',
      },
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: YoutubeIcon,
    brandColor: '#FF0000',
    badge: 'YouTube Data API v3',
    status: 'OAuth 2.0 Certified',
    desc: 'Memindai komentar video YouTube secara otomatis. Ujaran kebencian langsung dialihkan ke status "Ditahan untuk Ditinjau" di YouTube Studio.',
    stats: { moderated: '890 Komentar', accuracy: '99.1%', speed: '<1.5 detik' },
    comments: [
      {
        user: '@andi_tech',
        time: 'Baru saja',
        text: 'Tutorial setup kodenya sangat runtut, langsung berhasil di perangkat saya.',
        isToxic: false,
        sentiment: 'POSITIF',
        action: 'ALLOW',
        statusLabel: 'Aman · Publik',
      },
      {
        user: '@troll_netizen',
        time: '2m yang lalu',
        text: 'Dasar b3g0 gak mutu konten lu, buang-buang kuota aja bangsat!',
        isToxic: true,
        sentiment: 'NEGATIF',
        action: 'HIDE',
        statusLabel: 'Ditahan di YouTube Studio',
      },
      {
        user: '@rahma_art',
        time: '5m yang lalu',
        text: 'Keren banget animasi dan penjelasannya kak, sukses terus!',
        isToxic: false,
        sentiment: 'POSITIF',
        action: 'ALLOW',
        statusLabel: 'Aman · Publik',
      },
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: TikTokIcon,
    brandColor: '#111827',
    badge: 'TikTok Content Guard',
    status: 'Context-Aware Filter',
    desc: 'Menapis komentar TikTok dengan pemahaman leet-speak dan bahasa gaul Indonesia, mencegah serangan cyberbullying merusak kesehatan mental kreator.',
    stats: { moderated: '2.150 Komentar', accuracy: '98.9%', speed: '<1.0 detik' },
    comments: [
      {
        user: '@citra_dance',
        time: 'Baru saja',
        text: 'Vibes videonya positif banget kak, lagu sama gerakannya pas banget!',
        isToxic: false,
        sentiment: 'POSITIF',
        action: 'ALLOW',
        statusLabel: 'Aman · Publik',
      },
      {
        user: '@julid_99',
        time: '1m yang lalu',
        text: 'Gaya lu norak kampungan, jijik liatnya mending mundur aja lu!',
        isToxic: true,
        sentiment: 'NEGATIF',
        action: 'HIDE',
        statusLabel: 'Otomatis Dicegat SABAR',
      },
      {
        user: '@mabok_kuliah',
        time: '4m yang lalu',
        text: 'Mabok tugas semester akhir nih wkwk relate banget sama videonya.',
        isToxic: false,
        sentiment: 'NETRAL',
        action: 'ALLOW',
        statusLabel: 'Aman (Slang Wajar)',
      },
    ],
  },
};

export default function PlatformShowcase() {
  const [activePlatform, setActivePlatform] = useState('instagram');
  const activeData = PLATFORM_DATA[activePlatform];

  return (
    <div className="rounded-3xl border border-[#16587B]/15 bg-white shadow-xl shadow-[#16587B]/5 overflow-hidden">
      {/* ── Top Platform Navigation Tabs ── */}
      <div className="flex border-b border-[#16587B]/10 bg-[#FAF7F2] p-2 gap-2">
        {Object.entries(PLATFORM_DATA).map(([key, data]) => {
          const isSelected = activePlatform === key;
          const IconComponent = data.icon;
          return (
            <button
              key={key}
              onClick={() => setActivePlatform(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#16587B] shadow-sm border border-[#16587B]/15'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              <IconComponent size={16} color={isSelected ? data.brandColor : 'currentColor'} />
              <span>{data.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Platform Showcase Content ── */}
      <div className="p-6 sm:p-7">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#16587B]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-extrabold font-['Plus_Jakarta_Sans'] text-[#16587B]">
                {activeData.name} Moderasi Otomatis
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16587B]/10 text-[#16587B]">
                {activeData.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {activeData.desc}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeData.status}</span>
          </div>
        </div>

        {/* Live Feed Simulated Comments List */}
        <div className="space-y-3 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Simulasi Aliran Komentar Masuk:
          </div>

          {activeData.comments.map((comment, idx) => (
            <motion.div
              key={comment.user + idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`p-3.5 rounded-2xl border transition-all ${
                comment.isToxic
                  ? 'bg-rose-50/50 border-rose-200/80'
                  : 'bg-[#FAF7F2]/60 border-[#16587B]/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      comment.isToxic ? 'bg-rose-500' : 'bg-[#16587B]'
                    }`}
                  >
                    {comment.user.charAt(1).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{comment.user}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                      comment.isToxic
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {comment.isToxic ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>{comment.statusLabel}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{comment.statusLabel}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <p
                className={`text-xs pl-8 font-medium ${
                  comment.isToxic ? 'text-rose-900 line-through opacity-80' : 'text-slate-700'
                }`}
              >
                "{comment.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mini Performance Stats Bar */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#16587B]/10 text-center">
          <div>
            <div className="text-xs text-slate-400 font-semibold">Tersaring</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#16587B] mt-0.5">
              {activeData.stats.moderated}
            </div>
          </div>
          <div className="border-x border-[#16587B]/10">
            <div className="text-xs text-slate-400 font-semibold">Akurasi</div>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-0.5">
              {activeData.stats.accuracy}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold">Kecepatan</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#16587B] mt-0.5">
              {activeData.stats.speed}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
