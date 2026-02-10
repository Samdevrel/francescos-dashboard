# Francesco's Dashboard

A real-time AI agent coordination hub for managing multiple AI agents with OpenClaw.

![Dashboard Preview](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)

## 🚀 Live Demo

**[https://francescos-dashboard.vercel.app](https://francescos-dashboard.vercel.app)**

## ✨ Features

- **Dashboard Overview** - Real-time view of all agent statuses and key metrics
- **Agent Cards** - Visual status indicators for each AI agent (🟢 Active, 🟡 Idle, ⚫ Offline)
- **Kanban Board** - Drag-and-drop task management across workflow stages
- **Task List** - Sortable, filterable task view with priority and deadline tracking
- **Activity Log** - Live feed of agent actions with auto-refresh toggle
- **Agent Hierarchy** - Visual graph of agent relationships and roles
- **Agent Profiles** - Detailed pages for each agent with backstory and capabilities

## 🤖 The Agents

| Agent | Role | Emoji |
|-------|------|-------|
| **Zoe** | Executive Assistant | ⚡ |
| **Sam** | AI Developer Advocate | 🔮 |
| **Leo** | VC Analyst | 🦁 |
| **Mika** | Content Creator | ✨ |
| **Rex** | Crypto Trader | 🤖 |
| **Victor** | Job Market Analyst | 🎯 |
| **Dante** | Africa Ops | 🌍 |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: CSS-in-JS with dark theme
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Samdevrel/francescos-dashboard.git
cd francescos-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🔧 Configuration

### OpenClaw Gateway Connection

To connect to your OpenClaw gateway for real-time data:

1. Update `src/api/openclaw.ts` with your gateway token:
```typescript
const GATEWAY_TOKEN = 'your-gateway-token-here'
```

2. Configure the Vite proxy in `vite.config.ts`:
```typescript
proxy: {
  '/tools': {
    target: 'http://localhost:18789', // Your gateway URL
    changeOrigin: true,
  }
}
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🏗️ Project Structure

```
src/
├── api/
│   └── openclaw.ts      # OpenClaw API client
├── components/
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── KanbanBoard.tsx  # Kanban task board
│   ├── TaskList.tsx     # Task list view
│   ├── ActivityLog.tsx  # Activity feed
│   ├── AgentProfile.tsx # Agent detail pages
│   └── Layout.tsx       # App layout wrapper
├── hooks/
│   └── useOpenClaw.ts   # API data hook
├── types.ts             # TypeScript definitions
├── mockData.ts          # Demo/fallback data
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Framework preset: **Vite**
4. Deploy!

### Manual Build

```bash
npm run build
# Serve the `dist/` folder
```

## 📄 License

MIT - Built by Sam 🔮 for Francesco

---

*Part of the [OpenClaw](https://github.com/openclaw/openclaw) ecosystem*
