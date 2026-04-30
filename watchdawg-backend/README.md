<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" />
</p><h1 align="center">🚀 WatchDawg Backend</h1><p align="center">
Scalable real-time telemetry and analytics backend for monitoring user activity, system behavior, and productivity insights.
</p>---

🧠 Overview

WatchDawg Backend is the central processing system of the WatchDawg platform.
It receives activity data from the agent, processes it, stores it securely, and provides APIs for dashboards and analytics.

---

🏗️ Architecture

Agent → Backend → Database
Frontend → Backend

- Agent → Sends real-time activity
- Backend → Processes & stores data
- Database → PostgreSQL (persistent storage)
- Frontend → Fetches analytics & activity

---

⚡ Features

- 🔐 JWT-based authentication (Passport)
- 🧠 Activity processing & normalization
- 📊 Productivity classification (productive / neutral / distracting)
- ⏱ Time tracking (active / idle / away)
- 🏢 Multi-organization support
- 👥 Role-based system (Admin / Employee / Super Admin)
- 📡 REST API for dashboard & analytics
- ⚡ Rate limiting & cooldown handling
- 🧩 Modular architecture (NestJS)

---

📂 Project Structure

src/
├── auth/ # Authentication (JWT, Passport)
├── users/ # User management
├── organization/ # Org management
├── tracking/ # Activity tracking APIs
├── employee/ # Employee activity APIs
├── common/ # Shared utilities
├── config/ # Env & config
├── database/ # DB setup & connection
└── main.ts # Entry point

---

⚙️ Setup

1. Install dependencies

npm install

---

2. Setup environment

Create ".env" file:

PORT=5000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/watchdawg

JWT_SECRET=supersecretkey

EMAIL_HOST=smtp.zoho.in
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
EMAIL_FROM=your-email@domain.com

---

3. Run the server

Development:

npm run start:dev

Production:

npm run build
npm run start:prod

---

🐳 Docker Setup (Recommended)

Run database using Docker:

docker run -d
--name watchdawg-db
-p 5432:5432
-e POSTGRES_USER=postgres
-e POSTGRES_PASSWORD=postgres
-e POSTGRES_DB=watchdawg
postgres

---

🔌 API Endpoints

Auth

POST /auth/login
GET /auth/me

---

Activity

GET /employee/activity
POST /tracking/activity

---

📡 Data Flow

1. Agent sends activity data
2. Backend validates user session
3. Data is normalized & classified
4. Stored in PostgreSQL
5. Served to frontend via APIs

---

🔐 Security

- JWT Authentication
- Password hashing (bcrypt)
- Role-based access control
- Secure API validation

---

⚠️ Important Notes

- Backend must be running before agent
- Requires PostgreSQL database
- Uses environment variables for all configs
- Handles rate limiting internally

---

📈 Future Improvements

- WebSocket real-time streaming
- Advanced analytics dashboards
- AI-based productivity scoring
- Event-based processing (Kafka / Redis)
- Horizontal scaling

---

👨‍💻 Author

Part of WatchDawg – Scalable Real-Time Telemetry & Analytics Engine

---

📄 License

MIT
