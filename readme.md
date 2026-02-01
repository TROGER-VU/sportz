# 🏟️ Sportz API

> **Sportz** is a lightweight REST + WebSocket API for managing and broadcasting sports match data — built with Node.js, Express, and WebSockets.
> It supports match creation, match commentary, and real-time updates via WebSockets to clients.

---

## 📌 Features

* 🗂️ **RESTful API for managing matches**
* 🗣️ **Create and list commentary per match**
* 🚀 **WebSocket support** for real-time match broadcasts
* 🔒 **Pluggable security layer** (Arcjet integration for request protection)
* 🪶 Simple JSON schema validation with robust error handling

---

## 🚀 Quick Start

### 📥 Clone

```bash
git clone https://github.com/TROGER-VU/sportz.git
cd sportz
```

### 📦 Install dependencies

```bash
npm install
```

### 🌟 Environment

Create a `.env` file in the project root if needed, e.g.:

```
# Get your connection string from the Neon Console:
# Project -> Dashboard -> Connect
# Replace the placeholder with your actual Neon connection string
DATABASE_URL=YOUR_NEON_DATABASE_CONNECTION_STRING

# PORT & HOST
PORT=8000
HOST=0.0.0.0

# Arcjet
ARCJET_KEY=YOUR_ARCJET_KEY
ARCJET_ENV=development
```

### 🚀 Run

```bash
npm run dev
```

The server will start on `http://localhost:8000` (or the host/port in `.env`), and the WebSocket endpoint will be available at `ws://localhost:8000/ws`.

---

## 🛠️ API Endpoints

### 📍 Matches

| Method | Path       | Description        |
| ------ | ---------- | ------------------ |
| GET    | `/matches` | List all matches   |
| POST   | `/matches` | Create a new match |

---

### 💬 Commentary

| Method | Path                      | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | `/matches/:id/commentary` | List commentary for a match |
| POST   | `/matches/:id/commentary` | Add commentary to a match   |

> Requests and responses expect JSON bodies with proper validation (handled via Zod schemas).

---

## 🔄 WebSocket (Real-Time Updates)

You can connect to the WebSocket server to receive live broadcast events (e.g., `match_created`, etc.):

```
ws://<server_address>/ws
```

Events are sent in JSON format:

```json
{
  "type": "match_created",
  "data": { /* match object */ }
}
```

---

## 🔒 Security Middleware

The project integrates **Arcjet** middleware for **request protection**, including:

* IP protections
* Rate limits
* Denials based on security policies

This is applied to all HTTP and WebSocket upgrade requests before routes are processed.

---

## 🧠 Architecture

* 💻 **Express** — Core REST API
* 📡 **ws** — WebSocket server
* 📦 **Zod validation** — Strong schema validation
* 🔐 **Arcjet integration** — Secures endpoints
* 🗃 **Database Abstraction** — Query builder for match/commentary data

---

## 🌍 Example Usage

### Create a Match (cURL)

```bash
curl -X POST http://localhost:8000/matches \
  -H "Content-Type: application/json" \
  -d '{ "teamA": "Team A", "teamB": "Team B", "startTime": "2026-01-31T12:00:00Z" }'
```

### Add Commentary

```bash
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{ "minute": 15, "text": "What a goal!" }'
```

---

## 🧪 Testing

Use tools like **curl**, **Postman**, or **WebSocket clients** to test both REST routes and real-time subscriptions.

---

## 📦 Dependencies

* **Express** – REST API server
* **http** – Node HTTP server
* **ws** – WebSockets
* **Zod** – Validation schemas
* **Arcjet** – Protection middleware

---

## 🙌 Contributing

Contributions are welcome! Feel free to:

* Open issues
* Suggest features
* Submit pull requests

Please ensure work adheres to code style and includes tests where appropriate.

---

## 📜 License

This project is **open source**. See the `LICENSE` file for details.
