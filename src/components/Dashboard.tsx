import { LayoutGrid, AlertCircle, Calendar, CheckCircle, Wifi, WifiOff, Clock, Zap } from 'lucide-react'
import { Task, TaskStatus } from '../types'
import { AGENTS, STATUS_COLORS, STATUS_LABELS } from '../types'
import { AgentStatus, Session } from '../api/openclaw'
import { AgentHierarchy } from './AgentHierarchy'

interface DashboardProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  agentStatuses?: AgentStatus[]
  sessions?: Session[]
  connected?: boolean
  loading?: boolean
  onAgentClick?: (agentId: string) => void
}

export function Dashboard({ tasks, onTaskUpdate, agentStatuses = [], sessions = [], connected = false, loading = false, onAgentClick }: DashboardProps) {
  const stats = {
    total: tasks.length,
    byStatus: {
      backlog: tasks.filter(t => t.status === 'backlog').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length
    },
    byPriority: {
      urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length,
      high: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
    },
    dueSoon: tasks.filter(t => {
      if (!t.deadline || t.status === 'done') return false
      const deadline = new Date(t.deadline)
      const diffDays = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays > 0
    }).length
  }

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done')
  const dueSoonTasks = tasks.filter(t => {
    if (!t.deadline || t.status === 'done') return false
    const deadline = new Date(t.deadline)
    const diffDays = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  })

  // Merge real agent statuses with defined agents
  const mergedAgents = AGENTS.map(agent => {
    const realStatus = agentStatuses.find(s => s.id === agent.id)
    return {
      ...agent,
      status: realStatus?.status || 'offline',
      lastActivity: realStatus?.lastActivity,
      currentTask: realStatus?.currentTask,
      model: realStatus?.model,
      tokenUsage: realStatus?.tokenUsage,
    }
  })

  const activeAgents = mergedAgents.filter(a => a.status === 'active' || a.status === 'working').length
  const totalSessions = sessions.length

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: { title: string, value: number | string, icon: any, color: string, subtitle?: string }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'working':
        return '#10b981'
      case 'idle':
        return '#f59e0b'
      case 'offline':
      default:
        return '#64748b'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'working':
        return 'Working'
      case 'idle':
        return 'Idle'
      case 'offline':
      default:
        return 'Offline'
    }
  }

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return 'Never'
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p className="subtitle">Francesco's AI agent coordination hub</p>
        </div>
        <div className="connection-status">
          {connected ? (
            <span className="status-badge connected">
              <Wifi size={14} />
              Connected to Gateway
            </span>
          ) : (
            <span className="status-badge disconnected">
              <WifiOff size={14} />
              Disconnected
            </span>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Active Agents" value={activeAgents} icon={Zap} color="#10b981" subtitle={`of ${AGENTS.length} total`} />
        <StatCard title="Sessions" value={totalSessions} icon={LayoutGrid} color="#3b82f6" />
        <StatCard title="In Progress" value={stats.byStatus.in_progress} icon={Clock} color="#06b6d4" />
        <StatCard title="Urgent" value={stats.byPriority.urgent} icon={AlertCircle} color="#ef4444" />
        <StatCard title="Due Soon" value={stats.dueSoon} icon={Calendar} color="#f59e0b" />
        <StatCard title="Done" value={stats.byStatus.done} icon={CheckCircle} color="#10b981" />
      </div>

      <div className="dashboard-content">
        <AgentHierarchy agentStatuses={mergedAgents} onAgentClick={onAgentClick} />

        <div className="section agents-section">
          <h3>🤖 Agent Status {loading && <span className="loading-indicator">Refreshing...</span>}</h3>
          <div className="agent-grid">
            {mergedAgents.map(agent => {
              const agentTasks = tasks.filter(t => t.assignee === agent.id)
              const completed = agentTasks.filter(t => t.status === 'done').length
              const progress = agentTasks.length > 0 ? Math.round((completed / agentTasks.length) * 100) : 0
              
              return (
                <div 
                  key={agent.id} 
                  className={`agent-card ${agent.status} clickable`}
                  onClick={() => onAgentClick?.(agent.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onAgentClick?.(agent.id)}
                >
                  <div className="agent-header">
                    <div className="agent-avatar-wrapper">
                      <div className="agent-avatar" style={{ background: agent.color }}>
                        {agent.emoji || agent.name.charAt(0)}
                      </div>
                      <div 
                        className={`status-indicator ${agent.status}`}
                        style={{ background: getStatusColor(agent.status) }}
                      />
                    </div>
                    <div className="agent-info">
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-role">{agent.role}</div>
                    </div>
                    <div className={`agent-status-badge ${agent.status}`}>
                      {getStatusLabel(agent.status)}
                    </div>
                  </div>
                  
                  {agent.currentTask && (
                    <div className="agent-current-task">
                      <span className="task-label">Working on:</span>
                      <span className="task-text">{agent.currentTask}</span>
                    </div>
                  )}
                  
                  <div className="agent-stats">
                    <div className="agent-stat">
                      <span className="agent-stat-label">Tasks</span>
                      <span className="agent-stat-value">{agentTasks.length}</span>
                    </div>
                    <div className="agent-stat">
                      <span className="agent-stat-label">Done</span>
                      <span className="agent-stat-value">{completed}</span>
                    </div>
                    <div className="agent-stat">
                      <span className="agent-stat-label">Last Active</span>
                      <span className="agent-stat-value">{formatTimeAgo(agent.lastActivity)}</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%`, background: agent.color }} />
                  </div>
                  
                  {agent.model && (
                    <div className="agent-model">
                      <code>{agent.model}</code>
                      {agent.tokenUsage && <span className="token-usage">{agent.tokenUsage.toLocaleString()} tokens</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="section">
          <h3>⚡ Urgent Tasks</h3>
          {urgentTasks.length === 0 ? (
            <div className="empty-state">No urgent tasks. Great job!</div>
          ) : (
            <div className="task-list">
              {urgentTasks.map(task => (
                <TaskItem key={task.id} task={task} agents={AGENTS} onStatusChange={(status) => onTaskUpdate(task.id, { status })} />
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3>📅 Due Soon (Within 7 Days)</h3>
          {dueSoonTasks.length === 0 ? (
            <div className="empty-state">No tasks due soon.</div>
          ) : (
            <div className="task-list">
              {dueSoonTasks.map(task => (
                <TaskItem key={task.id} task={task} agents={AGENTS} onStatusChange={(status) => onTaskUpdate(task.id, { status })} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .dashboard-header h2 {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .connection-status {
          margin-top: 0.5rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-badge.connected {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-badge.disconnected {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .stat-subtitle {
          font-size: 0.75rem;
          color: var(--text-secondary);
          opacity: 0.8;
        }

        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .loading-indicator {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 400;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
        }

        .agent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1rem;
        }

        .agent-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.2s;
        }

        .agent-card.clickable {
          cursor: pointer;
        }

        .agent-card.clickable:hover {
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .agent-card.clickable:focus {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
        }

        .agent-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }

        .agent-card.active,
        .agent-card.working {
          border-color: rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(16, 185, 129, 0.05) 100%);
        }

        .agent-card.offline {
          opacity: 0.7;
        }

        .agent-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .agent-avatar-wrapper {
          position: relative;
        }

        .agent-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-weight: 600;
          font-size: 1.125rem;
          color: white;
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--bg-tertiary);
        }

        .status-indicator.active,
        .status-indicator.working {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .agent-info {
          flex: 1;
          min-width: 0;
        }

        .agent-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .agent-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .agent-status-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .agent-status-badge.active,
        .agent-status-badge.working {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .agent-status-badge.idle {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .agent-status-badge.offline {
          background: rgba(100, 116, 139, 0.2);
          color: #64748b;
        }

        .agent-current-task {
          padding: 0.75rem;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .task-label {
          color: var(--text-secondary);
          margin-right: 0.5rem;
        }

        .task-text {
          color: var(--text-primary);
        }

        .agent-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .agent-stat {
          text-align: center;
        }

        .agent-stat-label {
          display: block;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .agent-stat-value {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .progress-bar {
          height: 4px;
          background: var(--bg-primary);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .agent-model {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .agent-model code {
          color: var(--accent-purple);
          background: rgba(139, 92, 246, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .token-usage {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}

interface TaskItemProps {
  task: Task
  agents: Array<{ id: string, name: string, color: string }>
  onStatusChange: (status: TaskStatus) => void
}

function TaskItem({ task, agents, onStatusChange }: TaskItemProps) {
  const agent = agents.find(a => a.id === task.assignee)

  return (
    <div className="task-item">
      <div className="task-item-header">
        <span className="task-id">{task.id}</span>
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        >
          <option value="backlog">Backlog</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>
      <h4 className="task-title">{task.title}</h4>
      <div className="task-meta">
        <div className="task-assignee" style={{ color: agent?.color }}>
          {agent?.name}
        </div>
        {task.deadline && (
          <div className="task-deadline">
            Due: {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}
      </div>
      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}
      <style>{`
        .task-item {
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .task-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .task-id {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: 'Fira Code', monospace;
        }

        .status-select {
          padding: 0.25rem 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text-primary);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .task-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .task-deadline {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-blue);
          border-radius: 4px;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}
