// ==========================================
// MCP SERVER MARKETPLACE DATA
// Curated from mcpservers.org
// ==========================================

export type MCPCategory = 
  | 'search' | 'web-scraping' | 'communication' | 'productivity' 
  | 'development' | 'database' | 'cloud-service' | 'file-system' 
  | 'cloud-storage' | 'version-control' | 'ai-tools' | 'security' | 'other';

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: MCPCategory;
  isOfficial: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isRemote: boolean;
  author: string;
  url: string;
  stars: number;
  tools: number;
  color: string;
  icon: string; // emoji for display
  tags: string[];
}

export const MCP_CATEGORIES: { key: MCPCategory; label: string; emoji: string; color: string }[] = [
  { key: 'search', label: 'Search', emoji: '🔍', color: '#06B6D4' },
  { key: 'web-scraping', label: 'Web Scraping', emoji: '🕷️', color: '#8B5CF6' },
  { key: 'communication', label: 'Communication', emoji: '💬', color: '#10B981' },
  { key: 'productivity', label: 'Productivity', emoji: '⚡', color: '#F59E0B' },
  { key: 'development', label: 'Development', emoji: '💻', color: '#3B82F6' },
  { key: 'database', label: 'Database', emoji: '🗄️', color: '#EF4444' },
  { key: 'cloud-service', label: 'Cloud Service', emoji: '☁️', color: '#14B8A6' },
  { key: 'file-system', label: 'File System', emoji: '📁', color: '#F97316' },
  { key: 'cloud-storage', label: 'Cloud Storage', emoji: '💾', color: '#6366F1' },
  { key: 'version-control', label: 'Version Control', emoji: '🔀', color: '#EC4899' },
  { key: 'ai-tools', label: 'AI Tools', emoji: '🤖', color: '#A855F7' },
  { key: 'security', label: 'Security', emoji: '🛡️', color: '#F43F5E' },
  { key: 'other', label: 'Other', emoji: '📦', color: '#64748B' },
];

export const ALL_MCP_SERVERS: MCPServer[] = [
  // === OFFICIAL FEATURED ===
  {
    id: 'github-mcp', name: 'GitHub', description: "GitHub's official MCP Server for repository management, issues, PRs, and code search.",
    category: 'version-control', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'GitHub', url: 'https://github.com/github/github-mcp-server', stars: 12400, tools: 18, color: '#24292F', icon: '🐙', tags: ['git', 'repos', 'issues', 'prs'],
  },
  {
    id: 'firecrawl-mcp', name: 'Firecrawl', description: 'Powerful web scraping, crawling, and search capabilities for LLM clients like Cursor and Claude.',
    category: 'web-scraping', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Firecrawl', url: 'https://github.com/firecrawl/firecrawl-mcp-server', stars: 8900, tools: 12, color: '#FF6B35', icon: '🔥', tags: ['scraping', 'crawl', 'search', 'web'],
  },
  {
    id: 'playwright-mcp', name: 'Playwright', description: 'Browser automation and testing MCP server by Microsoft for web interactions.',
    category: 'development', isOfficial: true, isFeatured: true, isNew: false, isRemote: false,
    author: 'Microsoft', url: 'https://github.com/microsoft/playwright-mcp', stars: 7800, tools: 15, color: '#2EAD33', icon: '🎭', tags: ['browser', 'testing', 'automation'],
  },
  {
    id: 'cloudflare-mcp', name: 'Cloudflare', description: 'Deploy, configure & interrogate resources on the Cloudflare developer platform (Workers/KV/R2/D1).',
    category: 'cloud-service', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Cloudflare', url: 'https://github.com/cloudflare/mcp-server-cloudflare', stars: 5200, tools: 22, color: '#F6821F', icon: '☁️', tags: ['workers', 'kv', 'r2', 'd1'],
  },
  {
    id: 'supabase-mcp', name: 'Supabase', description: 'Connects to Supabase platform for database, auth, edge functions and more.',
    category: 'database', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Supabase', url: 'https://github.com/supabase-community/supabase-mcp', stars: 4800, tools: 16, color: '#3ECF8E', icon: '⚡', tags: ['postgres', 'auth', 'storage', 'realtime'],
  },
  {
    id: 'context7-mcp', name: 'Context7', description: 'Up-to-date documentation for any Cursor prompt. Always fresh, always relevant.',
    category: 'development', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Upstash', url: 'https://github.com/upstash/context7-mcp', stars: 6100, tools: 4, color: '#00E9A3', icon: '📚', tags: ['docs', 'context', 'cursor'],
  },
  {
    id: 'exa-mcp', name: 'Exa', description: 'Search Engine made for AIs. Neural search with high-quality, structured results.',
    category: 'search', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Exa Labs', url: 'https://github.com/exa-labs/exa-mcp-server', stars: 5500, tools: 6, color: '#6366F1', icon: '🔮', tags: ['search', 'neural', 'ai-native'],
  },
  {
    id: 'google-mcp', name: 'Google MCP', description: "Collection of Google's official MCP servers for Maps, Drive, Calendar, and more.",
    category: 'cloud-service', isOfficial: true, isFeatured: true, isNew: false, isRemote: true,
    author: 'Google', url: 'https://github.com/google/mcp', stars: 9200, tools: 30, color: '#4285F4', icon: '🔷', tags: ['maps', 'drive', 'calendar', 'gmail'],
  },
  // === OFFICIAL NON-FEATURED ===
  {
    id: 'browserbase-mcp', name: 'Browserbase', description: 'Automate browser interactions in the cloud (web navigation, data extraction, form filling).',
    category: 'web-scraping', isOfficial: true, isFeatured: false, isNew: false, isRemote: true,
    author: 'Browserbase', url: 'https://github.com/browserbase/mcp-server-browserbase', stars: 3400, tools: 8, color: '#FF4F00', icon: '🌐', tags: ['browser', 'cloud', 'automation'],
  },
  {
    id: 'e2b-mcp', name: 'E2B', description: 'Run code in secure sandboxes hosted by E2B. Safe execution environment for AI agents.',
    category: 'development', isOfficial: true, isFeatured: false, isNew: false, isRemote: true,
    author: 'E2B', url: 'https://github.com/e2b-dev/mcp-server', stars: 3100, tools: 5, color: '#FF8800', icon: '📦', tags: ['sandbox', 'code-execution', 'safe'],
  },
  {
    id: 'chrome-devtools-mcp', name: 'Chrome DevTools', description: 'Control and inspect a live Chrome browser from your coding agent (Gemini, Claude, Cursor).',
    category: 'development', isOfficial: true, isFeatured: false, isNew: false, isRemote: false,
    author: 'Chrome', url: 'https://github.com/nicollely/chrome-devtools-mcp', stars: 4200, tools: 10, color: '#4285F4', icon: '🔧', tags: ['chrome', 'devtools', 'inspect'],
  },
  {
    id: 'anki-mcp', name: 'Anki MCP', description: 'Interact with Anki spaced repetition flashcard application from AI assistants.',
    category: 'productivity', isOfficial: true, isFeatured: false, isNew: false, isRemote: false,
    author: 'Anki MCP', url: 'https://github.com/anki-mcp/anki-mcp-desktop', stars: 1200, tools: 8, color: '#235390', icon: '🃏', tags: ['flashcards', 'learning', 'spaced-repetition'],
  },
  {
    id: 'minimax-mcp', name: 'MiniMax MCP', description: "Interact with MiniMax's TTS, image, and video generation APIs.",
    category: 'ai-tools', isOfficial: true, isFeatured: false, isNew: false, isRemote: true,
    author: 'MiniMax AI', url: 'https://github.com/minimax-ai/minimax-mcp', stars: 2800, tools: 7, color: '#6C5CE7', icon: '🎙️', tags: ['tts', 'image-gen', 'video'],
  },
  {
    id: 'nextjs-devtools-mcp', name: 'Next.js DevTools', description: 'Next.js development tools and utilities for AI coding assistants.',
    category: 'development', isOfficial: true, isFeatured: false, isNew: true, isRemote: false,
    author: 'Vercel', url: 'https://github.com/vercel/next-devtools-mcp', stars: 3900, tools: 9, color: '#000000', icon: '▲', tags: ['nextjs', 'vercel', 'devtools'],
  },
  {
    id: 'deepwiki-mcp', name: 'DeepWiki', description: 'Remote, no-auth MCP server providing AI-powered codebase context and answers.',
    category: 'development', isOfficial: true, isFeatured: false, isNew: true, isRemote: true,
    author: 'Devin', url: 'https://github.com/devin/deepwiki', stars: 2600, tools: 5, color: '#00D4AA', icon: '📖', tags: ['codebase', 'context', 'docs'],
  },
  {
    id: 'proxyman-mcp', name: 'Proxyman MCP', description: 'Inspect HTTP traffic, create debugging rules, and control Proxyman via natural language.',
    category: 'development', isOfficial: true, isFeatured: false, isNew: false, isRemote: false,
    author: 'Proxyman', url: 'https://docs.proxyman.com/mcp', stars: 1800, tools: 6, color: '#4A90D9', icon: '🔍', tags: ['http', 'debug', 'proxy'],
  },
  // === COMMUNITY / NEW ===
  {
    id: 'notebooklm-mcp', name: 'NotebookLM MCP', description: 'Chat directly with NotebookLM for zero-hallucination answers based on your own notebooks.',
    category: 'ai-tools', isOfficial: false, isFeatured: false, isNew: true, isRemote: true,
    author: 'PleasPrompto', url: 'https://github.com/pleaseprompto/notebooklm-mcp', stars: 1500, tools: 4, color: '#FBBC04', icon: '📓', tags: ['notebooklm', 'google', 'rag'],
  },
  {
    id: 'xcodebuild-mcp', name: 'XcodeBuild MCP', description: 'Tools for agents working on iOS and macOS projects — build, test, deploy.',
    category: 'development', isOfficial: false, isFeatured: false, isNew: true, isRemote: false,
    author: 'Cameron Cooke', url: 'https://github.com/cameroncooke/xcodebuildmcp', stars: 980, tools: 11, color: '#147EFB', icon: '🍎', tags: ['xcode', 'ios', 'macos', 'swift'],
  },
  {
    id: 'airtable-mcp', name: 'Airtable', description: 'Database and operations layer for your agents — product, marketing, sales, ops, HR, or custom apps.',
    category: 'database', isOfficial: false, isFeatured: false, isNew: true, isRemote: true,
    author: 'Airtable', url: 'https://github.com/airtable/skills', stars: 2200, tools: 14, color: '#18BFFF', icon: '📊', tags: ['database', 'spreadsheet', 'automation'],
  },
  {
    id: 'bright-data-mcp', name: 'Bright Data', description: 'Discover, extract, and interact with the web — one interface powering automated access.',
    category: 'web-scraping', isOfficial: false, isFeatured: true, isNew: false, isRemote: true,
    author: 'Bright Data', url: 'https://get.brightdata.com/mcpservers', stars: 4100, tools: 10, color: '#FF6B6B', icon: '💡', tags: ['proxy', 'scraping', 'data'],
  },
  {
    id: 'alpha-vantage-mcp', name: 'Alpha Vantage', description: 'Access financial market data: realtime & historical stock, ETF, options, forex, crypto, and more.',
    category: 'other', isOfficial: false, isFeatured: true, isNew: false, isRemote: true,
    author: 'Alpha Vantage', url: 'https://mcp.alphavantage.co', stars: 3200, tools: 20, color: '#7B68EE', icon: '📈', tags: ['finance', 'stocks', 'crypto', 'forex'],
  },
  {
    id: 'evlek-mcp', name: 'Evlek MCP', description: 'AI-native property MCP for North Cyprus — 9 tools, live data, hosted, no auth required.',
    category: 'other', isOfficial: false, isFeatured: false, isNew: true, isRemote: true,
    author: 'Evlek', url: 'https://github.com/evlek/evlek-mcp', stars: 320, tools: 9, color: '#2DD4BF', icon: '🏠', tags: ['property', 'real-estate'],
  },
  {
    id: 'nexus-agent-mcp', name: 'NEXUS Agent', description: 'Live crypto prices, Reddit sentiment, DeFi TVL, stock prices. Pay per call via x402.',
    category: 'ai-tools', isOfficial: false, isFeatured: false, isNew: true, isRemote: true,
    author: 'Riley Craig', url: 'https://github.com/rileycraig14/nexus-agent', stars: 450, tools: 8, color: '#00D4FF', icon: '🔗', tags: ['crypto', 'defi', 'sentiment'],
  },
  {
    id: 'coinrebate-mcp', name: 'CoinRebate', description: 'Crypto exchange fee optimization with permanent 20-40% rebates for AI agents.',
    category: 'other', isOfficial: false, isFeatured: false, isNew: true, isRemote: true,
    author: 'SKHeman', url: 'https://github.com/skheman2026/coinrebate', stars: 180, tools: 5, color: '#FFD700', icon: '🪙', tags: ['crypto', 'exchange', 'rebate'],
  },
];

export const TOTAL_MCP_SERVERS = ALL_MCP_SERVERS.length;
export const TOTAL_OFFICIAL = ALL_MCP_SERVERS.filter(s => s.isOfficial).length;
export const TOTAL_REMOTE = ALL_MCP_SERVERS.filter(s => s.isRemote).length;
export const TOTAL_TOOLS = ALL_MCP_SERVERS.reduce((sum, s) => sum + s.tools, 0);
