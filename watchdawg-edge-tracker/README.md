🌐 WatchDawg Edge Extension

A real-time Microsoft Edge (Chromium) extension that captures browser activity and streams it to the WatchDawg desktop agent.

Designed as part of a multi-layer monitoring system, this extension performs intelligent tracking with deduplication, activity detection, and media awareness.

---

🚀 Key Features

- 🔍 Tracks active browser tabs (event-driven)
- 🎯 Detects real user activity (window focus + tab state)
- 🎵 Detects media playback (YouTube, Spotify, etc.)
- 🧠 Categorizes activity (productive / neutral / distracting)
- ⚡ Sends real-time data to local desktop agent
- 🔁 Smart deduplication (prevents spam events)
- 🔐 Auto-syncs user identity from agent

---

🧠 Architecture

Edge Browser
   ↓
Extension (background service worker)
   ↓
Local Agent (http://localhost:6969)
   ↓
Backend (WebSocket)
   ↓
Dashboard

---

⚙️ Core System Design

1. Authentication Sync

- Periodically fetches user session from local agent
- Ensures every event is tied to:
  - "userId"
  - "organizationId"

---

2. Event-Based Tracking (No Polling Spam)

Triggers activity on:

- Tab switch → "chrome.tabs.onActivated"
- Page load → "chrome.tabs.onUpdated"
- Window focus → "chrome.windows.onFocusChanged"
- Fallback heartbeat → every 2s

---

3. Smart Activity Detection

A tab is considered active only if:

- Tab is focused
- Window is focused
- Tab is not discarded

---

4. Media Detection (Important Feature)

Detects real background activity:

- YouTube
- Spotify
- Gaana / JioSaavn / Wynk

Only triggers when:

tab.audible === true

---

5. Deduplication Engine

Prevents unnecessary spam:

Same activity within 1 second → ignored

This keeps:

- Backend clean
- Network usage minimal
- System scalable

---

6. Platform Normalization

Converts domains into meaningful platforms:

Domain| Platform
youtube.com| YouTube
github.com| GitHub
spotify.com| Spotify

---

7. Activity Classification

Platform| Category
GitHub, StackOverflow| productive
YouTube, Spotify| distracting
Others| neutral

---

📦 Example Payload

{
  "userId": "u123",
  "organizationId": "org1",

  "app": "Browser",
  "platform": "YouTube",
  "category": "distracting",

  "domain": "youtube.com",
  "title": "Music",

  "isActive": true,
  "type": "active",

  "source": "extension",
  "timestamp": 1710000000
}

---

📁 Project Structure

watchdawg-extension/
├── manifest.json       # Extension configuration (MV3)
├── background.js       # Core tracking engine

---

⚙️ Installation (Microsoft Edge)

1. Open Edge
2. Go to: "edge://extensions"
3. Enable Developer Mode
4. Click Load unpacked
5. Select the extension folder

---

🔌 Local Agent Integration

The extension communicates with a local agent:

http://localhost:6969

Endpoints used:

- "/auth" → fetch user session
- "/extension-data" → send activity

---

🔐 Permissions

- "tabs" → detect active tab
- "activeTab" → access tab details
- "scripting" → runtime execution
- "storage" → optional persistence

---

⚠️ Important Notes

- ❗ Does NOT connect directly to backend
- ✅ Uses local agent as a bridge
- ⚡ Designed for real-time systems (event-driven, not polling)
- 🧠 Optimized to reduce redundant data

---

📈 Roadmap

- [ ] Cross-browser support (Chrome, Firefox)
- [ ] AI-based categorization
- [ ] Extension popup dashboard
- [ ] Domain-level analytics
- [ ] Idle detection

---

👨‍💻 Author

Part of the WatchDawg Real-Time Monitoring System

---

📄 License

MIT License
