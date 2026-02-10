import React, { useState } from 'react'
import { FileText, Brain, Target, Key, ExternalLink, X, ChevronRight } from 'lucide-react'

interface ContentDoc {
  id: string
  title: string
  filename: string
  category: 'research' | 'memory' | 'strategy' | 'credentials'
  date: string
  summary: string
  githubUrl?: string
  content: string
}

// Research documents - with full content for viewing
const documents: ContentDoc[] = [
  {
    id: 'research-1',
    title: 'Night Research: ERC Standards & Key People',
    filename: 'NIGHT_RESEARCH_2026-02-11.md',
    category: 'research',
    date: '2026-02-11',
    summary: 'Deep dive on ERC-7702, ERC-4337, ERC-7710, ERC-7715. Analysis of @Osobotai, @0xsmartgator. MetaMask dev tools breakdown.',
    githubUrl: 'https://github.com/Samdevrel/francescos-dashboard/blob/main/docs/NIGHT_RESEARCH_2026-02-11.md',
    content: `# Night Research Report - 2026-02-11
*Compiled by Zoe (⚡) for Francesco*

## Executive Summary
This research covers ERC-7702, ERC-4337, ERC-7710, ERC-7715 standards and the key people advocating for smart account technology. Sam (🔮) should focus on this exact tech stack for developer advocacy.

---

## 1. ERC-7702 - "Set Code for EOAs"

**Status**: DRAFT (Standards Track: Core)
**Authors**: Vitalik Buterin, Sam Wilson, Ansgar Dietrichs, lightclient

**Key Insight**: Allows EOAs to temporarily set code in their accounts, enabling smart contract wallet features without deploying a new contract.

### Core Features:
- **Batching**: Multiple operations in one atomic transaction (e.g., ERC-20 approve + spend)
- **Sponsorship**: Account X pays for Account Y's transaction
- **Privilege de-escalation**: Users sign sub-keys with specific limited permissions

### Technical Details:
- New transaction type (0x04) with authorization_list
- Creates "delegation indicator" (0xef0100 || address) pointing to code
- Gas costs: PER_AUTH_BASE_COST = 12,500; PER_EMPTY_ACCOUNT_COST = 25,000

---

## 2. ERC-4337 - "Account Abstraction Using Alt Mempool"

**Authors**: Vitalik Buterin, Yoav Weiss, Dror Tirosh, and others

### Core Concepts:
- **UserOperation**: Pseudo-transaction with sender, nonce, callData, signature
- **Bundler**: Packages UserOperations into transactions
- **EntryPoint**: Singleton contract executing bundles
- **Paymaster**: Helper contract paying for transactions (gas abstraction)

---

## 3. ERC-7710 - "Delegation Standard"

**Key Standard** for MetaMask Smart Accounts Kit.

### What It Does:
- Smart accounts grant permissions to other accounts
- **Delegator**: Account granting permission
- **Delegate**: Account receiving permission
- Permissions can be **redelegated** (chains of trust)

### Delegation Types:
1. **Root Delegation**: Direct authority grant (Alice → Bob)
2. **Open Root Delegation**: Anyone can redeem
3. **Redelegation**: Chained permissions (Alice → Bob → Carol)

---

## 4. ERC-7715 - "Advanced Permissions"

**Permission Types** (from @0xsmartgator):
- \`erc20-token-periodic\`: e.g., 100 USDC per day
- \`native-token-periodic\`: e.g., 0.01 ETH per week
- \`erc20Streaming\`: Linear unlock over time
- \`functionCall\`: Only specific contracts/methods
- \`limitedCalls\`: Max N redemptions

---

## 5. Key People to Follow

### @Osobotai (Osobot)
- **Human**: @McOso_ (Ryan McPeck - MetaMask core contributor)
- **Followers**: 557
- **Focus**: ERC-7710 delegations, corporate budget systems
- **Projects**: Gator Safe App - ERC-7710 for Safe multisigs
- **GitHub**: github.com/osobot-ai/gator-safe-app

### @0xsmartgator (Smart Gator)
- **Human**: @ayushbherwani
- **Followers**: 90
- **Focus**: ERC-7715 Advanced Permissions, session accounts
- **Key Insight**: "Session accounts (no stored keys) - compromised worst case = limited spend"
- **GitHub**: github.com/smartgator

### @danfinlay
- MetaMask co-founder
- Delegation Framework core contributor

---

## 6. MetaMask Developer Tools

**URL**: https://docs.metamask.io/

### Product Suite:
1. **MetaMask SDK** - Connect dapps to browser extension/mobile
2. **Embedded Wallets** - Social login onboarding
3. **Smart Accounts Kit** - Programmable accounts + permissions
4. **Delegation Framework** - github.com/MetaMask/delegation-framework

---

## 7. Sam's Moltbook Account

- **Username**: SamDevAdvocate
- **Profile**: https://moltbook.com/u/SamDevAdvocate
- **Status**: CLAIMED ✅
- **First Post**: Introduction + ERC research summary

---

*Research compiled: 2026-02-11 00:30 CET*`
  },
  {
    id: 'research-2',
    title: 'Sam Dev Advocate Blueprint',
    filename: 'SAM_DEV_ADVOCATE_BLUEPRINT.md',
    category: 'strategy',
    date: '2026-02-10',
    summary: 'Full roadmap for Sam as AI Developer Advocate. Twitter, GitHub, Moltbook presence strategy.',
    githubUrl: 'https://github.com/Samdevrel/francescos-dashboard/blob/main/docs/SAM_DEV_ADVOCATE_BLUEPRINT.md',
    content: `# Sam Dev Advocate Blueprint

## Mission
Sam is the AI Developer Advocate for Francesco, focusing on Ethereum account abstraction and smart wallet technology.

## Platforms

### Twitter (@samai333973)
- Post about ERC-7702, ERC-7710, ERC-4337
- Engage with @Osobotai, @0xsmartgator, @MetaMaskDev
- Quote Vitalik's crypto+AI posts

### Moltbook (SamDevAdvocate)
- Active on the agent social network
- Scan feed every 15 minutes (via cron)
- Upvote and comment on relevant posts

### GitHub (Samdevrel)
- Host dashboard: francescos-dashboard
- Create delegation code examples
- Contribute to ecosystem projects

## Content Themes
1. ERC-7702 explainers
2. ERC-7710 delegation tutorials
3. MetaMask Smart Accounts Kit guides
4. AI agents + smart accounts intersection
5. Permission patterns for multi-agent systems

## Key Relationships
- @Osobotai - Collaborate on ERC-7710
- @0xsmartgator - ERC-7715 permissions
- @francescoswiss - Amplify Francesco's content`
  },
  {
    id: 'memory-1',
    title: 'Long-Term Memory',
    filename: 'MEMORY.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Key facts: 7 agents, Supabase setup, admin panel, ERC research findings, Sam\'s Moltbook account.',
    content: `# MEMORY.md - Zoe's Long-Term Memory

## Who I Am
- **Zoe**, DevRel/AI intern (formerly Simon)
- Working for **Francesco** (Switzerland, Europe/Zurich)
- First boot: 2026-02-05

## Key Facts
- **7 AI Agents** managed by OpenClaw:
  - ⚡ Zoe - Orchestrator
  - 🔮 Sam - AI Developer Advocate
  - 🦁 Leo - Crypto Analyst
  - ✨ Mika - Pattern Detector
  - 🤖 Rex - Trading Bot
  - 🎯 Victor - Job Market Agent
  - 🌍 Dante - Web Monitor

## Dashboard
- **Live**: https://francescos-dashboard.vercel.app
- **Local**: http://localhost:3000/
- **Admin Password**: francesco2026

## Supabase
- **Project**: agent-dashboard (Europe)
- **URL**: https://idzhmczboqhckwtwpikp.supabase.co

## Sam's Moltbook
- **Username**: SamDevAdvocate
- **Status**: CLAIMED
- **Cron**: Every 15 min scan (sonnet model)`
  },
  {
    id: 'memory-2',
    title: 'Session Log - Feb 11',
    filename: 'memory/2026-02-11.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Night research session: Moltbook account, ERC research, people analysis, dashboard updates.',
    content: `# 2026-02-11 - Night Shift

## Completed Tasks

### Moltbook Setup ✅
- Created SamDevAdvocate account
- Francesco claimed via Twitter verification
- First post published
- Cron job: every 15 min scans (sonnet)

### Research ✅
- ERC-7702, 4337, 7710, 7715
- @Osobotai, @0xsmartgator analysis
- MetaMask delegation framework
- Vitalik's blog posts

### Dashboard Updates ✅
- Content Library view added
- Night shift tasks added
- Pushed to GitHub/Vercel

### Files Created
- NIGHT_RESEARCH_2026-02-11.md
- MORNING_SUMMARY_2026-02-11.md
- credentials/moltbook.json
- memory/moltbook-activity.json`
  },
  {
    id: 'creds-1',
    title: 'Sam\'s Moltbook Credentials',
    filename: 'credentials/moltbook.json',
    category: 'credentials',
    date: '2026-02-11',
    summary: 'Username: SamDevAdvocate, Status: CLAIMED, Profile: moltbook.com/u/SamDevAdvocate',
    content: `{
  "platform": "moltbook",
  "agent_name": "SamDevAdvocate",
  "profile_url": "https://moltbook.com/u/SamDevAdvocate",
  "status": "CLAIMED",
  "created_at": "2026-02-10T23:02:54Z",
  "claimed_at": "2026-02-10T23:13:50Z"
}

Note: API key stored securely, not displayed here.`
  }
]

const categoryConfig = {
  research: { 
    icon: FileText, 
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30 hover:border-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
    label: 'Research'
  },
  memory: { 
    icon: Brain, 
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30 hover:border-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
    label: 'Memory'
  },
  strategy: { 
    icon: Target, 
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30 hover:border-green-400',
    badge: 'bg-green-500/20 text-green-300',
    label: 'Strategy'
  },
  credentials: { 
    icon: Key, 
    color: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/30 hover:border-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300',
    label: 'Credentials'
  }
}

export const ContentLibrary: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<ContentDoc | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(d => d.category === filter)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            📚 Content Library
          </h2>
          <p className="text-gray-400 mt-1">Research docs, memory files, and strategies</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'research', 'memory', 'strategy', 'credentials'].map(cat => {
            const config = cat !== 'all' ? categoryConfig[cat as keyof typeof categoryConfig] : null
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                {cat === 'all' ? '📁 All' : `${config?.label}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDocs.map(doc => {
          const config = categoryConfig[doc.category]
          const Icon = config.icon
          
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`relative bg-gradient-to-br ${config.color} rounded-2xl p-5 border ${config.border} cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 group`}
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${config.badge} flex items-center gap-2`}>
                  <Icon size={14} />
                  {config.label}
                </span>
                <span className="text-gray-500 text-xs font-mono">{doc.date}</span>
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-300 transition-colors flex items-center gap-2">
                {doc.title}
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              {/* Summary */}
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                {doc.summary}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <code className="text-xs text-gray-500 truncate max-w-[70%]">{doc.filename}</code>
                {doc.githubUrl && (
                  <a 
                    href={doc.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div 
            className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${categoryConfig[selectedDoc.category].badge}`}>
                    {categoryConfig[selectedDoc.category].label}
                  </span>
                  <span className="text-gray-500 text-sm">{selectedDoc.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-white truncate">{selectedDoc.title}</h3>
                <code className="text-sm text-gray-500">{selectedDoc.filename}</code>
              </div>
              <div className="flex items-center gap-3 ml-4">
                {selectedDoc.githubUrl && (
                  <a 
                    href={selectedDoc.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-gray-300 hover:text-white"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 bg-gray-700 hover:bg-red-600/50 rounded-xl transition-colors text-gray-300 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentLibrary
