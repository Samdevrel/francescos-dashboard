export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description?: string
  assignee: string
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
  tags: string[]
  subtasks?: Subtask[]
  dependencies?: string[]
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Agent {
  id: string
  name: string
  role: string
  capabilities: string[]
  color: string
  emoji: string
}

export const AGENTS: Agent[] = [
  { id: 'zoe', name: 'Zoe', emoji: '⚡', role: 'Orchestrator', capabilities: ['Task management', 'Coordination', 'Reporting'], color: '#3b82f6' },
  { id: 'sam', name: 'Sam', emoji: '🔮', role: 'Crypto Analyst & AI Developer Advocate', capabilities: ['Crypto analysis', 'Onchain research', 'DeFi protocols', 'Market research', 'Developer advocacy'], color: '#06b6d4' },
  { id: 'leo', name: 'Leo', emoji: '🦁', role: 'VC Analyst', capabilities: ['VC research', 'Investment analysis', 'Market analysis'], color: '#8b5cf6' },
  { id: 'mika', name: 'Mika', emoji: '✨', role: 'Content Creator', capabilities: ['Content creation', 'Social media', 'Copywriting'], color: '#10b981' },
  { id: 'rex', name: 'Rex', emoji: '🤖', role: 'Trading Bot', capabilities: ['Trading', 'Portfolio management', 'Risk analysis'], color: '#f59e0b' },
  { id: 'victor', name: 'Victor', emoji: '🎯', role: 'Job Market Agent', capabilities: ['Job discovery', 'Application management', 'Bounty boards', 'Reputation tracking'], color: '#ec4899' },
  { id: 'dante', name: 'Dante', emoji: '🌍', role: 'Africa Operations', capabilities: ['Africa operations', 'Local partnerships', 'Market entry'], color: '#ef4444' }
]

// Legacy mapping for backwards compatibility
export const LEGACY_AGENTS: Record<string, string> = {
  'sol': 'sam',
  'cipher': 'sam',
  'vilma': 'victor'
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: '#64748b',
  in_progress: '#3b82f6',
  review: '#8b5cf6',
  done: '#10b981'
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#64748b',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444'
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done'
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
}
