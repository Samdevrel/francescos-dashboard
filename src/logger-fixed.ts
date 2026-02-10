// Simple logging utility for dashboard - fixed version

export interface LogEntry {
  id: string
  timestamp: Date
  agent: string
  action: string
  details: string
  model?: string
  level: 'info' | 'success' | 'warning' | 'error'
  duration?: string
}

class ActivityLogger {
  private logs: LogEntry[] = [
    {
      id: 'LOG-001',
      timestamp: new Date('2026-02-10T10:55:00'),
      agent: 'Zoe',
      action: 'Updated agent configuration',
      details: 'Renamed crypto analyst from "Sol" to "Sam"',
      level: 'info'
    },
    {
      id: 'LOG-002',
      timestamp: new Date('2026-02-10T10:54:00'),
      agent: 'Zoe',
      action: 'Created dashboard feature',
      details: 'Added heartbeat status bar to track agent activity',
      level: 'success',
      duration: '2m'
    },
    {
      id: 'LOG-003',
      timestamp: new Date('2026-02-10T10:52:00'),
      agent: 'Zoe',
      action: 'Rebranded dashboard',
      details: 'Changed branding from "Open Cloud" to "Francesco\'s Dashboard"',
      level: 'info'
    },
    {
      id: 'LOG-004',
      timestamp: new Date('2026-02-10T10:45:00'),
      agent: 'Zoe',
      action: 'Set up heartbeat monitoring',
      details: 'Created cron job for 30-minute intervals using sonnet model',
      level: 'success',
      model: 'sonnet'
    },
    {
      id: 'LOG-005',
      timestamp: new Date('2026-02-10T10:30:00'),
      agent: 'Zoe',
      action: 'Analyzed Clawd bot',
      details: 'Studied Clawd\'s ERC-8004, wallet, and x402 integration for Sam roadmap',
      level: 'info',
      model: 'sonnet'
    },
    {
      id: 'LOG-006',
      timestamp: new Date('2026-02-10T10:15:00'),
      agent: 'Zoe',
      action: 'Configured cron job',
      details: 'Set up 30-minute heartbeat checks with isolated agent monitoring',
      level: 'info',
      model: 'sonnet'
    },
    {
      id: 'LOG-007',
      timestamp: new Date('2026-02-10T09:35:00'),
      agent: 'Zoe',
      action: 'Built web UI',
      details: 'Created React dashboard with Dashboard, Kanban, Task List, and Focus views',
      level: 'success',
      duration: '15m',
      model: 'gpt'
    },
    {
      id: 'LOG-008',
      timestamp: new Date('2026-02-10T09:30:00'),
      agent: 'Zoe',
      action: 'Configured cron job',
      details: 'Set up 30-minute heartbeat checks with isolated agent monitoring',
      level: 'info',
      model: 'sonnet'
    },
    {
      id: 'LOG-009',
      timestamp: new Date('2026-02-10T10:09:15:00'),
      agent: 'Sam',
      action: 'Task updated',
      details: 'Changed crypto market analysis status to "in_progress"',
      level: 'info',
      model: 'sonnet'
    },
    {
      id: 'LOG-010',
      timestamp: new Date('2026-02-10T09:15:00'),
      agent: 'Victor',
      action: 'Job discovery',
      details: 'Found 3 new bounty opportunities on Agent Bounty Board',
      level: 'info',
      model: 'sonnet'
    },
    {
      id: 'LOG-011',
      timestamp: new Date('2026-02-10T09:00:00'),
      agent: 'Leo',
      action: 'Investment analysis',
      details: 'Completed Series A opportunity assessment for AI infrastructure startup',
      level: 'success',
      model: 'opus',
      duration: '45m'
    }
  ]

  public add(entry: Omit<LogEntry, 'id'>): void {
    const newEntry = {
      ...entry,
      id: `LOG-${String(this.logs.length + 1).padStart(3, '0')}`,
      timestamp: new Date()
    };
    this.logs = [newEntry, ...this.logs];
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

// Export singleton instance
export const activityLogger = new ActivityLogger();
