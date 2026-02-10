import { Task } from './types'

export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Research OpenClaw update requirements',
    description: 'Investigate what features and improvements are needed for the next OpenClaw update.',
    assignee: 'zoe',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-02-15',
    tags: ['research', 'openclaw'],
    subtasks: [
      { id: 'sub-1', title: 'Read existing documentation', completed: true },
      { id: 'sub-2', title: 'Identify pain points', completed: true },
      { id: 'sub-3', title: 'Propose improvements', completed: false }
    ],
    created_at: '2026-02-08T10:00:00.000Z',
    updated_at: '2026-02-10T09:00:00.000Z'
  },
  {
    id: 'TASK-002',
    title: 'Analyze crypto market trends',
    description: 'Prepare weekly crypto market analysis report.',
    assignee: 'sam',
    status: 'in_progress',
    priority: 'urgent',
    deadline: '2026-02-12',
    tags: ['crypto', 'analysis'],
    created_at: '2026-02-09T08:00:00.000Z',
    updated_at: '2026-02-10T09:00:00.000Z'
  },
  {
    id: 'TASK-003',
    title: 'VC investment opportunity assessment',
    description: 'Evaluate Series A investment opportunity in AI infrastructure startup.',
    assignee: 'leo',
    status: 'review',
    priority: 'high',
    deadline: '2026-02-14',
    tags: ['vc', 'investment'],
    created_at: '2026-02-07T14:00:00.000Z',
    updated_at: '2026-02-09T16:00:00.000Z'
  },
  {
    id: 'TASK-004',
    title: 'Write OpenCloud launch announcement',
    description: 'Create compelling announcement for the OpenCloud product launch.',
    assignee: 'mika',
    status: 'backlog',
    priority: 'medium',
    tags: ['content', 'marketing'],
    created_at: '2026-02-09T11:00:00.000Z',
    updated_at: '2026-02-09T11:00:00.000Z'
  },
  {
    id: 'TASK-005',
    title: 'Portfolio rebalancing strategy',
    description: 'Develop and implement portfolio rebalancing strategy.',
    assignee: 'rex',
    status: 'backlog',
    priority: 'high',
    tags: ['trading', 'portfolio'],
    created_at: '2026-02-08T15:00:00.000Z',
    updated_at: '2026-02-08T15:00:00.000Z'
  },
  {
    id: 'TASK-006',
    title: 'Review senior developer applications',
    description: 'Review and shortlist candidates for senior developer positions.',
    assignee: 'victor',
    status: 'done',
    priority: 'medium',
    deadline: '2026-02-10',
    tags: ['job-market', 'applications'],
    created_at: '2026-02-05T09:00:00.000Z',
    updated_at: '2026-02-09T17:00:00.000Z',
    completed_at: '2026-02-09T17:00:00.000Z'
  },
  {
    id: 'TASK-007',
    title: 'Nigeria market expansion research',
    description: 'Research market entry opportunities in Nigeria for fintech products.',
    assignee: 'dante',
    status: 'backlog',
    priority: 'low',
    deadline: '2026-02-20',
    tags: ['africa', 'research'],
    created_at: '2026-02-06T10:00:00.000Z',
    updated_at: '2026-02-06T10:00:00.000Z'
  },
  {
    id: 'TASK-008',
    title: 'Set up heartbeat monitoring system',
    description: 'Configure automated heartbeat checks for dashboard monitoring.',
    assignee: 'zoe',
    status: 'done',
    priority: 'urgent',
    tags: ['openclaw', 'automation'],
    created_at: '2026-02-10T08:00:00.000Z',
    updated_at: '2026-02-10T09:35:00.000Z',
    completed_at: '2026-02-10T09:35:00.000Z'
  },
  {
    id: 'TASK-009',
    title: 'Apply to smart contract audit job on Agent Bounty Board',
    description: 'Review job requirements and submit proposal for Solidity smart contract audit.',
    assignee: 'victor',
    status: 'in_progress',
    priority: 'high',
    tags: ['job-market', 'bounty', 'audit'],
    created_at: '2026-02-10T09:00:00.000Z',
    updated_at: '2026-02-10T10:00:00.000Z'
  }
]
