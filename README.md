# 🛡️ SABAR — Sistem Analisis Bullying dan Asisten Rehat Digital
> **Platform Moderation-as-a-Service (MaaS) Berbasis Context-Aware NLP untuk Proteksi Kesehatan Mental Pengelola Media Sosial di Indonesia**  
> *Karya Kompetisi Mahasiswa Informatika Politeknik Nasional (KMIPN) 2026 — Politeknik Negeri Jember*

---

## 📌 Ringkasan Proyek
**SABAR** adalah platform *Moderation-as-a-Service (MaaS)* berbasis B2B SaaS yang mengadopsi pendekatan **Fokus Ganda (Dual-Focus Approach)**:
1. **Proteksi Reputasi Bisnis**: Mencegat, menyaring, dan menyembunyikan komentar negatif, ujaran kebencian, dan sarkasme secara *real-time*.
2. **Kesehatan Mental Pengelola Akun**: Mengukur beban psikologis kerja (*Stress-Load Index™*) secara otomatis serta menghadirkan fitur intervensi dini **Asisten Rehat Digital** untuk mencegah *burnout* dan kelelahan mental pada praktisi media sosial.

---

## 🚀 Fitur Utama

- **Context-Aware NLP Engine**: Deteksi sentimen (*Positif, Negatif, Netral*), skor toksisitas (0.0 – 1.0), skala keparahan (*Severity 1 – 10*), serta pengenalan pola sarkasme lokal & bahasa gaul/slang netizen Indonesia.
- **Stress-Load Index™ Gauge**: Indikator radial dinamis untuk mengukur beban stres kerja real-time dengan rumus:
  $$\text{Stress Index (\%)} = \frac{\text{toxic\_count} \times \text{avg\_severity}}{\text{total\_comments}} \times 100$$
- **Live Comment Moderation Log**: Log moderasi komentar masuk dengan filter kategori (*Semua, Tertahan/Hidden, Positif, Negatif*), status badge otomatis `[HIDDEN]` / `[ALLOWED]`, dan aksi pemulihan manual.
- **Asisten Rehat Digital**: Intervensi relaksasi otomatis saat beban stres melampaui batas aman (>65%), dilengkapi *2-Minute Guided Breathing Exercise*.
- **Mock Social Media Sync**: Simulator integrasi Instagram Graph API & TikTok for Developers untuk menguji alur penarikan komentar langsung.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend**: React 19 + Vite 5 + TailwindCSS v4 + Lucide Icons
- **Backend**: Laravel 10 (Modern MVC Architecture & API Routes)
- **AI / NLP**: Context-Aware Natural Language Processing (Hugging Face Transformers / Hybrid Lexicon Engine)
- **Database**: PostgreSQL / MySQL
- **Tooling**: Node.js & Composer (Laragon / Local Environment)

---

## 💻 Panduan Menjalankan Sistem di Lokal

### 1. Prasyarat
- PHP 8.1+ & Composer
- Node.js 18+ & NPM
- MySQL / PostgreSQL (Laragon direkomendasikan)

### 2. Instalasi Dependensi
```bash
# Clone repository
git clone https://github.com/adiarsyahputra-7/KMIPN-WEBSITE-SABAR.git
cd Website_SABAR

# Install dependensi PHP
composer install

# Install dependensi JavaScript/React
npm install
```

### 3. Konfigurasi Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Kompilasi Aset Frontend
```bash
# Untuk mode development (Hot Reload):
npm run dev

# Untuk mode production:
npm run build
```

### 5. Jalankan Aplikasi
```bash
php artisan serve
```
Akses aplikasi melalui browser di **`http://localhost:8000`** atau melalui Virtual Host Laragon **`http://website-sabar.test`**.

---

## 👥 Tim Pengembang (Tim Tini Wini Biti - Politeknik Negeri Jember)
- **Kalyca Kyla Ashila Mahaj Mariansyah** (Ketua - E31252362)
- **Adiar Zidan Syahputra** (Anggota - E31252379)
- **Rangga Bagus Andika** (Anggota - E31252396)

---
*© 2026 SABAR Project. All rights reserved.*
