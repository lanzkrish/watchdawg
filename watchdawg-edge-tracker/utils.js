/* ============================== */
/* 🌐 DOMAIN NORMALIZER (V5)      */
/* ============================== */

function normalizeDomain(domain) {
  if (!domain) return "Browser";

  const clean = domain
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/^open\./, "");

  const parts = clean.split(".");

  let root = parts[0];

  if (parts.length >= 2) {
    root = parts[parts.length - 2];

    // handle co.in / com.au etc
    if (root.length <= 3 && parts.length >= 3) {
      root = parts[parts.length - 3];
    }
  }

  /* ============================== */
  /* 🔥 STRICT PLATFORM MAP         */
  /* ============================== */

  const PLATFORM_MAP = {
    "youtube.com": "YouTube",
    "music.youtube.com": "YouTube Music",
    "spotify.com": "Spotify",

    "github.com": "GitHub",

    "chat.openai.com": "ChatGPT",
    "openai.com": "ChatGPT",

    "netflix.com": "Netflix",
    "instagram.com": "Instagram",
    "facebook.com": "Facebook",
    "twitter.com": "Twitter",
    "x.com": "Twitter",

    "linkedin.com": "LinkedIn",
    "web.whatsapp.com": "WhatsApp",

    "notion.so": "Notion",
    "figma.com": "Figma",
    "slack.com": "Slack",
    "zoom.us": "Zoom",

    "teams.microsoft.com": "Microsoft Teams",
    "outlook.live.com": "Outlook",
    "mail.google.com": "Gmail",

    "drive.google.com": "Google Drive",
    "docs.google.com": "Google Docs",
    "sheets.google.com": "Google Sheets",
  };

  /* ============================== */
  /* 🔥 EXACT + SUBDOMAIN MATCH     */
  /* ============================== */

  for (const key in PLATFORM_MAP) {
    if (clean === key || clean.endsWith("." + key)) {
      return PLATFORM_MAP[key];
    }
  }

  /* ============================== */
  /* 🧠 FALLBACK                    */
  /* ============================== */

  return capitalize(root);
}

/* ============================== */
/* 📊 CATEGORY ENGINE (SAFE)      */
/* ============================== */

function getCategory(platform) {
  const p = (platform || "").toLowerCase();

  const distracting = [
    "youtube",
    "youtube music",
    "spotify",
    "netflix",
    "instagram",
    "facebook",
    "twitter",
  ];

  const productive = [
    "github",
    "chatgpt",
    "notion",
    "figma",
    "slack",
    "zoom",
    "microsoft teams",
    "outlook",
    "gmail",
    "google docs",
    "google sheets",
    "google drive",
  ];

  if (distracting.includes(p)) return "distracting";
  if (productive.includes(p)) return "productive";

  return "neutral";
}

/* ============================== */
/* 🎵 MUSIC DETECTION             */
/* ============================== */

function isMusicPlatform(platform) {
  const p = (platform || "").toLowerCase();

  return p === "spotify" || p === "youtube music";
}

/* ============================== */
/* 🧹 TITLE CLEANER (IMPROVED)    */
/* ============================== */

function cleanTitle(title) {
  if (!title) return "";

  let clean = title.trim();

  /* REMOVE NOISE */
  clean = clean.replace(/^\(\d+\)\s*/, "");
  clean = clean.replace(/and \d+ more pages/gi, "");
  clean = clean.replace(/ - YouTube$/i, "");
  clean = clean.replace(/ - Spotify$/i, "");
  clean = clean.replace(/ - Google Chrome$/i, "");
  clean = clean.replace(/ - Microsoft Edge$/i, "");

  /* LIMIT LENGTH */
  if (clean.length > 80) {
    clean = clean.slice(0, 80) + "...";
  }

  return clean.trim();
}

/* ============================== */
/* 🧠 TITLE BUILDER               */
/* ============================== */

function buildTitle(platform, rawTitle) {
  if (isMusicPlatform(platform)) {
    return "Music";
  }

  const cleaned = cleanTitle(rawTitle);

  return cleaned || platform || "Unknown";
}

/* ============================== */
/* 🔠 CAPITALIZE                  */
/* ============================== */

function capitalize(str) {
  if (!str) return "Unknown";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ============================== */
/* 📤 EXPORTS                     */
/* ============================== */

self.normalizeDomain = normalizeDomain;
self.getCategory = getCategory;
self.isMusicPlatform = isMusicPlatform;
self.buildTitle = buildTitle;
