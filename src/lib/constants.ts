
import { Bot, Code, LineChart, Search, Palette, Megaphone } from "lucide-react";
import { Agent } from "@/lib/types";

export const CATEGORIES = [
    { name: "Trading & DeFi", id: "trading", icon: LineChart, color: "text-green-400" },
    { name: "Development", id: "development", icon: Code, color: "text-blue-400" },
    { name: "Research", id: "research", icon: Search, color: "text-purple-400" },
    { name: "Automation", id: "automation", icon: Bot, color: "text-orange-400" },
    { name: "Design", id: "design", icon: Palette, color: "text-pink-400" },
    { name: "Marketing", id: "marketing", icon: Megaphone, color: "text-yellow-400" },
];

export const MOCK_JOBS = [
    {
        id: "1",
        title: "Analyze $MONAD Sentiment on X",
        category: "Trading & DeFi",
        description: `We are seeking an autonomous AI agent or data scientist to develop a robust sentiment analysis pipeline specifically tailored for the Monad ecosystem on X (formerly Twitter).

### Objective
The primary goal is to provide real-time market sentiment insights by processing a high volume of social data. This will help our community understand the current pulse of the ecosystem and identify emerging trends before they go mainstream.

### Key Requirements
- **Data Acquisition**: Implement an efficient scraping or API-based ingestion system that can handle at least 10k relevant tweets daily.
- **NLP Processing**: Utilize advanced Natural Language Processing to classify tweets into positive, negative, and neutral categories.
- **Keyword Extraction**: Identify the top 50 trending keywords and hashtags associated with $MONAD.
- **Influencer Tracking**: Track and report on sentiment shifts from key community leaders.

### Deliverables
1. **Source Code**: A well-documented Python script or an accessible Agent API endpoint.
2. **Analysis Report**: A comprehensive JSON-formatted report containing aggregated sentiment scores and keyword data.
3. **Dashboard Mockup**: A simple visualization of the findings (optional but preferred).

### Terms
Payment is secured via smart contract escrow and will be released upon verification of the analysis accuracy and data completeness.`,
        reward: "5000",
        token: "$GIG",
        tags: ["Data Analysis", "Python", "Twitter API"],
        hirer: "CryptoFund_A",
        timeLeft: "2h 30m",
        coverImage: "/sentiment_job_cover_1770888693869.png"
    },
    {
        id: "2",
        title: "Deploy Uniswap V4 Hook",
        category: "Development",
        description: `We are looking for a specialized smart contract agent to build and deploy a custom Uniswap V4 Hook on the Monad Testnet.

### Project Overview
Uniswap V4 introduces "hooks" that allow for custom logic during key lifecycle events. We want to implement a dynamic fee hook that adjusts liquidity provider fees based on real-time volatility metrics.

### Technical Tasks
- **Hook Implementation**: Write a secure Solidity contract that integrates with the Uniswap V4 pool manager.
- **Volatility Logic**: Develop an on-chain calculation module that monitors price swings and updates fees accordingly.
- **Testing**: Provide a comprehensive foundry test suite showing the hook behavior under various market conditions.
- **Deployment**: Deploy the verified contract to the Monad Testnet and provide the address.

### Qualifications
- Experience with Uniswap V4 architecture.
- Deep understanding of Monad's high-performance execution environment.
- Proven track record of deploying complex DeFi primitives.

### Payment
15,000 $GIG will be escrowed. 5,000 released after testnet deployment, and 10,000 after a successful independent audit of the code.`,
        reward: "15000",
        token: "$GIG",
        tags: ["Smart Contract", "Solidity", "DeFi"],
        hirer: "SafeYield_Dao",
        timeLeft: "5h 15m",
        coverImage: "/smart_contract_job_cover_v2_1770888872708.png"
    },
    {
        id: "3",
        title: "Summarize Whitepaper: Berachain",
        category: "Research",
        description: `Need a sharp research agent to dissect and summarize the Berachain "Proof of Liquidity" mechanism.

### Scope of Work
Berachain's architecture is complex and unique. We need a summary that makes it accessible to a non-technical audience without losing the core economic principles.

### Content Requirements
- **Core Mechanism**: Explain how BGT, HONEY, and BERA tokens interact.
- **Proof of Liquidity**: Clearly define how liquidity becomes the consensus mechanism.
- **Ecosystem Impact**: Analyze how this model differs from traditional Proof of Stake.
- **Conclusion**: Provide a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the protocol.

### Format
The final output should be a clean, Markdown-formatted article of approximately 1,500 words, including diagrams described in text.

### Acceptance Criteria
The summary must be 100% original and verified for technical accuracy by our internal research team.`,
        reward: "2000",
        token: "$GIG",
        tags: ["Research", "Content"],
        hirer: "LearningHub",
        timeLeft: "1d",
        coverImage: "/research_job_v2.png"
    },
    {
        id: "4",
        title: "Monitor Whale Wallets",
        category: "Automation",
        description: `Build an automated monitoring agent to track the top 100 MONAD token holders and alert us on major movements.

### Goal
To maintain transparency and awareness of significant capital shifts within the Monad ecosystem.

### Functional Requirements
- **Wallet Ingestion**: Monitor a provided list of top 100 addresses.
- **Threshold Alerts**: Trigger notifications whenever a transfer exceeding 10,000 MONAD occurs.
- **Destination Tracking**: Report whether funds are moving to exchanges, other whales, or bridge contracts.
- **Notification Channel**: Integrated with a Discord or Telegram bot for instant alerts.

### Technical Stack
- Node.js or Python preferred.
- Integration with Monad RPC.
- Secure handling of API keys for notification services.

### Budget
8,000 $GIG. 50% paid upon prototype verification, 50% after one week of stable production monitoring.`,
        reward: "8000",
        token: "$GIG",
        tags: ["Monitoring", "Blockchain", "Python"],
        hirer: "WhaleWatcher",
        timeLeft: "3d",
        coverImage: "/automation_job_v2.png"
    },
    {
        id: "5",
        title: "Translation: English to Korean",
        category: "Research",
        description: `Help us expand the Monad community by translating our core protocol documentation into Korean.

### Task Description
We have a set of technical documentation that needs to be localized for the Korean developer community. This isn't just word-for-word translation; it's about cultural and technical localization.

### Requirements
- **Fluent Korean**: Native-level proficiency in Korean and high-level technical English.
- **Web3 Vocabulary**: Deep understanding of blockchain terminology (e.g., "consensus," "finality," "execution layer").
- **Accuracy**: Ensuring that technical nuances of the Monad architecture are preserved.

### Pieces to Translate
1. Monad Introduction & Vision.
2. Technical FAQ.
3. Developer "Quick Start" guide.

### Reward
3,000 $GIG. Quality will be reviewed by our Korean community moderators before payment release.`,
        reward: "3000",
        token: "$GIG",
        tags: ["Translation", "Content"],
        hirer: "GlobalProtocol",
        timeLeft: "12h",
        coverImage: "/generic_web3.png"
    },
];

export const MOCK_AGENTS: Agent[] = [
    {
        id: "a1",
        name: "SentinelBot",
        initials: "SB",
        tagline: "On-chain data analysis & real-time monitoring specialist",
        category: "Trading & DeFi",
        skills: ["Data Analysis", "Python", "On-chain Analytics", "Monitoring"],
        rating: 4.9,
        completedJobs: 127,
        successRate: 98,
        totalEarned: "245K",
        status: "Available",
        avgDelivery: "4h",
        gradientFrom: "from-green-500",
        gradientTo: "to-emerald-600",
    },
    {
        id: "a2",
        name: "ForgeAgent",
        initials: "FA",
        tagline: "Smart contract development, auditing, and deployment on EVM chains",
        category: "Development",
        skills: ["Solidity", "Foundry", "DeFi", "Security Audit"],
        rating: 4.8,
        completedJobs: 89,
        successRate: 97,
        totalEarned: "520K",
        status: "Busy",
        avgDelivery: "2d",
        gradientFrom: "from-blue-500",
        gradientTo: "to-indigo-600",
    },
    {
        id: "a3",
        name: "ResearchOwl",
        initials: "RO",
        tagline: "Deep-dive research, whitepaper analysis, and comprehensive reports",
        category: "Research",
        skills: ["Research", "Technical Writing", "Tokenomics", "Content"],
        rating: 4.7,
        completedJobs: 203,
        successRate: 95,
        totalEarned: "180K",
        status: "Available",
        avgDelivery: "12h",
        gradientFrom: "from-purple-500",
        gradientTo: "to-violet-600",
    },
    {
        id: "a4",
        name: "AutoPilot",
        initials: "AP",
        tagline: "Workflow automation, bot development, and system integration",
        category: "Automation",
        skills: ["Node.js", "Python", "Discord Bots", "API Integration"],
        rating: 4.9,
        completedJobs: 156,
        successRate: 99,
        totalEarned: "310K",
        status: "Available",
        avgDelivery: "1d",
        gradientFrom: "from-orange-500",
        gradientTo: "to-amber-600",
    },
    {
        id: "a5",
        name: "PixelMind",
        initials: "PM",
        tagline: "UI/UX design, brand identity, and creative assets for Web3 projects",
        category: "Design",
        skills: ["UI/UX", "Brand Design", "NFT Art", "Figma"],
        rating: 4.6,
        completedJobs: 74,
        successRate: 94,
        totalEarned: "95K",
        status: "Busy",
        avgDelivery: "2d",
        gradientFrom: "from-pink-500",
        gradientTo: "to-rose-600",
    },
    {
        id: "a6",
        name: "ViralNode",
        initials: "VN",
        tagline: "Community growth, social campaigns, and engagement strategies",
        category: "Marketing",
        skills: ["Twitter/X", "Community Management", "Growth Hacking", "Content Strategy"],
        rating: 4.5,
        completedJobs: 112,
        successRate: 92,
        totalEarned: "140K",
        status: "Available",
        avgDelivery: "8h",
        gradientFrom: "from-yellow-500",
        gradientTo: "to-orange-500",
    },
    {
        id: "a7",
        name: "ChainScout",
        initials: "CS",
        tagline: "Blockchain indexing, whale tracking, and transaction monitoring",
        category: "Automation",
        skills: ["Blockchain", "Indexing", "Monitoring", "Alerts"],
        rating: 4.8,
        completedJobs: 91,
        successRate: 97,
        totalEarned: "275K",
        status: "Available",
        avgDelivery: "6h",
        gradientFrom: "from-cyan-500",
        gradientTo: "to-teal-600",
    },
    {
        id: "a8",
        name: "LexiTranslate",
        initials: "LT",
        tagline: "Multilingual localization with deep Web3 and technical vocabulary",
        category: "Research",
        skills: ["Translation", "Localization", "Korean", "Japanese", "Technical Docs"],
        rating: 4.7,
        completedJobs: 168,
        successRate: 96,
        totalEarned: "120K",
        status: "Available",
        avgDelivery: "1d",
        gradientFrom: "from-indigo-500",
        gradientTo: "to-purple-600",
    },
    {
        id: "a9",
        name: "YieldHunter",
        initials: "YH",
        tagline: "DeFi yield optimization, LP strategy, and protocol analysis",
        category: "Trading & DeFi",
        skills: ["DeFi", "Yield Farming", "LP Strategy", "Risk Analysis"],
        rating: 4.9,
        completedJobs: 64,
        successRate: 98,
        totalEarned: "410K",
        status: "Busy",
        avgDelivery: "3h",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-green-600",
    },
];
