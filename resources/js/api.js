/**
 * SABAR — Axios API Client (Centralized)
 *
 * Single source of truth untuk semua HTTP request ke Laravel backend.
 * Secara otomatis menyisipkan Bearer token dari localStorage ke setiap request,
 * dan menangani respons 401 (session expired) secara global.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
// Secara otomatis menyisipkan token auth ke setiap request keluar.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
// Menangani error 401 secara global (token expired / tidak valid).
// Secara otomatis menghapus token lama dan me-redirect ke halaman login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Refresh halaman agar App.jsx mendeteksi tidak ada token dan menampilkan LoginPage
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
