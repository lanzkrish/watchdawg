/** @format */

import {
  getMusicDuration,
  updateBackground,
} from "../tracking/backgroundTracker";
import { getStatus } from "../tracking/idleTracker";
import { getActiveApp } from "../tracking/systemTracker";

import { mergeActivity } from "./merger";

import { sendActivity } from "../communication/api";
import { sendSocket } from "../communication/socket";

import { getExtensionData } from "../extension/extensionStore";

import { CONFIG } from "../config/config";
import { logger } from "../utils/logger";

/* ===================================== */
/* 🚀 START ENGINE (FINAL STABLE)        */
/* ===================================== */

export function startEngine(userId: string, orgId: string) {
  let lastSent = Date.now();

  let lastKey: string | null = null;
  let lastPayload: any = null;

  let bufferDuration = 0;
  let lastTick = Date.now();

  let timer: NodeJS.Timeout;

  let waitStart = 0;

  timer = setInterval(async () => {
    try {
      const active = await getActiveApp();
      if (!active) return;

      const status = getStatus();
      const now = Date.now();

      /* ============================== */
      /* ⏱ DELTA TIME                  */
      /* ============================== */

      const delta = Math.max(1, Math.floor((now - lastTick) / 1000));
      lastTick = now;

      if (status === "active") {
        bufferDuration += delta;
      }

      /* ============================== */
      /* 🎵 BACKGROUND TRACKER          */
      /* ============================== */

      updateBackground(now);
      const musicDuration = getMusicDuration(now);

      /* ============================== */
      /* 🌐 EXTENSION WAIT              */
      /* ============================== */

      const isBrowser =
        active.app?.toLowerCase().includes("chrome") ||
        active.app?.toLowerCase().includes("edge") ||
        active.app?.toLowerCase().includes("firefox");

      if (isBrowser) {
        if (!waitStart) waitStart = now;

        if (now - waitStart < 1200) {
          logger.info("⏳ Waiting for extension sync...");
          return;
        }
      } else {
        waitStart = 0;
      }

      /* ============================== */
      /* 🔀 MERGE                      */
      /* ============================== */

      const merged = mergeActivity(active);

      /* ============================== */
      /* 🔑 SEGMENT KEY                */
      /* ============================== */

      const currentKey = [
        merged.app,
        merged.platform,
        merged.title,
        merged.category,
        status,
      ].join("|");

      const isSame = currentKey === lastKey;

      /* ============================== */
      /* 🔄 SEGMENT CHANGE              */
      /* ============================== */

      if (!isSame && lastPayload && bufferDuration > 0) {
        await sendActivity({
          ...lastPayload,
          duration: bufferDuration,
        });

        logger.info(
          "🔄 Segment saved:",
          lastKey,
          bufferDuration,
          "sec"
        );

        bufferDuration = 0; // ✅ ONLY RESET HERE
      }

      /* ============================== */
      /* 🎵 BACKGROUND (FINAL FIX)      */
      /* ============================== */

      let background: any = undefined;

      const ext = getExtensionData();

      if (
        ext &&
        ext.platform &&
        typeof ext.timestamp === "number" &&
        now - ext.timestamp < 10000 && // ✅ increased tolerance
        musicDuration > 0
      ) {
        const p = ext.platform.toLowerCase();

        const isMusic =
          p.includes("spotify") ||
          p.includes("youtube") ||
          p.includes("music");

        const isSameAsForeground =
          merged.platform &&
          merged.platform.toLowerCase() === p;

        if (isMusic && !isSameAsForeground) {
          background = {
            app: ext.platform,
            type: "music",
            duration: musicDuration,
          };
        }
      }

      /* ============================== */
      /* 📦 PAYLOAD                    */
      /* ============================== */

      const payload = {
        userId,
        organizationId: orgId,

        app: merged.app,
        title: merged.title || undefined,

        platform: merged.platform || merged.app,
        domain: merged.domain || undefined,

        category: merged.category,
        status,

        duration: bufferDuration,

        background,
        timestamp: now,
      };

      /* ============================== */
      /* ⚡ SOCKET                     */
      /* ============================== */

      sendSocket(payload);

      /* ============================== */
      /* 💾 PERIODIC SAVE              */
      /* ============================== */

      if (now - lastSent >= CONFIG.TRACKING.SAVE_INTERVAL) {
        if (bufferDuration > 0) {
          await sendActivity({
            ...payload,
            duration: bufferDuration,
          });

          logger.info(
            "💾 Periodic save:",
            payload.app,
            bufferDuration,
            "sec"
          );

          // ❌ DO NOT RESET HERE
          lastSent = now;
        }
      }

      /* ============================== */
      /* 🧾 DEBUG                      */
      /* ============================== */

      logger.info(
        "👀",
        payload.app,
        "|",
        payload.title,
        "|",
        payload.category,
        "|",
        payload.status,
        "| ⏱",
        bufferDuration,
        "sec",
        background ? "| 🎵 " + background.app : ""
      );

      lastKey = currentKey;
      lastPayload = payload;

    } catch (err) {
      logger.error("❌ Engine error:", err);
    }
  }, CONFIG.TRACKING.LOOP_INTERVAL);

  /* ============================== */
  /* 🛑 CLEANUP                     */
  /* ============================== */

  return async () => {
    clearInterval(timer);

    if (lastPayload && bufferDuration > 0) {
      await sendActivity({
        ...lastPayload,
        duration: bufferDuration,
      });

      logger.info("💾 Final flush:", bufferDuration, "sec");
    }

    logger.warn("🛑 Engine stopped");
  };
}
