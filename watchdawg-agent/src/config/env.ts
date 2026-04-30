/** @format */

import { app } from "electron";

/* ============================== */
/* 🧠 ENV DETECTION               */
/* ============================== */

export const IS_DEV = !app.isPackaged;

/* ============================== */
/* 🌍 SAFE ENV HELPERS            */
/* ============================== */

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];

  if (value !== undefined && value !== "") {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return "";
}

export function getNumber(key: string, fallback: number): number {
  const value = process.env[key];

  if (!value) return fallback;

  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/* ============================== */
/* 🪵 RAW ENV (OPTIONAL EXPORT)   */
/* ============================== */

export const RAW_ENV = {
  NODE_ENV: getEnv("NODE_ENV", IS_DEV ? "development" : "production"),
};
