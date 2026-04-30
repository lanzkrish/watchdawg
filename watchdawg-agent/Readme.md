🧠 WatchDawg Agent

A lightweight desktop monitoring agent that captures real-time system activity and streams it to the WatchDawg backend via a secure local bridge.

---

🚀 Overview

WatchDawg Agent is the core engine of the WatchDawg system. It runs on the user's machine and is responsible for collecting activity data, managing sessions, and communicating with backend services.

It also acts as a bridge between the browser extension and backend, enabling real-time monitoring.

---

🏗️ Architecture

Extension → Agent → Backend → Database

- Extension → Captures browser activity
- Agent → Processes system + browser data
- Backend → Stores & analyzes data
- Database → Persistent storage

---

⚡ Features

- 🖥️ Tracks active applications (VS Code, Chrome, etc.)
- ⏱ Measures active, idle, and away durations
- 🔐 Handles authentication with backend
- 🔌 Provides local bridge for extension (port 6969)
- 📡 Sends activity data to backend APIs
- 🔄 Smart batching & interval-based syncing
- 🧠 Idle & away detection engine
- ⚙️ Fully modular and scalable architecture

---

📂 Project Structure

watchdawg-agent/
├── src/
│   ├── auth/
│   ├── communication/
│   ├── config/
│   ├── core/
│   ├── extension/
│   ├── ipc/
│   ├── screenshot/
│   ├── services/
│   ├── tracking/
│   ├── types/
│   ├── utils/
│   ├── windows/
│   └── main.ts
├── public/
├── dist/
├── .env.example
├── package.json
├── tsconfig.json

---

⚙️ Setup

1. Install dependencies

npm install

---

2. Configure environment

Copy the example file:

cp .env.example .env

Update values if needed:

API_URL=http://localhost:5000

EXTENSION_PORT=6969
EXTENSION_TTL=10000

TRACK_INTERVAL=1000
SAVE_INTERVAL=5000
SOCKET_INTERVAL=2000

IDLE_THRESHOLD=60
AWAY_THRESHOLD=300

NODE_ENV=development

---

3. Run the agent

Development:

npm run dev

Production:

npm run build
npm start

---

🔌 Requirements

This agent depends on:

- watchdawg-backend running on port 5000
- PostgreSQL database (via backend)
- watchdawg-extension (optional but recommended)

---

📡 API Communication

- GET /auth → fetch user session
- POST /tracking/activity → send activity data

---

🔄 How It Works

1. Agent starts and authenticates with backend
2. Tracks active window and user interaction
3. Calculates activity status (active / idle / away)
4. Receives browser data from extension
5. Merges system + browser activity
6. Sends structured data to backend at intervals

---

⚠️ Important Notes

- Agent must be running for extension to work
- Uses local HTTP bridge (localhost:6969)
- Designed for real-time systems (not polling)
- Handles rate limiting and cooldown internally

---

📈 Future Improvements

- Screenshot capture system
- Deep application analytics
- Background process tracking
- Auto-start on system boot
- Cross-platform packaging (EXE / DMG)

---

👨‍💻 Author

Part of WatchDawg – Scalable Real-Time Telemetry & Analytics Engine

---

📄 License

MIT
