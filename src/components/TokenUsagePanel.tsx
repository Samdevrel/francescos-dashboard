import { Coins, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Session } from '../api/openclaw'

interface TokenUsagePanelProps {
  sessions: Session[]
}

interface ModelUsage {
  model: string
  displayName: string
  tokensUsed: number
  limit: number
  cost: number
  sessions: number
}

// Model limits and pricing (monthly)
const MODEL_CONFIG: Record<string, { displayName: string; limit: number; inputCost: number; outputCost: number }> = {
  'claude-opus-4-5': { displayName: 'Claude Opus 4.5', limit: 5000000, inputCost: 15, outputCost: 75 },
  'anthropic/claude-opus-4-5': { displayName: 'Claude Opus 4.5', limit: 5000000, inputCost: 15, outputCost: 75 },
  'claude-sonnet-4': { displayName: 'Claude Sonnet 4', limit: 10000000, inputCost: 3, outputCost: 15 },
  'anthropic/claude-sonnet-4': { displayName: 'Claude Sonnet 4', limit: 10000000, inputCost: 3, outputCost: 15 },
  'claude-sonnet-4-5': { displayName: 'Claude Sonnet 4.5', limit: 10000000, inputCost: 3, outputCost: 15 },
  'anthropic/claude-sonnet-4-5': { displayName: 'Claude Sonnet 4.5', limit: 10000000, inputCost: 3, outputCost: 15 },
  'gpt-5': { displayName: 'GPT-5', limit: 5000000, inputCost: 10, outputCost: 30 },
  'openai/gpt-5': { displayName: 'GPT-5', limit: 5000000, inputCost: 10, outputCost: 30 },
  'gpt-5-mini': { displayName: 'GPT-5 Mini', limit: 20000000, inputCost: 0.15, outputCost: 0.6 },
  'openai/gpt-5-mini': { displayName: 'GPT-5 Mini', limit: 20000000, inputCost: 0.15, outputCost: 0.6 },
  'gpt-5.2': { displayName: 'GPT-5.2', limit: 5000000, inputCost: 10, outputCost: 30 },
  'openai/gpt-5.2': { displayName: 'GPT-5.2', limit: 5000000, inputCost: 10, outputCost: 30 },
  'gemini-3-pro-preview': { displayName: 'Gemini 3 Pro', limit: 10000000, inputCost: 1.25, outputCost: 5 },
  'google/gemini-3-pro-preview': { displayName: 'Gemini 3 Pro', limit: 10000000, inputCost: 1.25, outputCost: 5 },
  'gemini-3-flash-preview': { displayName: 'Gemini 3 Flash', limit: 50000000, inputCost: 0.075, outputCost: 0.3 },
  'google/gemini-3-flash-preview': { displayName: 'Gemini 3 Flash', limit: 50000000, inputCost: 0.075, outputCost: 0.3 },
  'glm-4.7': { displayName: 'GLM 4.7', limit: 20000000, inputCost: 0.5, outputCost: 2 },
  'zai/glm-4.7': { displayName: 'GLM 4.7', limit: 20000000, inputCost: 0.5, outputCost: 2 },
  'glm-4.7-flash': { displayName: 'GLM 4.7 Flash', limit: 50000000, inputCost: 0.1, outputCost: 0.4 },
  'zai/glm-4.7-flash': { displayName: 'GLM 4.7 Flash', limit: 50000000, inputCost: 0.1, outputCost: 0.4 },
  'glm-5': { displayName: 'GLM-5', limit: 10000000, inputCost: 1, outputCost: 4 },
  'zai/glm-5': { displayName: 'GLM-5', limit: 10000000, inputCost: 1, outputCost: 4 },
  // Ollama local models (free, unlimited)
  'ollama/qwen2.5': { displayName: 'Qwen 2.5 (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
  'ollama/qwen2.5:latest': { displayName: 'Qwen 2.5 (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
  'ollama/qwen2.5vl': { displayName: 'Qwen 2.5 VL (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
  'ollama/llama3.3': { displayName: 'Llama 3.3 (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
  'ollama/deepseek-r1': { displayName: 'DeepSeek R1 (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
  'ollama/mistral': { displayName: 'Mistral (Local)', limit: 999999999, inputCost: 0, outputCost: 0 },
}

const DEFAULT_CONFIG = { displayName: 'Unknown Model', limit: 1000000, inputCost: 1, outputCost: 3 }

function getModelConfig(model: string) {
  // Try exact match first
  if (MODEL_CONFIG[model]) return MODEL_CONFIG[model]
  
  // Try lowercase
  const lowerModel = model.toLowerCase()
  for (const [key, config] of Object.entries(MODEL_CONFIG)) {
    if (key.toLowerCase() === lowerModel) return config
  }
  
  // Try partial match
  for (const [key, config] of Object.entries(MODEL_CONFIG)) {
    if (lowerModel.includes(key.toLowerCase().split('/').pop() || '')) return config
  }
  
  return { ...DEFAULT_CONFIG, displayName: model }
}

export function TokenUsagePanel({ sessions }: TokenUsagePanelProps) {
  // Aggregate token usage by model
  const modelUsageMap = new Map<string, ModelUsage>()
  
  sessions.forEach(session => {
    if (!session.model || !session.totalTokens) return
    
    const config = getModelConfig(session.model)
    const normalizedModel = config.displayName
    
    const existing = modelUsageMap.get(normalizedModel)
    if (existing) {
      existing.tokensUsed += session.totalTokens
      existing.sessions += 1
      // Rough cost estimate (assume 30% input, 70% output ratio)
      existing.cost += (session.totalTokens * 0.3 * config.inputCost + session.totalTokens * 0.7 * config.outputCost) / 1000000
    } else {
      modelUsageMap.set(normalizedModel, {
        model: session.model,
        displayName: normalizedModel,
        tokensUsed: session.totalTokens,
        limit: config.limit,
        cost: (session.totalTokens * 0.3 * config.inputCost + session.totalTokens * 0.7 * config.outputCost) / 1000000,
        sessions: 1,
      })
    }
  })
  
  const modelUsages = Array.from(modelUsageMap.values()).sort((a, b) => b.tokensUsed - a.tokensUsed)
  
  const totalTokens = modelUsages.reduce((sum, m) => sum + m.tokensUsed, 0)
  const totalCost = modelUsages.reduce((sum, m) => sum + m.cost, 0)
  
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`
    return tokens.toString()
  }
  
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`
  }
  
  const getUsageLevel = (used: number, limit: number) => {
    const percent = (used / limit) * 100
    if (percent >= 90) return 'critical'
    if (percent >= 70) return 'warning'
    return 'normal'
  }
  
  return (
    <div className="token-usage-panel">
      <div className="panel-header">
        <h3>
          <Coins size={20} />
          Token Usage
        </h3>
        <div className="total-stats">
          <span className="total-tokens">{formatTokens(totalTokens)} total</span>
          <span className="total-cost">{formatCost(totalCost)} est.</span>
        </div>
      </div>
      
      <div className="model-list">
        {modelUsages.length === 0 ? (
          <div className="empty-state">No token usage data available</div>
        ) : (
          modelUsages.map(usage => {
            const percent = Math.min((usage.tokensUsed / usage.limit) * 100, 100)
            const level = getUsageLevel(usage.tokensUsed, usage.limit)
            
            return (
              <div key={usage.displayName} className={`model-row ${level}`}>
                <div className="model-info">
                  <div className="model-name">
                    {level === 'critical' && <AlertTriangle size={14} className="warning-icon" />}
                    {level === 'normal' && <CheckCircle size={14} className="ok-icon" />}
                    {usage.displayName}
                  </div>
                  <div className="model-meta">
                    <span className="sessions-count">{usage.sessions} session{usage.sessions !== 1 ? 's' : ''}</span>
                    <span className="cost">{formatCost(usage.cost)}</span>
                  </div>
                </div>
                
                <div className="usage-stats">
                  <div className="usage-numbers">
                    <span className="used">{formatTokens(usage.tokensUsed)}</span>
                    <span className="separator">/</span>
                    <span className="limit">{formatTokens(usage.limit)}</span>
                  </div>
                  <div className="usage-bar">
                    <div 
                      className={`usage-fill ${level}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="usage-percent">{percent.toFixed(1)}%</div>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <style>{`
        .token-usage-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .panel-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        
        .total-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
        }
        
        .total-tokens {
          color: var(--accent-blue);
          font-weight: 600;
        }
        
        .total-cost {
          color: var(--accent-green);
          font-weight: 600;
        }
        
        .model-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
        }
        
        .model-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          gap: 1.5rem;
        }
        
        .model-row.warning {
          border-color: rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(245, 158, 11, 0.05) 100%);
        }
        
        .model-row.critical {
          border-color: rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(239, 68, 68, 0.05) 100%);
        }
        
        .model-info {
          flex: 1;
          min-width: 0;
        }
        
        .model-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        
        .warning-icon {
          color: #ef4444;
        }
        
        .ok-icon {
          color: #10b981;
        }
        
        .model-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .cost {
          color: var(--accent-green);
        }
        
        .usage-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 280px;
        }
        
        .usage-numbers {
          font-size: 0.875rem;
          font-family: 'Fira Code', monospace;
          white-space: nowrap;
        }
        
        .used {
          color: var(--text-primary);
          font-weight: 600;
        }
        
        .separator {
          color: var(--text-secondary);
          margin: 0 0.25rem;
        }
        
        .limit {
          color: var(--text-secondary);
        }
        
        .usage-bar {
          flex: 1;
          height: 8px;
          background: var(--bg-primary);
          border-radius: 4px;
          overflow: hidden;
          min-width: 100px;
        }
        
        .usage-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .usage-fill.normal {
          background: linear-gradient(90deg, #10b981, #34d399);
        }
        
        .usage-fill.warning {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }
        
        .usage-fill.critical {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }
        
        .usage-percent {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          min-width: 45px;
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .model-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .usage-stats {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  )
}
