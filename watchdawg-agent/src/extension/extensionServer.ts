/** @format */

import cors from "cors";
import express, { Application, Request, Response } from "express";
import http, { Server } from "http";

import { getAuth } from "../services/auth.runtime";
import { setExtensionData } from "./extensionStore";

import { CONFIG } from "../config/config";
import { logger } from "../utils/logger";

/* ============================== */
/* 🧠 INTERNAL STATE              */
/* ============================== */

let app: Application | null = null;
let server: Server | null = null;
let isRunning = false;

/* ============================== */
/* 🔐 AUTH CHECK                  */
/* ============================== */

function isAuthenticated() {
  const { userId, orgId, token } = getAuth();

  if (!userId || !orgId || !token) {
    logger.warn("🚫 Extension blocked (no auth)");
    return false;
  }

  return true;
}

/* ============================== */
/* 🚀 START SERVER                */
/* ============================== */

export function startExtensionServer() {
  if (isRunning) {
    logger.warn("⚠️ Extension server already running");
    return;
  }

  app = express();

  /* ============================== */
  /* 🔐 MIDDLEWARE                 */
  /* ============================== */

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(
    express.json({
      limit: "50kb",
    })
  );

  /* ============================== */
  /* ❤️ HEALTH                     */
  /* ============================== */

  app.get("/health", (_req: Request, res: Response) => {
    const auth = getAuth();

    return res.json({
      status: "ok",
      user: auth.userId || null,
      timestamp: Date.now(),
    });
  });

  /* ============================== */
  /* 🔐 AUTH INFO                  */
  /* ============================== */

  app.get("/auth", (_req: Request, res: Response) => {
    const auth = getAuth();

    return res.json({
      userId: auth.userId,
      organizationId: auth.orgId,
    });
  });

  /* ============================== */
  /* 🧪 TEST ROUTE                 */
  /* ============================== */

  app.post("/test-activity", (req: Request, res: Response) => {
    try {
      const data = req.body;

      logger.info("🧪 TEST PAYLOAD:", data);

      const issues: string[] = [];

      if (!data.userId) issues.push("Missing userId");
      if (!data.organizationId) issues.push("Missing organizationId");
      if (!data.app) issues.push("Missing app");

      if (typeof data.duration !== "number") {
        issues.push("duration not number");
      }

      if (issues.length > 0) {
        return res.json({ success: false, issues });
      }

      return res.json({ success: true });
    } catch (err: any) {
      logger.error("❌ Test error:", err);
      return res.status(500).json({ success: false });
    }
  });

  /* ============================== */
  /* 📥 EXTENSION DATA             */
  /* ============================== */

  app.post("/extension-data", (req: Request, res: Response) => {
    try {
      if (!isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const data = req.body;

      if (!data || !data.platform || !data.timestamp) {
        return res.status(400).json({
          success: false,
          error: "Invalid payload",
        });
      }

      setExtensionData(data);

      logger.info(
        "🌐 EXT:",
        data.platform,
        "|",
        data.title || "-",
        "|",
        data.category || "-"
      );

      return res.json({ success: true });
    } catch (err) {
      logger.error("❌ Extension error:", err);
      return res.status(500).json({
        success: false,
      });
    }
  });

  /* ============================== */
  /* 🔐 SET USER (SYNC)            */
  /* ============================== */

  app.post("/set-user", (req: Request, res: Response) => {
    try {
      const { userId, organizationId } = req.body;

      if (!userId || !organizationId) {
        return res.status(400).json({
          success: false,
          error: "Invalid user data",
        });
      }

      logger.success("✅ Agent user synced:", userId);

      /* 🔥 VERIFY MATCH WITH RUNTIME */
      const auth = getAuth();

      if (auth.userId !== userId) {
        logger.warn("⚠️ Extension/auth mismatch");
      }

      return res.json({ success: true });
    } catch (err) {
      logger.error("❌ set-user error:", err);
      return res.status(500).json({ success: false });
    }
  });

  /* ============================== */
  /* ▶️ START TRACKING              */
  /* ============================== */

  app.post("/start", (_req: Request, res: Response) => {
    try {
      if (!isAuthenticated()) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      if ((global as any).START_SERVICES) {
        (global as any).START_SERVICES();
        logger.success("🚀 Tracking started");
      }

      return res.json({ success: true });
    } catch (err) {
      logger.error("❌ Start error:", err);
      return res.status(500).json({ success: false });
    }
  });

  /* ============================== */
  /* 🛑 LOGOUT                     */
  /* ============================== */

  app.post("/logout", (_req: Request, res: Response) => {
    try {
      logger.warn("🛑 Extension requested logout");

      /* 🔥 STOP TRACKING */
      if ((global as any).LOGOUT) {
        (global as any).LOGOUT();
      }

      /* 🔥 CLEAR AUTH */
      if ((global as any).CLEAR_AUTH) {
        (global as any).CLEAR_AUTH();
      }

      logger.warn("🛑 Agent fully stopped");

      return res.json({ success: true });
    } catch (err) {
      logger.error("❌ Logout error:", err);
      return res.status(500).json({ success: false });
    }
  });

  /* ============================== */
  /* 🚀 START LISTEN               */
  /* ============================== */

  const port = CONFIG.EXTENSION.PORT;

  server = http.createServer(app);

  server.listen(port, () => {
    isRunning = true;

    logger.success(
      `🚀 Extension bridge running → http://localhost:${port}`
    );
  });

  /* 🔥 SAFETY CLEANUP */
  process.on("exit", () => {
    if (server) server.close();
  });
}

/* ============================== */
/* 🛑 STOP SERVER                 */
/* ============================== */

export function stopExtensionServer() {
  if (!server || !isRunning) {
    logger.warn("⚠️ Extension server not running");
    return;
  }

  server.close(() => {
    isRunning = false;
    server = null;
    app = null;

    logger.warn("🛑 Extension server stopped");
  });
}
