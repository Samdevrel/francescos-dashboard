import { useState, useEffect, useCallback } from 'react'
import {
  supabase,
  getTasks,
  getAgentStatuses,
  getActivityLogs,
  subscribeToTasks,
  subscribeToAgentStatuses,
  subscribeToActivityLogs,
  DbTask,
  DbAgentStatus,
  DbActivityLog,
} from '../lib/supabase'

// Hook for Supabase agent statuses with real-time updates
export function useSupabaseAgentStatuses() {
  const [statuses, setStatuses] = useState<DbAgentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    getAgentStatuses()
      .then(data => {
        setStatuses(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAgentStatuses(setStatuses)

    return () => {
      unsubscribe()
    }
  }, [])

  return { statuses, loading, error }
}

// Hook for Supabase activity logs with real-time updates
export function useSupabaseActivityLogs(limit: number = 50) {
  const [logs, setLogs] = useState<DbActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    getActivityLogs(limit)
      .then(data => {
        setLogs(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })

    // Subscribe to real-time updates
    const unsubscribe = subscribeToActivityLogs(setLogs)

    return () => {
      unsubscribe()
    }
  }, [limit])

  return { logs, loading, error }
}

// Hook for Supabase tasks with real-time updates
export function useSupabaseTasks() {
  const [tasks, setTasks] = useState<DbTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    getTasks()
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTasks(setTasks)

    return () => {
      unsubscribe()
    }
  }, [])

  return { tasks, loading, error }
}

// Combined hook for all Supabase dashboard data
export function useSupabaseDashboard() {
  const { statuses, loading: statusesLoading, error: statusesError } = useSupabaseAgentStatuses()
  const { logs, loading: logsLoading, error: logsError } = useSupabaseActivityLogs()
  const { tasks, loading: tasksLoading, error: tasksError } = useSupabaseTasks()

  // Convert Supabase statuses to the format expected by components
  const agentStatuses = statuses.map(s => ({
    id: s.id,
    name: s.name,
    status: s.status,
    lastActivity: s.last_activity ? new Date(s.last_activity).getTime() : undefined,
    currentTask: s.current_task || undefined,
    model: s.model || undefined,
    tokenUsage: s.token_usage,
    sessionKey: s.session_key || undefined,
  }))

  // Convert Supabase logs to the format expected by components
  const activityLogs = logs.map(l => ({
    id: String(l.id),
    timestamp: new Date(l.timestamp),
    agent: l.agent,
    action: l.action,
    details: l.details || '',
    model: l.model || undefined,
    level: l.level || 'info',
    duration: l.duration || undefined,
  }))

  return {
    agentStatuses,
    activityLogs,
    tasks,
    loading: statusesLoading || logsLoading || tasksLoading,
    error: statusesError || logsError || tasksError,
    connected: true, // Supabase is always "connected" if we got here
  }
}
