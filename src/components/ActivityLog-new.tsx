import { useState, useEffect, useMemo } from 'react'
import { Activity, Database, AlertTriangle, RefreshCw, Terminal, MessageSquare, Zap } from 'lucide-react'
import { Session, openclawAPI, ActivityLogEntry } from '../api/openclaw'
import { activityLogger } from '../logger-fixed'

interface ActivityLogProps {
  sessions?: Session[]
}

export function ActivityLog({ sessions = [] }: ActivityLogProps) {
  const [localLogs, setLocalLogs] = useState<ActivityLogEntry[]>(() => 
    activityLogger.getLogs().map(log => ({
      ...log,
      id: log.id || `local-${Date.now()}-${Math.random()}`,
    }))
  )
  const [filterAgent, setFilterAgent] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [quickLogText, setQuickLogText] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [showSource, setShowSource] = useState<'all' | 'local' | 'sessions'>('all')

  // Extract logs from sessions
  const sessionLogs = useMemo(() => {
    return openclawAPI.extractActivityLogs(sessions)
  }, [sessions])

  // Combine local and session logs
  const allLogs = useMemo(() => {
    if (showSource === 'local') return localLogs
    if (showSource === 'sessions') return sessionLogs
    
    // Combine and deduplicate by id
    const combined = [...localLogs, ...sessionLogs]
    const seen = new Set<string>()
    return combined.filter(log => {
      if (seen.has(log.id)) return false
      seen.add(log.id)
      return true
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [localLogs, sessionLogs, showSource])

  // Auto-refresh local logs
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setLocalLogs(activityLogger.getLogs())
      setLastRefresh(Date.now())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleAddLog = (action: string, details: string, level: 'info' | 'success' | 'warning' | 'error') => {
    activityLogger.add({
      agent: 'Zoe',
      action,
      details,
      level,
    })
    setLocalLogs(activityLogger.getLogs())
  }

  const getLevelIcon = (level: ActivityLogEntry['level']) => {
    switch (level) {
      case 'info':
        return <MessageSquare size={14} className="level-icon info" />
      case 'success':
        return <Zap size={14} className="level-icon success" />
      case 'warning':
        return <AlertTriangle size={14} className="level-icon warning" />
      case 'error':
        return <AlertTriangle size={14} className="level-icon error" />
    }
  }

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('tool')) return <Terminal size={14} />
    if (action.toLowerCase().includes('response')) return <MessageSquare size={14} />
    return <Activity size={14} />
  }

  const filteredLogs = allLogs.filter(log => {
    const matchesAgent = filterAgent === 'all' || log.agent.toLowerCase() === filterAgent.toLowerCase()
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesSearch = searchTerm === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesAgent && matchesLevel && matchesSearch
  })

  const stats = {
    total: allLogs.length,
    filtered: filteredLogs.length,
    success: allLogs.filter(l => l.level === 'success').length,
    errors: allLogs.filter(l => l.level === 'error').length,
    fromSessions: sessionLogs.length,
    fromLocal: localLogs.length,
  }

  return (
    <div className="activity-log">
      <div className="log-header">
        <div className="log-header-left">
          <Activity className="log-icon" />
          <div>
            <h2>Activity Log</h2>
            <p className="subtitle">Real-time tracking of all agent activity</p>
          </div>
        </div>
        <div className="log-controls">
          <div className="source-toggle">
            <button 
              className={`source-btn ${showSource === 'all' ? 'active' : ''}`}
              onClick={() => setShowSource('all')}
            >
              All
            </button>
            <button 
              className={`source-btn ${showSource === 'sessions' ? 'active' : ''}`}
              onClick={() => setShowSource('sessions')}
            >
              Sessions ({stats.fromSessions})
            </button>
            <button 
              className={`source-btn ${showSource === 'local' ? 'active' : ''}`}
              onClick={() => setShowSource('local')}
            >
              Local ({stats.fromLocal})
            </button>
          </div>
          <button
            className={`auto-refresh-btn ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            <RefreshCw size={16} className={autoRefresh ? 'spinning' : ''} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="log-filters">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="log-search"
        />
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="log-filter"
        >
          <option value="all">All Agents</option>
          <option value="zoe">Zoe</option>
          <option value="sam">Sam</option>
          <option value="leo">Leo</option>
          <option value="mika">Mika</option>
          <option value="rex">Rex</option>
          <option value="victor">Victor</option>
          <option value="dante">Dante</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="log-filter"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <div className="log-stats">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.filtered}</span>
          <span className="stat-label">Shown</span>
        </div>
        <div className="stat success">
          <span className="stat-value">{stats.success}</span>
          <span className="stat-label">Success</span>
        </div>
        <div className="stat error">
          <span className="stat-value">{stats.errors}</span>
          <span className="stat-label">Errors</span>
        </div>
      </div>

      <div className="quick-add-log-section">
        <h3 className="quick-add-title">✏️ Quick Add Log</h3>
        <div className="quick-add-log-form">
          <input
            type="text"
            placeholder="Log message..."
            value={quickLogText}
            onChange={(e) => setQuickLogText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && quickLogText.trim()) {
                handleAddLog('Manual entry', quickLogText.trim(), 'info')
                setQuickLogText('')
              }
            }}
            className="quick-add-input"
          />
          <button
            onClick={() => {
              if (quickLogText.trim()) {
                handleAddLog('Manual entry', quickLogText.trim(), 'info')
                setQuickLogText('')
              }
            }}
            disabled={!quickLogText.trim()}
            className="quick-add-btn"
          >
            Add
          </button>
        </div>
      </div>

      <div className="log-entries">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <Activity size={48} className="no-logs-icon" />
            <p>No logs match your filters</p>
          </div>
        ) : (
          filteredLogs.slice(0, 100).map(log => (
            <div key={log.id} className={`log-entry level-${log.level}`}>
              <div className="log-timestamp">
                <span className="time">
                  {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="date">
                  {log.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="log-content">
                <div className="log-header-row">
                  <div className="log-agent">{log.agent}</div>
                  {log.model && <div className="log-model">{log.model}</div>}
                  <div className={`log-level-badge level-${log.level}`}>
                    {getLevelIcon(log.level)}
                    <span>{log.level}</span>
                  </div>
                </div>
                <div className="log-action">
                  {getActionIcon(log.action)}
                  <span>{log.action}</span>
                </div>
                <div className="log-details">{log.details}</div>
                {log.duration && <div className="log-duration">{log.duration}</div>}
              </div>
            </div>
          ))
        )}
        {filteredLogs.length > 100 && (
          <div className="logs-truncated">
            Showing 100 of {filteredLogs.length} logs. Use filters to narrow results.
          </div>
        )}
      </div>

      <style>{`
        .activity-log {
          max-width: 1400px;
          margin: 0 auto;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .log-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .log-icon {
          width: 40px;
          height: 40px;
          color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.15);
          border-radius: 12px;
          padding: 10px;
        }

        .log-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .log-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .source-toggle {
          display: flex;
          background: var(--bg-tertiary);
          border-radius: 8px;
          padding: 0.25rem;
          border: 1px solid var(--border);
        }

        .source-btn {
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .source-btn:hover {
          color: var(--text-primary);
        }

        .source-btn.active {
          background: var(--accent-blue);
          color: white;
        }

        .auto-refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auto-refresh-btn:hover {
          border-color: var(--accent-blue);
          color: var(--text-primary);
        }

        .auto-refresh-btn.active {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
        }

        .auto-refresh-btn .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .log-filters {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .log-search {
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.875rem;
          flex: 1;
          min-width: 200px;
          outline: none;
        }

        .log-search:focus {
          border-color: var(--accent-blue);
        }

        .log-filter {
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
        }

        .log-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .stat.success .stat-value {
          color: var(--accent-green);
        }

        .stat.error .stat-value {
          color: var(--accent-red);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quick-add-log-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .quick-add-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .quick-add-log-form {
          display: flex;
          gap: 0.75rem;
        }

        .quick-add-input {
          flex: 1;
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }

        .quick-add-input:focus {
          border-color: var(--accent-blue);
        }

        .quick-add-btn {
          padding: 0.625rem 1.25rem;
          background: var(--accent-blue);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-add-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .quick-add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .log-entries {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: calc(100vh - 520px);
          overflow-y: auto;
        }

        .log-entry {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }

        .log-entry:hover {
          background: var(--bg-tertiary);
        }

        .log-entry.level-info {
          border-left-color: var(--accent-blue);
        }

        .log-entry.level-success {
          border-left-color: var(--accent-green);
        }

        .log-entry.level-warning {
          border-left-color: var(--accent-yellow);
        }

        .log-entry.level-error {
          border-left-color: var(--accent-red);
        }

        .log-timestamp {
          text-align: right;
          padding-right: 0.5rem;
          border-right: 1px solid var(--border);
        }

        .time {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: 'Fira Code', monospace;
        }

        .date {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .log-content {
          min-width: 0;
        }

        .log-header-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.375rem;
          flex-wrap: wrap;
        }

        .log-agent {
          padding: 0.2rem 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--accent-blue);
        }

        .log-model {
          padding: 0.2rem 0.5rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--accent-purple);
          font-family: 'Fira Code', monospace;
        }

        .log-level-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .log-level-badge.level-info {
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-blue);
        }

        .log-level-badge.level-success {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-green);
        }

        .log-level-badge.level-warning {
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent-yellow);
        }

        .log-level-badge.level-error {
          background: rgba(239, 68, 68, 0.15);
          color: var(--accent-red);
        }

        .log-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .log-details {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.4;
          word-break: break-word;
        }

        .log-duration {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.2rem 0.5rem;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: 'Fira Code', monospace;
        }

        .no-logs {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .no-logs-icon {
          color: var(--text-secondary);
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .logs-truncated {
          text-align: center;
          padding: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          background: var(--bg-secondary);
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .log-entry {
            grid-template-columns: 1fr;
          }

          .log-timestamp {
            text-align: left;
            border-right: none;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border);
            margin-bottom: 0.5rem;
          }

          .log-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .log-controls {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}
