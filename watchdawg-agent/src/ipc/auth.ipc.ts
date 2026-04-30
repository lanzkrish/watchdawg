/** @format */

import { ipcMain } from "electron";
import {
  loadChangePassword,
  loadConsent,
  loadLogin,
} from "../windows/window.manager";

import {
  clearAuth,
  getAuth,
  setAuth,
} from "../services/auth.runtime";

/* 🔥 EXTENSION CONTROL */
import {
  startExtensionServer,
  stopExtensionServer,
} from "../extension/extensionServer";

export function registerAuthIPC() {
  /* ============================== */
  /* 🔐 SET AUTH                    */
  /* ============================== */

  ipcMain.handle(
    "set-auth",
    async (_, { userId, orgId, token, firstLogin }) => {
      try {
        setAuth(userId, orgId, token);

        console.log("🔐 IPC Auth set:", userId);

        /* 🔥 START EXTENSION (SAFE) */
        startExtensionServer(); // already protected internally

        /* 🔥 START ENGINE (SAFE) */
        if ((global as any).START_SERVICES) {
          (global as any).START_SERVICES();
        }

        /* 🔥 ROUTING */
        if (firstLogin) {
          loadChangePassword();
        } else {
          loadConsent();
        }

        return { success: true };
      } catch (err) {
        console.error("❌ set-auth failed:", err);
        return { success: false };
      }
    }
  );

  /* ============================== */
  /* 🔑 GET TOKEN                   */
  /* ============================== */

  ipcMain.handle("get-token", async () => {
    try {
      return getAuth().token || null;
    } catch (err) {
      console.error("❌ get-token failed:", err);
      return null;
    }
  });

  /* ============================== */
  /* 🛑 LOGOUT                      */
  /* ============================== */

  ipcMain.on("logout", async () => {
    try {
      console.log("🛑 Logging out...");

      /* 🔥 1. STOP ENGINE (WAIT FOR CLEANUP) */
      if ((global as any).LOGOUT) {
        await (global as any).LOGOUT(); // ✅ IMPORTANT FIX
      }

      /* 🔥 2. STOP EXTENSION */
      stopExtensionServer();

      /* 🔥 3. CLEAR AUTH */
      clearAuth();

      console.log("🚪 User logged out + all services stopped");

      /* 🔥 4. NAVIGATE */
      loadLogin();
    } catch (err) {
      console.error("❌ logout failed:", err);
    }
  });
}
