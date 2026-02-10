import { Layout as LayoutIcon, KanbanSquare, List, Zap, Activity, Wifi, WifiOff, RefreshCw, Lock, BookOpen } from 'lucide-react'

type View = 'dashboard' | 'kanban' | 'list' | 'focus' | 'logs' | 'admin' | 'library'

interface LayoutProps {
  currentView: View
  onViewChange: (view: View) => void
  children: React.ReactNode
  workingStatus?: 'working' | 'done' | 'idle' | 'chat'
  connected?: boolean
  lastRefresh?: number
  error?: string | null
}

export function Layout({ 
  currentView, 
  onViewChange, 
  children, 
  workingStatus = 'idle',
  connected = false,
  lastRefresh,
  error 
}: LayoutProps) {
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutIcon },
    { id: 'kanban' as View, label: 'Kanban', icon: KanbanSquare },
    { id: 'list' as View, label: 'Task List', icon: List },
    { id: 'focus' as View, label: 'Focus', icon: Zap },
    { id: 'logs' as View, label: 'Activity Log', icon: Activity },
    { id: 'library' as View, label: 'Library', icon: BookOpen },
    { id: 'admin' as View, label: 'Admin', icon: Lock }
  ]

  const timeSinceRefresh = lastRefresh ? Math.floor((Date.now() - lastRefresh) / 1000) : 0

  const getStatusMessage = () => {
    if (!connected) return { icon: '🔴', text: 'Disconnected from Gateway', class: 'error' }
    
    switch (workingStatus) {
      case 'working':
        return { icon: '⚡', text: 'Zoe is working', class: 'working' }
      case 'chat':
        return { icon: '💬', text: 'Zoe is chatting', class: 'working' }
      case 'idle':
        return { icon: '💤', text: 'Zoe is idle', class: 'idle' }
      case 'done':
        return { icon: '✅', text: 'Zoe is done', class: 'idle' }
      default:
        return { icon: '❓', text: 'Unknown status', class: 'idle' }
    }
  }

  const status = getStatusMessage()

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <Zap className="logo-icon" />
            <h1>Francesco's Dashboard</h1>
          </div>
          <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{connected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        <nav className="nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}
        {children}
      </main>

      <div className="heartbeat-bar">
        <div className={`heartbeat-indicator ${status.class}`}>
          <div className={`indicator-dot ${status.class}`}></div>
          <span className="indicator-icon">{status.icon}</span>
          <span className="indicator-text">{status.text}</span>
          <div className="refresh-info">
            <RefreshCw size={12} className={connected ? 'spinning' : ''} />
            <span>{timeSinceRefresh}s ago</span>
          </div>
        </div>
      </div>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          color: var(--accent-cyan);
        }

        .logo h1 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .connection-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .connection-badge.connected {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .connection-badge.disconnected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .nav {
          display: flex;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
          color: var(--accent-blue);
        }

        .main {
          flex: 1;
          padding: 2rem;
          padding-bottom: 6rem;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          color: #ef4444;
          font-size: 0.875rem;
        }

        .heartbeat-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border-top: 2px solid var(--border);
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .heartbeat-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1.25rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s;
          min-width: 320px;
          justify-content: center;
        }

        .heartbeat-indicator.working {
          background: rgba(16, 185, 129, 0.15);
          border: 2px solid #10b981;
          color: #10b981;
        }

        .heartbeat-indicator.idle {
          background: rgba(245, 158, 11, 0.15);
          border: 2px solid #f59e0b;
          color: #f59e0b;
        }

        .heartbeat-indicator.error {
          background: rgba(239, 68, 68, 0.15);
          border: 2px solid #ef4444;
          color: #ef4444;
        }

        .indicator-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .indicator-dot.working {
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
        }

        .indicator-dot.idle {
          background: #f59e0b;
        }

        .indicator-dot.error {
          background: #ef4444;
          animation: blink 1s ease-in-out infinite;
        }

        .indicator-icon {
          font-size: 1rem;
        }

        .indicator-text {
          color: var(--text-primary);
        }

        .refresh-info {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: 'Fira Code', monospace;
          margin-left: auto;
        }

        .refresh-info .spinning {
          animation: spin 2s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .nav {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .nav-item span {
            display: none;
          }

          .heartbeat-indicator {
            min-width: auto;
            padding: 0.5rem 1rem;
          }

          .indicator-text {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
