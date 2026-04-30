/** @format */

/* ============================== */
/* 🧠 INTERNAL STATE              */
/* ============================== */

type ExtensionData = {
  userId?: string;
  organizationId?: string;

  app?: string;
  platform?: string;
  category?: string;

  title?: string;
  domain?: string;

  timestamp: number;

  receivedAt?: number;

  isActive?: boolean;   // 🔥 NEW
  type?: "active" | "passive"; // 🔥 NEW
};

let latestExtensionData: ExtensionData | null = null;

/* ============================== */
/* 🔥 SET DATA (SAFE)             */
/* ============================== */

export function setExtensionData(data: any) {
  if (!data) return;

  const normalized: ExtensionData = {
    userId: data.userId || null,
    organizationId: data.organizationId || null,

    app: data.app || "Browser",
    platform: data.platform || "Browser",
    category: data.category || "neutral",

    title: data.title || "Browser",
    domain: data.domain || null,

    timestamp: data.timestamp || Date.now(),
    receivedAt: Date.now(),

    /* 🔥 IMPORTANT: PRESERVE FROM EXTENSION */
    isActive: data.isActive ?? false,
    type: data.type || "active",
  };

  latestExtensionData = normalized;
}

/* ============================== */
/* 📥 GET DATA (SMART)            */
/* ============================== */

export function getExtensionData() {
  if (!latestExtensionData) return null;

  const now = Date.now();
  const ttl = 3000;

  const receivedDiff = now - (latestExtensionData.receivedAt || 0);

  if (receivedDiff > ttl) return null;

  if (
    typeof latestExtensionData.timestamp !== "number" ||
    now - latestExtensionData.timestamp > ttl
  ) {
    return null;
  }

  /* ============================== */
  /* 🎵 CLEAN TITLE FOR MUSIC       */
  /* ============================== */

  let cleanTitle = latestExtensionData.title;

  if (
    latestExtensionData.platform?.toLowerCase().includes("spotify") ||
    latestExtensionData.domain?.includes("spotify")
  ) {
    cleanTitle = "Music"; // 🔥 your requirement
  }

  return {
    ...latestExtensionData,
    title: cleanTitle,
  };
}

/* ============================== */
/* 🧹 CLEAR                       */
/* ============================== */

export function clearExtensionData() {
  latestExtensionData = null;
}
