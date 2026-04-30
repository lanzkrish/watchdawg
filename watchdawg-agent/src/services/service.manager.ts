/** @format */

import { startEngine } from "../core/engine"; // ✅ YOUR ENGINE
import { getAuth } from "./auth.runtime";

let stopEngine: (() => Promise<void>) | null = null;
let isRunning = false;

/* ============================== */
/* ▶️ START SERVICES              */
/* ============================== */

export function startServices() {
  if (isRunning) {
    console.log("⚠️ Services already running");
    return;
  }

  const { userId, orgId, token } = getAuth();

  if (!userId || !orgId || !token) {
    console.log("❌ Cannot start (no auth)");
    return;
  }

  console.log("🚀 Starting engine...");

  /* 🔥 START ENGINE */
  stopEngine = startEngine(userId, orgId);

  isRunning = true;
}

/* ============================== */
/* 🛑 STOP SERVICES               */
/* ============================== */

export async function stopServices() {
  if (!isRunning) {
    console.log("⚠️ Services not running");
    return;
  }

  console.log("🛑 Stopping engine...");

  /* 🔥 CALL CLEANUP */
  if (stopEngine) {
    await stopEngine();
    stopEngine = null;
  }

  isRunning = false;
}
