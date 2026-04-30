/** @format */

import { BrowserWindow, app } from "electron";
import fs from "fs";
import path from "path";

/* ============================== */
/* 🧠 ENV DETECTION               */
/* ============================== */

const isDev = !app.isPackaged;

/* ============================== */
/* 🪟 WINDOW INSTANCE             */
/* ============================== */

let win: BrowserWindow | null = null;

/* ============================== */
/* 📁 BASE PATH (FIXED)           */
/* ============================== */

const basePath = isDev
  ? path.join(process.cwd(), "public/auth/pages") // ✅ dev FIX
  : path.join(process.resourcesPath, "pages");     // ✅ production

/* ============================== */
/* 🚀 CREATE WINDOW               */
/* ============================== */

export function createMainWindow() {
  if (win) {
    win.focus();
    return;
  }

  win = new BrowserWindow({
    width: 500,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../auth/preload.js"), // ✅ correct
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  console.log("📂 Base path:", basePath);

  /* ✅ DEVTOOLS ONLY IN DEV */
  if (isDev) {
    win.webContents.openDevTools();
  }

  /* 🔥 AUTO OPEN DEVTOOLS ON ERROR */
  win.webContents.on("did-fail-load", (_e, code, desc) => {
    console.error("❌ Load failed:", code, desc);

    if (!isDev) {
      win?.webContents.openDevTools(); // only when error in prod
    }
  });

  win.webContents.on("render-process-gone", () => {
    console.error("💥 Renderer crashed");

    if (!isDev) {
      win?.webContents.openDevTools();
    }
  });

  /* 🔒 BLOCK NEW WINDOWS */
  win.webContents.setWindowOpenHandler(() => ({
    action: "deny",
  }));

  /* 🔄 CLEANUP */
  win.on("closed", () => {
    win = null;
  });

  /* 🔥 LOAD FIRST PAGE */
  loadLogin();
}

/* ============================== */
/* 🔄 SAFE LOAD ENGINE            */
/* ============================== */

let isLoading = false;

function safeLoad(file: string) {
  if (!win) {
    console.error("❌ Window not ready");
    return;
  }

  if (isLoading) {
    console.warn("⚠️ Already loading");
    return;
  }

  const fullPath = path.join(basePath, file);

  console.log("📄 Loading:", fullPath);

  if (!fs.existsSync(fullPath)) {
    console.error("❌ File missing:", fullPath);

    if (file !== "login.html") {
      return safeLoad("login.html");
    }
    return;
  }

  isLoading = true;

  win.loadFile(fullPath)
    .then(() => {
      console.log("✅ Loaded:", file);
    })
    .catch((err) => {
      console.error("❌ Load error:", err);

      if (file !== "login.html") {
        safeLoad("login.html");
      }
    })
    .finally(() => {
      isLoading = false;
    });
}

/* ============================== */
/* 📄 NAVIGATION                  */
/* ============================== */

export const loadLogin = () => safeLoad("login.html");

export const loadChangePassword = () =>
  safeLoad("change-password.html");

export const loadConsent = () => safeLoad("consent.html");

export const loadDashboard = () =>
  safeLoad("dashboard.html");

/* ============================== */
/* 🔍 GET WINDOW                  */
/* ============================== */

export function getWindow() {
  return win;
}

/* ============================== */
/* 🔄 RELOAD                      */
/* ============================== */

export function reloadWindow() {
  if (!win) return;

  try {
    win.reload();
  } catch (err) {
    console.error("❌ Reload failed:", err);
  }
}
