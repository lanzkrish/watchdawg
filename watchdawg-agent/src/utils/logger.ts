/** @format */

import fs from "fs";
import path from "path";

/* ============================== */
/* ⚙️ CONFIG                      */
/* ============================== */

const LOG_DIR = path.join(__dirname, "../../storage/logs");
const LOG_FILE = path.join(LOG_DIR, "agent.log");

const isDev = process.env.NODE_ENV !== "production";

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getTime() {
  return new Date().toISOString();
}

function writeToFile(message: string) {
  try {
    ensureLogDir();
    fs.appendFileSync(LOG_FILE, message + "\n");
  } catch {}
}

function format(level: string, args: any[]) {
  const time = getTime();
  return `[${time}] [${level}] ${args
    .map((a) =>
      typeof a === "object" ? JSON.stringify(a) : a
    )
    .join(" ")}`;
}

/* ============================== */
/* 🚀 LOGGER (V5 PRO)             */
/* ============================== */

export const logger = {
  info: (...args: any[]) => {
    const msg = format("INFO", args);

    if (isDev) console.log("ℹ️", ...args);
    writeToFile(msg);
  },

  success: (...args: any[]) => {
    const msg = format("SUCCESS", args);

    if (isDev) console.log("✅", ...args);
    writeToFile(msg);
  },

  warn: (...args: any[]) => {
    const msg = format("WARN", args);

    console.warn("⚠️", ...args);
    writeToFile(msg);
  },

  error: (...args: any[]) => {
    const msg = format("ERROR", args);

    console.error("❌", ...args);
    writeToFile(msg);
  },
};
