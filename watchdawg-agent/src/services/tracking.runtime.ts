/** @format */

import { disconnectSocket, initSocket } from "../communication/socket";
import { startEngine } from "../core/engine";
import { startScreenshotEngine } from "../screenshot/screenshotEngine";

let stopEngine: (() => void) | null = null;
let stopScreenshot: (() => void) | null = null;

let engineStarted = false;
let socketStarted = false;
let screenshotStarted = false;

/* ================= START ================= */

export function startTracking(userId: string, orgId: string) {
  if (!socketStarted) {
    initSocket(userId, orgId);
    socketStarted = true;
  }

  if (!engineStarted) {
    stopEngine = startEngine(userId, orgId);
    engineStarted = true;
  }

  if (!screenshotStarted) {
    stopScreenshot = startScreenshotEngine(userId, orgId);
    screenshotStarted = true;
  }

  console.log("🚀 Tracking started");
}

/* ================= STOP ================= */

export function stopTracking() {
  if (stopEngine) stopEngine();
  if (stopScreenshot) stopScreenshot();

  disconnectSocket();

  stopEngine = null;
  stopScreenshot = null;

  engineStarted = false;
  socketStarted = false;
  screenshotStarted = false;

  console.log("🛑 Tracking stopped");
}
