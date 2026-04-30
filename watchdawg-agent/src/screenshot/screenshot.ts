/** @format */

import fs from "fs";
import path from "path";
import screenshot from "screenshot-desktop";
import sharp from "sharp"; // 🔥 required

/* ============================== */
/* 📁 STORAGE                     */
/* ============================== */

const SCREENSHOT_DIR = path.join(
  __dirname,
  "../../storage/screenshots"
);

function ensureDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

/* ============================== */
/* 📸 CAPTURE + COMPRESS          */
/* ============================== */

export async function captureScreenshot(): Promise<string | null> {
  try {
    ensureDir();

    const filePath = path.join(
      SCREENSHOT_DIR,
      `shot_${Date.now()}.jpg`
    );

    /* 🔥 GET RAW BUFFER */
    const imgBuffer = await screenshot(); // no filename

    /* 🔥 COMPRESS USING SHARP */
    await sharp(imgBuffer)
      .jpeg({ quality: 60 }) // ✅ now allowed
      .toFile(filePath);

    return filePath;
  } catch (err) {
    console.log("❌ Screenshot failed:", err);
    return null;
  }
}
