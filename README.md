# Excalidraw - Collaborative Whiteboard

A real-time collaborative whiteboard application built with Next.js, WebSocket, and PostgreSQL. Create, share, and collaborate on diagrams, sketches, and wireframes with your team instantly.

## ✨ Demo

https://github.com/user-attachments/assets/YOUR_VIDEO_ID

<video src="./apps/asset/Recording 2025-11-18 224412.mp4" controls autoplay loop muted></video>

## 🚀 Features

- **Real-Time Collaboration** - Multiple users can draw simultaneously with instant synchronization
- **Drawing Tools** - Rectangle, Circle, Line, Pencil, Text, and Selection tools
- **Undo/Redo** - Full history support synced across all users
- **Room Management** - Create and share workspaces with team members
- **Authentication** - Secure user authentication with JWT
- **Guest Mode** - Try the app without signing up
- **Modern UI** - Beautiful, responsive design with Tailwind CSS and Framer Motion animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, WebSocket (ws), Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Monorepo**: Turborepo with pnpm workspaces

## 📦 Project Structure

```
apps/
├── draw/              # Next.js frontend application
├── http-backend/      # Express REST API server
└── ws-backend/        # WebSocket server for real-time sync
packages/
├── db/               # Prisma database schema and client
├── common/           # Shared types
└── ui/               # Shared UI components
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL database (or Neon account)

### Remote Caching

### Installation

1. Clone the repository
```bash
git clone https://github.com/arjunkumar811/Excalidraw.git
cd Excalidraw
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables

Create `.env` files in the following locations:

**`packages/db/.env`**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**`apps/http-backend/.env`**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3002
```

**`apps/ws-backend/.env`**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
```

**`apps/draw/.env.local`**
```env
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
NEXT_PUBLIC_HTTP_BACKEND="http://localhost:3002"
```

4. Run database migrations
```bash
cd packages/db
pnpm db:migrate
```

5. Start the development servers
```bash
cd ../..
pnpm dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- HTTP Backend: `http://localhost:3002`
- WebSocket Server: `ws://localhost:8080`

## 🚢 Deployment

### Deploy to Railway (Recommended)

1. Create a new project on [Railway](https://railway.app)
2. Add PostgreSQL database service
3. Deploy each service:
   - `http-backend` (Port: 3002)
   - `ws-backend` (Port: 8080)
   - `draw` (Next.js app)
4. Set environment variables for each service
5. Run migrations: `npx prisma migrate deploy`

### Deploy to Vercel

The frontend can be deployed to Vercel:
```bash
cd apps/draw
vercel deploy
```

Backend services need to be deployed separately (Railway, Render, etc.)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Contact

For questions or support, please open an issue on GitHub.
