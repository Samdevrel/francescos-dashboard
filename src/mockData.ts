import { Task } from './types'

// Real tasks being worked on by Francesco's agents
export const mockTasks: Task[] = [
  // ===== IN PROGRESS =====
  {
    id: 'TASK-001',
    title: 'Deploy Dashboard to Vercel',
    description: 'Set up Sam\'s Vercel account, connect GitHub, and deploy the dashboard. Create GitHub repo, push code, configure Vercel project.',
    assignee: 'sam',
    status: 'done',
    priority: 'urgent',
    deadline: '2026-02-10',
    tags: ['devrel', 'deployment', 'vercel'],
    subtasks: [
      { id: 'sub-1', title: 'Create GitHub repo', completed: true },
      { id: 'sub-2', title: 'Push dashboard code', completed: true },
      { id: 'sub-3', title: 'Connect Vercel to GitHub', completed: true },
      { id: 'sub-4', title: 'Deploy to production', completed: true }
    ],
    created_at: '2026-02-10T20:00:00.000Z',
    updated_at: '2026-02-10T23:10:00.000Z',
    completed_at: '2026-02-10T23:10:00.000Z'
  },
  {
    id: 'TASK-002',
    title: 'Fix Dashboard Issues',
    description: 'Fix API 404 error, update mock data with real tasks, improve agent status indicators.',
    assignee: 'zoe',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-02-10',
    tags: ['dashboard', 'bugfix'],
    subtasks: [
      { id: 'sub-1', title: 'Handle API errors gracefully', completed: false },
      { id: 'sub-2', title: 'Update mock tasks', completed: true },
      { id: 'sub-3', title: 'Fix agent status detection', completed: false },
      { id: 'sub-4', title: 'Add README to repo', completed: true }
    ],
    created_at: '2026-02-10T23:18:00.000Z',
    updated_at: '2026-02-10T23:25:00.000Z'
  },
  {
    id: 'TASK-003',
    title: 'Set up Sam\'s Twitter presence',
    description: 'Configure Sam\'s Twitter account for DevRel content. Focus on ERC-7710, ERC-8004, x402 protocols, and Safe integrations.',
    assignee: 'sam',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-02-12',
    tags: ['devrel', 'twitter', 'content'],
    subtasks: [
      { id: 'sub-1', title: 'Review @Osobotai and @clawdbotatg builds', completed: true },
      { id: 'sub-2', title: 'Create SAM_TECH_TASKS.md', completed: true },
      { id: 'sub-3', title: 'Write first tech thread', completed: false },
      { id: 'sub-4', title: 'Post announcement tweet', completed: false }
    ],
    created_at: '2026-02-10T19:00:00.000Z',
    updated_at: '2026-02-10T22:00:00.000Z'
  },
  
  // ===== NIGHT SHIFT TASKS (2026-02-11) =====
  {
    id: 'TASK-012',
    title: 'Claim Sam on Moltbook',
    description: 'Francesco needs to tweet verification to claim Sam\'s Moltbook account. Username: SamDevAdvocate, Code: blue-63WY',
    assignee: 'sam',
    status: 'in_progress',
    priority: 'high',
    deadline: '2026-02-11',
    tags: ['moltbook', 'social', 'verification'],
    subtasks: [
      { id: 'sub-1', title: 'Register on Moltbook', completed: true },
      { id: 'sub-2', title: 'Save API credentials', completed: true },
      { id: 'sub-3', title: 'Francesco tweets verification', completed: false },
      { id: 'sub-4', title: 'Start posting on Moltbook', completed: false }
    ],
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:05:00.000Z'
  },
  {
    id: 'TASK-013',
    title: 'Night Research: ERC-7702/7710/4337',
    description: 'Deep dive research on account abstraction standards, MetaMask delegation framework, and key people in the space.',
    assignee: 'zoe',
    status: 'done',
    priority: 'high',
    tags: ['research', 'ethereum', 'standards'],
    subtasks: [
      { id: 'sub-1', title: 'Study ERC-7702 (Set Code for EOAs)', completed: true },
      { id: 'sub-2', title: 'Study ERC-4337 (Account Abstraction)', completed: true },
      { id: 'sub-3', title: 'Research @Osobotai and @0xsmartgator', completed: true },
      { id: 'sub-4', title: 'Review MetaMask delegation docs', completed: true },
      { id: 'sub-5', title: 'Check Vitalik blog posts', completed: true },
      { id: 'sub-6', title: 'Compile research report', completed: true }
    ],
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:30:00.000Z',
    completed_at: '2026-02-11T00:30:00.000Z'
  },
  {
    id: 'TASK-014',
    title: 'Post intro on Moltbook',
    description: 'Once claimed, introduce Sam on Moltbook. Engage with relevant posts about ERC-7710, delegations, AI agents.',
    assignee: 'sam',
    status: 'backlog',
    priority: 'high',
    deadline: '2026-02-12',
    tags: ['moltbook', 'social', 'devrel'],
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:00:00.000Z'
  },
  {
    id: 'TASK-015',
    title: 'Set up Supabase tables',
    description: 'Run SQL schema in Supabase dashboard to create tasks, agent_statuses, and activity_logs tables for real-time sync.',
    assignee: 'zoe',
    status: 'backlog',
    priority: 'high',
    deadline: '2026-02-11',
    tags: ['supabase', 'database', 'dashboard'],
    created_at: '2026-02-10T23:45:00.000Z',
    updated_at: '2026-02-10T23:45:00.000Z'
  },

  // ===== BACKLOG =====
  {
    id: 'TASK-004',
    title: 'Generate Agent Avatar Images',
    description: 'Create unique avatar images for all 7 agents using Nano Banana (Gemini 3 image model via Artlist.io).',
    assignee: 'mika',
    status: 'backlog',
    priority: 'medium',
    tags: ['content', 'design', 'avatars'],
    created_at: '2026-02-10T15:00:00.000Z',
    updated_at: '2026-02-10T15:00:00.000Z'
  },
  {
    id: 'TASK-005',
    title: 'Connect Dashboard to Real OpenClaw API',
    description: 'Set up proper API integration so the dashboard shows real agent statuses when running locally.',
    assignee: 'zoe',
    status: 'backlog',
    priority: 'high',
    tags: ['dashboard', 'api', 'integration'],
    created_at: '2026-02-10T23:00:00.000Z',
    updated_at: '2026-02-10T23:00:00.000Z'
  },
  {
    id: 'TASK-006',
    title: 'Write ERC-7710 Deep Dive Thread',
    description: 'Create a technical Twitter thread explaining ERC-7710 delegations - how they work, use cases, and implementation examples.',
    assignee: 'sam',
    status: 'backlog',
    priority: 'high',
    deadline: '2026-02-13',
    tags: ['devrel', 'twitter', 'erc-7710'],
    created_at: '2026-02-10T22:00:00.000Z',
    updated_at: '2026-02-10T22:00:00.000Z'
  },
  {
    id: 'TASK-007',
    title: 'Research Nigeria fintech opportunities',
    description: 'Market analysis for fintech expansion in Nigeria - regulatory environment, competitors, opportunities.',
    assignee: 'dante',
    status: 'backlog',
    priority: 'low',
    deadline: '2026-02-20',
    tags: ['africa', 'research', 'fintech'],
    created_at: '2026-02-06T10:00:00.000Z',
    updated_at: '2026-02-06T10:00:00.000Z'
  },
  {
    id: 'TASK-008',
    title: 'Review smart contract audit bounty',
    description: 'Evaluate Agent Bounty Board opportunity for Solidity smart contract audit.',
    assignee: 'victor',
    status: 'backlog',
    priority: 'medium',
    tags: ['job-market', 'bounty', 'audit'],
    created_at: '2026-02-10T09:00:00.000Z',
    updated_at: '2026-02-10T10:00:00.000Z'
  },
  
  // ===== DONE =====
  {
    id: 'TASK-009',
    title: 'Set up heartbeat monitoring',
    description: 'Configure 30-minute heartbeat checks for dashboard monitoring via cron job.',
    assignee: 'zoe',
    status: 'done',
    priority: 'urgent',
    tags: ['openclaw', 'automation', 'monitoring'],
    created_at: '2026-02-10T08:00:00.000Z',
    updated_at: '2026-02-10T09:35:00.000Z',
    completed_at: '2026-02-10T09:35:00.000Z'
  },
  {
    id: 'TASK-010',
    title: 'Create Agent Profiles & Hierarchy',
    description: 'Build agent profile pages with backstories, roles, and hierarchical visualization.',
    assignee: 'zoe',
    status: 'done',
    priority: 'high',
    tags: ['dashboard', 'agents', 'ui'],
    created_at: '2026-02-10T14:00:00.000Z',
    updated_at: '2026-02-10T19:00:00.000Z',
    completed_at: '2026-02-10T19:00:00.000Z'
  },
  {
    id: 'TASK-011',
    title: 'Set up Sam\'s GitHub account',
    description: 'Create GitHub account (Samdevrel), set up PAT for pushing code.',
    assignee: 'sam',
    status: 'done',
    priority: 'high',
    tags: ['devrel', 'github', 'setup'],
    created_at: '2026-02-10T21:00:00.000Z',
    updated_at: '2026-02-10T22:30:00.000Z',
    completed_at: '2026-02-10T22:30:00.000Z'
  },
  {
    id: 'TASK-012',
    title: 'Create model allocation strategy',
    description: 'Define model mapping for all 7 agents - opus for complex tasks, sonnet/gpt-mini for routine work.',
    assignee: 'zoe',
    status: 'done',
    priority: 'medium',
    tags: ['planning', 'models', 'agents'],
    created_at: '2026-02-10T12:00:00.000Z',
    updated_at: '2026-02-10T13:00:00.000Z',
    completed_at: '2026-02-10T13:00:00.000Z'
  }
]
