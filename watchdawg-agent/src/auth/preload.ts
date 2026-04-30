/** @format */

import { contextBridge, ipcRenderer } from "electron";

/* ============================== */
/* ⚙️ STATIC CONFIG (SAFE)        */
/* ============================== */

const AGENT_URL = "http://localhost:6969";

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
};

/* ============================== */
/* 🧠 SAFE FETCH HELPER           */
/* ============================== */

async function safePost<T = unknown>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("❌ API Error:", res.status, url);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error("❌ Network Error:", url, err);
    return { success: false };
  } finally {
    clearTimeout(timeout);
  }
}

/* ============================== */
/* 🌉 CONTEXT BRIDGE              */
/* ============================== */

contextBridge.exposeInMainWorld("electronAPI", {
  /* 🔐 SET AUTH */
  setAuth: async (
    userId: string,
    orgId: string,
    token: string,
    firstLogin: boolean
  ) => {
    if (!userId || !orgId || !token) {
      console.warn("⚠️ Invalid auth payload");
      return { success: false };
    }

    /* 🔥 MAIN PROCESS */
    await ipcRenderer.invoke("set-auth", {
      userId,
      orgId,
      token,
      firstLogin,
    });

    /* 🔥 AGENT ENGINE */
    return safePost(`${AGENT_URL}/set-user`, {
      userId,
      organizationId: orgId,
    });
  },

  /* 🔑 TOKEN */
  getToken: async (): Promise<string | null> => {
    return ipcRenderer.invoke("get-token");
  },

  /* ▶️ START TRACKING */
  startTracking: async () => {
    ipcRenderer.send("start-tracking");

    return safePost(`${AGENT_URL}/start`);
  },

  /* 🛑 LOGOUT */
  logout: async () => {
    ipcRenderer.send("logout");

    return safePost(`${AGENT_URL}/logout`);
  },

  /* 📄 NAVIGATION */
  loadLogin: () => ipcRenderer.send("load-login"),
  loadChangePassword: () =>
    ipcRenderer.send("load-change-password"),
  loadConsent: () => ipcRenderer.send("load-consent"),
  loadDashboard: () => ipcRenderer.send("load-dashboard"),

  /* 🔄 RELOAD */
  reloadApp: () => {
    window.location.reload();
  },
});
