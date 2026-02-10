import { Task, TaskStatus } from '../types'
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../types'

interface TaskCardProps {
  task: Task
  agent?: { id: string, name: string, color: string }
  onStatusChange: (status: TaskStatus) => void
}

export function TaskCard({ task, agent, onStatusChange }: TaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority]
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done'
  const isDueSoon = task.deadline && !isOverdue && task.status !== 'done' && 
    (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 3

  return (
    <div className="task-card">
      <div className="task-card-header">
        <span className="task-id">{task.id}</span>
        <div className="task-priority" style={{ color: priorityColor }}>
          {PRIORITY_LABELS[task.priority]}
        </div>
      </div>
      
      <h4 className="task-title">{task.title}</h4>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="task-assignee">
          <span className="assignee-dot" style={{ background: agent?.color }} />
          {agent?.name}
        </div>
        {task.deadline && (
          <div className={`task-deadline ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
            {isOverdue && '⚠️ '}
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        )}
      </div>
      
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="task-subtasks">
          <div className="subtasks-progress">
            {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}
          </div>
          <div className="subtasks-bar">
            <div 
              className="subtasks-fill"
              style={{ 
                width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
      
      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}
      
      <div className="task-actions">
        <select
          className="status-dropdown"
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        >
          <option value="backlog">Backlog</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      <style jsx>{`
        .task-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .task-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .task-id {
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-family: 'Fira Code', monospace;
        }

        .task-priority {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .task-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }

        .task-description {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .assignee-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .task-deadline {
          font-size: 0.75rem;
        }

        .task-deadline.overdue {
          color: var(--accent-red);
        }

        .task-deadline.due-soon {
          color: var(--accent-yellow);
        }

        .task-subtasks {
          margin-bottom: 0.75rem;
        }

        .subtasks-progress {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .subtasks-bar {
          height: 4px;
          background: var(--bg-secondary);
          border-radius: 2px;
          overflow: hidden;
        }

        .subtasks-fill {
          height: 100%;
          background: var(--accent-green);
          transition: width 0.3s ease;
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          color: var(--accent-blue);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .task-actions {
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }

        .status-dropdown {
          width: 100%;
          padding: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .status-dropdown:hover,
        .status-dropdown:focus {
          border-color: var(--accent-blue);
          outline: none;
        }
      `}</style>
    </div>
  )
}
