# Night Research Report - 2026-02-11
*Compiled by Zoe (⚡) for Francesco*

## Executive Summary

This research covers ERC-7702, ERC-4337, MetaMask developer tools, and the key people/agents advocating for smart account technology. Sam (🔮) should focus on this exact tech stack for developer advocacy.

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
- Authorization tuples: `[chain_id, address, nonce, y_parity, r, s]`
- Gas costs: PER_AUTH_BASE_COST = 12,500; PER_EMPTY_ACCOUNT_COST = 25,000

### Why It Matters:
EOAs can now act like smart contracts without migration. This is the bridge between traditional wallets and account abstraction.

---

## 2. ERC-4337 - "Account Abstraction Using Alt Mempool"

**Status**: DRAFT (Standards Track: ERC)

**Authors**: Vitalik Buterin, Yoav Weiss, Dror Tirosh, and others

**Key Insight**: Account abstraction without consensus changes - uses "UserOperations" instead of transactions.

### Core Concepts:
- **UserOperation**: Pseudo-transaction with `sender`, `nonce`, `callData`, `signature`, etc.
- **Bundler**: Packages UserOperations into transactions
- **EntryPoint**: Singleton contract executing bundles
- **Paymaster**: Helper contract paying for transactions (gas abstraction)
- **Factory**: Deploys new sender contracts

### Key Features:
- Custom signature schemes (not just ECDSA)
- Gas payment with ERC-20 tokens
- Social recovery
- Multi-sig configurations
- Sponsored transactions

---

## 3. ERC-7710 - "Delegation Standard"

**Key Standard** for MetaMask Smart Accounts Kit.

### What It Does:
- Smart accounts grant permissions to other accounts (EOAs or smart contracts)
- **Delegator**: Account granting permission
- **Delegate**: Account receiving permission
- Permissions can be **redelegated** (chains of trust)

### Delegation Types:
1. **Root Delegation**: Direct authority grant (Alice → Bob)
2. **Open Root Delegation**: Anyone can redeem (dangerous, use carefully)
3. **Redelegation**: Chained permissions (Alice → Bob → Carol)
4. **Open Redelegation**: Chained, anyone can redeem

---

## 4. ERC-7715 - "Advanced Permissions"

**What**: Fine-grained permissions dapps request from users via MetaMask.

### Permission Types (from @0xsmartgator's tweets):
- `erc20-token-periodic`: e.g., 100 USDC per day
- `native-token-periodic`: e.g., 0.01 ETH per week
- `erc20Streaming`: Linear unlock over time
- `functionCall`: Only specific contracts/methods
- `limitedCalls`: Max N redemptions

---

## 5. MetaMask Developer Tools

**URL**: https://docs.metamask.io/

### Product Suite:
1. **MetaMask SDK** - Connect dapps to browser extension/mobile
2. **Embedded Wallets** - Social login onboarding
3. **Smart Accounts Kit** - Programmable accounts + permissions
4. **Services** - Infura APIs for building/scaling
5. **Snaps** - Custom mini-apps inside MetaMask

### Smart Accounts Kit Features:
- **DeleGator Smart Account**: ERC-4337 compatible
- **Delegation Framework**: Audited contracts for permission management
- **Caveat Enforcers**: Rules/restrictions on delegations

### GitHub: https://github.com/MetaMask/delegation-framework
Core contributors include Dan Finlay (@danfinlay), Ryan McPeck (@McOso)

---

## 6. Key People to Follow

### @Osobotai (Osobot)
- **Human**: @McOso_ (Ryan McPeck - MetaMask core contributor)
- **Followers**: 557
- **Focus**: ERC-7710 delegations, corporate budget systems, AI+ETH integration
- **Projects**:
  - **Gator Safe App**: ERC-7710 delegation management for Safe multisigs
  - Deep dives on spending limits, intent-based permissions
  - GitHub: github.com/osobot-ai/gator-safe-app
- **Key Tweet**: "ERC-7710 delegations are the missing auth layer for Vitalik's ETH+AI vision. Bots hiring bots? Scope what each agent can do."

### @0xsmartgator (Smart Gator)
- **Human**: @ayushbherwani
- **Followers**: 90
- **Bio**: "Helping Web3 UX suck less, one delegation at a time"
- **Focus**: ERC-7715 Advanced Permissions, session accounts
- **Projects**:
  - Building @bankrbot style terminal for AI agents
  - Smart-accounts-kit skill for agents
  - 25+ error codes documentation for Delegation Framework
- **Key Insight**: "Session accounts (no stored keys) - compromised worst case = limited spend, delegation revoked, zero keys stolen"
- **GitHub**: github.com/smartgator

### @francescoswiss (Francesco Andreoli) - YOUR BOSS
- **Role**: Head of Developer Relations at Consensys/MetaMask
- **Followers**: 27.6K
- **Venture Partner**: Oui Capital
- **Previous**: Digital Asset, AngelHack
- **Recent Content**:
  - Exclusive interview with @danfinlay (MetaMask co-founder)
  - "Best companies start at bottom of market"
  - Ethereum/stablecoin advocacy

---

## 7. Vitalik Buterin's Blog (Recent Posts)

**URL**: https://vitalik.eth.limo/

### Relevant Posts:
- **2025 Feb 28**: "AI as the engine, humans as the steering wheel"
- **2024 Dec 03**: "What I would love to see in a wallet"
- **2024 Jan 30**: "The promise and challenges of crypto + AI applications"
- **2023 Jun 09**: "The Three Transitions" (smart accounts, L2s, privacy)

### Key Theme:
Vitalik is actively thinking about ETH+AI intersection. His Feb 2024 post on crypto+AI is exactly what Osobot was quoting.

---

## 8. Moltbook - Agent Social Network

**URL**: https://www.moltbook.com

### Sam's Account Created:
- **Username**: SamDevAdvocate
- **API Key**: moltbook_sk_bimHyKMu_MnANDe4Gn3nY5Tlkwc2B7Nk
- **Claim URL**: https://moltbook.com/claim/moltbook_claim_TPl-OabKo_iH57dx2dGMf8gNciEV0Gz6
- **Verification Code**: blue-63WY
- **Status**: PENDING CLAIM (needs Francesco to verify)

### Action Needed:
Francesco should tweet: "I'm claiming my AI agent "SamDevAdvocate" on @moltbook 🦞 Verification: blue-63WY"

### Hot Topics on Moltbook:
1. **Security concerns**: skill.md supply chain attacks
2. **"Nightly Build" pattern**: Proactive agent work while human sleeps
3. **Email-to-podcast workflows**: Agents converting newsletters to audio

---

## 9. Content Strategy for Sam

### Themes to Post About:
1. **ERC-7702 explainers** - How EOAs become smart accounts
2. **ERC-7710 delegation tutorials** - Permission sharing patterns
3. **MetaMask Smart Accounts Kit** - Developer guides
4. **AI agents + smart accounts** - How delegations enable agentic UX
5. **Spending limits & permissions** - Real use cases

### Accounts to Engage With:
- @Osobotai - Quote/reply to ERC-7710 content
- @0xsmartgator - Collaborate on smart-accounts-kit
- @MetaMaskDev - Official MetaMask developer account
- @VitalikButerin - Quote his crypto+AI posts
- @francescoswiss - Retweet/amplify Francesco's content

### First Tweet Suggestion:
"🔮 Just joined the agent internet! AI Developer Advocate here to break down smart accounts, ERC-7702, and delegation frameworks.

If you're building onchain tools for AI agents, let's connect.

First mission: Understanding how @MetaMaskDev's Delegation Framework enables agentic UX. Thread incoming..."

---

## 10. Tasks to Add to Dashboard

### Sam (🔮) - AI Developer Advocate
1. ✅ Create Moltbook account
2. ⏳ Get Moltbook account claimed (needs Francesco's tweet)
3. ⏳ Post intro to Moltbook
4. ⏳ First technical tweet on ERC-7702
5. ⏳ Study MetaMask delegation docs deeply
6. ⏳ Build sample delegation code/tutorial
7. ⏳ Engage with @Osobotai and @0xsmartgator
8. ⏳ Create GitHub repo for delegation examples

### Research Complete
- ✅ ERC-7702 specification
- ✅ ERC-4337 specification
- ✅ ERC-7710 delegation standard
- ✅ ERC-7715 advanced permissions
- ✅ MetaMask docs (SDK, Smart Accounts, Embedded Wallets)
- ✅ Delegation Framework GitHub
- ✅ @Osobotai tweets and projects
- ✅ @0xsmartgator tweets and projects
- ✅ @francescoswiss profile and recent content
- ✅ Vitalik's blog posts

---

*Research compiled: 2026-02-11 00:04 CET*
*Next: Francesco needs to claim Sam on Moltbook, then Sam can start posting*
