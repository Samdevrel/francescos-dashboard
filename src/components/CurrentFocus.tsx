import { useState } from 'react'
import { Plus, Zap, Clock, Target, CheckCircle, Calendar, Play, Pause } from 'lucide-react'
import { Session, CronJob } from '../api/openclaw'

interface CurrentFocusProps {
  sessions?: Session[]
  cronJobs?: CronJob[]
  workingStatus?: 'working' | 'done' | 'idle' | 'chat'
}

export function CurrentFocus({ sessions = [], cronJobs = [], workingStatus = 'idle' }: CurrentFocusProps) {
  const [tasks, setTasks] = useState([
    { id: 'TASK-001', title: 'Real-time dashboard integration', status: 'in_progress' },
    { id: 'TASK-002', title: 'Connect to OpenClaw gateway API', status: 'done' },
    { id: 'TASK-003', title: 'Add agent status indicators', status: 'done' },
    { id: 'TASK-004', title: 'Improve UX and polish', status: 'in_progress' },
    { id: 'TASK-005', title: 'Test everything works', status: 'backlog' }
  ])

  // Get main session for Zoe's current work
  const mainSession = sessions.find(s => s.key === 'agent:main:main')
  const cronSessions = sessions.filter(s => s.key.includes('cron'))

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getStatusIcon = () => {
    switch (workingStatus) {
      case 'working':
        return '⚡'
      case 'chat':
        return '💬'
      case 'done':
        return '✅'
      case 'idle':
      default:
        return '💤'
    }
  }

  const getStatusText = () => {
    switch (workingStatus) {
      case 'working':
        return 'Currently working'
      case 'chat':
        return 'In conversation'
      case 'done':
        return 'Finished current task'
      case 'idle':
      default:
        return 'Waiting for input'
    }
  }

  return (
    <div className="current-focus">
      <div className="focus-header">
        <div className="focus-header-left">
          <Zap className="focus-icon" />
          <div>
            <h2>What I'm Working On</h2>
            <p className="subtitle">Real-time activity from OpenClaw</p>
          </div>
        </div>
        <div className="focus-status">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      {/* Main Session Info */}
      {mainSession && (
        <div className="main-session-card">
          <div className="session-header">
            <div className="session-badge">MAIN SESSION</div>
            <div className="session-time">
              <Clock size={14} />
              Last active: {formatTimeAgo(mainSession.updatedAt)}
            </div>
          </div>
          <div className="session-info">
            <div className="info-row">
              <span className="info-label">Model</span>
              <code className="info-value">{mainSession.model}</code>
            </div>
            <div className="info-row">
              <span className="info-label">Tokens</span>
              <span className="info-value">{mainSession.totalTokens?.toLocaleString() || 0}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Channel</span>
              <span className="info-value">{mainSession.channel || 'unknown'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Tasks */}
      <div className="subtasks-section">
        <h4 className="subtasks-title">📋 Current Tasks</h4>
        <div className="subtasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`subtask-item ${task.status}`}>
              <div className="subtask-left">
                {task.status === 'in_progress' && <div className="subtask-spinner" />}
                {task.status === 'done' && <CheckCircle size={16} className="subtask-check" />}
                {task.status === 'backlog' && <div className="subtask-pending" />}
                <span className="subtask-id">{task.id}</span>
              </div>
              <span className="subtask-title">{task.title}</span>
              <select 
                className="subtask-status"
                value={task.status}
                onChange={(e) => {
                  const newTasks = tasks.map(t => 
                    t.id === task.id ? { ...t, status: e.target.value } : t
                  )
                  setTasks(newTasks)
                }}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="cron-section">
        <h4 className="section-title">⏰ Scheduled Jobs</h4>
        {cronJobs.length === 0 ? (
          <div className="empty-state">No cron jobs configured</div>
        ) : (
          <div className="cron-list">
            {cronJobs.map(job => (
              <div key={job.id} className={`cron-item ${job.enabled ? 'enabled' : 'disabled'}`}>
                <div className="cron-icon">
                  {job.enabled ? <Play size={16} /> : <Pause size={16} />}
                </div>
                <div className="cron-info">
                  <div className="cron-name">{job.name || job.id}</div>
                  <div className="cron-schedule">
                    {job.schedule.kind === 'every' && `Every ${Math.round((job.schedule.everyMs || 0) / 60000)}m`}
                    {job.schedule.kind === 'cron' && job.schedule.expr}
                    {job.schedule.kind === 'at' && `At ${job.schedule.at}`}
                  </div>
                </div>
                <div className="cron-meta">
                  {job.lastRunAt && (
                    <span className="cron-last-run">Last: {formatTimeAgo(job.lastRunAt)}</span>
                  )}
                  <span className={`cron-status ${job.enabled ? 'active' : 'paused'}`}>
                    {job.enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Sessions */}
      {cronSessions.length > 0 && (
        <div className="sessions-section">
          <h4 className="section-title">🔄 Active Cron Sessions</h4>
          <div className="sessions-list">
            {cronSessions.map(session => (
              <div key={session.sessionId} className="session-item">
                <div className="session-label">{session.label || session.displayName || session.key}</div>
                <div className="session-details">
                  <span className="session-model">{session.model}</span>
                  <span className="session-tokens">{session.totalTokens?.toLocaleString()} tokens</span>
                  <span className="session-updated">{formatTimeAgo(session.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add */}
      <div className="quick-add">
        <Plus size={18} />
        <input 
          type="text" 
          placeholder="Quick add task..." 
          className="quick-add-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement
              if (input.value.trim()) {
                const newTask = {
                  id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
                  title: input.value.trim(),
                  status: 'backlog'
                }
                setTasks([...tasks, newTask])
                input.value = ''
              }
            }
          }}
        />
      </div>

      <style>{`
        .current-focus {
          max-width: 1000px;
          margin: 0 auto;
        }

        .focus-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .focus-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .focus-icon {
          width: 48px;
          height: 48px;
          color: var(--accent-cyan);
          background: rgba(6, 182, 212, 0.15);
          border-radius: 12px;
          padding: 12px;
        }

        .focus-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .focus-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .status-icon {
          font-size: 1.25rem;
        }

        .status-text {
          color: var(--text-primary);
          font-weight: 500;
        }

        .main-session-card {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .session-badge {
          padding: 0.375rem 0.75rem;
          background: var(--accent-cyan);
          color: var(--bg-primary);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .session-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .session-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .info-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-value code {
          background: rgba(139, 92, 246, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          color: var(--accent-purple);
        }

        .subtasks-section,
        .cron-section,
        .sessions-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .subtasks-title,
        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .subtasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .subtask-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
          transition: all 0.2s;
        }

        .subtask-item.in_progress {
          border: 1px solid rgba(6, 182, 212, 0.3);
          background: linear-gradient(90deg, var(--bg-tertiary) 0%, rgba(6, 182, 212, 0.05) 100%);
        }

        .subtask-item.done {
          opacity: 0.6;
        }

        .subtask-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 120px;
        }

        .subtask-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--accent-cyan);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .subtask-pending {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border);
          border-radius: 50%;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .subtask-check {
          color: var(--accent-green);
        }

        .subtask-id {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .subtask-title {
          flex: 1;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .subtask-status {
          padding: 0.25rem 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-primary);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .cron-list,
        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cron-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .cron-item.disabled {
          opacity: 0.5;
        }

        .cron-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 8px;
          color: var(--accent-blue);
        }

        .cron-info {
          flex: 1;
        }

        .cron-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .cron-schedule {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-family: 'Fira Code', monospace;
        }

        .cron-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .cron-last-run {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .cron-status {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .cron-status.active {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .cron-status.paused {
          background: rgba(100, 116, 139, 0.2);
          color: #64748b;
        }

        .session-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .session-label {
          font-weight: 500;
          color: var(--text-primary);
        }

        .session-details {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .session-model {
          font-family: 'Fira Code', monospace;
          color: var(--accent-purple);
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
        }

        .quick-add {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
        }

        .quick-add-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .quick-add-input::placeholder {
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .session-info {
            grid-template-columns: 1fr;
          }

          .focus-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
