import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  X,
  Check,
  ArrowRight,
  Zap,
  Users,
  BarChart2,
  Clock,
  Headphones,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

// ─── PALET WARNA SABAR ────────────────────────────────────────────────────
const COLORS = {
  bg: '#FAF7F2',
  vBlue: '#16587B',
  rockBlue: '#84B3CE',
  merino: '#F5EEDD',
  navy: '#0B1D33',
  textHeading: '#103A52',
  textBody: '#4F7085',
  bgBorder: 'rgba(22,88,123,0.12)',
};

// ─── DATA PAKET HARGA ─────────────────────────────────────────────────────
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Kreator pemula & individu',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: 'Gratis selamanya',
    yearlyLabel: 'Gratis selamanya',
    trialBadge: '✦ 30 hari akses Pro gratis',
    buttonText: 'Mulai Gratis',
    popular: false,
    limitNote: 'Maks. 3.000 komentar / bulan',
    includes: [
      { text: 'Deteksi toksik real-time', active: true },
      { text: '1 akun media sosial', active: true },
      { text: 'Laporan ringkasan mingguan', active: true },
      { text: 'Filter kata kunci dasar', active: true },
      { text: 'Deteksi sarkasme lanjutan', active: false },
      { text: 'Asisten Rehat', active: false },
      { text: 'Analitik tren & grafik', active: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Influencer & kreator profesional',
    monthlyPrice: 59000,
    yearlyPrice: 499000,
    originalMonthlyPrice: 99000,
    originalYearlyPrice: 799000,
    trialBadge: '✦ Gratis 30 hari, tanpa kartu kredit',
    buttonText: 'Coba 30 Hari Gratis',
    popular: true,
    limitNote: 'Maks. 30.000 komentar / bulan',
    includes: [
      { text: 'Semua fitur Starter', active: true },
      { text: 'Hingga 3 akun media sosial', active: true },
      { text: 'Deteksi sarkasme & toxic hidden message', active: true },
      { text: 'Asisten Rehat (notifikasi otomatis)', active: true },
      { text: 'Analitik tren sentimen harian', active: true },
      { text: 'Ekspor laporan PDF', active: true },
      { text: 'Dashboard multi-klien', active: false },
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    tagline: 'Agensi & brand korporat',
    monthlyPrice: 299000,
    yearlyPrice: 2499000,
    originalMonthlyPrice: 799000,
    originalYearlyPrice: 6999000,
    trialBadge: '✦ Gratis 30 hari + onboarding gratis',
    buttonText: 'Hubungi Tim Kami',
    popular: false,
    limitNote: 'Unlimited komentar, SLA 99.5% uptime',
    includes: [
      { text: 'Semua fitur Pro', active: true },
      { text: 'Hingga 20 akun media sosial', active: true },
      { text: 'Dashboard multi-klien terpusat', active: true },
      { text: 'Manajemen tim & role akses', active: true },
      { text: 'Laporan white-label untuk klien', active: true },
      { text: 'Priority support & account manager', active: true },
      { text: 'Unlimited komentar', active: true },
    ],
  },
];

// ─── FORMAT RUPIAH ────────────────────────────────────────────────────────
const formatRupiah = (num) => {
  if (num === 0) return 'Rp 0';
  return 'Rp ' + num.toLocaleString('id-ID');
};

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────
const PricingSwitch = ({ isYearly, onSwitch }) => {
  return (
    <div className="flex justify-center">
      <div
        className="relative flex rounded-full border p-1"
        style={{
          backgroundColor: COLORS.bg,
          borderColor: COLORS.bgBorder,
          boxShadow: '0 2px 12px rgba(22,88,123,0.08)',
        }}
      >
        {/* Sliding Indicator */}
        <motion.span
          layout
          layoutId="pricing-switch"
          className="absolute top-1 h-[calc(100%-8px)] rounded-full"
          style={{
            background: `linear-gradient(135deg, ${COLORS.vBlue} 0%, #1D6C96 100%)`,
            boxShadow: '0 4px 14px rgba(22,88,123,0.3)',
            width: 'calc(50% - 4px)',
            left: isYearly ? 'calc(50%)' : '4px',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />

        <button
          onClick={() => onSwitch(false)}
          className={cn(
            'relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer',
            !isYearly ? 'text-white' : 'text-[#4F7085] hover:text-[#16587B]'
          )}
        >
          Bulanan
        </button>

        <button
          onClick={() => onSwitch(true)}
          className={cn(
            'relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer',
            isYearly ? 'text-white' : 'text-[#4F7085] hover:text-[#16587B]'
          )}
        >
          Tahunan
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors duration-300',
              isYearly
                ? 'bg-white/25 text-white'
                : 'bg-[#84B3CE]/20 text-[#16587B]'
            )}
          >
            Hemat 30%
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── KARTU PAKET ──────────────────────────────────────────────────────────
const PlanCard = ({ plan, isYearly, onLoginClick, index }) => {
  const isPopular = plan.popular;
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const originalPrice = isYearly ? plan.originalYearlyPrice : plan.originalMonthlyPrice;
  const priceLabel = isYearly ? '/ tahun' : (plan.id === 'starter' ? '' : '/ bulan');

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn('relative', isPopular && 'lg:-mt-4 lg:mb-0')}
    >
      <Card
        className={cn(
          'relative flex flex-col h-full overflow-hidden border-0 transition-all duration-300',
          isPopular
            ? 'shadow-2xl ring-2'
            : 'shadow-md hover:shadow-xl hover:-translate-y-1'
        )}
        style={
          isPopular
            ? {
                background: `linear-gradient(150deg, ${COLORS.vBlue} 0%, #0E3F59 60%, ${COLORS.navy} 100%)`,
                ringColor: COLORS.rockBlue,
                boxShadow: '0 20px 60px rgba(22,88,123,0.35)',
              }
            : {
                backgroundColor: '#FFFFFF',
                border: `1px solid ${COLORS.bgBorder}`,
              }
        }
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-0 left-0 right-0 flex justify-center pt-0">
            <div
              className="px-4 py-1.5 rounded-b-xl text-xs font-extrabold tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${COLORS.rockBlue} 0%, #A8CBE1 100%)`,
                color: COLORS.navy,
              }}
            >
              ★ DIREKOMENDASIKAN
            </div>
          </div>
        )}

        <CardContent className={cn('flex-1 p-7', isPopular && 'pt-10')}>
          {/* Plan Name & Tagline */}
          <div className="mb-5">
            <h3
              className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1"
              style={{ color: isPopular ? COLORS.merino : COLORS.textHeading }}
            >
              {plan.name}
            </h3>
            <p
              className="text-xs font-medium"
              style={{ color: isPopular ? `${COLORS.rockBlue}CC` : COLORS.textBody }}
            >
              {plan.tagline}
            </p>
          </div>

          {/* Price Display */}
          <div className="mb-5">
            {/* Original Price (coret) */}
            {originalPrice && plan.id !== 'starter' && (
              <p
                className="text-sm line-through font-medium mb-0.5"
                style={{ color: isPopular ? `${COLORS.rockBlue}80` : '#AAB8C2' }}
              >
                {formatRupiah(originalPrice)}
              </p>
            )}
            <div className="flex items-baseline gap-1.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${plan.id}-${isYearly}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="text-4xl font-extrabold font-['Plus_Jakarta_Sans']"
                  style={{ color: isPopular ? '#FFFFFF' : COLORS.textHeading }}
                >
                  {plan.id === 'starter' ? 'Rp 0' : formatRupiah(price)}
                </motion.span>
              </AnimatePresence>
              {priceLabel && (
                <span
                  className="text-sm font-semibold"
                  style={{ color: isPopular ? `${COLORS.rockBlue}CC` : COLORS.textBody }}
                >
                  {priceLabel}
                </span>
              )}
            </div>

            {/* Trial Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mt-3"
              style={{
                backgroundColor: isPopular
                  ? 'rgba(132,179,206,0.15)'
                  : 'rgba(22,88,123,0.07)',
                color: isPopular ? COLORS.rockBlue : COLORS.vBlue,
                border: `1px solid ${isPopular ? 'rgba(132,179,206,0.3)' : 'rgba(22,88,123,0.15)'}`,
              }}
            >
              <Clock className="w-3 h-3" />
              {plan.trialBadge}
            </div>
          </div>

          {/* Divider */}
          <div
            className="border-t mb-5"
            style={{
              borderColor: isPopular ? 'rgba(132,179,206,0.25)' : COLORS.bgBorder,
            }}
          />

          {/* Features List */}
          <ul className="space-y-3">
            {plan.includes.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={
                    feature.active
                      ? {
                          backgroundColor: isPopular
                            ? 'rgba(132,179,206,0.2)'
                            : 'rgba(22,88,123,0.1)',
                        }
                      : { backgroundColor: 'rgba(0,0,0,0.06)' }
                  }
                >
                  {feature.active ? (
                    <Check
                      className="w-3 h-3"
                      style={{ color: isPopular ? COLORS.rockBlue : COLORS.vBlue }}
                    />
                  ) : (
                    <X className="w-3 h-3" style={{ color: '#C0CDD6' }} />
                  )}
                </span>
                <span
                  className="text-sm font-medium leading-relaxed"
                  style={{
                    color: feature.active
                      ? isPopular
                        ? `${COLORS.merino}E0`
                        : COLORS.textBody
                      : '#B0BEC5',
                    textDecoration: feature.active ? 'none' : 'line-through',
                    textDecorationColor: '#C0CDD6',
                  }}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        {/* Limit Note + CTA */}
        <CardFooter className="flex flex-col gap-3 px-7 pb-7 pt-0">
          <p
            className="text-[11px] font-medium w-full"
            style={{ color: isPopular ? `${COLORS.rockBlue}99` : '#B0BEC5' }}
          >
            {plan.limitNote}
          </p>
          <button
            onClick={onLoginClick}
            className={cn(
              'w-full py-3.5 px-5 rounded-xl font-extrabold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2',
              isPopular
                ? 'hover:scale-[1.03] hover:shadow-lg'
                : 'hover:scale-[1.02] hover:shadow-md'
            )}
            style={
              isPopular
                ? {
                    background: `linear-gradient(135deg, ${COLORS.merino} 0%, #FFFFFF 100%)`,
                    color: COLORS.vBlue,
                    boxShadow: '0 6px 20px rgba(245,238,221,0.25)',
                  }
                : {
                    background: `linear-gradient(135deg, ${COLORS.vBlue} 0%, #1D6C96 100%)`,
                    color: COLORS.merino,
                    boxShadow: '0 4px 14px rgba(22,88,123,0.25)',
                  }
            }
          >
            {plan.buttonText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// ─── KOMPONEN UTAMA HALAMAN PRICING ──────────────────────────────────────
export default function PricingPage({ onLoginClick, onBackClick }) {
  const [isYearly, setIsYearly] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* ── Ambient Background Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, rgba(132,179,206,0.25) 0%, rgba(245,238,221,0.4) 55%, transparent 80%)`,
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(22,88,123,0.06) 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── Content Wrapper ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBackClick}
          className="flex items-center gap-2 mb-10 text-sm font-bold cursor-pointer transition-colors duration-200 group"
          style={{ color: COLORS.textBody }}
        >
          <ChevronLeft
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            style={{ color: COLORS.vBlue }}
          />
          <span className="group-hover:text-[#16587B] transition-colors">Kembali ke Beranda</span>
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-12"
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="space-y-3">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: 'rgba(22,88,123,0.07)',
                borderColor: COLORS.bgBorder,
                color: COLORS.vBlue,
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              Harga Transparan, Tanpa Biaya Tersembunyi
            </div>

            <h1
              className="text-4xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight"
              style={{ color: COLORS.textHeading }}
            >
              Pilih Paket{' '}
              <span
                className="relative"
                style={{ color: COLORS.vBlue }}
              >
                SABAR
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="4"
                  viewBox="0 0 100 4"
                  preserveAspectRatio="none"
                  style={{ opacity: 0.4 }}
                >
                  <path
                    d="M0 2 Q25 0, 50 2 Q75 4, 100 2"
                    stroke={COLORS.rockBlue}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Anda
            </h1>

            <p
              className="text-base sm:text-lg font-medium max-w-xl leading-relaxed"
              style={{ color: COLORS.textBody }}
            >
              Dipercaya oleh kreator Indonesia. Mulai gratis, upgrade kapanpun — sesuai pertumbuhan karir Anda.
            </p>
          </motion.div>

          {/* Pricing Switch (Desktop: kanan atas, Mobile: di bawah heading) */}
          <motion.div variants={fadeUp} className="shrink-0">
            <PricingSwitch isYearly={isYearly} onSwitch={setIsYearly} />
          </motion.div>
        </motion.div>

        {/* ── Grid Kartu Paket ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              onLoginClick={onLoginClick}
              index={index}
            />
          ))}
        </div>

        {/* ── Trust Signals ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 flex flex-col items-center gap-5"
        >
          {/* Stars Row */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-current"
                style={{ color: '#F5C843' }}
              />
            ))}
            <span
              className="ml-2 text-sm font-bold"
              style={{ color: COLORS.textHeading }}
            >
              4.9/5
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: COLORS.textBody }}
            >
              dari 1.200+ kreator aktif
            </span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Shield, text: 'SSL Terenkripsi' },
              { icon: Zap, text: 'Aktif dalam 60 detik' },
              { icon: CheckCircle2, text: 'Batal kapanpun' },
              { icon: Headphones, text: 'Support 24/7' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: COLORS.bgBorder,
                  color: COLORS.textBody,
                  boxShadow: '0 2px 8px rgba(22,88,123,0.06)',
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: COLORS.vBlue }} />
                {text}
              </div>
            ))}
          </div>

          <p
            className="text-xs font-medium text-center max-w-md"
            style={{ color: '#B0BEC5' }}
          >
            Pembayaran aman menggunakan Midtrans. Kartu kredit, transfer bank, dan e-wallet didukung.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
