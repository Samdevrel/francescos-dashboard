import { AgentStatus } from '../api/openclaw'

interface AgentHierarchyProps {
  agentStatuses: AgentStatus[]
  onAgentClick?: (agentId: string) => void
}

const agentMeta: Record<string, { emoji: string; role: string; color: string }> = {
  zoe: { emoji: '⚡', role: 'Orchestrator', color: '#3b82f6' },
  sam: { emoji: '🔮', role: 'Crypto & DevRel', color: '#8b5cf6' },
  leo: { emoji: '🦁', role: 'VC Analyst', color: '#f59e0b' },
  mika: { emoji: '✨', role: 'Creative', color: '#ec4899' },
  rex: { emoji: '🤖', role: 'Trading Bot', color: '#10b981' },
  victor: { emoji: '🎯', role: 'Job Market Agent', color: '#ef4444' },
  dante: { emoji: '🌍', role: 'Africa Ops', color: '#06b6d4' },
}

export function AgentHierarchy({ agentStatuses, onAgentClick }: AgentHierarchyProps) {
  const getStatus = (id: string) => agentStatuses.find(a => a.id === id)
  
  const StatusDot = ({ status }: { status?: string }) => (
    <span 
      className="status-dot"
      style={{ 
        background: status === 'active' || status === 'working' ? '#10b981' 
          : status === 'idle' ? '#f59e0b' 
          : '#6b7280'
      }}
    />
  )

  const AgentNode = ({ id, isMain = false }: { id: string; isMain?: boolean }) => {
    const meta = agentMeta[id]
    const status = getStatus(id)
    
    return (
      <div 
        className={`agent-node ${isMain ? 'main' : ''} ${status?.status || 'offline'}`}
        onClick={() => onAgentClick?.(id)}
        style={{ '--agent-color': meta.color } as React.CSSProperties}
      >
        <div className="agent-avatar">
          <span className="emoji">{meta.emoji}</span>
          <StatusDot status={status?.status} />
        </div>
        <div className="agent-info">
          <span className="name">{status?.name || id}</span>
          <span className="role">{meta.role}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="hierarchy-container">
      <h3>🏗️ Agent Hierarchy</h3>
      
      <div className="hierarchy-graph">
        {/* Top level - Zoe */}
        <div className="level level-0">
          <AgentNode id="zoe" isMain />
        </div>
        
        {/* Connection lines */}
        <div className="connector main-connector">
          <div className="vertical-line" />
          <div className="horizontal-line" />
        </div>
        
        {/* Second level - All sub-agents */}
        <div className="level level-1">
          <AgentNode id="sam" />
          <AgentNode id="leo" />
          <AgentNode id="mika" />
          <AgentNode id="rex" />
          <AgentNode id="victor" />
          <AgentNode id="dante" />
        </div>
      </div>

      <style>{`
        .hierarchy-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .hierarchy-container h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .hierarchy-graph {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .level {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .level-0 {
          margin-bottom: 0;
        }

        .level-1 {
          margin-top: 0;
        }

        .connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .main-connector .vertical-line {
          width: 2px;
          height: 20px;
          background: var(--border);
        }

        .main-connector .horizontal-line {
          width: 80%;
          max-width: 600px;
          height: 2px;
          background: var(--border);
          position: relative;
        }

        .main-connector .horizontal-line::before,
        .main-connector .horizontal-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 2px;
          height: 20px;
          background: var(--border);
        }

        .main-connector .horizontal-line::before {
          left: 0;
        }

        .main-connector .horizontal-line::after {
          right: 0;
        }

        .agent-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }

        .agent-node:hover {
          border-color: var(--agent-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .agent-node.main {
          background: linear-gradient(135deg, var(--bg-tertiary), rgba(59, 130, 246, 0.1));
          border-color: rgba(59, 130, 246, 0.3);
          padding: 1rem 1.5rem;
        }

        .agent-node.active,
        .agent-node.working {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
        }

        .agent-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 50%;
        }

        .agent-node.main .agent-avatar {
          width: 44px;
          height: 44px;
        }

        .emoji {
          font-size: 1.25rem;
        }

        .agent-node.main .emoji {
          font-size: 1.5rem;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--bg-tertiary);
        }

        .agent-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .agent-info .name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .agent-node.main .agent-info .name {
          font-size: 1rem;
        }

        .agent-info .role {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .level-1 {
            gap: 0.5rem;
          }

          .agent-node {
            min-width: 120px;
            padding: 0.5rem 0.75rem;
          }

          .agent-info .name {
            font-size: 0.8rem;
          }

          .agent-info .role {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  )
}
