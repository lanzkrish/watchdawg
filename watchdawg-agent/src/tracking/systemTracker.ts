/** @format */

import activeWin from "active-win";
import { getExtensionData } from "../extension/extensionStore";

/* ============================== */
/* 🎯 CATEGORY TYPE               */
/* ============================== */

export type Category =
  | "productive"
  | "neutral"
  | "distracting";

export interface ActiveApp {
  app: string;
  title: string;
  platform: string;
  category: Category;
}

/* ============================== */
/* 🧠 SAFE CATEGORY NORMALIZER    */
/* ============================== */

function normalizeCategory(value: any): Category {
  if (value === "productive") return "productive";
  if (value === "distracting") return "distracting";
  return "neutral";
}

/* ===================================== */
/* 🚀 GET ACTIVE APP (V5 PRO)            */
/* ===================================== */

export async function getActiveApp(): Promise<ActiveApp | null> {
  const win = await activeWin();
  if (!win) return null;

  const systemApp = win.owner?.name || "Unknown";
  const rawTitle = win.title || "";

  /* ============================== */
  /* 🌐 EXTENSION DATA (PRIORITY)   */
  /* ============================== */

  const ext = getExtensionData();

  if (ext && ext.isActive) {
    return {
      app: systemApp, // real app (Chrome, Edge)
      title: ext.title || "Browser",
      platform: ext.platform || "Browser",
      category: normalizeCategory(ext.category), // ✅ FIX
    };
  }

  /* ============================== */
  /* 💻 FALLBACK SYSTEM MODE        */
  /* ============================== */

  const title = cleanTitle(systemApp, rawTitle);
  const category = detectCategory(systemApp);

  return {
    app: systemApp,
    title,
    platform: systemApp,
    category,
  };
}

/* ===================================== */
/* 🧠 CLEAN TITLE                        */
/* ===================================== */

function cleanTitle(app: string, title: string) {
  if (!title) return "";

  let clean = title
    .replace(/ - Microsoft Edge/gi, "")
    .replace(/ - Google Chrome/gi, "")
    .replace(/ - Brave/gi, "")
    .replace(/ - Mozilla Firefox/gi, "")
    .replace(/ - Visual Studio Code/gi, "")
    .replace(/ - Personal/gi, "")
    .trim();

  if (clean.includes(" - ")) {
    clean = clean.split(" - ")[0];
  }

  return clean;
}

/* ===================================== */
/* 📊 CATEGORY FALLBACK                  */
/* ===================================== */

function detectCategory(app: string): Category {
  const a = app.toLowerCase();

  /* 🟢 PRODUCTIVE */
  if (
    a.includes("code") ||
    a.includes("studio") ||
    a.includes("intellij") ||
    a.includes("figma") ||
    a.includes("notion")
  ) {
    return "productive";
  }

  /* 🔴 DISTRACTING */
  if (
    a.includes("youtube") ||
    a.includes("spotify") ||
    a.includes("netflix")
  ) {
    return "distracting";
  }

  return "neutral";
}
