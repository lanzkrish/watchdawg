/** @format */

export const formatDuration = (seconds: number) => {
  if (!seconds || seconds < 0) return "0s";

  if (seconds < 60) return `${seconds}s`;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m < 60) return `${m}m ${s}s`;

  const h = Math.floor(m / 60);
  const min = m % 60;

  return `${h}h ${min}m`;
};
