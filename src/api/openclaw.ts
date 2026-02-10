// OpenClaw Gateway API Client
// Connects to the local OpenClaw gateway for real-time agent data
// Uses Vite proxy to avoid CORS issues (/tools -> localhost:18789)

const GATEWAY_URL = '' // Use relative URL through Vite proxy
const GATEWAY_TOKEN = 'a20c46c40114529ab314ea2649ad7df9610ba23d3cdffa34'

export interface Session {
  key: string
  kind: string
  channel: string
  displayName?: string
  label?: string
  updatedAt: number
  sessionId: string
  model: string
  contextTokens?: number
  totalTokens: number
  systemSent?: boolean
  abortedLastRun?: boolean
  lastChannel?: string
  messages?: SessionMessage[]
}

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system'
  content: MessageContent[]
  model?: string
  timestamp?: number
  usage?: TokenUsage
  stopReason?: string
}

export interface MessageContent {
  type: 'text' | 'thinking' | 'toolCall' | 'toolResult'
  text?: string
  thinking?: string
  name?: string
  id?: string
}

export interface TokenUsage {
  input: number
  output: number
  cacheRead?: number
  cacheWrite?: number
  totalTokens: number
  cost?: {
    input: number
    output: number
    total: number
  }
}

export interface CronJob {
  id: string
  name?: string
  schedule: {
    kind: 'at' | 'every' | 'cron'
    [key: string]: any
  }
  payload: {
    kind: 'systemEvent' | 'agentTurn'
    text?: string
    message?: string
  }
  sessionTarget: 'main' | 'isolated'
  enabled: boolean
  lastRunAt?: number
  nextRunAt?: number
}

export interface SessionsResponse {
  count: number
  sessions: Session[]
}

export interface CronListResponse {
  jobs: CronJob[]
}

export interface AgentStatus {
  id: string
  name: string
  status: 'active' | 'idle' | 'working' | 'offline'
  lastActivity?: number
  currentTask?: string
  model?: string
  tokenUsage?: number
  sessionKey?: string
}

class OpenClawAPI {
  private baseUrl: string
  private token: string

  constructor(baseUrl: string = GATEWAY_URL, token: string = GATEWAY_TOKEN) {
    this.baseUrl = baseUrl
    this.token = token
  }

  private async invoke<T>(tool: string, args: Record<string, any> = {}): Promise<T> {
    const url = `${this.baseUrl}/tools/invoke`
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tool,
          args,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.ok) {
        throw new Error(data.error?.message || 'Unknown API error')
      }
      
      // Gateway wraps tool results in content[0].text as JSON string
      const result = data.result
      if (result?.content?.[0]?.text) {
        return JSON.parse(result.content[0].text) as T
      }
      
      return result as T
    } catch (error) {
      console.error('OpenClaw API Error:', error)
      throw error
    }
  }

  // Get all sessions
  async getSessions(messageLimit: number = 1): Promise<SessionsResponse> {
    return this.invoke<SessionsResponse>('sessions_list', {
      limit: 20,
      messageLimit,
    })
  }

  // Get session history
  async getSessionHistory(sessionKey: string, limit: number = 50): Promise<{ messages: SessionMessage[] }> {
    return this.invoke('sessions_history', {
      sessionKey,
      limit,
      includeTools: true,
    })
  }

  // Get cron jobs
  async getCronJobs(): Promise<CronListResponse> {
    return this.invoke<CronListResponse>('cron', {
      action: 'list',
      includeDisabled: true,
    })
  }

  // Get gateway status (use session_status tool)
  async getStatus(): Promise<{ ok: boolean; [key: string]: any }> {
    try {
      const result = await this.invoke('session_status', {})
      return { ok: true, ...result }
    } catch {
      return { ok: false }
    }
  }

  // Parse sessions into agent statuses
  parseAgentStatuses(sessions: Session[]): AgentStatus[] {
    const agentMap = new Map<string, AgentStatus>()
    
    // Define our agents
    const agents = ['zoe', 'sam', 'leo', 'mika', 'rex', 'victor', 'dante']
    const agentNames: Record<string, string> = {
      zoe: 'Zoe',
      sam: 'Sam',
      leo: 'Leo',
      mika: 'Mika',
      rex: 'Rex',
      victor: 'Victor',
      dante: 'Dante',
    }

    // Initialize all agents as offline
    agents.forEach(id => {
      agentMap.set(id, {
        id,
        name: agentNames[id],
        status: 'offline',
      })
    })

    // Check main session for Zoe
    const mainSession = sessions.find(s => s.key === 'agent:main:main')
    if (mainSession) {
      const timeSinceUpdate = Date.now() - mainSession.updatedAt
      const isRecent = timeSinceUpdate < 5 * 60 * 1000 // 5 minutes
      
      agentMap.set('zoe', {
        id: 'zoe',
        name: 'Zoe',
        status: isRecent ? 'active' : 'idle',
        lastActivity: mainSession.updatedAt,
        model: mainSession.model,
        tokenUsage: mainSession.totalTokens,
        sessionKey: mainSession.key,
        currentTask: this.extractCurrentTask(mainSession),
      })
    }

    // Check for subagent sessions
    sessions.forEach(session => {
      const keyLower = session.key.toLowerCase()
      const labelLower = (session.label || session.displayName || '').toLowerCase()
      
      agents.forEach(agentId => {
        if (agentId === 'zoe') return // Already handled
        
        if (keyLower.includes(agentId) || labelLower.includes(agentId)) {
          const timeSinceUpdate = Date.now() - session.updatedAt
          const isRecent = timeSinceUpdate < 5 * 60 * 1000
          
          agentMap.set(agentId, {
            id: agentId,
            name: agentNames[agentId],
            status: isRecent ? 'working' : 'idle',
            lastActivity: session.updatedAt,
            model: session.model,
            tokenUsage: session.totalTokens,
            sessionKey: session.key,
            currentTask: this.extractCurrentTask(session),
          })
        }
      })
    })

    return Array.from(agentMap.values())
  }

  private extractCurrentTask(session: Session): string | undefined {
    if (!session.messages || session.messages.length === 0) return undefined
    
    const lastMessage = session.messages[session.messages.length - 1]
    if (lastMessage.content) {
      for (const content of lastMessage.content) {
        if (content.type === 'text' && content.text) {
          // Get first line or truncate
          const text = content.text.split('\n')[0]
          return text.length > 100 ? text.substring(0, 100) + '...' : text
        }
      }
    }
    return undefined
  }

  // Extract activity logs from sessions
  extractActivityLogs(sessions: Session[]): ActivityLogEntry[] {
    const logs: ActivityLogEntry[] = []
    
    sessions.forEach(session => {
      if (!session.messages) return
      
      session.messages.forEach(msg => {
        if (msg.timestamp) {
          const agentName = this.getAgentNameFromSession(session)
          
          msg.content?.forEach(content => {
            if (content.type === 'text' && content.text) {
              logs.push({
                id: `${session.sessionId}-${msg.timestamp}`,
                timestamp: new Date(msg.timestamp),
                agent: agentName,
                action: msg.role === 'assistant' ? 'Response' : 'Input',
                details: content.text.substring(0, 200),
                model: msg.model,
                level: 'info',
                duration: msg.usage ? `${msg.usage.totalTokens} tokens` : undefined,
              })
            } else if (content.type === 'toolCall') {
              logs.push({
                id: `${session.sessionId}-${msg.timestamp}-tool`,
                timestamp: new Date(msg.timestamp),
                agent: agentName,
                action: `Tool: ${content.name}`,
                details: `Called ${content.name}`,
                model: msg.model,
                level: 'info',
              })
            }
          })
        }
      })
    })
    
    // Sort by timestamp descending
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  private getAgentNameFromSession(session: Session): string {
    const keyLower = session.key.toLowerCase()
    const labelLower = (session.label || session.displayName || '').toLowerCase()
    
    if (keyLower.includes('main:main') || labelLower.includes('zoe')) return 'Zoe'
    if (keyLower.includes('sam') || labelLower.includes('sam')) return 'Sam'
    if (keyLower.includes('leo') || labelLower.includes('leo')) return 'Leo'
    if (keyLower.includes('mika') || labelLower.includes('mika')) return 'Mika'
    if (keyLower.includes('rex') || labelLower.includes('rex')) return 'Rex'
    if (keyLower.includes('victor') || labelLower.includes('victor')) return 'Victor'
    if (keyLower.includes('dante') || labelLower.includes('dante')) return 'Dante'
    
    return session.label || session.displayName || 'Unknown'
  }
}

export interface ActivityLogEntry {
  id: string
  timestamp: Date
  agent: string
  action: string
  details: string
  model?: string
  level: 'info' | 'success' | 'warning' | 'error'
  duration?: string
}

// Export singleton instance
export const openclawAPI = new OpenClawAPI()

// Export class for custom instances
export { OpenClawAPI }
