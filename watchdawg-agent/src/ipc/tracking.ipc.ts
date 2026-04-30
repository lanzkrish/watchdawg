/** @format */

import { ipcMain } from "electron";
import { getAuth } from "../services/auth.runtime";
import { loadDashboard } from "../windows/window.manager";

export function registerTrackingIPC() {
  ipcMain.on("start-tracking", async () => {
    try {
      const { userId, orgId } = getAuth();

      if (!userId || !orgId) {
        console.log("❌ Cannot start tracking (no auth)");
        return;
      }

      console.log("▶️ IPC → Start tracking requested");

      /* 🔥 SAFE START */
      if ((global as any).START_SERVICES) {
        await (global as any).START_SERVICES(); // future-safe
      } else {
        console.warn("⚠️ START_SERVICES not available");
      }

      /* 🔥 NAVIGATION */
      loadDashboard();

      console.log("✅ Tracking started (via IPC)");
    } catch (err) {
      console.error("❌ start-tracking IPC failed:", err);
    }
  });
}
