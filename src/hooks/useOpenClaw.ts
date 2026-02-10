import { useState, useEffect, useCallback } from 'react'
import { openclawAPI, Session, AgentStatus, ActivityLogEntry, CronJob } from '../api/openclaw'

// Hook for fetching sessions with auto-refresh
export function useSessions(refreshInterval: number = 5000) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())

  const refresh = useCallback(async () => {
    try {
      const response = await openclawAPI.getSessions(3) // Get last 3 messages
      setSessions(response.sessions)
      setError(null)
      setLastRefresh(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    
    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refresh, refreshInterval])

  return { sessions, loading, error, refresh, lastRefresh }
}

// Hook for agent statuses derived from sessions
export function useAgentStatuses(refreshInterval: number = 5000) {
  const { sessions, loading, error, refresh, lastRefresh } = useSessions(refreshInterval)
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([])

  useEffect(() => {
    if (sessions.length > 0) {
      const statuses = openclawAPI.parseAgentStatuses(sessions)
      setAgentStatuses(statuses)
    }
  }, [sessions])

  return { agentStatuses, sessions, loading, error, refresh, lastRefresh }
}

// Hook for activity logs from sessions
export function useActivityLogs(refreshInterval: number = 5000) {
  const { sessions, loading, error, refresh, lastRefresh } = useSessions(refreshInterval)
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])

  useEffect(() => {
    if (sessions.length > 0) {
      const activityLogs = openclawAPI.extractActivityLogs(sessions)
      setLogs(activityLogs)
    }
  }, [sessions])

  return { logs, sessions, loading, error, refresh, lastRefresh }
}

// Hook for cron jobs
export function useCronJobs(refreshInterval: number = 30000) {
  const [jobs, setJobs] = useState<CronJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const response = await openclawAPI.getCronJobs()
      setJobs(response.jobs)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cron jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    
    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refresh, refreshInterval])

  return { jobs, loading, error, refresh }
}

// Hook for gateway connection status
export function useGatewayStatus(refreshInterval: number = 10000) {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<number>(Date.now())

  const checkStatus = useCallback(async () => {
    try {
      await openclawAPI.getStatus()
      setConnected(true)
    } catch {
      setConnected(false)
    } finally {
      setLoading(false)
      setLastCheck(Date.now())
    }
  }, [])

  useEffect(() => {
    checkStatus()
    
    if (refreshInterval > 0) {
      const interval = setInterval(checkStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [checkStatus, refreshInterval])

  return { connected, loading, lastCheck, checkStatus }
}

// Combined hook for dashboard data
export function useDashboardData(refreshInterval: number = 5000) {
  const { agentStatuses, sessions, loading: sessionsLoading, error: sessionsError, lastRefresh } = useAgentStatuses(refreshInterval)
  const { connected, loading: statusLoading } = useGatewayStatus(refreshInterval * 2)
  const { jobs, loading: cronLoading } = useCronJobs(30000)

  const mainSession = sessions.find(s => s.key === 'agent:main:main')
  
  // Determine Zoe's working status
  const getWorkingStatus = (): 'working' | 'done' | 'idle' | 'chat' => {
    if (!mainSession) return 'idle'
    
    const timeSinceUpdate = Date.now() - mainSession.updatedAt
    
    // If very recent activity, she's working
    if (timeSinceUpdate < 30 * 1000) return 'working'
    
    // If within 2 minutes, likely chatting/responding
    if (timeSinceUpdate < 2 * 60 * 1000) return 'chat'
    
    // If within 10 minutes, idle but available
    if (timeSinceUpdate < 10 * 60 * 1000) return 'idle'
    
    // Otherwise, consider done/sleeping
    return 'done'
  }

  return {
    agentStatuses,
    sessions,
    cronJobs: jobs,
    connected,
    loading: sessionsLoading || statusLoading || cronLoading,
    error: sessionsError,
    lastRefresh,
    workingStatus: getWorkingStatus(),
    mainSession,
  }
}
