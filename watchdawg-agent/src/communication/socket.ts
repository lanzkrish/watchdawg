/** @format */

import { io, Socket } from "socket.io-client";
import { CONFIG } from "../config/config";
import { logger } from "../utils/logger";

/* ============================== */
/* 🧠 INTERNAL STATE              */
/* ============================== */

let socket: Socket | null = null;
let isConnecting = false;
let isActive = false; // 🔥 NEW (auth control)

/* 🔥 offline queue */
let queue: any[] = [];

/* ============================== */
/* 🚀 INIT SOCKET (SAFE)          */
/* ============================== */

export function initSocket(userId: string, orgId: string) {
  if (socket && socket.connected) {
    logger.info("ℹ️ Socket already connected");
    return socket;
  }

  if (isConnecting) return;

  isConnecting = true;
  isActive = true; // 🔥 enable sending

  socket = io(CONFIG.API.URL, {
    transports: ["websocket"],

    auth: {
      userId,
      organizationId: orgId,
    },

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    timeout: 5000,
  });

  /* ============================== */
  /* 🔥 EVENTS                      */
  /* ============================== */

  socket.on("connect", () => {
    logger.success("🟢 Socket connected:", socket?.id);

    isConnecting = false;

    socket?.emit("join_employee", orgId);

    flushQueue();
  });

  socket.on("disconnect", (reason) => {
    logger.warn("🔴 Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    isConnecting = false;
    logger.error("❌ Socket error:", err.message);
  });

  return socket;
}

/* ============================== */
/* 📤 SEND REAL-TIME (SMART)      */
/* ============================== */

export function sendSocket(data: any) {
  /* 🔥 BLOCK IF LOGGED OUT */
  if (!isActive) {
    logger.warn("⛔ Socket inactive (logged out)");
    return false;
  }

  if (!socket || !socket.connected) {
    queue.push(data);

    logger.warn(
      `⚠️ Socket offline → queued (${queue.length})`
    );

    return false;
  }

  try {
    socket.emit("agent_activity", data, (ack: any) => {
      if (!ack?.success) {
        logger.warn("⚠️ Socket delivery failed → requeue");

        queue.push(data);
      }
    });

    return true;
  } catch (err) {
    logger.error("❌ Socket send error:", err);

    queue.push(data);

    return false;
  }
}

/* ============================== */
/* 🔄 FLUSH QUEUE                 */
/* ============================== */

function flushQueue() {
  if (!socket || !socket.connected) return;
  if (!queue.length) return;

  logger.info(`🚀 Flushing ${queue.length} queued events`);

  while (queue.length > 0) {
    const data = queue.shift();
    socket.emit("agent_activity", data);
  }
}

/* ============================== */
/* 🛑 DISCONNECT (LOGOUT SAFE)    */
/* ============================== */

export function disconnectSocket() {
  logger.warn("🛑 Disconnecting socket...");

  isActive = false;        // 🔥 block future sends
  isConnecting = false;    // 🔥 reset state
  queue = [];              // 🔥 clear old data

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  logger.info("🔌 Socket fully closed");
}
