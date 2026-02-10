import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { KanbanBoard } from './components/KanbanBoard'
import { TaskList } from './components/TaskList'
import { CurrentFocus } from './components/CurrentFocus'
import { ActivityLog } from './components/ActivityLog-new'
import { AgentProfile } from './components/AgentProfile'
import { AdminPanel } from './components/AdminPanel'
import { mockTasks } from './mockData'
import { useDashboardData } from './hooks/useOpenClaw'
import { Plus } from 'lucide-react'
import { Task } from './types'

type View = 'dashboard' | 'kanban' | 'list' | 'focus' | 'logs' | 'agent' | 'admin'

// Load tasks from localStorage or use mock data
const loadTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('dashboard_tasks')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load tasks from localStorage:', e)
  }
  return mockTasks
}

// Save tasks to localStorage
const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks))
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e)
  }
}

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Real-time data from OpenClaw
  const { 
    agentStatuses, 
    sessions, 
    connected, 
    loading, 
    error, 
    lastRefresh, 
    workingStatus,
    cronJobs 
  } = useDashboardData(5000)

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleViewChange = (view: View) => {
    if (view !== 'agent') {
      setSelectedAgentId(null)
    }
    setCurrentView(view)
  }

  const handleAgentClick = (agentId: string) => {
    setSelectedAgentId(agentId)
    setCurrentView('agent')
  }

  const handleBackFromAgent = () => {
    setSelectedAgentId(null)
    setCurrentView('dashboard')
  }

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
    ))
  }

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const handleCreateTask = (title: string) => {
    const newTask: Task = {
      id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      title,
      assignee: 'zoe',
      status: 'backlog',
      priority: 'medium',
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setTasks([...tasks, newTask])
    setShowCreateModal(false)
  }

  // Get real-time status for selected agent
  const selectedAgentStatus = selectedAgentId 
    ? agentStatuses.find(a => a.id === selectedAgentId)
    : undefined

  // Determine if we're using mock data (API unavailable)
  const usingMockData = error !== null && agentStatuses.length > 0

  return (
    <Layout 
      currentView={currentView === 'agent' ? 'dashboard' : currentView} 
      onViewChange={handleViewChange} 
      workingStatus={workingStatus}
      connected={connected}
      lastRefresh={lastRefresh}
      error={usingMockData ? null : error} // Hide error when using mock data fallback
    >
      {currentView === 'dashboard' && (
        <Dashboard 
          tasks={tasks} 
          onTaskUpdate={handleTaskUpdate} 
          agentStatuses={agentStatuses}
          sessions={sessions}
          connected={usingMockData ? true : connected} // Show as connected when using mock
          loading={loading}
          onAgentClick={handleAgentClick}
        />
      )}
      {currentView === 'kanban' && <KanbanBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} />}
      {currentView === 'list' && <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} />}
      {currentView === 'focus' && (
        <CurrentFocus 
          sessions={sessions}
          cronJobs={cronJobs}
          workingStatus={workingStatus}
        />
      )}
      {currentView === 'logs' && <ActivityLog sessions={sessions} />}
      {currentView === 'agent' && selectedAgentId && (
        <AgentProfile 
          agentId={selectedAgentId}
          onBack={handleBackFromAgent}
          realTimeStatus={selectedAgentStatus}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel 
          tasks={tasks}
          onTasksUpdate={setTasks}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
      
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Task</h3>
            <input
              type="text"
              placeholder="Task title..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    handleCreateTask(input.value.trim())
                  }
                }
              }}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="modal-btn create">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {currentView !== 'agent' && currentView !== 'admin' && (
        <button className="fab" onClick={() => setShowCreateModal(true)}>
          <Plus size={24} />
        </button>
      )}
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
        }

        .modal h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .modal-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 1rem;
          outline: none;
        }

        .modal-input:focus {
          border-color: var(--accent-blue);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .modal-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn.cancel {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .modal-btn.cancel:hover {
          background: var(--bg-tertiary);
        }

        .modal-btn.create {
          background: var(--accent-blue);
          border: none;
          color: white;
        }

        .modal-btn.create:hover {
          background: #2563eb;
        }

        .fab {
          position: fixed;
          bottom: 5rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent-blue);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s;
          z-index: 100;
        }

        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </Layout>
  )
}

export default App
