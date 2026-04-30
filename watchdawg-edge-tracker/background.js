/** @format */

console.log("🔥 Background Service Worker Started");

/* ============================== */
/* ⚙️ STATE                       */
/* ============================== */

let USER_ID = null;
let ORG_ID = null;

let LAST_KEY = null;
let LAST_SENT = 0;

/* ============================== */
/* 🔐 LOAD AUTH                   */
/* ============================== */

async function loadUser() {
  try {
    const res = await fetch("http://localhost:6969/auth");
    const data = await res.json();

    if (data.userId && data.organizationId) {
      USER_ID = data.userId;
      ORG_ID = data.organizationId;
      console.log("✅ Auth loaded");
    }
  } catch {
    console.log("⚠️ Auth fetch failed");
  }
}

setInterval(loadUser, 5000);
loadUser();

/* ============================== */
/* 📡 SEND TO AGENT               */
/* ============================== */

async function sendToAgent(payload) {
  if (!USER_ID || !ORG_ID) return;

  try {
    await fetch("http://localhost:6969/extension-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    console.log("❌ Failed to send");
  }
}

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function safeParseUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  if (!raw.startsWith("http")) return null;

  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function normalizeDomain(domain) {
  if (!domain) return "Browser";

  const d = domain.toLowerCase();

  if (d.includes("youtube")) return "YouTube";
  if (d.includes("spotify")) return "Spotify";
  if (d.includes("github")) return "GitHub";
  if (d.includes("stackoverflow")) return "StackOverflow";

  return d.split(".")[0] || "Browser";
}

function getCategory(platform) {
  const p = (platform || "").toLowerCase();

  if (["github", "stackoverflow"].includes(p)) return "productive";
  if (["youtube", "spotify"].includes(p)) return "distracting";

  return "neutral";
}

function isMusicDomain(domain) {
  const d = domain.toLowerCase();

  return (
    d.includes("spotify") ||
    d.includes("youtube.com") ||
    d.includes("music.youtube") ||
    d.includes("gaana") ||
    d.includes("jiosaavn") ||
    d.includes("wynk")
  );
}

/* ============================== */
/* 🧠 CORE TRACKER                */
/* ============================== */

async function trackTab(tab) {
  /* 🔥 BLOCK BEFORE AUTH */
  if (!USER_ID || !ORG_ID) return;
  if (!tab || !tab.url) return;

  /* ❌ skip invalid URLs */
  if (
    !tab.url.startsWith("http") ||
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("edge://") ||
    tab.url.startsWith("about:")
  ) {
    return;
  }

  const parsed = safeParseUrl(tab.url);
  if (!parsed) return;

  const domain = parsed.hostname;

  /* ============================== */
  /* 🎯 PLATFORM + CATEGORY         */
  /* ============================== */

  const platform = normalizeDomain(domain);
  const category = getCategory(platform);

  /* ============================== */
  /* 🔥 ACTIVE CHECK               */
  /* ============================== */

  let isActive = false;

  try {
    const win = await chrome.windows.get(tab.windowId);
    isActive = tab.active && !tab.discarded && win.focused;
  } catch {
    isActive = false;
  }

  /* ============================== */
  /* 🎵 MUSIC DETECTION (FIXED)     */
  /* ============================== */

  const isMusicSite = isMusicDomain(domain);

  // 🔥 ONLY TRUE WHEN AUDIO IS PLAYING
  const isPlaying = tab.audible === true;

  const isMusic = isMusicSite && isPlaying;

  /* ❌ ignore useless tabs */
  if (!isActive && !isMusic) return;

  /* ============================== */
  /* 🎯 TITLE                      */
  /* ============================== */

  const title = isMusic ? "Music" : "Browsing";

  /* ============================== */
  /* 🔁 DEDUP                      */
  /* ============================== */

  const key = `${platform}-${title}-${isActive}-${isMusic}`;
  const now = Date.now();

  if (key === LAST_KEY && now - LAST_SENT < 1000) return;

  LAST_KEY = key;
  LAST_SENT = now;

  /* ============================== */
  /* 📦 PAYLOAD                    */
  /* ============================== */

  const payload = {
    userId: USER_ID,
    organizationId: ORG_ID,

    app: "Browser",
    platform,
    category,

    domain,
    title,

    isActive,
    type: isActive ? "active" : "passive",

    source: "extension",
    timestamp: now,
  };

  console.log("🚀 EXT:", payload);

  sendToAgent(payload);
}

/* ============================== */
/* 🔥 EVENT LISTENERS             */
/* ============================== */

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    trackTab(tab);
  } catch {}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    trackTab(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      windowId,
    });

    if (tab) trackTab(tab);
  } catch {}
});

/* ============================== */
/* 🔥 HEARTBEAT (OPTIMIZED)       */
/* ============================== */

setInterval(async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (tab) trackTab(tab);
  } catch {}
}, 2000);
