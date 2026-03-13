import { useState, useEffect } from 'react'
import { Session } from '../api/openclaw'
import {
  Cpu,
  TrendingUp,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp,
  Zap,
  Keyboard,
  Command,
  Terminal,
  Layers,
  Calendar,
  Settings,
  X,
  KanbanSquare,
  List
} from 'lucide-react'

type View = 'dashboard' | 'kanban' | 'list' | 'focus' | 'logs' | 'admin' | 'library' | 'models'

interface ModelsProps {
  sessions: Session[]
}

interface ModelStats {
  name: string
  sessionsCount: number
  totalTokens: number
  avgTokensPerSession: number
  estimatedCost: number
  lastUsed: number
}

export function Models({ sessions }: ModelsProps) {
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'usage' | 'cost' | 'sessions'>('usage')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandFilter, setCommandFilter] = useState('')
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  // Aggregate model statistics
  const modelStats = sessions.reduce((acc, session) => {
    const modelName = session.model || 'unknown'

    if (!acc[modelName]) {
      acc[modelName] = {
        name: modelName,
        sessionsCount: 0,
        totalTokens: 0,
        avgTokensPerSession: 0,
        estimatedCost: 0,
        lastUsed: 0
      }
    }

    acc[modelName].sessionsCount++
    acc[modelName].totalTokens += session.totalTokens || 0
    acc[modelName].lastUsed = Math.max(acc[modelName].lastUsed, session.updatedAt)

    // Calculate estimated cost based on model pricing
    // Using rough estimates: Sonnet ~$3/1M input, Opus ~$15/1M input
    const costPerToken = modelName.includes('opus') ? 0.000015
      : modelName.includes('sonnet') ? 0.000003
      : modelName.includes('gemini') ? 0.000001
      : 0.000002 // default estimate

    acc[modelName].estimatedCost += (session.totalTokens || 0) * costPerToken

    return acc
  }, {} as Record<string, ModelStats>)

  // Calculate averages
  Object.values(modelStats).forEach(stat => {
    stat.avgTokensPerSession = stat.totalTokens / stat.sessionsCount
  })

  // Sort models
  const sortedModels = Object.values(modelStats).sort((a, b) => {
    switch (sortBy) {
      case 'usage':
        return b.totalTokens - a.totalTokens
      case 'cost':
        return b.estimatedCost - a.estimatedCost
      case 'sessions':
        return b.sessionsCount - a.sessionsCount
      default:
        return 0
    }
  })

  // Get sessions for a specific model
  const getSessionsForModel = (modelName: string) => {
    return sessions
      .filter(s => s.model === modelName)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10) // Show top 10 recent sessions
  }

  // Total stats
  const totalTokens = sessions.reduce((sum, s) => sum + (s.totalTokens || 0), 0)
  const totalCost = sortedModels.reduce((sum, m) => sum + m.estimatedCost, 0)

  // Keyboard shortcuts data
  const keyboardShortcuts = [
    { keys: ['Cmd', 'K'], action: 'Show Command Palette', icon: <Command size={16} /> },
    { keys: ['?'], action: 'Show Shortcuts', icon: <Keyboard size={16} /> },
    { keys: ['G', 'D'], action: 'Go to Dashboard', icon: <Layers size={16} /> },
    { keys: ['G', 'K'], action: 'Go to Kanban', icon: <KanbanSquare size={16} /> },
    { keys: ['G', 'L'], action: 'Go to Task List', icon: <List size={16} /> },
    { keys: ['G', 'F'], action: 'Go to Focus', icon: <Zap size={16} /> },
    { keys: ['G', 'O'], action: 'Go to Activity Log', icon: <Activity size={16} /> },
    { keys: ['G', 'M'], action: 'Go to Models', icon: <Cpu size={16} /> },
    { keys: ['G', 'A'], action: 'Go to Admin', icon: <Settings size={16} /> },
  ]

  // Commands for command palette
  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', shortcut: 'G D', action: () => handleNavigate('dashboard') },
    { id: 'kanban', label: 'Go to Kanban', shortcut: 'G K', action: () => handleNavigate('kanban') },
    { id: 'list', label: 'Go to Task List', shortcut: 'G L', action: () => handleNavigate('list') },
    { id: 'focus', label: 'Go to Focus', shortcut: 'G F', action: () => handleNavigate('focus') },
    { id: 'logs', label: 'Go to Activity Log', shortcut: 'G O', action: () => handleNavigate('logs') },
    { id: 'models', label: 'Go to Models', shortcut: 'G M', action: () => handleNavigate('models') },
    { id: 'admin', label: 'Go to Admin', shortcut: 'G A', action: () => handleNavigate('admin') },
  ]

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
        return
      }

      // ? - Show shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        setShowKeyboardShortcuts(true)
        return
      }

      // Don't trigger shortcuts when typing in inputs
      if (
        (e.target as HTMLInputElement).tagName === 'INPUT' ||
        (e.target as HTMLTextAreaElement).tagName === 'TEXTAREA'
      ) {
        return
      }

      // G + Key combinations for navigation
      if (e.key === 'g') {
        setShowCommandPalette(true)
        setCommandFilter('')
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavigate = (view: View) => {
    setShowCommandPalette(false)
    setShowKeyboardShortcuts(false)
    // This would normally call a parent function to change the view
    // For now, just log it
    console.log(`Navigate to ${view}`)
  }

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const formatCost = (cost: number) => {
    if (cost < 0.01) return `$${(cost * 100).toFixed(2)}¢`
    return `$${cost.toFixed(2)}`
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  return (
    <div className="models-view">
      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Cpu size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-label">Total Models</div>
            <div className="stat-value">{sortedModels.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Activity size={24} color="#10b981" />
          </div>
          <div>
            <div className="stat-label">Total Tokens</div>
            <div className="stat-value">{formatNumber(totalTokens)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <DollarSign size={24} color="#f59e0b" />
          </div>
          <div>
            <div className="stat-label">Estimated Cost</div>
            <div className="stat-value">{formatCost(totalCost)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <TrendingUp size={24} color="#8b5cf6" />
          </div>
          <div>
            <div className="stat-label">Active Sessions</div>
            <div className="stat-value">{sessions.length}</div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <button
          className={`sort-btn ${sortBy === 'usage' ? 'active' : ''}`}
          onClick={() => setSortBy('usage')}
        >
          Most Used
        </button>
        <button
          className={`sort-btn ${sortBy === 'cost' ? 'active' : ''}`}
          onClick={() => setSortBy('cost')}
        >
          Highest Cost
        </button>
        <button
          className={`sort-btn ${sortBy === 'sessions' ? 'active' : ''}`}
          onClick={() => setSortBy('sessions')}
        >
          Most Sessions
        </button>
      </div>

      {/* Models List */}
      <div className="models-list">
        {sortedModels.map(model => {
          const isExpanded = expandedModel === model.name
          const modelSessions = isExpanded ? getSessionsForModel(model.name) : []

          return (
            <div key={model.name} className="model-card">
              <div
                className="model-header"
                onClick={() => setExpandedModel(isExpanded ? null : model.name)}
              >
                <div className="model-info">
                  <div className="model-name">
                    <Zap size={18} />
                    {model.name}
                  </div>
                  <div className="model-meta">
                    {model.sessionsCount} sessions • Last used {formatTime(model.lastUsed)}
                  </div>
                </div>

                <div className="model-stats">
                  <div className="model-stat">
                    <span className="stat-label">Tokens</span>
                    <span className="stat-value">{formatNumber(model.totalTokens)}</span>
                  </div>
                  <div className="model-stat">
                    <span className="stat-label">Avg/Session</span>
                    <span className="stat-value">{formatNumber(model.avgTokensPerSession)}</span>
                  </div>
                  <div className="model-stat">
                    <span className="stat-label">Cost</span>
                    <span className="stat-value">{formatCost(model.estimatedCost)}</span>
                  </div>
                </div>

                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>

              {isExpanded && (
                <div className="model-sessions">
                  <div className="sessions-header">Recent Sessions</div>
                  {modelSessions.map(session => (
                    <div key={session.sessionId} className="session-item">
                      <div className="session-info">
                        <div className="session-label">
                          {session.label || session.displayName || session.key}
                        </div>
                        <div className="session-meta">
                          {session.channel} • {formatTime(session.updatedAt)}
                        </div>
                      </div>
                      <div className="session-tokens">
                        {formatNumber(session.totalTokens)} tokens
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        .models-view {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .sort-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .sort-btn {
          padding: 0.625rem 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sort-btn:hover {
          border-color: var(--accent-blue);
          color: var(--text-primary);
        }

        .sort-btn.active {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          color: white;
        }

        .models-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .model-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .model-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .model-header:hover {
          background: var(--bg-tertiary);
        }

        .model-info {
          flex: 1;
          min-width: 0;
        }

        .model-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .model-meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .model-stats {
          display: flex;
          gap: 2rem;
        }

        .model-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .model-stat .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .model-stat .stat-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 0.25rem;
        }

        .model-sessions {
          border-top: 1px solid var(--border);
          padding: 1rem 1.5rem;
          background: var(--bg-tertiary);
        }

        .sessions-header {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .session-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .session-item:last-child {
          margin-bottom: 0;
        }

        .session-info {
          flex: 1;
          min-width: 0;
        }

        .session-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .session-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .session-tokens {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--accent-blue);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .models-view {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .model-stats {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .model-stat {
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Command Palette Styles */}
      <style jsx>{`
        .command-palette-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          z-index: 2000;
        }

        .command-palette {
          width: 100%;
          max-width: 600px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .command-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .command-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 1rem;
          outline: none;
        }

        .command-input:focus {
          border-color: var(--accent-blue);
        }

        .command-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .command-close:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .command-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .command-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1.5rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }

        .command-item:hover,
        .command-item:focus {
          background: rgba(59, 130, 246, 0.1);
        }

        .command-item:last-child {
          border-bottom: none;
        }

        .command-label {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .command-shortcut {
          padding: 0.25rem 0.75rem;
          background: var(--bg-tertiary);
          border-radius: 6px;
          font-size: 0.75rem;
          font-family: 'Fira Code', monospace;
          color: var(--text-secondary);
        }

        {/* Keyboard Shortcuts Panel Styles */}
        .shortcuts-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .shortcuts-panel {
          width: 100%;
          max-width: 600px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .shortcuts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .shortcuts-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .shortcuts-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .shortcuts-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .shortcuts-close:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .shortcuts-section {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .shortcuts-section:last-child {
          border-bottom: none;
        }

        .shortcuts-section h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .shortcut-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .shortcut-item:last-child {
          margin-bottom: 0;
        }

        .shortcut-keys {
          display: flex;
          gap: 0.25rem;
        }

        .shortcut-keys kbd {
          padding: 0.25rem 0.625rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .shortcut-action {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="command-palette-overlay" onClick={() => setShowCommandPalette(false)}>
          <div className="command-palette" onClick={(e) => e.stopPropagation()}>
            <div className="command-header">
              <Command size={20} />
              <input
                type="text"
                placeholder="Type a command..."
                value={commandFilter}
                onChange={(e) => setCommandFilter(e.target.value)}
                autoFocus
                className="command-input"
              />
              <button onClick={() => setShowCommandPalette(false)} className="command-close">
                <X size={18} />
              </button>
            </div>
            <div className="command-list">
              {commands
                .filter(cmd =>
                  cmd.label.toLowerCase().includes(commandFilter.toLowerCase())
                )
                .map(cmd => (
                  <button
                    key={cmd.id}
                    className="command-item"
                    onClick={() => cmd.action()}
                  >
                    <span className="command-label">{cmd.label}</span>
                    <span className="command-shortcut">{cmd.shortcut}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Panel */}
      {showKeyboardShortcuts && (
        <div className="shortcuts-overlay" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="shortcuts-panel" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <div className="shortcuts-title">
                <Keyboard size={24} />
                <h2>Keyboard Shortcuts</h2>
              </div>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="shortcuts-close">
                <X size={20} />
              </button>
            </div>
            <div className="shortcuts-section">
              <h3>Navigation</h3>
              {keyboardShortcuts.slice(0, 4).map((shortcut, idx) => (
                <div key={idx} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, keyIdx) => (
                      <kbd key={keyIdx}>{key}</kbd>
                    ))}
                  </div>
                  <span className="shortcut-action">{shortcut.action}</span>
                </div>
              ))}
            </div>
            <div className="shortcuts-section">
              <h3>Quick Navigation</h3>
              {keyboardShortcuts.slice(4).map((shortcut, idx) => (
                <div key={idx} className="shortcut-item">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key, keyIdx) => (
                      <kbd key={keyIdx}>{key}</kbd>
                    ))}
                  </div>
                  <span className="shortcut-action">{shortcut.action}</span>
                </div>
              ))}
            </div>
            <div className="shortcuts-section">
              <h3>Model Controls</h3>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>?</kbd>
                </div>
                <span className="shortcut-action">Show this shortcuts panel</span>
              </div>
              <div className="shortcut-item">
                <div className="shortcut-keys">
                  <kbd>Esc</kbd>
                </div>
                <span className="shortcut-action">Close dialogs</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
