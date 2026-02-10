import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://idzhmczboqhckwtwpikp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkemhtY3pib3FoY2t3dHdwaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjI0OTcsImV4cCI6MjA4NjMzODQ5N30.RB5wFMQmGCRw-aU26ZGC9uzI6QatVud_VTYEbynOn6Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface DbTask {
  id: string
  title: string
  description: string | null
  assignee: string
  status: 'backlog' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline: string | null
  tags: string[]
  subtasks: any[]
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface DbAgentStatus {
  id: string
  name: string
  status: 'active' | 'working' | 'idle' | 'offline'
  last_activity: string | null
  current_task: string | null
  model: string | null
  token_usage: number
  session_key: string | null
  updated_at: string
}

export interface DbActivityLog {
  id: number
  timestamp: string
  agent: string
  action: string
  details: string | null
  model: string | null
  level: 'info' | 'success' | 'warning' | 'error'
  duration: string | null
}

// Helper functions
export async function getTasks(): Promise<DbTask[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
  return data || []
}

export async function createTask(task: Partial<DbTask>): Promise<DbTask | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating task:', error)
    return null
  }
  return data
}

export async function updateTask(id: string, updates: Partial<DbTask>): Promise<DbTask | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating task:', error)
    return null
  }
  return data
}

export async function deleteTask(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting task:', error)
    return false
  }
  return true
}

export async function getAgentStatuses(): Promise<DbAgentStatus[]> {
  const { data, error } = await supabase
    .from('agent_statuses')
    .select('*')
  
  if (error) {
    console.error('Error fetching agent statuses:', error)
    return []
  }
  return data || []
}

export async function updateAgentStatus(id: string, updates: Partial<DbAgentStatus>): Promise<void> {
  const { error } = await supabase
    .from('agent_statuses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating agent status:', error)
  }
}

export async function getActivityLogs(limit: number = 50): Promise<DbActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }
  return data || []
}

export async function addActivityLog(log: Omit<DbActivityLog, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('activity_logs')
    .insert(log)
  
  if (error) {
    console.error('Error adding activity log:', error)
  }
}

// Subscribe to real-time changes
export function subscribeToTasks(callback: (tasks: DbTask[]) => void) {
  const subscription = supabase
    .channel('tasks-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks' },
      async () => {
        const tasks = await getTasks()
        callback(tasks)
      }
    )
    .subscribe()
  
  return () => subscription.unsubscribe()
}

export function subscribeToAgentStatuses(callback: (statuses: DbAgentStatus[]) => void) {
  const subscription = supabase
    .channel('agent-statuses-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'agent_statuses' },
      async () => {
        const statuses = await getAgentStatuses()
        callback(statuses)
      }
    )
    .subscribe()
  
  return () => subscription.unsubscribe()
}

export function subscribeToActivityLogs(callback: (logs: DbActivityLog[]) => void) {
  const subscription = supabase
    .channel('activity-logs-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'activity_logs' },
      async () => {
        const logs = await getActivityLogs()
        callback(logs)
      }
    )
    .subscribe()
  
  return () => subscription.unsubscribe()
}
