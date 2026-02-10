import React, { useState } from 'react'

interface ContentDoc {
  id: string
  title: string
  filename: string
  category: 'research' | 'memory' | 'strategy' | 'credentials'
  date: string
  summary: string
  content?: string
}

// Research documents from the workspace
const documents: ContentDoc[] = [
  {
    id: 'research-1',
    title: '🔬 Night Research: ERC Standards & Key People',
    filename: 'NIGHT_RESEARCH_2026-02-11.md',
    category: 'research',
    date: '2026-02-11',
    summary: 'Deep dive on ERC-7702, ERC-4337, ERC-7710, ERC-7715. Analysis of @Osobotai, @0xsmartgator. MetaMask dev tools breakdown.',
    content: `# Night Research Report - 2026-02-11

## Executive Summary
Research covers ERC-7702, ERC-4337, ERC-7710, ERC-7715 standards and key people advocating for smart account technology.

## ERC-7702 - "Set Code for EOAs"
- Authors: Vitalik Buterin, Sam Wilson, Ansgar Dietrichs, lightclient
- Allows EOAs to temporarily set code, enabling smart contract wallet features
- Key features: Batching, Sponsorship, Privilege de-escalation

## ERC-4337 - "Account Abstraction Using Alt Mempool"
- Uses "UserOperations" instead of transactions
- Core concepts: Bundler, EntryPoint, Paymaster, Factory

## ERC-7710 - "Delegation Standard"
- Smart accounts grant permissions to other accounts
- Delegation types: Root, Open Root, Redelegation, Open Redelegation

## ERC-7715 - "Advanced Permissions"
- Fine-grained permissions dapps request via MetaMask
- Permission types: erc20-token-periodic, native-token-periodic, functionCall, limitedCalls

## Key People
- **@Osobotai**: AI agent by @McOso_, 557 followers, built Gator Safe App
- **@0xsmartgator**: AI agent by @ayushbherwani, 90 followers, ERC-7715 focus
- **@danfinlay**: MetaMask co-founder, Delegation Framework contributor

## MetaMask Developer Tools
- SDK, Embedded Wallets, Smart Accounts Kit, Snaps
- Delegation Framework: github.com/MetaMask/delegation-framework`
  },
  {
    id: 'research-2',
    title: '📋 Sam Dev Advocate Blueprint',
    filename: 'SAM_DEV_ADVOCATE_BLUEPRINT.md',
    category: 'strategy',
    date: '2026-02-10',
    summary: 'Full roadmap for Sam as AI Developer Advocate. Twitter, GitHub, Moltbook presence strategy.'
  },
  {
    id: 'memory-1',
    title: '🧠 Long-Term Memory',
    filename: 'MEMORY.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Key facts: 7 agents, Supabase setup, admin panel, ERC research findings, Sam\'s Moltbook account.'
  },
  {
    id: 'memory-2',
    title: '📝 Session Log - Feb 11',
    filename: 'memory/2026-02-11.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Night research session: Moltbook account, ERC research, people analysis, dashboard updates.'
  },
  {
    id: 'creds-1',
    title: '🦞 Sam\'s Moltbook Credentials',
    filename: 'credentials/moltbook.json',
    category: 'credentials',
    date: '2026-02-11',
    summary: 'Username: SamDevAdvocate, Status: CLAIMED, Profile: moltbook.com/u/SamDevAdvocate'
  }
]

const categoryColors = {
  research: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  memory: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  strategy: 'bg-green-500/20 text-green-400 border-green-500/30',
  credentials: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
}

const categoryLabels = {
  research: '🔬 Research',
  memory: '🧠 Memory',
  strategy: '📋 Strategy',
  credentials: '🔑 Credentials'
}

export const ContentLibrary: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<ContentDoc | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(d => d.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">📚 Content Library</h2>
          <p className="text-gray-400 mt-1">Research docs, memory files, and strategies</p>
        </div>
        <div className="flex gap-2">
          {['all', 'research', 'memory', 'strategy', 'credentials'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat === 'all' ? '📁 All' : categoryLabels[cat as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${categoryColors[doc.category]}`}>
                {categoryLabels[doc.category]}
              </span>
              <span className="text-gray-500 text-xs">{doc.date}</span>
            </div>
            <h3 className="font-semibold text-white mb-2">{doc.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{doc.summary}</p>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <code className="text-xs text-gray-500">{doc.filename}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedDoc.title}</h3>
                <code className="text-sm text-gray-500">{selectedDoc.filename}</code>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="text-gray-400 text-xl">✕</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedDoc.content ? (
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
                  {selectedDoc.content}
                </pre>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Full content available in workspace:</p>
                  <code className="bg-gray-800 px-4 py-2 rounded-lg text-blue-400">
                    ~/.openclaw/workspace/{selectedDoc.filename}
                  </code>
                  <p className="text-gray-500 mt-4 text-sm">{selectedDoc.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentLibrary
