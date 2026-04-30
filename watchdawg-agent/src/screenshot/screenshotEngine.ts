/** @format */

import { retryScreenshots } from "../communication/retryScreenshots";
import { sendScreenshot } from "../communication/screenshotApi";
import { CONFIG } from "../config/config";
import { getStatus } from "../tracking/idleTracker";
import { captureScreenshot } from "./screenshot";

/* ============================== */
/* 🎯 RANDOM INTERVAL             */
/* ============================== */

function getRandomInterval() {
  const min = CONFIG.SCREENSHOT.MIN_INTERVAL;
  const max = CONFIG.SCREENSHOT.MAX_INTERVAL;

  return Math.random() * (max - min) + min;
}

/* ============================== */
/* 🚀 START SCREENSHOT ENGINE     */
/* ============================== */

export function startScreenshotEngine(
  userId: string,
  organizationId: string
) {
  let isRunning = true;
  let isBusy = false;
  let timer: NodeJS.Timeout | null = null;

  async function loop() {
    if (!isRunning || isBusy) return;

    isBusy = true;

    try {
      const status = getStatus();

      /* 🔥 ONLY WHEN ACTIVE */
      if (status === "active" && isRunning) {
        const file = await captureScreenshot();

        if (file && isRunning) {
          await sendScreenshot({
            userId,
            organizationId,
            filePath: file,
          });
        }
      }

      /* 🔁 RETRY ONLY WHEN ACTIVE */
      if (isRunning && status === "active") {
        await retryScreenshots();
      }
    } catch (err) {
      console.log("❌ Screenshot engine error:", err);
    } finally {
      isBusy = false;
    }

    /* 🔁 NEXT LOOP */
    if (isRunning) {
      timer = setTimeout(loop, getRandomInterval());
    }
  }

  /* 🔥 START */
  loop();

  /* ============================== */
  /* 🛑 STOP FUNCTION               */
  /* ============================== */

  return () => {
    console.log("🛑 Screenshot engine stopped");

    isRunning = false;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}
