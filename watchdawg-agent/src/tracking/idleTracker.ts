/** @format */

import { powerMonitor } from "electron";

/* ===================================== */
/* ⚙️ CONFIG (TUNABLE)                  */
/* ===================================== */

const IDLE_THRESHOLD = 60;   // 1 min
const AWAY_THRESHOLD = 300;  // 5 min

/* ===================================== */
/* 🧠 INTERNAL STATE                    */
/* ===================================== */

let lastStatus: "active" | "idle" | "away" = "active";
let lastChangeTime = Date.now();

/* ===================================== */
/* 🚀 SMART STATUS RESOLVER             */
/* ===================================== */

export function getStatus(): "active" | "idle" | "away" {
  try {
    const idleSeconds = powerMonitor.getSystemIdleTime();
    const now = Date.now();

    let nextStatus: "active" | "idle" | "away";

    /* ============================== */
    /* 🎯 RAW STATUS FROM OS          */
    /* ============================== */

    if (idleSeconds >= AWAY_THRESHOLD) {
      nextStatus = "away";
    } else if (idleSeconds >= IDLE_THRESHOLD) {
      nextStatus = "idle";
    } else {
      nextStatus = "active";
    }

    /* ============================== */
    /* 🧠 TRANSITION CONTROL          */
    /* ============================== */

    // 🔥 prevent instant idle → away jump
    if (
      lastStatus === "active" &&
      nextStatus === "away"
    ) {
      nextStatus = "idle";
    }

    /* ============================== */
    /* 🔄 STATE UPDATE                */
    /* ============================== */

    if (nextStatus !== lastStatus) {
      lastStatus = nextStatus;
      lastChangeTime = now;

      console.log("🔄 Status changed →", nextStatus);
    }

    return lastStatus;
  } catch (err) {
    console.log("❌ Idle detection error:", err);
    return lastStatus;
  }
}
