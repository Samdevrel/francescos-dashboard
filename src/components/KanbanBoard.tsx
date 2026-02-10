import { Task, TaskStatus } from '../types'
import { STATUS_COLORS, STATUS_LABELS, AGENTS } from '../types'
import { TaskCard } from './TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
}

const STATUSES: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done']

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const getTasksForStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <h2>Kanban Board</h2>
      </div>
      <div className="kanban-columns">
        {STATUSES.map(status => {
          const columnTasks = getTasksForStatus(status)
          const color = STATUS_COLORS[status]
          return (
            <div key={status} className="kanban-column">
              <div className="column-header">
                <div className="column-indicator" style={{ background: color }} />
                <h3 className="column-title">{STATUS_LABELS[status]}</h3>
                <span className="column-count">{columnTasks.length}</span>
              </div>
              <div className="column-tasks">
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    agent={AGENTS.find(a => a.id === task.assignee)}
                    onStatusChange={(newStatus) => onTaskUpdate(task.id, { status: newStatus })}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="empty-column">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <style jsx>{`
        .kanban-board {
          height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
        }

        .kanban-header {
          margin-bottom: 1.5rem;
        }

        .kanban-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .kanban-columns {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          flex: 1;
          min-height: 0;
        }

        .kanban-column {
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .column-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .column-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
        }

        .column-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .column-tasks {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-column {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
