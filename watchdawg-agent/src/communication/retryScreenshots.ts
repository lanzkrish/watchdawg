/** @format */

import fs from "fs";
import path from "path";
import { sendScreenshot } from "./screenshotApi";

/* ============================== */
/* 🔁 RETRY QUEUE                 */
/* ============================== */

const QUEUE_DIR = path.join(
  __dirname,
  "../../storage/screenshot-queue"
);

export async function retryScreenshots() {
  if (!fs.existsSync(QUEUE_DIR)) return;

  const files = fs.readdirSync(QUEUE_DIR);

  for (const file of files) {
    try {
      const filePath = path.join(QUEUE_DIR, file);
      const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
      );

      await sendScreenshot(data);

      fs.unlinkSync(filePath);

      console.log("🔁 Screenshot retried");
    } catch {
      // keep for next retry
    }
  }
}
