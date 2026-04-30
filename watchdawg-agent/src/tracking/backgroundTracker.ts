/** @format */

import { state } from "../core/state";
import { getExtensionData } from "../extension/extensionStore";
import { seconds } from "../utils/time";

/* ===================================== */
/* 🎵 UPDATE BACKGROUND STATE (V5)       */
/* ===================================== */

export function updateBackground(now: number) {
  const ext = getExtensionData();

  /* ============================== */
  /* 🎯 SMART DETECTION             */
  /* ============================== */

  const isMusic =
    ext &&
    ext.category === "distracting" &&
    (ext.platform?.toLowerCase().includes("spotify") ||
      ext.platform?.toLowerCase().includes("youtube"));

  /* ============================== */
  /* 🎵 START MUSIC                 */
  /* ============================== */

  if (isMusic) {
    if (!state.music.app) {
      state.music.app = ext.platform || "Music";
      state.music.startTime = now;
      state.music.total = 0; // 🔥 RESET PER SESSION

      console.log("🎵 Music started:", state.music.app);
    }
  }

  /* ============================== */
  /* ⏹ STOP MUSIC                  */
  /* ============================== */

  else {
    if (state.music.app) {
      const duration = seconds(state.music.startTime, now);

      state.music.total += duration;

      console.log(
        "⏹ Music stopped:",
        state.music.app,
        "|",
        duration,
        "sec"
      );

      /* 🔥 FREEZE FINAL VALUE */
      state.music.startTime = 0;
      state.music.app = null;
    }
  }
}

/* ===================================== */
/* 📊 GET CURRENT MUSIC DURATION (SAFE)  */
/* ===================================== */

export function getMusicDuration(now: number) {
  if (!state.music.app && state.music.total === 0) {
    return 0;
  }

  let total = state.music.total;

  /* 🔥 ADD LIVE RUNNING TIME */
  if (state.music.app && state.music.startTime) {
    total += seconds(state.music.startTime, now);
  }

  return total;
}

/* ===================================== */
/* 🔄 RESET MUSIC (ON SEGMENT CHANGE)    */
/* ===================================== */

export function resetMusic() {
  state.music = {
    app: null,
    startTime: 0,
    total: 0,
  };
}
