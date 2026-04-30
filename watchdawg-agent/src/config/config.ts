/** @format */

import { IS_DEV, getEnv, getNumber } from "./env";

/* ============================== */
/* 🚀 APP CONFIG                 */
/* ============================== */

export const CONFIG = {
  /* ============================== */
  /* 🌐 API                         */
  /* ============================== */
  API: {
    URL: IS_DEV
      ? getEnv("API_URL", "http://localhost:5000")
      : "https://api.watchdawg.com",
  },

  /* ============================== */
  /* 🔌 AGENT BRIDGE                */
  /* ============================== */
  AGENT: {
    URL: IS_DEV
      ? getEnv("AGENT_URL", "http://localhost:6969")
      : "https://agent.watchdawg.com",
  },

  /* ============================== */
  /* 🔌 EXTENSION SERVER            */
  /* ============================== */
  EXTENSION: {
    PORT: getNumber("EXTENSION_PORT", 6969),
    TTL: getNumber("EXTENSION_TTL", 5000),
  },

  /* ============================== */
  /* ⏱ TRACKING                    */
  /* ============================== */
  TRACKING: {
    LOOP_INTERVAL: getNumber("TRACK_INTERVAL", 5000),
    SAVE_INTERVAL: getNumber("SAVE_INTERVAL", 10000),
    SOCKET_INTERVAL: getNumber("SOCKET_INTERVAL", 3000),
  },

  /* ============================== */
  /* 🧠 IDLE                       */
  /* ============================== */
  IDLE: {
    IDLE_THRESHOLD: getNumber("IDLE_THRESHOLD", 60),
    AWAY_THRESHOLD: getNumber("AWAY_THRESHOLD", 300),
  },

  /* ============================== */
  /* 📸 SCREENSHOT                 */
  /* ============================== */
  SCREENSHOT: {
    MIN_INTERVAL: getNumber("SCREENSHOT_MIN_INTERVAL", 20000),
    MAX_INTERVAL: getNumber("SCREENSHOT_MAX_INTERVAL", 60000),
  },

  /* ============================== */
  /* 🪵 APP                        */
  /* ============================== */
  APP: {
    ENV: IS_DEV ? "development" : "production",
    IS_DEV,
  },
};
