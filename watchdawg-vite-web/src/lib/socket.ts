/** @format */

import { io, Socket } from "socket.io-client";

/* ============================== */
/* 🌍 SINGLETON STATE             */
/* ============================== */

let socket: Socket | null = null;

let currentOrgId: string | null = null;
let currentUserId: string | null = null;
let currentRole: "admin" | "employee" | "superadmin" | null = null;
let currentToken: string | null = null;

/* ============================== */
/* 🧠 DEBUG LOGGER                */
/* ============================== */

const log = (...args: any[]) => {
  console.log("🔌 [SOCKET]", ...args);
};

/* ============================== */
/* 🔁 JOIN ROOMS (SAFE)           */
/* ============================== */

const joinRooms = () => {
  if (!socket || !currentOrgId) {
    log("⚠️ Cannot join rooms (missing data)");
    return;
  }

  if (currentRole === "employee") {
    log("👤 Joining employee room", {
      orgId: currentOrgId,
      userId: currentUserId,
    });

    socket.emit("join_employee", {
      orgId: currentOrgId,
      userId: currentUserId,
    });
  }

  if (currentRole === "admin" || currentRole === "superadmin") {
    log("👑 Joining admin room", {
      orgId: currentOrgId,
    });

    socket.emit("join_admin", currentOrgId);
  }
};

/* ============================== */
/* 🚀 CREATE SOCKET               */
/* ============================== */

const createSocket = (): Socket => {
  log("⚙️ Creating socket instance");

  const s = io("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    auth: {
      token: currentToken, // ✅ ALWAYS correct at creation
    },
  });

  /* ============================== */
  /* 🔌 EVENTS                     */
  /* ============================== */

  s.on("connect", () => {
    log("🟢 CONNECTED", {
      id: s.id,
      orgId: currentOrgId,
      userId: currentUserId,
      role: currentRole,
    });

    joinRooms(); // ✅ safe
  });

  s.on("disconnect", (reason) => {
    log("🔴 DISCONNECTED", reason);
  });

  s.on("connect_error", (err) => {
    log("❌ CONNECT ERROR", err.message);
  });

  s.on("reconnect", () => {
    log("♻️ RECONNECTED");
    joinRooms(); // ✅ rejoin safely
  });

  return s;
};

/* ============================== */
/* 🚀 GET SOCKET                  */
/* ============================== */

export const getSocket = (): Socket => {
  if (!socket) {
    socket = createSocket();
  }

  return socket;
};

/* ============================== */
/* 🔥 INIT SOCKET                 */
/* ============================== */

export const initSocket = ({
  orgId,
  userId,
  role,
  token,
}: {
  orgId: string;
  userId?: string;
  role: "admin" | "employee" | "superadmin";
  token?: string;
}) => {
  if (!orgId) {
    console.error("❌ [SOCKET] orgId missing");
    return;
  }

  /* ============================== */
  /* 🔥 SET STATE FIRST             */
  /* ============================== */

  currentOrgId = orgId;
  currentUserId = userId || null;
  currentRole = role;
  currentToken = token || null;

  log("🚀 INIT SOCKET", {
    orgId,
    userId,
    role,
    hasToken: !!token,
  });

  /* ============================== */
  /* 🔄 RESET SOCKET IF EXISTS      */
  /* ============================== */

  if (socket) {
    log("♻️ Resetting existing socket");

    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  /* ============================== */
  /* 🆕 CREATE NEW SOCKET           */
  /* ============================== */

  socket = createSocket();

  /* ============================== */
  /* 🔌 CONNECT                     */
  /* ============================== */

  socket.connect();
};

/* ============================== */
/* 🧹 CLEANUP                     */
/* ============================== */

export const disconnectSocket = () => {
  if (socket) {
    log("🧹 Disconnecting socket");

    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentOrgId = null;
  currentUserId = null;
  currentRole = null;
  currentToken = null;
};
