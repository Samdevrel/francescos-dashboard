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
    description: 'Added Content Library, fixed mock data, added docs to GitHub, improved UI.',
    assignee: 'zoe',
    status: 'done',
    priority: 'high',
    deadline: '2026-02-10',
    tags: ['dashboard', 'bugfix'],
    subtasks: [
      { id: 'sub-1', title: 'Handle API errors gracefully', completed: true },
      { id: 'sub-2', title: 'Update mock tasks', completed: true },
      { id: 'sub-3', title: 'Add Content Library view', completed: true },
      { id: 'sub-4', title: 'Add docs to GitHub', completed: true },
      { id: 'sub-5', title: 'Fix Content Library UI', completed: true }
    ],
    created_at: '2026-02-10T23:18:00.000Z',
    updated_at: '2026-02-11T00:39:00.000Z',
    completed_at: '2026-02-11T00:39:00.000Z'
  },
  {
    id: 'TASK-003',
    title: 'Set up Sam\'s Twitter presence',
    description: 'Configure Sam\'s Twitter account for DevRel content. Posted Moltbook verification tweet.',
    assignee: 'sam',
    status: 'done',
    priority: 'high',
    deadline: '2026-02-12',
    tags: ['devrel', 'twitter', 'content'],
    subtasks: [
      { id: 'sub-1', title: 'Review @Osobotai and @0xsmartgator', completed: true },
      { id: 'sub-2', title: 'Research ERC-7702/7710/4337', completed: true },
      { id: 'sub-3', title: 'Post Moltbook verification tweet', completed: true },
      { id: 'sub-4', title: 'Set up automated account', completed: true }
    ],
    created_at: '2026-02-10T19:00:00.000Z',
    updated_at: '2026-02-11T00:09:00.000Z',
    completed_at: '2026-02-11T00:09:00.000Z'
  },
  
  // ===== NIGHT SHIFT TASKS (2026-02-11) =====
  {
    id: 'TASK-012',
    title: 'Claim Sam on Moltbook',
    description: 'Sam\'s Moltbook account claimed! Username: SamDevAdvocate. Cron job running every 15 min.',
    assignee: 'sam',
    status: 'done',
    priority: 'high',
    deadline: '2026-02-11',
    tags: ['moltbook', 'social', 'verification'],
    subtasks: [
      { id: 'sub-1', title: 'Register on Moltbook', completed: true },
      { id: 'sub-2', title: 'Save API credentials', completed: true },
      { id: 'sub-3', title: 'Francesco tweets verification', completed: true },
      { id: 'sub-4', title: 'Post intro on Moltbook', completed: true },
      { id: 'sub-5', title: 'Set up 15-min scan cron (sonnet)', completed: true }
    ],
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:28:00.000Z',
    completed_at: '2026-02-11T00:28:00.000Z'
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
    description: 'Sam posted intro on Moltbook, commented on "The Nightly Build" post, upvoted relevant content.',
    assignee: 'sam',
    status: 'done',
    priority: 'high',
    deadline: '2026-02-12',
    tags: ['moltbook', 'social', 'devrel'],
    subtasks: [
      { id: 'sub-1', title: 'Write intro post', completed: true },
      { id: 'sub-2', title: 'Comment on relevant post', completed: true },
      { id: 'sub-3', title: 'Upvote good content', completed: true }
    ],
    created_at: '2026-02-11T00:00:00.000Z',
    updated_at: '2026-02-11T00:25:00.000Z',
    completed_at: '2026-02-11T00:25:00.000Z'
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
