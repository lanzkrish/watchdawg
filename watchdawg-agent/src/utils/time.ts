/** @format */

/* ============================== */
/* ⏱ CURRENT TIME                */
/* ============================== */

export function now() {
  return Date.now();
}

/* ============================== */
/* ⏱ SAFE SECONDS                */
/* ============================== */

export function seconds(start: number, end: number) {
  if (!start || !end) return 0;

  const diff = end - start;

  if (diff <= 0) return 0;

  return Math.floor(diff / 1000);
}

/* ============================== */
/* ⏱ MINUTES (FOR ANALYTICS)     */
/* ============================== */

export function minutes(sec: number) {
  if (!sec || sec <= 0) return 0;
  return Math.floor(sec / 60);
}

/* ============================== */
/* ⏱ FORMAT (UI / LOGS)          */
/* ============================== */

export function formatDuration(sec: number) {
  if (!sec || sec <= 0) return "0s";

  if (sec >= 3600) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  }

  if (sec >= 60) {
    return `${Math.floor(sec / 60)}m`;
  }

  return `${sec}s`;
}

/* ============================== */
/* 🗓 DATE KEY (FOR DB)           */
/* ============================== */

export function getDateKey(ts: number = Date.now()) {
  return new Date(ts).toISOString().split("T")[0]; // YYYY-MM-DD
}
