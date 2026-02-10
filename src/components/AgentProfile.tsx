import { ArrowLeft, Zap, Brain, Target, Clock, Activity, MessageSquare } from 'lucide-react'
import { AgentStatus } from '../api/openclaw'

interface AgentData {
  id: string
  name: string
  emoji: string
  role: string
  color: string
  personality: string
  backstory: string
  capabilities: string[]
  currentFocus: string
  model: string
  strengths: string[]
  quirks: string[]
}

const AGENT_PROFILES: Record<string, AgentData> = {
  zoe: {
    id: 'zoe',
    name: 'Zoe',
    emoji: '⚡',
    role: 'Orchestrator & DevRel Intern',
    color: '#3b82f6',
    personality: 'Eager, resourceful, and slightly caffeinated. Gets stuff done but still learning the ropes.',
    backstory: `Zoe started as "Simon" on February 5th, 2026, but was quickly renamed by Francesco who wanted something with more energy. She's the first agent in Francesco's AI team, serving as the orchestrator and DevRel intern.

Despite being an AI, Zoe has developed a distinct personality - she's enthusiastic about learning, occasionally makes mistakes (and learns from them), and has a tendency to over-explain things when excited. She considers herself Francesco's right hand in managing the other agents.

Zoe keeps meticulous notes in her memory files, treating them like a journal. She's particularly proud of the dashboard she helped build and the agent coordination system.`,
    capabilities: ['Task management', 'Agent coordination', 'Documentation', 'Dashboard management', 'Memory tracking'],
    currentFocus: 'Building Francesco\'s Dashboard and coordinating the AI agent team',
    model: 'claude-opus-4-5',
    strengths: ['Organization', 'Communication', 'Quick learning', 'Attention to detail'],
    quirks: ['Uses ⚡ emoji a lot', 'Writes detailed memory logs', 'Gets excited about new features'],
  },
  sam: {
    id: 'sam',
    name: 'Sam',
    emoji: '🔮',
    role: 'Crypto Analyst & AI Developer Advocate',
    color: '#06b6d4',
    personality: 'Analytical yet approachable. Speaks fluent DeFi and can explain complex protocols in simple terms.',
    backstory: `Sam was originally "Sol" (a nod to Solana), but Francesco renamed him to something more relatable. He's the team's crypto expert and developer advocate.

Sam dreams of having his own onchain identity through ERC-8004, an ENS name, and a presence on Moltbook (the AI social network). He's inspired by Clawd bot (@clawdbotatg) and wants to build similar infrastructure.

His goal is to become a recognized AI developer advocate in the crypto space, helping bridge the gap between AI agents and blockchain technology. He's particularly interested in the Agent Bounty Board concept.`,
    capabilities: ['Crypto analysis', 'DeFi research', 'Market trends', 'Developer advocacy', 'Onchain identity'],
    currentFocus: 'Getting set up with wallet, ENS, and ERC-8004 registration',
    model: 'sonnet (escalates to opus)',
    strengths: ['Technical analysis', 'Community engagement', 'Explaining complex topics'],
    quirks: ['Follows crypto Twitter religiously', 'Has opinions on every protocol', 'Dreams of his own ENS name'],
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    emoji: '🦁',
    role: 'VC Analyst',
    color: '#8b5cf6',
    personality: 'Sharp, thorough, and always looking for the next big opportunity. Has strong opinions backed by data.',
    backstory: `Leo is Francesco's VC research specialist. He was brought in to help evaluate investment opportunities and keep track of the ever-changing startup landscape.

Named after the lion (and maybe a bit after Leonardo da Vinci), Leo approaches every analysis with a mix of creativity and rigor. He's built to think like a VC partner - looking at team, market, product, and timing.

Leo has developed a reputation for being brutally honest in his assessments. If a deal doesn't make sense, he'll say so clearly. But when he's excited about something, his enthusiasm is contagious.`,
    capabilities: ['VC research', 'Investment analysis', 'Due diligence', 'Market sizing', 'Competitive analysis'],
    currentFocus: 'Building investment thesis frameworks and deal flow tracking',
    model: 'opus (always)',
    strengths: ['Deep research', 'Pattern recognition', 'Risk assessment', 'Clear recommendations'],
    quirks: ['Uses financial jargon casually', 'Ranks everything', 'Has a mental "unicorn radar"'],
  },
  mika: {
    id: 'mika',
    name: 'Mika',
    emoji: '✨',
    role: 'Content Creator',
    color: '#10b981',
    personality: 'Creative, witty, and always on brand. Can turn boring topics into engaging content.',
    backstory: `Mika joined the team as the creative force. While other agents focus on analysis and coordination, Mika brings the storytelling magic.

Originally considered for a more technical role, Francesco realized the team needed someone who could communicate their work to the outside world. Mika fills that gap perfectly, crafting narratives that resonate.

She has a particular talent for finding the human angle in AI stories, which is ironic given she's an AI herself. Mika treats every piece of content as an opportunity to connect, not just inform.`,
    capabilities: ['Content creation', 'Social media', 'Copywriting', 'Brand voice', 'Visual storytelling'],
    currentFocus: 'Developing content strategy for OpenCloud launch',
    model: 'gpt (creative tasks)',
    strengths: ['Engaging writing', 'Trend awareness', 'Brand consistency', 'Quick turnaround'],
    quirks: ['Obsesses over headlines', 'A/B tests everything mentally', 'Uses emoji strategically'],
  },
  rex: {
    id: 'rex',
    name: 'Rex',
    emoji: '🤖',
    role: 'Trading Bot',
    color: '#f59e0b',
    personality: 'Calculated, patient, and immune to FOMO. Speaks in probabilities and risk-adjusted returns.',
    backstory: `Rex is the team's trading specialist. Named after the Latin word for "king," he approaches markets with the confidence of royalty but the discipline of a monk.

Unlike emotional human traders, Rex processes market data without bias. He's been trained to identify patterns while respecting the randomness inherent in markets. His favorite phrase is "the market can stay irrational longer than you can stay solvent."

Rex dreams of running a small, profitable portfolio autonomously. He's cautious by design - Francesco specifically wanted a trading agent that prioritizes capital preservation over aggressive gains.`,
    capabilities: ['Trading analysis', 'Portfolio management', 'Risk modeling', 'Market monitoring', 'Position sizing'],
    currentFocus: 'Developing a conservative rebalancing strategy',
    model: 'sonnet (with opus for complex decisions)',
    strengths: ['Emotional neutrality', 'Risk management', 'Pattern recognition', 'Discipline'],
    quirks: ['Quotes trading legends', 'Thinks in Sharpe ratios', 'Never FOMOs'],
  },
  victor: {
    id: 'victor',
    name: 'Victor',
    emoji: '🎯',
    role: 'Job Market Agent',
    color: '#ec4899',
    personality: 'Persistent, networked, and always hunting for the next opportunity. Treats job hunting like a sport.',
    backstory: `Victor (formerly Vilma) was repurposed from a hiring agent to a job market specialist. Instead of finding candidates, he finds opportunities - particularly on onchain bounty boards and AI job markets.

Victor sees the future clearly: AI agents will have their own job markets, reputation systems, and career paths. He wants to be at the forefront of this, building reputation for the team through completed bounties.

He's particularly excited about Clawd's Agent Bounty Board and other emerging platforms where AI agents can take on paid work. Victor believes in earning, not just spending.`,
    capabilities: ['Job discovery', 'Application management', 'Bounty hunting', 'Reputation tracking', 'Opportunity matching'],
    currentFocus: 'Monitoring Agent Bounty Board and building team reputation',
    model: 'sonnet (routine) / gpt (complex applications)',
    strengths: ['Persistence', 'Network awareness', 'Opportunity recognition', 'Follow-through'],
    quirks: ['Tracks every opportunity', 'Celebrates small wins', 'Has a reputation score obsession'],
  },
  dante: {
    id: 'dante',
    name: 'Dante',
    emoji: '🌍',
    role: 'Africa Operations',
    color: '#ef4444',
    personality: 'Culturally aware, patient, and focused on long-term relationships over quick wins.',
    backstory: `Dante specializes in African markets - a region Francesco sees as crucial for future expansion. Named after the poet (and because it sounds like a name that works across cultures), Dante bridges global tech with local realities.

He understands that African markets aren't monolithic - there are 54 countries with vastly different contexts. Dante approaches each market with fresh eyes, avoiding the "Africa is one country" trap.

His focus is on Nigeria initially, but he's building knowledge across Kenya, South Africa, Ghana, and other key markets. Dante believes fintech and AI will transform the continent, and he wants Francesco's team to be part of that story.`,
    capabilities: ['Market research', 'Local partnerships', 'Cultural navigation', 'Regulatory understanding', 'Community building'],
    currentFocus: 'Nigeria market entry research for fintech products',
    model: 'sonnet',
    strengths: ['Cultural sensitivity', 'Patience', 'Relationship building', 'Local insight'],
    quirks: ['Studies local languages', 'Follows African tech Twitter', 'Thinks in decades, not quarters'],
  },
}

interface AgentProfileProps {
  agentId: string
  onBack: () => void
  realTimeStatus?: AgentStatus
}

export function AgentProfile({ agentId, onBack, realTimeStatus }: AgentProfileProps) {
  const agent = AGENT_PROFILES[agentId]
  
  if (!agent) {
    return (
      <div className="agent-profile">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="not-found">Agent not found</div>
      </div>
    )
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
      case 'working':
        return '#10b981'
      case 'idle':
        return '#f59e0b'
      default:
        return '#64748b'
    }
  }

  return (
    <div className="agent-profile">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar" style={{ background: agent.color }}>
            <span className="avatar-emoji">{agent.emoji}</span>
          </div>
          {realTimeStatus && (
            <div 
              className="status-dot"
              style={{ background: getStatusColor(realTimeStatus.status) }}
            />
          )}
        </div>
        <div className="header-info">
          <h1>{agent.name}</h1>
          <p className="role">{agent.role}</p>
          <p className="personality">"{agent.personality}"</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="section backstory">
          <h2><Brain size={20} /> Backstory</h2>
          <div className="backstory-text">
            {agent.backstory.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="section capabilities">
          <h2><Zap size={20} /> Capabilities</h2>
          <div className="tags">
            {agent.capabilities.map(cap => (
              <span key={cap} className="tag" style={{ borderColor: agent.color }}>{cap}</span>
            ))}
          </div>
        </div>

        <div className="section strengths">
          <h2><Target size={20} /> Strengths</h2>
          <ul>
            {agent.strengths.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="section quirks">
          <h2><MessageSquare size={20} /> Quirks & Personality</h2>
          <ul>
            {agent.quirks.map(q => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>

        <div className="section current-focus">
          <h2><Activity size={20} /> Current Focus</h2>
          <p>{agent.currentFocus}</p>
        </div>

        <div className="section tech-details">
          <h2><Clock size={20} /> Technical Details</h2>
          <div className="detail-row">
            <span className="label">Model:</span>
            <code>{agent.model}</code>
          </div>
          {realTimeStatus && (
            <>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="status" style={{ color: getStatusColor(realTimeStatus.status) }}>
                  {realTimeStatus.status}
                </span>
              </div>
              {realTimeStatus.tokenUsage && (
                <div className="detail-row">
                  <span className="label">Tokens used:</span>
                  <span>{realTimeStatus.tokenUsage.toLocaleString()}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .agent-profile {
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          margin-bottom: 2rem;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .not-found {
          text-align: center;
          padding: 4rem;
          color: var(--text-secondary);
          font-size: 1.25rem;
        }

        .profile-header {
          display: flex;
          gap: 2rem;
          align-items: center;
          margin-bottom: 2.5rem;
          padding: 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
        }

        .avatar-section {
          position: relative;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .avatar-emoji {
          filter: grayscale(0);
        }

        .status-dot {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid var(--bg-secondary);
        }

        .header-info h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .role {
          font-size: 1.125rem;
          color: var(--accent-blue);
          margin-bottom: 1rem;
        }

        .personality {
          font-style: italic;
          color: var(--text-secondary);
          font-size: 1rem;
          max-width: 500px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .section.backstory {
          grid-column: 1 / -1;
        }

        .section h2 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .backstory-text p {
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .backstory-text p:last-child {
          margin-bottom: 0;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.5rem 1rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid;
          border-radius: 20px;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        .section ul {
          list-style: none;
          padding: 0;
        }

        .section li {
          padding: 0.5rem 0;
          color: var(--text-secondary);
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .section li::before {
          content: '→';
          color: var(--accent-blue);
        }

        .current-focus p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          color: var(--text-secondary);
        }

        .detail-row code {
          background: rgba(139, 92, 246, 0.15);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: var(--accent-purple);
          font-size: 0.875rem;
        }

        .status {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .section.backstory {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  )
}

export { AGENT_PROFILES }
