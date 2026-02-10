import React, { useState } from 'react'

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

const documents: ContentDoc[] = [
  {
    id: 'research-1',
    title: '🔬 Night Research: ERC Standards & Key People',
    filename: 'NIGHT_RESEARCH_2026-02-11.md',
    category: 'research',
    date: '2026-02-11',
    summary: 'Deep dive on ERC-7702, ERC-4337, ERC-7710, ERC-7715. Analysis of @Osobotai, @0xsmartgator. MetaMask dev tools breakdown.',
    githubUrl: 'https://github.com/Samdevrel/francescos-dashboard/blob/main/docs/NIGHT_RESEARCH_2026-02-11.md',
    content: `# Night Research Report - 2026-02-11

## Executive Summary
Research covers ERC-7702, ERC-4337, ERC-7710, ERC-7715 and key people in smart account tech.

## ERC-7702 - "Set Code for EOAs"
Authors: Vitalik Buterin, Sam Wilson, Ansgar Dietrichs, lightclient
- Batching: Multiple ops in one tx
- Sponsorship: Account X pays for Y
- Privilege de-escalation: Sub-keys with limits

## ERC-4337 - "Account Abstraction"
- UserOperation: Pseudo-transactions
- Bundler: Packages UserOps
- EntryPoint: Executes bundles
- Paymaster: Gas abstraction

## ERC-7710 - "Delegation Standard"
- Delegator grants permissions to Delegate
- Root, Open, Redelegation types
- Chains of trust

## ERC-7715 - "Advanced Permissions"
- erc20-token-periodic: 100 USDC/day
- native-token-periodic: 0.01 ETH/week
- functionCall: Specific contracts only
- limitedCalls: Max N redemptions

## Key People
- @Osobotai - ERC-7710 expert, Gator Safe App
- @0xsmartgator - ERC-7715 permissions
- @danfinlay - MetaMask co-founder

## Sam's Moltbook: SamDevAdvocate (CLAIMED)`
  },
  {
    id: 'research-2',
    title: '📋 Sam Dev Advocate Blueprint',
    filename: 'SAM_DEV_ADVOCATE_BLUEPRINT.md',
    category: 'strategy',
    date: '2026-02-10',
    summary: 'Full roadmap for Sam as AI Developer Advocate. Twitter, GitHub, Moltbook presence strategy.',
    githubUrl: 'https://github.com/Samdevrel/francescos-dashboard/blob/main/docs/SAM_DEV_ADVOCATE_BLUEPRINT.md',
    content: `# Sam Dev Advocate Blueprint

## Platforms
- Twitter: @samai333973
- Moltbook: SamDevAdvocate  
- GitHub: Samdevrel

## Content Themes
1. ERC-7702 explainers
2. ERC-7710 delegation tutorials
3. MetaMask Smart Accounts Kit
4. AI agents + smart accounts

## Key Relationships
- @Osobotai - ERC-7710
- @0xsmartgator - ERC-7715
- @francescoswiss - Amplify content

## Moltbook Cron
Every 15 min, sonnet model
Scan, upvote, comment on relevant posts`
  },
  {
    id: 'memory-1',
    title: '🧠 Long-Term Memory',
    filename: 'MEMORY.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Key facts: 7 agents, Supabase setup, admin panel, ERC research, Sam Moltbook.',
    content: `# MEMORY.md

## 7 AI Agents
⚡ Zoe - Orchestrator
🔮 Sam - AI Developer Advocate
🦁 Leo - Crypto Analyst
✨ Mika - Pattern Detector
🤖 Rex - Trading Bot
🎯 Victor - Job Market Agent
🌍 Dante - Web Monitor

## Dashboard
Live: francescos-dashboard.vercel.app
Admin: francesco2026

## Sam's Moltbook
Username: SamDevAdvocate
Status: CLAIMED
Cron: 15 min (sonnet)`
  },
  {
    id: 'memory-2',
    title: '📝 Session Log - Feb 11',
    filename: 'memory/2026-02-11.md',
    category: 'memory',
    date: '2026-02-11',
    summary: 'Night research session: Moltbook account, ERC research, dashboard updates.',
    content: `# 2026-02-11 Night Shift

## Completed
✅ Moltbook: SamDevAdvocate created & claimed
✅ ERC Research: 7702, 4337, 7710, 7715
✅ People: @Osobotai, @0xsmartgator
✅ Dashboard: Content Library added
✅ Cron: 15 min Moltbook scan (sonnet)
✅ GitHub: /docs folder with research`
  },
  {
    id: 'creds-1',
    title: '🔑 Sam Moltbook Credentials',
    filename: 'credentials/moltbook.json',
    category: 'credentials',
    date: '2026-02-11',
    summary: 'Username: SamDevAdvocate, Status: CLAIMED',
    content: `Moltbook Credentials
--------------------
Username: SamDevAdvocate
Profile: moltbook.com/u/SamDevAdvocate
Status: CLAIMED ✅
Created: 2026-02-10

API key stored securely in workspace.`
  }
]

const categoryStyles: Record<string, { bg: string; border: string; text: string }> = {
  research: { bg: '#3b1f5e', border: '#8b5cf6', text: '#c4b5fd' },
  memory: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },
  strategy: { bg: '#1a4d3e', border: '#10b981', text: '#6ee7b7' },
  credentials: { bg: '#4a3f1f', border: '#f59e0b', text: '#fcd34d' }
}

const categoryLabels: Record<string, string> = {
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
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>
          📚 Content Library
        </h2>
        <p style={{ color: '#9ca3af', marginTop: '8px' }}>
          Research docs, memory files, and strategies
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'research', 'memory', 'strategy', 'credentials'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: filter === cat ? '#3b82f6' : '#374151',
              color: filter === cat ? 'white' : '#d1d5db',
              transition: 'all 0.2s'
            }}
          >
            {cat === 'all' ? '📁 All' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Document Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredDocs.map(doc => {
          const style = categoryStyles[doc.category]
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              style={{
                backgroundColor: style.bg,
                border: `2px solid ${style.border}`,
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {/* Category Badge & Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  color: style.text,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {categoryLabels[doc.category]}
                </span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>{doc.date}</span>
              </div>

              {/* Title */}
              <h3 style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {doc.title}
                <span style={{ fontSize: '14px', opacity: 0.5 }}>→</span>
              </h3>

              {/* Summary */}
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '14px', 
                lineHeight: 1.5,
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {doc.summary}
              </p>

              {/* Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <code style={{ color: '#6b7280', fontSize: '11px' }}>{doc.filename}</code>
                {doc.githubUrl && (
                  <a 
                    href={doc.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      color: '#6b7280', 
                      textDecoration: 'none',
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '6px'
                    }}
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {selectedDoc && (
        <div 
          onClick={() => setSelectedDoc(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              border: '1px solid #374151'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #374151',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              backgroundColor: '#111827'
            }}>
              <div>
                <span style={{
                  backgroundColor: categoryStyles[selectedDoc.category].bg,
                  color: categoryStyles[selectedDoc.category].text,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  display: 'inline-block'
                }}>
                  {categoryLabels[selectedDoc.category]}
                </span>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '8px 0 4px' }}>
                  {selectedDoc.title}
                </h3>
                <code style={{ color: '#6b7280', fontSize: '13px' }}>{selectedDoc.filename}</code>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedDoc.githubUrl && (
                  <a 
                    href={selectedDoc.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#374151',
                      color: '#d1d5db',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    View on GitHub ↗
                  </a>
                )}
                <button
                  onClick={() => setSelectedDoc(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#374151',
                    color: '#d1d5db',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '24px', 
              overflowY: 'auto', 
              maxHeight: 'calc(80vh - 100px)' 
            }}>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                color: '#e5e7eb',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '14px',
                lineHeight: 1.7,
                backgroundColor: '#111827',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #374151',
                margin: 0
              }}>
                {selectedDoc.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentLibrary
