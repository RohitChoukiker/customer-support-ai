
# Customer Support AI

A production-style AI-powered customer support chat system.
This project simulates a live chat widget where an AI agent answers customer queries using a real LLM, with persistent conversation history.

Built as a take-home assignment for a Founding Full-Stack Engineer role.

---

## Features

- Session-based live chat API
- AI-generated responses using a real LLM
- Persistent conversations stored in a database
- Clean backend architecture (routes, services, DB)
- Production-ready deployment on cloud
- Frontend–backend separation

---

## Tech Stack

### Backend
- Node.js + TypeScript
- Fastify
- Prisma ORM
- PostgreSQL (Google Cloud SQL)
- Gemini API
- Dockerize the backend for Cloud Run deployment.


### Frontend
- React + Vite + TailwindCSS
- Deployed on Vercel

---

## Folder Structure

```
customer-support-ai/
├── Client/   # Frontend (React)
└── Server/   # Backend (Fastify, Prisma)
```

---

##  Architecture Overview

The backend follows a clear separation of concerns:

- **Routes**  
  Handle HTTP request/response logic and validation.

- **Services**  
  Contain core business logic such as handling chat messages and calling the LLM.

- **Database Layer**  
  Managed using Prisma ORM for clean data access and migrations.

- **Config Layer**  
  Centralized environment variable and runtime configuration handling.

This structure keeps the backend modular, testable, and easy to extend to
additional channels (e.g. WhatsApp, Instagram) or alternate LLM providers.

---


## Getting Started (Local Development)

### Prerequisites
- Node.js (v20+ recommended)
- npm
- PostgreSQL database (local or cloud)

### 1. Clone the repository
```sh
git clone https://github.com/RohitChoukiker/customer-support-ai.git
cd customer-support-ai
```

### 2. Setup the Backend (Server)

```sh
cd Server
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `Server/` directory:

```
PORT=8080
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgres_connection_url
NODE_ENV=development
```

#### Setup Database
Run Prisma migrations:
```sh
npx prisma migrate deploy
npx prisma generate
```

#### Start the Backend Server
```sh
npm run dev

npm run build && npm start # For production build
```
The server will run on `http://localhost:8080` by default.

### 3. Setup the Frontend (Client)

Open a new terminal:
```sh
cd Client
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` by default.

---

## API Endpoints

- `POST /chat/message` — Send a message to the AI agent. Request body: `{ message: string, sessionId?: string }`. Returns AI reply and sessionId. (See Swagger docs if running in development mode)

- `GET /chat/history/:sessionId` — Get the full message history for a conversation session. Returns `{ sessionId, messages: [{ sender, text, createdAt }] }`.

---

## LLM Integration Notes

- **Provider:** Google Gemini
- **Usage:** Generating customer support responses

### Prompting Strategy
- A system prompt defines the AI as a customer support agent.
- Basic FAQ context (shipping, returns, support hours) is injected
  to ensure reliable answers.
- Recent conversation history is included to maintain context.

The LLM logic is encapsulated in a service layer, allowing easy
replacement with another provider (e.g. OpenAI or Claude).

---

## Trade-offs & Future Improvements

### Trade-offs
- Authentication is intentionally omitted to keep scope focused.
- FAQ knowledge is hardcoded instead of stored in a database.
- Responses are non-streaming to reduce complexity.

### If I Had More Time…
- Add streaming responses with typing indicators.
- Store FAQs in a database with an admin interface.
- Add Redis caching for frequently accessed conversations.
- Support authentication and multi-tenant usage.
- Integrate external tools (order status, refunds, CRM).

---

## Deployment

- Backend: Dockerfile provided for containerized deployment (Cloud Run ready)
- Frontend: Deployable on Vercel (static hosting)

---

## License

MIT

