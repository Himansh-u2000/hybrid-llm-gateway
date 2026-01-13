# Hybrid LLM Gateway 🚀

A production-ready hybrid AI gateway that intelligently routes chat requests between a **local LLM (Ollama)** and **DigitalOcean Gradient™ AI Agents**, with Redis-backed API key management and automatic routing based on intent and token size.

---

## ✨ Features

- 🧠 **Smart Routing**

  - Routes requests to **local Ollama** or **DO AI Agent**
  - Based on token count, intent detection, or explicit override

- 🔐 **API Key Authentication**

  - API keys stored and validated via Redis
  - Rate limiting & daily usage limits supported

- ⚡ **Local + Cloud Hybrid**

  - Low-latency local inference
  - High-quality cloud inference for complex queries

- 🧩 **RAG-ready**

  - Supports DigitalOcean Agents with attached Knowledge Bases

- 🐳 **Dockerized**
  - One-command startup using Docker Compose

---

## 🏗 Architecture

Client (curl / frontend)
|
v
┌───────────────────────┐
│ Hybrid LLM Gateway │
│ (Fastify + Node.js) │
└─────────┬─────────────┘
|
┌────────┴─────────┐
| |
v v
Ollama (Local) DO AI Agent
(deepseek/qwen) (20B / RAG)

---

## 🧰 Tech Stack

- **Node.js 22**
- **Fastify**
- **Redis**
- **Ollama**
- **DigitalOcean Gradient™ AI Agents**
- **Docker & Docker Compose**

---

## 🚀 Quick Start (Local)

### 1️⃣ Clone the repo

````bash
git clone https://github.com/your-username/hybrid-llm-gateway.git
cd hybrid-llm-gateway


---

### 2️⃣ Create `.env`

```bash
cp .env.example .env
````

Fill in:

```env
PORT=3000

REDIS_HOST=redis
REDIS_PORT=6379

USE_DO_AGENT=true
LOCAL_MAX_TOKENS=512

DO_AGENT_ENDPOINT=https://<your-agent>.agents.do-ai.run
DO_AGENT_ACCESS_KEY=your-access-key
```

---

### 3️⃣ Start services

```bash
docker compose up --build
```

---

## 🧪 Test with curl

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-key-123" \
  -d '{
    "messages": [
      { "role": "user", "content": "Explain microservices architecture in detail" }
    ]
  }'
```

---

## 🧠 Routing Logic

Requests are routed to **DO Agent** when:

- Token count exceeds `LOCAL_MAX_TOKENS`
- Heavy intent is detected
- `modelPreference: "large"` is used

Otherwise, requests are served by **local Ollama**.

---

## 🔐 API Key Management

- API keys are stored in Redis
- Seed keys using:

```bash
node src/scripts/sendAPIKeys.js
```

---

## 📦 Deployment

This service is designed to be deployed on:

- DigitalOcean Droplets
- Any Docker-compatible VM

> Note: `.env` files are **not committed** to GitHub.

---

## 🧹 Cleanup

To fully stop and clean:

```bash
docker compose down -v
docker system prune -af
```

---

## 📜 License
