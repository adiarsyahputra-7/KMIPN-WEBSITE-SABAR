import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

/**
 * OAuthToast — Notifikasi yang muncul setelah pengguna kembali dari
 * alur OAuth Instagram (baik sukses maupun gagal).
 *
 * Komponen ini membaca parameter query `instagram_connected` dan `message`
 * dari URL yang dikirim oleh InstagramAuthController::redirectToFrontendWithResult().
 * Setelah ditampilkan, ia membersihkan URL dari parameter tersebut agar
 * URL terlihat bersih tanpa refresh halaman (menggunakan History API).
 *
 * @param {Object} props
 * @param {boolean} props.success - true = koneksi berhasil, false = gagal
 * @param {string} props.message  - pesan yang ditampilkan ke pengguna
 * @param {function} props.onClose - callback untuk menutup toast
 */
export default function OAuthToast({ success, message, onClose }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  // Auto-tutup setelah 6 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] w-full max-w-sm transition-all duration-300 ${
        exiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
      role="alert"
    >
      <div className={`rounded-2xl shadow-2xl border overflow-hidden ${
        success
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-rose-50 border-rose-200'
      }`}>
        {/* Progress bar auto-close */}
        <div className={`h-0.5 animate-shrink-x ${success ? 'bg-emerald-400' : 'bg-rose-400'}`} />

        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`p-2 rounded-xl shrink-0 ${
            success ? 'bg-emerald-100' : 'bg-rose-100'
          }`}>
            {success
              ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              : <XCircle className="w-5 h-5 text-rose-600" />
            }
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {/* Instagram Logo Pill */}
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                success
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </span>
              <p className={`text-xs font-bold ${success ? 'text-emerald-800' : 'text-rose-800'}`}>
                {success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
              </p>
            </div>
            <p className={`text-xs leading-relaxed ${success ? 'text-emerald-700' : 'text-rose-700'}`}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`p-1 rounded-lg transition-all shrink-0 ${
              success
                ? 'text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100'
                : 'text-rose-400 hover:text-rose-700 hover:bg-rose-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
