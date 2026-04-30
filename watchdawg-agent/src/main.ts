/** @format */

import "dotenv/config";
import { app } from "electron";

import { registerAuthIPC } from "./ipc/auth.ipc";
import { registerNavigationIPC } from "./ipc/navigation.ipc";
import { registerTrackingIPC } from "./ipc/tracking.ipc";
import { createMainWindow } from "./windows/window.manager";

import {
  clearAuth,
  restoreSession,
} from "./services/auth.runtime";

/* 🔥 SERVICE MANAGER */
import {
  startServices,
  stopServices,
} from "./services/service.manager";

app.whenReady().then(() => {
  console.log("🚀 App starting...");

  /* ============================== */
  /* 🔥 GLOBAL CONTROLLERS          */
  /* ============================== */

  (global as any).START_SERVICES = startServices;
  (global as any).LOGOUT = stopServices;
  (global as any).CLEAR_AUTH = clearAuth;

  /* ============================== */
  /* 🪟 WINDOW                     */
  /* ============================== */

  createMainWindow();

  /* ============================== */
  /* 🔌 IPC                        */
  /* ============================== */

  registerAuthIPC();
  registerNavigationIPC();
  registerTrackingIPC();

  /* ============================== */
  /* 🔄 SESSION RESTORE            */
  /* ============================== */

  restoreSession();
});

/* ============================== */
/* ❌ CLOSE APP                   */
/* ============================== */

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/* ============================== */
/* 🧹 BEFORE QUIT (ONLY HERE)     */
/* ============================== */

app.on("before-quit", async () => {
  console.log("🧹 Cleaning up before exit...");

  try {
    if ((global as any).LOGOUT) {
      await (global as any).LOGOUT(); // ✅ WAIT FOR ENGINE STOP
    }
  } catch (err) {
    console.error("❌ Cleanup error:", err);
  }
});
