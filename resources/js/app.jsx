import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import api from './api';
import '../css/app.css';

function App() {
  const [user, setUser] = useState(null);
  // Mulai dalam status loading jika ada token tersimpan,
  // agar tidak muncul flash halaman login sebelum sesi dikonfirmasi.
  const [loading, setLoading] = useState(!!localStorage.getItem('auth_token'));

  // ─── CEK SESI TOKEN SAAT PERTAMA KALI DIBUKA ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Token ada — verifikasi ke backend apakah masih valid
    api.get('/auth/me')
      .then((res) => {
        const userData = res.data;
        setUser({
          name: userData.name,
          email: userData.email,
          role: userData.role || 'creator',
          plan: userData.plan || 'Creator Pro Tier',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        });
      })
      .catch(() => {
        // Token tidak valid atau expired — hapus dan tampilkan login
        localStorage.removeItem('auth_token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ─── HANDLE LOGOUT ─────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Abaikan error saat logout (token mungkin sudah expired)
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  // ─── FULL-SCREEN LOADING SPINNER ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-teal-900"></div>
            <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white tracking-wide">SABAR</p>
            <p className="text-xs text-teal-400/80 font-medium tracking-widest uppercase">Memverifikasi sesi...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── ROUTING SEDERHANA ─────────────────────────────────────────────────────
  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
