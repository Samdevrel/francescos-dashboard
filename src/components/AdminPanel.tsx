import { useState, useEffect } from 'react'
import { Lock, Plus, Trash2, Save, LogOut, Eye, EyeOff } from 'lucide-react'
import { Task, TaskPriority, AGENTS, PRIORITY_COLORS } from '../types'

// Admin credentials - Francesco can change this
const ADMIN_PASSWORD = 'francesco2026'

interface AdminPanelProps {
  tasks: Task[]
  onTasksUpdate: (tasks: Task[]) => void
  onAddTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function AdminPanel({ tasks, onTasksUpdate, onAddTask, onDeleteTask }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  // New task form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: 'zoe',
    priority: 'medium' as TaskPriority,
    deadline: '',
    tags: ''
  })

  // Check if already logged in
  useEffect(() => {
    const auth = localStorage.getItem('dashboard_admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('dashboard_admin_auth', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('dashboard_admin_auth')
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    const task: Task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      status: 'backlog',
      priority: newTask.priority,
      deadline: newTask.deadline || undefined,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    onAddTask(task)
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      assignee: 'zoe',
      priority: 'medium',
      deadline: '',
      tags: ''
    })
  }

  const backlogTasks = tasks.filter(t => t.status === 'backlog')

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <div className="login-header">
            <Lock size={48} />
            <h2>Admin Access</h2>
            <p>Enter password to manage tasks</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">
              <Lock size={18} />
              Login
            </button>
          </form>
        </div>
        
        <style>{`
          .admin-login {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
          }
          
          .login-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2.5rem;
            width: 100%;
            max-width: 400px;
          }
          
          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .login-header svg {
            color: var(--accent-blue);
            margin-bottom: 1rem;
          }
          
          .login-header h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
          }
          
          .login-header p {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
          
          .input-group {
            position: relative;
            margin-bottom: 1rem;
          }
          
          .input-group input {
            width: 100%;
            padding: 0.875rem 1rem;
            padding-right: 3rem;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 1rem;
          }
          
          .input-group input:focus {
            outline: none;
            border-color: var(--accent-blue);
          }
          
          .toggle-password {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.25rem;
          }
          
          .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            padding: 0.75rem;
            border-radius: 8px;
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }
          
          .login-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem;
            background: var(--accent-blue);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .login-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h2>🔐 Admin Panel</h2>
          <p className="subtitle">Add tasks to backlog for agents to execute</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="add-task-section">
          <h3><Plus size={20} /> Add New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detailed description..."
                rows={3}
              />
            </div>
            
            <div className="form-row three-col">
              <div className="form-group">
                <label>Assign to</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                >
                  {AGENTS.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.emoji} {agent.name} - {agent.role}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={newTask.tags}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                placeholder="devrel, twitter, urgent"
              />
            </div>
            
            <button type="submit" className="submit-btn">
              <Plus size={18} />
              Add to Backlog
            </button>
          </form>
        </div>

        <div className="backlog-section">
          <h3>📋 Current Backlog ({backlogTasks.length})</h3>
          {backlogTasks.length === 0 ? (
            <div className="empty-state">No tasks in backlog. Add one above!</div>
          ) : (
            <div className="backlog-list">
              {backlogTasks.map(task => (
                <div key={task.id} className="backlog-item">
                  <div className="task-header">
                    <span className="task-id">{task.id}</span>
                    <span 
                      className="priority-badge"
                      style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority] }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <h4>{task.title}</h4>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-meta">
                    <span className="assignee">
                      {AGENTS.find(a => a.id === task.assignee)?.emoji} {AGENTS.find(a => a.id === task.assignee)?.name}
                    </span>
                    {task.deadline && <span className="deadline">Due: {task.deadline}</span>}
                  </div>
                  {task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                    </div>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-panel {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .admin-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .admin-header .subtitle {
          color: var(--text-secondary);
        }
        
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .logout-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }
        
        .admin-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 900px) {
          .admin-content {
            grid-template-columns: 1fr;
          }
        }
        
        .add-task-section,
        .backlog-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }
        
        .add-task-section h3,
        .backlog-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }
        
        .form-row {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-row.three-col {
          grid-template-columns: repeat(3, 1fr);
        }
        
        @media (max-width: 600px) {
          .form-row.three-col {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          margin-bottom: 1rem;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-blue);
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.875rem;
          background: var(--accent-blue);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .submit-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          font-style: italic;
        }
        
        .backlog-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .backlog-item {
          position: relative;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        
        .backlog-item:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .task-id {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-family: monospace;
        }
        
        .priority-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .backlog-item h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .task-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .task-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        
        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        
        .tag {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-blue);
          border-radius: 4px;
        }
        
        .delete-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.375rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </div>
  )
}
