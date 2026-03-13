import { Keyboard, Command, ArrowUp, ArrowDown, CornerDownLeft, Slash, Settings, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface Shortcut {
  keys: string[]
  description: string
  category: 'navigation' | 'actions' | 'models' | 'chat'
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ['⌘', 'K'], description: 'Open command palette', category: 'navigation' },
  { keys: ['⌘', '/'], description: 'Focus chat input', category: 'navigation' },
  { keys: ['⌘', '1-7'], description: 'Switch to agent tab', category: 'navigation' },
  { keys: ['Esc'], description: 'Close modal / Cancel', category: 'navigation' },
  
  // Actions
  { keys: ['⌘', 'Enter'], description: 'Send message', category: 'actions' },
  { keys: ['⌘', 'Shift', 'R'], description: 'Refresh dashboard', category: 'actions' },
  { keys: ['⌘', 'S'], description: 'Save current state', category: 'actions' },
  { keys: ['⌘', '.'], description: 'Stop generation', category: 'actions' },
  
  // Models
  { keys: ['⌘', 'M'], description: 'Open model selector', category: 'models' },
  { keys: ['⌘', 'Shift', 'O'], description: 'Switch to Opus', category: 'models' },
  { keys: ['⌘', 'Shift', 'S'], description: 'Switch to Sonnet', category: 'models' },
  { keys: ['⌘', 'Shift', 'G'], description: 'Switch to Gemini', category: 'models' },
  { keys: ['⌘', 'Shift', 'Q'], description: 'Switch to Qwen (local)', category: 'models' },
  
  // Chat
  { keys: ['↑'], description: 'Previous message (in input)', category: 'chat' },
  { keys: ['↓'], description: 'Next message (in input)', category: 'chat' },
  { keys: ['⌘', 'Shift', 'C'], description: 'Copy last response', category: 'chat' },
  { keys: ['⌘', 'Shift', 'V'], description: 'Paste with formatting', category: 'chat' },
]

const CATEGORIES = {
  navigation: { label: 'Navigation', icon: Slash },
  actions: { label: 'Actions', icon: CornerDownLeft },
  models: { label: 'Models', icon: Settings },
  chat: { label: 'Chat', icon: Command },
}

interface ModelConfig {
  id: string
  name: string
  provider: string
  type: 'cloud' | 'local'
  status: 'active' | 'available' | 'offline'
}

const AVAILABLE_MODELS: ModelConfig[] = [
  { id: 'anthropic/claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'Anthropic', type: 'cloud', status: 'active' },
  { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic', type: 'cloud', status: 'available' },
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'Google', type: 'cloud', status: 'available' },
  { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'Google', type: 'cloud', status: 'available' },
  { id: 'openai/gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', type: 'cloud', status: 'available' },
  { id: 'zai/glm-5', name: 'GLM-5', provider: 'Zhipu AI', type: 'cloud', status: 'available' },
  { id: 'ollama/qwen2.5', name: 'Qwen 2.5', provider: 'Ollama (Local)', type: 'local', status: 'available' },
  { id: 'ollama/qwen2.5vl', name: 'Qwen 2.5 VL', provider: 'Ollama (Local)', type: 'local', status: 'available' },
  { id: 'ollama/llama3.3', name: 'Llama 3.3', provider: 'Ollama (Local)', type: 'local', status: 'offline' },
]

export function KeyboardShortcuts() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  
  const groupedShortcuts = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = []
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  return (
    <div className="keyboard-shortcuts-panel">
      <div className="panel-header">
        <h3>
          <Keyboard size={20} />
          Keyboard Shortcuts & Models
        </h3>
        <button 
          className="model-selector-btn"
          onClick={() => setShowModelSelector(!showModelSelector)}
        >
          <Settings size={16} />
          {showModelSelector ? 'Hide Models' : 'Show Models'}
        </button>
      </div>
      
      {showModelSelector && (
        <div className="model-selector">
          <h4>Available Models</h4>
          <div className="model-grid">
            {AVAILABLE_MODELS.map(model => (
              <div 
                key={model.id} 
                className={`model-card ${model.status} ${model.type}`}
              >
                <div className="model-header">
                  <span className={`status-dot ${model.status}`} />
                  <span className="model-name">{model.name}</span>
                </div>
                <div className="model-meta">
                  <span className="provider">{model.provider}</span>
                  <span className={`type-badge ${model.type}`}>
                    {model.type === 'local' ? '🏠 Local' : '☁️ Cloud'}
                  </span>
                </div>
                {model.status === 'active' && (
                  <div className="active-badge">Currently Active</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="shortcuts-grid">
        {Object.entries(groupedShortcuts).map(([category, shortcuts]) => {
          const CategoryIcon = CATEGORIES[category as keyof typeof CATEGORIES]?.icon || Command
          const categoryLabel = CATEGORIES[category as keyof typeof CATEGORIES]?.label || category
          
          return (
            <div 
              key={category} 
              className={`shortcut-category ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
            >
              <div className="category-header">
                <CategoryIcon size={16} />
                <span>{categoryLabel}</span>
                <span className="shortcut-count">{shortcuts.length}</span>
              </div>
              
              <div className="shortcut-list">
                {shortcuts.map((shortcut, idx) => (
                  <div key={idx} className="shortcut-item">
                    <div className="keys">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx}>
                          <kbd>{key}</kbd>
                          {keyIdx < shortcut.keys.length - 1 && <span className="plus">+</span>}
                        </span>
                      ))}
                    </div>
                    <span className="description">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      <style>{`
        .keyboard-shortcuts-panel {
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
        
        .model-selector-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .model-selector-btn:hover {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          color: white;
        }
        
        .model-selector {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }
        
        .model-selector h4 {
          margin: 0 0 1rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        .model-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .model-card {
          padding: 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .model-card:hover {
          border-color: var(--accent-blue);
          transform: translateY(-1px);
        }
        
        .model-card.active {
          border-color: var(--accent-green);
          background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(16, 185, 129, 0.1) 100%);
        }
        
        .model-card.offline {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .model-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .status-dot.active {
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        }
        
        .status-dot.available {
          background: #3b82f6;
        }
        
        .status-dot.offline {
          background: #6b7280;
        }
        
        .model-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        
        .model-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }
        
        .provider {
          color: var(--text-secondary);
        }
        
        .type-badge {
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
        }
        
        .type-badge.local {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }
        
        .type-badge.cloud {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }
        
        .active-badge {
          margin-top: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border-radius: 4px;
          font-size: 0.7rem;
          text-align: center;
        }
        
        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        
        .shortcut-category {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .shortcut-category:hover {
          border-color: var(--accent-blue);
        }
        
        .category-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        
        .shortcut-count {
          margin-left: auto;
          padding: 0.15rem 0.5rem;
          background: var(--bg-tertiary);
          border-radius: 10px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .shortcut-list {
          padding: 0.5rem;
        }
        
        .shortcut-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .shortcut-item:hover {
          background: var(--bg-secondary);
        }
        
        .keys {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        kbd {
          padding: 0.2rem 0.5rem;
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: var(--text-primary);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .plus {
          color: var(--text-secondary);
          font-size: 0.7rem;
          margin: 0 0.1rem;
        }
        
        .description {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
          .shortcuts-grid {
            grid-template-columns: 1fr;
          }
          
          .model-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
