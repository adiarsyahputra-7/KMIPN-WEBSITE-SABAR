import React from 'react';
import { Bell, BellOff, BellRing, Zap, CheckCircle2, AlertCircle, X } from 'lucide-react';
import useWebPush from '../hooks/useWebPush';

export default function PushNotificationWidget({ isDarkMode = true }) {
  const {
    isSupported,
    isSubscribed,
    loading,
    testLoading,
    feedback,
    clearFeedback,
    subscribe,
    unsubscribe,
    sendTest,
  } = useWebPush();

  if (!isSupported) {
    return null; // Sembunyikan secara rapi jika browser kuno tidak mendukung
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border transition-all duration-300 ${
          isDarkMode
            ? isSubscribed
              ? 'bg-[#16587B]/15 border-emerald-500/30 text-slate-200'
              : 'bg-[#0F2238]/60 border-[#16587B]/30 text-slate-300'
            : isSubscribed
              ? 'bg-emerald-50/80 border-emerald-200 text-slate-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        {/* Status indicator & Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isSubscribed
                ? 'bg-emerald-500/20 text-emerald-400'
                : isDarkMode
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isSubscribed ? (
              <BellRing className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Bell className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-tight">
                Peringatan Realtime
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSubscribed ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-400'
                }`}
              />
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {isSubscribed
                ? 'Aktif · Peringatan muncul saat komentar negatif masuk'
                : 'Dapatkan notifikasi langsung ke perangkat Anda'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isSubscribed ? (
            <>
              <button
                type="button"
                onClick={sendTest}
                disabled={testLoading}
                title="Kirim notifikasi uji coba ke perangkat ini"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {testLoading ? (
                  <span className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                )}
                <span>Uji Notifikasi</span>
              </button>

              <button
                type="button"
                onClick={unsubscribe}
                disabled={loading}
                title="Matikan notifikasi push"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                }`}
              >
                <BellOff className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={subscribe}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16587B] hover:bg-[#1c6e99] text-white text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Bell className="w-3.5 h-3.5" />
              )}
              <span>Aktifkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs transition-all animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={clearFeedback}
            className="text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
