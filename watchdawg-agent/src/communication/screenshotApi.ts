/** @format */

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { CONFIG } from "../config/config";

/* ============================== */
/* 📁 OFFLINE STORAGE             */
/* ============================== */

const QUEUE_DIR = path.join(
  __dirname,
  "../../storage/screenshot-queue"
);

function ensureQueue() {
  if (!fs.existsSync(QUEUE_DIR)) {
    fs.mkdirSync(QUEUE_DIR, { recursive: true });
  }
}

/* ============================== */
/* 🚀 SEND SCREENSHOT             */
/* ============================== */

export async function sendScreenshot(data: {
  userId: string;
  organizationId: string;
  filePath: string;
}) {
  try {
    const form = new FormData();

    form.append("userId", data.userId);
    form.append("organizationId", data.organizationId);
    form.append("file", fs.createReadStream(data.filePath));

    await axios.post(
      `${CONFIG.API.URL}/tracking/screenshot`,
      form,
      {
        headers: form.getHeaders(),
        timeout: 5000,
      }
    );

    // ✅ delete after success
    fs.unlinkSync(data.filePath);

    console.log("📸 Uploaded screenshot");
  } catch (err) {
    console.log("⚠️ Screenshot failed → saving offline");

    ensureQueue();

    const file = path.join(
      QUEUE_DIR,
      `queue_${Date.now()}.json`
    );

    fs.writeFileSync(file, JSON.stringify(data));
  }
}
