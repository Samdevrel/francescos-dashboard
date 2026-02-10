import { useState } from 'react'
import { Task, TaskStatus, TaskPriority } from '../types'
import { AGENTS, STATUS_COLORS, PRIORITY_COLORS } from '../types'
import { TaskCard } from './TaskCard'
import { Search, Filter } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAgent = filterAgent === 'all' || task.assignee === filterAgent
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority

    return matchesSearch && matchesAgent && matchesStatus && matchesPriority
  })

  const activeFilters = [filterAgent, filterStatus, filterPriority].filter(f => f !== 'all').length

  return (
    <div className="task-list-page">
      <div className="task-list-header">
        <div>
          <h2>Task List</h2>
          <p className="subtitle">
            {filteredTasks.length} of {tasks.length} tasks
            {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
          </p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={16} />
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Agents</option>
            {AGENTS.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="backlog">Backlog</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {activeFilters > 0 && (
            <button
              onClick={() => {
                setFilterAgent('all')
                setFilterStatus('all')
                setFilterPriority('all')
              }}
              className="clear-filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="task-grid">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            agent={AGENTS.find(a => a.id === task.assignee)}
            onStatusChange={(status) => onTaskUpdate(task.id, { status })}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks match your filters</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterAgent('all')
              setFilterStatus('all')
              setFilterPriority('all')
            }}
            className="clear-button"
          >
            Clear all filters
          </button>
        </div>
      )}

      <style jsx>{`
        .task-list-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .task-list-header {
          margin-bottom: 2rem;
        }

        .task-list-header h2 {
          font-size: 2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .filters-bar {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          max-width: 400px;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .search-box:focus-within {
          border-color: var(--accent-blue);
        }

        .search-icon {
          color: var(--text-secondary);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .search-input::placeholder {
          color: var(--text-secondary);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-group > svg {
          color: var(--text-secondary);
        }

        .filter-select {
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:hover,
        .filter-select:focus {
          border-color: var(--accent-blue);
          outline: none;
        }

        .clear-filters {
          padding: 0.5rem 1rem;
          background: rgba(239, 68, 68, 0.15);
          border: none;
          border-radius: 6px;
          color: var(--accent-red);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-filters:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        }

        .empty-state p {
          font-size: 1.125rem;
          margin-bottom: 1rem;
        }

        .clear-button {
          padding: 0.75rem 1.5rem;
          background: var(--accent-blue);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-button:hover {
          background: #2563eb;
        }

        @media (max-width: 1024px) {
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: none;
          }

          .filter-group {
            flex-wrap: wrap;
          }

          .task-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
