/** @format */

import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { logger } from "../utils/logger";

/* ============================== */
/* ⚙️ CONFIG                      */
/* ============================== */

const BASE_URL = "http://localhost:5000"; // 🔥 your NestJS backend
const ENDPOINT = "/api/tracking/activity";

/* ============================== */
/* 📁 STORAGE                     */
/* ============================== */

const ACTIVITY_DIR = path.join(process.cwd(), "storage", "activity");

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

interface BackgroundPayload {
  app: string;
  type?: "music";
  duration: number;
}

interface ActivityPayload {
  userId: string;
  organizationId: string;

  app: string;
  title?: string;
  platform?: string;
  domain?: string;

  category: string;
  status: string;

  duration: number;

  // 🔥 REQUIRED
  timestamp: number;

  // 🔥 OPTIONAL
  background?: BackgroundPayload;
}

/* ============================== */
/* 🛡️ ENSURE DIR                  */
/* ============================== */

async function ensureDir() {
  await fs.mkdir(ACTIVITY_DIR, { recursive: true });
}

/* ============================== */
/* 💾 SAVE LOCALLY (OFFLINE)      */
/* ============================== */

async function saveOffline(data: ActivityPayload) {
  try {
    await ensureDir();

    const file = path.join(
      ACTIVITY_DIR,
      `activity_${Date.now()}.json`
    );

    await fs.writeFile(file, JSON.stringify(data));

    logger.warn("💾 Saved offline:", file);
  } catch (err) {
    logger.error("❌ Failed to save offline:", err);
  }
}

/* ============================== */
/* 🔁 RETRY OFFLINE DATA          */
/* ============================== */

export async function retryActivities() {
  setInterval(async () => {
    try {
      await ensureDir();

      const files = await fs.readdir(ACTIVITY_DIR);
      if (!files.length) return;

      logger.info(`🔁 Retrying ${files.length} offline activities`);

      for (const file of files) {
        const filePath = path.join(ACTIVITY_DIR, file);

        try {
          const content = await fs.readFile(filePath, "utf-8");
          const data: ActivityPayload = JSON.parse(content);

          await axios.post(BASE_URL + ENDPOINT, data, {
            timeout: 5000,
          });

          await fs.unlink(filePath);

          logger.info("✅ Retried & removed:", file);
        } catch (err) {
          logger.warn("⚠️ Retry failed:", file);
        }
      }
    } catch (err) {
      logger.error("❌ Retry system error:", err);
    }
  }, 15000); // every 15 sec
}

/* ============================== */
/* 🚀 SEND ACTIVITY               */
/* ============================== */

export async function sendActivity(data: ActivityPayload) {
  /* ============================== */
  /* 🔥 AUTO TIMESTAMP              */
  /* ============================== */

  if (!data.timestamp) {
    data.timestamp = Date.now();
  }

  /* ============================== */
  /* 🔥 FULL PAYLOAD LOG            */
  /* ============================== */

  console.log("\n📦 ===============================");
  console.log("📦 FULL ACTIVITY PAYLOAD:");
  console.log(JSON.stringify(data, null, 2));
  console.log("📦 ===============================\n");

  /* ============================== */
  /* 🔒 VALIDATION                  */
  /* ============================== */

  if (!data?.userId || !data?.organizationId || !data?.app) {
    console.warn("⚠️ Invalid basic fields");
    return;
  }

  if (!data.duration || data.duration <= 0) {
    console.warn("⚠️ Invalid duration:", data.duration);
    return;
  }

  /* ============================== */
  /* 🎵 BACKGROUND SAFETY           */
  /* ============================== */

  if (
    data.background &&
    (typeof data.background.duration !== "number" ||
      data.background.duration <= 0)
  ) {
    console.warn("⚠️ Invalid background duration");
    delete data.background;
  }

  /* ============================== */
  /* 🚀 SEND TO BACKEND             */
  /* ============================== */

  try {
    const res = await axios.post(BASE_URL + ENDPOINT, data, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ BACKEND RESPONSE:", res.data);

  } catch (err: any) {
    console.error("❌ BACKEND ERROR:");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received → saving offline");
      await saveOffline(data); // 🔥 fallback
    } else {
      console.error("Error:", err.message);
    }
  }
}
