# Praktis — Creative Community Platform

## Project Structure
```
praktis-app/
├── client/   → React + Tailwind + Framer Motion (Vite)
└── server/   → Express + MongoDB API
```

## Quick Start

### 1. Install dependencies
```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
# Edit server/.env and add your MongoDB URI
```

### 3. Run locally
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend → http://localhost:5173  
Backend  → http://localhost:5000  
Admin    → http://localhost:5173/admin

## Deploy

### Frontend (Vercel)
```bash
cd client
npm run build
# Push to GitHub, import repo in vercel.com, set root to /client
```

### Backend (Render)
- Create a new Web Service on render.com
- Set root to `/server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: MONGO_URI, PORT, CLIENT_URL

## Environment Variables (server/.env)
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/praktis
PORT=5000
CLIENT_URL=http://localhost:5173
```
