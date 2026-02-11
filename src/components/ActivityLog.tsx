import { useState, useEffect } from 'react'
import { Activity, Database, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useSupabaseActivityLogs } from '../hooks/useSupabase'
import { addActivityLog } from '../lib/supabase'

interface LogEntry {
  id: string
  timestamp: Date
  agent: string
  action: string
  details: string
  model?: string
  level: 'info' | 'success' | 'warning' | 'error'
  duration?: string
}

export function ActivityLog() {
  const { logs: supabaseLogs, loading, error } = useSupabaseActivityLogs(100)
  const [filterAgent, setFilterAgent] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [quickLogText, setQuickLogText] = useState('')

  // Convert Supabase logs to component format
  const logs: LogEntry[] = supabaseLogs.map(log => ({
    id: String(log.id),
    timestamp: new Date(log.timestamp),
    agent: log.agent || 'Unknown',
    action: log.action || '',
    details: log.details || '',
    model: log.model || undefined,
    level: (log.level as LogEntry['level']) || 'info',
    duration: log.duration || undefined,
  }))

  const handleAddLog = async (action: string, details: string, level: 'info' | 'success' | 'warning' | 'error', model?: string) => {
    await addActivityLog({
      timestamp: new Date().toISOString(),
      agent: 'Zoe',
      action,
      details,
      level,
      model: model || 'openclaw-dashboard',
      duration: null,
    })
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Activity size={16} className="level-icon info" />
      case 'success':
        return <Database size={16} className="level-icon success" />
      case 'warning':
        return <Activity size={16} className="level-icon warning" />
      case 'error':
        return <AlertTriangle size={16} className="level-icon error" />
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesAgent = filterAgent === 'all' || log.agent.toLowerCase() === filterAgent.toLowerCase()
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesAgent && matchesLevel && matchesSearch
  })

  return (
    <div className="activity-log">
      <div className="log-header">
        <div className="log-header-left">
          <Activity className="log-icon" />
          <div>
            <h2>Activity Log</h2>
            <p className="subtitle">
              {loading ? 'Loading...' : error ? 'Error loading logs' : `Live data from Supabase (${logs.length} events)`}
            </p>
          </div>
          <div className={`connection-status ${error ? 'disconnected' : 'connected'}`}>
            {error ? <WifiOff size={16} /> : <Wifi size={16} />}
            <span>{error ? 'Disconnected' : 'Live'}</span>
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
      </div>

      <div className="log-stats">
        <div className="stat">
          <span className="stat-value">{logs.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat">
          <span className="stat-value">{filteredLogs.length}</span>
          <span className="stat-label">Filtered</span>
        </div>
        <div className="stat">
          <span className="stat-value">{logs.filter(l => l.level === 'success').length}</span>
          <span className="stat-label">Success</span>
        </div>
        <div className="stat">
          <span className="stat-value">{logs.filter(l => l.level === 'error').length}</span>
          <span className="stat-label">Errors</span>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <RefreshCw className="spin" size={24} />
          <span>Loading activity logs...</span>
        </div>
      )}

      <div className="log-entries">
        {filteredLogs.map(log => (
          <div key={log.id} className={`log-entry level-${log.level}`}>
            <div className="log-timestamp">
              <span className="time">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="date">{log.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
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
              <div className="log-action">{log.action}</div>
              <div className="log-details">{log.details}</div>
              {log.duration && <div className="log-duration">{log.duration}</div>}
            </div>
          </div>
        ))}
        {filteredLogs.length === 0 && !loading && (
          <div className="no-logs">
            <Activity size={48} className="no-logs-icon" />
            <p>{error ? 'Failed to load logs from Supabase' : 'No logs match your filters'}</p>
          </div>
        )}
      </div>

      <div className="quick-add-log-section">
        <h3 className="quick-add-title">Quick Add Log</h3>
        <div className="quick-add-log-form">
          <input
            type="text"
            placeholder="Quick add log..."
            value={quickLogText}
            onChange={(e) => setQuickLogText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (quickLogText.trim()) {
                  handleAddLog('Quick entry', quickLogText.trim(), 'info')
                  setQuickLogText('')
                }
              }
            }}
            className="quick-add-input"
          />
          <button
            onClick={() => {
              if (quickLogText.trim()) {
                handleAddLog('Quick entry', quickLogText.trim(), 'info')
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

      <style jsx>{`
        .activity-log {
          max-width: 1400px;
          margin: 0 auto;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
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
          padding: 12px;
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

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .connection-status.connected {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-green);
        }

        .connection-status.disconnected {
          background: rgba(239, 68, 68, 0.15);
          color: var(--accent-red);
        }

        .log-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .log-search {
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.875rem;
          width: 200px;
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
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
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
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .log-entries {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: calc(100vh - 500px);
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .log-entry {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          border-left: 3px solid transparent;
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

        .log-entry:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        .log-timestamp {
          text-align: right;
        }

        .time {
          display: block;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: 'Fira Code', monospace;
          margin-bottom: 0.25rem;
        }

        .date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .log-content {
          padding-right: 1rem;
        }

        .log-header-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .log-agent {
          padding: 0.25rem 0.75rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--accent-blue);
        }

        .log-model {
          padding: 0.25rem 0.75rem;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--accent-purple);
          font-family: 'Fira Code', monospace;
        }

        .log-level-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
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

        .level-icon {
          width: 14px;
          height: 14px;
        }

        .log-action {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }

        .log-details {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .log-duration {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
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

        .quick-add-log-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .quick-add-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
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
          padding: 0.75rem 1.5rem;
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
      `}</style>
    </div>
  )
}
