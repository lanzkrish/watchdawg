/** @format */

import { getExtensionData } from "../extension/extensionStore";

/* ============================== */
/* 🎵 BACKGROUND TYPE             */
/* ============================== */

export type BackgroundActivity = {
  app: string | undefined;
  type: "music";
  duration?: number;
};

/* ============================== */
/* 🎯 CATEGORY TYPE               */
/* ============================== */

export type Category =
  | "productive"
  | "neutral"
  | "distracting";

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function normalizeCategory(value: any): Category {
  if (value === "productive") return "productive";
  if (value === "distracting") return "distracting";
  return "neutral";
}

function safeString(val: any, fallback?: string) {
  if (typeof val === "string" && val.trim()) {
    return val.trim().slice(0, 255);
  }
  return fallback;
}

/* ============================== */
/* 🧹 CLEAN SYSTEM TITLE          */
/* ============================== */

function cleanSystemTitle(title?: string, app?: string) {
  if (!title) return app || "Unknown";

  let t = title;

  t = t.replace(/\s[-–—]\s.*$/, "");
  t = t.replace(/\s\|\s.*$/, "");

  return t.trim() || app || "Unknown";
}

/* ============================== */
/* 🌐 CHECK IF BROWSER            */
/* ============================== */

function isBrowserApp(app: string) {
  const name = app.toLowerCase();

  return (
    name.includes("chrome") ||
    name.includes("edge") ||
    name.includes("firefox") ||
    name.includes("browser")
  );
}

/* ============================== */
/* 🎵 MUSIC DETECTOR              */
/* ============================== */

function isMusicPlatform(platform?: string, domain?: string) {
  const val = `${platform || ""} ${domain || ""}`.toLowerCase();

  return (
    val.includes("spotify") ||
    val.includes("youtube") ||
    val.includes("music") ||
    val.includes("gaana") ||
    val.includes("jiosaavn") ||
    val.includes("wynk")
  );
}

/* ===================================== */
/* 🚀 MERGE SYSTEM + EXTENSION (FINAL)   */
/* ===================================== */

export function mergeActivity(active: any) {
  const ext = getExtensionData();

  /* ============================== */
  /* 🔥 SYSTEM BASE                */
  /* ============================== */

  const system = {
    app: safeString(active?.app, "Unknown")!,
    platform: safeString(active?.platform, active?.app)!,
    title: cleanSystemTitle(active?.title, active?.app),
    category: normalizeCategory(active?.category),
  };

  /* ============================== */
  /* 💻 NON-BROWSER → SYSTEM ONLY   */
  /* ============================== */

  if (!isBrowserApp(system.app)) {
    return {
      app: system.app,
      platform: system.platform,
      title: system.title,
      domain: undefined,
      category: system.category,
      background: null,
    };
  }

  /* ============================== */
  /* ❌ NO EXTENSION → SAFE DEFAULT */
  /* ============================== */

  if (!ext) {
    return {
      app: system.app,
      platform: "Browser",
      title: system.title || "Browsing", // ✅ improved fallback
      domain: undefined,
      category: "neutral",
      background: null,
    };
  }

  const platform = safeString(ext.platform, "Browser");
  const category = normalizeCategory(ext.category);
  const domain = ext.domain || undefined;

  const isMusic = isMusicPlatform(platform, domain);

  /* ============================== */
  /* 🎵 MUSIC HANDLING              */
  /* ============================== */

  if (isMusic) {
    /* 🔥 FOREGROUND MUSIC */
    if (ext.type === "active") {
      return {
        app: system.app,
        platform,
        title: "Music", // ✅ stable
        domain,
        category,
        background: null,
      };
    }

    /* 🔥 BACKGROUND MUSIC */
    return {
      app: system.app,
      platform: "Browser",
      title: system.title || "Browsing",
      domain: undefined,
      category: "neutral",
      background: {
        app: platform,
        type: "music",
      } as BackgroundActivity,
    };
  }

  /* ============================== */
  /* 🌐 NORMAL BROWSER ACTIVITY     */
  /* ============================== */

  return {
    app: system.app,
    platform,

    // 🔥 MAIN FIX: use platform instead of ext.title
    title: safeString(platform, "Browsing"),

    domain,
    category,
    background: null,
  };
}
